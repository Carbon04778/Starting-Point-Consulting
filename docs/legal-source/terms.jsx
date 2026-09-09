// Starting Point Consulting, Terms & Conditions
function Terms({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  const ul = (items) => (
    <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => <li key={c}>{c}</li>)}
    </ul>
  );
  return (
    <LegalPage
      eyebrow="The agreement"
      title="Terms & Conditions"
      intro="These terms govern your use of our website and your participation in our programs, services, and products. Please read them carefully."
      updated="[Effective date]"
      go={go}
    >
      <LegalCallout>
        These Terms &amp; Conditions are provided as a thorough starting point. Please have them reviewed by qualified
        legal counsel and replace the bracketed placeholders (effective date, governing state, and business address)
        before publishing.
      </LegalCallout>

      <LegalP>
        These Terms &amp; Conditions ("Terms") form an agreement between you and Starting Point Consulting, LLC
        ("Starting Point Consulting," "we," "us," or "our"). By accessing our website or engaging our services, you
        agree to these Terms. If you do not agree, please do not use our website or services.
      </LegalP>

      <LegalH>1. Eligibility</LegalH>
      <LegalP>
        You must be at least 18 years old, or the age of majority in your jurisdiction, to purchase services or enter
        into this agreement. By engaging our services, you represent that you meet this requirement and that the
        information you provide is accurate.
      </LegalP>

      <LegalH>2. Educational nature of our services</LegalH>
      <LegalP>
        Our services are educational and informational in nature and are designed to support learning, personal growth,
        leadership development, resilience, and well-being. They are <strong>not</strong> a substitute for professional
        medical, psychological, or therapeutic care, and they are not intended to diagnose, treat, cure, or prevent any
        condition. Please review our Disclaimer for important details.
      </LegalP>

      <LegalH>3. Coaching & consulting services</LegalH>
      <LegalP>
        Coaching and consulting engagements are provided on the terms agreed in a proposal, statement of work, or
        booking confirmation. Specific deliverables, schedules, and fees will be described at the time of engagement.
        You are responsible for your own decisions and actions; outcomes depend on many factors, and we do not
        guarantee specific results.
      </LegalP>

      <LegalH>4. Workshops & speaking engagements</LegalH>
      <LegalP>
        Workshops, trainings, and speaking engagements are scheduled by agreement and may be subject to a separate
        booking agreement covering scope, dates, travel, materials, and fees. Dates and details are confirmed in
        writing. Rescheduling or cancellation of a booked event is governed by Section 7 and any applicable event
        agreement.
      </LegalP>

      <LegalH>5. Digital products & educational resources</LegalH>
      <LegalP>
        We may offer digital products and educational resources (such as guides, recordings, or course materials). When
        you purchase or access these, we grant you a limited, non-exclusive, non-transferable, revocable license to use
        them for your own personal or internal organizational use. Unless expressly stated, you may not:
      </LegalP>
      {ul([
        'Resell, redistribute, sublicense, or share access with others',
        'Reproduce or republish the materials publicly',
        'Modify or create derivative works for distribution',
        'Use the materials for commercial training without our written permission',
      ])}

      <LegalH>6. Payment terms</LegalH>
      <LegalP>
        Fees are described at the time of booking or purchase and are payable in the amounts and on the schedule
        provided. Payments are processed securely through our third-party payment provider (Stripe). You agree to
        provide accurate payment information and authorize the applicable charges. Unless stated otherwise, fees are
        quoted in U.S. dollars and may be subject to applicable taxes. Individual sessions and packages are due at the
        time of booking. Organizational engagements, workshops, and speaking dates may require a deposit to reserve the
        date, as specified in the final proposal and agreement. For work outside the local area,
        reasonable travel and lodging expenses may be added to the engagement proposal.
      </LegalP>

      <LegalH>7. Refund & cancellation policy</LegalH>
      <LegalP>
        Because our services involve reserved time and preparation, the following applies unless a different policy is
        stated in your specific agreement:
      </LegalP>
      {ul([
        'Coaching & consulting: appointments may be rescheduled or cancelled with at least 24 hours\u2019 notice. Late cancellations or missed sessions may be charged in full.',
        'Workshops & events: cancellation and rescheduling terms, including any non-refundable deposit, are set out in the applicable booking agreement.',
        'Digital products: due to their nature, digital products and downloadable resources are generally non-refundable once access has been delivered, except where required by law.',
      ])}
      <LegalP>
        If you believe there has been an error with a charge, please contact us and we will work with you in good faith.
      </LegalP>

      <LegalH>8. Intellectual property & copyright</LegalH>
      <LegalP>
        All content, materials, methods, frameworks, and resources provided by Starting Point Consulting, including
        text, graphics, logos, presentations, recordings, and course materials, are owned by or licensed to us and are
        protected by copyright, trademark, and other intellectual property laws. The Starting Point Consulting name and
        logo are our trademarks and may not be used without written permission. Nothing in these Terms transfers
        ownership of our intellectual property to you.
      </LegalP>

      <LegalH>9. Your responsibilities & acceptable use</LegalH>
      <LegalP>When using our website or participating in our programs, you agree not to:</LegalP>
      {ul([
        'Use our content or services for any unlawful purpose',
        'Infringe our or others\u2019 intellectual property rights',
        'Disrupt or interfere with the security or operation of our website',
        'Misrepresent your identity or affiliation',
      ])}

      <LegalH>10. Disclaimers</LegalH>
      <LegalP>
        Our website, content, and services are provided on an "as is" and "as available" basis without warranties of
        any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose,
        and non-infringement. We do not warrant that the website will be uninterrupted, error-free, or secure. Any
        reliance on the content is at your own discretion and risk, and our services do not replace professional medical
        or mental health care.
      </LegalP>

      <LegalH>11. Limitation of liability</LegalH>
      <LegalP>
        To the fullest extent permitted by law, Starting Point Consulting, LLC and its owners, employees, and
        contractors will not be liable for any indirect, incidental, special, consequential, or punitive damages, or
        any loss of profits, data, or goodwill, arising out of or related to your use of our website, content, or
        services. To the fullest extent permitted by law, our total liability for any claim arising out of or relating
        to these Terms or our services will not exceed the amount you paid to us for the specific service giving rise to
        the claim.
      </LegalP>

      <LegalH>12. Indemnification</LegalH>
      <LegalP>
        You agree to indemnify and hold harmless Starting Point Consulting, LLC and its owners, employees, and
        contractors from any claims, damages, losses, or expenses (including reasonable legal fees) arising out of your
        misuse of our website, content, or services, or your violation of these Terms.
      </LegalP>

      <LegalH>13. Third-party links & services</LegalH>
      <LegalP>
        Our website and materials may reference or link to third-party websites and services that we do not control.
        We are not responsible for their content, practices, or availability, and your use of them is governed by their
        own terms and policies.
      </LegalP>

      <LegalH>14. Termination</LegalH>
      <LegalP>
        We may suspend or terminate your access to our website or services, or decline to provide services, at our
        discretion, including for any violation of these Terms. Provisions that by their nature should survive
        termination, including intellectual property, disclaimers, limitation of liability, and indemnification, will
        continue to apply.
      </LegalP>

      <LegalH>15. Governing law & dispute resolution</LegalH>
      <LegalP>
        These Terms are governed by the laws of the State of Utah, without regard to its conflict-of-laws rules. You
        agree that any dispute arising out of or relating to these Terms or our services will be resolved in the state
        or federal courts located in Utah, unless otherwise required by law. The parties agree to attempt to resolve
        any dispute informally and in good faith before pursuing formal proceedings.
      </LegalP>

      <LegalH>16. Changes to these terms</LegalH>
      <LegalP>
        We may update these Terms from time to time. When we do, we will revise the "effective date" above. Your
        continued use of our website or services after changes are posted constitutes acceptance of the updated Terms.
      </LegalP>

      <LegalH>17. Contact us</LegalH>
      <LegalP>If you have questions about these Terms, please contact us:</LegalP>
      {ul([
        'Starting Point Consulting, LLC',
        'Email: darlene@startingpointconsulting.com',
        'Mailing address: 8850 S 700 E #493, Sandy, UT 84070',
      ])}
    </LegalPage>
  );
}
window.Terms = Terms;
