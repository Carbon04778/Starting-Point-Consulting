/**
 * Supabase clients for READING and for the admin session. Server-side only.
 *
 * Two clients, two very different trust levels:
 *
 *   publicClient()   the anon key. Sees exactly what RLS lets the public see:
 *                    published articles, photo slots, nothing private. Used by
 *                    the Starting Points pages and by static pages at build.
 *
 *   sessionClient()  the anon key PLUS the signed-in user's cookies. RLS then
 *                    evaluates as that user — if they are in `admins`, the
 *                    write policies open; if not, they see what anon sees.
 *                    Used by every /admin route. There is no service-role key
 *                    anywhere in this codebase, on purpose (see
 *                    supabase-write.js for why).
 *
 * Writes from the PUBLIC site (intake, CSA) do not go through here — they use
 * the insert-only sp_writer path in supabase-write.js.
 */
import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

/** Same dual read as supabase-write.js: import.meta.env in dev, process.env on Vercel. */
const read = (name) => import.meta.env?.[name] || process.env?.[name] || '';

export function supabaseConfig() {
  const url = read('PUBLIC_SUPABASE_URL').replace(/\/+$/, '');
  const anonKey = read('PUBLIC_SUPABASE_ANON_KEY');
  if (!url || !anonKey) {
    throw new Error('supabase: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY must be set');
  }
  return { url, anonKey };
}

/** True when the Supabase variables exist — lets static pages degrade gracefully. */
export function supabaseConfigured() {
  return Boolean(read('PUBLIC_SUPABASE_URL') && read('PUBLIC_SUPABASE_ANON_KEY'));
}

export function publicClient() {
  const { url, anonKey } = supabaseConfig();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * A client bound to the request's auth cookies.
 *
 * @param {{ request: Request, cookies: import('astro').AstroCookies }} ctx
 *   An Astro page context or middleware context — anything with `request` and
 *   `cookies`.
 */
export function sessionClient({ request, cookies }) {
  const { url, anonKey } = supabaseConfig();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '');
      },
      setAll(toSet) {
        for (const { name, value, options } of toSet) {
          cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
          });
        }
      },
    },
  });
}

/**
 * Who is signed in, and are they an admin?
 *
 * "Admin" is decided by the `admins` allow-list, never by "is authenticated".
 * A signed-in user who is not in that table gets `admin: null` here and is
 * treated exactly like an anonymous visitor by every admin route.
 *
 * @returns {Promise<{ supabase: ReturnType<typeof sessionClient>, user: import('@supabase/supabase-js').User | null, admin: { email: string } | null }>}
 */
export async function currentAdmin(ctx) {
  const supabase = sessionClient(ctx);

  // getUser() verifies the JWT with the auth server; getSession() would trust
  // the cookie as-is. For a gate on private data, verification is the point.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, admin: null };

  // RLS on `admins` returns the caller's own row if and only if is_admin().
  const { data } = await supabase.from('admins').select('email').eq('user_id', user.id).maybeSingle();

  return { supabase, user, admin: data ? { email: data.email } : null };
}

/** Public URL for an object in the `site-media` bucket. */
export function mediaUrl(path) {
  if (!path) return null;
  const { url } = supabaseConfig();
  return `${url}/storage/v1/object/public/site-media/${path.split('/').map(encodeURIComponent).join('/')}`;
}
