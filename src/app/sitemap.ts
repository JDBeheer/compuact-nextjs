import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

  let cursussen: { slug: string; created_at: string }[] = []
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server')
    const supabase = createServiceRoleClient()
    const { data } = await supabase
      .from('cursussen')
      .select('slug, created_at')
      .eq('actief', true)
    cursussen = data || []
  } catch {
    // Supabase not configured yet
  }

  const cursusPages = (cursussen || []).map((c) => ({
    url: `${baseUrl}/cursussen/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cursussen`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/over-ons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/veelgestelde-vragen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...cursusPages,
  ]
}
