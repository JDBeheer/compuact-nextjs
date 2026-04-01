'use client'

import { useState } from 'react'
import { ShoppingCart, MapPin, Calendar, Filter } from 'lucide-react'
import { CursusSessie } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatDate, formatDateShort, lesmethodeLabel } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface SessieTableProps {
  sessies: CursusSessie[]
  cursusTitel: string
}

export default function SessieTable({ sessies, cursusTitel }: SessieTableProps) {
  const { addToCart, items } = useCart()
  const [filterLocatie, setFilterLocatie] = useState('')
  const [filterMaand, setFilterMaand] = useState('')
  const [filterMethode, setFilterMethode] = useState('')

  const locaties = [...new Set(sessies.map((s) => s.locatie_stad))].sort()
  const maanden = [...new Set(sessies.map((s) => {
    const d = new Date(s.datum)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }))].sort()

  const gefilterdeSessies = sessies.filter((s) => {
    if (filterLocatie && s.locatie_stad !== filterLocatie) return false
    if (filterMethode && s.lesmethode !== filterMethode) return false
    if (filterMaand) {
      const d = new Date(s.datum)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (m !== filterMaand) return false
    }
    return true
  })

  const isInCart = (sessieId: string) => items.some((i) => i.sessieId === sessieId)

  const handleAdd = (sessie: CursusSessie) => {
    addToCart({
      sessieId: sessie.id,
      cursusTitel,
      locatie: sessie.locatie_stad,
      datum: sessie.datum,
      prijs: sessie.prijs,
      lesmethode: sessie.lesmethode,
      aantalDeelnemers: 1,
      lesdagen: sessie.lesdagen?.length > 0 ? sessie.lesdagen : [sessie.datum],
    })
  }

  const formatMaand = (m: string) => {
    const [year, month] = m.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('nl-NL', {
      month: 'long',
      year: 'numeric',
    })
  }

  const formatLesdagen = (sessie: CursusSessie) => {
    const dagen = sessie.lesdagen?.length > 0 ? sessie.lesdagen : [sessie.datum]
    if (dagen.length === 1) return formatDate(dagen[0])
    return dagen.map(d => formatDateShort(d)).join(', ')
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1 text-sm text-zinc-500">
          <Filter size={14} />
          Filter:
        </div>
        <select
          value={filterLocatie}
          onChange={(e) => setFilterLocatie(e.target.value)}
          className="text-sm border border-zinc-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle locaties</option>
          {locaties.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          value={filterMaand}
          onChange={(e) => setFilterMaand(e.target.value)}
          className="text-sm border border-zinc-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle maanden</option>
          {maanden.map((m) => (
            <option key={m} value={m}>{formatMaand(m)}</option>
          ))}
        </select>

        <select
          value={filterMethode}
          onChange={(e) => setFilterMethode(e.target.value)}
          className="text-sm border border-zinc-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle methodes</option>
          <option value="klassikaal">Klassikaal</option>
          <option value="online">Live Online</option>
        </select>
      </div>

      {/* Resultaat telling */}
      <p className="text-xs text-zinc-400 mb-2">{gefilterdeSessies.length} sessie{gefilterdeSessies.length !== 1 ? 's' : ''} gevonden</p>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-4 py-3 font-medium text-zinc-600">
                <span className="flex items-center gap-1"><MapPin size={14} />Locatie</span>
              </th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">
                <span className="flex items-center gap-1"><Calendar size={14} />Datum</span>
              </th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Tijden</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Methode</th>
              <th className="text-right px-4 py-3 font-medium text-zinc-600">Prijs</th>
              <th className="text-right px-4 py-3 font-medium text-zinc-600"></th>
            </tr>
          </thead>
          <tbody>
            {gefilterdeSessies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Geen sessies gevonden met de huidige filters.
                </td>
              </tr>
            ) : (
              gefilterdeSessies.map((sessie) => (
                <tr key={sessie.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{sessie.locatie_stad}</td>
                  <td className="px-4 py-3">{formatLesdagen(sessie)}</td>
                  <td className="px-4 py-3 text-zinc-600">{sessie.tijden}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      sessie.lesmethode === 'online'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}>
                      {lesmethodeLabel(sessie.lesmethode)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrice(sessie.prijs)}</td>
                  <td className="px-4 py-3 text-right">
                    {isInCart(sessie.id) ? (
                      <span className="text-xs text-primary-500 font-medium">Toegevoegd &#10003;</span>
                    ) : (
                      <Button size="sm" onClick={() => handleAdd(sessie)}>
                        <ShoppingCart size={14} className="mr-1" />
                        Toevoegen
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
