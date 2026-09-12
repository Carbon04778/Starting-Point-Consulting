/**
 * Admin sign-in. Plain form POST, answers with a redirect — no client-side
 * fetch, works with scripts blocked, same posture as checkout.
 *
 * Signing in is not the same as being let in: after Supabase Auth accepts the
 * password, the `admins` allow-list is checked. A valid account that is not
 * on it is signed straight back out. Sign-ups are disabled in the Supabase
 * dashboard, so in practice the only accounts are the ones we created — this
 * check is what makes that assumption unnecessary.
 */
import { sessionClient, currentAdmin } from '../../../lib/supabase.js';

export const prerender = false;

const LOGIN = '/admin/login';

function back(code, next) {
  const q = new URLSearchParams({ error: code });
  if (next) q.set('next', next);
  return new Response(null, { status: 303, headers: { Location: `${LOGIN}?${q}` } });
}

/** Only ever redirect within /admin — never to a URL the form supplied elsewhere. */
function safeNext(value) {
  return typeof value === 'string' && /^\/admin(\/|\?|$)/.test(value) && !value.startsWith('/admin/login')
    ? value
    : '/admin';
}

export async function POST(ctx) {
  let form;
  try {
    form = await ctx.request.formData();
  } catch {
    return back('malformed');
  }

  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const next = safeNext(form.get('next'));

  if (!email || !password) return back('incomplete', next);

  const supabase = sessionClient(ctx);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // One message for wrong email and wrong password alike; the difference is
    // information an attacker would like.
    return back('invalid', next);
  }

  const { admin } = await currentAdmin(ctx);
  if (!admin) {
    await supabase.auth.signOut();
    return back('not-admin', next);
  }

  return new Response(null, { status: 303, headers: { Location: next } });
}

export function GET() {
  return new Response(null, { status: 303, headers: { Location: LOGIN } });
}
