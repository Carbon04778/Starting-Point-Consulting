/**
 * Kit (formerly ConvertKit) — the newsletter platform, Darlene's decision of
 * 15 September 2026.
 *
 * Two values, both from her Kit account, both set as environment variables
 * (never in code — CLAUDE.md, ownership transfer):
 *   KIT_API_KEY   a V4 API key, Settings → Developer. Secret. Server-only.
 *   KIT_FORM_ID   the form subscribers arrive through, Grow → Forms. The form
 *                 itself is never displayed; the site's own signup posts to it.
 *
 * The footer signup is shown only when both are present (Footer.astro), which
 * is what makes "hidden until connected" true without a second switch.
 *
 * Kit V4: POST https://api.kit.com/v4/forms/{form_id}/subscribers with the
 * key in X-Kit-Api-Key, JSON { email_address }. Creates the subscriber if new
 * and adds them to the form, which runs whatever confirmation/welcome the form
 * is set to in Kit. Server-only: the key must never reach the browser.
 */

const read = (name) => import.meta.env?.[name] || process.env?.[name] || '';

export function kitConfigured() {
  return Boolean(read('KIT_API_KEY') && read('KIT_FORM_ID'));
}

/**
 * Subscribe one address. Resolves on success; throws with a short reason on
 * failure. The reason is for the server log only — the visitor sees the
 * approved error line.
 */
export async function subscribe(email) {
  const apiKey = read('KIT_API_KEY');
  const formId = read('KIT_FORM_ID');
  if (!apiKey || !formId) throw new Error('kit: KIT_API_KEY and KIT_FORM_ID must be set');

  const response = await fetch(`https://api.kit.com/v4/forms/${encodeURIComponent(formId)}/subscribers`, {
    method: 'POST',
    headers: {
      'X-Kit-Api-Key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = Array.isArray(body?.errors) ? body.errors.join('; ') : JSON.stringify(body).slice(0, 200);
    } catch {
      /* no body */
    }
    throw new Error(`kit: HTTP ${response.status}${detail ? ' — ' + detail : ''}`);
  }
}
