/**
 * New Client Intake — every string verbatim from
 * `docs/reference/new-client-intake-FINAL.pdf`, the FINAL version Darlene sent
 * on 10 September 2026. That PDF is the only source; the older HTML named in
 * the implementation note is superseded by it.
 *
 * The implementation note is unusually firm about this file:
 *
 *   "Place the fields and wording exactly as written. Content is settled;
 *    raise a question rather than editing it."
 *   "DO NOT ADD FIELDS. Specifically, do not add or restore: referral source
 *    with a therapist/provider option, referring-provider name, current-
 *    provider information, provider-coordination permission, emergency
 *    contact, medical or mental-health history, medications, trauma
 *    questions, substance or psychedelic-use questions, insurance details,
 *    date of birth, or government identifiers. These were removed by
 *    decision."
 *
 * So: no field appears here that is not on the PDF, and none is reworded.
 *
 * NOTHING IS REQUIRED. The PDF's own introduction says "nothing here is
 * required", so no field carries `required`. Raised with Darlene rather than
 * decided here — see OPEN-QUESTIONS.
 *
 * SINGLE-SELECT vs MULTI-SELECT. The PDF draws every option with the same
 * checkbox glyph, but only "What would you like to focus on?" is labelled
 * "(check any that apply)". The other three groups read as one-answer
 * questions ("Which best describes you?", "Preferred format"), so they are
 * radios and that one is checkboxes. Also raised rather than assumed.
 */

/** Page header. The PDF's "· FINAL" is a document marker, not web copy. */
export const intakeHeader = {
  eyebrow: 'New client intake',
  heading: "Welcome, let's start where you are.",
  intro:
    'A few questions before we meet, so our time together starts where it matters to you. Share as much or as little as feels right — there are no wrong answers, and nothing here is required.',
};

export const intakeSections = [
  {
    legend: 'Your details',
    fields: [
      { name: 'first_name', label: 'First name', type: 'text', autocomplete: 'given-name' },
      { name: 'last_name', label: 'Last name', type: 'text', autocomplete: 'family-name' },
      { name: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
      { name: 'pronouns', label: 'Pronouns (optional)', type: 'text' },
      { name: 'contact_preference', label: 'Best way and time to reach you', type: 'text' },
    ],
  },
  {
    legend: 'A little about you',
    fields: [
      {
        name: 'describes_you',
        label: 'Which best describes you?',
        type: 'radio',
        full: true,
        options: [
          'Individual',
          'Student or educator',
          'Healthcare or first responder',
          'Leader or team',
          'Organization',
          'Other',
        ],
      },
      {
        name: 'how_found',
        label: 'How did you find us? (optional)',
        type: 'radio',
        full: true,
        options: [
          'Online search',
          'Social media',
          'Someone I know',
          'Event, workshop, or talk',
          'Newsletter or article',
          'Other',
        ],
        // The PDF's own reassurance, and the reason this question is not the
        // referral-source field the implementation note forbids: it collects a
        // category, never a person.
        help: 'Simply helpful to know — never required, and no names needed.',
      },
    ],
  },
  {
    legend: 'What brings you here',
    fields: [
      {
        name: 'prompting',
        label: "In your own words, what's prompting you to reach out now?",
        type: 'textarea',
        full: true,
        help: "A sentence or two is plenty. There is no need to describe difficult experiences in detail — we'll follow your lead in the session.",
      },
      {
        name: 'meaningful_outcome',
        label: 'What would feel like a meaningful outcome from our work together?',
        type: 'textarea',
        full: true,
      },
      {
        name: 'focus',
        label: 'What would you like to focus on? (check any that apply)',
        type: 'checkbox',
        full: true,
        options: [
          'Stress & overwhelm',
          'Nervous system regulation',
          'Resilience & burnout',
          'Leadership & communication',
          'Life transitions',
          'Well-being & balance',
          'Not sure yet',
        ],
      },
    ],
  },
  {
    legend: 'Working together',
    fields: [
      {
        name: 'format',
        label: 'Preferred format',
        type: 'radio',
        options: ['Virtual', 'In person', 'Either'],
      },
      { name: 'preferred_times', label: 'Preferred days and times', type: 'text' },
      {
        name: 'support_needs',
        label: 'Is there anything that would help you feel comfortable and supported in our work?',
        type: 'textarea',
        full: true,
        help: "Accessibility needs, accommodations, how you like to learn or participate, or anything you'd simply like us to know.",
      },
    ],
  },
];

/**
 * The closing scope note. Its wording matches the boundary language used
 * across the site and is protected (Legal Pages Index §03) — do not soften it.
 *
 * The checkbox is an ACKNOWLEDGEMENT, not an agreement. The implementation
 * note: "DO NOT USE IT AS AN AGREEMENT. The Client Service Agreement is
 * affirmatively accepted on the website BEFORE payment and creates the
 * agreement record… Do not add a signature block or a second agreement
 * acceptance."
 */
export const intakeNote = {
  legend: 'A note before we begin',
  body: 'Starting Point Consulting provides educational and supportive services — nervous system education, somatic practice, and consulting. This work is not therapy, counseling, diagnosis, or medical care, and it does not replace care from a licensed professional. If you are experiencing a medical or mental health emergency, please seek care from a qualified provider or call your local emergency number.',
  acknowledgement: 'I have read the note above, and I understand that participation is voluntary.',
  finePrint:
    'Your Client Service Agreement was accepted at the time of purchase — there is nothing further to sign here. Your information is handled according to our Privacy Policy. If coordination with a provider you already work with would ever be helpful, that happens only if you ask and only with your written permission.',
};

/**
 * Shown in place after submitting. The PDF has no success copy — it is a
 * printed form — and the implementation note requires a "success message shown
 * in place", so this is written to match the form's own voice.
 */
export const intakeSuccess = {
  heading: 'Thank you, this is with us.',
  body: 'There is nothing else you need to do before your session. If anything changes, or you think of something you would like us to know, just reply to your confirmation email.',
};
