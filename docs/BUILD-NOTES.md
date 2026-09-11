# Build notes

How the repo is put together, and where it deliberately departs from the
handoff scaffold. Read alongside `CLAUDE.md`.

## Stack

- **Astro** — 26 mostly-static pages with exact, spec-driven spacing. Ships no
  JS by default; the small amount that exists (mobile menu, footer accordions)
  is inline in the component that owns it.
- **Vercel adapter** — deploys as static now. From Phase 4 the CSA acceptance
  log and the New Client Intake write through server endpoints so the Supabase
  service-role key never reaches the browser.
- **Supabase** — auth for the private admin area, plus the four tables. Nothing
  is created until the RLS policy has been stated in plain English and approved
  (CLAUDE.md "Data and security", rule 5).

```
npm run dev          # sync assets, then astro dev
npm run build        # sync assets, then astro build
npm run qa           # build, then crawl every internal link for 404s
npm run check:links  # crawl an existing dist/
npm run sync:assets  # re-copy assets/ -> public/assets/ with web-safe names
```

## Departures from the scaffold, and why

### 1. `src/pages/{main,legal,private}/` were removed

Astro routes by directory. Keeping those folders would have produced
`/legal/privacy-policy`, but the Legal Pages Index specifies `/privacy-policy`.
The same applies to every main page.

Pages therefore live flat in `src/pages/`, except the three post-payment
scheduling pages, which live in `src/pages/schedule/` because CLAUDE.md
specifies exactly `/schedule/60-minute-session` and its siblings.

The guidance those READMEs carried is unchanged and still applies:

- **Main pages** — don't start a page until its phase is approved (rule 5).
- **Legal pages** — do not draft legal text. See "Legal text" below.
- **Private pages** — New Client Intake and the three `/schedule/*` pages are
  `noindex`, absent from all navigation, and unreachable by public browsing.

### 2. `src/scripts/` was removed

The scaffold expected a shared JS folder. In Astro, component behaviour belongs
in a `<script>` inside the component that owns it, which keeps each behaviour
next to the markup it drives and means an unused component ships no JS at all.
Build-time Node scripts live in `scripts/` at the repo root.

### 3. `assets/` is copied, not served directly

`assets/` is the client-delivered tree and is never edited — when Darlene sends
the final production logo files (Handoff §02), they drop in there. Running
`npm run sync:assets` copies it to `public/assets/` with lowercase hyphenated
filenames, which Handoff §17 explicitly calls for ("Image filenames renamed
before upload"). `public/assets/MANIFEST.txt` maps every served URL back to its
source filename, and `public/assets/` is gitignored because it is generated.

**One exception to "never edited": `assets/downloadable-resources/`.** The
client delivers the downloadable resources as JS-rendered HTML documents
(the "DOWNLOADABLE RESOURCES - CURRENT - September 2026" package, kept
verbatim with its DISTRIBUTION STATUS in `docs/reference/downloadable-resources/`),
and its own instructions say to export each publicly cleared document to PDF
before publishing. `npm run export:resources` does that with headless Chrome
and writes the PDFs into `assets/downloadable-resources/`, from where
`sync:assets` serves them. The PDFs are committed so the Vercel build never
needs a browser. Only the documents cleared for public download are exported;
*Start Where You Are* is a direct-to-client handout and is never exported,
served, or linked. Served URLs live in `downloads` in `src/config/site.js`.

## Design tokens

`src/styles/global.css` imports the four files in `docs/tokens/` directly
rather than copying their values. There is exactly one definition of every
colour, size, and space, and it is the client's own. **Never write a token
value into `base.css` or `components.css`** — reference the variable.

Where the spec gives a number that has no token (the 72px header height, the
88px section padding), it is written once in `base.css` under
`:root` with its source cited in a comment.

## Where component values come from

Handoff §06 "Component library" and Page Blueprints Global 05 "Interaction
intentions" both describe the components. **Where they disagree, the Blueprints
govern** — the Blueprints describe the approved prototype, and say so
explicitly: "Where the two ever disagree, the prototype is correct."

The one place this mattered so far: Handoff §06 gives the primary button a
"soft lift" on hover; Blueprints Global 05 says active state has "no scale" and
the motion principle confines transitions to "colour, border, shadow, and
height". Buttons therefore change colour and shadow only — no transform
anywhere on the site.

## Legal text

The two interactive HTML files in `docs/reference/` are self-contained bundles
with a base64 manifest. They decode to readable source, and the eight legal
pages are present verbatim as `PrivacyPolicy.jsx`, `Terms.jsx`,
`Disclaimer.jsx`, `HipaaNote.jsx`, `Accessibility.jsx`, `Inclusion.jsx`,
`ClientAgreement.jsx`, and `TestimonialRelease.jsx` — the exact filenames
Master Copy §19 names as the source of approved text.

This means the legal copy does **not** have to be re-typed or reconstructed. It
is placed verbatim from the approved source.

One open question blocks the legal pages: each carries a `LegalCallout` block
addressed to Darlene's counsel ("provided as a thorough starting point, please
have it reviewed…"). Those are drafting notes, not client-facing policy.
Awaiting Darlene's decision — see `docs/OPEN-QUESTIONS.md`.

## Hiding vs. placeholdering

Pending Items states the rule: "where an input has not arrived, hide the
related element — no dead links, no empty download buttons, no non-functional
signup forms, no placeholder imagery."

Every such element is behind a flag in `src/config/site.js` under `pending`.
Flip a flag only when the real input actually lands.
