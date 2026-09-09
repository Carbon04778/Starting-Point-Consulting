# Starting Point Consulting

Website for Starting Point Consulting — stress and nervous-system science
education and coaching. Built by hand in Astro rather than a site builder
because the approved design specifies exact spacing and sizing on every page.

**Private repository.** It contains the client's reference package, pricing and
internal build notes. Keep it private.

## Running it

```bash
npm install
npm run dev      # sync assets, then astro dev
npm run build    # production build
npm run qa       # the full gate: build + every check below
```

### Checks

| Command | What it asserts |
|---|---|
| `npm run check:links` | no internal link 404s |
| `npm run check:pages` | one h1 per page, heading order, title/description, canonical, skip link, image alt |
| `npm run check:copy` | approved copy appears verbatim; retired wording does not |
| `npm run check:legal` | all 257 approved legal strings reach the built HTML; no advisory text, no placeholders |
| `npm run check:contrast` | every colour pairing clears WCAG AA, and the forbidden pairings still fail |
| `npm run check:rls` | the public browser key cannot read or write the private tables |

`check:rls` needs `.env`; the rest run offline.

## Where things are

```
src/pages/          one file per route, flat (the slugs are specified)
src/layouts/        BaseLayout, LegalLayout
src/components/     Header, Footer, ContactPanel, NewsletterSignup, Icon
src/copy/           approved copy, shared across pages
src/config/         routes, business details, third-party URLs, pending flags
src/lib/legal.js    parses the verbatim legal extraction — text is never retyped
docs/               the client package, build notes, open questions
supabase/migrations/  schema and Row Level Security
scripts/            build-time tooling and the QA checks
```

## Read before changing anything

- **`CLAUDE.md`** — the five working rules and the source-of-truth order.
- **`docs/OPEN-QUESTIONS.md`** — every place two approved documents disagree,
  and how it was resolved. Check here before "fixing" something that looks odd.
- **`docs/PAGE-INDEX.md`** — what is built and what is not.
- **`docs/SUPABASE-RLS-PROPOSAL.md`** — the data-protection design, in plain
  English, and the decisions still open.

Two rules worth repeating here because they are easy to break by accident:

1. **Do not guess.** If a price, URL, copy string or behaviour is not in
   `docs/reference/` or explicitly confirmed, ask rather than invent it.
2. **Legal text is never drafted or paraphrased.** It is extracted verbatim and
   rendered from `docs/legal-source/`. `npm run check:legal` enforces this.

## Environment

Copy `.env.example` to `.env` and fill it in. `.env` is gitignored and must stay
that way — it holds the Supabase credentials.

## Ownership

Built on the developer's accounts and transfers to accounts the client owns at
completion. Nothing account-specific is hardcoded: it all comes from `.env` and
the `admins` table, so the transfer is a matter of swapping values and rows.
