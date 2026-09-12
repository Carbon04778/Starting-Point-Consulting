/**
 * The admin gate.
 *
 * Every request under /admin is checked HERE, on the server, before any page
 * code runs. The rule is the one from CLAUDE.md and the RLS proposal: private
 * data is reachable only by a signed-in user who is on the `admins`
 * allow-list. Being merely signed in is not enough.
 *
 *   /admin/login          always reachable (it is how you get in)
 *   /api/admin/*          the login/logout endpoints handle their own auth
 *   /admin, /admin/**     admin only — anyone else is sent to the login page
 *
 * Pages under /admin read `locals.admin` and `locals.supabase`; they never
 * re-derive the session themselves. The Supabase client is bound to the
 * request's cookies, so RLS evaluates as the signed-in user for every query a
 * page makes.
 *
 * Public routes pass straight through — this file adds nothing to them.
 */
import { defineMiddleware } from 'astro:middleware';
import { currentAdmin } from './lib/supabase.js';

const LOGIN = '/admin/login';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/admin')) return next();

  // No admin page is ever cacheable or indexable.
  const response = await (async () => {
    if (pathname === LOGIN || pathname === `${LOGIN}/`) {
      // Already signed in as an admin? Straight to the dashboard.
      const { admin } = await currentAdmin(context);
      if (admin) return context.redirect('/admin', 303);
      return next();
    }

    const { supabase, user, admin } = await currentAdmin(context);

    if (!admin) {
      // A signed-in non-admin is signed out again so the session cannot be
      // used to probe anything, then sent to login like everyone else.
      if (user) await supabase.auth.signOut();
      const back = encodeURIComponent(pathname + context.url.search);
      return context.redirect(`${LOGIN}?next=${back}`, 303);
    }

    context.locals.admin = admin;
    context.locals.supabase = supabase;
    return next();
  })();

  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
});
