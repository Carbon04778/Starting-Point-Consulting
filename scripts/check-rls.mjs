/**
 * Proves the private tables are actually private.
 *
 * Darlene's requirement, verbatim:
 *   "Please make sure the intake submissions and Client Service Agreement
 *    records are accessible only through the authenticated/private admin side
 *    and aren't publicly accessible through the site or database/API."
 *
 * This script is the evidence for that sentence. It takes the PUBLIC anon key
 * — the one that ships in the browser, the one anybody who opens dev tools can
 * read — and tries to do exactly what an attacker would try: read the tables,
 * and forge rows in them. Every attempt must fail.
 *
 * A test that PASSES here means the attack FAILED. That is the point.
 *
 *   node scripts/check-rls.mjs
 *
 * Run it after any migration, and any time someone changes a policy.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  console.error('check-rls: no .env — copy .env.example and fill in the Supabase values.');
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
);

const URL_BASE = env.PUBLIC_SUPABASE_URL;
const ANON = env.PUBLIC_SUPABASE_ANON_KEY;

if (!URL_BASE || !ANON) {
  console.error('check-rls: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY must both be set.');
  process.exit(1);
}

const PRIVATE_TABLES = ['csa_acceptances', 'intake_submissions', 'admins'];

const headers = {
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  'Content-Type': 'application/json',
};

let failures = 0;

/** A blocked attempt is a pass. Anything that succeeds is a breach. */
function report(blocked, label, detail) {
  if (!blocked) failures++;
  console.log(`  ${blocked ? 'BLOCKED' : 'EXPOSED'}  ${label.padEnd(46)} ${detail}`);
}

async function attemptRead(table) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=*&limit=1`, { headers });
  const text = await res.text();

  if (res.ok) {
    // 200 means the table answered the public key at all. Even an empty array
    // is a failure here: the table should not be reachable, not merely empty.
    report(false, `anon reads ${table}`, `HTTP 200 — returned ${text.slice(0, 60)}`);
    return;
  }

  let code = '';
  try {
    code = JSON.parse(text).code ?? '';
  } catch {
    /* non-JSON error body is fine */
  }
  report(true, `anon reads ${table}`, `HTTP ${res.status}${code ? ` ${code}` : ''}`);
}

async function attemptForge(table, row) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });

  if (res.ok) {
    report(false, `anon forges a row in ${table}`, `HTTP ${res.status} — A ROW WAS WRITTEN`);
    return;
  }

  let code = '';
  try {
    code = JSON.parse(await res.text()).code ?? '';
  } catch {
    /* ignore */
  }
  report(true, `anon forges a row in ${table}`, `HTTP ${res.status}${code ? ` ${code}` : ''}`);
}

console.log('\nRLS — attacking the database with the public browser key\n');
console.log('  A "BLOCKED" line means the attack failed, which is what we want.\n');

for (const table of PRIVATE_TABLES) {
  await attemptRead(table);
}

console.log('');

// Forging a CSA acceptance is the attack that matters most: an acceptance log
// anyone can write to is not evidence of anything.
await attemptForge('csa_acceptances', {
  full_name: 'RLS test — should never be written',
  email: 'rls-test@example.invalid',
  service_id: 'rls-test',
  agreement_version: 'rls-test',
  agreement_hash: 'rls-test',
});

await attemptForge('intake_submissions', {
  full_name: 'RLS test — should never be written',
  email: 'rls-test@example.invalid',
});

/* ------------------------------------------------------------------ */
/* Migration 0002 — articles, site_photos, site-media                  */
/* ------------------------------------------------------------------ */
// These are PUBLIC-READ by design, so the tests differ: anon must be able to
// read, must see NO drafts, and must not be able to write anything at all.

console.log('\nCMS tables — public may read, never write, never see a draft\n');

async function expectRead(table, query, label) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?${query}`, { headers });
  const text = await res.text();
  if (!res.ok) {
    let code = '';
    try {
      code = JSON.parse(text).code ?? '';
    } catch {
      /* ignore */
    }
    // A missing table means 0002 has not been applied yet. Say so; neither a
    // pass nor a leak.
    if (code === 'PGRST205' || res.status === 404) {
      console.log(`  SKIPPED  ${label.padEnd(46)} table not found — apply supabase/migrations/0002_articles_and_photos.sql`);
      return null;
    }
    failures++;
    console.log(`  BROKEN   ${label.padEnd(46)} HTTP ${res.status} ${code} — the public read should work`);
    return null;
  }
  return JSON.parse(text);
}

const published = await expectRead('articles', 'select=status&limit=200', 'anon reads articles');
if (published) {
  const drafts = published.filter((r) => r.status !== 'published').length;
  report(
    drafts === 0,
    'anon sees no drafts',
    drafts ? `${drafts} DRAFT ROW(S) VISIBLE` : `${published.length} published row(s), 0 drafts`,
  );

  // Ask for drafts by name. Under the policy this is an empty array.
  const asked = await expectRead('articles', 'select=id&status=eq.draft', 'anon asks for drafts explicitly');
  if (asked) report(asked.length === 0, 'anon asks for drafts explicitly', asked.length ? `${asked.length} RETURNED` : 'empty');

  await attemptForge('articles', {
    slug: 'rls-test-should-never-be-written',
    title: 'RLS test',
    category: 'Resilience',
    status: 'published',
  });

  const patch = await fetch(`${URL_BASE}/rest/v1/articles?status=eq.published`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ title: 'RLS test — should never be written' }),
  });
  report(!patch.ok, 'anon edits a published article', `HTTP ${patch.status}`);

  const del = await fetch(`${URL_BASE}/rest/v1/articles?status=eq.published`, { method: 'DELETE', headers });
  report(!del.ok, 'anon deletes articles', `HTTP ${del.status}`);
}

const slots = await expectRead('site_photos', 'select=slot', 'anon reads site_photos');
if (slots) {
  await attemptForge('site_photos', { slot: 'home-hero', storage_path: 'rls-test', alt: 'rls-test' });
}

// Storage: anon may not put anything into the bucket.
const upload = await fetch(`${URL_BASE}/storage/v1/object/site-media/rls-test/should-never-exist.png`, {
  method: 'POST',
  headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'image/png' },
  body: new Uint8Array([137, 80, 78, 71]),
});
report(!upload.ok, 'anon uploads to site-media', `HTTP ${upload.status}`);

console.log(
  failures
    ? `\n${failures} EXPOSURE(S). Do not ship. Re-check supabase/migrations/.`
    : '\nEvery attempt blocked. The public key cannot write anywhere and cannot read anything private.',
);

process.exit(failures ? 1 : 0);
