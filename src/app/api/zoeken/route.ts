import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = createServiceRoleClient()
  const query = q.toLowerCase()

  // Fetch all active courses with their content
  const { data: cursussen } = await supabase
    .from('cursussen')
    .select('id, slug, titel, korte_beschrijving, beschrijving, inhoud, prijs_vanaf, niveau, categorie:categorieen(naam, slug)')
    .eq('actief', true)

  if (!cursussen) return NextResponse.json({ results: [] })

  interface SearchResult {
    slug: string
    titel: string
    categorie: string
    categorie_slug: string
    niveau: string
    prijs: number
    matchType: 'titel' | 'beschrijving' | 'inhoud'
    matchContext?: string
    score: number
  }

  const results: SearchResult[] = []

  for (const c of cursussen) {
    const cat = c.categorie as unknown as { naam: string; slug: string } | null
    const inhoud = c.inhoud as Record<string, unknown> | null

    let score = 0
    let matchType: 'titel' | 'beschrijving' | 'inhoud' = 'inhoud'
    let matchContext = ''

    // 1. Title match (highest priority)
    if (c.titel.toLowerCase().includes(query)) {
      score = 100
      matchType = 'titel'
    }

    // 2. Category match
    if (cat?.naam.toLowerCase().includes(query)) {
      score = Math.max(score, 80)
      matchType = score < 100 ? 'titel' : matchType
    }

    // 3. Short description match
    if (c.korte_beschrijving?.toLowerCase().includes(query)) {
      if (score < 60) {
        score = 60
        matchType = 'beschrijving'
        matchContext = extractContext(c.korte_beschrijving, query)
      }
    }

    // 4. Full description match
    if (c.beschrijving?.toLowerCase().includes(query)) {
      if (score < 50) {
        score = 50
        matchType = 'beschrijving'
        matchContext = extractContext(c.beschrijving, query)
      }
    }

    // 5. wat_leer_je items
    const watLeerJe = (inhoud?.wat_leer_je as string[]) || []
    for (const item of watLeerJe) {
      if (item.toLowerCase().includes(query)) {
        if (score < 40) {
          score = 40
          matchType = 'inhoud'
          matchContext = item
        }
        break
      }
    }

    // 6. programma items
    const programma = (inhoud?.programma as string[]) || []
    for (const item of programma) {
      if (item.toLowerCase().includes(query)) {
        if (score < 35) {
          score = 35
          matchType = 'inhoud'
          matchContext = item
        }
        break
      }
    }

    // 7. doelgroep / voorkennis
    const doelgroep = (inhoud?.doelgroep as string) || ''
    const voorkennis = (inhoud?.voorkennis as string) || ''
    if (doelgroep.toLowerCase().includes(query) || voorkennis.toLowerCase().includes(query)) {
      if (score < 20) {
        score = 20
        matchType = 'inhoud'
        matchContext = doelgroep.toLowerCase().includes(query)
          ? extractContext(doelgroep, query)
          : extractContext(voorkennis, query)
      }
    }

    if (score > 0) {
      results.push({
        slug: c.slug,
        titel: c.titel,
        categorie: cat?.naam || 'Overig',
        categorie_slug: cat?.slug || '',
        niveau: c.niveau,
        prijs: c.prijs_vanaf,
        matchType,
        matchContext: matchContext || undefined,
        score,
      })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return NextResponse.json({ results: results.slice(0, 8) })
}

function extractContext(text: string, query: string): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query)
  if (idx === -1) return ''

  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 60)
  let context = text.slice(start, end).trim()

  if (start > 0) context = '...' + context
  if (end < text.length) context = context + '...'

  return context
}
