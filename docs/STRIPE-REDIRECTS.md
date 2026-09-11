# Stripe Payment Link redirects

Each of the seven live Payment Links has its **After payment** setting pointed
at the matching private scheduling page. The `?p=` value tells the page which
product was bought (it names it on the page and tags the Calendly booking);
an unknown value falls back to the approved neutral copy from Master Copy §08.

Set by Hadley in Darlene's Stripe account on 11 September 2026 against the
Vercel preview domain. **When `startingpointconsulting.com` is attached in
Vercel, repeat with that domain as the base** — seven edits, Payment Link →
Edit → After payment → "Don't show confirmation page" → redirect URL.

Base (current): `https://starting-point-consulting.vercel.app`
Base (launch): `https://startingpointconsulting.com`

| Payment Link | Price | Path to append to the base |
|---|---|---|
| Individual Nervous System Session | $175 | `/schedule/60-minute-session?p=individual-nervous-system-session` |
| 4-Session Package | $640 | `/schedule/60-minute-session?p=4-session-package` |
| 4-Session Integration Path | $640 | `/schedule/60-minute-session?p=4-session-integration-path` |
| Integration Support Session | $175 | `/schedule/60-minute-session?p=integration-support-session` |
| Extended Individual Session | $250 | `/schedule/90-minute-session?p=extended-individual-session` |
| Individual Leadership Session | $295 | `/schedule/leadership-session?p=individual-leadership-session` |
| 3-Session Leadership Package | $825 | `/schedule/leadership-session?p=3-session-leadership-package` |

Product ids and Stripe URLs are the single source in `stripeLinks`,
`src/config/site.js`. If a Payment Link is ever recreated in Stripe, update
the `url` there — the checkout pages resolve it server-side.

Test without charging: enable promotion codes on one link, create a 100%-off
coupon, run the flow from `/individual-sessions`, then delete the coupon.
