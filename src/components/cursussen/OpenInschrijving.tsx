'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Laptop, Building2, MapPin, Calendar, CheckCircle, Check, ShoppingCart, ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

const METHODES = [
  { id: 'klassikaal', label: 'Klassikaal', icon: Users, beschrijving: 'In een groep op locatie met docent', color: 'bg-primary-500', prijs: 795 },
  { id: 'online', label: 'Live Online', icon: Laptop, beschrijving: 'Vanuit huis of kantoor via Teams', color: 'bg-accent-500', prijs: 699 },
  { id: 'incompany', label: 'InCompany', icon: Building2, beschrijving: 'Op maat, bij jou op locatie', color: 'bg-primary-800', prijs: 1295 },
]

const LOCATIES = [
  'Alkmaar', 'Amsterdam', 'Den Bosch', 'Den Haag', 'Eindhoven',
  'Haarlem', 'Hoorn', 'Leeuwarden', 'Leiden', 'Limburg',
  'Rotterdam', 'Utrecht', 'Zaandam', 'Zwolle',
]

const MAANDEN = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
]

interface OpenInschrijvingProps {
  cursusTitel: string
}

export default function OpenInschrijving({ cursusTitel }: OpenInschrijvingProps) {
  const { addToCart, items } = useCart()
  const [methode, setMethode] = useState('')
  const [locatie, setLocatie] = useState('')
  const [maand, setMaand] = useState('')
  const [showLocaties, setShowLocaties] = useState(false)
  const [showMaanden, setShowMaanden] = useState(false)

  const selectedMethode = METHODES.find(m => m.id === methode)

  const makeCartId = () => `open-${cursusTitel}-${methode}-${locatie || 'online'}-${maand}`.toLowerCase().replace(/\s+/g, '-')

  const isInCart = () => {
    if (!methode || !maand) return false
    if (methode === 'klassikaal' && !locatie) return false
    const id = makeCartId()
    return items.some(i => i.sessieId === id)
  }

  const canAdd = () => {
    if (!methode || !maand) return false
    if (methode === 'klassikaal' && !locatie) return false
    return true
  }

  const handleAdd = () => {
    if (!canAdd() || !selectedMethode) return
    addToCart({
      sessieId: makeCartId(),
      cursusTitel,
      locatie: methode === 'online' ? 'Live Online' : methode === 'incompany' ? 'InCompany' : locatie,
      datum: `${maand} (in overleg)`,
      prijs: selectedMethode.prijs,
      lesmethode: methode,
      aantalDeelnemers: 1,
    })
  }

  const inCart = isInCart()

  return (
    <div className="p-5 lg:p-6">
      {/* Stap 1: Methode kiezen */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">1. Kies je lesmethode</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {METHODES.map((m) => {
            const Icon = m.icon
            const selected = methode === m.id

            // InCompany links to incompany page with cursus preselected
            if (m.id === 'incompany') {
              const slug = cursusTitel.toLowerCase().replace(/\s+/g, '-')
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
                onClick={() => { setMethode(m.id); setLocatie(''); setShowLocaties(false); setShowMaanden(false) }}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selected
                    ? 'border-primary-400 bg-primary-50/70 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                )}
              >
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
                <div className="text-[11px] text-zinc-400">excl. BTW</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stap 2: Locatie (alleen klassikaal) */}
      {methode === 'klassikaal' && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">2. Kies je locatie</h3>
          <button
            onClick={() => setShowLocaties(!showLocaties)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all',
              locatie ? 'border-primary-400 bg-primary-50/70 text-primary-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
            )}
          >
            <span className="flex items-center gap-2">
              <MapPin size={15} className={locatie ? 'text-primary-500' : 'text-zinc-400'} />
              {locatie || 'Selecteer een locatie...'}
            </span>
            <ChevronDown size={15} className={cn('transition-transform', showLocaties && 'rotate-180')} />
          </button>
          {showLocaties && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 mt-2 bg-zinc-50 rounded-xl p-3 border border-zinc-200">
              {LOCATIES.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setLocatie(loc); setShowLocaties(false) }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all',
                    locatie === loc
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'text-zinc-600 hover:bg-white hover:shadow-sm'
                  )}
                >
                  <MapPin size={12} />
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stap 3: Maand */}
      {methode && (methode !== 'klassikaal' || locatie) && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
            {methode === 'klassikaal' ? '3' : '2'}. Gewenste startmaand
          </h3>
          <button
            onClick={() => setShowMaanden(!showMaanden)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all',
              maand ? 'border-primary-400 bg-primary-50/70 text-primary-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
            )}
          >
            <span className="flex items-center gap-2">
              <Calendar size={15} className={maand ? 'text-primary-500' : 'text-zinc-400'} />
              {maand || 'Selecteer een maand...'}
            </span>
            <ChevronDown size={15} className={cn('transition-transform', showMaanden && 'rotate-180')} />
          </button>
          {showMaanden && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mt-2 bg-zinc-50 rounded-xl p-3 border border-zinc-200">
              {MAANDEN.map((m) => (
                <button
                  key={m}
                  onClick={() => { setMaand(m); setShowMaanden(false) }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all text-center',
                    maand === m
                      ? 'bg-primary-500 text-white'
                      : 'text-zinc-600 hover:bg-white hover:shadow-sm'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Samenvatting + toevoegen */}
      {canAdd() && selectedMethode && (
        <div className={cn(
          'rounded-xl border-2 p-5 transition-all duration-200',
          inCart ? 'border-primary-300 bg-primary-50/50' : 'border-zinc-200 bg-zinc-50'
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                <span className="font-medium text-zinc-700">{selectedMethode.label}</span>
                {methode === 'klassikaal' && (
                  <>
                    <span className="text-zinc-300">&middot;</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {locatie}</span>
                  </>
                )}
                <span className="text-zinc-300">&middot;</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {maand}</span>
              </div>
              <div className="text-xs text-zinc-400">Exacte datum in overleg met onze planning</div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xl font-extrabold text-zinc-900">{formatPrice(selectedMethode.prijs)}</div>
                <div className="text-[11px] text-zinc-400">excl. BTW</div>
              </div>

              {inCart ? (
                <div className="w-11 h-11 rounded-xl bg-primary-500 text-white flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-primary-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart size={16} />
                  Toevoegen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hint als nog niks gekozen */}
      {!methode && (
        <div className="text-center py-4 text-sm text-zinc-400">
          <ArrowRight size={14} className="inline mr-1 rotate-[-90deg]" />
          Kies hierboven een lesmethode om de prijs te zien en in te schrijven
        </div>
      )}
    </div>
  )
}
