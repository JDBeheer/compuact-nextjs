'use client'

import { useState } from 'react'
import { Search, Check, X } from 'lucide-react'

interface CursusOption {
  id: string
  titel: string
  categorie: string
  niveau: string
  duur: string
  prijs_vanaf: number
}

interface InCompanyCursusSelectorProps {
  cursussen: CursusOption[]
  selected: string[]
  onSelectionChange: (ids: string[], titels: string[]) => void
}

export default function InCompanyCursusSelector({
  cursussen,
  selected,
  onSelectionChange,
}: InCompanyCursusSelectorProps) {
  const [search, setSearch] = useState('')

  const grouped = cursussen.reduce<Record<string, CursusOption[]>>((acc, c) => {
    if (!acc[c.categorie]) acc[c.categorie] = []
    acc[c.categorie].push(c)
    return acc
  }, {})

  const filtered = search
    ? cursussen.filter(c => c.titel.toLowerCase().includes(search.toLowerCase()))
    : null

  const selectedCursussen = cursussen.filter(c => selected.includes(c.id))

  const toggleCursus = (id: string) => {
    if (selected.includes(id)) {
      const newIds = selected.filter(s => s !== id)
      const newTitels = cursussen.filter(c => newIds.includes(c.id)).map(c => c.titel)
      onSelectionChange(newIds, newTitels)
    } else {
      const newIds = [...selected, id]
      const newTitels = cursussen.filter(c => newIds.includes(c.id)).map(c => c.titel)
      onSelectionChange(newIds, newTitels)
    }
  }

  const renderCursus = (c: CursusOption) => {
    const isSelected = selected.includes(c.id)
    return (
      <button
        key={c.id}
        type="button"
        onClick={() => toggleCursus(c.id)}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-primary-500 bg-primary-50'
            : 'border-zinc-200 hover:border-zinc-300 bg-white'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium text-sm">{c.titel}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{c.duur} &middot; {c.niveau}</div>
          </div>
          {isSelected && (
            <div className="bg-primary-500 text-white rounded-full p-0.5 shrink-0">
              <Check size={12} />
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <div>
      {/* Geselecteerde cursussen als tags bovenaan */}
      {selectedCursussen.length > 0 && (
        <div className="mb-4 p-3 bg-primary-50 rounded-xl border border-primary-200">
          <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">
            {selectedCursussen.length} cursus{selectedCursussen.length > 1 ? 'sen' : ''} geselecteerd
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCursussen.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCursus(c.id)}
                className="inline-flex items-center gap-1.5 bg-white border border-primary-300 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                {c.titel}
                <X size={13} className="text-primary-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoekbalk */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek een cursus..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Cursus list */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {filtered ? (
          <div className="grid gap-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">Geen cursussen gevonden</p>
            ) : (
              filtered.map(renderCursus)
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{cat}</h3>
              <div className="grid gap-1.5">
                {items.map(renderCursus)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
