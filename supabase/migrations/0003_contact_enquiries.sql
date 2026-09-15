-- ============================================================================
-- 0003 · Contact enquiries
--
-- Darlene, 15 September 2026: "Please have contact form enquiries land in
-- the private admin section for now. I don't think we need to add the email
-- automation at launch. I'll make checking the admin section part of my
-- regular workflow."
--
-- Same shape as intake_submissions (0001 §4–6), same two roles:
--   sp_writer      the form endpoint. INSERT only, no SELECT — an insert must
--                  never ask for the row back.
--   authenticated  may SELECT, but the policy hands rows only to admins.
--   anon           granted nothing, no policy: default deny.
--
-- No UPDATE or DELETE for anyone. An enquiry is a record of a message
-- received; the admin view is read-only, like intake.
-- ============================================================================

create table if not exists public.contact_enquiries (
  id           uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),

  full_name text not null,
  email     text not null,
  -- The "I am a…" choice (src/copy/shared.js contactForm). Free text here so
  -- a change to the option list never breaks an insert.
  role      text not null default '',
  message   text not null,

  -- Which page the shared panel was on: /, /services, /contact.
  source_path text not null default ''
);

comment on table public.contact_enquiries is
  'Contact form ("Let''s begin") messages. Read only from the admin area; no email automation at launch (Darlene, 15 Sept 2026).';

create index if not exists contact_enquiries_submitted_at_idx
  on public.contact_enquiries (submitted_at desc);

-- Writer role: insert only.
grant insert on public.contact_enquiries to sp_writer;

-- RLS on and forced; strip default grants; give back SELECT to logged-in
-- users only, and let the policy narrow that to admins.
alter table public.contact_enquiries enable row level security;
alter table public.contact_enquiries force row level security;
revoke all on public.contact_enquiries from anon, authenticated;
grant select on public.contact_enquiries to authenticated;

drop policy if exists "admins read enquiries" on public.contact_enquiries;
create policy "admins read enquiries"
  on public.contact_enquiries for select to authenticated
  using (public.is_admin());

drop policy if exists "writer inserts enquiries" on public.contact_enquiries;
create policy "writer inserts enquiries"
  on public.contact_enquiries for insert to sp_writer
  with check (true);
