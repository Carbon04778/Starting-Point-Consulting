// Starting Point Consulting, Client Service Agreement
function ClientAgreement({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  const ul = (items) => (
    <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => <li key={c}>{c}</li>)}
    </ul>
  );
  return (
    <LegalPage
      eyebrow="Working together"
      title="Client Service Agreement"
      intro="This agreement sets out what you can expect from us, and what we ask of you, when we work together."
      updated="[PRE-LAUNCH PLACEHOLDER — effective date is the website launch date]"
      go={go}
    >
      <LegalP>
        This Client Service Agreement ("Agreement") is entered into between Starting Point Consulting, LLC ("Starting
        Point Consulting," "we," "us," or "our") and you ("Client," "you," or "your"). By accepting this Agreement at
        checkout or booking, or by purchasing or participating in our services, you agree to the terms below. Specific scope, dates, and fees for an engagement
        will be confirmed in a proposal, statement of work, or booking confirmation, which forms part of this Agreement.
      </LegalP>

      <LegalH>1. Services</LegalH>
      <LegalP>
        We provide educational and supportive services that may include coaching, consulting, workshops, training,
        speaking engagements, and digital or educational resources. The specific services, deliverables, format
        (virtual or in person), and schedule will be described in your individual engagement details.
      </LegalP>
      <LegalP>
        Individual sessions and packages are selected and paid for online, and your session time is then scheduled
        through our online scheduling tool. Organizational consulting, workshops, training, and speaking engagements
        begin with an inquiry and a discovery conversation, followed by a customized proposal and invoice.
      </LegalP>

      <LegalH>2. Educational nature, not medical or mental health care</LegalH>
      <LegalP>
        Our services are educational and informational and are designed to support learning, growth, resilience, and
        well-being. They are <strong>not</strong> medical care, psychotherapy, counseling, or a substitute for treatment
        from a licensed professional, and they are not intended to diagnose, treat, cure, or prevent any condition. You
        are responsible for your own health decisions and are encouraged to consult qualified providers as appropriate.
        If you are experiencing a medical or mental health emergency, seek care from a qualified professional.
      </LegalP>
      <LegalP>
        Participation is voluntary. You are encouraged to work within your own comfort and capacity, and you may pause
        or decline any exercise or practice at any time.
      </LegalP>

      <LegalH>3. Fees & payment</LegalH>
      <LegalP>
        Fees are described at the time of booking or in the applicable engagement proposal, and are payable in the
        amounts and on the schedule provided. Payments are processed securely through our third-party payment
        processor. Unless stated otherwise:
      </LegalP>
      {ul([
        'Fees are quoted in U.S. dollars and may be subject to applicable taxes.',
        'Individual sessions and packages are paid in full at the time of booking. A package purchase covers all sessions included in that package.',
        'A booking is not confirmed until the required payment and scheduling are complete.',
        'Organizational engagements, workshops, training, and speaking engagements are invoiced according to the terms set out in the applicable engagement proposal.',
        'A deposit may be required to reserve an organizational engagement or date, or to begin work.',
        'Returned payments or chargebacks may incur fees to the extent permitted by law.',
      ])}

      <LegalH>4. Scheduling, rescheduling & cancellation</LegalH>
      <LegalP>Because our services involve reserved time and preparation, the following applies unless your engagement states otherwise:</LegalP>
      {ul([
        'Individual sessions may be rescheduled or cancelled with at least 24 hours\u2019 notice.',
        'Sessions cancelled with less than 24 hours\u2019 notice, and missed appointments, may be charged in full.',
        'For a package, a late cancellation or missed appointment may be considered a used session.',
        'A package purchase includes the number of sessions specified at the time of purchase. Unless otherwise stated at purchase, package sessions expire six months from the date of purchase. Starting Point Consulting may grant an extension at its discretion.',
        'Organizational engagements, workshops, programs, training, and speaking engagements follow the cancellation, rescheduling, deposit, and refund provisions contained in their applicable proposal or booking confirmation.',
      ])}

      <LegalH>5. Client responsibilities</LegalH>
      <LegalP>To get the most from our work together, you agree to:</LegalP>
      {ul([
        'Provide accurate information relevant to the engagement',
        'Show up on time and prepared for scheduled sessions',
        'Communicate openly about your goals, needs, and any concerns',
        'Take responsibility for your own decisions and actions',
      ])}

      <LegalH>6. Confidentiality</LegalH>
      <LegalP>
        We respect your privacy and will keep information you share in the course of our work confidential, except where
        disclosure is required by law, necessary to prevent harm, or authorized by you. Our services are not provided as
        healthcare treatment, and Starting Point Consulting does not maintain clinical medical records as part of these
        services. Please see our HIPAA Note and Privacy Policy for additional information about privacy and how
        personal information is handled.
      </LegalP>

      <LegalH>7. Intellectual property</LegalH>
      <LegalP>
        All materials, frameworks, and resources we provide remain the property of Starting Point Consulting and are
        shared with you under a limited, personal or internal-organizational license. You may not resell, redistribute,
        or publicly reproduce them without our written permission.
      </LegalP>

      <LegalH>8. No guarantee of results</LegalH>
      <LegalP>
        We bring our full skill and experience to our work, but outcomes depend on many factors, including your own
        participation and circumstances. We do not guarantee any specific result.
      </LegalP>

      <LegalH>9. Limitation of liability</LegalH>
      <LegalP>
        To the fullest extent permitted by law, our total liability arising out of or relating to this Agreement will
        not exceed the amount you paid for the specific service giving rise to the claim, and we will not be liable for
        indirect, incidental, or consequential damages. This section is subject to our full Terms &amp; Conditions.
      </LegalP>

      <LegalH>10. Termination</LegalH>
      <LegalP>
        Either party may end an engagement with written notice. Fees for services already provided remain payable, and
        any refund for services not yet delivered will follow the cancellation terms above. We reserve the right to
        decline or discontinue service at our discretion.
      </LegalP>

      <LegalH>11. Governing law</LegalH>
      <LegalP>
        This Agreement is governed by the laws of the State of Utah. Together with any engagement details and our
        Terms &amp; Conditions, it represents the entire agreement between us regarding the services.
      </LegalP>

      <LegalH>12. Acknowledgement</LegalH>
      <LegalP>
        By affirmatively accepting this Agreement before completing a purchase or booking, by electronically signing
        it, or by otherwise indicating your acceptance, you acknowledge that you have read, understood, and agree to this Client Service
        Agreement. Where an agreement is executed separately, such as an organizational engagement, signature and date
        fields are provided on the document itself. Questions? Contact us at darlene@startingpointconsulting.com, or
        write to Starting Point Consulting, LLC, 8850 S 700 E #493, Sandy, UT 84070.
      </LegalP>
    </LegalPage>
  );
}
window.ClientAgreement = ClientAgreement;
