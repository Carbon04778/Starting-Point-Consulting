# Supabase

Migrations live in `migrations/`, numbered, safe to re-run. Apply each in the
Supabase SQL editor (or with the Supabase CLI) in order.

| File | What it does | Approved by |
|---|---|---|
| `0001_initial_schema.sql` | `admins`, `csa_acceptances`, `intake_submissions`, the `sp_writer` insert-only role, RLS | `docs/SUPABASE-RLS-PROPOSAL.md`, Darlene's round-2 decisions |
| `0002_articles_and_photos.sql` | `articles`, `site_photos`, the `site-media` bucket, RLS, six draft seeds | `docs/ADMIN-CMS-PLAN.md`, Hadley 12 Sept 2026 |

`admin-seed.sql` is **not** a migration: it makes one Auth user an
administrator. Run it by hand, once per admin, after creating the user in
Authentication → Users. Handover = swap the rows.

After any migration or policy change, run `npm run check:rls`. It attacks the
database with the public browser key and must report every attempt BLOCKED.

The public site never holds the service-role key. Reads use the anon key
under RLS; public-site writes (intake, CSA) use `sp_writer`; admin writes use
the signed-in admin's own session.
