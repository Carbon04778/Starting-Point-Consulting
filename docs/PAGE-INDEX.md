# Page Index

Check items off as they're built AND verified (see QA-CHECKLIST.md). Source: docs/reference/03-page-blueprints.md.

## Status legend

- `[x]` built, and passing `npm run qa` — internal links, page structure, copy
  fidelity, and colour contrast
- `[~]` built, but something on it is still outstanding, noted inline
- `[ ]` not built

`[x]` does **not** mean the manual pass in `QA-CHECKLIST.md` is done. Mobile
layout at 375px and 390px, keyboard order, and visible focus states still need
a human looking at them.

## Main pages (14)

- [x] Home
- [x] Services (overview, "How We Partner")
- [x] Individual Sessions — "Ways to Work Together" (pricing/session cards live here, not on a separate Pricing page) — the seven purchase CTAs reach `/checkout/<id>`, now built
- [~] Speaking (includes the corrected "nationally and internationally" line) — "Speaker kit" button opens the September 2026 kit PDF; that kit still carries placeholders, see OPEN-QUESTIONS #37
- [x] Booking (public — Organizational Discovery Conversation only, 30 min, no payment) — Calendly embed, not a rebuilt calendar; see OPEN-QUESTIONS #35
- [ ] Starting Points (articles index)
- [ ] Article template (single template, reused per post published through the admin CMS)
- [ ] Free guide / lead magnet page
- [x] About — testimonials hidden until signed releases are confirmed
- [x] Our Approach
- [x] FAQ (includes the corrected "including internationally" line) — 16 questions, not 18; see OPEN-QUESTIONS.md
- [ ] Client Resources — still blocked; three of the linked documents now exist as PDFs (Provider Resource, Speaker Kit, Overview One-Pager), the rest do not, see OPEN-QUESTIONS #17
- [~] For Therapists & Providers (no referral form, per known mockup gap) — "View the Provider Resource" opens the public PDF; one approved paragraph about the intake is withheld as factually stale; needs Darlene, see OPEN-QUESTIONS #33
- [~] Contact — the form validates and shows the approved success state, but is not yet wired to an inbox

**Note on the corrected travel line.** This index puts it on the Speaking page.
The sentence actually lives in Master Copy §06, on the Individual Sessions
page, and the correction is applied there. `npm run check:copy` asserts it.

## Legal pages (8) — footer only, shared layout

Verbatim text must come from the rendered interactive files, not be drafted. See CLAUDE.md "Legal page text" section before starting any of these.

**All eight are built.** The text is never transcribed: the pages render a parse
of the verbatim extraction in `docs/legal-source/*.txt` (see `src/lib/legal.js`),
and `npm run check:legal` asserts against the BUILT html that all 257 approved
strings appear, that no advisory callout leaked, and that no placeholder
survived. Shared shell: `src/layouts/LegalLayout.astro`, built to Legal Pages
Index §02.

- [x] Privacy Policy
- [x] Terms & Conditions
- [x] Disclaimer
- [x] HIPAA Note
- [x] Accessibility Statement
- [x] Non-Discrimination & Inclusion
- [x] Client Service Agreement — effective date 21 Sept 2026 is rendered; acceptance logging with a timestamp is Phase 4, not this page
- [x] Testimonial & Media Release

(Cookie preferences is a footer link that opens a consent manager, not a real page, no separate build item.)

## Purchase flow (7 routes) — noindex, not in nav

Not previously tracked here, though Individual Sessions has referenced them
throughout. One dynamic route, `/checkout/[service]`, generating one page per
paid offering. Reached only from a service button; the Stripe URL is resolved
server-side so the page cannot be repointed.

- [x] /checkout/individual-nervous-system-session
- [x] /checkout/extended-individual-session
- [x] /checkout/individual-leadership-session
- [x] /checkout/integration-support-session
- [x] /checkout/4-session-package
- [x] /checkout/4-session-integration-path
- [x] /checkout/3-session-leadership-package

## Private / hidden pages (4) — noindex, not in nav

- [x] New Client Intake form (post-booking, non-blocking, linked from the Calendly welcome email) — built from docs/reference/new-client-intake-FINAL.pdf; nothing is required, per the PDF's own intro (see OPEN-QUESTIONS)
- [x] /schedule/60-minute-session — Master Copy §08 copy, neutral for all four 60-minute purchases
- [x] /schedule/90-minute-session — no package language, per §08
- [x] /schedule/leadership-session

## Admin / CMS (2 screens, not part of the public site count)

- [ ] Login (Supabase Auth)
- [ ] Dashboard (write/edit article, upload/swap photo, publishes immediately)

## Footer behavior (applies globally, check on every page)

- [x] Desktop: How We Partner / Who We Serve / Company shown as standard visible columns
- [~] Mobile: same three groups collapse into accordions (▾), links remain reachable when expanded, essential legal/footer info stays visible below them at all times — built to spec; needs a human check at 375px and 390px

Built so the panels render **open** and only collapse once JS confirms a mobile
width, so a visitor without JS can always reach every footer link.
