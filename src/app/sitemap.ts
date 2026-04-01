import { MetadataRoute } from 'next'
import { locaties } from '@/data/locaties'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

  let cursussen: { slug: string; updated_at?: string; created_at: string }[] = []
  let categorieen: { slug: string }[] = []
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server')
    const supabase = createServiceRoleClient()
    const [{ data: cursusData }, { data: catData }] = await Promise.all([
      supabase.from('cursussen').select('slug, created_at, updated_at').eq('actief', true),
      supabase.from('categorieen').select('slug'),
    ])
    cursussen = cursusData || []
    categorieen = catData || []
  } catch {
    // Supabase not configured yet
  }

  const cursusPages = cursussen.map((c) => ({
    url: `${baseUrl}/cursussen/${c.slug}`,
    lastModified: new Date(c.updated_at || c.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoriePages = categorieen.map((c) => ({
    url: `${baseUrl}/cursussen/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cursussen`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...categoriePages,
    { url: `${baseUrl}/incompany`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/over-ons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/veelgestelde-vragen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...cursusPages,
  ]
}
