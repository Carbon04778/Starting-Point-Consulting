/**
 * Proves the insert-only write path works, and that it genuinely cannot read.
 *
 * NON-DESTRUCTIVE BY DESIGN. `csa_acceptances` is an evidence table with no
 * DELETE policy for anyone — rows are permanent on purpose. So this script
 * must not write a test row, because there would be no way to remove it and
 * the acceptance log would carry a fake entry forever.
 *
 * Instead it sends a deliberately INVALID row and reads the failure:
 *
 *   HTTP 401            the sp_writer token was rejected  -> auth is broken
 *   HTTP 400 / 23502    a not-null constraint fired       -> auth WORKED, and
 *                       PostgREST got far enough to evaluate the row, which
 *                       is only possible if the role switch and the INSERT
 *                       policy both succeeded. Nothing was written.
 *
 * Then it confirms the same token cannot read, which is the property that
 * makes this path safer than the service-role key.
 *
 *   node scripts/check-write-path.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  console.error('check-write-path: no .env found.');
  process.exit(1);
}

for (const [, k, v] of readFileSync(envPath, 'utf8').matchAll(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/gm)) {
  process.env[k] ??= v.trim();
}

const missing = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_JWT_SECRET'].filter(
  (k) => !process.env[k],
);
if (missing.length) {
  console.error(`check-write-path: missing ${missing.join(', ')} in .env`);
  process.exit(1);
}

const { createHmac } = await import('node:crypto');
const url = process.env.PUBLIC_SUPABASE_URL.replace(/\/+$/, '');
const anon = process.env.PUBLIC_SUPABASE_ANON_KEY;
const ref = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1];

const b64 = (s) => Buffer.from(s).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const body = b64(
  JSON.stringify({ role: 'sp_writer', iss: 'supabase', ref, aud: 'authenticated', iat: now, exp: now + 60 }),
);
const sig = createHmac('sha256', process.env.SUPABASE_JWT_SECRET)
  .update(`${head}.${body}`)
  .digest('base64url');
const token = `${head}.${body}.${sig}`;

let failures = 0;
const line = (ok, label, detail) => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(52)} ${detail}`);
};

const call = (path, init, bearer) =>
  fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: anon,
      Authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

console.log('\nWrite path — sp_writer token\n');

// 1 · The token is accepted, and the INSERT policy lets the row be evaluated.
{
  const res = await call(
    'csa_acceptances',
    { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({}) },
    token,
  );
  const text = await res.text();
  let code = '';
  try {
    code = JSON.parse(text).code ?? '';
  } catch {
    /* ignore */
  }

  if (res.status === 401) {
    line(false, 'sp_writer token accepted by PostgREST', 'HTTP 401 — token rejected');
    console.log(
      '\n        The Legacy JWT Secret in .env does not match this project.\n' +
        '        Project Settings -> API -> JWT Settings -> Legacy JWT Secret.\n',
    );
  } else if (res.status === 400 && code === '23502') {
    line(true, 'sp_writer token accepted, INSERT reached', `HTTP 400 ${code} (not-null) — nothing written`);
  } else if (res.ok) {
    // Should be impossible: an empty row cannot satisfy the NOT NULLs.
    line(false, 'sp_writer insert of an empty row', `HTTP ${res.status} — A ROW WAS WRITTEN`);
  } else {
    line(false, 'sp_writer token accepted, INSERT reached', `HTTP ${res.status} ${code} ${text.slice(0, 90)}`);
  }
}

// 2 · The same token must not be able to read. This is the whole point.
for (const table of ['csa_acceptances', 'intake_submissions']) {
  const res = await call(`${table}?select=*&limit=1`, {}, token);
  let code = '';
  try {
    code = JSON.parse(await res.text()).code ?? '';
  } catch {
    /* ignore */
  }
  line(!res.ok, `sp_writer CANNOT read ${table}`, res.ok ? 'HTTP 200 — READABLE' : `HTTP ${res.status} ${code}`);
}

// 3 · And the browser key still cannot do either.
for (const table of ['csa_acceptances', 'intake_submissions']) {
  const res = await call(`${table}?select=*&limit=1`, {}, anon);
  line(!res.ok, `anon CANNOT read ${table}`, res.ok ? 'HTTP 200 — READABLE' : `HTTP ${res.status}`);
}

console.log(
  failures
    ? `\n${failures} check(s) failed.\n`
    : '\nWrite path works, and can only write. Nothing was written by this test.\n',
);
process.exit(failures ? 1 : 0);
