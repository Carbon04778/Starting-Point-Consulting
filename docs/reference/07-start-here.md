![Starting Point Consulting](../assets/logo/starting-point-emblem-
transparent.png)

Starting Point

Consulting

Open this first

# Start here — web developer

One package, one source of truth. Read this page, then the file manifest, then
the pending-items sheet. Everything you need to build the site is in the ten
numbered folders beside this one.

Project

Starting Point Consulting

Platform

Squarespace 7.1

Package

Current — September 2026

Contact

Darlene Erich

**This package is the current source of truth.** It supersedes every prior
Starting Point Consulting handoff, prototype, audit, and bundled copy that may
have been shared before. If you have received an older Starting Point file,
this package replaces it.  
  
**Do not use archived or previously shared Starting Point files as build
sources.** Nothing outside this folder should be treated as current.

**Approved website copy should be placed as written. Do not rewrite or
"improve" copy without Darlene's approval.** This includes headlines, body
text, button labels, FAQ answers, and every legal and scope-of-practice
sentence. If a line seems to need changing, ask rather than editing.

## 01What the business does

Starting Point Consulting translates the science of stress and the nervous
system into practical, human tools for living, working, learning, and leading.
The work is **educational and supportive — not psychotherapy, counseling, or
medical care** , and it complements rather than replaces care from licensed
professionals. That boundary sentence appears on every service area and must
not be removed or softened.

Founder: **Darlene Erich, MBA, BSN, RN**. Her visible presence is intentional
— she is the brand's credibility, and the About page and founder identity
carry real SEO weight.

#### Primary audiences

  * **Individuals** seeking one-to-one regulation and capacity work, often alongside existing care.
  * **Organizations** — healthcare systems, first responders, schools, nonprofits, employers, and leadership teams under sustained pressure.
  * **Therapists and providers** who want to share this work with the people they serve.
  * **Event organizers** booking keynotes, panels, and facilitated conversations.

## 02Website architecture

Page blueprints, section order, layout, and mobile behavior are in `03 -
WEBSITE DESIGNS`. Copy for every page is in `04 - WEBSITE COPY`.

  * Home · About · Approach
  * **Services** — holds Individual Sessions and Resilience & Well-Being Programs, with prices shown inline
  * Speaking
  * **For therapists & providers**
  * Resources hub, articles, and the lead magnet
  * Contact
  * Nine legal and policy pages, linked from the footer

**Two architecture rules that override any older document.** There is **no
standalone public Pricing page** — prices live on the Services page. And
**Integration Support has no standalone page at launch** — it sits inside
Individual Sessions.

#### Canonical service names — use these exactly

  * **Individual Sessions**
  * **Resilience & Well-Being Programs**
  * **For therapists & providers**

## 03The client journeys

The whole site is built around one rule: **anything with a fixed price is
bought before it is scheduled; anything customized is talked about before it
is priced.** Full detail in `08 - INTEGRATIONS`.

### Individual fixed-price service

Choose a serviceAffirmative agreement acceptanceStripe paymentPrivate Calendly
schedulingConfirmation

### Package

Choose a packageAgreement acceptanceOne paymentSchedule the first included
sessionInstructions for the remaining sessions

The client is never asked to pay again for sessions already included.

### Organizations

Start a conversationDiscoveryCustomized proposalAgreementInvoice and payment

No public price, no payment button, no self-serve checkout.

### Speaking

InquiryConversation and discoveryCustomized scope and proposalAgreementInvoice
and payment

Deposit terms are proposal-based. Do not publish a starting fee anywhere on
the site.

### Therapists and providers

Provider learns about Starting PointShares informationThe individual
independently decidesThe individual contacts or schedules directly

**No formal referral is required or requested.** There is no referral form, no
referral portal, and no clinical intake pathway. Providers share; individuals
decide for themselves.

## 04Stripe and Calendly architecture

**Read the master document first:** `00 - START HERE / Starting Point - Web
Developer Handoff - CURRENT - APPROVED FOR DEVELOPMENT`. It consolidates the
current approved state — architecture, pricing, journeys, all seven Stripe
links, all four Calendly URLs, the three private scheduling pages with
approved copy, the CTA map, and the pre-launch checklist — and it supersedes
older handoffs wherever they conflict.

#### Stripe — seven live payment links, individual services only Complete

Seven live Stripe Payment Links — one per paid individual offering; the URLs
are in `08 - INTEGRATIONS`, along with the catalog and each link's scheduling
destination. They currently show temporary Stripe confirmation messaging —
once you deliver the three private scheduling page URLs, Darlene repoints each
redirect. **No public payment link exists for organizational programs,
Regulate & Recharge, workshops, speaking, organizational leadership work, or
customized consulting.** The Integration Support Session has its own link but
is sold within the Individual Sessions section, not on a standalone page.

#### Calendly — four event types, final URLs Complete

**Calendly configuration is complete, with final event URLs.** The full
scheduling-links table — event, location options, the CTA and journey that
uses it, and whether it is reached directly or only after agreement and
payment — is in the Design System handoff, section 10, and repeated in `08 -
INTEGRATIONS`. The three individual session events offer Zoom or in person,
with in-person details arranged after booking; **Calendly payment collection
is intentionally not configured and must not be added.** **No Calendly or
Stripe account access is required or to be requested.** Three paid events
serve the individual services and are reachable only after payment; one no-
cost public event handles organizational discovery. Paste the URLs exactly and
do not create, rename, shorten, or substitute them.

**Approved implementation: Option A. Your one blocking task: the three private
post-payment scheduling pages** — 60-Minute Session Scheduling, 90-Minute
Session Scheduling, Leadership Session Scheduling. Stripe and Calendly are
both complete; the pages are what the payment redirects need. Build them, send
Darlene their URLs, and she repoints each Payment Link. Do not invent URLs,
and do not send a visitor from a public service page into unrestricted
scheduling before payment.

## 05New client intake Final — build as a web form

One extra build item beyond the website itself: the **New Client Intake** , in
`08 - INTEGRATIONS`. Content is final. **Implement it as a short web form, not
a fillable PDF.** It is emailed to a client after scheduling — not a public
page, not part of checkout — so keep it out of navigation and `noindex` it. Do
not add fields, and do not treat it as a second agreement acceptance. Read
`NEW CLIENT INTAKE - IMPLEMENTATION NOTE.txt` first.

**Two things to send back to Darlene:** the three private post-payment
scheduling page URLs, and the **final live intake-form URL** — which she
inserts into client email template 02.

## 06Accessibility expectations

  * WCAG 2.1 AA as the working standard. Full guidance in the Design System, section 17.
  * Check contrast carefully where gold sits on cream — that is the pairing most likely to fail.
  * Every interactive element reachable by keyboard, with a visible focus state.
  * Tap targets at least 44 px. Mobile pass at 375 px and 390 px on every page.
  * Real alt text on every meaningful image; decorative images left empty.
  * Motion kept slow and optional; respect `prefers-reduced-motion`.
  * The Accessibility Statement page must reflect what the built site actually does.

## 07SEO implementation expectations

`07 - SEO AND METADATA` holds the current audit. It is the SEO source of truth
— no further audit is needed, and v1 has been removed from this package.

  * Place the supplied titles, meta descriptions, and URL slugs exactly as written.
  * One `h1` per page, headings in real hierarchical order.
  * Organization and Person structured data, with Darlene as the named founder.
  * Service-area wording: **Based in Utah. Working virtually and on site nationwide.**
  * No page, slug, nav item, or metadata for a standalone Pricing page or a standalone Integration Support page.
  * Use the canonical service names and the current CTA labels throughout — including in metadata.

## 08What is still pending

The full sheet is **PENDING ITEMS — DO NOT BLOCK BUILD UNLESS NOTED** , in
this folder. **Post-payment scheduling: Option A is approved.**Developer
implementation is pending:** build the three private post-payment scheduling
pages and send Darlene the final live URLs so she can update the seven Stripe
after-payment redirects.** Stripe and Calendly URLs are complete. In short,
from Darlene:

  * The final production logo files, from the original designer. The reference exports in `02 - BRAND ASSETS` communicate placement only.
  * Website launch date, which becomes the Client Service Agreement effective date.
  * Newsletter platform, hero photograph, speaking photograph, LinkedIn and Instagram URLs, Toolkit PDF, testimonial permissions.
  * Attorney and insurer review — internal, and Darlene's to close.

Where an input has not arrived, hide the related element rather than shipping
a placeholder. No dead links, no empty download buttons, no non-functional
signup forms.

## 09Where everything lives

Folder| What is in it  
---|---  
00 - START HERE| This page, the file manifest, and the pending-items sheet  
01 - DESIGN SYSTEM| The consolidated Design System & Web Developer Handoff —
the master specification — plus Brand Specifications. Tokens and `styles.css`
sit at the package root  
02 - BRAND ASSETS| Logo Reference, Canva Brand Kit Setup, and a clearly
labelled reference-only logo folder  
03 - WEBSITE DESIGNS| Page Blueprints, Home Page Build Sheet, and the
interactive prototype as one self-contained clickable file — the approved
design itself  
04 - WEBSITE COPY| Master Website Copy — approved, place as written  
05 - PHOTOGRAPHY| Website Image Map, Photo Shopping List, photography
direction, current approved photographs  
06 - DOWNLOADABLE RESOURCES| The client-facing one-pagers and handouts the
site links to  
07 - SEO AND METADATA| SEO & AI Readiness Audit v2  
08 - INTEGRATIONS| Integrations & Functional Map, Payment & Scheduling
Integration Kit, Calendly Setup Notes, Stripe and Calendly placeholders  
09 - LEGAL| Client Agreements, Legal Pages Index, and the developer note on
where legal copy comes from  
10 - DEVELOPER CHECKLISTS| Designer Handoff Checklist, Outstanding Items
Checklist, Squarespace Build Kit  
  
`styles.css`, `handoff.css`, `tokens/`, and `assets/` sit at the package root
— every document in the folders above loads its styling and images from them,
so keep the package structure intact rather than moving individual files out
of it.

## 10Business details

Item| Value  
---|---  
Entity| Starting Point Consulting, LLC  
Mailing address| 8850 S 700 E #493, Sandy, UT 84070 — used in legal pages and
required disclosures. Do not place it prominently in the marketing footer  
Service area, public wording| Based in Utah. Working virtually and on site
nationwide  
Email| darlene@startingpointconsulting.com  
Website| startingpointconsulting.com  
  
Questions go to Darlene, not into the copy.If something in this package
contradicts something else, this page and the Design System control.

[darlene@startingpointconsulting.com](mailto:darlene@startingpointconsulting.com)  
startingpointconsulting.com

