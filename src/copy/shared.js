/**
 * Copy blocks that appear on more than one page, held once so they cannot
 * drift apart.
 *
 * Every string is placed verbatim from Master Website Copy. Section references
 * are in the comments. Do not rewrite, shorten, or "improve" any of it —
 * Start Here: "Approved website copy should be placed as written."
 */
import { routes, calendly } from '../config/site.js';

/**
 * Master Copy §03 — the six service cards. Appears on Home ("How we partner"
 * band, Blueprints Page 01 §4) and on Services (Blueprints Page 02 §2).
 *
 * These are the canonical service names (Handoff §01). Blueprints Page 02
 * mistypes the fourth as "Resilience & Well-Being & Resilience" — corrected
 * here to the canonical name.
 *
 * `anchor` values are the footer's "How we partner" link targets.
 *
 * `icon` and `tone` are the prototype's, verbatim from `Services.jsx` —
 * Sprout/gold, Sunrise/sage, Compass/ink, Activity/gold, HeartPulse/sage,
 * Mic/gold, in this order. They are not decoration chosen here; do not swap
 * them without Darlene.
 */
export const serviceCards = [
  {
    anchor: 'individual-sessions',
    title: 'Individual Sessions',
    body: 'Personal growth, resilience, life transitions, and well-being, starting where you are.',
    href: routes.individualSessions,
    icon: 'sprout',
    tone: 'gold',
  },
  {
    anchor: 'workshops-and-education',
    title: 'Workshops & Education',
    body: 'Neuroscience-informed sessions that turn complex science into simple, meaningful practices.',
    icon: 'sunrise',
    tone: 'sage',
  },
  {
    anchor: 'leadership-and-team-development',
    title: 'Leadership & Team Development',
    body: 'Strengthening self-awareness, communication, collaboration, and healthy cultures.',
    icon: 'compass',
    tone: 'ink',
  },
  {
    anchor: 'resilience-and-well-being-programs',
    title: 'Resilience & Well-Being Programs',
    body: 'Reducing burnout and supporting long-term, sustainable well-being.',
    icon: 'activity',
    tone: 'gold',
  },
  {
    anchor: 'healthcare-and-first-responders',
    title: 'Healthcare & First Responders',
    body: 'Building resilience, recovery, teamwork, and sustainable well-being under pressure.',
    icon: 'heart-pulse',
    tone: 'sage',
  },
  {
    anchor: 'speaking-and-consulting',
    title: 'Speaking & Consulting',
    body: 'Keynotes and strategic guidance that inspire dialogue and healthier cultures.',
    href: routes.speaking,
    icon: 'mic',
    tone: 'gold',
  },
];

/** Master Copy §03 — the Transformation & Integration Support feature card. */
export const integrationFeature = {
  badge: 'New offering',
  title: 'Transformation & Integration Support',
  subheading:
    'For the months after a significant experience, where lasting change is actually made.',
  body: 'Integration is the work of making sense of a significant or altered-state experience after it happens. Grounded in nervous system science and somatic practice, this support helps you settle what surfaced and translate it into self, everyday life, and relationships, at your own pace, with compassion and curiosity.',
  bullets: [
    'Integration, making sense of an experience and translating insight into everyday life',
    'Somatic practices, grounding, regulation, and gentle movement to support the body through change',
    'Meaning-making, turning what surfaced into small, sustainable steps at your own pace',
  ],
};

/**
 * Master Copy §03 — "Caption — scope disclaimer (must appear in full)".
 *
 * Legal Pages Index §03 lists this among the lines that must not change,
 * including "We work with people only after their experiences" and "We do not
 * supply, administer, or recommend any substance, and we neither encourage nor
 * discourage its use."
 */
export const integrationScopeDisclaimer =
  'Integration support is non-clinical education and somatic practice. We do not provide medical care, psychotherapy, psychiatric care, or any other professional service, and we do not diagnose or treat any condition. We work with people only after their experiences. We do not supply, administer, or recommend any substance, and we neither encourage nor discourage its use. If you are managing a clinical or long-term health concern, please also work with a licensed medical or mental health professional.';

/**
 * Master Copy §06 — "Caption — disclaimer beneath the cards", on the
 * Individual Sessions page. A SEPARATE, shorter approved wording from the §03
 * one above. Both are approved; each belongs where its section places it. Do
 * not merge them or substitute one for the other.
 */
export const integrationScopeDisclaimerShort =
  'Integration support is non-clinical education and somatic practice, offered only for experiences that have already occurred. We do not supply, administer, or recommend any substance, and we neither encourage nor discourage its use. This work is not psychotherapy, counseling, or medical care.';

/**
 * Handoff §11 — "Boundary sentence, on every service area". Not optional, and
 * not to be softened: "That boundary sentence appears on every service area
 * and must not be removed or softened" (Start Here §01).
 */
export const boundarySentence =
  'This work is educational and supportive. It is not psychotherapy, counseling, diagnosis, or medical treatment, and it does not replace care from licensed healthcare or mental health professionals.';

/** Master Copy §03 — "Who we serve". */
export const whoWeServe = {
  heading: 'Who we serve',
  body: 'Much of this work begins with one person. Individuals come to us directly or through a therapist or provider, alongside the teams, schools, and organizations we partner with.',
  chips: [
    'Individuals & families',
    'Therapist & provider connections',
    'Students & educators',
    'Healthcare & first responders',
    'Leaders & teams',
    'Organizations',
    'Communities',
  ],
};

/**
 * Master Copy §16 — the "Let's begin" contact panel. Used as a closing section
 * on Home and Services (Blueprints Page 01 §5, Page 02 §5) and as the whole of
 * the Contact page (Blueprints Page 15).
 */
export const contactPanel = {
  heading: "Let's begin",
  body: "Tell us a little about where you are today, whether that's your own goals, your team, or your organization. Together we'll find the right place to begin.",
  iconRows: [
    'Individuals welcome',
    'darlene@startingpointconsulting.com',
    'Organizational discovery conversations, Monday through Thursday',
  ],
  // "Book a discovery call" is retired. This routes to the Organizational
  // Discovery Conversation — the only event a public CTA may link to.
  button: { label: 'Start a Conversation', href: calendly.organizationalDiscovery },
  form: {
    fields: [
      { name: 'name', label: 'Full name', placeholder: 'Jordan Lee', type: 'text', required: true },
      { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email', required: true },
      {
        name: 'role',
        label: 'I am a…',
        placeholder: 'Select one',
        type: 'select',
        required: true,
        options: [
          'Individual or family',
          'Student or educator',
          'Healthcare or first responder',
          'Leader or team',
          'Organization',
          'Community',
          'Therapist or provider referring a client',
          'Other',
        ],
      },
      /* "Who referred you?" was here. Removed on Darlene's instruction,
         10 September 2026: "We intentionally decided not to collect
         referring-provider/person names as part of routine intake or
         inquiry." Do not restore it. The "I am a..." options still include
         "Therapist or provider referring a client", which is a category and
         collects no name. */
      {
        name: 'message',
        label: 'What brings you here?',
        placeholder: 'A few words on your goals',
        type: 'textarea',
        required: true,
      },
    ],
    submit: "Let's begin the conversation",
    success: {
      heading: "Thank you, we'll be in touch.",
      body: 'We read every note personally and reply within two business days.',
    },
  },
};

/**
 * Handoff §01 — "Credential and training badges, the complete approved set …
 * Do not add anything to this set, and do not build a credential wall."
 *
 * Shared so About and For Therapists & Providers cannot drift apart. MBA, BSN
 * and RN are deliberately absent: §01 says they are not repeated as badges
 * because they follow her name.
 *
 * The prototype's providers page shows only the last two of these. Blueprints
 * Page 14 §6 asks for "the approved training badges" and lists all five, and
 * Blueprints outrank the mockup, so all five appear on both pages.
 */
export const credentialBadges = [
  'STOTT Pilates Certified',
  'Powerhouse Pilates Certified',
  'Certified DISC + Values Coach',
  'Somatic Practitioner training, The Embody Lab',
  'Polyvagal Mapping, Rhythm of Regulation®, Deb Dana',
];

/**
 * Newsletter — Master Copy §17, approved verbatim.
 *
 * §17 lists the form as "Email address — Your email · Subscribe": the field
 * label is "Email address", the placeholder "Your email", the button
 * "Subscribe". The footer uses `bodyCompact` ("Body — compact/footer variant")
 * and the second of the three approved success lines, which is the one the
 * prototype's footer variant prints.
 *
 * `error` is the only string here NOT from §17 — §17 supplies no validation
 * message and neither does any other document. It is written to the same shape
 * the contact form's constructed errors already use ("Enter your {field} so we
 * can reply."), so no new voice enters the site, but it is unapproved copy and
 * is flagged as such — see OPEN-QUESTIONS #29.
 */
export const newsletter = {
  eyebrow: 'The newsletter',
  bodyCompact: 'Simple tools for regulation, resilience, and well-being, a few times a month.',
  fieldLabel: 'Email address',
  placeholder: 'Your email',
  submit: 'Subscribe',
  caption: 'No spam. Unsubscribe anytime.',
  successCompact: "You're on the list, thank you. Watch your inbox for tools and reflections.",
  error: 'Enter your email address so we can add you to the list.',
};
