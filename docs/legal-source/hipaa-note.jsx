// Starting Point Consulting, HIPAA Note
function HipaaNote({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  return (
    <LegalPage
      eyebrow="Privacy & your health information"
      title="HIPAA Note"
      intro="A plain-language note about how privacy law applies to our educational services, and where it doesn't."
      updated="[Effective date]"
      go={go}
    >
      <LegalCallout>
        This note is provided for clarity and is not legal advice. Please have it reviewed by qualified legal counsel,
        especially if you ever deliver services in a covered clinical setting or as a business associate of a covered
        entity.
      </LegalCallout>

      <LegalH>We are not a HIPAA-covered entity</LegalH>
      <LegalP>
        The Health Insurance Portability and Accountability Act ("HIPAA") sets privacy rules for "covered entities"
        (generally healthcare providers who bill insurance electronically, health plans, and healthcare clearinghouses)
        and their business associates. Starting Point Consulting provides educational, coaching, consulting, and
        speaking services. We do not provide medical or clinical care and do not bill insurance, so our services are
        generally <strong>not</strong> covered by HIPAA.
      </LegalP>

      <LegalH>What this means for you</LegalH>
      <LegalP>
        Because our work is educational rather than clinical, the information you share with us is not "protected health
        information" (PHI) under HIPAA. That said, we take your privacy seriously. We handle the personal information you
        share thoughtfully and in accordance with our Privacy Policy, and we keep what you tell us confidential except
        where disclosure is required by law, necessary to prevent harm, or authorized by you.
      </LegalP>

      <LegalH>Please share thoughtfully</LegalH>
      <LegalP>
        You are not required to share medical history, diagnoses, or other sensitive health details in order to work
        with us. We encourage you to share only what is helpful for our educational work together, and to keep clinical
        health information with your licensed healthcare providers, where HIPAA protections apply.
      </LegalP>

      <LegalH>Working with healthcare organizations</LegalH>
      <LegalP>
        When we partner with healthcare systems, clinics, or other covered entities, we do not need access to patient
        records to do our work. If any engagement were ever to involve protected health information, we would put an
        appropriate agreement (such as a Business Associate Agreement) in place before that work began.
      </LegalP>

      <LegalH>If you need clinical care</LegalH>
      <LegalP>
        Our services complement, but do not replace, care from licensed medical and mental health professionals. For
        diagnosis, treatment, or records covered by HIPAA, please work with a qualified healthcare provider. If you are
        experiencing a medical or mental health emergency, seek care from a qualified professional right away.
      </LegalP>

      <LegalH>Questions</LegalH>
      <LegalP>
        If you have questions about how we handle your information, please review our Privacy Policy or contact us at
        darlene@startingpointconsulting.com, or write to Starting Point Consulting, LLC, 8850 S 700 E #493, Sandy, UT 84070.
      </LegalP>
    </LegalPage>
  );
}
window.HipaaNote = HipaaNote;
