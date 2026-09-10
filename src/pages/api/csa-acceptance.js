/**
 * Logs a Client Service Agreement acceptance, then sends the visitor on to
 * Stripe.
 *
 * CLAUDE.md, client workflow: "CSA acceptance happens before Stripe payment,
 * and must be logged with a timestamp. This is the reason we're not using a
 * plain Stripe checkbox."
 *
 * The acceptance is written FIRST and the redirect only happens if that write
 * succeeded. If the database is unreachable the visitor is sent back to the
 * agreement page with an error rather than on to pay — taking money without a
 * record of what was agreed is the one outcome this flow must never produce.
 *
 * NO-JAVASCRIPT BY DESIGN. This is a plain form POST that answers with a 303,
 * so the purchase path works with scripts blocked. There is no client-side
 * fetch to go wrong at the moment money is involved.
 */
import { stripeLinks } from '../../config/site.js';
import { AGREEMENT_VERSION, AGREEMENT_HASH } from '../../lib/agreement.js';
import { insertRow } from '../../lib/supabase-write.js';

// Runs on request, not at build. Every other page in the site stays static.
export const prerender = false;

/** Send the visitor back to the agreement page carrying an error code. */
function backToAgreement(serviceId, code) {
  const target = serviceId ? `/checkout/${encodeURIComponent(serviceId)}` : '/individual-sessions';
  return new Response(null, { status: 303, headers: { Location: `${target}?error=${code}` } });
}

export async function POST({ request, clientAddress }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return backToAgreement(null, 'malformed');
  }

  const serviceId = String(form.get('service_id') ?? '').trim();

  // THE DESTINATION IS LOOKED UP HERE, NEVER TAKEN FROM THE FORM. If the
  // browser could supply the redirect target, this endpoint would be an open
  // redirect that logs an acceptance and then sends the buyer to whatever
  // payment page an attacker chose.
  const service = stripeLinks.find((s) => s.id === serviceId);
  if (!service) return backToAgreement(null, 'unknown-service');

  const fullName = String(form.get('full_name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const agreed = form.get('agree') != null;

  // The same rules the browser enforces, enforced again here — a client-side
  // check is a convenience, not a guarantee.
  if (!fullName || !email || !email.includes('@') || !agreed) {
    return backToAgreement(serviceId, 'incomplete');
  }

  try {
    await insertRow('csa_acceptances', {
      full_name: fullName,
      email,
      service_id: service.id,

      // Which text they agreed to, so the record still means something after
      // the agreement is next revised.
      agreement_version: AGREEMENT_VERSION,
      agreement_hash: AGREEMENT_HASH,

      // `accepted_at` is deliberately omitted — the database default is the
      // server clock. A browser-supplied time is not evidence of anything.

      // OPEN-QUESTIONS #33 / RLS proposal Decision 2: still Darlene's call.
      // Columns are nullable, so withdrawing this is deleting two lines.
      ip_address: clientAddress ?? null,
      user_agent: request.headers.get('user-agent'),
    });
  } catch (error) {
    // Never leak database detail to the browser; keep it in the server log.
    console.error('[csa-acceptance] write failed:', error);
    return backToAgreement(serviceId, 'not-recorded');
  }

  return new Response(null, { status: 303, headers: { Location: service.url } });
}

/** A GET here means someone opened the URL directly. Send them somewhere real. */
export function GET() {
  return new Response(null, { status: 303, headers: { Location: '/individual-sessions' } });
}
