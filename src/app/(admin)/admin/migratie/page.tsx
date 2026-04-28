'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Search, BarChart3, Globe, Shield, Zap, ArrowUp, ArrowDown, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

// ── Data snapshots — update deze bij elke nieuwe check ──

interface Snapshot {
  datum: string
  bron: string // 'Search Console' | 'Ahrefs' | 'PageSpeed'
  indexering: {
    geindexeerd: number
    nietGeindexeerd: number
    sitemapUrls: number
  }
  traffic: {
    clicksPerDag: number
    impressionsPerDag: number
    piekCtr: number
  }
  rankings: {
    stijgers: { keyword: string; volume: number; van: number; naar: number }[]
    stabiel: { keyword: string; volume: number; positie: number }[]
    dalers: { keyword: string; volume: number; van: number; naar: number }[]
    nieuw: { keyword: string; positie: number; url: string }[]
    nogOudeUrl: { keyword: string; volume: number; positie: number; oudeUrl: string; nieuweUrl: string }[]
  }
  cwv: {
    performanceScore: number
    lcp: string
    cls: string
    tbt: string
  }
}

const snapshots: Snapshot[] = [
  {
    datum: '28 april 2026 (dag 15 — live SERP + GSC Coverage)',
    bron: 'GSC Coverage + DataForSEO Live SERP + Ahrefs',
    indexering: {
      geindexeerd: 2324,
      nietGeindexeerd: 0,
      sitemapUrls: 2324,
    },
    traffic: {
      clicksPerDag: 13.2,
      impressionsPerDag: 1471,
      piekCtr: 1.54,
    },
    rankings: {
      stijgers: [],
      stabiel: [
        { keyword: 'cursus excel gevorderden', volume: 320, positie: 4 },
        { keyword: 'cursus word gevorderden', volume: 20, positie: 5 },
        { keyword: 'cursus excel basis', volume: 100, positie: 7 },
        { keyword: 'excel basis cursus', volume: 90, positie: 8 },
        { keyword: 'cursus word', volume: 170, positie: 10 },
        { keyword: 'excel cursus klassikaal', volume: 100, positie: 10 },
        { keyword: 'excel cursus beginners', volume: 210, positie: 12 },
      ],
      dalers: [
        { keyword: 'excel cursus', volume: 1300, van: 17, naar: 99 },
        { keyword: 'cursus excel', volume: 720, van: 15, naar: 99 },
        { keyword: 'excel training', volume: 500, van: 4, naar: 99 },
        { keyword: 'microsoft office cursus', volume: 200, van: 6, naar: 99 },
        { keyword: 'online cursus powerpoint', volume: 150, van: 11, naar: 99 },
      ],
      nieuw: [
        { keyword: 'cursus excel gevorderden', positie: 4, url: '/cursussen/excel-gevorderd' },
        { keyword: 'cursus word gevorderden', positie: 5, url: '/cursussen/word-gevorderd' },
        { keyword: 'cursus excel basis', positie: 7, url: '/cursussen/excel-basis' },
        { keyword: 'excel basis cursus', positie: 8, url: '/cursussen/excel-basis' },
        { keyword: 'cursus word', positie: 10, url: '/cursussen/word' },
        { keyword: 'excel cursus klassikaal', positie: 10, url: '/cursussen/excel-basis' },
        { keyword: 'excel cursus beginners', positie: 12, url: '/cursussen/excel-basis' },
      ],
      nogOudeUrl: [],
    },
    cwv: {
      performanceScore: 98,
      lcp: '0.9s',
      cls: '0',
      tbt: '120ms',
    },
  },
  {
    datum: '20 april 2026 (update 15:56)',
    bron: 'Search Console + Ahrefs + PageSpeed',
    indexering: {
      geindexeerd: 1241,
      nietGeindexeerd: 4334,
      sitemapUrls: 2268,
    },
    traffic: {
      clicksPerDag: 13.2,
      impressionsPerDag: 1471,
      piekCtr: 1.54,
    },
    rankings: {
      stijgers: [
        { keyword: 'cursus outlook voor secretaresses', volume: 40, van: 11, naar: 1 },
        { keyword: 'cursus word voor gevorderden', volume: 30, van: 9, naar: 2 },
        { keyword: 'cursus word gevorderden', volume: 20, van: 3, naar: 1 },
        { keyword: 'excel cursus basis', volume: 30, van: 4, naar: 2 },
        { keyword: 'cursus word en excel online', volume: 30, van: 9, naar: 8 },
        { keyword: 'word voor beginners', volume: 10, van: 9, naar: 8 },
      ],
      stabiel: [
        { keyword: 'cursus excel basis', volume: 100, positie: 1 },
        { keyword: 'excel basis cursus', volume: 90, positie: 1 },
        { keyword: 'basiscursus excel', volume: 60, positie: 1 },
        { keyword: 'cursus microsoft office 365', volume: 150, positie: 1 },
        { keyword: 'compu act opleidingen', volume: 50, positie: 1 },
        { keyword: 'excel training', volume: 500, positie: 4 },
        { keyword: 'cursus excel gevorderden', volume: 200, positie: 4 },
        { keyword: 'word cursus', volume: 100, positie: 6 },
        { keyword: 'microsoft office cursus', volume: 200, positie: 6 },
      ],
      dalers: [
        { keyword: 'excel cursus beginners', volume: 150, van: 1, naar: 8 },
        { keyword: 'cursus word', volume: 200, van: 1, naar: 6 },
        { keyword: 'excel cursus', volume: 1000, van: 13, naar: 17 },
        { keyword: 'power bi cursus', volume: 900, van: 27, naar: 36 },
      ],
      nieuw: [
        { keyword: 'cursus office 365 online', positie: 9, url: '/cursussen/office-365-voor-eindgebruikers' },
      ],
      nogOudeUrl: [
        { keyword: 'excel cursus', volume: 1000, positie: 17, oudeUrl: '/microsoft-office/excel/excel-basis/', nieuweUrl: '/cursussen/excel-basis' },
        { keyword: 'cursus excel', volume: 700, positie: 15, oudeUrl: '/microsoft-office/excel/excel-basis/', nieuweUrl: '/cursussen/excel-basis' },
        { keyword: 'excel training', volume: 500, positie: 4, oudeUrl: '/microsoft-office/excel/excel-functies-en-formules/', nieuweUrl: '/cursussen/excel-functies-en-formules' },
        { keyword: 'cursus word', volume: 200, positie: 6, oudeUrl: '/microsoft-office/excel/word-en-excel/', nieuweUrl: '/cursussen/word-en-excel' },
        { keyword: 'cursus excel gevorderden', volume: 200, positie: 4, oudeUrl: '/microsoft-office/excel/excel-gevorderd/', nieuweUrl: '/cursussen/excel-gevorderd' },
        { keyword: 'microsoft office cursus', volume: 200, positie: 6, oudeUrl: '/microsoft-office/excel/excel-basis/', nieuweUrl: '/cursussen/excel' },
        { keyword: 'excel cursus beginners', volume: 150, positie: 8, oudeUrl: '/microsoft-office/excel/excel-basis/', nieuweUrl: '/cursussen/excel-basis' },
        { keyword: 'online cursus powerpoint', volume: 150, positie: 11, oudeUrl: '/microsoft-office/powerpoint-alles-in-een/', nieuweUrl: '/cursussen/powerpoint-alles-in-een' },
        { keyword: 'word cursus', volume: 100, positie: 6, oudeUrl: '/microsoft-office/word/word-basis/', nieuweUrl: '/cursussen/word-basis' },
        { keyword: 'power bi cursus', volume: 900, positie: 36, oudeUrl: '/microsoft-office/power-bi/experts-power-bi/', nieuweUrl: '/cursussen/power-bi' },
      ],
    },
    cwv: {
      performanceScore: 98,
      lcp: '0.9s',
      cls: '0',
      tbt: '120ms',
    },
  },
  // Pre-migratie baseline
  {
    datum: '13 april 2026 (pre-migratie)',
    bron: 'Search Console',
    indexering: {
      geindexeerd: 414,
      nietGeindexeerd: 5557,
      sitemapUrls: 0,
    },
    traffic: {
      clicksPerDag: 8.9,
      impressionsPerDag: 1193,
      piekCtr: 1.29,
    },
    rankings: {
      stijgers: [],
      stabiel: [],
      dalers: [],
      nieuw: [],
      nogOudeUrl: [],
    },
    cwv: {
      performanceScore: 55,
      lcp: '4.2s',
      cls: '0.15',
      tbt: '1200ms',
    },
  },
]

function formatDiff(van: number, naar: number): { text: string; color: string; icon: typeof TrendingUp } {
  const diff = van - naar // positie: lager is beter
  if (diff > 0) return { text: `+${diff}`, color: 'text-green-600', icon: TrendingUp }
  if (diff < 0) return { text: `${diff}`, color: 'text-red-500', icon: TrendingDown }
  return { text: '0', color: 'text-zinc-400', icon: Minus }
}

function ProgressBar({ value, max, color = 'bg-primary-500' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full bg-zinc-100 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function MigratieDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const current = snapshots[selectedIndex]
  const baseline = snapshots[snapshots.length - 1]
  const isBaseline = selectedIndex === snapshots.length - 1

  const indexPct = Math.round((current.indexering.geindexeerd / (current.indexering.geindexeerd + current.indexering.nietGeindexeerd)) * 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Migratie Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">WordPress → Next.js | Livegang 13 april 2026</p>
        </div>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600"
        >
          {snapshots.map((s, i) => (
            <option key={i} value={i}>{s.datum}</option>
          ))}
        </select>
      </div>

      {/* KPI's vergelijking */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Geïndexeerd</span>
            <Globe size={18} className="text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{current.indexering.geindexeerd.toLocaleString('nl-NL')}</div>
          {!isBaseline && (
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+{Math.round(((current.indexering.geindexeerd - baseline.indexering.geindexeerd) / baseline.indexering.geindexeerd) * 100)}% vs pre-migratie</span>
            </div>
          )}
          <ProgressBar value={current.indexering.geindexeerd} max={current.indexering.sitemapUrls || current.indexering.geindexeerd + current.indexering.nietGeindexeerd} color="bg-green-500" />
          <p className="text-xs text-zinc-400 mt-1">{indexPct}% van totaal</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Clicks/dag</span>
            <Search size={18} className="text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{current.traffic.clicksPerDag}</div>
          {!isBaseline && (
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+{Math.round(((current.traffic.clicksPerDag - baseline.traffic.clicksPerDag) / baseline.traffic.clicksPerDag) * 100)}% vs pre-migratie</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Impressions/dag</span>
            <BarChart3 size={18} className="text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{current.traffic.impressionsPerDag.toLocaleString('nl-NL')}</div>
          {!isBaseline && (
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+{Math.round(((current.traffic.impressionsPerDag - baseline.traffic.impressionsPerDag) / baseline.traffic.impressionsPerDag) * 100)}% vs pre-migratie</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">PageSpeed</span>
            <Zap size={18} className="text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900">{current.cwv.performanceScore}</div>
          {!isBaseline && (
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+{current.cwv.performanceScore - baseline.cwv.performanceScore} vs WordPress</span>
            </div>
          )}
          <div className="flex gap-3 mt-2 text-xs text-zinc-400">
            <span>LCP: {current.cwv.lcp}</span>
            <span>TBT: {current.cwv.tbt}</span>
          </div>
        </div>
      </div>

      {!isBaseline && (
        <>
          {/* Ranking stijgers */}
          {current.rankings.stijgers.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 mb-6">
              <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" />
                <h2 className="font-semibold text-zinc-900">Ranking stijgers</h2>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{current.rankings.stijgers.length}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="text-left px-5 py-2.5 font-medium text-zinc-500">Keyword</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Volume</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Was</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Nu</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Stijging</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {current.rankings.stijgers.map((r) => {
                    const diff = formatDiff(r.van, r.naar)
                    return (
                      <tr key={r.keyword} className="hover:bg-zinc-50">
                        <td className="px-5 py-3 font-medium text-zinc-900">{r.keyword}</td>
                        <td className="text-center px-3 py-3 text-zinc-500">{r.volume}</td>
                        <td className="text-center px-3 py-3 text-zinc-400">{r.van}</td>
                        <td className="text-center px-3 py-3 font-bold text-zinc-900">{r.naar}</td>
                        <td className="text-center px-3 py-3">
                          <span className={`inline-flex items-center gap-1 font-semibold ${diff.color}`}>
                            <diff.icon size={14} /> {diff.text}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Nieuwe rankings op nieuwe URLs */}
          {current.rankings.nieuw.length > 0 && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-green-600" />
                <h2 className="font-semibold text-green-800">Nieuwe URL&apos;s ranken in Google</h2>
              </div>
              {current.rankings.nieuw.map((r) => (
                <div key={r.keyword} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
                  <div>
                    <span className="font-medium text-zinc-900">{r.keyword}</span>
                    <span className="text-xs text-zinc-400 ml-2">{r.url}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full">Positie {r.positie}</span>
                </div>
              ))}
            </div>
          )}

          {/* Keywords nog op oude URL */}
          {current.rankings.nogOudeUrl.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 mb-6">
              <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                <h2 className="font-semibold text-zinc-900">Wachtend op indexering nieuwe URL</h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">{current.rankings.nogOudeUrl.length}</span>
              </div>
              <p className="px-5 py-2 text-xs text-zinc-400 bg-zinc-50 border-b border-zinc-100">
                Deze keywords ranken nog op de oude WordPress URL. Zodra Google de redirect verwerkt, neemt de nieuwe URL het over.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="text-left px-5 py-2.5 font-medium text-zinc-500">Keyword</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Volume</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Positie</th>
                    <th className="text-left px-3 py-2.5 font-medium text-zinc-500">Rankt nu op</th>
                    <th className="text-left px-3 py-2.5 font-medium text-zinc-500">Moet worden</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {current.rankings.nogOudeUrl
                    .sort((a, b) => b.volume - a.volume)
                    .map((r) => (
                    <tr key={r.keyword} className="hover:bg-zinc-50">
                      <td className="px-5 py-3 font-medium text-zinc-900">{r.keyword}</td>
                      <td className="text-center px-3 py-3">
                        <span className={`font-semibold ${r.volume >= 500 ? 'text-red-500' : r.volume >= 100 ? 'text-amber-600' : 'text-zinc-500'}`}>{r.volume}</span>
                      </td>
                      <td className="text-center px-3 py-3 font-bold text-zinc-900">#{r.positie}</td>
                      <td className="px-3 py-3 text-xs font-mono text-red-400 truncate max-w-[200px]">{r.oudeUrl}</td>
                      <td className="px-3 py-3 text-xs font-mono text-green-600 truncate max-w-[200px]">{r.nieuweUrl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span> Hoog volume (500+)
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-3"></span> Medium volume (100+)
                <span className="inline-block w-2 h-2 rounded-full bg-zinc-400 ml-3"></span> Laag volume
              </div>
            </div>
          )}

          {/* Stabiele posities */}
          {current.rankings.stabiel.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 mb-6">
              <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
                <Shield size={18} className="text-primary-500" />
                <h2 className="font-semibold text-zinc-900">Stabiele posities (behouden)</h2>
                <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">{current.rankings.stabiel.length}</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
                {current.rankings.stabiel.map((r) => (
                  <div key={r.keyword} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-zinc-700">{r.keyword}</span>
                      <span className="text-xs text-zinc-400 ml-1">({r.volume})</span>
                    </div>
                    <span className={`font-bold text-sm ${r.positie <= 3 ? 'text-green-600' : 'text-primary-500'}`}>#{r.positie}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tijdelijke dalingen */}
          {current.rankings.dalers.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 mb-6">
              <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h2 className="font-semibold text-zinc-900">Tijdelijke dalingen (verwacht bij migratie)</h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">{current.rankings.dalers.length}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="text-left px-5 py-2.5 font-medium text-zinc-500">Keyword</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Volume</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Was</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Nu</th>
                    <th className="text-center px-3 py-2.5 font-medium text-zinc-500">Daling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {current.rankings.dalers.map((r) => {
                    const diff = formatDiff(r.van, r.naar)
                    return (
                      <tr key={r.keyword} className="hover:bg-zinc-50">
                        <td className="px-5 py-3 font-medium text-zinc-900">{r.keyword}</td>
                        <td className="text-center px-3 py-3 text-zinc-500">{r.volume}</td>
                        <td className="text-center px-3 py-3 text-zinc-400">{r.van}</td>
                        <td className="text-center px-3 py-3 font-bold text-zinc-900">{r.naar}</td>
                        <td className="text-center px-3 py-3">
                          <span className={`inline-flex items-center gap-1 font-semibold ${diff.color}`}>
                            <diff.icon size={14} /> {diff.text}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-700">
                Deze dalingen zijn standaard bij een domeinmigratie. Google moet de 301 redirects verwerken en rankingkracht overdragen. Verwacht herstel: 2-4 weken.
              </div>
            </div>
          )}
        </>
      )}

      {/* Waar we op wachten */}
      <div className="bg-white rounded-xl border border-zinc-200 mb-6">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center gap-2">
          <Clock size={18} className="text-zinc-500" />
          <h2 className="font-semibold text-zinc-900">Waar we op wachten</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {[
            { label: 'Volledige URL-overname door Google', tijdlijn: '2-4 weken', voortgang: 55, toelichting: '1.241 van 2.268 pagina\'s geïndexeerd. Oude URL\'s worden vervangen door nieuwe.' },
            { label: 'Interne links verwerkt door Google', tijdlijn: '2-3 weken', voortgang: 20, toelichting: '2.200+ interne links naar categoriepagina\'s recent gedeployed. Google moet deze nog crawlen.' },
            { label: 'Core Web Vitals update in Search Console', tijdlijn: '4 weken', voortgang: 25, toelichting: 'CWV data werkt met 28-daags rolling gemiddelde. LCP verbeterd van 4s naar 1,1s.' },
            { label: '"Excel cursus" naar top 10', tijdlijn: '4-8 weken', voortgang: 10, toelichting: 'Nu positie 17. FAQ + vergelijkingstabel klaar op staging. Na verwerking interne links verwachten we stijging.' },
          ].map((item) => (
            <div key={item.label} className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-zinc-900 text-sm">{item.label}</span>
                <span className="text-xs text-zinc-400">{item.tijdlijn}</span>
              </div>
              <ProgressBar value={item.voortgang} max={100} />
              <p className="text-xs text-zinc-400 mt-1.5">{item.toelichting}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verbeteringen t.o.v. WordPress */}
      <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5">
        <h2 className="font-semibold text-zinc-900 mb-4">Verbeteringen t.o.v. WordPress</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'PageSpeed', oud: '~55', nieuw: String(current.cwv.performanceScore), eenheid: '' },
            { label: 'LCP', oud: '4.2s', nieuw: current.cwv.lcp, eenheid: '' },
            { label: 'Geïndexeerd', oud: '414', nieuw: current.indexering.geindexeerd.toLocaleString('nl-NL'), eenheid: ' pagina\'s' },
            { label: 'Security headers', oud: '0', nieuw: '7', eenheid: ' headers' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-lg p-4 border border-zinc-200 text-center">
              <p className="text-xs text-zinc-400 mb-2">{item.label}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-red-400 line-through">{item.oud}</span>
                <ArrowDown size={14} className="text-zinc-300 rotate-[-90deg]" />
                <span className="text-lg font-bold text-green-600">{item.nieuw}</span>
              </div>
              {item.eenheid && <p className="text-xs text-zinc-400">{item.eenheid}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
