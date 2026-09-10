/**
 * The write-only path into Supabase. Server-side only — never import this
 * from anything that reaches the browser.
 *
 * WHY THIS EXISTS RATHER THAN THE SERVICE-ROLE KEY.
 *
 * CLAUDE.md: writes from the public site "should go through a restricted
 * insert-only path, not a role that can also read." Supabase's `service_role`
 * key is the opposite of that — it carries Postgres BYPASSRLS, so it ignores
 * every policy in 0001_initial_schema.sql. If it ever leaked, it would hand
 * over every intake submission and every CSA acceptance in the database.
 *
 * So instead the endpoint mints a short-lived token whose `role` claim is
 * `sp_writer`, the Postgres role created by the migration. PostgREST switches
 * into that role, which holds INSERT on two tables and nothing else. A leak of
 * anything here lets an attacker write junk rows. It does not let them read a
 * single one.
 *
 * The tokens live 60 seconds and are minted per request, so there is no
 * long-lived credential sitting anywhere to steal.
 */
import { createHmac } from 'node:crypto';

const b64url = (input) => Buffer.from(input).toString('base64url');

/**
 * Mint an HS256 JWT for the `sp_writer` role.
 *
 * Claims mirror the shape Supabase itself issues (iss/ref/aud) so the API
 * gateway and PostgREST both accept it; only `role` differs.
 */
function mintWriterToken({ secret, projectRef }) {
  const now = Math.floor(Date.now() / 1000);

  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({
      role: 'sp_writer',
      iss: 'supabase',
      ref: projectRef,
      aud: 'authenticated',
      iat: now,
      // Deliberately tiny. This token exists for the length of one insert.
      exp: now + 60,
    }),
  );

  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

/**
 * Read one variable from either place Astro might hold it.
 *
 * `import.meta.env` is where Astro puts the contents of `.env`, so that is the
 * only source that works in dev — `process.env` is empty there, which silently
 * broke every write until an end-to-end test caught it.
 *
 * `process.env` is where a host puts variables configured in its dashboard, so
 * that is the source that works on Vercel at runtime.
 *
 * Both are needed. Checking only one works in exactly one environment.
 */
const read = (name) => import.meta.env?.[name] || process.env?.[name] || '';

/** Read config at call time, not import time, so a missing var fails loudly. */
function config() {
  const url = read('PUBLIC_SUPABASE_URL');
  const anonKey = read('PUBLIC_SUPABASE_ANON_KEY');
  const secret = read('SUPABASE_JWT_SECRET');

  const missing = [
    !url && 'PUBLIC_SUPABASE_URL',
    !anonKey && 'PUBLIC_SUPABASE_ANON_KEY',
    !secret && 'SUPABASE_JWT_SECRET',
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(`supabase-write: missing environment variable(s): ${missing.join(', ')}`);
  }

  const projectRef = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  if (!projectRef) throw new Error(`supabase-write: could not read project ref from ${url}`);

  return { url: url.replace(/\/+$/, ''), anonKey, secret, projectRef };
}

/**
 * Insert one row. Returns nothing on purpose.
 *
 * `Prefer: return=minimal` is REQUIRED, not an optimisation: `sp_writer` has no
 * SELECT privilege, and asking PostgREST to return the created row makes it
 * attempt a read, which fails. That constraint is deliberate — it means this
 * code path cannot be talked into reading, even by mistake.
 *
 * @param {string} table
 * @param {Record<string, unknown>} row
 */
export async function insertRow(table, row) {
  const { url, anonKey, secret, projectRef } = config();
  const token = mintWriterToken({ secret, projectRef });

  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      // The gateway checks `apikey`; PostgREST takes the role from the bearer.
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    // Log the detail server-side; callers surface something generic. The body
    // can echo submitted values, which do not belong in a browser response.
    const detail = await response.text().catch(() => '');
    throw new Error(`supabase-write: ${table} insert failed — HTTP ${response.status} ${detail}`);
  }
}
