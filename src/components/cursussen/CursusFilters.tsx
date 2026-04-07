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

export default function CursusFilters({ categorieen }: CursusFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [zoekterm, setZoekterm] = useState(searchParams.get('zoek') || '')

  const activeCategorie = searchParams.get('categorie') || ''
  const activeNiveau = searchParams.get('niveau') || ''

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

  const hasFilters = activeCategorie || searchParams.get('zoek')

  return (
    <div className="space-y-4">
      {/* Zoekbalk */}
      <form onSubmit={handleSearch} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          placeholder="Zoek een cursus..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
        />
      </form>

      {/* Categorie chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter('categorie', '')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategorie
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          Alle
        </button>
        {categorieen.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilter('categorie', cat.value === activeCategorie ? '' : cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              cat.value === activeCategorie
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {cat.label}
          </button>
        ))}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <X size={14} /> Wis filters
          </button>
        )}
      </div>
    </div>
  )
}
