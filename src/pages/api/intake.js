/**
 * Stores a New Client Intake submission.
 *
 * Uses the same insert-only path as the agreement log: a 60-second `sp_writer`
 * token, never the service-role key. See src/lib/supabase-write.js.
 *
 * THIS MUST NEVER BLOCK AN APPOINTMENT. CLAUDE.md: "New Client Intake is a
 * post-booking step and must never block or delay the appointment… If someone
 * books and never completes intake, that's fine, the session still happens."
 * So a failure here is a soft failure — the visitor is told plainly that their
 * session is unaffected, rather than being pushed to retry as though something
 * important had broken.
 *
 * A plain form POST answering with a 303, so the form works with JavaScript
 * blocked.
 */
import { routes } from '../../config/site.js';
import { intakeSections } from '../../copy/intake.js';
import { insertRow } from '../../lib/supabase-write.js';

export const prerender = false;

/* The only field names this endpoint will store. Anything else in the POST is
   discarded — so a crafted form cannot smuggle extra columns into the record,
   and the "DO NOT ADD FIELDS" rule in the implementation note holds at the
   database boundary too, not just in the markup. */
const ALLOWED = new Map(
  intakeSections
    .flatMap((section) => section.fields)
    .map((field) => [field.name, field.type]),
);

const back = (query) =>
  new Response(null, { status: 303, headers: { Location: `${routes.newClientIntake}${query}` } });

export async function POST({ request }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return back('?error=not-saved');
  }

  /* Nothing on this form is required (the PDF: "nothing here is required"), so
     there is no validation gate. Values are collected as given. */
  const answers = {};
  for (const [name, type] of ALLOWED) {
    if (type === 'checkbox') {
      const values = form.getAll(`${name}[]`).map(String).filter(Boolean);
      if (values.length) answers[name] = values;
      continue;
    }
    const value = String(form.get(name) ?? '').trim();
    if (value) answers[name] = value;
  }

  /* First and last name are columns in their own right, so pull them out of
     the free-form answers and into the record's own fields. */
  const fullName = [answers.first_name, answers.last_name].filter(Boolean).join(' ');
  const email = answers.email ?? '';
  delete answers.first_name;
  delete answers.last_name;
  delete answers.email;

  try {
    await insertRow('intake_submissions', {
      full_name: fullName,
      email,
      acknowledged_scope: form.get('acknowledged') != null,
      answers,
    });
  } catch (error) {
    // Log server-side; the body can echo what someone typed, which does not
    // belong in a browser response.
    console.error('[intake] write failed:', error);
    return back('?error=not-saved');
  }

  return back('?sent');
}

/** A GET means someone opened the endpoint directly. */
export function GET() {
  return back('');
}
