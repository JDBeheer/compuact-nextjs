'use client'

import { Fragment, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Phone, Inbox, FileText, Building2, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

// ── Config (uit Excel) ──
const BASELINE = 21
const MAX_VERGOEDING_PER_LEAD = 75
const GEM_OPBRENGST_PER_LEAD = 600
const MAX_MARKETING_PERCENTAGE = 0.125 // 12.5% van opbrengst
const ARBEID_PER_MAAND = 1700

// Correctiefactoren
const CALL_CORRECTIE = 0.75
const INCOMPANY_CORRECTIE = 1.25

interface MaandData {
  maand: string // YYYY-MM
  label: string
  // Ruwe aantallen
  telefoonKliks: number
  inschrijvingen: number
  offertes: number
  incompany: number
  // Gewogen
  telefoonKliksGewogen: number
  incompanyGewogen: number
  totaalLeads: number
  // Berekening
  extraLeads: number
  maxVergoeding: number
  googleAdsSpend: number
  totaalVast: number
  vergoedingPerLead: number
  totaalVariabel: number
  marketingkostenCompuact: number
  omzetJachtDigital: number
}

export default function PrestatiesPage() {
  const [maanden, setMaanden] = useState<MaandData[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [adsSpend, setAdsSpend] = useState<Record<string, number>>({})
  const [editingAds, setEditingAds] = useState<string | null>(null)
  const [adsInput, setAdsInput] = useState('')

  useEffect(() => {
    loadData()
    loadAdsSpend()
  }, [selectedYear])

  async function loadAdsSpend() {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('id, value')
      .eq('id', `ads_spend_${selectedYear}`)
      .single()

    if (data?.value) {
      setAdsSpend(data.value as Record<string, number>)
    }
  }

  async function saveAdsSpend(maand: string, bedrag: number) {
    const updated = { ...adsSpend, [maand]: bedrag }
    setAdsSpend(updated)

    const supabase = createClient()
    await supabase
      .from('site_settings')
      .upsert({
        id: `ads_spend_${selectedYear}`,
        value: updated,
      })
  }

  async function loadData() {
    setLoading(true)
    const supabase = createClient()

    const startDate = `${selectedYear}-01-01`
    const endDate = `${selectedYear + 1}-01-01`

    const [inzendingen, kliks] = await Promise.all([
      supabase
        .from('inschrijvingen')
        .select('type, created_at')
        .gte('created_at', startDate)
        .lt('created_at', endDate)
        .in('type', ['inschrijving', 'offerte', 'incompany']),
      supabase
        .from('telefoon_kliks')
        .select('created_at')
        .gte('created_at', startDate)
        .lt('created_at', endDate),
    ])

    // Groepeer per maand
    const monthMap = new Map<string, { telefoonKliks: number; inschrijvingen: number; offertes: number; incompany: number }>()

    // Initialiseer alle maanden
    for (let m = 0; m < 12; m++) {
      const key = `${selectedYear}-${String(m + 1).padStart(2, '0')}`
      monthMap.set(key, { telefoonKliks: 0, inschrijvingen: 0, offertes: 0, incompany: 0 })
    }

    // Tel inzendingen
    ;(inzendingen.data || []).forEach((i: { type: string; created_at: string }) => {
      const d = new Date(i.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const entry = monthMap.get(key)
      if (!entry) return
      if (i.type === 'inschrijving') entry.inschrijvingen++
      else if (i.type === 'offerte') entry.offertes++
      else if (i.type === 'incompany') entry.incompany++
    })

    // Tel telefoonkliks
    ;(kliks.data || []).forEach((k: { created_at: string }) => {
      const d = new Date(k.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const entry = monthMap.get(key)
      if (entry) entry.telefoonKliks++
    })

    const result: MaandData[] = [...monthMap.entries()].map(([key, val]) => {
      const [y, m] = key.split('-')
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })

      // Gewogen leads
      const telefoonKliksGewogen = val.telefoonKliks * CALL_CORRECTIE
      const incompanyGewogen = val.incompany * INCOMPANY_CORRECTIE
      const totaalLeads = telefoonKliksGewogen + val.inschrijvingen + val.offertes + incompanyGewogen

      // Prestatieberekening
      const extraLeads = Math.max(0, totaalLeads - BASELINE)
      const maxVergoeding = extraLeads * MAX_VERGOEDING_PER_LEAD
      const googleAds = adsSpend[key] || 0
      const totaalVast = ARBEID_PER_MAAND + googleAds

      // Vergoeding per lead: (opbrengst × max%) - (vaste kosten / leads)
      // Conform Excel: als totaalLeads > 0, bereken netto vergoeding per lead
      let vergoedingPerLead = 0
      let totaalVariabel = 0
      if (totaalLeads > 0 && extraLeads > 0) {
        vergoedingPerLead = (GEM_OPBRENGST_PER_LEAD * MAX_MARKETING_PERCENTAGE) - (totaalVast / totaalLeads)
        totaalVariabel = Math.max(0, Math.min(vergoedingPerLead * extraLeads, maxVergoeding))
      }

      const marketingkostenCompuact = totaalVast + totaalVariabel
      const omzetJachtDigital = ARBEID_PER_MAAND + totaalVariabel

      return {
        maand: key,
        label,
        telefoonKliks: val.telefoonKliks,
        inschrijvingen: val.inschrijvingen,
        offertes: val.offertes,
        incompany: val.incompany,
        telefoonKliksGewogen,
        incompanyGewogen,
        totaalLeads,
        extraLeads,
        maxVergoeding,
        googleAdsSpend: googleAds,
        totaalVast,
        vergoedingPerLead,
        totaalVariabel,
        marketingkostenCompuact,
        omzetJachtDigital,
      }
    })

    setMaanden(result)
    setLoading(false)
  }

  // Herbereken wanneer ads spend verandert
  useEffect(() => {
    if (!loading) loadData()
  }, [adsSpend])

  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const huidigeData = maanden.find(m => m.maand === currentMonth)

  const totaalJaar = maanden.reduce((acc, m) => ({
    leads: acc.leads + m.totaalLeads,
    variabel: acc.variabel + m.totaalVariabel,
    omzet: acc.omzet + m.omzetJachtDigital,
  }), { leads: 0, variabel: 0, omzet: 0 })

  const years = [2024, 2025, 2026]

  const euro = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prestatiebeloning</h1>
        <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedYear === y ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Samenvatting kaarten */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Leads deze maand</span>
            <div className="bg-primary-500 text-white p-2 rounded-lg"><TrendingUp size={18} /></div>
          </div>
          <div className="text-3xl font-bold">{huidigeData?.totaalLeads.toFixed(1) || '0'}</div>
          <div className="text-xs text-zinc-400 mt-1">Baseline: {BASELINE} | Extra: {huidigeData?.extraLeads.toFixed(1) || '0'}</div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Variabele beloning</span>
            <div className="bg-green-500 text-white p-2 rounded-lg"><TrendingUp size={18} /></div>
          </div>
          <div className="text-3xl font-bold">{euro(huidigeData?.totaalVariabel || 0)}</div>
          <div className="text-xs text-zinc-400 mt-1">Per lead: {euro(huidigeData?.vergoedingPerLead || 0)}</div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Omzet jacht.digital (jaar)</span>
            <div className="bg-amber-500 text-white p-2 rounded-lg"><TrendingUp size={18} /></div>
          </div>
          <div className="text-3xl font-bold">{euro(totaalJaar.omzet)}</div>
          <div className="text-xs text-zinc-400 mt-1">Waarvan variabel: {euro(totaalJaar.variabel)}</div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Totaal leads (jaar)</span>
            <div className="bg-violet-500 text-white p-2 rounded-lg"><TrendingUp size={18} /></div>
          </div>
          <div className="text-3xl font-bold">{totaalJaar.leads.toFixed(1)}</div>
          <div className="text-xs text-zinc-400 mt-1">Gem/mnd: {(totaalJaar.leads / 12).toFixed(1)}</div>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-6">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Model parameters</div>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <span>Baseline: <strong>{BASELINE} leads</strong></span>
          <span>Max/lead: <strong>{euro(MAX_VERGOEDING_PER_LEAD)}</strong></span>
          <span>Gem. opbrengst/lead: <strong>{euro(GEM_OPBRENGST_PER_LEAD)}</strong></span>
          <span>Max marketing%: <strong>{(MAX_MARKETING_PERCENTAGE * 100)}%</strong></span>
          <span>Arbeid: <strong>{euro(ARBEID_PER_MAAND)}/mnd</strong></span>
          <span>Call correctie: <strong>{CALL_CORRECTIE}x</strong></span>
          <span>InCompany correctie: <strong>{INCOMPANY_CORRECTIE}x</strong></span>
        </div>
      </div>

      {/* Maandoverzicht */}
      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="font-semibold">Maandoverzicht {selectedYear}</h2>
        </div>

        {/* Tabel header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-4 py-3 font-medium text-zinc-500">Maand</th>
                <th className="text-center px-2 py-3 font-medium text-zinc-500" title="Telefoonkliks (ruwe telling)"><Phone size={14} className="inline" /></th>
                <th className="text-center px-2 py-3 font-medium text-green-600" title="Directe inschrijvingen"><Inbox size={14} className="inline" /></th>
                <th className="text-center px-2 py-3 font-medium text-blue-600" title="Offerte aanvragen"><FileText size={14} className="inline" /></th>
                <th className="text-center px-2 py-3 font-medium text-amber-600" title="InCompany"><Building2 size={14} className="inline" /></th>
                <th className="text-center px-2 py-3 font-medium text-primary-600">Leads</th>
                <th className="text-center px-2 py-3 font-medium text-zinc-500">Extra</th>
                <th className="text-right px-2 py-3 font-medium text-zinc-500">Ads</th>
                <th className="text-right px-2 py-3 font-medium text-zinc-500">/Lead</th>
                <th className="text-right px-2 py-3 font-medium text-green-600">Variabel</th>
                <th className="text-right px-4 py-3 font-medium text-primary-600">Omzet</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {maanden.map((m) => {
                const isExpanded = expandedMonth === m.maand
                const heeftData = m.totaalLeads > 0
                return (
                  <Fragment key={m.maand}>
                    <tr className={`hover:bg-zinc-50 transition-colors ${!heeftData ? 'opacity-40' : ''}`}>
                      <td className="px-4 py-3 font-medium capitalize">{m.label}</td>
                      <td className="text-center px-2 py-3">
                        {m.telefoonKliks > 0 ? (
                          <span className="text-zinc-700" title={`Gewogen: ${m.telefoonKliksGewogen.toFixed(1)}`}>{m.telefoonKliks}</span>
                        ) : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-2 py-3">
                        {m.inschrijvingen > 0 ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{m.inschrijvingen}</span>
                        ) : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-2 py-3">
                        {m.offertes > 0 ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{m.offertes}</span>
                        ) : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-2 py-3">
                        {m.incompany > 0 ? (
                          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold" title={`Gewogen: ${m.incompanyGewogen.toFixed(1)}`}>{m.incompany}</span>
                        ) : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-2 py-3 font-bold text-primary-600">{m.totaalLeads.toFixed(1)}</td>
                      <td className="text-center px-2 py-3">
                        {m.extraLeads > 0 ? (
                          <span className="text-green-600 font-semibold">+{m.extraLeads.toFixed(1)}</span>
                        ) : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-right px-2 py-3">
                        {editingAds === m.maand ? (
                          <input
                            type="number"
                            value={adsInput}
                            onChange={e => setAdsInput(e.target.value)}
                            onBlur={() => {
                              saveAdsSpend(m.maand, parseFloat(adsInput) || 0)
                              setEditingAds(null)
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                saveAdsSpend(m.maand, parseFloat(adsInput) || 0)
                                setEditingAds(null)
                              }
                            }}
                            className="w-20 text-right text-sm border rounded px-1 py-0.5"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => { setEditingAds(m.maand); setAdsInput(String(m.googleAdsSpend || '')) }}
                            className="text-zinc-500 hover:text-zinc-700 inline-flex items-center gap-1"
                            title="Google Ads spend bewerken"
                          >
                            {m.googleAdsSpend > 0 ? euro(m.googleAdsSpend) : <span className="text-zinc-300">-</span>}
                            <Pencil size={10} />
                          </button>
                        )}
                      </td>
                      <td className="text-right px-2 py-3 text-zinc-600">
                        {m.vergoedingPerLead !== 0 ? euro(m.vergoedingPerLead) : '-'}
                      </td>
                      <td className="text-right px-2 py-3">
                        {m.totaalVariabel > 0 ? (
                          <span className="text-green-600 font-semibold">{euro(m.totaalVariabel)}</span>
                        ) : <span className="text-zinc-300">-</span>}
                      </td>
                      <td className="text-right px-4 py-3 font-bold text-primary-600">{euro(m.omzetJachtDigital)}</td>
                      <td className="px-2 py-3">
                        {heeftData && (
                          <button onClick={() => setExpandedMonth(isExpanded ? null : m.maand)} className="text-zinc-400 hover:text-zinc-600">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={12} className="bg-zinc-50 px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-zinc-500 text-xs mb-1">Leadbronnen (gewogen)</div>
                              <div className="space-y-1">
                                <div className="flex justify-between"><span>Telefoonkliks</span><span>{m.telefoonKliks} x {CALL_CORRECTIE} = <strong>{m.telefoonKliksGewogen.toFixed(2)}</strong></span></div>
                                <div className="flex justify-between"><span>Inschrijvingen</span><span><strong>{m.inschrijvingen}</strong></span></div>
                                <div className="flex justify-between"><span>Offertes</span><span><strong>{m.offertes}</strong></span></div>
                                <div className="flex justify-between"><span>InCompany</span><span>{m.incompany} x {INCOMPANY_CORRECTIE} = <strong>{m.incompanyGewogen.toFixed(2)}</strong></span></div>
                                <div className="flex justify-between border-t pt-1 font-semibold"><span>Totaal leads</span><span>{m.totaalLeads.toFixed(2)}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500 text-xs mb-1">Prestatie</div>
                              <div className="space-y-1">
                                <div className="flex justify-between"><span>Leads behaald</span><span>{m.totaalLeads.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Baseline</span><span>-{BASELINE}</span></div>
                                <div className="flex justify-between border-t pt-1 font-semibold"><span>Extra leads</span><span>{m.extraLeads.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Max vergoeding</span><span>{euro(m.maxVergoeding)}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500 text-xs mb-1">Vaste kosten</div>
                              <div className="space-y-1">
                                <div className="flex justify-between"><span>Arbeid</span><span>{euro(ARBEID_PER_MAAND)}</span></div>
                                <div className="flex justify-between"><span>Google Ads</span><span>{euro(m.googleAdsSpend)}</span></div>
                                <div className="flex justify-between border-t pt-1 font-semibold"><span>Totaal vast</span><span>{euro(m.totaalVast)}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500 text-xs mb-1">Resultaat</div>
                              <div className="space-y-1">
                                <div className="flex justify-between"><span>Vergoeding/lead</span><span>{euro(m.vergoedingPerLead)}</span></div>
                                <div className="flex justify-between"><span>Totaal variabel</span><span className="text-green-600 font-semibold">{euro(m.totaalVariabel)}</span></div>
                                <div className="flex justify-between border-t pt-1"><span>Kosten CompuAct</span><span>{euro(m.marketingkostenCompuact)}</span></div>
                                <div className="flex justify-between font-bold text-primary-600"><span>Omzet jacht.digital</span><span>{euro(m.omzetJachtDigital)}</span></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-50 border-t-2 border-zinc-300 font-semibold">
                <td className="px-4 py-3">Totaal {selectedYear}</td>
                <td className="text-center px-2 py-3">{maanden.reduce((s, m) => s + m.telefoonKliks, 0)}</td>
                <td className="text-center px-2 py-3">{maanden.reduce((s, m) => s + m.inschrijvingen, 0)}</td>
                <td className="text-center px-2 py-3">{maanden.reduce((s, m) => s + m.offertes, 0)}</td>
                <td className="text-center px-2 py-3">{maanden.reduce((s, m) => s + m.incompany, 0)}</td>
                <td className="text-center px-2 py-3 text-primary-600">{totaalJaar.leads.toFixed(1)}</td>
                <td className="text-center px-2 py-3">{maanden.reduce((s, m) => s + m.extraLeads, 0).toFixed(1)}</td>
                <td className="text-right px-2 py-3">{euro(maanden.reduce((s, m) => s + m.googleAdsSpend, 0))}</td>
                <td className="text-right px-2 py-3">-</td>
                <td className="text-right px-2 py-3 text-green-600">{euro(totaalJaar.variabel)}</td>
                <td className="text-right px-4 py-3 text-primary-600">{euro(totaalJaar.omzet)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

