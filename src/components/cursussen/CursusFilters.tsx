'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useCallback } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface CursusFiltersProps {
  categorieen: FilterOption[]
  locaties: FilterOption[]
}

export default function CursusFilters({ categorieen, locaties }: CursusFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [zoekterm, setZoekterm] = useState(searchParams.get('zoek') || '')

  const activeCategorie = searchParams.get('categorie') || ''
  const activeLesmethode = searchParams.get('lesmethode') || ''
  const activeLocatie = searchParams.get('locatie') || ''

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/cursussen?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('zoek', zoekterm)
  }

  const clearFilters = () => {
    setZoekterm('')
    router.push('/cursussen')
  }

  const hasFilters = activeCategorie || activeLesmethode || activeLocatie || searchParams.get('zoek')

  const lesmethodes: FilterOption[] = [
    { value: 'klassikaal', label: 'Klassikaal' },
    { value: 'online', label: 'Live Online' },
    { value: 'incompany', label: 'InCompany' },
    { value: 'thuisstudie', label: 'Thuisstudie' },
  ]

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 lg:p-6 space-y-4">
      {/* Zoekbalk */}
      <form onSubmit={handleSearch} className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          placeholder="Zoek een cursus..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </form>

      {/* Filters */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          value={activeCategorie}
          onChange={(e) => updateFilter('categorie', e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle categorieën</option>
          {categorieen.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={activeLesmethode}
          onChange={(e) => updateFilter('lesmethode', e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle lesmethodes</option>
          {lesmethodes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={activeLocatie}
          onChange={(e) => updateFilter('locatie', e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle locaties</option>
          {locaties.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actieve filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-500">Actieve filters:</span>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2 py-1 rounded-full transition-colors"
          >
            <X size={12} /> Wis alle filters
          </button>
        </div>
      )}
    </div>
  )
}
