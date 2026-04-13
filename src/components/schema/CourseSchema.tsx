interface CourseSchemaProps {
  naam: string
  beschrijving: string
  slug: string
  categorie: string
  prijs: number
  duur: string
  niveau: string
  sessies?: { datum: string; locatie: string }[]
}

export default function CourseSchema({
  naam,
  beschrijving,
  slug,
  categorie,
  prijs,
  duur,
  niveau,
  sessies,
}: CourseSchemaProps) {
  const baseUrl = 'https://www.computertraining.nl'

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: naam,
    description: beschrijving,
    url: `${baseUrl}/cursussen/${slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Compu Act Opleidingen',
      url: baseUrl,
    },
    educationalLevel: niveau,
    courseCode: slug,
    about: categorie,
    inLanguage: 'nl',
    offers: {
      '@type': 'Offer',
      price: prijs,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/cursussen/${slug}`,
    },
    timeRequired: duur,
    hasCourseInstance: (sessies || []).slice(0, 10).map((s) => ({
      '@type': 'CourseInstance',
      courseMode: 'Blended',
      startDate: s.datum,
      location: {
        '@type': 'Place',
        name: s.locatie,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'NL',
        },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
