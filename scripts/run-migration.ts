/**
 * Draai de telefoon_kliks migratie via Supabase Management API
 * npx tsx scripts/run-migration.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(import.meta.dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function run() {
  console.log('Migratie: telefoon_kliks tabel aanmaken...\n')

  // Test of de tabel al bestaat
  const { error: testErr } = await supabase.from('telefoon_kliks').select('id').limit(1)

  if (!testErr) {
    console.log('Tabel telefoon_kliks bestaat al! Migratie overgeslagen.')
    return
  }

  // Tabel bestaat niet - probeer aan te maken via SQL
  // Supabase JS client heeft geen directe SQL, dus we gebruiken de Management API
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '').replace('.supabase.co', '')

  const sql = fs.readFileSync(path.resolve(import.meta.dirname, '../supabase/migration_004_telefoon_kliks.sql'), 'utf8')

  // Probeer via de Supabase SQL endpoint (vereist service_role key)
  const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
  })

  if (resp.ok) {
    console.log('Supabase is bereikbaar.')
    console.log('')
    console.log('De tabel bestaat nog niet. Voer de volgende SQL uit in de Supabase SQL Editor:')
    console.log('https://supabase.com/dashboard/project/' + projectRef + '/sql/new')
    console.log('')
    console.log('─'.repeat(60))
    console.log(sql)
    console.log('─'.repeat(60))
  }
}

run()
