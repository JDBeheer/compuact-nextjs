import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function parseCsvDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null
  // Format: "dinsdag, januari 06, 2026"
  const months: Record<string, string> = {
    januari: '01', februari: '02', maart: '03', april: '04',
    mei: '05', juni: '06', juli: '07', augustus: '08',
    september: '09', oktober: '10', november: '11', december: '12',
  }
  const match = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/)
  if (!match) return null
  const [, monthName, day, year] = match
  const month = months[monthName.toLowerCase()]
  if (!month) return null
  return `${year}-${month}-${day.padStart(2, '0')}`
}

function mapNiveau(level: string): string {
  const map: Record<string, string> = {
    Beginner: 'beginner',
    Gevorderd: 'gevorderd',
    Expert: 'expert',
  }
  return map[level] || 'beginner'
}

function mapDuur(dagen: string): string {
  if (dagen === '0,5') return 'Halve dag'
  if (dagen === '1') return '1 dag'
  return `${dagen} dagen`
}

function mapCategorie(csvCat: string): string {
  if (csvCat === 'AI cursussen') return 'ai'
  return 'microsoft-office' // we'll match by slug
}

function getCategorieSlug(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('excel')) return 'excel'
  if (t.includes('word')) return 'word'
  if (t.includes('outlook')) return 'outlook'
  if (t.includes('powerpoint')) return 'powerpoint'
  if (t.includes('power bi')) return 'power-bi'
  if (t.includes('project')) return 'project'
  if (t.includes('visio')) return 'visio'
  if (t.includes('teams') || t.includes('office 365')) return 'office-365'
  if (t.includes('ai') || t.includes('prompting')) return 'ai'
  return 'excel' // fallback
}

async function main() {
  console.log('Starting import...')

  // Read CSV
  const csvPath = resolve(__dirname, '../data/sessies.csv')
  const csvContent = readFileSync(csvPath, 'utf-8')
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  console.log(`Parsed ${records.length} CSV rows`)

  // Fetch existing categories
  const { data: categorieenData } = await supabase.from('categorieen').select('*')
  const categorieen = new Map(categorieenData?.map(c => [c.slug, c.id]) || [])
  console.log(`Found ${categorieen.size} categories`)

  // Fetch existing locations
  const { data: locatiesData } = await supabase.from('locaties').select('*')
  const locaties = new Map(locatiesData?.map(l => [l.stad, l.id]) || [])
  console.log(`Found ${locaties.size} locations`)

  // Extract unique courses
  const courseMap = new Map<string, {
    title: string
    cursusId: string
    category: string
    level: string
    dagen: string
    tijden: string
    minPrice: number
  }>()

  for (const row of records) {
    const title = row.Training_Title
    const price = parseInt(row['Prijs zonder celeigenschap'] || '0')
    if (!courseMap.has(title)) {
      courseMap.set(title, {
        title,
        cursusId: row.CursusID,
        category: row['Product Categorie'],
        level: row.Moeilijkheid,
        dagen: row['Aantal dagen'],
        tijden: row.Tijden,
        minPrice: price,
      })
    } else {
      const existing = courseMap.get(title)!
      if (price < existing.minPrice) {
        existing.minPrice = price
      }
    }
  }
  console.log(`Found ${courseMap.size} unique courses`)

  // Upsert courses
  const cursusIdMap = new Map<string, string>() // CSV CursusID -> DB UUID

  for (const [title, info] of courseMap) {
    const slug = slugify(title)
    const catSlug = getCategorieSlug(title)
    const categorieId = categorieen.get(catSlug)

    if (!categorieId) {
      console.warn(`Category not found for slug: ${catSlug} (course: ${title})`)
      continue
    }

    const { data: existing } = await supabase
      .from('cursussen')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      // Update existing
      await supabase
        .from('cursussen')
        .update({
          titel: title,
          categorie_id: categorieId,
          prijs_vanaf: info.minPrice,
          niveau: mapNiveau(info.level),
          duur: mapDuur(info.dagen),
          actief: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      cursusIdMap.set(info.cursusId, existing.id)
      console.log(`  Updated course: ${title} (${slug})`)
    } else {
      // Insert new
      const { data: inserted, error } = await supabase
        .from('cursussen')
        .insert({
          slug,
          titel: title,
          beschrijving: '',
          korte_beschrijving: '',
          categorie_id: categorieId,
          prijs_vanaf: info.minPrice,
          niveau: mapNiveau(info.level),
          duur: mapDuur(info.dagen),
          actief: true,
        })
        .select('id')
        .single()

      if (error) {
        console.error(`  Error inserting course ${title}:`, error.message)
        continue
      }
      cursusIdMap.set(info.cursusId, inserted.id)
      console.log(`  Inserted course: ${title} (${slug})`)
    }
  }

  // Process sessions in batches
  console.log('\nImporting sessions...')
  const BATCH_SIZE = 100
  let sessionCount = 0
  let skipCount = 0
  const sessionsToInsert: any[] = []

  for (const row of records) {
    const trainingId = row.Training_ID
    const cursusId = cursusIdMap.get(row.CursusID)
    const locationName = row.Training_Note
    const locatieId = locaties.get(locationName)

    if (!cursusId) {
      console.warn(`  Course not found for CursusID: ${row.CursusID}`)
      skipCount++
      continue
    }
    if (!locatieId) {
      console.warn(`  Location not found: ${locationName}`)
      skipCount++
      continue
    }

    // Parse all lesson dates
    const lesdagen: string[] = []
    for (let i = 1; i <= 6; i++) {
      const dateStr = row[`Lesdag ${i}`]
      const parsed = parseCsvDate(dateStr)
      if (parsed) lesdagen.push(parsed)
    }

    if (lesdagen.length === 0) {
      skipCount++
      continue
    }

    const lesmethode = row.description === 'Virtueel' ? 'online' : 'klassikaal'
    const prijs = parseInt(row['Prijs zonder celeigenschap'] || '0')

    sessionsToInsert.push({
      training_id: trainingId,
      cursus_id: cursusId,
      locatie_id: locatieId,
      datum: lesdagen[0],
      tijden: row.Tijden || '10:00 - 16:00',
      prijs,
      lesmethode,
      capaciteit: parseInt(row['Maximale Bezetting'] || '10'),
      lesdagen: JSON.stringify(lesdagen),
      actief: true,
    })
  }

  // Insert in batches using upsert on training_id
  for (let i = 0; i < sessionsToInsert.length; i += BATCH_SIZE) {
    const batch = sessionsToInsert.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('cursus_sessies')
      .upsert(batch, { onConflict: 'training_id' })

    if (error) {
      console.error(`  Batch error at ${i}:`, error.message)
    } else {
      sessionCount += batch.length
      process.stdout.write(`\r  Imported ${sessionCount}/${sessionsToInsert.length} sessions`)
    }
  }

  console.log(`\n\nImport complete!`)
  console.log(`  Courses: ${courseMap.size}`)
  console.log(`  Sessions: ${sessionCount}`)
  console.log(`  Skipped: ${skipCount}`)

  // Seed course content
  console.log('\nSeeding course content...')
  try {
    const contentPath = resolve(__dirname, '../data/course-content.json')
    const content = JSON.parse(readFileSync(contentPath, 'utf-8'))
    let contentCount = 0

    for (const [slug, data] of Object.entries(content) as [string, any][]) {
      const { error } = await supabase
        .from('cursussen')
        .update({
          beschrijving: data.beschrijving || '',
          korte_beschrijving: data.korte_beschrijving || '',
          inhoud: data.inhoud || {},
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)

      if (error) {
        console.error(`  Error updating content for ${slug}:`, error.message)
      } else {
        contentCount++
      }
    }
    console.log(`  Updated content for ${contentCount} courses`)
  } catch (err) {
    console.error('  Error seeding content:', err)
  }
}

main().catch(console.error)
