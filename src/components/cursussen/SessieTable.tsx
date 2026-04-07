'use client'

import { useState } from 'react'
import { ShoppingCart, MapPin, Calendar, Clock, Check, Users, Laptop, ChevronDown, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { CursusSessie } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatDateShort, lesmethodeLabel } from '@/lib/utils'

interface SessieTableProps {
  sessies: CursusSessie[]
  cursusTitel: string
}

export default function SessieTable({ sessies, cursusTitel }: SessieTableProps) {
  const { addToCart, items } = useCart()
  const [filterLocatie, setFilterLocatie] = useState('')
  const [filterMaand, setFilterMaand] = useState('')
  const [filterMethode, setFilterMethode] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Separate thuisstudie from regular sessions
  const thuisstudieSessie = sessies.find(s => s.lesmethode === 'thuisstudie')
  const regularSessies = sessies.filter(s => s.lesmethode !== 'thuisstudie')

  const locaties = [...new Set(regularSessies.map((s) => s.locatie_stad))].sort()
  const maanden = [...new Set(regularSessies.map((s) => {
    const d = new Date(s.datum)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }))].sort()

  const gefilterdeSessies = regularSessies.filter((s) => {
    if (filterLocatie && s.locatie_stad !== filterLocatie) return false
    if (filterMethode && s.lesmethode !== filterMethode) return false
    if (filterMaand) {
      const d = new Date(s.datum)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (m !== filterMaand) return false
    }
    return true
  })

  const visibleSessies = showAll ? gefilterdeSessies : gefilterdeSessies.slice(0, 12)
  const hasMore = gefilterdeSessies.length > 12

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
      lesdagen: Array.isArray(sessie.lesdagen) && sessie.lesdagen.length > 0 ? sessie.lesdagen : [sessie.datum],
    })
  }

  const formatMaand = (m: string) => {
    const [year, month] = m.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('nl-NL', {
      month: 'long',
      year: 'numeric',
    })
  }

  const getLesdagen = (sessie: CursusSessie): string[] => {
    const raw = sessie.lesdagen
    const parsed = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    return parsed.length > 0 ? parsed : [sessie.datum]
  }

  const isOnline = (sessie: CursusSessie) => sessie.lesmethode === 'online'

  const thuisInCart = thuisstudieSessie ? isInCart(thuisstudieSessie.id) : false

  return (
    <div className="p-5 lg:p-6">
      {/* Thuisstudie card */}
      {thuisstudieSessie && (
        <div className={`relative rounded-2xl mb-6 overflow-hidden ${thuisInCart ? 'ring-2 ring-primary-400' : ''}`}>
          <div className="bg-gradient-to-r from-violet-600 via-violet-700 to-purple-800 p-5 lg:p-6 text-white relative">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="bg-white/15 p-2 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Thuisstudie</h3>
                    <p className="text-violet-200 text-sm">Leer in je eigen tempo, wanneer het jou uitkomt</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-violet-200">
                  <span className="flex items-center gap-1.5"><CheckCircle size={13} /> Start op een zelfgekozen moment</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={13} /> Lesmateriaal inbegrepen</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={13} /> Persoonlijke begeleiding</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-extrabold">{formatPrice(thuisstudieSessie.prijs)}</div>
                  <div className="text-xs text-violet-300">excl. BTW</div>
                </div>
                {thuisInCart ? (
                  <div className="w-12 h-12 rounded-xl bg-white text-violet-600 flex items-center justify-center shadow-lg">
                    <Check size={22} strokeWidth={3} />
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(thuisstudieSessie)}
                    className="flex items-center gap-2 bg-white text-violet-700 px-5 py-3 rounded-xl font-bold hover:bg-violet-50 hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    Toevoegen
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Methode toggle */}
        <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setFilterMethode('')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              !filterMethode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Alles
          </button>
          <button
            onClick={() => setFilterMethode(filterMethode === 'klassikaal' ? '' : 'klassikaal')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              filterMethode === 'klassikaal' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Users size={13} /> Klassikaal
          </button>
          <button
            onClick={() => setFilterMethode(filterMethode === 'online' ? '' : 'online')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              filterMethode === 'online' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Laptop size={13} /> Online
          </button>
        </div>

        <select
          value={filterLocatie}
          onChange={(e) => setFilterLocatie(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_8px]"
        >
          <option value="">Alle locaties</option>
          {locaties.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          value={filterMaand}
          onChange={(e) => setFilterMaand(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_8px]"
        >
          <option value="">Alle maanden</option>
          {maanden.map((m) => (
            <option key={m} value={m}>{formatMaand(m)}</option>
          ))}
        </select>

        <div className="ml-auto text-sm text-zinc-400 self-center">
          {gefilterdeSessies.length} resultaten
        </div>
      </div>

      {/* Sessie cards */}
      {gefilterdeSessies.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={32} className="text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">Geen sessies gevonden</p>
          <p className="text-zinc-400 text-sm mt-1">Pas je filters aan om meer resultaten te zien.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {visibleSessies.map((sessie, index) => {
              const inCart = isInCart(sessie.id)
              const online = isOnline(sessie)

              return (
                <div
                  key={sessie.id}
                  className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                    inCart
                      ? 'border-primary-300 bg-primary-50/50'
                      : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
                  }`}
                >
                  {/* First sessie badge */}
                  {index === 0 && !filterLocatie && !filterMaand && !filterMethode && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="bg-accent-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Eerstvolgende
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Locatie + methode */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                          online ? 'text-accent-600' : 'text-zinc-900'
                        }`}>
                          {online ? <Laptop size={14} /> : <MapPin size={14} className="text-primary-500" />}
                          {sessie.locatie_stad}
                        </span>
                        <a
                          href={`/lesmethodes#${sessie.lesmethode === 'online' ? 'live-online' : sessie.lesmethode}`}
                          onClick={(e) => e.stopPropagation()}
                          title={`Meer over ${lesmethodeLabel(sessie.lesmethode)}`}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity ${
                          online
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-primary-100 text-primary-700'
                        }`}>
                          {lesmethodeLabel(sessie.lesmethode)}
                        </a>
                      </div>

                      {/* Datum + tijd */}
                      {(() => {
                        const dagen = getLesdagen(sessie)
                        const isMultiDay = dagen.length > 1
                        return (
                          <div className="text-sm text-zinc-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                {isMultiDay ? (
                                  <span>
                                    <span className="font-medium text-zinc-700">{dagen.length} dagen</span>
                                    {' · start '}
                                    {formatDateShort(dagen[0])}
                                  </span>
                                ) : (
                                  formatDateShort(dagen[0])
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} />
                                {sessie.tijden}
                              </span>
                            </div>
                            {isMultiDay && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 ml-[17px]">
                                {dagen.map((d: string, i: number) => (
                                  <span key={i} className="inline-flex items-center bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-md font-medium">
                                    {formatDateShort(d)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>

                    {/* Prijs + actie */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-zinc-900">{formatPrice(sessie.prijs)}</div>
                        <div className="text-[11px] text-zinc-400">excl. BTW</div>
                      </div>

                      {inCart ? (
                        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
                          <Check size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(sessie)}
                          className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-95"
                          title="Toevoegen aan inschrijving"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Show more */}
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-zinc-200 text-sm font-semibold text-zinc-500 hover:border-primary-300 hover:text-primary-500 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronDown size={16} />
              Toon alle {gefilterdeSessies.length} sessies
            </button>
          )}
        </>
      )}
    </div>
  )
}
