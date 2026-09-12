-- ============================================================================
-- Make one Supabase Auth user an administrator.
--
-- NOT a migration. Run by hand in the Supabase SQL editor, once per admin.
-- Nothing in the app references a personal account — this table IS the
-- allow-list, and handover is one row in, one row out (CLAUDE.md, "Hosting
-- and ownership model"; Darlene's round-2 decision: "Darlene only" at launch,
-- with the developer added temporarily during the build).
--
-- Steps:
--   1. Supabase dashboard → Authentication → Providers → Email:
--        - Enable email provider, DISABLE "Allow new users to sign up".
--   2. Authentication → Users → "Add user" → "Create new user":
--        - the admin's email and a strong password, tick "Auto Confirm User".
--   3. Replace the address below and run this file.
--
-- To remove an admin (e.g. the developer at handover):
--   delete from public.admins where email = 'their@address';
--   then delete the user in Authentication → Users.
-- ============================================================================

insert into public.admins (user_id, email, note)
select id, email, 'added ' || to_char(now(), 'YYYY-MM-DD')
from auth.users
where lower(email) = lower('CHANGE-ME@example.com')
on conflict (user_id) do nothing;

-- Should return the row you just added.
select user_id, email, added_at, note from public.admins;
