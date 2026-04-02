import { MetadataRoute } from 'next'
import { locaties } from '@/data/locaties'
import { extraSteden } from '@/data/steden'

export const dynamic = 'force-dynamic'

const CATEGORIE_SLUGS = ['excel', 'word', 'outlook', 'powerpoint', 'power-bi', 'office-365', 'ai', 'project', 'visio', 'vba']

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

  // All city slugs (own locations + extra cities)
  const alleSteden = [
    ...locaties.map(l => l.slug),
    ...extraSteden.map(s => s.slug),
  ]

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cursussen`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/incompany`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/over-ons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/veelgestelde-vragen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/algemene-voorwaarden`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/locaties`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // ── Category pages ──
  const categoriePages = categorieen.map((c) => ({
    url: `${baseUrl}/cursussen/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // ── Location pages ──
  const locatiePages = locaties.map((l) => ({
    url: `${baseUrl}/locaties/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── Course pages ──
  const cursusPages = cursussen.map((c) => ({
    url: `${baseUrl}/cursussen/${c.slug}`,
    lastModified: new Date(c.updated_at || c.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // ── Local SEO: categorie + stad (e.g. /excel-cursus-amsterdam) ──
  const categorieStadPages: MetadataRoute.Sitemap = []
  for (const cat of CATEGORIE_SLUGS) {
    for (const stad of alleSteden) {
      categorieStadPages.push({
        url: `${baseUrl}/${cat}-cursus-${stad}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    }
  }

  // ── Local SEO: cursus + stad (e.g. /excel-basis-cursus-amsterdam) ──
  const cursusStadPages: MetadataRoute.Sitemap = []
  for (const cursus of cursussen) {
    for (const stad of alleSteden) {
      cursusStadPages.push({
        url: `${baseUrl}/${cursus.slug}-cursus-${stad}`,
        lastModified: new Date(cursus.updated_at || cursus.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })
    }
  }

  return [
    ...staticPages,
    ...categoriePages,
    ...locatiePages,
    ...cursusPages,
    ...categorieStadPages,
    ...cursusStadPages,
  ]
}
