#!/usr/bin/env npx tsx
/**
 * Scrapes all course data from computertraining.nl WordPress site
 * and updates the Supabase database.
 *
 * Usage: npx tsx scripts/scrape-wp-courses.ts
 *        npx tsx scripts/scrape-wp-courses.ts --dry-run   (preview without writing)
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

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
  const parts = path.replace(/\/$/, '').split('/')
  return parts[parts.length - 1]
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&euro;/g, '€')
    .replace(/&middot;/g, '·')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/&euml;/g, 'ë')
    .replace(/&iuml;/g, 'ï')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&#\d+;/g, '')
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Extract text between a heading and the next heading/section
function extractSectionAfterHeading(html: string, headerRegex: string): string {
  const pattern = new RegExp(
    `<h[2-4][^>]*>[\\s\\S]*?${headerRegex}[\\s\\S]*?</h[2-4]>([\\s\\S]*?)(?=<h[2-4][^>]*>|<section\\s|$)`,
    'i'
  )
  const match = html.match(pattern)
  if (!match) return ''
  return stripHtml(match[1])
}

// Extract <li> items from a section after a heading
function extractListAfterHeading(html: string, headerRegex: string): string[] {
  const pattern = new RegExp(
    `<h[2-4][^>]*>[\\s\\S]*?${headerRegex}[\\s\\S]*?</h[2-4]>([\\s\\S]*?)(?=<h[2-4][^>]*>|<section\\s|$)`,
    'i'
  )
  const match = html.match(pattern)
  if (!match) return []

  const section = match[1]
  const items: string[] = []

  // Extract <li> items
  const liMatches = [...section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
  for (const m of liMatches) {
    let text = stripHtml(m[1]).trim()
    // If item has a colon with newline explanation, take just the title
    const colonNewline = text.indexOf(':\n')
    if (colonNewline > 0 && colonNewline < 60) {
      text = text.substring(0, colonNewline)
    }
    // If item has ": Description" on same line, keep the full thing but trim
    // Clean up - take first line if multi-line
    const firstLine = text.split('\n')[0].trim()
      .replace(/:$/, '') // remove trailing colon
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
    if (firstLine && firstLine.length > 3) {
      items.push(firstLine)
    }
  }

  // If no <li> items, try to find text blocks separated by newlines
  if (items.length === 0) {
    const text = stripHtml(section)
    const lines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 10 && !l.startsWith('Ben je') && !l.startsWith('Wil je'))
    for (const line of lines) {
      const cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim()
      if (cleaned.length > 5) items.push(cleaned)
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

  // Extract from JSON-LD schema markup - look for hasVariant pattern
  const schemaBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]

  for (const block of schemaBlocks) {
    const jsonStr = block[1].trim()
    try {
      const data = JSON.parse(jsonStr)
      const graph = data['@graph'] || [data]

      for (const item of graph) {
        // Check hasVariant (WooCommerce grouped product structure)
        const variants = item.hasVariant || []
        for (const variant of variants) {
          const offers = variant.offers
          if (!offers) continue
          const price = parseFloat(offers.price)
          const url = decodeEntities(offers.url || '').toLowerCase()
          if (isNaN(price) || price <= 0) continue

          if (url.includes('lesmethode=thuisstudie') || url.includes('locatie=thuisstudie')) {
            prices.thuisstudie = price
          } else if (url.includes('lesmethode=incompany') || url.includes('locatie=incompany')) {
            prices.incompany = price
          } else if (url.includes('lesmethode=live-online') || url.includes('locatie=virtueel')) {
            if (!prices.online) prices.online = price
          } else if (url.includes('lesmethode=klassikaal')) {
            if (!prices.klassikaal || price > prices.klassikaal) prices.klassikaal = price
          } else {
            // Default: if it has a physical location, it's klassikaal
            if (!url.includes('thuisstudie') && !url.includes('incompany') && !url.includes('virtueel')) {
              if (!prices.klassikaal || price > prices.klassikaal) prices.klassikaal = price
            }
          }
        }
      }
    } catch { /* skip */ }
  }

  return prices
}

function extractLesmethodes(html: string): string[] {
  const match = html.match(/Lesmethodes:\s*<\/h[2-4]>\s*<[^>]+[^/]*?>(.*?)<\//is)
  if (match) {
    return match[1].split(',').map(s => decodeEntities(s).trim()).filter(Boolean)
  }
  return []
}

function extractDuur(html: string): string {
  // From visible text near the top of the page
  const duurMatch = html.match(/(\d+)\s*(?:dag|dagen)/i)
  if (duurMatch) {
    const n = parseInt(duurMatch[1])
    return n === 1 ? '1 dag' : `${n} dagen`
  }
  if (html.match(/halve\s*dag/i)) return 'Halve dag'
  return ''
}

function extractNiveau(titel: string, lesmethodes: string[]): string {
  const t = titel.toLowerCase()
  if (t.includes('gevorderd') || t.includes('advanced') || t.includes('vba') || t.includes('financials')) return 'gevorderd'
  if (t.includes('expert') || t.includes('specialist') || t.includes('maatwerk')) return 'expert'
  if (t.includes('analyse') || t.includes('functies en formules') || t.includes('koppelingen') || t.includes('power bi') || t.includes('complexe')) return 'gevorderd'
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

  // Title from H1
  const titleMatch = contentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  let titel = titleMatch ? stripHtml(titleMatch[1]).trim() : ''

  // Fallback: try og:title
  if (!titel) {
    const ogMatch = html.match(/<meta property="og:title" content="([^"]+)"/i)
    titel = ogMatch ? decodeEntities(ogMatch[1]).replace(/ - Compu Act.*$/, '').trim() : ''
  }

  if (!titel) {
    console.error(`  ❌ No title found for ${path}`)
    return null
  }

  // Clean up long SEO titles - keep just the main part
  if (titel.includes('–')) {
    titel = titel.split('–')[0].trim()
  }
  // Remove "cursus voor beginners" etc from title
  titel = titel.replace(/\s+cursus voor beginners$/i, '')

  // Extract intro/description from "Wat leer je?" H2 section
  const beschrijving = extractSectionAfterHeading(contentHtml, 'Wat leer je')

  // Extract "Wat leer ik" items (the detailed bullet list)
  const watLeerJe = extractListAfterHeading(contentHtml, 'Wat leer ik')

  // Extract Doelgroep
  const doelgroep = extractSectionAfterHeading(contentHtml, 'Doelgroep')

  // Extract Voorkennis
  const voorkennis = extractSectionAfterHeading(contentHtml, 'Voorkennis')

  // Prices from JSON-LD
  const prices = extractPrices(html)

  // Lesmethodes
  const lesmethodes = extractLesmethodes(contentHtml)

  // Duur
  const duur = extractDuur(html)

  // Niveau
  const niveau = extractNiveau(titel, lesmethodes)

  // prijs_vanaf = lowest price
  const allPrices = [prices.thuisstudie, prices.klassikaal, prices.online, prices.incompany]
    .filter((p): p is number => !!p && p > 0)
  const prijs_vanaf = allPrices.length > 0 ? Math.min(...allPrices) : 0

  // Short description from first 2 sentences
  let korte_beschrijving = ''
  if (beschrijving) {
    const sentences = beschrijving.split(/(?<=[.!?])\s+/)
    korte_beschrijving = sentences.slice(0, 2).join(' ')
    if (korte_beschrijving.length > 200) {
      korte_beschrijving = korte_beschrijving.substring(0, 197) + '...'
    }
  }

  // Build programma from wat_leer_je items (WP doesn't have separate programma section)
  const programma = watLeerJe.length > 0
    ? watLeerJe.map((item, i) => `${i + 1}. ${item}`)
    : []

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
    .replace(/\bu\b(?!\.\w)/g, 'je')
    .replace(/\bUw\b/g, 'Jouw')
    .replace(/\buw\b/g, 'jouw')
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
      console.log(`     Wat leer je: ${course.inhoud.wat_leer_je.length} items | Doelgroep: ${course.inhoud.doelgroep.length > 0 ? '✓' : '✗'} | Voorkennis: ${course.inhoud.voorkennis.length > 0 ? '✓' : '✗'}`)
      console.log(`     Beschrijving: ${course.beschrijving.substring(0, 80)}...`)
      console.log()

      if (dryRun) {
        updated++
        continue
      }

      // Update course in Supabase
      const updateData: Record<string, unknown> = {
        beschrijving: course.beschrijving,
        korte_beschrijving: course.korte_beschrijving,
        inhoud: course.inhoud,
      }

      // Only update prijs_vanaf if we found prices
      if (course.prijs_vanaf > 0) updateData.prijs_vanaf = course.prijs_vanaf
      if (course.duur) updateData.duur = course.duur
      if (course.niveau) updateData.niveau = course.niveau
      if (categorie_id) updateData.categorie_id = categorie_id

      const { error: updateError } = await supabase
        .from('cursussen')
        .update(updateData)
        .eq('slug', course.slug)

      if (updateError) {
        console.error(`  ❌ DB error for ${course.slug}: ${updateError.message}`)
        errors++
        continue
      }

      // Create thuisstudie session if applicable
      if (course.prices.thuisstudie && course.lesmethodes.some(m => m.toLowerCase().includes('thuisstudie'))) {
        const { data: cursusRow } = await supabase
          .from('cursussen')
          .select('id')
          .eq('slug', course.slug)
          .single()

        if (cursusRow) {
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
              console.log(`     ⚠️ Thuisstudie sessie: ${sessieError.message}`)
            } else {
              console.log(`     📚 Thuisstudie sessie aangemaakt (€${course.prices.thuisstudie})`)
            }
          } else {
            // Update existing thuisstudie price
            await supabase
              .from('cursus_sessies')
              .update({ prijs: course.prices.thuisstudie })
              .eq('cursus_id', cursusRow.id)
              .eq('lesmethode', 'thuisstudie')
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
