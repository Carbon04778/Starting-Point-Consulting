// Starting Point Consulting, Privacy Policy
function PrivacyPolicy({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  const ul = (items) => (
    <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => <li key={c}>{c}</li>)}
    </ul>
  );
  return (
    <LegalPage
      eyebrow="Your privacy"
      title="Privacy Policy"
      intro="We respect your privacy and are committed to protecting the personal information you share with us. This policy explains what we collect, how we use it, and the choices you have."
      updated="[Effective date]"
      go={go}
    >
      <LegalCallout>
        This Privacy Policy is provided as a thorough starting point. Please have it reviewed by qualified legal
        counsel and replace the bracketed placeholders (effective date, business address, and governing state) before
        publishing.
      </LegalCallout>

      <LegalP>
        This Privacy Policy describes how Starting Point Consulting, LLC ("Starting Point Consulting," "we," "us," or
        "our") collects, uses, and protects information when you visit our website, contact us, subscribe to our
        communications, or participate in our programs and services.
      </LegalP>

      <LegalH>1. Information we collect</LegalH>
      <LegalP><strong>Information you provide to us.</strong> We collect information you choose to share, such as when you complete a contact or inquiry form, book a service, register for a workshop or program, subscribe to our newsletter, or purchase a product. This may include:</LegalP>
      {ul([
        'Name and contact details (email address, phone number, mailing address)',
        'The organization, team, or role you tell us about',
        'Information about your goals or what brings you to us',
        'Payment and billing information (processed by our payment provider, see Section 6)',
        'Any other information you include in your messages or communications with us',
      ])}
      <LegalP><strong>Information collected automatically.</strong> When you visit our website, certain information may be collected automatically through cookies and similar technologies, including:</LegalP>
      {ul([
        'Device and browser type, operating system, and language',
        'IP address and general location (such as city or region)',
        'Pages visited, links clicked, and time spent on the site',
        'Referring website or source',
      ])}

      <LegalH>2. How we use your information</LegalH>
      <LegalP>We use the information we collect to:</LegalP>
      {ul([
        'Respond to your inquiries and communicate with you',
        'Provide, schedule, and deliver our programs, services, and products',
        'Process payments and send receipts or confirmations',
        'Send newsletters, updates, and educational resources you have requested',
        'Improve our website, content, and offerings',
        'Maintain the security and integrity of our website',
        'Comply with legal obligations and enforce our terms',
      ])}
      <LegalP>We do not sell your personal information.</LegalP>

      <LegalH>3. Email & newsletter communications</LegalH>
      <LegalP>
        If you subscribe to our newsletter or opt in to receive communications, we will use your email address to send
        you updates, resources, and information about our work. Every marketing email includes an unsubscribe link, and
        you may opt out at any time. We may still send you non-promotional messages related to services you have
        requested or transactions you have made (for example, booking confirmations or receipts).
      </LegalP>

      <LegalH>4. Cookies & analytics</LegalH>
      <LegalP>
        Our website uses cookies and similar technologies to help the site function, remember your preferences, and
        understand how visitors use the site. We may use analytics services to collect aggregated, non-identifying
        information about site usage so we can improve the experience.
      </LegalP>
      <LegalP>
        You can control or disable cookies through your browser settings. Please note that some parts of the site may
        not function properly if cookies are disabled.
      </LegalP>

      <LegalH>5. How we share information</LegalH>
      <LegalP>We share personal information only as needed to operate our business and as described in this policy. This may include sharing with:</LegalP>
      {ul([
        'Service providers who perform functions on our behalf (such as payment processing, email delivery, scheduling, and analytics)',
        'Professional advisors, such as accountants and legal counsel, where appropriate',
        'Authorities or others when required by law, to protect rights and safety, or in connection with a business transfer',
      ])}
      <LegalP>We do not sell or rent your personal information to third parties for their own marketing.</LegalP>

      <LegalH>6. Third-party services</LegalH>
      <LegalP>
        We rely on trusted third-party services to operate our business. These providers process certain information
        on our behalf and maintain their own privacy practices. They may include:
      </LegalP>
      {ul([
        'Payment processing: Stripe (used to securely process payments; we do not store full payment card numbers)',
        'Email and newsletter delivery, our email marketing platform',
        'Website hosting and analytics providers',
        'Scheduling or booking tools',
      ])}
      <LegalP>
        We encourage you to review the privacy policies of these providers to understand how they handle your
        information.
      </LegalP>

      <LegalH>7. How we protect your information</LegalH>
      <LegalP>
        We use reasonable administrative, technical, and physical safeguards designed to protect personal information
        against loss, misuse, and unauthorized access or disclosure. However, no method of transmission over the
        internet or electronic storage is completely secure, and we cannot guarantee absolute security.
      </LegalP>

      <LegalH>8. Data retention</LegalH>
      <LegalP>
        We keep personal information only for as long as necessary to fulfill the purposes described in this policy,
        including to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.
        When information is no longer needed, we take steps to delete or de-identify it.
      </LegalP>

      <LegalH>9. Your privacy rights & choices</LegalH>
      <LegalP>Depending on where you live, you may have rights regarding your personal information, including the right to:</LegalP>
      {ul([
        'Access the personal information we hold about you',
        'Request correction of inaccurate information',
        'Request deletion of your information',
        'Opt out of marketing communications',
        'Object to or restrict certain processing',
      ])}
      <LegalP>
        To exercise any of these rights, please contact us using the details below. We will respond in accordance with
        applicable law.
      </LegalP>

      <LegalH>10. Children's privacy</LegalH>
      <LegalP>
        Our website and services are intended for adults and are not directed to children under 13 (or the minimum age
        required in your jurisdiction). We do not knowingly collect personal information from children. If you believe
        a child has provided us with personal information, please contact us so we can remove it.
      </LegalP>

      <LegalH>11. Third-party links</LegalH>
      <LegalP>
        Our website may contain links to other websites or resources. We are not responsible for the privacy practices
        or content of those third-party sites. We encourage you to review their privacy policies.
      </LegalP>

      <LegalH>12. Changes to this policy</LegalH>
      <LegalP>
        We may update this Privacy Policy from time to time. When we do, we will revise the "effective date" above.
        Material changes will be communicated through our website or by other appropriate means. Your continued use of
        our website after changes are posted constitutes acceptance of the updated policy.
      </LegalP>

      <LegalH>13. Contact us</LegalH>
      <LegalP>
        If you have questions about this Privacy Policy or how your information is handled, please contact us:
      </LegalP>
      {ul([
        'Starting Point Consulting, LLC',
        'Email: darlene@startingpointconsulting.com',
        'Mailing address: 8850 S 700 E #493, Sandy, UT 84070',
      ])}
    </LegalPage>
  );
}
window.PrivacyPolicy = PrivacyPolicy;
