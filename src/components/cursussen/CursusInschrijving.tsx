'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Laptop, Building2, BookOpen, MapPin, Calendar, Clock, Check, Plus, ArrowRight, ChevronDown, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatDateShort, lesmethodeLabel } from '@/lib/utils'
import { CursusSessie } from '@/types'

interface Prijzen {
  klassikaal?: number
  online?: number
  thuisstudie?: number
  incompany?: number
}

interface CursusInschrijvingProps {
  sessies: CursusSessie[]
  cursusTitel: string
  prijzen?: Prijzen
}

type Methode = 'klassikaal' | 'online' | 'thuisstudie' | 'incompany'

export default function CursusInschrijving({ sessies, cursusTitel, prijzen }: CursusInschrijvingProps) {
  const { addToCart, items } = useCart()

  const thuisstudieSessie = sessies.find(s => s.lesmethode === 'thuisstudie')
  const klassikaalSessies = sessies.filter(s => s.lesmethode === 'klassikaal')
  const onlineSessies = sessies.filter(s => s.lesmethode === 'online')

  const defaultMethode: Methode | '' = klassikaalSessies.length > 0 ? 'klassikaal' : onlineSessies.length > 0 ? 'online' : ''
  const [methode, setMethode] = useState<Methode | ''>(defaultMethode)
  const [filterLocatie, setFilterLocatie] = useState('')
  const [filterMaand, setFilterMaand] = useState('')
  const [showAll, setShowAll] = useState(false)

  const hasKlassikaal = klassikaalSessies.length > 0 || !!prijzen?.klassikaal
  const hasOnline = onlineSessies.length > 0 || !!prijzen?.online
  const hasThuisstudie = !!thuisstudieSessie || !!prijzen?.thuisstudie
  const hasIncompany = !!prijzen?.incompany

  const methodes = [
    hasKlassikaal && { id: 'klassikaal' as Methode, label: 'Klassikaal', icon: Users, beschrijving: 'In een groep op locatie met docent', color: 'bg-primary-500', prijs: prijzen?.klassikaal || klassikaalSessies[0]?.prijs || 425 },
    hasOnline && { id: 'online' as Methode, label: 'Live Online', icon: Laptop, beschrijving: 'Vanuit huis of kantoor via Teams', color: 'bg-accent-500', prijs: prijzen?.online || onlineSessies[0]?.prijs || 335 },
    hasThuisstudie && { id: 'thuisstudie' as Methode, label: 'Thuisstudie', icon: BookOpen, beschrijving: 'Leer in je eigen tempo, thuis', color: 'bg-violet-600', prijs: prijzen?.thuisstudie || thuisstudieSessie?.prijs || 275 },
    hasIncompany && { id: 'incompany' as Methode, label: 'InCompany', icon: Building2, beschrijving: 'Op maat, bij jou op locatie', color: 'bg-primary-800', prijs: prijzen?.incompany || 1295 },
  ].filter(Boolean) as { id: Methode; label: string; icon: typeof Users; beschrijving: string; color: string; prijs: number }[]

  const selectedMethode = methodes.find(m => m.id === methode)

  // Sessies for current method
  const activeSessies = methode === 'klassikaal' ? klassikaalSessies : methode === 'online' ? onlineSessies : []

  const locaties = [...new Set(activeSessies.map(s => s.locatie_stad))].sort()
  const maanden = [...new Set(activeSessies.map(s => {
    const d = new Date(s.datum)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }))].sort()

  const gefilterdeSessies = activeSessies.filter(s => {
    if (filterLocatie && s.locatie_stad !== filterLocatie) return false
    if (filterMaand) {
      const d = new Date(s.datum)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (m !== filterMaand) return false
    }
    return true
  })

  const visibleSessies = showAll ? gefilterdeSessies : gefilterdeSessies.slice(0, 8)

  const isInCart = (id: string) => items.some(i => i.sessieId === id)

  const handleAddSessie = (sessie: CursusSessie) => {
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

  const handleAddThuisstudie = () => {
    if (thuisstudieSessie) {
      handleAddSessie(thuisstudieSessie)
    }
  }

  const formatMaand = (m: string) => {
    const [year, month] = m.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
  }

  const getLesdagen = (sessie: CursusSessie): string[] => {
    const raw = sessie.lesdagen
    const parsed = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    return parsed.length > 0 ? parsed : [sessie.datum]
  }

  const slug = cursusTitel.toLowerCase().replace(/\s+/g, '-')
  const thuisInCart = thuisstudieSessie ? isInCart(thuisstudieSessie.id) : false

  return (
    <div className="p-5 lg:p-6">
      {/* Stap 1: Lesmethode kiezen */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">1. Kies je lesmethode</h3>
        <div className={cn('grid gap-3', methodes.length === 4 ? 'sm:grid-cols-4' : methodes.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
          {methodes.map((m) => {
            const Icon = m.icon
            const selected = methode === m.id

            if (m.id === 'incompany') {
              return (
                <Link
                  key={m.id}
                  href={`/incompany?cursus=${slug}`}
                  className="relative p-4 rounded-xl border-2 border-zinc-200 bg-white hover:border-primary-300 hover:shadow-sm text-left transition-all duration-200 group"
                >
                  <div className={cn('p-2 rounded-lg inline-block mb-2 text-white', m.color)}>
                    <Icon size={18} />
                  </div>
                  <div className="font-bold text-sm">{m.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 mb-3">{m.beschrijving}</div>
                  <div className="text-lg font-extrabold text-zinc-900">{formatPrice(m.prijs)}</div>
                  <div className="text-[11px] text-zinc-400">excl. BTW · per dag · per persoon</div>
                  <div className="mt-3 text-xs font-semibold text-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Offerte aanvragen <ArrowRight size={12} />
                  </div>
                </Link>
              )
            }

            return (
              <button
                key={m.id}
                onClick={() => { setMethode(m.id); setFilterLocatie(''); setFilterMaand(''); setShowAll(false) }}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selected
                    ? 'border-primary-400 bg-primary-50/70 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                )}
              >
                {m.id === 'klassikaal' && (
                  <div className="absolute -top-2.5 left-4">
                    <span className="bg-accent-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Meest gekozen</span>
                  </div>
                )}
                {selected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={16} className="text-primary-500" />
                  </div>
                )}
                <div className={cn('p-2 rounded-lg inline-block mb-2 text-white', m.color)}>
                  <Icon size={18} />
                </div>
                <div className="font-bold text-sm">{m.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5 mb-3">{m.beschrijving}</div>
                <div className="text-lg font-extrabold text-zinc-900">{formatPrice(m.prijs)}</div>
                <div className="text-[11px] text-zinc-400">excl. BTW en €15 administratiekosten</div>
              </button>
            )
          })}
        </div>
        <div className="mt-3 bg-zinc-50 rounded-lg px-4 py-3 border border-zinc-100">
          <p className="text-sm text-zinc-500">
            In de volgende stap kies je voor <span className="font-medium text-zinc-700">directe inschrijving</span> of een <span className="font-medium text-zinc-700">vrijblijvende offerte</span>. Je kunt meerdere cursisten per cursus opgeven.
          </p>
        </div>
      </div>

      {/* Stap 2: Content per methode */}
      {methode === 'thuisstudie' && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">2. Toevoegen aan je aanvraag</h3>
          <div className={cn(
            'relative rounded-2xl overflow-hidden',
            thuisInCart ? 'ring-2 ring-violet-400' : ''
          )}>
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
                    <div className="text-2xl font-extrabold">{formatPrice(selectedMethode?.prijs || 275)}</div>
                    <div className="text-xs text-violet-300">excl. BTW</div>
                  </div>
                  {thuisInCart ? (
                    <div className="w-12 h-12 rounded-xl bg-white text-violet-600 flex items-center justify-center shadow-lg">
                      <Check size={22} strokeWidth={3} />
                    </div>
                  ) : (
                    <button
                      onClick={handleAddThuisstudie}
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
        </div>
      )}

      {(methode === 'klassikaal' || methode === 'online') && activeSessies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
            2. Kies je {methode === 'klassikaal' ? 'locatie en datum' : 'datum'} en voeg toe
          </h3>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {methode === 'klassikaal' && locaties.length > 1 && (
              <select
                value={filterLocatie}
                onChange={(e) => setFilterLocatie(e.target.value)}
                className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Alle locaties</option>
                {locaties.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
            {maanden.length > 1 && (
              <select
                value={filterMaand}
                onChange={(e) => setFilterMaand(e.target.value)}
                className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Alle maanden</option>
                {maanden.map(m => <option key={m} value={m}>{formatMaand(m)}</option>)}
              </select>
            )}
            <div className="ml-auto text-sm text-zinc-400 self-center">
              {gefilterdeSessies.length} {gefilterdeSessies.length === 1 ? 'sessie' : 'sessies'}
            </div>
          </div>

          {/* Sessie cards */}
          {gefilterdeSessies.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={28} className="text-zinc-300 mx-auto mb-2" />
              <p className="text-zinc-500 font-medium text-sm">Geen sessies gevonden</p>
              <p className="text-zinc-400 text-xs mt-1">Pas je filters aan om meer resultaten te zien.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {visibleSessies.map((sessie, index) => {
                  const inCart = isInCart(sessie.id)
                  const online = sessie.lesmethode === 'online'
                  const dagen = getLesdagen(sessie)
                  const isMultiDay = dagen.length > 1

                  return (
                    <div
                      key={sessie.id}
                      className={cn(
                        'relative rounded-xl border-2 p-4 transition-all duration-200',
                        inCart
                          ? 'border-primary-300 bg-primary-50/50'
                          : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
                      )}
                    >
                      {index === 0 && !filterLocatie && !filterMaand && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="bg-accent-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Eerstvolgende
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', online ? 'text-accent-600' : 'text-zinc-900')}>
                              {online ? <Laptop size={14} /> : <MapPin size={14} className="text-primary-500" />}
                              {sessie.locatie_stad}
                            </span>
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', online ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700')}>
                              {lesmethodeLabel(sessie.lesmethode)}
                            </span>
                          </div>

                          <div className="text-sm text-zinc-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                {isMultiDay ? (
                                  <span>
                                    <span className="font-medium text-zinc-700">{dagen.length} dagen</span>
                                    {' · start '}{formatDateShort(dagen[0])}
                                  </span>
                                ) : formatDateShort(dagen[0])}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} />{sessie.tijden}
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
                        </div>

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
                              onClick={() => handleAddSessie(sessie)}
                              className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-95"
                              title="Toevoegen"
                            >
                              <Plus size={18} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {gefilterdeSessies.length > 8 && !showAll && (
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
      )}

      {/* Fallback: methode gekozen maar geen sessies (open inschrijving) */}
      {(methode === 'klassikaal' || methode === 'online') && activeSessies.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
            2. Inschrijven
          </h3>
          <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-zinc-700 mb-1">
                  {methode === 'klassikaal' ? 'Klassikale training' : 'Live Online training'}
                </div>
                <div className="text-sm text-zinc-500">
                  Exacte datum en {methode === 'klassikaal' ? 'locatie' : 'tijdstip'} in overleg met onze planning
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-zinc-900">{formatPrice(selectedMethode?.prijs || 0)}</div>
                  <div className="text-[11px] text-zinc-400">excl. BTW</div>
                </div>
                <a
                  href="tel:023-5513409"
                  className="flex items-center gap-2 bg-primary-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition-all"
                >
                  Bel ons
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {!methode && (
        <div className="text-center py-4 text-sm text-zinc-400">
          <ArrowRight size={14} className="inline mr-1 rotate-[-90deg]" />
          Kies hierboven een lesmethode om de beschikbare data te zien en je in te schrijven
        </div>
      )}
    </div>
  )
}
