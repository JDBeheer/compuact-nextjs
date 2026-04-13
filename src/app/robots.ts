import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/inschrijven/gegevens', '/stylesheet'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
