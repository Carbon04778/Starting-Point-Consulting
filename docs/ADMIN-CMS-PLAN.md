# Admin area + Starting Points — plan for approval

Written 12 September 2026. Approved and built the same day — see "Status" at the end.
Kept as the record of what was agreed: two tables, a storage
bucket, RLS policies, and a login, each needing approval under rule 5.

## What it delivers

| Piece | Route | Spec |
|---|---|---|
| Admin login | `/admin/login` | CLAUDE.md "2-screen private admin area", Supabase Auth |
| Admin dashboard | `/admin` | "write/edit article, upload/swap photo, publishes immediately" |
| Starting Points index | `/starting-points` | Blueprints Page 07, Master Copy §09, Handoff §13 metadata |
| Article page | `/starting-points/<slug>` | Blueprints Page 08, Master Copy §10 |

The index and article pages are currently the only two nav/footer links that
404 (`check:links` has been reporting them since Phase 1).

## Data

### `articles`

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `slug` | text unique | generated from the title, editable, `[a-z0-9-]` only |
| `title` | text | |
| `category` | text | one of the six approved: Nervous System · Resilience · Leadership · For Individuals · Healthcare (plus "All" as a filter, never a value) |
| `summary` | text | the one-line card summary |
| `body_md` | text | Markdown; rendered server-side, HTML-sanitised |
| `read_minutes` | int | computed from `body_md` word count on save (≈230 wpm), never typed |
| `lead_image_path` | text null | storage path; null renders the approved brand-colour placeholder |
| `status` | text | `draft` \| `published` |
| `published_at` | timestamptz null | set the first time status becomes `published` |
| `created_at`, `updated_at` | timestamptz | |

Byline is **not a column**. Every article is "By Darlene Erich, MBA, BSN, RN"
(Handoff §13), hard-set from `business.founder`.

### `site_photos`

Answers "upload/swap photo" for the page slots that are still placeholders
(Pending Items §03): `home-hero`, `speaking`, `our-approach`, plus per-article
lead images. A row per slot: `slot text pk, storage_path text, alt text,
updated_at`. When a slot has a row, the page uses it; when it does not, the
current placeholder treatment stays. `pending.heroPhoto` etc. in `site.js`
stop being the switch — the table is.

### Storage bucket `site-media`

Public **read** (images have to load on the public site), **write only via
`is_admin()`**. Uploads are renamed to `<slot-or-slug>-<timestamp>.<ext>` so
the Handoff §17 "filenames renamed before upload" rule holds. Max 5 MB, image
MIME types only, enforced in the bucket policy and again in the upload handler.

## Row Level Security — in plain English

Same posture as the existing migration: RLS enabled **and forced**, default
grants revoked, then only these openings.

- **`articles`** — anyone (anon or signed-in) may **read rows where
  `status = 'published'`**. Nothing else is visible to the public: drafts do
  not exist as far as the site or the API is concerned. Admins
  (`is_admin()`) may read, insert, update and delete everything.
- **`site_photos`** — anyone may read. Admins may write.
- **`site-media` bucket** — anyone may read objects. Admins may insert, update,
  delete.
- **`intake_submissions` / `csa_acceptances`** — **unchanged.** Still
  admin-read-only, still `sp_writer`-insert-only. The dashboard reads them
  through the signed-in admin's own session, which is exactly what the
  existing "admins read" policies were written for.

`is_admin()` and the `admins` table already exist. No new roles. The
`sp_writer` role gets **no** grants on the new tables — the public site never
writes articles.

## Auth

- Supabase Auth, **email + password**, one user: Darlene (Hadley during the
  build, removed at transfer — same "one row in, one row out" handover as the
  `admins` table).
- Sign-ups **disabled** in the Supabase dashboard. Nobody can create an
  account; an account that is not in `admins` sees a 403 on every admin route
  even if it somehow existed.
- Server-side session in an `HttpOnly; Secure; SameSite=Lax` cookie via
  `@supabase/ssr`. Every `/admin/*` route runs `prerender = false`, checks the
  session **and** `is_admin()` on the server, and redirects to `/admin/login`
  otherwise. No admin UI is ever shipped to an anonymous browser.
- All `/admin/*` routes are `noindex`, absent from nav, footer and sitemap.
- No password reset UI at launch — Darlene resets via the Supabase email flow
  if needed. Fewer moving parts.

## The dashboard, concretely

One page, four panels. Plain HTML forms, server-rendered, minimal JS — the same
no-JS-by-design posture as checkout.

1. **Articles** — list (title, category, status, updated), "New article",
   edit. The editor: title, slug, category (select), summary, lead image
   (upload or choose existing), body (Markdown textarea with a short legend:
   `## Subheading`, `> pull quote`, `- list`). Buttons: **Save draft**,
   **Publish**, **Unpublish**, **Preview** (renders the real article page with
   the admin's session, so drafts can be seen before they go live).
2. **Photos** — the three page slots with current image (or "placeholder"),
   upload/replace, alt text.
3. **Intake submissions** — read-only table, newest first, click to expand.
   This is the "authenticated/private admin side" Darlene asked for; today the
   only way to read an intake is the Supabase dashboard.
4. **Agreement acceptances** — read-only table: name, email, service,
   agreement version, timestamp. Same reason.

No delete on panels 3 and 4 — retention is still under attorney review
(CLAUDE.md, round 2), and the UI should not offer what policy has not decided.

## Public pages

- **`/starting-points`** — `prerender = false` so a publish is live on the next
  request ("publishes immediately"), `Cache-Control: s-maxage=60`. Filter
  chips are query-string driven (`?topic=leadership`) so they work without JS
  and are linkable; JS enhances to instant filtering. Featured = newest
  published; grid = the rest; empty state verbatim from §09. Toolkit
  "Download" card and the newsletter band stay behind their existing
  `pending` flags.
- **`/starting-points/[slug]`** — `prerender = false`; 404 for drafts and
  unknown slugs. Byline, meta, lead image (or placeholder), body, tags, share
  row, "Keep reading" = three most recent published articles in the same
  category (falling back to any category). `Article` structured data per
  Handoff §13. Share links go to `linkedin.com/sharing/share-offsite` and
  `facebook.com/sharer` — those two hosts need adding to the `check-links`
  external allow-list, which currently permits only Stripe/Calendly/own
  origin.

## Seeding

The seven §09 launch entries are inserted as **drafts**, with their approved
titles, categories, summaries and read times. Not published, because:

- **No article body exists.** Master Copy §09 says "only the featured
  article's body copy exists as approved text", but it is not in the Master
  Copy, and the mockup's `Article` module body is bracketed template text
  ("[Body copy goes here…]"). Publishing a card with no article behind it is a
  dead link (rule 3).
- Two entries are literally "title to be supplied". The mockup gives them
  titles ("Three Breaths: A Reset You Can Use Anywhere", "Sustainable Care:
  Resilience for Healthcare Teams") but Master Copy outranks the mockup and
  says unsupplied.

So at launch `/starting-points` shows the empty state until Darlene publishes
her first article from the dashboard. The alternative — showing the seven
cards unlinked — contradicts rule 3 and the "Read article" button in §09.
**This is the one place I would like an explicit decision.**

## Decisions needed before building

1. **Go / no-go on the whole plan** (rule 5).
2. **Launch state of Starting Points** — empty state until the first real
   article (recommended), or something else?
3. **End-of-article author bio.** Handoff §13 requires "a short author bio at
   the end of every article" and no approved text exists for it. Options: the
   About page's first bio paragraph, or ask Darlene for two sentences. Not the
   LEAD Futures sentence — Handoff §01 confines that to three named places.
4. **Panels 3 and 4** (intake + acceptances in the dashboard) — include now, or
   leave Darlene on the Supabase dashboard for launch?
5. **Which email is the first admin?** Yours during the build; I need it to
   seed the `admins` row (the value goes in a migration seed run by hand, not
   in code).

## Order of work, once approved

1. Migration `0002_articles_photos.sql` — tables, bucket, policies;
   `check:rls` extended to assert the new policies.
2. Auth plumbing: `@supabase/ssr`, session helper, `/admin/login`, the
   admin guard.
3. Dashboard panel 1 (articles) + editor + Markdown render + sanitiser.
4. `/starting-points` and `/starting-points/[slug]`; `check:links` goes green
   for the first time.
5. Panel 2 (photos) and the three page slots.
6. Panels 3–4 if approved.
7. QA pass per `QA-CHECKLIST.md`; `npm run qa`; manual mobile check of the
   editor at 390px, since Darlene may well publish from a phone.

New dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `marked`,
`sanitize-html`. All server-side; the public bundle gains nothing.

## Status — 12 September 2026

Approved by Hadley the same day and built as written, with these resolutions
of the decisions above:

1. Go — approved.
2. Empty state until the first real article — built (OPEN-QUESTIONS #41).
3. Author bio — **not drafted**; slot withheld pending Darlene's text (#40).
4. Panels 3 and 4 — built, read-only.
5. First admin — Hadley's address, seeded by hand with `supabase/admin-seed.sql`.

Files: `supabase/migrations/0002_articles_and_photos.sql`, `src/middleware.js`,
`src/lib/{supabase,articles,photos}.js`, `src/layouts/AdminLayout.astro`,
`src/pages/admin/*`, `src/pages/api/admin/*`, `src/pages/starting-points/*`,
`src/components/ArticleCard.astro`. `npm run check:rls` covers the new tables.

Outstanding at the time of writing: applying the migration and seeding the
admin in Supabase (Hadley), then the end-to-end test and the manual QA pass of
the editor at 390px.
