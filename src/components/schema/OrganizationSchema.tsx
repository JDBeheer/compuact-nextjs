export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'EducationalOrganization'],
    name: 'Compu Act Opleidingen',
    alternateName: 'Compu Act',
    url: 'https://www.computertraining.nl',
    logo: 'https://www.computertraining.nl/images/logo.svg',
    description:
      'Al meer dan 21 jaar dé specialist in Microsoft Office trainingen. Klassikaal, live online of incompany door heel Nederland.',
    foundingDate: '2003',
    telephone: '023-551 3409',
    email: 'info@computertraining.nl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vincent van Goghweg 85',
      addressLocality: 'Zaandam',
      postalCode: '1506 JB',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.4387,
      longitude: 4.8265,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '90',
      reviewCount: '90',
    },
    sameAs: [
      'https://www.facebook.com/compuact',
      'https://www.linkedin.com/company/compu-act-opleidingen',
    ],
    priceRange: '€€',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 20,
    },
    knowsAbout: [
      'Microsoft Excel',
      'Microsoft Word',
      'Microsoft PowerPoint',
      'Microsoft Outlook',
      'Microsoft Office 365',
      'Power BI',
      'AI tools',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
