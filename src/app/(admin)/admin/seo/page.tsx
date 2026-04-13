'use client'

import { useState, useEffect } from 'react'
import { Loader2, ChevronDown, AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

interface SeoAuditItem {
  slug: string
  titel: string
  categorie: string
  seo_title: string | null
  seo_description: string | null
  title_length: number
  desc_length: number
  title_score: 'slecht' | 'matig' | 'goed' | 'uitstekend'
  desc_score: 'slecht' | 'matig' | 'goed' | 'uitstekend'
  title_issues: string[]
  desc_issues: string[]
}

type Score = 'slecht' | 'matig' | 'goed' | 'uitstekend'

const scoreConfig: Record<Score, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  uitstekend: { label: 'Uitstekend', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  goed: { label: 'Goed', color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle },
  matig: { label: 'Matig', color: 'text-amber-700', bg: 'bg-amber-100', icon: AlertTriangle },
  slecht: { label: 'Slecht', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
}

function ScoreBadge({ score }: { score: Score }) {
  const cfg = scoreConfig[score]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <cfg.icon size={12} />
      {cfg.label}
    </span>
  )
}

function LengthBar({ length, min, max }: { length: number; min: number; max: number }) {
  const pct = Math.min((length / max) * 100, 120)
  const isGood = length >= min && length <= max
  const isTooShort = length < min
  const isTooLong = length > max

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isGood ? 'bg-green-500' : isTooShort ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${isGood ? 'text-green-600' : isTooLong ? 'text-red-600' : 'text-amber-600'}`}>
        {length}/{max}
      </span>
    </div>
  )
}

export default function SeoAuditPage() {
  const [items, setItems] = useState<SeoAuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [filterScore, setFilterScore] = useState<Score | 'alle'>('alle')

  useEffect(() => {
    adminFetch('/api/admin/seo')
      .then((r) => r.json())
      .then((d) => { setItems(d.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const counts = { uitstekend: 0, goed: 0, matig: 0, slecht: 0 }
  items.forEach((item) => {
    const worst = worstScore(item.title_score, item.desc_score)
    counts[worst]++
  })

  const filtered = filterScore === 'alle'
    ? items
    : items.filter((item) => worstScore(item.title_score, item.desc_score) === filterScore)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">SEO Audit</h1>
        <p className="text-zinc-500 text-sm">Meta titels en beschrijvingen van alle cursussen met beoordeling en verbeterpunten.</p>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(['uitstekend', 'goed', 'matig', 'slecht'] as Score[]).map((score) => {
          const cfg = scoreConfig[score]
          const isActive = filterScore === score
          return (
            <button
              key={score}
              onClick={() => setFilterScore(isActive ? 'alle' : score)}
              className={`bg-white rounded-xl border p-4 text-left transition-all ${isActive ? 'border-primary-400 ring-1 ring-primary-200' : 'border-zinc-200 hover:border-zinc-300'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <cfg.icon size={20} className={cfg.color} />
                <span className="text-2xl font-bold text-zinc-900">{counts[score]}</span>
              </div>
              <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
            </button>
          )
        })}
      </div>

      {filterScore !== 'alle' && (
        <button onClick={() => setFilterScore('alle')} className="text-sm text-primary-600 hover:underline mb-4 inline-block">
          Toon alle {items.length} cursussen
        </button>
      )}

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedSlug === item.slug
          return (
            <div key={item.slug} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <button
                onClick={() => setExpandedSlug(isExpanded ? null : item.slug)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-zinc-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-zinc-400">{item.categorie}</span>
                  </div>
                  <p className="font-semibold text-zinc-900 truncate">{item.titel}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ScoreBadge score={item.title_score} />
                  <ScoreBadge score={item.desc_score} />
                  <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-100 p-5 space-y-5">
                  {/* Title audit */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-zinc-900">Meta Titel</h3>
                      <ScoreBadge score={item.title_score} />
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-zinc-700 font-mono break-all">
                        {item.seo_title || <span className="text-zinc-400 italic">Niet ingesteld (fallback: {item.titel} Cursus | Compu Act Opleidingen)</span>}
                      </p>
                    </div>
                    <LengthBar length={item.title_length} min={30} max={60} />
                    {item.title_issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.title_issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                            <span className="text-zinc-600">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description audit */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-zinc-900">Meta Beschrijving</h3>
                      <ScoreBadge score={item.desc_score} />
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-zinc-700 break-all">
                        {item.seo_description || <span className="text-zinc-400 italic">Niet ingesteld (gebruikt korte_beschrijving als fallback)</span>}
                      </p>
                    </div>
                    <LengthBar length={item.desc_length} min={80} max={160} />
                    {item.desc_issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.desc_issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                            <span className="text-zinc-600">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Google preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Google Preview</h3>
                    <div className="bg-white border border-zinc-200 rounded-lg p-4 max-w-xl">
                      <p className="text-[#1a0dab] text-lg leading-snug truncate hover:underline cursor-pointer">
                        {item.seo_title || `${item.titel} Cursus | Compu Act Opleidingen`}
                      </p>
                      <p className="text-[#006621] text-sm mt-0.5 truncate">
                        www.computertraining.nl/cursussen/{item.slug}
                      </p>
                      <p className="text-[#545454] text-sm mt-1 line-clamp-2">
                        {item.seo_description || `Volg de ${item.titel} training bij Compu Act Opleidingen. Klassikaal of live online, op 17 locaties door heel Nederland.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function worstScore(a: Score, b: Score): Score {
  const order: Score[] = ['slecht', 'matig', 'goed', 'uitstekend']
  return order[Math.min(order.indexOf(a), order.indexOf(b))]
}
