/**
 * Starting Point Consulting — single source of truth for routes, navigation,
 * footer structure, and third-party URLs.
 *
 * Nothing in here is invented. Every value is traced to a reference doc in a
 * comment. Where a slug is NOT specified anywhere in the package it is marked
 * `unconfirmed: true` and listed in docs/OPEN-QUESTIONS.md — those need
 * Hadley's/Darlene's confirmation before launch.
 */

/* ------------------------------------------------------------------ */
/* Business details — Handoff §19 "Business details", Legal Notes      */
/* ------------------------------------------------------------------ */

export const business = {
  // Handoff §01 "Naming"
  name: 'Starting Point Consulting',
  legalName: 'Starting Point Consulting, LLC',

  // Handoff §01 "Approved brand language"
  positioningLine: 'Nervous System Regulation. Well-Being. Lasting Change.',
  serviceArea: 'Based in Utah. Working virtually and on site nationwide.',

  // Pending items §01 — "Settled". Contact, organizational and speaking forms.
  email: 'darlene@startingpointconsulting.com',
  domain: 'startingpointconsulting.com',

  // Handoff §11 — legal pages and required disclosures ONLY.
  // Never in the marketing footer.
  mailingAddress: '8850 S 700 E #493, Sandy, UT 84070',

  // Handoff §01 "Founder identity" — exactly two lines, never more.
  founder: {
    name: 'Darlene Erich, MBA, BSN, RN',
    role: 'Founder, Starting Point Consulting',
  },

  // CLAUDE.md "Launch date" — becomes the Client Service Agreement effective date.
  launchDate: '2026-09-21',
};

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

/**
 * `confirmed` slugs come from the SEO table (Handoff §13) or the Legal Pages
 * Index. `unconfirmed` slugs are proposals — no doc in the package specifies
 * them. See docs/OPEN-QUESTIONS.md.
 */
export const routes = {
  // Handoff §13 SEO & metadata implementation sheet
  home: '/',
  services: '/services',
  speaking: '/speaking',
  about: '/about',
  faq: '/faq',
  startingPoints: '/starting-points',
  contact: '/contact',
  clientResources: '/client-resources',
  forTherapistsAndProviders: '/for-therapists-and-providers',

  // NOT specified anywhere in the package — proposed, needs confirmation.
  individualSessions: '/individual-sessions', // unconfirmed
  ourApproach: '/our-approach', // unconfirmed
  booking: '/booking', // unconfirmed
  freeGuide: '/free-guide', // unconfirmed
  newClientIntake: '/new-client-intake', // unconfirmed, noindex

  // Legal Pages Index §01 — exact slugs given there.
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  hipaaNote: '/hipaa-note',
  accessibility: '/accessibility',
  inclusion: '/inclusion',
  clientServiceAgreement: '/client-service-agreement',
  testimonialRelease: '/testimonial-release',

  // CLAUDE.md "Client workflow" — exact paths given there. noindex, not in nav.
  schedule60: '/schedule/60-minute-session',
  schedule90: '/schedule/90-minute-session',
  scheduleLeadership: '/schedule/leadership-session',
};

/** Slugs awaiting confirmation, surfaced by scripts/check-links.mjs. */
export const unconfirmedRoutes = [
  'individualSessions',
  'ourApproach',
  'booking',
  'freeGuide',
  'newClientIntake',
];

/* ------------------------------------------------------------------ */
/* Primary navigation                                                  */
/* ------------------------------------------------------------------ */

/**
 * Handoff §07 "Navigation" and §17 "Pages" both list six items ending in
 * Contact. Page Blueprints Global 02 and Master Copy §01 list five and put
 * Contact in the footer. Source-of-truth order (CLAUDE.md) puts the Handoff
 * first, so Contact is in the nav. Flagged in docs/OPEN-QUESTIONS.md.
 *
 * There is no Pricing item — Handoff §07, and the Blueprints' "Superseded" note.
 */
export const primaryNav = [
  { label: 'Home', href: routes.home },
  { label: 'Services', href: routes.services },
  { label: 'Speaking', href: routes.speaking },
  { label: 'Starting Points', href: routes.startingPoints },
  { label: 'About', href: routes.about },
  { label: 'Contact', href: routes.contact },
];

/**
 * Master Copy §01: the universal "Book a call" nav button is retired. The
 * header carries the individual-services CTA instead.
 */
export const primaryNavCta = {
  label: 'Explore Individual Sessions',
  href: routes.individualSessions,
};

/* ------------------------------------------------------------------ */
/* Footer — Master Copy §18, Handoff §07, Blueprints Global 03         */
/* ------------------------------------------------------------------ */

/**
 * Column 2 "How we partner" — the seven service links from Master Copy §18.
 * Only Individual Sessions and Speaking & Consulting have pages of their own.
 * The other four are service cards on /services, and Integration Support is a
 * section inside Individual Sessions (Handoff §07: no standalone page), so
 * those link to the real section anchors.
 */
export const footerHowWePartner = [
  { label: 'Individual Sessions', href: routes.individualSessions },
  { label: 'Workshops & Education', href: `${routes.services}#workshops-and-education` },
  { label: 'Leadership & Teams', href: `${routes.services}#leadership-and-team-development` },
  { label: 'Resilience & Well-Being Programs', href: `${routes.services}#resilience-and-well-being-programs` },
  { label: 'Healthcare & Responders', href: `${routes.services}#healthcare-and-first-responders` },
  { label: 'Integration Support', href: `${routes.individualSessions}#integration-support` },
  { label: 'Speaking & Consulting', href: routes.speaking },
];

/**
 * Column 3 "Who we serve" — the six audiences from Master Copy §18.
 * Handoff §01: "Do not create audience pages purely for search." Blueprints
 * Global 03 calls them links, so they point at the real "Who we serve" section
 * on Services rather than at pages that must not exist.
 */
export const footerWhoWeServe = [
  { label: 'Individuals', href: `${routes.services}#who-we-serve` },
  { label: 'Students & educators', href: `${routes.services}#who-we-serve` },
  { label: 'Healthcare & responders', href: `${routes.services}#who-we-serve` },
  { label: 'Leaders & teams', href: `${routes.services}#who-we-serve` },
  { label: 'Organizations', href: `${routes.services}#who-we-serve` },
  { label: 'Communities', href: `${routes.services}#who-we-serve` },
];

/**
 * Column 4 "Company" — Master Copy §18. "Book a call" removed (retired CTA).
 * "The journey" is the About page, which is titled "The journey behind the work".
 */
export const footerCompany = [
  { label: 'Our approach', href: routes.ourApproach },
  { label: 'Speaking', href: routes.speaking },
  { label: 'Individual Sessions', href: routes.individualSessions },
  { label: 'Starting Points', href: routes.startingPoints },
  { label: 'Client resources', href: routes.clientResources },
  { label: 'For therapists & providers', href: routes.forTherapistsAndProviders },
  { label: 'The journey', href: routes.about },
  { label: 'FAQ', href: routes.faq },
  { label: 'Contact', href: routes.contact },
];

/** Footer policies row — Master Copy §18, Legal Pages Index §01 labels. */
export const footerPolicies = [
  { label: 'Privacy Policy', href: routes.privacyPolicy },
  { label: 'Terms & Conditions', href: routes.terms },
  { label: 'Disclaimer', href: routes.disclaimer },
  { label: 'HIPAA Note', href: routes.hipaaNote },
  { label: 'Accessibility Statement', href: routes.accessibility },
  { label: 'Non-Discrimination & Inclusion', href: routes.inclusion },
  // Cookie preferences opens the consent manager — behaviour, not a page.
  { label: 'Cookie preferences', href: null, action: 'cookie-preferences' },
];

/** Footer documents row — Master Copy §18. */
export const footerDocuments = [
  { label: 'Client Service Agreement', href: routes.clientServiceAgreement },
  { label: 'Testimonial Release', href: routes.testimonialRelease },
];

/** Blueprints Global 03, Row 3. */
export const footerBaseline =
  'educational and supportive, not therapy or medical care · Utah, working nationwide';

/* ------------------------------------------------------------------ */
/* Third-party URLs — Handoff §10. Paste exactly, never invent.        */
/* ------------------------------------------------------------------ */

/** Calendly — four final event URLs, confirmed 4 September 2026. */
export const calendly = {
  // Only after agreement acceptance and payment. Never linked from a public CTA.
  session60: 'https://calendly.com/darlene-startingpointconsulting/starting-point-60-minute-session',
  session90: 'https://calendly.com/darlene-startingpointconsulting/extended-individual-90-minute-session',
  leadership75: 'https://calendly.com/darlene-startingpointconsulting/individual-leadership-75-minute-session',
  // The only event a public CTA may link to.
  organizationalDiscovery:
    'https://calendly.com/darlene-startingpointconsulting/organizational-discovery-conversation',
};

/**
 * The Client Service Agreement acceptance step, which must sit BEFORE payment
 * (Handoff §10: "acceptance must occur before payment", and "Do not assume
 * Stripe provides the checkbox"). Built in Phase 4.
 *
 * Service buttons point here, never straight at a Stripe link — linking
 * directly would ship a purchase path that skips the agreement.
 */
export const checkoutPath = (id) => `/checkout/${id}`;

/**
 * Stripe — seven live Payment Links, one per paid individual offering.
 * Each is reached ONLY after affirmative Client Service Agreement acceptance
 * (Handoff §10 "Client Service Agreement acceptance"). `scheduling` names the
 * private post-payment page Darlene repoints the redirect to.
 */
export const stripeLinks = [
  {
    id: 'individual-nervous-system-session',
    name: 'Individual Nervous System Session',
    price: 175,
    url: 'https://buy.stripe.com/28E9AN4uu0th8jHgQp4ow00',
    scheduling: routes.schedule60,
  },
  {
    id: '4-session-package',
    name: '4-Session Package',
    price: 640,
    url: 'https://buy.stripe.com/8x29ANe544JxbvTas14ow06',
    scheduling: routes.schedule60,
    isPackage: true,
  },
  {
    id: 'extended-individual-session',
    name: 'Extended Individual Session',
    price: 250,
    url: 'https://buy.stripe.com/28E9AN8KK3Ft6bzas14ow02',
    scheduling: routes.schedule90,
  },
  {
    id: '4-session-integration-path',
    name: '4-Session Integration Path',
    price: 640,
    url: 'https://buy.stripe.com/eVqeV77GG8ZN57vfMl4ow01',
    scheduling: routes.schedule60,
    isPackage: true,
  },
  {
    id: 'individual-leadership-session',
    name: 'Individual Leadership Session',
    price: 295,
    url: 'https://buy.stripe.com/eVq14hgdc3FtarP7fP4ow03',
    scheduling: routes.scheduleLeadership,
  },
  {
    id: '3-session-leadership-package',
    name: '3-Session Leadership Package',
    price: 825,
    url: 'https://buy.stripe.com/dRm3cp1iiek7gQdgQp4ow04',
    scheduling: routes.scheduleLeadership,
    isPackage: true,
  },
  {
    id: 'integration-support-session',
    name: 'Integration Support Session',
    price: 175,
    url: 'https://buy.stripe.com/14A3cp7GG8ZN0RfcA94ow07',
    scheduling: routes.schedule60,
  },
];

/* ------------------------------------------------------------------ */
/* Pending inputs — Pending Items doc                                  */
/* ------------------------------------------------------------------ */

/**
 * "Where an input has not arrived, HIDE the related element — no dead links,
 * no empty download buttons, no non-functional signup forms, no placeholder
 * imagery." (Pending Items, two rules.)
 *
 * Flip a flag to true only when the real input actually lands.
 */
export const pending = {
  /** Newsletter platform not chosen (Beehiiv vs Kit/ConvertKit). */
  newsletter: false,
  /** LinkedIn URL not supplied. */
  linkedInUrl: null,
  /** Instagram URL not supplied. */
  instagramUrl: null,
  /** Everyday Regulation Toolkit PDF not supplied. */
  toolkitPdf: null,
  /** No signed Testimonial & Media Release confirmed on file yet. */
  testimonials: false,
  /** Homepage hero photograph not supplied — brand-colour treatment stands in. */
  heroPhoto: null,
  /** Speaking photograph not supplied. */
  speakingPhoto: null,
  /** Provider Resource / Speaker Kit / one-pagers not present in assets/. */
  clientResourceDocuments: false,
};

/** True when at least one social profile URL exists (Pending Items §04). */
export const hasSocialLinks = Boolean(pending.linkedInUrl || pending.instagramUrl);
