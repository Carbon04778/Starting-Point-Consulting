/**
 * Footer newsletter signup → Kit.
 *
 * The browser never talks to Kit: the API key lives here, server-side, and
 * the page only ever sends an email address to this endpoint. Answers JSON
 * for the signup's fetch(); a plain no-JS POST gets a 303 back to the page
 * it came from (the footer is on every page) with ?newsletter=sent or
 * ?newsletter=error in the query — the component reads neither, because
 * every page but Contact is prebuilt, so the no-JS visitor simply lands back
 * on the page. The approved success line shows only after Kit confirms.
 */
import { kitConfigured, subscribe } from '../../lib/kit.js';

export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST({ request }) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const json = (ok, status = 200) =>
    new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  const back = (ok) => {
    const referer = request.headers.get('referer');
    let location = '/';
    try {
      if (referer) location = new URL(referer).pathname;
    } catch {
      /* keep '/' */
    }
    return new Response(null, {
      status: 303,
      headers: { Location: `${location}?newsletter=${ok ? 'sent' : 'error'}#newsletter` },
    });
  };
  const respond = (ok, status) => (wantsJson ? json(ok, status) : back(ok));

  // The signup is not rendered unless Kit is configured, so this is only
  // reachable by a hand-made request. Say no rather than pretend.
  if (!kitConfigured()) return respond(false, 503);

  let form;
  try {
    form = await request.formData();
  } catch {
    return respond(false, 400);
  }

  const email = String(form.get('email') ?? '').trim().slice(0, 254);
  if (!EMAIL.test(email)) return respond(false, 400);

  try {
    await subscribe(email);
  } catch (error) {
    // The address is a visitor's; log the reason, not the payload.
    console.error('[newsletter] Kit subscribe failed:', error?.message ?? error);
    return respond(false, 502);
  }

  return respond(true);
}
