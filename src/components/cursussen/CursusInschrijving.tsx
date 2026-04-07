'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Users, Laptop, Building2, BookOpen, MapPin, Calendar, Clock, Check, Plus, ArrowRight, ChevronDown, CheckCircle, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { CursusSessie, CartItem } from '@/types'
import { locaties as allLocaties } from '@/data/locaties'
import LocatiePopover from '@/components/cursussen/LocatiePopover'
import { getPostcodeCoords, haversineDistance } from '@/data/postcode-coords'

interface Prijzen {
  klassikaal?: number
  online?: number
  thuisstudie?: number
  incompany?: number
}

interface Studielast {
  klassikaal?: string
  live_online?: string
  thuisstudie?: string
}

interface CursusInschrijvingProps {
  sessies: CursusSessie[]
  cursusTitel: string
  prijzen?: Prijzen
  studielast?: Studielast
}

type Methode = 'klassikaal' | 'online' | 'thuisstudie' | 'incompany'

export default function CursusInschrijving({ sessies, cursusTitel, prijzen, studielast }: CursusInschrijvingProps) {
  const { addToCart, items } = useCart()

  const thuisstudieSessie = sessies.find(s => s.lesmethode === 'thuisstudie')
  const klassikaalSessies = sessies.filter(s => s.lesmethode === 'klassikaal')
  const onlineSessies = sessies.filter(s => s.lesmethode === 'online')

  const defaultMethode: Methode | '' = klassikaalSessies.length > 0 ? 'klassikaal' : onlineSessies.length > 0 ? 'online' : ''
  const [methode, setMethode] = useState<Methode | ''>(defaultMethode)
  const [filterLocatie, setFilterLocatie] = useState('')
  const [filterMaand, setFilterMaand] = useState('')
  const [postcode, setPostcode] = useState('')
  const [postcodeCoords, setPostcodeCoords] = useState<[number, number] | null>(null)
  const [showAll, setShowAll] = useState(false)
  const stap2Ref = useRef<HTMLDivElement>(null)

  const scrollToStap2 = () => {
    setTimeout(() => {
      stap2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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

  // Calculate distance per location when postcode is set
  const afstandPerStad = new Map<string, number>()
  if (postcodeCoords) {
    for (const loc of allLocaties) {
      const dist = haversineDistance(postcodeCoords[0], postcodeCoords[1], loc.lat, loc.lng)
      afstandPerStad.set(loc.naam, Math.round(dist))
      // Also map common variations
      afstandPerStad.set(loc.naam.toLowerCase(), Math.round(dist))
    }
  }

  const getAfstand = (stad: string): number | undefined => {
    return afstandPerStad.get(stad) ?? afstandPerStad.get(stad.toLowerCase())
  }

  const handlePostcodeChange = (value: string) => {
    setPostcode(value)
    const clean = value.replace(/\s/g, '')
    if (clean.length >= 4) {
      const coords = getPostcodeCoords(clean)
      setPostcodeCoords(coords)
      if (coords) setFilterLocatie('') // Reset locatiefilter bij postcode
    } else {
      setPostcodeCoords(null)
    }
  }

  const gefilterdeSessies = activeSessies
    .filter(s => {
      if (filterLocatie && s.locatie_stad !== filterLocatie) return false
      if (filterMaand) {
        const d = new Date(s.datum)
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (m !== filterMaand) return false
      }
      return true
    })
    .sort((a, b) => {
      // Sort by distance when postcode is entered
      if (postcodeCoords && !filterLocatie) {
        const distA = getAfstand(a.locatie_stad) ?? 999
        const distB = getAfstand(b.locatie_stad) ?? 999
        if (distA !== distB) return distA - distB
      }
      // Then by date
      return new Date(a.datum).getTime() - new Date(b.datum).getTime()
    })

  const visibleSessies = showAll ? gefilterdeSessies : gefilterdeSessies.slice(0, 16)

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
    <div className="p-4 sm:p-5 lg:p-6">
      {/* Stap 1: Lesmethode kiezen */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">1. Kies je lesmethode</h3>
        <div className={cn('grid grid-cols-2 gap-2 sm:gap-3', methodes.length === 4 ? 'lg:grid-cols-4' : methodes.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>
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
                  <div className="text-[11px] text-zinc-400">excl. BTW · per dag</div>
                  <div className="mt-3 text-xs font-semibold text-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Offerte aanvragen <ArrowRight size={12} />
                  </div>
                </Link>
              )
            }

            return (
              <button
                key={m.id}
                onClick={() => { setMethode(m.id); setFilterLocatie(''); setFilterMaand(''); setShowAll(false); scrollToStap2() }}
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
            Prijzen zijn per persoon. Bij het afronden kies je voor <span className="font-medium text-zinc-700">directe inschrijving</span> of een <span className="font-medium text-zinc-700">vrijblijvende offerte</span>, en geef je per cursus het <span className="font-medium text-zinc-700">aantal deelnemers</span> op.
          </p>
        </div>
      </div>

      {/* Stap 2: Content per methode */}
      <div ref={stap2Ref} />
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
          <div className="grid grid-cols-2 gap-2 mb-4 sm:flex sm:items-center">
            {methode === 'klassikaal' && (
              <div className="relative col-span-2 sm:col-auto sm:w-40">
                <Navigation size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => handlePostcodeChange(e.target.value)}
                  placeholder="Jouw postcode"
                  maxLength={7}
                  className={cn(
                    'text-sm border rounded-lg pl-9 pr-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-500',
                    postcodeCoords ? 'border-primary-300 bg-primary-50/50' : 'border-zinc-200'
                  )}
                />
              </div>
            )}
            {methode === 'klassikaal' && locaties.length > 1 && !postcodeCoords && (
              <select
                value={filterLocatie}
                onChange={(e) => setFilterLocatie(e.target.value)}
                className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-44"
              >
                <option value="">Alle locaties</option>
                {locaties.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
            <select
              value={filterMaand}
              onChange={(e) => setFilterMaand(e.target.value)}
              className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-44"
            >
              <option value="">Alle maanden</option>
              {maanden.map(m => <option key={m} value={m}>{formatMaand(m)}</option>)}
            </select>
            <span className="text-xs text-zinc-400 text-right sm:ml-auto whitespace-nowrap">
              {gefilterdeSessies.length} sessies
            </span>
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
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {visibleSessies.map((sessie, index) => {
                  const inCart = isInCart(sessie.id)
                  const online = sessie.lesmethode === 'online'
                  const dagen = getLesdagen(sessie)
                  const isMultiDay = dagen.length > 1

                  return (
                    <div
                      key={sessie.id}
                      className={cn(
                        'relative rounded-xl border-2 p-3 sm:p-4 transition-all duration-200',
                        inCart
                          ? 'border-primary-300 bg-primary-50/50'
                          : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md'
                      )}
                    >
                      {index === 0 && !filterLocatie && !filterMaand && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="bg-accent-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {postcodeCoords ? 'Dichtstbij' : 'Eerstvolgende'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {online ? (
                              <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                                <Laptop size={13} />
                                {sessie.locatie_stad}
                              </span>
                            ) : (
                              <LocatiePopover stad={sessie.locatie_stad}>
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 underline decoration-dotted underline-offset-2 decoration-zinc-300">
                                  <MapPin size={13} className="text-primary-500" />
                                  {sessie.locatie_stad}
                                </span>
                              </LocatiePopover>
                            )}
                            {postcodeCoords && !online && getAfstand(sessie.locatie_stad) !== undefined && (
                              <span className="text-[10px] font-medium text-zinc-400">
                                {getAfstand(sessie.locatie_stad)} km
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {isMultiDay ? (
                                <span>{dagen.length} dagen · {formatDateShort(dagen[0])}</span>
                              ) : formatDateShort(dagen[0])}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />{sessie.tijden}
                            </span>
                          </div>
                          {isMultiDay && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {dagen.map((d: string, i: number) => (
                                <span key={i} className="bg-zinc-100 text-zinc-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                  {formatDateShort(d)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div className="text-base font-bold text-zinc-900">{formatPrice(sessie.prijs)}</div>
                          </div>
                          {inCart ? (
                            <div className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center">
                              <Check size={16} strokeWidth={3} />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddSessie(sessie)}
                              className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-all active:scale-95"
                              title="Toevoegen"
                            >
                              <Plus size={16} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {gefilterdeSessies.length > 16 && !showAll && (
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
        <OpenInschrijving
          methode={methode}
          prijs={selectedMethode?.prijs || 0}
          cursusTitel={cursusTitel}
          addToCart={addToCart}
          items={items}
        />
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

// ── Open inschrijving (geen vaste sessies) ──

const OPEN_LOCATIES = [
  'Thuis / Online', 'Alkmaar', 'Almere', 'Amersfoort', 'Amsterdam',
  'Den Bosch', 'Den Haag', 'Eindhoven', 'Haarlem', 'Hoorn',
  'Leeuwarden', 'Leiden', 'Limburg', 'Nijmegen', 'Rotterdam',
  'Utrecht', 'Zaandam', 'Zwolle',
]

function getKomendeMaanden(): { value: string; label: string }[] {
  const maanden = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    maanden.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
    })
  }
  return maanden
}


function OpenInschrijving({ methode, prijs, cursusTitel, addToCart, items }: {
  methode: 'klassikaal' | 'online'
  prijs: number
  cursusTitel: string
  addToCart: (item: CartItem) => void
  items: CartItem[]
}) {
  const [gewensteMaand, setGewensteMaand] = useState('')
  const [geselecteerdeLocaties, setGeselecteerdeLocaties] = useState<string[]>([])

  const maanden = getKomendeMaanden()

  const toggleLocatie = (loc: string) => {
    setGeselecteerdeLocaties(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  // Genereer een uniek ID op basis van cursus + methode + voorkeuren
  const openId = `open-${cursusTitel}-${methode}-${gewensteMaand}-${geselecteerdeLocaties.sort().join(',')}`
  const alInCart = items.some(i => i.sessieId === openId)

  const kanToevoegen = gewensteMaand && (methode === 'online' || geselecteerdeLocaties.length > 0)

  const handleToevoegen = () => {
    if (!kanToevoegen) return
    const locatieLabel = methode === 'online'
      ? 'Live Online'
      : geselecteerdeLocaties.join(', ')

    const maandLabel = maanden.find(m => m.value === gewensteMaand)?.label || gewensteMaand

    addToCart({
      sessieId: openId,
      cursusTitel,
      locatie: locatieLabel,
      datum: `Voorkeur: ${maandLabel}`,
      prijs,
      lesmethode: methode,
      aantalDeelnemers: 1,
    })
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
        2. Kies je voorkeuren
      </h3>
      <div className="rounded-xl border-2 border-zinc-200 bg-white p-5 space-y-5">
        <p className="text-sm text-zinc-600">
          Geef je voorkeuren op voor de <strong>{cursusTitel}</strong>. Wij nemen contact met je op met passende cursusdatums.
        </p>

        {/* Maand selectie */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            In welke maand wil je de cursus volgen?
          </label>
          <select
            value={gewensteMaand}
            onChange={e => setGewensteMaand(e.target.value)}
            className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Kies een maand</option>
            {maanden.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Locatie selectie (alleen bij klassikaal) */}
        {methode === 'klassikaal' && (
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              Welke cursuslocatie heeft jouw voorkeur?
            </label>
            <p className="text-xs text-zinc-400 mb-2">Je kunt meerdere opties aanvinken</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {OPEN_LOCATIES.map(loc => (
                <label
                  key={loc}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all',
                    geselecteerdeLocaties.includes(loc)
                      ? 'border-primary-400 bg-primary-50 text-primary-700 font-medium'
                      : 'border-zinc-100 hover:border-zinc-200 text-zinc-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={geselecteerdeLocaties.includes(loc)}
                    onChange={() => toggleLocatie(loc)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                    geselecteerdeLocaties.includes(loc) ? 'border-primary-500 bg-primary-500' : 'border-zinc-300'
                  )}>
                    {geselecteerdeLocaties.includes(loc) && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  {loc}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Toevoegen */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div>
            <div className="text-xl font-extrabold text-zinc-900">{formatPrice(prijs)}</div>
            <div className="text-[11px] text-zinc-400">excl. BTW en €15 administratiekosten</div>
          </div>
          {alInCart ? (
            <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm">
              <CheckCircle size={18} />
              Toegevoegd
            </div>
          ) : (
            <button
              onClick={handleToevoegen}
              disabled={!kanToevoegen}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all',
                kanToevoegen
                  ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-[0.98]'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              )}
            >
              Toevoegen
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
