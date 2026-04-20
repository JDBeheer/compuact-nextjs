'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Inbox, FileText, Building2, ChevronDown, Euro, Loader2 } from 'lucide-react'

interface Inzending {
  id: string
  type: 'inschrijving' | 'offerte' | 'incompany'
  status: 'nieuw' | 'verwerkt' | 'geannuleerd'
  totaalprijs: number
  created_at: string
  klantgegevens: {
    voornaam: string
    achternaam: string
    email: string
    bedrijfsnaam?: string
  }
  cursussen: { cursusTitel: string; prijs?: number; aantalDeelnemers?: number }[]
}

interface MaandOmzet {
  maand: string
  label: string
  inschrijvingen: { aantal: number; omzet: number }
  offertes: { aantal: number; omzet: number }
  incompany: { aantal: number; omzetSchatting: number }
  totaalOmzet: number
  totaalAanvragen: number
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

export default function OmzetPage() {
  const [inzendingen, setInzendingen] = useState<Inzending[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'alle' | 'actief' | 'verwerkt'>('actief')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('inschrijvingen')
        .select('*')
        .gte('created_at', `${selectedYear}-01-01`)
        .lt('created_at', `${selectedYear + 1}-01-01`)
        .order('created_at', { ascending: false })

      setInzendingen((data || []) as Inzending[])
      setLoading(false)
    }
    load()
  }, [selectedYear])

  // Filter cancelled
  const filtered = statusFilter === 'alle'
    ? inzendingen
    : statusFilter === 'actief'
      ? inzendingen.filter(i => i.status !== 'geannuleerd')
      : inzendingen.filter(i => i.status === 'verwerkt')

  // Incompany geschatte dagprijs
  const INCOMPANY_DAGPRIJS = 1295

  // Totals
  const totaalInschrijvingen = filtered.filter(i => i.type === 'inschrijving')
  const totaalOffertes = filtered.filter(i => i.type === 'offerte')
  const totaalIncompany = filtered.filter(i => i.type === 'incompany')

  const omzetInschrijvingen = totaalInschrijvingen.reduce((sum, i) => sum + Number(i.totaalprijs || 0), 0)
  const omzetOffertes = totaalOffertes.reduce((sum, i) => sum + Number(i.totaalprijs || 0), 0)
  const omzetIncompanySchatting = totaalIncompany.length * INCOMPANY_DAGPRIJS
  const totaleOmzet = omzetInschrijvingen + omzetOffertes
  const totaleOmzetInclSchatting = totaleOmzet + omzetIncompanySchatting

  // Per month
  const maandMap = new Map<string, MaandOmzet>()
  for (let m = 0; m < 12; m++) {
    const key = `${selectedYear}-${String(m + 1).padStart(2, '0')}`
    const label = new Date(selectedYear, m).toLocaleDateString('nl-NL', { month: 'long' })
    maandMap.set(key, {
      maand: key,
      label,
      inschrijvingen: { aantal: 0, omzet: 0 },
      offertes: { aantal: 0, omzet: 0 },
      incompany: { aantal: 0, omzetSchatting: 0 },
      totaalOmzet: 0,
      totaalAanvragen: 0,
    })
  }

  filtered.forEach(i => {
    const d = new Date(i.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const entry = maandMap.get(key)
    if (!entry) return
    const prijs = Number(i.totaalprijs || 0)

    if (i.type === 'inschrijving') {
      entry.inschrijvingen.aantal++
      entry.inschrijvingen.omzet += prijs
    } else if (i.type === 'offerte') {
      entry.offertes.aantal++
      entry.offertes.omzet += prijs
    } else if (i.type === 'incompany') {
      entry.incompany.aantal++
      entry.incompany.omzetSchatting += INCOMPANY_DAGPRIJS
    }
    entry.totaalOmzet += prijs + (i.type === 'incompany' ? INCOMPANY_DAGPRIJS : 0)
    entry.totaalAanvragen++
  })

  const maanden = [...maandMap.values()].reverse()
  const maxOmzet = Math.max(...maanden.map(m => m.totaalOmzet), 1)

  // Month detail
  function getMonthInzendingen(maand: string) {
    return filtered.filter(i => {
      const d = new Date(i.created_at)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === maand
    })
  }

  const years = [2024, 2025, 2026]

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Omzet Overzicht</h1>
          <p className="text-sm text-zinc-500 mt-1">Website-omzet op basis van inschrijvingen en offertes</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
            {(['actief', 'verwerkt', 'alle'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
              >
                {f === 'actief' ? 'Excl. geannuleerd' : f === 'verwerkt' ? 'Alleen verwerkt' : 'Alles'}
              </button>
            ))}
          </div>
          <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedYear === y ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Omzet (bevestigd)</span>
            <div className="bg-green-500 text-white p-2 rounded-lg"><Euro size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{formatCurrency(totaleOmzet)}</div>
          <p className="text-xs text-zinc-400 mt-1">Incl. incompany schatting: {formatCurrency(totaleOmzetInclSchatting)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Inschrijvingen</span>
            <div className="bg-primary-500 text-white p-2 rounded-lg"><Inbox size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{totaalInschrijvingen.length}</div>
          <p className="text-xs text-zinc-400 mt-1">{formatCurrency(omzetInschrijvingen)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">Offertes</span>
            <div className="bg-amber-500 text-white p-2 rounded-lg"><FileText size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{totaalOffertes.length}</div>
          <p className="text-xs text-zinc-400 mt-1">{formatCurrency(omzetOffertes)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500">InCompany</span>
            <div className="bg-violet-500 text-white p-2 rounded-lg"><Building2 size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{totaalIncompany.length}</div>
          <p className="text-xs text-zinc-400 mt-1">~{formatCurrency(omzetIncompanySchatting)} (€{INCOMPANY_DAGPRIJS}/dag)</p>
        </div>
      </div>

      {/* Gem. orderwaarde */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-xs text-zinc-400 mb-1">Gem. orderwaarde</p>
          <p className="text-xl font-bold text-zinc-900">
            {totaalInschrijvingen.length > 0 ? formatCurrency(omzetInschrijvingen / totaalInschrijvingen.length) : '—'}
          </p>
          <p className="text-xs text-zinc-400">per inschrijving</p>
        </div>
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-xs text-zinc-400 mb-1">Gem. offertewaarde</p>
          <p className="text-xl font-bold text-zinc-900">
            {totaalOffertes.length > 0 ? formatCurrency(omzetOffertes / totaalOffertes.length) : '—'}
          </p>
          <p className="text-xs text-zinc-400">per offerte</p>
        </div>
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-xs text-zinc-400 mb-1">Totaal aanvragen</p>
          <p className="text-xl font-bold text-zinc-900">{filtered.length}</p>
          <p className="text-xs text-zinc-400">via website</p>
        </div>
      </div>

      {/* Per maand */}
      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="font-semibold">Omzet per maand</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {maanden.map(m => {
            const isExpanded = expandedMonth === m.maand
            const monthItems = isExpanded ? getMonthInzendingen(m.maand) : []

            return (
              <div key={m.maand}>
                <button
                  onClick={() => setExpandedMonth(isExpanded ? null : m.maand)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-28 text-left">
                    <div className="font-medium text-sm capitalize">{m.label}</div>
                    <div className="text-xs text-zinc-400">{m.totaalAanvragen} aanvragen</div>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 flex items-center gap-0.5 h-6">
                    {m.inschrijvingen.omzet > 0 && (
                      <div className="bg-green-500 h-full rounded-l" style={{ width: `${(m.inschrijvingen.omzet / maxOmzet) * 100}%`, minWidth: '4px' }} title={`Inschrijvingen: ${formatCurrency(m.inschrijvingen.omzet)}`} />
                    )}
                    {m.offertes.omzet > 0 && (
                      <div className="bg-amber-500 h-full" style={{ width: `${(m.offertes.omzet / maxOmzet) * 100}%`, minWidth: '4px' }} title={`Offertes: ${formatCurrency(m.offertes.omzet)}`} />
                    )}
                    {m.incompany.omzetSchatting > 0 && (
                      <div className="bg-violet-500 h-full rounded-r" style={{ width: `${(m.incompany.omzetSchatting / maxOmzet) * 100}%`, minWidth: '4px' }} title={`InCompany (schatting): ${formatCurrency(m.incompany.omzetSchatting)}`} />
                    )}
                  </div>

                  <div className="w-24 text-right font-bold text-sm">
                    {m.totaalOmzet > 0 ? formatCurrency(m.totaalOmzet) : <span className="text-zinc-300">—</span>}
                  </div>

                  <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4">
                    {/* Month summary */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-700">{m.inschrijvingen.aantal}</div>
                        <div className="text-xs text-green-600">Inschrijvingen</div>
                        <div className="text-xs text-green-500 font-semibold mt-0.5">{formatCurrency(m.inschrijvingen.omzet)}</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-amber-700">{m.offertes.aantal}</div>
                        <div className="text-xs text-amber-600">Offertes</div>
                        <div className="text-xs text-amber-500 font-semibold mt-0.5">{formatCurrency(m.offertes.omzet)}</div>
                      </div>
                      <div className="bg-violet-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-violet-700">{m.incompany.aantal}</div>
                        <div className="text-xs text-violet-600">InCompany</div>
                        <div className="text-xs text-violet-500 font-semibold mt-0.5">~{formatCurrency(m.incompany.omzetSchatting)}</div>
                      </div>
                    </div>

                    {/* Individual entries */}
                    {monthItems.length > 0 && (
                      <div className="border border-zinc-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                              <th className="text-left px-4 py-2 font-medium text-zinc-500 text-xs">Datum</th>
                              <th className="text-left px-4 py-2 font-medium text-zinc-500 text-xs">Klant</th>
                              <th className="text-left px-4 py-2 font-medium text-zinc-500 text-xs">Type</th>
                              <th className="text-left px-4 py-2 font-medium text-zinc-500 text-xs">Cursussen</th>
                              <th className="text-left px-4 py-2 font-medium text-zinc-500 text-xs">Status</th>
                              <th className="text-right px-4 py-2 font-medium text-zinc-500 text-xs">Bedrag</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {monthItems.map(i => {
                              const typeCfg: Record<string, { label: string; color: string }> = {
                                inschrijving: { label: 'Inschrijving', color: 'bg-green-100 text-green-700' },
                                offerte: { label: 'Offerte', color: 'bg-amber-100 text-amber-700' },
                                incompany: { label: 'InCompany', color: 'bg-violet-100 text-violet-700' },
                              }
                              const statusCfg: Record<string, { label: string; color: string }> = {
                                nieuw: { label: 'Nieuw', color: 'bg-blue-100 text-blue-700' },
                                verwerkt: { label: 'Verwerkt', color: 'bg-green-100 text-green-700' },
                                geannuleerd: { label: 'Geannuleerd', color: 'bg-red-100 text-red-700' },
                              }
                              const t = typeCfg[i.type] || typeCfg.inschrijving
                              const s = statusCfg[i.status] || statusCfg.nieuw
                              const cursusNamen = i.cursussen?.map(c => c.cursusTitel).join(', ') || '—'

                              return (
                                <tr key={i.id} className={`hover:bg-zinc-50 ${i.status === 'geannuleerd' ? 'opacity-50' : ''}`}>
                                  <td className="px-4 py-2.5 text-zinc-500 text-xs whitespace-nowrap">
                                    {new Date(i.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <div className="font-medium text-zinc-900 text-sm">{i.klantgegevens.voornaam} {i.klantgegevens.achternaam}</div>
                                    {i.klantgegevens.bedrijfsnaam && <div className="text-xs text-zinc-400">{i.klantgegevens.bedrijfsnaam}</div>}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.color}`}>{t.label}</span>
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-zinc-500 max-w-[200px] truncate">{cursusNamen}</td>
                                  <td className="px-4 py-2.5">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.color}`}>{s.label}</span>
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-semibold text-sm">
                                    {Number(i.totaalprijs) > 0 ? formatCurrency(Number(i.totaalprijs)) : <span className="text-zinc-300">—</span>}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="px-6 py-3 border-t border-zinc-100 flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> Inschrijvingen</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Offertes</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-500" /> InCompany (schatting €{INCOMPANY_DAGPRIJS}/dag)</span>
        </div>
      </div>
    </div>
  )
}
