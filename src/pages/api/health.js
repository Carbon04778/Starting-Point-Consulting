/**
 * Health check for the server function. Answers "can this deployment do the
 * things that only work at runtime?" without touching private data.
 *
 *   GET /api/health  →  { ok, checks: { env, database, markdown } }
 *
 * `markdown` exercises the article renderer, which loads fine locally and has
 * failed inside the Vercel function; the error text is surfaced here so a
 * failure can be read without dashboard access. Nothing secret is returned:
 * no keys, no rows, only pass/fail and an error message.
 */
import { renderMarkdown } from '../../lib/articles.js';
import { supabaseConfigured, publicClient } from '../../lib/supabase.js';

export const prerender = false;

const describe = (error) =>
  error instanceof Error ? `${error.name}: ${error.message}` : String(error);

export async function GET() {
  const checks = {};

  checks.env = supabaseConfigured() ? 'ok' : 'PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY not set';

  try {
    const { error } = await publicClient().from('articles').select('id').limit(1);
    checks.database = error ? `error: ${error.message}` : 'ok';
  } catch (error) {
    checks.database = `error: ${describe(error)}`;
  }

  try {
    const html = await renderMarkdown('**ok**');
    checks.markdown = html.includes('<strong>ok</strong>') ? 'ok' : `unexpected output: ${html.slice(0, 80)}`;
  } catch (error) {
    checks.markdown = `error: ${describe(error)}`;
  }

  const ok = Object.values(checks).every((v) => v === 'ok');
  return new Response(JSON.stringify({ ok, node: process.version, checks }, null, 2), {
    status: ok ? 200 : 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
