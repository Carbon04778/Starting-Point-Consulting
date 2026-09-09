// Starting Point Consulting, Non-Discrimination & Inclusion Statement
function Inclusion({ go }) {
  const { LegalPage, LegalP, LegalCallout } = window;
  return (
    <LegalPage
      eyebrow="Dignity, respect, compassion"
      title="Non-Discrimination & Inclusion Statement"
      intro="Starting Point Consulting is committed to creating learning environments where every person is treated with dignity, respect, and compassion."
      go={go}
    >
      <LegalP>
        We welcome individuals of all backgrounds, identities, abilities, ages, cultures, races, ethnicities, national
        origins, religions, genders, sexual orientations, veteran status, and lived experiences.
      </LegalP>
      <LegalP>
        We believe that every person deserves to feel seen, heard, and valued. Our commitment is to provide inclusive,
        accessible, and trauma-aware educational experiences where people can learn, grow, and thrive together.
      </LegalP>
      <LegalCallout>
        We do not tolerate discrimination, harassment, or exclusion in any of our programs, services, partnerships, or
        events.
      </LegalCallout>
    </LegalPage>
  );
}
window.Inclusion = Inclusion;
