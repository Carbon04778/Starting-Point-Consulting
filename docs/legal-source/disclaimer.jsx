// Starting Point Consulting, Disclaimer page
function Disclaimer({ go }) {
  const { LegalPage, LegalP, LegalCallout } = window;
  return (
    <LegalPage
      eyebrow="Important information"
      title="Disclaimer"
      intro="The information provided by Starting Point Consulting is for educational and informational purposes only."
      go={go}
    >
      <LegalP>
        Our workshops, coaching, consulting, speaking engagements, and educational resources are designed to support
        learning, personal growth, leadership development, resilience, and well-being.
      </LegalP>
      <LegalP>
        Our services are not intended to diagnose, treat, cure, or prevent any medical or mental health condition,
        nor are they a substitute for professional medical, psychological, or therapeutic care.
      </LegalP>
      <LegalCallout>
        If you are experiencing a medical or mental health emergency, or have concerns about your health, please seek
        care from a qualified healthcare professional.
      </LegalCallout>
      <LegalP>
        Our work complements, but does not replace, the care provided by licensed medical and mental health
        professionals.
      </LegalP>
      <LegalP>
        Participation in our programs is voluntary, and individuals are encouraged to use their own judgment and
        consult their healthcare providers when appropriate.
      </LegalP>
    </LegalPage>
  );
}
window.Disclaimer = Disclaimer;
