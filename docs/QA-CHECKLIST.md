# QA Checklist

Run this per page before checking it off in PAGE-INDEX.md, and re-run the "regression" section any time a shared component (header, footer, nav, admin auth) changes.

## Per-page checklist

- [ ] Copy matches `docs/reference/04-master-website-copy.md` exactly (or the two late corrections in CLAUDE.md), no paraphrasing
- [ ] Colors, type, and spacing use `docs/tokens/*.css`, not hand-picked values
- [ ] Every button and link works: internal links go to real built pages (not 404s), external links (Stripe, Calendly) go to the exact URLs in `docs/reference/09-client-workflow-reference.md`
- [ ] No placeholder text or lorem ipsum left in
- [ ] Images either use a real approved asset from `assets/` or a clearly-labeled placeholder frame, never a broken image
- [ ] Mobile breakpoint checked, not just desktop
- [ ] Footer accordion behavior correct on mobile (see PAGE-INDEX.md footer section)
- [ ] Keyboard navigation reaches every interactive element, visible focus state present
- [ ] Alt text present on meaningful images
- [ ] Color contrast passes at a glance for body text and buttons (WCAG 2.1 AA target)

## Regression pass (run after any shared-component change or before ending a work session)

- [ ] Re-check every previously-completed page in PAGE-INDEX.md still loads and looks right
- [ ] Re-click through the full paid-service flow end to end: service selection → CSA acceptance logs a timestamped record → Stripe link → private scheduling page → Calendly embed loads
- [ ] Confirm intake form is reachable but not blocking booking
- [ ] Confirm admin login still works and dashboard still publishes a test post/photo live
- [ ] Confirm intake_submissions and csa_acceptances are NOT readable without authentication (try fetching them unauthenticated, it should fail)

## Before calling anything "done"

- [ ] Every checkbox above is checked, not assumed
- [ ] If anything couldn't be verified (e.g. can't test live Stripe payment without spending real money), say so explicitly instead of checking it off
