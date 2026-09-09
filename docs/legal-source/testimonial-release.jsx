// Starting Point Consulting, Testimonial / Media Release
function TestimonialRelease({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  const ul = (items) => (
    <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => <li key={c}>{c}</li>)}
    </ul>
  );
  return (
    <LegalPage
      eyebrow="Sharing your story"
      title="Testimonial & Media Release"
      intro="When you share your experience with us, this release lets us know how we may, and may not, use your words and likeness."
      updated="[Effective date]"
      go={go}
    >
      <LegalCallout>
        This is a template release. Please have it reviewed by qualified legal counsel before use. Testimonials and
        endorsements should be genuine and reflect real experiences; advertising-disclosure rules (such as FTC
        guidelines) may apply.
      </LegalCallout>

      <LegalP>
        Thank you for sharing your experience with Starting Point Consulting, LLC ("Starting Point Consulting," "we,"
        "us," or "our"). By signing or otherwise agreeing to this release, you ("you") grant us permission to use the
        testimonial, feedback, and related materials you provide, on the terms below.
      </LegalP>

      <LegalH>1. What you are granting</LegalH>
      <LegalP>You grant Starting Point Consulting a non-exclusive, royalty-free, perpetual permission to use, reproduce, edit for length or clarity (without changing meaning), publish, and display:</LegalP>
      {ul([
        'Your written or spoken testimonial, quote, or feedback',
        'Your name, first name and last initial, or a chosen attribution as agreed below',
        'Your title, organization, or role, if you choose to include them',
        'Any photo, video, or audio you provide or that is captured with your consent',
      ])}

      <LegalH>2. How it may be used</LegalH>
      <LegalP>We may use these materials to share our work and the experiences of those we serve, including on our:</LegalP>
      {ul([
        'Website and landing pages',
        'Social media and email communications',
        'Presentations, proposals, and marketing materials',
        'Printed or digital promotional content',
      ])}

      <LegalH>3. How you would like to be credited</LegalH>
      <LegalP>You may choose how your testimonial is attributed. Please indicate your preference (for example):</LegalP>
      {ul([
        'Full name',
        'First name and last initial',
        'First name only',
        'Anonymous / initials only',
        'Role or organization may be included: [yes / no]',
      ])}

      <LegalH>4. No compensation</LegalH>
      <LegalP>
        You understand that you are providing your testimonial voluntarily and that you are not entitled to any payment
        or compensation for its use, now or in the future.
      </LegalP>

      <LegalH>5. Accuracy & honesty</LegalH>
      <LegalP>
        You confirm that your testimonial reflects your genuine experience and honest opinion. You understand that
        results vary from person to person, and that your experience may not be typical of every client.
      </LegalP>

      <LegalH>6. Privacy</LegalH>
      <LegalP>
        We will handle any personal information you share in accordance with our Privacy Policy. We will not publish
        sensitive personal or health details about you beyond what you choose to include in your testimonial.
      </LegalP>

      <LegalH>7. Withdrawing permission</LegalH>
      <LegalP>
        You may ask us to stop using your testimonial in future materials at any time by contacting us. We will honor
        your request promptly for new uses, though we may be unable to recall materials already printed, distributed,
        or published by third parties.
      </LegalP>

      <LegalH>8. Release</LegalH>
      <LegalP>
        To the extent permitted by law, you release Starting Point Consulting and its owners, employees, and
        contractors from any claims arising out of the proper use of the materials as described in this release.
      </LegalP>

      <LegalH>9. Agreement</LegalH>
      <LegalP>
        By signing below or confirming electronically, you acknowledge that you have read and agree to this Testimonial
        &amp; Media Release.
      </LegalP>
      {ul([
        'Name: ____________________________',
        'Attribution preference: ____________________________',
        'Signature: ____________________________   Date: __________',
        'Email: ____________________________',
      ])}
    </LegalPage>
  );
}
window.TestimonialRelease = TestimonialRelease;
