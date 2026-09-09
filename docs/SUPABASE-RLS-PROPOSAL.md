# Supabase data model & Row Level Security — proposal for sanity check

**Status: PROPOSAL. Nothing has been built.** No Supabase project exists, no
migration is written, and `@supabase/supabase-js` is not installed. CLAUDE.md
requires the RLS policy be stated in plain English and checked before any schema
ships, so this is that statement.

Read the four **Decisions needed** at the bottom; the rest is the reasoning.

---

## The requirement, in Darlene's words

> "Please make sure the intake submissions and Client Service Agreement records
> are accessible only through the authenticated/private admin side and aren't
> publicly accessible through the site or database/API."

CLAUDE.md turns that into three concrete rules:

1. RLS on `intake_submissions` and `csa_acceptances` **default-denies** anonymous
   and public reads.
2. Only the **authenticated admin** can read them.
3. Public writes go through a **restricted insert-only path, not a role that can
   also read**.

Everything below serves those three, plus a fourth constraint from CLAUDE.md:
the whole thing transfers to Darlene's own accounts at project completion, so
nothing may hardcode Hadley's accounts and every credential lives in an
environment variable.

---

## The part that matters most, in one paragraph

**The browser will never hold a Supabase key, and the public site will never
talk to Supabase directly.** Forms post to a small server-side endpoint on
Vercel, which holds the credential and performs the insert. This is the single
most important decision here, and it is stricter than the letter of rule 3.
Here is why it is worth it.

Supabase's `anon` key is *designed* to ship in the browser — it is public by
nature, and RLS is what makes that safe for reads. But RLS cannot make a public
**write** endpoint trustworthy. If the anon key can insert into
`csa_acceptances`, then anyone who opens dev tools can forge an acceptance
record: any name, any email, any timestamp. **A Client Service Agreement
acceptance log that anyone can write to is not evidence of anything** — and
being able to prove who accepted what, and when, is the entire reason CLAUDE.md
says we are not using a plain Stripe checkbox. The same argument applies to
`intake_submissions`, which carries personal information and would otherwise be
an open spam target.

So: no public insert path. The browser posts to our own endpoint, same origin,
and that endpoint is the only thing that ever authenticates to the database.

---

## Tables

### `csa_acceptances`

One row each time someone affirmatively accepts the Client Service Agreement,
written **before** the handoff to Stripe.

| Column | Why it exists |
|---|---|
| `id` | Surrogate key. |
| `accepted_at` | The timestamp CLAUDE.md requires. Server clock, never the browser's — a client-supplied time is not evidence. |
| `full_name`, `email` | Who accepted. Typed by the person as part of the affirmative acceptance. |
| `service_id` | Which service was being purchased (e.g. `individual-nervous-system-session`), so the record ties to the right engagement. |
| `agreement_version` | **Important.** Which version of the CSA text they agreed to. |
| `agreement_hash` | A checksum of the exact rendered agreement text at acceptance time. |
| `checkout_reference` | Correlates the acceptance to the Stripe payment that follows it. |
| `ip_address`, `user_agent` | Standard supporting evidence for an online acceptance — **see Decision 2, this is a real choice, not a default.** |

**On `agreement_version` / `agreement_hash`.** The CSA's effective date is
21 September 2026, and the Legal Pages Index already references a revision log,
so the text *will* change over time. If we only store "accepted", then after the
first revision no one can say which terms any given client actually agreed to.
Storing the version plus a hash of the exact text means that question always has
an answer. This is cheap now and impossible to reconstruct later.

### `intake_submissions`

One row per completed New Client Intake — the post-booking form.

Worth stating plainly, because it changes the risk picture: the intake note
(`docs/reference/10-new-client-intake-note.md`) explicitly *removed* medical and
mental-health history, medications, trauma questions, substance questions,
emergency contact, insurance details, date of birth, and government identifiers,
and forbids restoring them. **So this table holds ordinary personal
information — name, contact, goals, what brings you — and deliberately no
special-category health data.** That is a meaningful reduction in exposure and
it should stay that way.

| Column | Why it exists |
|---|---|
| `id` | Surrogate key. |
| `submitted_at` | Server clock. |
| `full_name`, `email` | Who submitted. |
| `answers` | The remaining responses. **See Decision 1** — the exact fields are not in the repo yet, so this is either a JSON payload or real columns once we have them. |
| `acknowledged_scope` | The single acknowledgement checkbox the intake carries. Not a second agreement — the note is explicit that the CSA is the agreement. |

Intake is **non-blocking by design**: CLAUDE.md says if someone books and never
completes intake, the session still happens. Nothing in this schema should ever
gate an appointment on a row existing here.

---

## The policies, in plain English

RLS is **enabled and forced** on both tables. "Forced" matters: without it, the
table owner bypasses RLS, which quietly undermines the whole thing.

Under Postgres RLS, **no policy means no access**. That is the default-deny rule
3 asks for, and it is achieved by *not writing* policies rather than by writing
deny rules. Stated as sentences:

**Anonymous visitors (the `anon` role — the public website):**
> Cannot read, insert, update, or delete anything in either table. No policy
> grants them anything, and the table-level grants Supabase hands out by default
> are revoked as well.

Two layers, because RLS and SQL `GRANT`s are independent — a policy alone is not
enough if the grant is still there.

**Logged-in users who are not admins (the `authenticated` role):**
> Cannot read either table.

Today there are no client logins at all — Handoff §11 is explicit that there is
"no membership system, login, or client portal". But writing the admin policy as
"any authenticated user" would silently become a leak the day a client login is
ever added. So admin is an **explicit list**, not a synonym for "logged in".

**Administrators:**
> May read every row in both tables. May not update or delete them.

Admin status comes from a row in a small `admins` table keyed by Supabase auth
user id. Making Darlene primary admin at handover is then **one row**, and
nothing anywhere references a personal account — which is what CLAUDE.md's
transfer requirement needs.

No update and no delete is deliberate: these are records of things that
happened. Corrections should be additions, not edits. (Erasure requests are
Decision 4.)

**The write endpoint:**
> May insert into both tables. May not read, update, or delete.

This is the "restricted insert-only path, not a role that can also read" from
rule 3, and it is why we do **not** use Supabase's `service_role` key for form
submissions: `service_role` bypasses RLS entirely and can read everything, which
is exactly what rule 3 rules out. It stays reserved for migrations and ops.

One practical consequence worth flagging now so it does not surprise anyone
later: **the insert must not ask for the row back.** In PostgREST an insert that
returns the created row needs SELECT permission, so requesting it would
re-introduce read access through the back door. The endpoint inserts and returns
only success or failure to the browser.

---

## How a submission actually travels

```
Browser (no Supabase key, no database access)
  │  POST, same origin
  ▼
Vercel serverless endpoint
  │  reads SUPABASE_URL + the write credential from env vars
  │  validates input, stamps the server-side timestamp
  ▼
Supabase — insert-only, cannot read back
```

And for the admin side:

```
Darlene → admin login (Supabase Auth) → session
  │  row in `admins` decides the answer
  ▼
Supabase — read-only over both tables
```

The public site and the admin side reach the database through **different
credentials with non-overlapping permissions**. Neither can do the other's job.

---

## Where the CSA acceptance sits in the purchase flow

```
service selection
  → affirmative CSA acceptance   ← the row is written HERE, before money moves
  → Stripe payment
  → private scheduling page (noindex, Stripe redirect only)
  → Calendly booking
  → New Client Intake            ← post-booking, never blocks the appointment
```

Because acceptance is recorded before the redirect to Stripe, some acceptances
will have no matching payment — someone accepts and then abandons checkout.
**That is correct and the rows should be kept**, not cleaned up: an acceptance
happened, and `checkout_reference` simply stays unmatched.

---

## Ownership transfer

- Every credential in an environment variable. No key in the repository, no key
  in client-side code.
- No personal account referenced anywhere in application logic; admin identity
  lives in a database row.
- The migration is checked in, so Darlene's project can be built from scratch
  and the schema reproduced exactly.
- Handover is: create her project, run the migration, set the env vars, insert
  her `admins` row, remove Hadley's.

---

## Decisions needed

**1. Intake form fields — genuinely blocking the intake page, not this design.**
The source file the docs point at, *"Starting Point - New Client Intake - FINAL -
IMPLEMENT AS WEB FORM.html"*, **is not in the repo**. Only the implementation
note is. The note says to place the fields and wording exactly as written and to
raise a question rather than editing — so I cannot invent them. Please send that
file. Until then `answers` stays a JSON payload; once the fields are known I would
rather define real columns.

**2. Capture IP address and user agent with a CSA acceptance?** Standard
supporting evidence for an online agreement, and the Privacy Policy already
discloses that IP is collected automatically. But it is personal data we would
otherwise not be storing, and it is Darlene's call, ideally with whoever reviews
the CSA. My recommendation: **yes, capture both** — an acceptance record is
materially weaker without them.

**3. Who counts as an admin at launch?** Proposal: Darlene only, with Hadley
added temporarily during the build and removed at transfer. Confirm there is no
second person who needs to read intake submissions.

**4. Retention.** How long do intake submissions stay? CSA acceptances should be
kept indefinitely — they are the record of an agreement. Intake is different and
a stated retention period is good practice. No policy is proposed here because
this is a business and legal decision, not a technical one. Flagging that the
Privacy Policy currently makes no specific retention promise, so anything chosen
should be consistent with it.

---

## What I would build once this is agreed

1. The migration: two tables, the `admins` table, RLS enabled and forced, the
   grants revoked, the four policies above.
2. The write endpoint, plus wiring the existing contact form to it — that form
   currently validates and logs to the console, and is on the pre-launch list
   either way (OPEN-QUESTIONS #13).
3. The CSA acceptance step and the seven `/checkout/*` pages.
4. The three private scheduling pages, then send you the URLs so Darlene can
   repoint the Stripe redirects.
5. The intake form, once the field list arrives.
6. The two admin screens.

Nothing in that list starts before this document has been through you, and
items 1–4 also want Darlene's answers to Decisions 2–4.
