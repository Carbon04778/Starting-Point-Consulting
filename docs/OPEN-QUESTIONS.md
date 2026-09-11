# Open questions

Working rule 1: **do not guess.** Everything below is something the reference
package does not settle, or settles in two places that disagree.

Owner: **D** = Darlene, **H** = Hadley.

---

## Answered — recorded so they don't get re-opened

| # | Question | Decision |
|---|---|---|
| 1 | Primary button contrast (2.81:1, failed AA) | **Ink-900 label on gold-500.** 6.31:1 at rest, 4.55:1 hover. Brand fill `#C8902F` unchanged. Pressed state uses an inset shadow, not a darker fill — gold-700 under ink-900 drops to 3.01:1. |
| 2 | Five unspecified slugs | **Use the proposals:** `/individual-sessions`, `/our-approach`, `/booking`, `/free-guide`, `/new-client-intake`. |
| 3 | Contact in the top nav | **Yes — six items.** Per CLAUDE.md source-of-truth order (Handoff §07 and §17 over Blueprints Global 02). |
| 4 | Legal text source | **Extract verbatim** from the decoded prototype. Verified two ways: Master Copy §19's quoted Inclusion lines match exactly, and 22 of 23 CSA paragraphs match the separate agreements file. |

---

## Blocking

### 5. Homepage hero copy — two approved versions — D

**Blocks: nothing technically, but it is the most visible copy on the site.**

The hero eyebrow and supporting sentence differ between two approved sources:

| | Handoff §07 (built) | Master Copy §02 |
|---|---|---|
| Eyebrow | Nervous System Regulation · Well-Being · Lasting Change | Well-being · Resilience · Lasting change |
| Body | "Starting Point Consulting provides nervous system education, somatic practice, and resilience and well-being programs for individuals, healthcare teams, first responders, educators, leaders, and organizations. Based in Utah, working virtually and on site nationwide." | "We help people and systems better understand stress, build resilience, and create healthier ways of living, learning, and leading, translating neuroscience into simple, human tools for everyday life." |

The H1 and both buttons are identical in both.

**Built with the Handoff version**, for two reasons: it outranks Master Copy in
CLAUDE.md's source-of-truth order and calls itself "approved hierarchy, in this
order"; and §13 independently lists *"The declarative 'Starting Point
Consulting provides…' sentence high on the homepage"* among the five things
that matter most for search and AI.

Worth Darlene's eye anyway — the Master Copy version is warmer, the Handoff
version is more factual. One line to switch.

### 6. Four legal callouts are notes to counsel, not policy — D — RESOLVED, SHIPPED

**Was blocking Phase 3; the legal pages are now built.** The recommendation
below was applied: the four advisory callouts are dropped, the other three
publish verbatim. `src/lib/legal.js` identifies them by content and asserts the
4/3 split, so a change to the extracted text fails the build rather than
quietly publishing an advisory note to visitors. Reversible in one predicate if
Darlene wants them kept.

Each legal page carries a `LegalCallout`. **Four are client-facing content and
must publish. Four are drafting notes** that would tell visitors the policy has
not been reviewed by a lawyer.

**Publish — no decision needed:**
- Disclaimer — *"If you are experiencing a medical or mental health emergency… seek care from a qualified healthcare professional."*
- Accessibility Statement — the offer to supply information in an alternative format
- Non-Discrimination & Inclusion — *"We do not tolerate discrimination, harassment, or exclusion…"*
- Client Service Agreement — has no callout

**Decision needed — advisory:**
- Privacy Policy · Terms & Conditions — *"…provided as a thorough starting point. Please have it reviewed by qualified legal counsel and replace the bracketed placeholders…"*
- HIPAA Note — *"…is not legal advice. Please have it reviewed by qualified legal counsel…"*
- Testimonial & Media Release — *"This is a template release. Please have it reviewed by qualified legal counsel before use…"*

**Recommendation: remove those four, publish everything else verbatim.**

Full text: `docs/legal-source/*.txt`. Summary: `docs/legal-source/REPORT.md`.

### 7. Supabase RLS policy — H, then D — DRAFTED, AWAITING REVIEW

**Blocks Phase 4 and Phase 5.** Stated in plain English and sanity-checked
before any schema ships, per CLAUDE.md.

**Written up: `docs/SUPABASE-RLS-PROPOSAL.md`.** Nothing built — no Supabase
project, no migration, no client library installed. Hadley reviews first, then
the four decisions in it go to Darlene.

Headline of the proposal: the browser never holds a Supabase key and the public
site never talks to the database directly. Forms post to a server-side endpoint
that holds an insert-only credential. This is stricter than CLAUDE.md rule 3
asks, because RLS cannot make a public *write* endpoint trustworthy — if the
public anon key could insert into `csa_acceptances`, anyone could forge an
acceptance record, and an acceptance log anyone can write to is not evidence of
anything.

---

## Raised during Phase 1

Each was resolved the conservative way — nothing invented, nothing published
that isn't approved. Listed so Darlene can confirm or correct.

### 8. Heading levels promoted so each page has one h1 — H

Handoff §14 requires exactly one h1 per page. Two pages had none:

- **Services** — Master Copy §03 calls *"Support for every starting point"* an eyebrow. Handoff §09 says *"The Services page H1 is 'Support for every starting point.'"* Promoted to h1, and *"How we partner"* is the h2 over the grid. Both approved strings used.
- **About** — Master Copy §12 gives *"The journey behind the work"* as an h2 and no h1. Promoted. Same string.
- **FAQ** — Master Copy §13 titles the section *"FAQ — Questions & answers"*; Blueprints Page 12 wants eyebrow → H1. Split into eyebrow "FAQ" and h1 "Questions & answers" rather than printing the same words twice.

### 9. Buttons with no destination — omitted, not invented — H

- **"Read the full story"** (Master Copy §12, About). On the About page it would link to itself. No other destination is given. Omitted.
- **"Speaker kit"** (Blueprints Page 03, Speaking hero). ~~The Speaker Kit file is not in `assets/`. Omitted rather than shipping a button that downloads nothing.~~ **Built 10 Sept 2026** from the September package — but see #37, the kit is not final.
- **Feature card "link through to Speaking"** (Blueprints Page 02 §3). The card is about Integration Support, so a Speaking link doesn't follow, and Master Copy §03 gives it no button. Omitted. See #10.

### 10. Blueprints mislabels the feature card — H

Blueprints Page 02 §3 calls it the *"Speaking & Consulting feature card"*, then
describes *"three bulleted lines about integration, somatic practice, and
meaning-making"* — which is the Integration content. Master Copy §03 titles it
**"Transformation & Integration Support"** and supplies exactly those three
bullets. Built from Master Copy; the blueprint's label is stale.

### 11. Package caption doesn't fit the 3-session package — D

Master Copy §06 supplies one in-card package caption: *"One payment covers all
four sessions. Nothing more to pay when you schedule the rest."*

Correct for the 4-Session Package and the 4-Session Integration Path. **Wrong
for the 3-Session Leadership Package**, and no three-session wording is
supplied. The caption is omitted from that card rather than altered — changing
"four" to "three" would be editing approved copy.

Darlene: is a three-session version wanted?

### 12. Signature talk title marked "confirm title" — D

Master Copy §05 gives the first talk as **"From Surviving to Steady"** followed
by a *"confirm title"* marker. Built as written. Confirm or replace.

### 13. Contact form has no destination yet — H

Handoff §10 settles the inbox (`darlene@startingpointconsulting.com`) but not
the sending path. The form currently validates, shows the approved success
state in place, and logs its payload to the console — it does **not** pretend to
deliver. Wire it before launch; QA checklist requires *"forms arrive in the
right inbox with a success message."*

### 14. Purchase buttons point at a step that isn't built — H

Every service CTA points at `/checkout/<id>`, the Client Service Agreement
acceptance step (Phase 4). They deliberately do **not** link straight to Stripe:
Handoff §10 requires affirmative CSA acceptance *before* payment, and *"Stripe's
generic Terms of Service checkbox is not a substitute."*

`npm run check:links` reports these seven as missing. That is accurate — it is
the outstanding work on that page.

---

## Needed before the phase that uses them

### 15. 404 page copy is unapproved — D

Handoff §17 requires a 404 page; no approved copy exists. Current wording
("We could not find that page.") is deliberately plain and makes no claim about
the business, but Darlene has not seen it.

### 16. Client Service Agreement has two endings — D (low risk)

- **`ClientAgreement.jsx`** (prototype — the source the Legal Pages Index names for the website) says signature fields are *"provided on the document itself"* and gives the mailing address.
- **`Client Agreements.html`** is the printable version — literal signature lines, no mailing address.

**Recommendation: the prototype version for the web page.** It is the named
source, and Handoff §11 requires the mailing address on legal pages. All 22
other substantive paragraphs are identical.

### 17. Client Resources is still blocked, but less so — H

Master Copy §14 lists eight documents. ~~None are in `assets/`~~ **Update, 10
Sept 2026:** the "DOWNLOADABLE RESOURCES - CURRENT - September 2026" package
supplied three of them — Provider Resource, Speaker Kit, Overview One-Pager —
now exported to PDF in `assets/downloadable-resources/`. Its DISTRIBUTION
STATUS also clears the *Program One-Pager* for public download but the file
is **not in the package**. Still missing: Program One-Pager, the intake HTML
(now a web form, see #10 note), the Toolkit. *Start Where You Are* is a
client resource and will **never** be on this page. Building the page now
still means dead links, so it stays unbuilt.

Master Copy §14 also still lists two **retired** items — "Referral One-Pager"
and "For Referring Professionals" — replaced by the Provider Resource and "For
therapists & providers" (Handoff §16). And it instructs removal of its own
"Discovery Call Quick Intake" card.

---

## Raised during the prototype-alignment pass (home page + footer)

Hadley's instruction for this pass: *make the build strictly match the
prototype; for the footer add everything the prototype has, unless one of
Darlene's own documents contradicts it — then leave it out and flag it.*

Blueprints Global's own preamble already says *"Where the two ever disagree,
the prototype is correct"*, so the prototype governs **visual** decisions here.
**Copy and legal wording still follow the CLAUDE.md source-of-truth order**,
which is why the items below split the way they do.

### 18. Prototype footer content NOT added, because a higher doc retires it — D

| Prototype has | Why it was left out |
|---|---|
| "Book a call" in the Company column | Master Copy §18, *"Corrected September 2026"*: the universal CTA is retired. |
| "Cookie preferences" in the policies row | It opens a consent manager that is not built. Pending Items forbids shipping an inert control. Restore it with the manager. |
| `<NewsletterSignup variant="footer" />` | Pending Items §01 — platform not chosen; *"keep every signup component hidden rather than visible and inert."* |
| LinkedIn + Instagram icons | Pending Items §04 — *"omit the icon rather than linking nowhere."* The prototype's exact markup and 40px circle styling **are** built, gated behind `hasSocialLinks`; they appear the moment the URLs land in `site.js`. |

Everything else the prototype's footer contains is now built: emblem, type-set
wordmark, positioning line, the three link columns, the policies row with its
gold label, and the baseline — at the prototype's own sizes, colours, tracking
and spacing.

### 19. Footer positioning line — the prototype supplies a different sentence — D

The prototype prints **"Helping people and systems thrive in a complex world."**
Blueprints Global 03 only says *"one-line positioning statement"* without naming
one, and Master Copy §18 gives no footer line at all — so nothing contradicts
the prototype, and it is built as written.

Worth Darlene's eye anyway: Handoff §01 lists **"Nervous System Regulation.
Well-Being. Lasting Change."** as the approved positioning statement, and the
sentence the prototype uses duplicates the homepage H1. One line in
`Footer.astro` either way.

### 20. Footer baseline — prototype text NOT used — D

Prototype: "© 2026 Starting Point Consulting, LLC. All Rights Reserved."
Blueprints Global 03 Row 3: "© Starting Point Consulting · educational and
supportive, not therapy or medical care · Utah, working nationwide."

Kept the Blueprints sentence — the scope phrase *"educational and supportive,
not therapy or medical care"* is protected language (Legal Pages Index §03) and
the prototype's version drops it. The prototype's **styling** of the baseline
(13px, ink-300, hairline above at 8%) is applied. If Darlene wants the LLC
notice too, add it to the existing line rather than swapping it in.

### 21. Footer service-area line — kept although the prototype has none — H

Handoff §01 fixes the wording and §13 requires it on both `/` and `/contact`;
the footer is what satisfies that on the homepage. Removing it fails
`npm run qa` ("Service area line"), which is how the regression got caught. Set
in the quieter 13px legal-row tone so it doesn't compete with the positioning
line above it.

The footer **email address**, which the prototype also lacks, *was* removed — no
document requires it there, and it still appears in the Let's begin panel and on
the Contact page. Easy to restore if you'd rather keep it.

### 22. Documents row — rendered although the prototype never renders it — H

The prototype declares an `agreements` array (Client Service Agreement,
Testimonial & Media Release) and then never outputs it. Read as an oversight
rather than a decision: Master Copy §18 lists the row and Blueprints Global 03
Row 2 shows it beside the policies. Built with a "Documents" label styled to
match the prototype's "Policies" label.

### 23. Mobile footer accordions — the prototype collapses 2 of 3 columns — H

Blueprints Global 03 says *"columns 2–4 collapse into tappable accordions"*. The
prototype marks only **How we partner** and **Who we serve** with
`collapse: true`; **Company** stays open. Followed the prototype — one flag per
column in `Footer.astro` to change it back.

Implementation note: panels render **open** and collapse only once JS confirms a
mobile width, so the footer stays fully navigable without JS. The prototype
renders them closed. Identical with JS on.

### 24. Content container is 1200px, the prototype's is 1280px — D/H — NOT CHANGED

Blueprints Global 01 specifies a **1200px** container and the whole site is built
to it. The prototype's hero, services and footer all use its `--container-xl`
token, which is **1280px**.

Left at 1200px deliberately, and this is the **one prototype difference on the
home page that was not applied**: changing it is a site-wide layout change
affecting all 26 pages, and applying it to the homepage alone would leave it
wider than every other page. It's a one-line change to `--container-max` in
`base.css` whenever you want it. **Needs a decision.**

### 25. Hero — corner glow dropped, padding reduced — H

Blueprints Page 01 §1 describes *"a vertical cream → gold-50 wash and a gold
corner glow"*, and Global 01 sets hero padding at 104px. The prototype has a
**160deg** wash (sand-100 → gold-50 60% → sand-200), **no** corner glow, and
88px/96px padding. Built to the prototype on all three.

### 26. Let's begin panel — prototype heading NOT used — D

The prototype uses eyebrow **"Let's begin"** + H2 **"Start where you are."**
Master Copy §16 and Blueprints Page 01 §5 agree with *each other* that the **H2**
is "Let's begin", so the H2 stands and no eyebrow renders — there is no approved
eyebrow string for it. Two further prototype strings here are superseded and were
not used: the button *"Book a discovery call"* (retired with the universal CTA)
and *"Discovery calls, Monday through Thursday"* (Master Copy: *"Organizational
discovery conversations, Monday through Thursday"*). All of the panel's
**layout** is the prototype's.

### 27. Four pillars have no icons — H

Blueprints Page 01 §2 asks for a *"52px gold-50 icon plate"* on each pillar card.
Handoff §06 says of the four-pillar section: *"Pillar name in Jost 600, one
sentence beneath. **No icons needed.**"* Handoff outranks Blueprints, and the
prototype has no homepage approach band to break the tie, so the pillars stay
icon-free. This also avoids inventing four glyphs that no document assigns.

### 28. Two tones inferred, because the components are missing from the bundle — H

`ServiceCard` and `Eyebrow` are referenced throughout the prototype, but the
design-system namespace they live in
(`StartingPointConsultingDesignSystem_e40da0`) is **not present in the mockup
bundle** — so their internals can't be read. Two values were mapped by following
the pattern the visible components establish:

- **`tone="ink"`** service plate (Leadership & Team Development) → `ink-100`
  behind `ink-700`, matching how gold and sage each use their 50/700 pair. Ink
  has no `50` step, so its lightest, `ink-100`, carries it.
- **`tone="sage"`** eyebrow ("Who we serve") → `sage-700` type over a `sage-300`
  rule, mirroring the gold eyebrow's 700-over-500.

Both clear AA in `npm run check:contrast`. Everything else on the homepage is
read directly from the page modules, which *are* in the bundle, so these two are
the only inferred values.

Icon **geometry** is not inferred: the paths in `Icon.astro` were extracted from
the prototype's own bundled copy of Lucide, drawn at its `SPIcon` stroke of 1.75.

---

### 29. Footer newsletter — built and visible, ahead of a platform choice — D

**Reverses item 18's newsletter row.** Pending Items §01 says to keep every
signup component hidden until Darlene picks a platform; Hadley reviewed the
first pass against the prototype and directed that the footer newsletter be
built. Built accordingly, at
`src/components/NewsletterSignup.astro`, in the prototype's own position and to
its own measurements.

**Copy is fully approved.** Master Copy §17 supplies every string — the eyebrow
"The newsletter", the compact/footer body, the field label "Email address", the
placeholder "Your email", the button "Subscribe", and the success line. The
**one** unapproved string is the validation message, *"Enter your email address
so we can add you to the list."* — §17 supplies none. It follows the shape of
the contact form's existing constructed errors (*"Enter your {field} so we can
reply."*). Swap it freely; it is one line in `src/copy/shared.js`.

**It has no destination.** The prototype carries `TODO(ConvertKit)` at this
exact spot. The form follows the same house pattern as the contact form: it
validates, shows the approved success state in place, and `console.info`s the
payload. **This must be wired before launch** — it now sits alongside the
contact form in that respect (see #13), and both are on the pre-launch list.
Choosing between Beehiiv and Kit/ConvertKit is still Darlene's call.

The `pending.newsletter` flag in `src/config/site.js` is now **only** about the
platform choice, not about whether the component renders. The two other signup
placements (Starting Points band, end-of-article inline card) are on pages not
yet built; decide there whether they follow the footer or stay hidden.

#### Four accessibility departures from the prototype in this component

The prototype's footer field would fail WCAG at three points and the Handoff's
own tap-target floor at a fourth. All four are single values, all reversible,
and all now covered by `npm run check:contrast`:

| | Prototype | Built | Why |
|---|---|---|---|
| Submit arrow | `#fff` on gold-500 — **2.81:1** | ink-900 — **6.31:1** | Below the 3:1 WCAG 1.4.11 wants for a meaningful glyph, and the exact pairing the contrast script already guards as forbidden. Every other primary button on the site is already ink-900 on gold-500. |
| Field border | 20% white — **1.91:1** | 40% white — **3.75:1** on the gradient's ink end, **3.13:1** on the sage end | A control's boundary needs 3:1 (WCAG 1.4.11). 40% is the first step that clears it at *both* ends of the footer gradient. This is the only one of the four that is visible at a glance — the field outline reads a little brighter than the mockup. |
| Control size | 42px | 44px | Handoff §14: "tap targets at least 44px". |
| Focus | `outline: none`, nothing in its place | Site focus ring | Handoff §14 requires a visible focus indicator. |

If Darlene wants the mockup's exact softer field outline, the trade is stating
that the 3:1 boundary rule is being waived there — worth a deliberate decision
rather than a silent revert.

#### Still hidden

The **social icons** above the newsletter remain gated behind `hasSocialLinks`
(Pending Items §04 — an icon linking nowhere is worse than no icon). Their
markup and the prototype's 40px circle styling are built; drop the two URLs into
`pending.linkedInUrl` / `pending.instagramUrl` and they appear.

---

## Raised during the legal-pages phase

### 30. Legal page titles and meta descriptions are unspecified — H

Handoff §13's metadata sheet covers the **nine public marketing pages only** and
gives the eight legal pages no title and no description. Both are structurally
required, so:

- **Title** follows §13's own pattern, `<Page> | Starting Point Consulting`, over
  the **approved footer label** from Legal Pages Index §01 rather than the full
  document title. Every one lands under §13's 60-character cap (longest:
  "Non-Discrimination & Inclusion | Starting Point Consulting", 58).
- **Description** is the page's own approved `INTRO` sentence, verbatim.

Nothing is invented either way. The descriptions run 99–178 characters rather
than §13's 150–160, so the legal set is **exempt from that length rule** in
`scripts/check-pages.mjs` — §13 never set a target for them and Legal Pages
Index §02 excludes these pages from "search-engine priority". They are still
required to *have* a title and description, and the title cap still applies.

These pages are **not** `noindex`. §02 excludes them from search-engine
priority, which is not the same as removing them from the index; a reachable
privacy policy is normally expected to be indexable. Say so if you want them
noindexed — it is one prop on `LegalLayout`.

### 31. Two "placeholders" in the advisory callouts were already stale — H

The four advisory callouts (see #6) each told the reader to "replace the
bracketed placeholders (effective date, business address, and governing
state)". Two of those three no longer existed in the text:

- **Governing state** is already **Utah**, written into Terms §15 and Client
  Service Agreement §11.
- **Business address** is already inline — *Starting Point Consulting, LLC,
  8850 S 700 E #493, Sandy, UT 84070* — in Accessibility, Privacy, Terms, HIPAA
  and the CSA. Handoff §11 marks it "confirmed".

Only the **effective date** was genuinely open, and CLAUDE.md settles it:
launch day, **21 September 2026**, now rendered on all six pages that carry a
"Last updated" line (Disclaimer and Inclusion have none in the source).

Legal Pages Index §04 still lists "Darlene to confirm this is the address to
publish" as a pre-launch item. Handoff §11 already calls it confirmed, so this
is a courtesy re-check rather than a blocker.

### 32. Legal pages follow Legal Pages Index §02, not the prototype — H

The home page and footer were built strictly to the prototype on Hadley's
instruction, and Blueprints Global defers to it. **These pages do not**, because
they have a dedicated spec — Legal Pages Index §02 "Shared layout" — that is
specific to them, and CLAUDE.md ranks the mockup last. §02 governs; the
prototype's `LegalPage` shell fills the gaps §02 leaves (H1 size, the intro
treatment, callout styling, section padding).

Where they disagree, and §02 won:

| | Prototype | Built (§02) |
|---|---|---|
| Text column | 760px | 680px |
| Ground | `--surface-page` (warm sand) | cream (`sand-50`) |
| Sub-headings | `--text-lg` (22px) | Jost 600 at 19px |
| Body | `--text-base` / 1.7 | 16px / 1.68 |
| "Last updated" | 12px tracked uppercase, `--text-subtle` (ink-400) | 13px ink-500, sentence case |
| Page end | two buttons: "Back to home" + "Questions? Contact us" | one "Contact us" text link |

The ink-400 one is not only §02: ink-400 on cream is **3.04:1**, and the
palette rule in Handoff §03 forbids ink-400 and ink-300 for small text.

Note the 680px column puts the outer edge at 760px including the gutter —
which is exactly the prototype's own `maxWidth`, so the two agree on the
overall block and differ only on where the padding sits.

---

## Raised building For Therapists & Providers and Booking

### 33. The providers page describes an intake that no longer asks those questions — D

**One approved paragraph is deliberately not rendered.** Master Copy §15 and
the prototype both end the confidentiality section with:

> "Our intake asks whether a client is working with a provider and who referred
> them, so we know from the start that you're part of their support."

That is **no longer accurate.** The New Client Intake implementation note
(`docs/reference/10-new-client-intake-note.md`, September 2026) removed exactly
those fields "by decision" and forbids restoring them, naming *"referral source
with a therapist/provider option"*, *"referring-provider name"* and
*"current-provider information"* specifically.

So the sentence would tell healthcare providers we collect information about
them that we deliberately do not collect — a factual claim about personal data,
made to professionals who may act on it, on the page where they decide whether
to share our information with a patient. It is withheld rather than
shipped-with-a-flag for that reason.

Note the contact form is not a substitute: Master Copy §16 gives it *"Who
referred you? (optional)"* but nothing about whether the client is working with
a provider, so even re-pointing the sentence at the contact form leaves half of
it untrue.

**Darlene decides the replacement wording.** Three obvious directions — say
nothing, describe what the contact form actually asks, or put the fields back
into the intake (which would need the note reopened). Restoring or replacing it
is one paragraph in `src/pages/for-therapists-and-providers.astro`, where the
full text sits in a comment.

### 34. Handoff §13's own metadata breaks §13's own length rule — H

§13 opens with *"Titles under 60 characters, descriptions 150–160"*, then
supplies for For Therapists & Providers:

- Title, **69 chars**: "For Therapists & Healthcare Providers | Starting Point Consulting"
- Description, **190 chars**: "Information for providers: nervous system education and practical regulation practices that may complement the care you already provide. Educational and supportive, never clinical treatment."

§13 also says *"Titles and meta descriptions from section 13, entered per
page."* The supplied strings are approved copy and are used verbatim; shortening
them would be inventing copy. `scripts/check-pages.mjs` carries a named
exemption for this route with the reasoning attached.

Practical effect: Google will truncate both in results — the title around 60
characters and the description around 160. Nothing breaks, but the tail of each
will not show. If Darlene wants control over what is cut, she supplies shorter
strings; otherwise this is fine to leave.

No other §13-supplied page exceeds the limits.

### 35. Booking is a Calendly embed, and the blueprint's calendar is not rebuilt — H

Blueprints Page 05 describes a month grid, day/time selection, a "Confirm,
[Month] [Day], [time]" button and a "You're booked." confirmed state — then says
plainly: *"In Squarespace this page is a Calendly embed, not a custom calendar.
The prototype's calendar exists to show the intended layout and labelling
only."*

So all of that is Calendly's own UI and is not reimplemented; rebuilding it
would put a second, non-functional calendar next to the real one. The page
supplies the H1, the single event row, the reassurance captions and the embed.

Only the **Organizational Discovery Conversation** is offered, per Master Copy
§07's "Corrected September 2026" note retiring the six-row session picker. The
three paid Calendly events are not referenced anywhere on the page — asserted in
the build output.

Two things worth knowing:

- **The embed loads a third-party script** from `assets.calendly.com`, which
  sets its own cookies. The cookie consent manager is not built yet (#18), so
  there is currently nothing gating that. Worth settling before launch.
- **There is a fallback.** If the script is blocked or fails, the visitor gets a
  direct link to the Calendly page and a link to the contact form, rather than
  an empty frame. `<noscript>` covers the JS-disabled case.

### 36. `/booking` slug is still unconfirmed — D

One of the five proposed slugs from #2. The page is built at `/booking`;
changing it is a filename and one line in `routes`.

## Raised placing the September 2026 Downloadable Resources

### 37. The Speaker Kit is live with placeholders in it — H, then D

Hadley's instruction (10 Sept 2026): *"Use it as the current version for now.
A finalized Speaker Kit will be provided separately once the remaining
placeholders are completed."* Built as instructed — the "Speaker kit" button
on the Speaking hero opens `starting-point-speaker-kit.pdf` in a new tab.

**What a visitor sees in that PDF today:**

- **"[Speaker Name], RN, BSN, MBA"** — a bracketed placeholder, and the
  credential order contradicts the same-day instruction to use *"Darlene
  Erich, MBA, BSN, RN"* everywhere. The site itself is consistent; the PDF is
  the only public-facing place the old order survives.
- "HEADSHOT HERE" and a "SPEAKER PHOTO · PLACEHOLDER" frame.
- A **draft testimonial** attributed to *"[ADD A REAL TESTIMONIAL FROM A PAST
  EVENT]"*. Pending Items forbids publishing any testimonial without a signed
  release; this one is invented.
- A yellow **"Draft for review"** callout addressed to Darlene.

**Recommendation:** hide the button until the finalised kit arrives. It is one
line — set `downloads.speakerKit` to `null` in `src/config/site.js`. The rest
of the wiring stays. When the final HTML lands, drop it into
`docs/reference/downloadable-resources/`, run `npm run export:resources`, and
set the value back.

### 38. Start Where You Are QR code — nothing to build on the site — H

The QR code lives on the *Start Where You Are* handout, which is Darlene's
direct-to-client document and not part of the website. The website has no QR
element and needs none. Darlene will generate the code against the permanent
`startingpointconsulting.com` URL once it is live; the only site-side
requirement is that the permanent URL is final before she does.

## Raised after the Stripe redirects went live

### 39. Should the post-payment scheduling pages expire? — D, asked 11 Sept 2026

The three `/schedule/*` pages are unlisted and `noindex`, but a client who
bookmarks one after paying can return and book again without paying, or
forward the link. **This is the design Handoff §10 chose**: package clients
"reuse the same private Calendly event link" for sessions 2–4, and there is to
be "no membership system, login, or client portal." The safeguard is the `?p=`
product tag every redirect adds to the Calendly booking, which Darlene
cross-checks against Stripe.

A real lock-down needs both halves: verify `{CHECKOUT_SESSION_ID}` with
Stripe server-side and record it as redeemed in Supabase, **and** issue
one-time Calendly links via the Calendly API — otherwise the permanent
Calendly URL inside the page is still reusable. That also changes how package
clients book their remaining sessions.

Hadley put three options to Darlene on 11 Sept 2026: (1) launch as designed,
recommended; (2) lock down before launch; (3) lock down after launch.
**Awaiting her answer.** Options 2 and 3 are a new data structure and need a
plan approved first (rule 5).

---

## Pending inputs from Darlene — element hidden until they arrive

Pending Items rule: *hide the related element, never ship a placeholder.*
Each is one flag in `src/config/site.js`.

| Input | Element currently hidden |
|---|---|
| Newsletter platform (Beehiiv vs Kit/ConvertKit) | Footer signup is now **built and visible** but unwired (#29); the other two placements are on unbuilt pages |
| LinkedIn / Instagram URLs | Footer social icons, `sameAs` in structured data |
| Everyday Regulation Toolkit PDF | Free guide delivery, the Starting Points download card |
| Signed testimonial releases | The two About-page quotes |
| Homepage hero photograph | Emblem medallion stands in, per Blueprints Page 01 §1 |
| Speaking photograph | Approved founder portrait stands in |
| Our Approach supporting image | Brand-colour placeholder frame |
| Open Graph 1200×630 graphic | `og:image` omitted entirely, not pointed at a stand-in |
| Final production logo files | Reference exports in use; drop finals into `assets/`, run `npm run sync:assets` |

---

## Stale numbers in the docs — resolved, no action needed

- **"All eighteen questions"** (Master Copy §13, Blueprints Page 12). The list is **16**, and the prototype's FAQ module has the same 16 in the same order. Built 16.
- **"Resilience & Well-Being & Resilience"** (Blueprints Page 02). Typo. Canonical name is **Resilience & Well-Being Programs**.
- **Eight credential badges** (Blueprints Page 10). Handoff §01 approves five and says *"do not add anything to this set."* Using five.
- **"Five total" post-payment pages** (Blueprints Page 06). Superseded in the same document — **three**, grouped by session length.
- **Squarespace 7.1.** Every reference doc assumes it; CLAUDE.md specifies a hand-built site. Squarespace instructions read as intent.
- **Prototype FAQ answers** carry *"drafted in-brand… review & edit before publishing."* Master Copy §13 answers supersede them.
- **"Travel nationally" line.** `PAGE-INDEX.md` puts Darlene's correction on the Speaking page; the sentence lives in Master Copy §06 on the Individual Sessions page. Correction applied where the sentence actually appears, and verified by `npm run check:copy`.
- **Four-pillar descriptions.** Handoff §01 and Master Copy §02 word them differently. §01 is the brand-level definition; §02 is the homepage card copy. The homepage uses §02.
