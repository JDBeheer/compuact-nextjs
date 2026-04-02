'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Inbox, TrendingUp, Building2, Download, ChevronDown } from 'lucide-react'

interface DayStats {
  date: string
  inschrijving: number
  offerte: number
  incompany: number
  studiegids: number
}

interface MonthStats {
  month: string
  label: string
  inschrijving: number
  offerte: number
  incompany: number
  studiegids: number
  total: number
}

export default function AdminDashboard() {
  const [totals, setTotals] = useState({ cursussen: 0, sessies: 0, inschrijving: 0, offerte: 0, incompany: 0, studiegids: 0 })
  const [monthStats, setMonthStats] = useState<MonthStats[]>([])
  const [dayStats, setDayStats] = useState<DayStats[]>([])
  const [recenteInzendingen, setRecenteInzendingen] = useState<Record<string, unknown>[]>([])
  const [viewMode, setViewMode] = useState<'maand' | 'dag'>('maand')
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function loadData() {
      const [cursussen, sessies, inzendingen, recente] = await Promise.all([
        supabase.from('cursussen').select('id', { count: 'exact', head: true }),
        supabase.from('cursus_sessies').select('id', { count: 'exact', head: true }),
        supabase.from('inschrijvingen').select('type, created_at').order('created_at', { ascending: false }),
        supabase.from('inschrijvingen').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      const all = (inzendingen.data || []) as { type: string; created_at: string }[]

      // Totals
      const counts = { inschrijving: 0, offerte: 0, incompany: 0, studiegids: 0 }
      all.forEach(i => { if (i.type in counts) counts[i.type as keyof typeof counts]++ })

      setTotals({
        cursussen: cursussen.count || 0,
        sessies: sessies.count || 0,
        ...counts,
      })

      // Group by month
      const monthMap = new Map<string, { inschrijving: number; offerte: number; incompany: number; studiegids: number }>()
      all.forEach(i => {
        const d = new Date(i.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!monthMap.has(key)) monthMap.set(key, { inschrijving: 0, offerte: 0, incompany: 0, studiegids: 0 })
        const m = monthMap.get(key)!
        if (i.type in m) m[i.type as keyof typeof m]++
      })

      const months: MonthStats[] = [...monthMap.entries()]
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([key, val]) => {
          const [y, m] = key.split('-')
          const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
          return { month: key, label, ...val, total: val.inschrijving + val.offerte + val.incompany + val.studiegids }
        })
      setMonthStats(months)

      // Group by day (last 30 days)
      const dayMap = new Map<string, { inschrijving: number; offerte: number; incompany: number; studiegids: number }>()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      all.filter(i => new Date(i.created_at) >= thirtyDaysAgo).forEach(i => {
        const key = new Date(i.created_at).toISOString().split('T')[0]
        if (!dayMap.has(key)) dayMap.set(key, { inschrijving: 0, offerte: 0, incompany: 0, studiegids: 0 })
        const d = dayMap.get(key)!
        if (i.type in d) d[i.type as keyof typeof d]++
      })

      const days: DayStats[] = [...dayMap.entries()]
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, val]) => ({ date, ...val }))
      setDayStats(days)

      setRecenteInzendingen(recente.data || [])
    }

    loadData()
  }, [])

  const maxMonthTotal = Math.max(...monthStats.map(m => m.total), 1)

  const statCards = [
    { label: 'Inschrijvingen', value: totals.inschrijving, icon: Inbox, color: 'bg-green-500' },
    { label: 'Offertes', value: totals.offerte, icon: TrendingUp, color: 'bg-primary-500' },
    { label: 'InCompany', value: totals.incompany, icon: Building2, color: 'bg-amber-500' },
    { label: 'Studiegids', value: totals.studiegids, icon: Download, color: 'bg-violet-500' },
  ]

  const typeBadge = (type: string) => {
    const config: Record<string, string> = {
      inschrijving: 'bg-green-100 text-green-700',
      offerte: 'bg-blue-100 text-blue-700',
      incompany: 'bg-amber-100 text-amber-700',
      studiegids: 'bg-violet-100 text-violet-700',
    }
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config[type] || 'bg-zinc-100 text-zinc-700'}`}>{type}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Totaal stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{stat.label}</span>
              <div className={`${stat.color} text-white p-2 rounded-lg`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Stats per maand/dag */}
      <div className="bg-white rounded-xl border border-zinc-200 mb-8">
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="font-semibold">Statistieken</h2>
          <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('maand')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${viewMode === 'maand' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              Per maand
            </button>
            <button
              onClick={() => setViewMode('dag')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${viewMode === 'dag' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              Per dag (30d)
            </button>
          </div>
        </div>

        {viewMode === 'maand' ? (
          <div className="divide-y divide-zinc-100">
            {monthStats.length === 0 ? (
              <div className="px-6 py-8 text-center text-zinc-500">Nog geen data beschikbaar.</div>
            ) : monthStats.map((m) => (
              <div key={m.month}>
                <button
                  onClick={() => setExpandedMonth(expandedMonth === m.month ? null : m.month)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-32 text-left">
                    <div className="font-medium text-sm capitalize">{m.label}</div>
                    <div className="text-xs text-zinc-400">{m.total} totaal</div>
                  </div>

                  {/* Bar chart */}
                  <div className="flex-1 flex items-center gap-0.5 h-6">
                    {m.inschrijving > 0 && (
                      <div className="bg-green-500 h-full rounded-l" style={{ width: `${(m.inschrijving / maxMonthTotal) * 100}%`, minWidth: '4px' }} title={`${m.inschrijving} inschrijvingen`} />
                    )}
                    {m.offerte > 0 && (
                      <div className="bg-blue-500 h-full" style={{ width: `${(m.offerte / maxMonthTotal) * 100}%`, minWidth: '4px' }} title={`${m.offerte} offertes`} />
                    )}
                    {m.incompany > 0 && (
                      <div className="bg-amber-500 h-full" style={{ width: `${(m.incompany / maxMonthTotal) * 100}%`, minWidth: '4px' }} title={`${m.incompany} incompany`} />
                    )}
                    {m.studiegids > 0 && (
                      <div className="bg-violet-500 h-full rounded-r" style={{ width: `${(m.studiegids / maxMonthTotal) * 100}%`, minWidth: '4px' }} title={`${m.studiegids} studiegids`} />
                    )}
                  </div>

                  <ChevronDown size={16} className={`text-zinc-400 transition-transform ${expandedMonth === m.month ? 'rotate-180' : ''}`} />
                </button>

                {expandedMonth === m.month && (
                  <div className="px-6 pb-4 grid grid-cols-4 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-700">{m.inschrijving}</div>
                      <div className="text-xs text-green-600">Inschrijvingen</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-700">{m.offerte}</div>
                      <div className="text-xs text-blue-600">Offertes</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-amber-700">{m.incompany}</div>
                      <div className="text-xs text-amber-600">InCompany</div>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-violet-700">{m.studiegids}</div>
                      <div className="text-xs text-violet-600">Studiegids</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-6 py-3 font-medium text-zinc-500">Datum</th>
                  <th className="text-center px-3 py-3 font-medium text-green-600">Inschrijvingen</th>
                  <th className="text-center px-3 py-3 font-medium text-blue-600">Offertes</th>
                  <th className="text-center px-3 py-3 font-medium text-amber-600">InCompany</th>
                  <th className="text-center px-3 py-3 font-medium text-violet-600">Studiegids</th>
                  <th className="text-center px-3 py-3 font-medium text-zinc-500">Totaal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {dayStats.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Nog geen data in de afgelopen 30 dagen.</td></tr>
                ) : dayStats.map((d) => {
                  const total = d.inschrijving + d.offerte + d.incompany + d.studiegids
                  return (
                    <tr key={d.date} className="hover:bg-zinc-50">
                      <td className="px-6 py-3 font-medium">
                        {new Date(d.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="text-center px-3 py-3">
                        {d.inschrijving > 0 ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{d.inschrijving}</span> : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-3 py-3">
                        {d.offerte > 0 ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{d.offerte}</span> : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-3 py-3">
                        {d.incompany > 0 ? <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{d.incompany}</span> : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-3 py-3">
                        {d.studiegids > 0 ? <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{d.studiegids}</span> : <span className="text-zinc-300">0</span>}
                      </td>
                      <td className="text-center px-3 py-3 font-bold">{total}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="px-6 py-3 border-t border-zinc-100 flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> Inschrijvingen</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> Offertes</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> InCompany</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-500" /> Studiegids</span>
        </div>
      </div>

      {/* Recente inzendingen */}
      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="font-semibold">Recente inzendingen</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {recenteInzendingen.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-500">Geen inzendingen gevonden.</div>
          ) : (
            recenteInzendingen.map((inz) => {
              const klant = inz.klantgegevens as Record<string, string>
              return (
                <div key={inz.id as string} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{klant?.voornaam} {klant?.achternaam}</div>
                    <div className="text-sm text-zinc-500">{klant?.email}</div>
                  </div>
                  <div className="text-right">
                    {typeBadge(inz.type as string)}
                    <div className="text-xs text-zinc-400 mt-1">
                      {new Date(inz.created_at as string).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
