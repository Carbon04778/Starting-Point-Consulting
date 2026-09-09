# Starting Point Consulting — Website Build

Read this file fully before writing any code. Then read every file in `docs/reference/` before touching any specific page. This project has an unusually complete client-provided spec. The whole point of this handoff is that you should almost never have to invent anything, if you find yourself guessing, stop and ask.

## Who this is for

Client: Darlene Erich, founder of Starting Point Consulting (stress and nervous-system science education/coaching, solo business).
Developer: Hadley Monero (freelance), building this by hand instead of Squarespace because the approved design has exact spacing/sizing on every page that a drag-and-drop builder can't hold.
You (Claude Code): continuing the build inside VS Code from this handoff.

## The five working rules — non-negotiable

1. **Do not guess.** If a spec, price, URL, copy string, or behavior isn't explicitly written in `docs/reference/` or explicitly confirmed by Hadley, stop and ask instead of inventing it. This applies double to legal text and prices.
2. **After every change, check what you already built still works.** Never build the next page/feature on top of something you haven't verified still functions. Regressions get caught immediately, not at the end.
3. **Every button, link, and CTA gets checked.** Nothing dead, nothing pointing at a placeholder, in the build you call done.
4. **Run tests generally after meaningful changes.** At minimum: manual QA pass per page (see `docs/QA-CHECKLIST.md`). Where practical, add lightweight automated checks (e.g. a script that crawls internal links for 404s, an HTML validator pass).
5. **Propose a plan and get explicit approval before building each phase.** Don't silently build ahead of what's been approved. Small copy fixes are fine to just do; new pages, new data structures, or anything touching Supabase security rules need a "here's my plan" moment first.

## Source of truth, in order

When two sources conflict, higher wins:

1. `docs/reference/01-web-developer-handoff.md` — the master spec
2. `docs/reference/03-page-blueprints.md` — page-by-page structure
3. `docs/reference/04-master-website-copy.md` — approved copy, place as written
4. `docs/reference/approved-ui-mockup.html` — visual/interaction/legal-text reference only

**The mockup (#4) is confirmed outdated in three places** (see `docs/reference/12-mockup-readme-and-known-gaps.md`):
- No standalone public Pricing page. Prices live inside the "Ways to Work Together" page (Individual Sessions), not a separate nav item.
- "For Therapists & Providers" page has no referral form. Providers just get information; the individual reaches out on their own.
- No standalone Integration Support page. It's a section inside Individual Sessions.

## Two late copy corrections from Darlene (apply exactly, do not paraphrase)

These came in after the Master Website Copy doc was finalized, so they override it wherever they overlap.

**Speaking page, Services section:**
Old: "Keynotes, panels, and facilitated conversations. Based in Utah and available to travel nationally."
New: "Keynotes, panels, and facilitated conversations. Based in Utah and available for engagements nationally and internationally."

**FAQ page, "Do you offer in-person services and travel for events?":**
New answer: "Yes. We offer in-person workshops, training, and speaking, and we travel for engagements, including internationally. Starting Point Consulting is based in Utah and works nationwide. For work outside the local area, reasonable travel and lodging expenses are added to the engagement proposal rather than folded into the base rate."

## Client workflow (confirmed by Darlene, build exactly this sequence)

For paid individual services:

Service selection → Client Service Agreement acceptance → Stripe payment → private post-payment scheduling page → Calendly booking → New Client Intake

Important details:
- CSA acceptance happens **before** Stripe payment, and must be logged with a timestamp. This is the reason we're not using a plain Stripe checkbox.
- The three private scheduling pages are `noindex`, not in nav, only reachable via a successful Stripe redirect:
  - `/schedule/60-minute-session`
  - `/schedule/90-minute-session`
  - `/schedule/leadership-session`
- Once those pages are live, send Hadley the final URLs so Darlene can repoint the Stripe Payment Link redirects.
- **New Client Intake is a post-booking step and must never block or delay the appointment.** The Calendly booking confirmation/welcome email contains the intake link. If someone books and never completes intake, that's fine, the session still happens.
- Packages (e.g. 4-Session Package) are paid once. First session uses the scheduling page above; remaining sessions are scheduled later without another Stripe charge.
- Full price/session/Calendly URL mapping is in `docs/reference/09-client-workflow-reference.md`.

## Data and security (Darlene's explicit requirement, quoted)

> "Please make sure the intake submissions and Client Service Agreement records are accessible only through the authenticated/private admin side and aren't publicly accessible through the site or database/API."

Concretely: Supabase Row Level Security on the `intake_submissions` and `csa_acceptances` tables must default-deny anonymous/public reads. Only the authenticated admin role (Darlene, primary admin post-transfer) can read them. Writes from the public site (submitting intake, logging a CSA acceptance) should go through a restricted insert-only path, not a role that can also read. Do not ship a first draft of this schema without stating the RLS policy in plain English to Hadley for a sanity check first, per rule 5.

## Legal page text — do not draft this yourself

`docs/reference/approved-ui-mockup.html` and `docs/reference/client-agreements-interactive.html` are self-contained interactive prototypes that render via JavaScript. Their exact legal text (Privacy Policy, Terms & Conditions, Disclaimer, HIPAA Note, Accessibility Statement, Non-Discrimination & Inclusion, Client Service Agreement, Testimonial & Media Release) cannot be reliably extracted by parsing the file as static text, it has to be opened in an actual browser and copied from the rendered page. **Do not paraphrase or reconstruct legal text from memory or from the general notes in `docs/reference/11-legal-notes-for-developer.md`.** Ask Hadley to paste the rendered text for any legal page before you build it, or flag it as blocked.

## Logos and photos

- Approved for use as-is: `assets/logo/` (primary, wordmark, horizontal, emblem, favicon, social icon, SVG + PNG). Darlene confirmed: "Go ahead and move forward with what you have for the logos."
- Only photo asset provided so far: Darlene's own headshot/portrait in `assets/photos/`. Everything else is a placeholder frame until she sends more.

## Launch date

**September 21, 2026.** This is the effective date to hard-code into the Client Service Agreement page once its final text is in place.

## Hosting and ownership model (context, matters for how you configure things)

Build now on Hadley's own GitHub/Vercel/Supabase accounts so we can move fast. At project completion, everything transfers to accounts Darlene creates and owns; Darlene becomes primary admin. Keep this in mind when setting up auth: the admin system should be built so ownership transfer is clean (no hardcoded references to Hadley's personal accounts inside app logic, credentials go in environment variables/secrets, not code).

## Design tokens

Real CSS variables from the approved design system, use these, don't eyeball colors off the mockup screenshot: `docs/tokens/colors.css`, `typography.css`, `spacing.css`, `fonts.css`.

## Full page inventory (see `docs/PAGE-INDEX.md` for the tracked checklist)

26 site pages total, plus a 2-screen private admin area (login + dashboard) that is not part of the public site count.
