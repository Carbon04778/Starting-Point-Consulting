// Starting Point Consulting, Accessibility Statement
function Accessibility({ go }) {
  const { LegalPage, LegalP, LegalH, LegalCallout } = window;
  const ul = (items) => (
    <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => <li key={c}>{c}</li>)}
    </ul>
  );
  return (
    <LegalPage
      eyebrow="Inclusive by design"
      title="Accessibility Statement"
      intro="Starting Point Consulting is committed to creating an accessible and inclusive experience for all visitors."
      updated="[Effective date]"
      go={go}
    >
      <LegalH>Our commitment</LegalH>
      <LegalP>
        Accessibility is part of how we live our values. We want everyone, regardless of ability, device, or
        circumstance, to be able to access our content, learn from our work, and connect with us. We are continually
        working to improve the accessibility and usability of our website and digital resources.
      </LegalP>

      <LegalH>Standards we aim for</LegalH>
      <LegalP>
        We strive to align our website with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. These
        internationally recognized guidelines help make web content more accessible to people with a wide range of
        abilities, including visual, auditory, motor, and cognitive differences.
      </LegalP>

      <LegalH>Steps we take</LegalH>
      <LegalP>To support an accessible experience, we work to:</LegalP>
      {ul([
        'Use clear, readable language and a logical content structure',
        'Maintain sufficient color contrast and legible type sizes',
        'Provide text alternatives for meaningful images',
        'Support keyboard navigation and visible focus states',
        'Design forms and links with descriptive, accessible labels',
        'Test our site across common browsers and devices',
      ])}

      <LegalH>Ongoing effort</LegalH>
      <LegalP>
        Accessibility is an ongoing process rather than a one-time effort. As we add new content and features, we
        review them with accessibility in mind and address issues as we become aware of them. We also consider
        accessibility in the materials and resources we share through our programs.
      </LegalP>

      <LegalH>Third-party content</LegalH>
      <LegalP>
        Some content or tools on our website may be provided by third parties (for example, scheduling, payment, or
        embedded media). While we choose our partners thoughtfully, we may not have full control over the accessibility
        of third-party content. If you encounter difficulty with any such element, please let us know and we will do our
        best to help.
      </LegalP>

      <LegalH>We welcome your feedback</LegalH>
      <LegalP>
        If you experience difficulty accessing any part of this website or need information in an alternative format,
        please contact us. We welcome your feedback and are continually working to improve accessibility. When
        possible, please include the page or content you were trying to access and the difficulty you experienced, so
        we can respond effectively.
      </LegalP>
      {ul([
        'Email: darlene@startingpointconsulting.com',
        'Mailing address: 8850 S 700 E #493, Sandy, UT 84070',
      ])}

      <LegalCallout>
        If you need information or assistance right away and are unable to access it through the website, email us and
        we will provide the information in an alternative format or help you directly.
      </LegalCallout>
    </LegalPage>
  );
}
window.Accessibility = Accessibility;
