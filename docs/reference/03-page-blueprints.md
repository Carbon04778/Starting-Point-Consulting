![Starting Point Consulting](../assets/logo/starting-point-emblem-
transparent.png)

Starting Point

Consulting

02 · Website Designs

# Page blueprints

Every approved page, every section in order, with layout, background, spacing,
CTAs, and how each one behaves on a phone.

**Read this alongside the live prototype.** [Interactive Prototype →
index.html](Starting Point - Interactive Prototype - APPROVED DESIGN.html) is
the approved design itself — clickable, at real size, with real type, spacing,
and interaction. This document is the written specification of what that
prototype shows, so nothing depends on interpreting a screenshot. Where the
two ever disagree, **the prototype is correct**.

## Global 01Canvas, grid & spacing

Property| Desktop| Mobile (≤ 768px)  
---|---|---  
**Content container**|  1200px max width, centered| Full width  
**Outer page gutter**|  40px each side| 20–24px each side  
**Section vertical padding**|  72–88px top and bottom (hero 104px)| 48–56px
top and bottom  
**Grid gap between cards**|  22–24px| 16px, single column  
**Card padding**|  30–32px| 22–24px  
**Space under an eyebrow**|  14px to the heading below it| 12px  
**Space under a heading**|  10–14px to body copy; 44–48px to a card grid| 10px
/ 28px  
**Section separation**|  1px hairline `#E3D7BF` at the top edge of each new
section| Same  
  
**Background rhythm.** Sections alternate cream `#FCFAF5` → warm sand
`#F7F2E8` → cream, so no two adjacent sections share a background. White is
reserved for cards sitting on those washes. At most one charcoal section per
page.

## Global 02Navigation

Header — sticky, translucent cream with blur, 1px bottom hairline, 72px tall

**Left:** emblem + "STARTING POINT" (Jost 600, tracked caps) over "CONSULTING"
(Jost 400, gold, tracked). **Center:** pill nav — Home · Services · Speaking ·
Pricing · Starting Points · About. **Right:** primary gold pill button "Book a
call".

  * **Nav item order (do not reorder):** Home, Services, Speaking, Starting Points, About. **Superseded:** Pricing was previously a nav item and is no longer one — there is no standalone public Pricing page.
  * **Active state:** the current page's item sits in a soft sand pill with charcoal text; all others are ink 600 with no fill.
  * **Hover:** item background fades to sand 100 over 150ms; text moves to charcoal. No underline, no movement.
  * **Superseded — the universal "Book a call" nav button is retired.** There is no general 20-minute discovery call in the final architecture and no universal "Book a discovery call" CTA. Individual services route to agreement acceptance and payment; organizational CTAs route to the Organizational Discovery Conversation. See the scheduling-links table in the Design System handoff §10.
  * **Secondary pages** (Our approach, FAQ, Client resources, For therapists & providers, Contact) live in the footer, not the top nav. This is deliberate — the top nav stays at six items.
  * **Mobile:** emblem + wordmark left, hamburger right. Menu opens as a full-width cream panel: the six nav items stacked at 18px with 20px vertical rhythm, then the primary CTA button full-width at the bottom. Header stays sticky. Every tap target ≥ 44px.

## Global 03Footer

Footer — charcoal with a subtle sage-to-ink ridge gradient, 64px top padding

**Row 1, four columns:** (1) type-set wordmark + one-line positioning
statement + LinkedIn and Instagram icons; (2) _How we partner_ — 7 service
links; (3) _Who we serve_ — 6 audience links; (4) _Company_ — Our approach,
Speaking, Pricing, Starting Points, Client resources, For referring
professionals, The journey, FAQ, Book a call, Contact.

Row 2 — policies, separated by a 1px sand hairline at 20% opacity

Privacy Policy · Terms & Conditions · Disclaimer · HIPAA Note · Accessibility Statement · Non-Discrimination & Inclusion · Cookie preferences  |  Client Service Agreement · Testimonial Release

Row 3 — baseline

© Starting Point Consulting · educational and supportive, not therapy or
medical care · Utah, working nationwide

  * **Link hover:** sand 200 → gold 200, 150ms. No underline.
  * **Mobile:** the four columns stack; columns 2–4 collapse into tappable accordions with a ChevronDown; the policy row wraps to a centered two-line list.
  * The wordmark here is **type-set, not an image** — see the note on reversed logo files in _01 Brand_.

## Global 04Cookie banner

A cream card pinned bottom-left with a 22px shadow, one line of body copy, an
"Accept" primary pill, a "Manage" text link, and a close. Appears once per
visitor, remembers the choice, and links to Cookie preferences in the footer.
It must never cover the "Book a call" button on mobile — pin it above the
fold-bottom with 16px inset.

## Page 01Home

1 · Hero — cream base with a sunrise wash (cream → gold 50, vertical) and a
gold corner glow · 104px padding

Two columns, 1.05fr / 0.95fr. **Left:** eyebrow → H1 → lead paragraph → two
buttons (primary "Start where you are", secondary "Explore our work").
**Right:** emblem medallion, currently standing in for the hero photograph
(see Image Map, HOME-01).

2 · Our approach band — white cards on cream · 72px padding · centered header

Eyebrow "Our approach" → H2 → four equal cards in one row: Understand ·
Connect · Grow · Thrive. Each card: 52px gold-50 icon plate, H3, two-line
body. Left-aligned text inside centered grid.

3 · Who it's for — warm sand · 88px padding · centered header

Eyebrow "Who it's for" → H2 → 560px-wide centered lead → two wide cards side
by side. Card A (gold plate, Heart icon) ends in a primary button; Card B
(sage plate, Users icon) ends in a secondary button. Cards are equal height
with the button pinned to the bottom.

4 · How we partner — services grid

Eyebrow → H2 "How we partner" → six service cards in a 3×2 grid, each with
icon plate, H3, body. Then the _Speaking & Consulting_ feature card (full
width, gold-tinted, "New offering" badge, Route icon), then the "Who we serve"
chip row: seven sage chips.

5 · Let's begin — split panel, charcoal left / cream right (the page's one
dark moment)

**Left (charcoal):** eyebrow, H2 "Let's begin", lead, three icon rows (Heart /
Mail / Calendar), and a "Book a discovery call" button. **Right (cream
card):** the contact form — Full name, Email, "I am a…" select, "Who referred
you? (optional)", "What brings you here?" textarea, full-width submit "Let's
begin the conversation".

6 · Footer

As Global 03.

#### Mobile

  * Hero stacks: eyebrow, H1 at 32–36px, lead, then buttons full-width stacked with 12px gap; the medallion/photo sits _below_ the buttons at 4:5.
  * Approach band: 4 cards → 1 column (2 columns is acceptable on tablet at 640–768px).
  * Who it's for, services grid, chips: single column; chips wrap freely.
  * "Let's begin": the charcoal panel stacks above the form; the form keeps 24px inner padding and 16px field spacing.

## Page 02Services

1 · Header

Eyebrow → H2 "How we partner" → lead paragraph.

2 · Service cards — 3×2 grid

Individual Sessions · Workshops & Education · Leadership & Team Development ·
Resilience & Well-Being & Resilience · Healthcare & First Responders ·
Speaking & Consulting. Icon plate, H3, body each.

3 · Speaking & Consulting feature card

Wide gold-tinted card, Route icon, "New offering" badge, three bulleted lines
about integration, somatic practice, and meaning-making, and a link through to
Speaking.

4 · Who we serve

H2 → seven sage chips: Individuals & families · Therapist & provider
connections · Students & educators · Healthcare & first responders · Leaders &
teams · Organizations · Communities.

5 · Let's begin + Footer

The same contact section as Home, then the footer.

**Card hover (all card grids sitewide):** border moves sand 300 → gold 300,
shadow deepens from `0 8px 22px/6%` to `0 10px 26px/10%`, 180ms ease. No lift,
no scale, no color flood.

## Page 03Speaking

1 · Hero — two columns

**Left:** eyebrow "Speaking" → H1 → lead → buttons "Start a conversation"
(primary, opens the organizational inquiry call) and "Speaker kit" (secondary,
opens the kit PDF in a new tab). **Right:** portrait, 4:5 — ideally Darlene
speaking to a room (Image Map SPK-01).

2 · Signature talks — three cards

Each card: audience line (e.g. "Healthcare · First responders · General"),
talk title as H3, body. Titles: _(1) stress-and-tools talk_ , _Resilient
Teams, Healthier Cultures_ , _Where Science Meets Humanity_.

3 · Formats — four cards

Keynote · Breakout / Workshop · Half- or Full-Day · Virtual. Icon plate, H3,
one line each.

4 · What audiences walk away with

H2 with a four-item checklist, gold Check icons, on warm sand.

5 · Audiences chip row

Conferences & summits · Healthcare teams · First responders · Schools &
educators · Leadership & executives · Organizations · Community events.

6 · Planning an event? — closing CTA card

H2, one-line body, primary button "Inquire about speaking" → organizational
inquiry call. No pricing appears anywhere on this page.

**Mobile:** portrait above the copy; talk cards and format cards single
column; the checklist keeps its icons at 20px with 12px gap.

## Page 04Individual sessions — "Ways to work together"

**Superseded:** this was the standalone Pricing page. It is now the individual
services area, reached from Services and the footer, not from the top
navigation. Section 5 of this page (organizational formats) carries no prices.

1 · Header

Eyebrow → H1 "Ways to work together" → lead → **the complimentary-discovery-
call band is retired — do not build it.** Section 1 is eyebrow → H1 "Ways to
work together" → lead, then straight into the individual services

2 · For individuals — Individual sessions

Eyebrow "For individuals", H2, body, then three price cards: Individual
Nervous System Session · **4-Session Package** (badge "Most chosen",
CheckCheck icon) · Extended Individual Session. Each card: title,
duration/qualifier line, price, description, feature checklist, then the CTA —
"Book a session" for single sessions, "Choose this path" for packages — with
the micro-line beneath it ("Pay, then pick your time right away." / "Pay once,
then pick your first time right away.").

3 · Integration support

Two cards: Integration Support Session · 4-Session Integration Path (package
treatment, "Choose this path").

4 · For leaders

Two cards: Leadership Session · 3-Session Leadership Package. Then the
"Leading a team, not just yourself?" card ending in a "Let's talk" button — no
price.

5 · For organizations — Workshops & programs

A six-row format list (60-minute program · 90-minute workshop · 2-hour
workshop · half-day · full-day · ongoing partnership) with **no prices** ,
closing on "Let's talk". Copy states that every engagement is scoped and
quoted after a conversation.

6 · For events — Speaking

Three format rows (professional keynote · customized keynote · keynote plus
workshop), no prices, buttons "Inquire about speaking" and "See speaking
topics".

7 · Get in touch + Footer

Closing contact band, then footer.

**Structural rule — do not change.** Fixed prices appear only for individual,
integration, and leadership sessions and packages. Organizational, workshop,
and speaking work shows _formats only_ and routes to "Let's talk". Never add a
price, a "starting at", or a quote-request form to those blocks.

**Mobile:** price cards go single column in the printed order, "Most chosen"
first within its group; the CTA and its micro-line stay together at the bottom
of each card; the format lists become stacked rows with the label bold and the
description beneath.

## Page 05Booking

1 · Public booking = the Organizational Discovery Conversation only

**Superseded:** the prototype's six-row session picker predates the final
architecture. Build one public embed — the _Organizational Discovery
Conversation · 30 min · no cost_. The three paid session events are not
offered here; they live on post-payment scheduling pages. Do not present a
general complimentary discovery call. **Right:** month calendar → day
selection → time slots → "Confirm, [Month] [Day], [time]".

2 · Reassurance strip

Video call (link sent on booking) · Times shown in your local zone.

3 · Confirmed state

CalendarCheck in a gold plate, "You're booked.", the session and time, and
"Pick a different time" as a text link.

**In Squarespace this page is a Calendly embed, not a custom calendar.** The
prototype's calendar exists to show the intended layout and labelling only.
Build it as: the Organizational Discovery Conversation embedded here
(`https://calendly.com/darlene-startingpointconsulting/organizational-
discovery-conversation`), and the three paid events reachable _only_ from a
post-payment scheduling page. Final URLs and the full CTA map: _08 -
INTEGRATIONS_ and the Design System handoff §10.

## Page 06Payment → private post-payment page → schedule → confirmation

**Three private post-payment pages — grouped by session length.** The three
are: 60-Minute Session Scheduling · 90-Minute Session Scheduling · Leadership
Session Scheduling. 4-Session Package · 3-Session Leadership Package. Two
products share the 60-Minute Session page and two share the 4-Session Package
page, which carries neutral copy naming neither product. They are transaction-
flow utility pages: no navigation, no public browsing path, `noindex`, out of
the sitemap where Squarespace allows, concise confirmation copy plus the
scheduling CTA only, full branding and accessibility. Copy and CTA per page:
Design System handoff §10.

1 · Checkout (Stripe-hosted)

Not built in Squarespace. Stripe Payment Link, one per offering. The
prototype's checkout screen documents the intended order summary, the "After
payment" note, and the progress row so the Stripe branding and success text
can be set to match.

2 · Progress row — shown on every step

Single sessions: **Pay → Choose your time → Confirmed**. Packages: **Pay →
Schedule session 1 → Confirmed**. Completed steps carry a gold Check; the
current step is gold-filled; upcoming steps are ink 300.

3 · Private post-payment page (one per scheduling destination, five total)

Confirmation block ("Payment received, thank you."), the progress row, the
Calendly inline embed for that offering (60-minute, 90-minute, or 75-minute
event as applicable — final URLs in _08 - INTEGRATIONS_), and — for packages
only — the three-line explanation: your payment covers all sessions, schedule
session one now, and use the private link in your confirmation email for the
rest, at your pace, with no request forms.

4 · Confirmed

Gold Check plate, session name and time, and the packages note repeated.

**Three** private post-payment scheduling pages are required, covering all
seven live Stripe links: 60-Minute Session Scheduling · 90-Minute Session
Scheduling · Leadership Session Scheduling. Package · 3-Session Leadership
Package. Their URLs, copy, and Calendly pairings are in _08 - INTEGRATIONS_
and the Design System handoff §10.

## Page 07Starting Points (articles index)

1 · Header + filter row

Eyebrow → H1 "Starting Points" → lead. Filter chips: All · Nervous System ·
Resilience · Leadership · For Individuals · Healthcare. Active chip is gold-
filled; the rest are sage outline.

2 · Featured article

Wide card: 16:9 image at left (PHOTO PLACEHOLDER), category + read time, H2
title, body, "Read article" with an ArrowRight.

3 · Article grid — 3 columns

Six cards: category · read time · title · one-line summary · "Article" or
"Download" label. Includes _The Everyday Regulation Toolkit_ as a Download
card.

4 · Newsletter signup band

Mail icon, "Tools like this, in your inbox.", body, email field + Subscribe,
"No spam. Unsubscribe anytime."

5 · Empty state

When a filter has no results: "More on this topic coming soon." — centered,
muted, no illustration.

**In Squarespace:** a Blog collection. Filter chips are the blog's categories;
the featured card is the newest post in a summary block set to one item; the
grid is a second summary block excluding that post. **Mobile:** chips scroll
horizontally with no scrollbar; grid single column; the featured card's image
sits above its text.

## Page 08Article template

1 · Back link + meta

ArrowLeft "Back", category chip, "read time · date".

2 · Title + byline

H1 at 47px, author avatar + name + "Founder, Starting Point Consulting".

3 · Lead image

16:8 wide, full container width, radius 12px (PHOTO PLACEHOLDER).

4 · Body

Single column, 680px max, 18px Hanken Grotesk at 1.68. Subheadings in Jost
600. One Newsreader-italic pull quote per article, indented with a gold left
hairline. Lists with gold Check bullets.

5 · Tags, share, keep reading

Topic tags; LinkedIn / Facebook / copy-link icons; three related-article
cards.

The prototype's body text is bracketed template copy — placeholder by design,
replaced per article.

## Page 09Free guide (lead magnet)

1 · Two columns

**Left:** eyebrow "Free guide" → H1 "The Everyday Regulation Toolkit" → four
gold Check bullets → the email capture card (First name, Email, "Send me the
free guide"). **Right:** guide cover mockup on a soft warm texture (PHOTO
PLACEHOLDER, GUIDE-01).

2 · Success state

Gold Check plate, "Your guide is ready.", the emailed-copy line, and a
"Download the toolkit (PDF)" primary button.

## Page 10About — "The journey behind the work"

1 · Founder section — two columns

**Left:** portrait, 4:5, radius 14px — the supplied headshot is in place.
**Right:** eyebrow, name "Darlene Erich, MBA, BSN, RN", H2 "The journey behind
the work", body, then eight credential badges (RN, BSN · Certified School
Nurse · MBA, Healthcare Mgmt · Critical care · hospice · STOTT & Powerhouse
Pilates · Somatic Stress Release™ · The Embody Lab · Rhythm of Regulation® ·
Deb Dana · DISC + Values Coach) and a "Read the full story" link.

2 · Stats band — four columns

Large Newsreader numerals with a one-line label beneath each.

3 · Testimonial

Two quote cards, Newsreader italic, attributed "A client · Individual, self-
referred" and "Director of Nursing · Regional health system".

**Mobile:** portrait first at 4:5, then the text; badges wrap two per row;
stats become a 2×2 grid.

## Page 11Our approach

1 · Header

Eyebrow → H1 "Our approach" → lead.

2 · What grounds the work — six cards, 3×2

Neuroscience · Somatic practices · Polyvagal Theory · Leadership development ·
Adult learning principles · Decades in healthcare & education. Icon plate, H3,
one line each.

3 · Supporting image

3:2 landscape — horizon, still water, or morning light (PHOTO PLACEHOLDER,
APR-01).

4 · Closing CTAs

"Start where you are" (primary) and "Explore our work" (secondary).

## Page 12FAQ — "Questions & answers"

1 · Header + accordion

Eyebrow → H1 → 18 questions as an accordion list. Each row: question in Jost
600 at 19px, ChevronDown rotating 180° over 200ms on open, answer in body copy
at 16px with 1.68 leading. One open at a time; first item closed on load. Rows
separated by 1px sand hairlines.

2 · Closing card

"Still have a question?" / "We read every note personally." / primary button
"Let's begin the conversation".

**In Squarespace:** an accordion block, or a single markdown block with the
built-in accordion styling. Answer order is fixed — scope and safety questions
come first, pricing and logistics last.

## Page 13Client resources

1 · Header

Eyebrow → H1 "Client resources" → lead.

2 · Five grouped card sets

 _New clients · start here_ (Discovery Call Quick Intake, New Client Intake
Form) · _Agreements_ (Client Service Agreement, Testimonial & Media Release) ·
_For referring professionals_ (Referral One-Pager, For Referring Professionals
page) · _For event organizers_ (Speaker Kit) · _Free guides_ (The Everyday
Regulation Toolkit). Each card: icon, H3, one-line description, and a text-
link CTA with a small ArrowRight.

3 · Contact CTA

Closing "Contact us" button.

Each card links to a real document — forms, agreements, one-pagers, and the
speaker kit. Those files are listed in _08 Designer Handoff_ ; external
documents open in a new tab.

## Page 14For therapists & providers

1 · Header

Eyebrow → H1 → lead → buttons "Ask a question first" (primary) and "View the
Provider Resource" (secondary, opens the PDF).

2 · Scope of practice — two columns

**What we do** (six gold Check items) beside **What we do not do** (six items,
neutral ink markers — not red, not X's). Equal-height cards.

3 · Who this tends to help

Seven-item list.

4 · When another kind of support fits better

Six-item list. Presented plainly and without alarm styling — this is a
professional-to-professional page.

5 · Sharing Starting Point with a client or patient

Numbered steps. No referral language — the provider shares information, the
individual decides and schedules directly.

6 · Background & training

Portrait, name, "Healthcare Executive · Nervous System Leadership Educator",
credentials, and the approved training badges only — STOTT Pilates Certified,
Powerhouse Pilates Certified, Certified DISC + Values Coach, Somatic
Practitioner training (The Embody Lab), Polyvagal Mapping / Rhythm of
Regulation (Somatic Stress Release™ · The Embody Lab; Rhythm of Regulation® ·
Deb Dana).

7 · Communication & confidentiality → CTAs

Body copy, then "Get in touch" (primary) and "Read the FAQ" (secondary).

## Page 15Contact

The "Let's begin" split panel used on Home and Services, as a standalone page:
charcoal panel left (eyebrow, H1 "Let's begin", lead, three icon rows, and
**"Start a Conversation"** — the retired "Book a discovery call" button is not
built; this CTA routes to the Organizational Discovery Conversation), form
card right. On submit the form is replaced in place by a gold Check plate,
"Thank you, we'll be in touch." and "We read every note personally and reply
within two business days." — no page reload, no redirect.

## Page 16Legal & policy pages

Nine pages, all sharing one simple layout: cream background, eyebrow, H1,
"Last updated" line, then body copy in a single 680px column with H3 sub-
headings and no cards, no icons, no images. Linked only from the footer.

  * Privacy Policy · Terms & Conditions · Disclaimer · HIPAA Note · Accessibility Statement · Non-Discrimination & Inclusion Statement
  * Cookie preferences (opens the consent manager)
  * Client Service Agreement · Testimonial & Media Release

Approved text for each is in _03 Website Copy_ and _07 Legal_.

## Global 05Interaction intentions

Element| Behavior  
---|---  
**Primary button**|  Hover: gold `#C8902F` → `#A9781F`, 150ms. Active: no
scale, 1px optical press. Focus: 2px gold ring, 2px offset.  
**Secondary button**|  Hover: border ink 300 → charcoal, background fades to
sand 100.  
**Text link**|  Gold 700, no underline at rest; underline appears on hover. In
body paragraphs, underlined at rest for accessibility.  
**Card**|  Border to gold 300, shadow deepens. No lift, no scale, no tilt.  
**Chip / filter**|  Hover: sage 50 → sage 100. Selected: gold fill, white
text.  
**Accordion**|  Chevron rotates 180°, panel height animates 200ms ease-out. No
bounce.  
**Form field**|  Rest: 1px ink 200. Focus: gold 300 border + 2px gold-50 halo.
Error: danger border with the message beneath in 13px.  
**Page transitions**|  None. Navigation scrolls to top smoothly; no fades,
slides, or reveal-on-scroll animation anywhere on the site.  
  
**Motion principle.** Nothing on this site should surprise the eye.
Transitions are 150–200ms, ease-out, and confined to color, border, shadow,
and height. No parallax, no counters, no scroll-triggered reveals.

Starting Point Consulting02 Website Designs · Page Blueprints

