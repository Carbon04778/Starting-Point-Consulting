/**
 * Stores a contact form ("Let's begin") enquiry.
 *
 * Darlene, 15 September 2026: enquiries land in the private admin area, not
 * in email, at launch. Same insert-only path as intake and the agreement log:
 * a 60-second `sp_writer` token, never the service-role key
 * (src/lib/supabase-write.js). Read back only at /admin/enquiries.
 *
 * Two ways in, same result:
 *   - fetch() from the panel's script, answered with JSON, so the approved
 *     success state replaces the form in place (Blueprints Page 15: "no page
 *     reload, no redirect");
 *   - a plain form POST when JavaScript is blocked, answered with a 303 back
 *     to the page the panel was on, carrying ?sent or ?error=not-sent.
 */
import { routes } from '../../config/site.js';
import { contactPanel } from '../../copy/shared.js';
import { insertRow } from '../../lib/supabase-write.js';

export const prerender = false;

/* The pages that carry the shared panel; recorded with the enquiry. A no-JS
   submit is always sent back to /contact, the one panel page rendered per
   request, so the ?sent / ?error state can actually be shown. */
const PANEL_PAGES = new Set([routes.home, routes.services, routes.contact]);

const REQUIRED = contactPanel.form.fields.filter((f) => f.required).map((f) => f.name);
const ROLE_OPTIONS = new Set(contactPanel.form.fields.find((f) => f.name === 'role')?.options ?? []);

const LIMITS = { name: 200, email: 254, role: 100, message: 5000 };

function clean(form, name) {
  return String(form.get(name) ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, LIMITS[name]);
}

export async function POST({ request }) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  let form;
  try {
    form = await request.formData();
  } catch {
    return respond(wantsJson, routes.contact, false);
  }

  const sourcePath = String(form.get('source') ?? '');
  const source = PANEL_PAGES.has(sourcePath) ? sourcePath : '';
  const backTo = routes.contact;

  const values = Object.fromEntries(Object.keys(LIMITS).map((name) => [name, clean(form, name)]));

  /* Server-side validation mirrors the form's own: every required field
     present, the role one of the offered options, the email shaped like one.
     A crafted POST that skips the form gets the same answer a blank one
     would — nothing stored. */
  const missing = REQUIRED.some((name) => !values[name]);
  const badRole = !ROLE_OPTIONS.has(values.role);
  const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  if (missing || badRole || badEmail) return respond(wantsJson, backTo, false, 400);

  try {
    await insertRow('contact_enquiries', {
      full_name: values.name,
      email: values.email,
      role: values.role,
      message: values.message,
      source_path: source,
    });
  } catch (error) {
    // Log server-side only; the message body is a visitor's private note.
    console.error('[contact] insert failed:', error?.message ?? error);
    return respond(wantsJson, backTo, false, 500);
  }

  return respond(wantsJson, backTo, true);
}

function respond(wantsJson, backTo, ok, status = 200) {
  if (wantsJson) {
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
  const query = ok ? '?sent' : '?error=not-sent';
  return new Response(null, { status: 303, headers: { Location: `${backTo}${query}#contact` } });
}
