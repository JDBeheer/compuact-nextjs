#!/usr/bin/env npx tsx
/**
 * Scrapes all course data from computertraining.nl WordPress site
 * and updates the Supabase database.
 *
 * Usage: npx tsx scripts/scrape-wp-courses.ts
 *        npx tsx scripts/scrape-wp-courses.ts --dry-run   (preview without writing)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const BASE = 'https://www.computertraining.nl/microsoft-office/'

const COURSE_URLS = [
  'excel/excel-basis/',
  'excel/excel-gevorderd/',
  'excel/excel-met-vba/',
  'excel/excel-power-bi/',
  'excel/excel-voor-financials/',
  'excel/excel-analyse-en-rapportage/',
  'excel/excel-draaitabellen-en-grafieken/',
  'excel/excel-functies-en-formules/',
  'excel/excel-koppelingen-en-macros/',
  'excel/word-en-excel/',
  'word/word-basis/',
  'word/word-gevorderd/',
  'word/word-complexe-documenten/',
  'word/word-formulieren-en-sjablonen/',
  'word/word-mailingen-verzorgen/',
  'powerpoint-alles-in-een/',
  'outlook/outlook-alles-in-een/',
  'outlook/outlook-en-time-management/',
  'office-365/microsoft-teams/',
  'office-365/office-365-voor-eindgebruikers/',
  'project/project-basis/',
  'project/project-maatwerk/',
  'power-bi/power-bi-desktop/',
  'visio-basis/',
]

// Map WP category paths to our Supabase category slugs
function wpPathToCategory(path: string): string {
  if (path.startsWith('excel/') || path === 'excel') return 'excel'
  if (path.startsWith('word/')) return 'word'
  if (path.startsWith('powerpoint')) return 'powerpoint'
  if (path.startsWith('outlook/')) return 'outlook'
  if (path.startsWith('office-365/')) return 'office-365'
  if (path.startsWith('project/')) return 'project'
  if (path.startsWith('power-bi/')) return 'power-bi'
  if (path.startsWith('visio')) return 'visio'
  return 'overig'
}

function wpSlugToOurSlug(path: string): string {
  // Remove category prefix: excel/excel-basis/ -> excel-basis
  const parts = path.replace(/\/$/, '').split('/')
  return parts[parts.length - 1]
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&euro;/g, '€')
    .replace(/&middot;/g, '·')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractSection(html: string, headerText: string): string {
  // Find section by header text, extract content until next header
  const headerPattern = new RegExp(
    `<h[2-4][^>]*>[^<]*${headerText}[^<]*</h[2-4]>\\s*(.*?)(?=<h[2-4]|<section|$)`,
    'is'
  )
  const match = html.match(headerPattern)
  if (!match) return ''
  return stripHtml(match[1])
}

function extractListItems(html: string, headerText: string): string[] {
  const headerPattern = new RegExp(
    `<h[2-4][^>]*>[^<]*${headerText}[^<]*</h[2-4]>\\s*(.*?)(?=<h[2-4]|<section|$)`,
    'is'
  )
  const match = html.match(headerPattern)
  if (!match) return []

  const section = match[1]
  const items: string[] = []

  // Try <li> items first
  const liMatches = section.matchAll(/<li[^>]*>(.*?)<\/li>/gis)
  for (const m of liMatches) {
    const text = stripHtml(m[1]).trim()
    if (text) items.push(text)
  }

  // If no list items, try paragraphs or numbered items
  if (items.length === 0) {
    const text = stripHtml(section)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10)
    // Look for numbered items like "1. ", "2. " etc
    for (const line of lines) {
      const cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim()
      if (cleaned) items.push(cleaned)
    }
  }

  return items
}

interface PriceInfo {
  thuisstudie?: number
  klassikaal?: number
  online?: number
  incompany?: number
}

function extractPrices(html: string): PriceInfo {
  const prices: PriceInfo = {}

  // Extract from JSON-LD schema markup (most reliable)
  const schemaMatch = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)
  if (schemaMatch) {
    for (const block of schemaMatch) {
      const jsonStr = block.replace(/<\/?script[^>]*>/gi, '').trim()
      try {
        const data = JSON.parse(jsonStr)
        const graph = data['@graph'] || [data]
        for (const item of graph) {
          if (item['@type'] === 'Product' && item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers : [item.offers]
            for (const offer of offers) {
              const url = (offer.url || '').toLowerCase()
              const price = parseFloat(offer.price)
              if (isNaN(price) || price <= 0) continue

              if (url.includes('lesmethode=thuisstudie')) {
                prices.thuisstudie = price
              } else if (url.includes('lesmethode=incompany')) {
                prices.incompany = price
              } else if (url.includes('lesmethode=klassikaal') || url.includes('locatie=') && !url.includes('thuisstudie') && !url.includes('virtueel')) {
                if (!prices.klassikaal || price > prices.klassikaal) {
                  prices.klassikaal = price
                }
              } else if (url.includes('lesmethode=live-online') || url.includes('locatie=virtueel')) {
                prices.online = price
              }
            }
          }

          // Also check grouped products
          if (item['@type'] === 'GroupedProduct' || (item.hasOfferCatalog?.itemListElement)) {
            const elements = item.hasOfferCatalog?.itemListElement || []
            for (const el of elements) {
              if (el.offers) {
                const offers = Array.isArray(el.offers) ? el.offers : [el.offers]
                for (const offer of offers) {
                  const url = (offer.url || '').toLowerCase()
                  const price = parseFloat(offer.price)
                  if (isNaN(price) || price <= 0) continue
                  if (url.includes('thuisstudie')) prices.thuisstudie = price
                  else if (url.includes('incompany')) prices.incompany = price
                  else if (url.includes('live-online') || url.includes('virtueel')) prices.online = price
                  else if (url.includes('klassikaal') || (!url.includes('thuisstudie') && !url.includes('incompany'))) {
                    if (!prices.klassikaal || price > prices.klassikaal) prices.klassikaal = price
                  }
                }
              }
            }
          }
        }
      } catch { /* skip non-JSON blocks */ }
    }
  }

  return prices
}

function extractLesmethodes(html: string): string[] {
  const match = html.match(/Lesmethodes:\s*<\/h[2-4]>\s*<[^>]+>(.*?)<\//is)
  if (match) {
    return match[1].split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

function extractDuur(html: string): string {
  // From schema.org
  const match = html.match(/"duration"\s*:\s*"([^"]+)"/i)
  if (match) return match[1]

  // From visible text
  const duurMatch = html.match(/(\d+)\s*(?:dag|dagen)/i)
  if (duurMatch) {
    const n = parseInt(duurMatch[1])
    return n === 1 ? '1 dag' : `${n} dagen`
  }

  // Check for half day
  if (html.match(/halve\s*dag/i)) return 'Halve dag'

  return ''
}

function extractNiveau(html: string): string {
  const text = html.toLowerCase()
  if (text.includes('gevorderd') || text.includes('advanced')) return 'gevorderd'
  if (text.includes('expert') || text.includes('specialist')) return 'expert'
  return 'beginner'
}

interface CourseData {
  slug: string
  titel: string
  categorie_slug: string
  beschrijving: string
  korte_beschrijving: string
  duur: string
  niveau: string
  prijs_vanaf: number
  lesmethodes: string[]
  prices: PriceInfo
  inhoud: {
    wat_leer_je: string[]
    programma: string[]
    doelgroep: string
    voorkennis: string
    lesmateriaal: string
    certificaat: string
    incompany_tekst: string
  }
}

async function scrapeCourse(path: string): Promise<CourseData | null> {
  const url = BASE + path
  console.log(`  Fetching ${url}...`)

  const res = await fetch(url)
  if (!res.ok) {
    console.error(`  ❌ HTTP ${res.status} for ${url}`)
    return null
  }

  const html = await res.text()

  // Get the second breakdance div content area
  const parts = html.split('<div class="breakdance"')
  const contentHtml = parts.length >= 3 ? parts.slice(2).join('') : html

  // Title
  const titleMatch = contentHtml.match(/<h1[^>]*>(.*?)<\/h1>/is)
  const titel = titleMatch ? stripHtml(titleMatch[1]).trim() : ''

  if (!titel) {
    console.error(`  ❌ No title found for ${path}`)
    return null
  }

  // Description - extract the main intro text
  const beschrijving = extractSection(contentHtml, 'Wat leer je')
    || extractSection(contentHtml, 'Cursus')
    || extractSection(contentHtml, titel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  // Wat leer je items
  const watLeerJe = extractListItems(contentHtml, 'Wat leer (?:je|ik)')

  // Programma
  const programma = extractListItems(contentHtml, 'Programma')

  // Doelgroep
  const doelgroep = extractSection(contentHtml, 'Doelgroep')

  // Voorkennis
  const voorkennis = extractSection(contentHtml, 'Voorkennis')

  // Prices
  const prices = extractPrices(html)

  // Lesmethodes
  const lesmethodes = extractLesmethodes(contentHtml)

  // Duur
  const duur = extractDuur(html)

  // Niveau - derive from title and content
  const niveau = extractNiveau(titel + ' ' + beschrijving)

  // prijs_vanaf = lowest price
  const allPrices = [prices.thuisstudie, prices.klassikaal, prices.online, prices.incompany].filter((p): p is number => !!p && p > 0)
  const prijs_vanaf = allPrices.length > 0 ? Math.min(...allPrices) : 0

  // Short description: first 1-2 sentences of beschrijving
  let korte_beschrijving = ''
  if (beschrijving) {
    const sentences = beschrijving.split(/(?<=[.!?])\s+/)
    korte_beschrijving = sentences.slice(0, 2).join(' ').substring(0, 200)
  }

  return {
    slug: wpSlugToOurSlug(path),
    titel,
    categorie_slug: wpPathToCategory(path),
    beschrijving,
    korte_beschrijving,
    duur,
    niveau,
    prijs_vanaf,
    lesmethodes,
    prices,
    inhoud: {
      wat_leer_je: watLeerJe,
      programma,
      doelgroep,
      voorkennis,
      lesmateriaal: 'All-in cursusprijs, inclusief laptop, lesmateriaal en certificaat (na afronding).',
      certificaat: 'Na succesvolle afronding ontvang je een officieel certificaat van Compu Act Opleidingen.',
      incompany_tekst: `De cursus ${titel} bieden wij ook aan als incompany training. We stemmen de inhoud af op jouw organisatie en werken bij voorkeur met jullie eigen materiaal. De training kan op locatie of online worden verzorgd.`,
    },
  }
}

// Convert u/uw to je/jouw
function toInformeel(text: string): string {
  return text
    .replace(/\bU\b/g, 'Je')
    .replace(/\bu\b/g, 'je')
    .replace(/\bUw\b/g, 'Jouw')
    .replace(/\buw\b/g, 'jouw')
    .replace(/\bzich\b/g, 'je')
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  if (dryRun) {
    console.log('🏃 DRY RUN — no database changes will be made\n')
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Fetch categories for ID mapping
  const { data: categories } = await supabase.from('categorieen').select('id, slug')
  const catMap = new Map(categories?.map(c => [c.slug, c.id]) || [])

  console.log(`📂 Categories: ${[...catMap.keys()].join(', ')}\n`)
  console.log(`🔍 Scraping ${COURSE_URLS.length} courses...\n`)

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const path of COURSE_URLS) {
    try {
      const course = await scrapeCourse(path)
      if (!course) {
        errors++
        continue
      }

      // Apply informeel tone
      course.beschrijving = toInformeel(course.beschrijving)
      course.korte_beschrijving = toInformeel(course.korte_beschrijving)
      course.inhoud.doelgroep = toInformeel(course.inhoud.doelgroep)
      course.inhoud.voorkennis = toInformeel(course.inhoud.voorkennis)

      const categorie_id = catMap.get(course.categorie_slug)

      console.log(`  ✅ ${course.titel}`)
      console.log(`     Slug: ${course.slug} | Cat: ${course.categorie_slug} | Duur: ${course.duur} | Niveau: ${course.niveau}`)
      console.log(`     Prijs vanaf: €${course.prijs_vanaf} | Thuisstudie: €${course.prices.thuisstudie || '-'} | Klassikaal: €${course.prices.klassikaal || '-'} | Online: €${course.prices.online || '-'} | InCompany: €${course.prices.incompany || '-'}`)
      console.log(`     Lesmethodes: ${course.lesmethodes.join(', ')}`)
      console.log(`     Wat leer je: ${course.inhoud.wat_leer_je.length} items | Programma: ${course.inhoud.programma.length} items`)
      console.log(`     Beschrijving: ${course.beschrijving.substring(0, 80)}...`)
      console.log()

      if (dryRun) {
        updated++
        continue
      }

      // Upsert course in Supabase
      const { error: upsertError } = await supabase
        .from('cursussen')
        .update({
          beschrijving: course.beschrijving,
          korte_beschrijving: course.korte_beschrijving,
          prijs_vanaf: course.prijs_vanaf,
          duur: course.duur || undefined,
          niveau: course.niveau || undefined,
          inhoud: course.inhoud,
          ...(categorie_id ? { categorie_id } : {}),
        })
        .eq('slug', course.slug)

      if (upsertError) {
        console.error(`  ❌ DB error for ${course.slug}: ${upsertError.message}`)
        errors++
        continue
      }

      // Create thuisstudie session if applicable
      if (course.prices.thuisstudie && course.lesmethodes.some(m => m.toLowerCase().includes('thuisstudie'))) {
        // Get course ID
        const { data: cursusRow } = await supabase
          .from('cursussen')
          .select('id')
          .eq('slug', course.slug)
          .single()

        if (cursusRow) {
          // Check if thuisstudie session already exists
          const { data: existing } = await supabase
            .from('cursus_sessies')
            .select('id')
            .eq('cursus_id', cursusRow.id)
            .eq('lesmethode', 'thuisstudie')

          if (!existing || existing.length === 0) {
            const { error: sessieError } = await supabase
              .from('cursus_sessies')
              .insert({
                cursus_id: cursusRow.id,
                lesmethode: 'thuisstudie',
                prijs: course.prices.thuisstudie,
                datum: '2099-12-31',
                actief: true,
              })

            if (sessieError) {
              console.log(`     ⚠️ Thuisstudie sessie error: ${sessieError.message}`)
            } else {
              console.log(`     📚 Thuisstudie sessie aangemaakt (€${course.prices.thuisstudie})`)
            }
          }
        }
      }

      updated++
    } catch (err) {
      console.error(`  ❌ Error scraping ${path}:`, err)
      errors++
    }

    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Updated: ${updated} | ⏭️ Skipped: ${skipped} | ❌ Errors: ${errors}`)
  if (dryRun) console.log('(dry run — no changes written)')
}

main().catch(console.error)
