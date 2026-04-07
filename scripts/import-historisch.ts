/**
 * Eenmalig script: importeer historische prestatiedata uit Excel naar site_settings.
 *
 * Draai met: npx tsx scripts/import-historisch.ts
 *
 * Vereist NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

interface MaandHistorisch {
  telefoonKliks: number
  inschrijvingen: number
  offertes: number
  incompany: number
}

// Data uit Excel "Bron" sheets — ruwe aantallen
const historisch: Record<string, Record<string, MaandHistorisch>> = {
  // ── 2024 ──
  '2024': {
    '2024-01': { telefoonKliks: 17, inschrijvingen: 28, offertes: 6, incompany: 8 },
    '2024-02': { telefoonKliks: 32, inschrijvingen: 39, offertes: 4, incompany: 8 },
    '2024-03': { telefoonKliks: 26, inschrijvingen: 39, offertes: 8, incompany: 10 },
    '2024-04': { telefoonKliks: 24, inschrijvingen: 60, offertes: 5, incompany: 11 },
    '2024-05': { telefoonKliks: 37, inschrijvingen: 45, offertes: 5, incompany: 11 },
    '2024-06': { telefoonKliks: 23, inschrijvingen: 46, offertes: 12, incompany: 5 },
    '2024-07': { telefoonKliks: 33, inschrijvingen: 55, offertes: 9, incompany: 6 },
    '2024-08': { telefoonKliks: 23, inschrijvingen: 46, offertes: 7, incompany: 7 },
    '2024-09': { telefoonKliks: 31, inschrijvingen: 49, offertes: 4, incompany: 18 },
    '2024-10': { telefoonKliks: 29, inschrijvingen: 67, offertes: 9, incompany: 5 },
    '2024-11': { telefoonKliks: 29, inschrijvingen: 54, offertes: 9, incompany: 4 },
    '2024-12': { telefoonKliks: 21, inschrijvingen: 40, offertes: 3, incompany: 3 },
  },
  // ── 2025 ──
  '2025': {
    '2025-01': { telefoonKliks: 46, inschrijvingen: 49, offertes: 11, incompany: 9 },
    '2025-02': { telefoonKliks: 29, inschrijvingen: 35, offertes: 6, incompany: 7 },
    '2025-03': { telefoonKliks: 32, inschrijvingen: 42, offertes: 3, incompany: 6 },
    '2025-04': { telefoonKliks: 19, inschrijvingen: 38, offertes: 1, incompany: 0 },
    '2025-05': { telefoonKliks: 19, inschrijvingen: 24, offertes: 4, incompany: 5 },
    '2025-06': { telefoonKliks: 18, inschrijvingen: 25, offertes: 6, incompany: 4 },
    '2025-07': { telefoonKliks: 21, inschrijvingen: 31, offertes: 8, incompany: 2 },
    '2025-08': { telefoonKliks: 18, inschrijvingen: 28, offertes: 3, incompany: 2 },
    '2025-09': { telefoonKliks: 24, inschrijvingen: 39, offertes: 7, incompany: 5 },
    '2025-10': { telefoonKliks: 26, inschrijvingen: 50, offertes: 12, incompany: 6 },
    '2025-11': { telefoonKliks: 22, inschrijvingen: 27, offertes: 7, incompany: 10 },
    '2025-12': { telefoonKliks: 23, inschrijvingen: 21, offertes: 4, incompany: 2 },
  },
  // ── 2026 (t/m februari) ──
  '2026': {
    '2026-01': { telefoonKliks: 39, inschrijvingen: 30, offertes: 0, incompany: 2 },
    '2026-02': { telefoonKliks: 21, inschrijvingen: 35, offertes: 3, incompany: 6 },
  },
}

// Google Ads spend per maand
const adsSpend: Record<string, Record<string, number>> = {
  '2024': {
    '2024-01': 373.00,
    '2024-02': 1649.86,
    '2024-03': 1700.24,
    '2024-04': 1851.48,
    '2024-05': 1885.57,
    '2024-06': 1720.31,
    '2024-07': 1894.18,
    '2024-08': 1769.00,
    '2024-09': 1855.00,
    '2024-10': 1943.50,
    '2024-11': 2908.00,
    '2024-12': 2054.00,
  },
  '2025': {
    '2025-01': 2060.46,
    '2025-02': 2027.00,
    '2025-03': 2046.54,
    '2025-04': 2762.10,
    '2025-05': 2469.45,
    '2025-06': 2083.25,
    '2025-07': 2134.00,
    '2025-08': 1945.65,
    '2025-09': 2114.00,
    '2025-10': 2630.00,
    '2025-11': 2371.00,
    '2025-12': 2662.00,
  },
  '2026': {
    '2026-01': 2936.00,
    '2026-02': 3659.00,
  },
}

async function main() {
  console.log('Importeren historische prestatiedata...\n')

  for (const [year, data] of Object.entries(historisch)) {
    // Historische leads
    const { error: err1 } = await supabase
      .from('site_settings')
      .upsert({ id: `historisch_${year}`, value: data })

    if (err1) {
      console.error(`Fout bij historisch_${year}:`, err1.message)
    } else {
      const maanden = Object.keys(data).length
      const totaal = Object.values(data).reduce((s, m) => s + m.telefoonKliks + m.inschrijvingen + m.offertes + m.incompany, 0)
      console.log(`✓ historisch_${year}: ${maanden} maanden, ${totaal} totaal leads`)
    }

    // Ads spend
    if (adsSpend[year]) {
      const { error: err2 } = await supabase
        .from('site_settings')
        .upsert({ id: `ads_spend_${year}`, value: adsSpend[year] })

      if (err2) {
        console.error(`Fout bij ads_spend_${year}:`, err2.message)
      } else {
        const totaalAds = Object.values(adsSpend[year]).reduce((s, v) => s + v, 0)
        console.log(`✓ ads_spend_${year}: €${totaalAds.toFixed(2)} totaal`)
      }
    }
  }

  console.log('\nKlaar!')
}

main()
