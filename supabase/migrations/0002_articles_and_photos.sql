-- ============================================================================
-- Starting Point Consulting — articles, site photos, media storage
--
-- Implements docs/ADMIN-CMS-PLAN.md (approved by Hadley, 12 September 2026).
-- Read that first; this is the executable form of it.
--
-- WHAT CHANGES FOR EACH ROLE when this file has run:
--
--   anon           may READ published articles and the site_photos slots, and
--                  may READ objects in the `site-media` bucket. Nothing else.
--                  Drafts do not exist as far as anon is concerned.
--   authenticated  the same as anon, UNLESS they have a row in `admins` —
--                  then full read/write on articles, site_photos and the
--                  bucket. (Sign-ups are disabled in the Supabase dashboard,
--                  so the only authenticated users are the ones we create.)
--   sp_writer      NOTHING here. The public site never writes articles.
--   service_role   bypasses all of this, as before. Never used by the site.
--
-- intake_submissions and csa_acceptances are NOT touched by this file.
--
-- Safe to re-run.
-- ============================================================================

-- ============================================================================
-- 1 · Articles — the Starting Points collection
-- ============================================================================
-- Blueprints Page 07 / 08, Master Copy §09 / §10. One row per post. The
-- byline is NOT a column: every article is "By Darlene Erich, MBA, BSN, RN"
-- (Handoff §13) and the page hard-sets it from business.founder.

create table if not exists public.articles (
  id          uuid primary key default gen_random_uuid(),

  -- URL segment under /starting-points/. Generated from the title in the
  -- editor, editable, and constrained here so a bad slug cannot be saved.
  slug        text not null unique
              constraint articles_slug_shape check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  title       text not null constraint articles_title_present check (length(trim(title)) > 0),

  -- One of the five approved topics (Master Copy §09 filters). "All" is a
  -- filter on the page, never a stored value.
  category    text not null
              constraint articles_category_approved check (category in (
                'Nervous System', 'Resilience', 'Leadership', 'For Individuals', 'Healthcare'
              )),

  -- The one-line card summary (§09 "Summary").
  summary     text not null default '',

  -- Blueprints Page 08 §4: "larger serif intro" before the body. Optional.
  lead        text not null default '',

  -- Markdown. Rendered server-side and sanitised before it reaches a browser.
  body_md     text not null default '',

  -- Read time shown on cards and the article header. Recomputed from body_md
  -- on every save in the editor (~230 words/min); the seeds below carry the
  -- approved numbers from §09 because their bodies do not exist yet.
  read_minutes int not null default 1 constraint articles_read_minutes_positive check (read_minutes >= 1),

  -- Blueprints Page 08 §5 "Topic tags". Free text, admin-entered.
  tags        text[] not null default '{}',

  -- Path inside the `site-media` bucket. NULL renders the approved
  -- brand-colour placeholder treatment, never a broken image.
  lead_image_path text,
  lead_image_alt  text not null default '',

  status      text not null default 'draft'
              constraint articles_status_known check (status in ('draft', 'published')),

  -- Set the first time status becomes 'published'; the "Date" in the
  -- article meta line and the ordering key for "newest".
  published_at timestamptz,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.articles is
  'Starting Points posts. Public sees status = published only; admins see and edit everything.';

create index if not exists articles_published_idx
  on public.articles (published_at desc) where status = 'published';
create index if not exists articles_category_idx
  on public.articles (category);

-- Keep updated_at honest without trusting the client.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 2 · Site photo slots
-- ============================================================================
-- Pending Items §03: the homepage hero, Speaking, and Our Approach photographs
-- have not arrived. When a slot has a row, the page uses it; when it does not,
-- the current placeholder treatment stays. This replaces the pending.*Photo
-- flags in src/config/site.js as the switch.

create table if not exists public.site_photos (
  slot         text primary key
               constraint site_photos_slot_known check (slot in ('home-hero', 'speaking', 'our-approach')),
  storage_path text not null,
  alt          text not null default '',
  updated_at   timestamptz not null default now()
);

comment on table public.site_photos is
  'Which uploaded image fills each placeholder photo slot on the public site.';

drop trigger if exists site_photos_touch_updated_at on public.site_photos;
create trigger site_photos_touch_updated_at
  before update on public.site_photos
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 3 · Storage bucket for uploaded images
-- ============================================================================
-- Public read: the images have to load on the public site. Write: admins only.
-- 5 MB cap and image MIME types only, enforced by the bucket and again by the
-- upload handler.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media', 'site-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================================
-- 4 · Lock the tables down, then open exactly what the plan says
-- ============================================================================
-- Migration 0001 §7 made new tables default to NO grants for anon and
-- authenticated, so both tables start closed. Everything below is an opening.

alter table public.articles    enable row level security;
alter table public.site_photos enable row level security;
alter table public.articles    force row level security;
alter table public.site_photos force row level security;

-- Belt and braces: strip anything a default might have handed out.
revoke all on public.articles    from anon, authenticated;
revoke all on public.site_photos from anon, authenticated;

-- The public site reads through anon. Admins read and write through their
-- own authenticated session. sp_writer gets nothing on purpose.
grant select                         on public.articles    to anon, authenticated;
grant insert, update, delete         on public.articles    to authenticated;
grant select                         on public.site_photos to anon, authenticated;
grant insert, update, delete         on public.site_photos to authenticated;

-- ============================================================================
-- 5 · Policies
-- ============================================================================

-- Articles: the public sees published rows and nothing else. Two policies
-- rather than one `or`: anon has no EXECUTE on is_admin() (0001 §1), and
-- Postgres does not promise to short-circuit before calling it.
drop policy if exists "public reads published articles" on public.articles;
create policy "public reads published articles"
  on public.articles for select to anon, authenticated
  using (status = 'published');

drop policy if exists "admins read all articles" on public.articles;
create policy "admins read all articles"
  on public.articles for select to authenticated
  using (public.is_admin());

drop policy if exists "admins insert articles" on public.articles;
create policy "admins insert articles"
  on public.articles for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins update articles" on public.articles;
create policy "admins update articles"
  on public.articles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete articles" on public.articles;
create policy "admins delete articles"
  on public.articles for delete to authenticated
  using (public.is_admin());

-- Photo slots: readable by all, writable by admins.
drop policy if exists "public reads site photos" on public.site_photos;
create policy "public reads site photos"
  on public.site_photos for select to anon, authenticated
  using (true);

drop policy if exists "admins write site photos" on public.site_photos;
create policy "admins write site photos"
  on public.site_photos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Bucket objects: anyone may read; admins may add, replace, remove.
drop policy if exists "public reads site-media" on storage.objects;
create policy "public reads site-media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "admins insert site-media" on storage.objects;
create policy "admins insert site-media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admins update site-media" on storage.objects;
create policy "admins update site-media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admins delete site-media" on storage.objects;
create policy "admins delete site-media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_admin());

-- ============================================================================
-- 6 · Seed — the seven launch entries from Master Copy §09, as DRAFTS
-- ============================================================================
-- Titles, categories, summaries and read times exactly as approved. Bodies do
-- not exist yet (§09: "publish bodies as they arrive"), so nothing is
-- published: a published card with no article behind it is a dead link.
-- Two titles are literally "to be supplied" in §09 and are seeded as such;
-- the mockup's guesses for them are NOT used (Master Copy outranks it).
--
-- The Everyday Regulation Toolkit is a Download card, not an article, and is
-- rendered from config once the PDF arrives — it is not seeded here.
--
-- `on conflict do nothing` so a re-run never overwrites edits Darlene has made.

insert into public.articles (slug, title, category, summary, read_minutes, status) values
  ('beyond-chronic-stress-what-regulation-really-means',
   'Beyond Chronic Stress: What Regulation Really Means',
   'Nervous System',
   'A plain-language look at what happens in the body under sustained stress, and the small, repeatable practices that help us find steadiness again.',
   6, 'draft'),

  ('resilience-title-to-be-supplied',
   '[Title to be supplied]',
   'Resilience',
   'A simple, science-informed practice for the middle of a hard day.',
   5, 'draft'),

  ('leading-from-a-regulated-place',
   'Leading from a Regulated Place',
   'Leadership',
   'Why a leader’s nervous system sets the tone for the whole team.',
   7, 'draft'),

  ('you-dont-have-to-be-in-crisis-to-get-support',
   'You Don’t Have to Be in Crisis to Get Support',
   'For Individuals',
   'On starting where you are, and why this work is for everyone.',
   4, 'draft'),

  ('healthcare-title-to-be-supplied',
   '[Title to be supplied]',
   'Healthcare',
   'Practical tools for the people who carry so much for others.',
   8, 'draft'),

  ('what-connection-does-for-the-body',
   'What Connection Does for the Body',
   'Resilience',
   'The quiet biology of feeling safe with other people.',
   6, 'draft')
on conflict (slug) do nothing;
