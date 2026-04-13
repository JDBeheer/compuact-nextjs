import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

interface SeoAuditItem {
  slug: string
  titel: string
  categorie: string
  seo_title: string | null
  seo_description: string | null
  title_length: number
  desc_length: number
  title_score: 'slecht' | 'matig' | 'goed' | 'uitstekend'
  desc_score: 'slecht' | 'matig' | 'goed' | 'uitstekend'
  title_issues: string[]
  desc_issues: string[]
}

function scoreTitel(title: string | null, cursusTitel: string): { score: SeoAuditItem['title_score']; issues: string[] } {
  if (!title) return { score: 'slecht', issues: ['Geen SEO titel ingesteld — gebruikt fallback'] }

  const issues: string[] = []
  const len = title.length

  if (len < 30) issues.push(`Te kort (${len} tekens, min. 30)`)
  if (len > 60) issues.push(`Te lang (${len} tekens, max. 60)`)
  if (!title.toLowerCase().includes('compu act') && !title.toLowerCase().includes('cursus')) issues.push('Mist "cursus" of merknaam')
  if (!title.toLowerCase().includes(cursusTitel.toLowerCase().split(' ')[0])) issues.push('Cursusnaam niet in titel')

  // Check for power words
  const powerWords = ['leer', 'volg', 'boost', 'verbeter', 'professioneel', 'cursus', 'training']
  const hasPowerWord = powerWords.some(w => title.toLowerCase().includes(w))
  if (!hasPowerWord) issues.push('Mist actiewoord (leer, volg, boost)')

  if (issues.length === 0) return { score: 'uitstekend', issues: [] }
  if (issues.length === 1 && !issues[0].includes('Te kort') && !issues[0].includes('Te lang')) return { score: 'goed', issues }
  if (issues.length <= 2) return { score: 'matig', issues }
  return { score: 'slecht', issues }
}

function scoreDescription(desc: string | null, cursusTitel: string): { score: SeoAuditItem['desc_score']; issues: string[] } {
  if (!desc) return { score: 'slecht', issues: ['Geen SEO beschrijving ingesteld — gebruikt fallback'] }

  const issues: string[] = []
  const len = desc.length

  if (len < 80) issues.push(`Te kort (${len} tekens, min. 80)`)
  if (len > 160) issues.push(`Te lang (${len} tekens, max. 160)`)
  if (!desc.toLowerCase().includes(cursusTitel.toLowerCase().split(' ')[0])) issues.push('Cursusnaam niet in beschrijving')

  // CTA check
  const ctaWords = ['schrijf', 'meld', 'bekijk', 'volg', 'start', 'leer', 'ontdek', 'boost', 'verbeter']
  const hasCta = ctaWords.some(w => desc.toLowerCase().includes(w))
  if (!hasCta) issues.push('Mist call-to-action')

  // USP check
  const uspWords = ['klassikaal', 'online', 'incompany', 'locatie', 'certificaat', 'praktijk', 'ervaren']
  const hasUsp = uspWords.some(w => desc.toLowerCase().includes(w))
  if (!hasUsp) issues.push('Mist USP (klassikaal, online, certificaat)')

  if (issues.length === 0) return { score: 'uitstekend', issues: [] }
  if (issues.length === 1) return { score: 'goed', issues }
  if (issues.length <= 2) return { score: 'matig', issues }
  return { score: 'slecht', issues }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const admin = getAdminClient()
  const { data: cursussen } = await admin
    .from('cursussen')
    .select('slug, titel, seo_title, seo_description, categorie:categorieen(naam)')
    .eq('actief', true)
    .order('titel')

  const results: SeoAuditItem[] = (cursussen || []).map((c) => {
    const cat = c.categorie as unknown as { naam: string } | null
    const titleAudit = scoreTitel(c.seo_title, c.titel)
    const descAudit = scoreDescription(c.seo_description, c.titel)

    return {
      slug: c.slug,
      titel: c.titel,
      categorie: cat?.naam || 'Overig',
      seo_title: c.seo_title,
      seo_description: c.seo_description,
      title_length: c.seo_title?.length || 0,
      desc_length: c.seo_description?.length || 0,
      title_score: titleAudit.score,
      desc_score: descAudit.score,
      title_issues: titleAudit.issues,
      desc_issues: descAudit.issues,
    }
  })

  return NextResponse.json({ results })
}
