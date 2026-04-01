'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Calendar, Clock, ArrowRight, Navigation } from 'lucide-react'
import { locaties } from '@/data/locaties'
import { getPostcodeCoords, haversineDistance } from '@/data/postcode-coords'
import { cn } from '@/lib/utils'

interface Sessie {
  datum: string
  locatie_stad: string
  prijs: number
  tijden: string
  lesmethode: string
  cursus_titel?: string
  cursus_slug?: string
}

interface PostcodeZoekerProps {
  sessies?: Sessie[]
  cursusTitel?: string
  cursusSlug?: string
  compact?: boolean
}

interface NearbyLocatie {
  slug: string
  naam: string
  adres: string
  postcode: string
  afstand: number
  sessies: Sessie[]
}

export default function PostcodeZoeker({ sessies = [], cursusTitel, cursusSlug, compact = false }: PostcodeZoekerProps) {
  const [postcode, setPostcode] = useState('')
  const [results, setResults] = useState<NearbyLocatie[] | null>(null)
  const [error, setError] = useState('')

  const handleSearch = () => {
    const clean = postcode.replace(/\s/g, '')
    if (clean.length < 4) {
      setError('Voer minimaal 4 cijfers van je postcode in.')
      setResults(null)
      return
    }

    const coords = getPostcodeCoords(clean)
    if (!coords) {
      setError('Postcode niet herkend. Probeer de eerste 4 cijfers.')
      setResults(null)
      return
    }

    setError('')

    // Calculate distances
    const withDistance = locaties
      .filter(l => l.slug !== 'limburg') // Limburg uses Eindhoven location
      .map(loc => {
        const afstand = haversineDistance(coords[0], coords[1], loc.lat, loc.lng)
        const locSessies = sessies.filter(s => {
          const stad = s.locatie_stad?.toLowerCase().replace(/['\s]+/g, '-')
          return stad === loc.slug || stad === loc.naam.toLowerCase()
        })
        return {
          slug: loc.slug,
          naam: loc.naam,
          adres: loc.adres,
          postcode: loc.postcode,
          afstand: Math.round(afstand),
          sessies: locSessies.slice(0, 3),
        }
      })
      .sort((a, b) => a.afstand - b.afstand)
      .slice(0, 5)

    setResults(withDistance)
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className={cn(compact ? '' : 'bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8')}>
      {!compact && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Dichtsbijzijnde locatie vinden</h2>
          <p className="text-sm text-zinc-500 mt-1">Voer je postcode in en ontdek welke cursuslocatie het dichtst bij jou is.</p>
        </div>
      )}

      {/* Search input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value)
              if (results) setResults(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Jouw postcode (bijv. 2011)"
            maxLength={7}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-600 transition-all active:scale-[0.98] flex items-center gap-2 shrink-0"
        >
          <Search size={15} />
          Zoek
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* Results */}
      {results && (
        <div className="mt-4 space-y-3">
          {results.map((loc, index) => (
            <div
              key={loc.slug}
              className={cn(
                'rounded-xl border p-4 transition-all',
                index === 0 ? 'border-primary-200 bg-primary-50/50' : 'border-zinc-100 bg-white'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className={index === 0 ? 'text-primary-500' : 'text-zinc-400'} />
                    <Link href={`/locaties/${loc.slug}`} className="font-bold text-sm text-zinc-900 hover:text-primary-600 transition-colors">
                      {loc.naam}
                    </Link>
                    {index === 0 && (
                      <span className="text-[10px] font-bold bg-primary-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Dichtstbij
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{loc.adres}, {loc.postcode} {loc.naam}</p>

                  {/* Upcoming sessions for this location */}
                  {loc.sessies.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {loc.sessies.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(s.datum)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {s.tijden}
                          </span>
                          {s.cursus_titel && !cursusTitel && (
                            <span className="text-zinc-400 truncate">{s.cursus_titel}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-zinc-900">{loc.afstand} km</div>
                  <Link
                    href={cursusTitel ? `/cursussen/${cursusSlug || ''}` : `/locaties/${loc.slug}`}
                    className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-1 justify-end"
                  >
                    Bekijk <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
