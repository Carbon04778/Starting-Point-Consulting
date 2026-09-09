-- ============================================================================
-- Starting Point Consulting — initial schema and Row Level Security
--
-- Implements docs/SUPABASE-RLS-PROPOSAL.md. Read that first; this is the
-- executable form of it.
--
-- Darlene's requirement, verbatim:
--   "Please make sure the intake submissions and Client Service Agreement
--    records are accessible only through the authenticated/private admin side
--    and aren't publicly accessible through the site or database/API."
--
-- THE FOUR ROLES, and what each can do when this file has run:
--
--   anon           the public website. NOTHING. No read, no write, on any of
--                  these tables. This is the default-deny CLAUDE.md requires.
--   sp_writer      the form-submission endpoint. INSERT only, on two tables.
--                  Cannot read a single row back, ever.
--   authenticated  a logged-in user. Nothing, UNLESS they have a row in
--                  `admins` — then read-only.
--   service_role   bypasses all of this (Postgres BYPASSRLS). Which is exactly
--                  why the public site never uses it. Migrations and ops only.
--
-- Safe to re-run.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1 · Who is an administrator
-- ============================================================================
-- An explicit list, deliberately not "any authenticated user". There are no
-- client logins today (Handoff §11: "no membership system, login, or client
-- portal"), but writing the policies as `TO authenticated` would silently turn
-- into a data leak the day one is ever added.
--
-- At handover this is how Darlene becomes primary admin: one row in, one out.
-- Nothing anywhere else references a personal account.

create table if not exists public.admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  email    text        not null,
  added_at timestamptz not null default now(),
  note     text
);

comment on table public.admins is
  'Who may read intake submissions and CSA acceptances. Handover = swap the rows.';

-- SECURITY DEFINER so a policy can consult this table without the caller
-- needing SELECT on it. That also breaks what would otherwise be infinite
-- recursion: the policy on `admins` calls is_admin(), which reads `admins`.
-- Running as owner, the function is not itself subject to that policy.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- 2 · Client Service Agreement acceptances
-- ============================================================================
-- Written BEFORE the handoff to Stripe (CLAUDE.md: "CSA acceptance happens
-- before Stripe payment, and must be logged with a timestamp. This is the
-- reason we're not using a plain Stripe checkbox.")

create table if not exists public.csa_acceptances (
  id          uuid primary key default gen_random_uuid(),

  -- Server clock, never the browser's. A client-supplied time is not evidence.
  accepted_at timestamptz not null default now(),

  full_name   text not null,
  email       text not null,

  -- Which service was being bought, e.g. 'individual-nervous-system-session'.
  service_id  text not null,

  -- WHICH TEXT THEY AGREED TO. The CSA's effective date is 21 Sept 2026 and
  -- the Legal Pages Index already references a revision log, so the wording
  -- will change. Without these two columns, after the first revision nobody
  -- can say which terms any given client accepted. Cheap now, impossible to
  -- reconstruct later.
  agreement_version text not null,
  agreement_hash    text not null,

  -- Correlates to the Stripe payment that follows. Deliberately nullable:
  -- someone who accepts and then abandons checkout leaves a real acceptance
  -- with no payment. Those rows are correct and are kept, not cleaned up.
  checkout_reference text,

  -- DECISION 2 in the proposal, still open with Darlene. Standard supporting
  -- evidence for an online acceptance, and the Privacy Policy already
  -- discloses that IP is collected automatically. Nullable, so if she says no
  -- we simply stop populating them — no migration needed either way.
  ip_address inet,
  user_agent text
);

comment on table public.csa_acceptances is
  'Evidence that a specific person accepted a specific version of the CSA at a specific time.';

create index if not exists csa_acceptances_accepted_at_idx
  on public.csa_acceptances (accepted_at desc);
create index if not exists csa_acceptances_email_idx
  on public.csa_acceptances (lower(email));

-- ============================================================================
-- 3 · New Client Intake submissions
-- ============================================================================
-- Post-booking and NON-BLOCKING. CLAUDE.md: "If someone books and never
-- completes intake, that's fine, the session still happens." Nothing here may
-- ever gate an appointment.
--
-- Worth stating because it changes the risk picture: the intake note
-- (docs/reference/10) deliberately REMOVED medical and mental-health history,
-- medications, trauma questions, substance questions, emergency contact,
-- insurance, date of birth and government identifiers, and forbids restoring
-- them. So this table holds ordinary personal information and, by design, no
-- special-category health data. Keep it that way.

create table if not exists public.intake_submissions (
  id           uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),

  full_name text not null,
  email     text not null,

  -- The single acknowledgement checkbox the intake carries. NOT a second
  -- agreement — the intake note is explicit that the CSA is the agreement and
  -- forbids a signature block here.
  acknowledged_scope boolean not null default false,

  -- DECISION 1, and the one genuinely blocking item: the approved field list
  -- lives in a file that is not in the repo, and the note forbids inventing
  -- fields. Until it arrives the answers live here as JSON. Once we have the
  -- list these become real columns.
  answers jsonb not null default '{}'::jsonb
);

comment on table public.intake_submissions is
  'Post-booking onboarding. Never blocks an appointment. No special-category health data by design.';

create index if not exists intake_submissions_submitted_at_idx
  on public.intake_submissions (submitted_at desc);

-- ============================================================================
-- 4 · The write-only role
-- ============================================================================
-- This is the "restricted insert-only path, not a role that can also read"
-- from CLAUDE.md. PostgREST switches into this role when it receives a JWT
-- whose `role` claim is 'sp_writer', which gives the form endpoint a genuine
-- credential that CANNOT read anything — unlike service_role, which bypasses
-- RLS entirely and would hand a leaked key every row in both tables.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'sp_writer') then
    create role sp_writer nologin noinherit;
  end if;
end
$$;

grant usage on schema public to sp_writer;
grant insert on public.csa_acceptances   to sp_writer;
grant insert on public.intake_submissions to sp_writer;

-- PostgREST authenticates as `authenticator` and then SET ROLEs; it can only
-- switch into a role it has been granted.
grant sp_writer to authenticator;

-- ============================================================================
-- 5 · Lock the tables down
-- ============================================================================
-- Two independent layers, both required. RLS decides which ROWS a role may
-- touch; GRANTs decide whether it may touch the table at all. A policy alone
-- is not enough while Supabase's default grants to anon/authenticated remain.

alter table public.admins             enable row level security;
alter table public.csa_acceptances    enable row level security;
alter table public.intake_submissions enable row level security;

-- FORCE also subjects the table OWNER to these policies. Not applied to
-- `admins`, because is_admin() runs as owner and must be able to read it.
alter table public.csa_acceptances    force row level security;
alter table public.intake_submissions force row level security;

-- Strip Supabase's default grants. THIS is what closes the public API.
revoke all on public.admins             from anon, authenticated;
revoke all on public.csa_acceptances    from anon, authenticated;
revoke all on public.intake_submissions from anon, authenticated;

-- Give back only read, and only to logged-in users. The policies below then
-- decide which logged-in users actually get rows: admins, and nobody else.
grant select on public.admins             to authenticated;
grant select on public.csa_acceptances    to authenticated;
grant select on public.intake_submissions to authenticated;

-- `anon` is granted NOTHING and has NO policy. Under RLS, no policy means no
-- access — that is the default-deny, achieved by writing nothing rather than
-- by writing deny rules.

-- ============================================================================
-- 6 · Policies
-- ============================================================================

drop policy if exists "admins read acceptances" on public.csa_acceptances;
create policy "admins read acceptances"
  on public.csa_acceptances for select to authenticated
  using (public.is_admin());

drop policy if exists "admins read intake" on public.intake_submissions;
create policy "admins read intake"
  on public.intake_submissions for select to authenticated
  using (public.is_admin());

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins"
  on public.admins for select to authenticated
  using (public.is_admin());

-- Insert, and nothing else. There is deliberately no SELECT policy for
-- sp_writer, which has a practical consequence the endpoint must respect:
-- an insert must NOT ask for the row back. In PostgREST, returning the created
-- row requires SELECT, so requesting it would re-open read access sideways.
drop policy if exists "writer inserts acceptances" on public.csa_acceptances;
create policy "writer inserts acceptances"
  on public.csa_acceptances for insert to sp_writer
  with check (true);

drop policy if exists "writer inserts intake" on public.intake_submissions;
create policy "writer inserts intake"
  on public.intake_submissions for insert to sp_writer
  with check (true);

-- No UPDATE or DELETE policy exists for anyone, including admins. These are
-- records of things that happened; corrections are additions, not edits.
-- (Erasure requests are Decision 4 and would be a deliberate, separate path.)

-- ============================================================================
-- 7 · Future tables default to closed, not open
-- ============================================================================
-- Without this, the next table created in `public` inherits Supabase's default
-- grants to anon and is readable by the world until someone remembers to
-- revoke. Making the safe state the default is worth more than remembering.

alter default privileges in schema public
  revoke all on tables from anon, authenticated;
