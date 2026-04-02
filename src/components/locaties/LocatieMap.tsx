'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

interface MapLocatie {
  slug: string
  naam: string
  adres: string
  postcode: string
  lat: number
  lng: number
}

const NL = { minLat: 50.70, maxLat: 53.60, minLng: 3.20, maxLng: 7.30 }
const W = 380
const H = 520

function toXY(lat: number, lng: number) {
  return {
    x: ((lng - NL.minLng) / (NL.maxLng - NL.minLng)) * W,
    y: ((NL.maxLat - lat) / (NL.maxLat - NL.minLat)) * H,
  }
}

function makePath(coords: [number, number][]): string {
  return 'M' + coords.map(([lat, lng]) => {
    const { x, y } = toXY(lat, lng)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' L') + ' Z'
}

// Netherlands mainland outline — hand-verified points following the real border
const NL_MAINLAND = makePath([
  // Start at Limburg south tip, go clockwise
  // == SOUTH: Limburg ==
  [50.76, 5.99], [50.76, 5.87], [50.83, 5.65], [50.91, 5.76],
  [50.99, 5.77], [51.04, 5.60],
  // == SOUTH: Brabant border with Belgium ==
  [51.22, 5.61], [51.27, 5.79], [51.27, 5.59], [51.37, 5.47],
  [51.39, 5.19], [51.45, 4.93], [51.42, 4.63], [51.36, 4.39],
  [51.35, 4.17], [51.28, 3.83],
  // == SOUTHWEST: Zeeland ==
  [51.34, 3.59], [51.38, 3.45], [51.46, 3.44], [51.51, 3.55],
  [51.53, 3.60], [51.58, 3.63],
  // == WEST: South Holland coast ==
  [51.67, 3.83], [51.79, 3.97], [51.87, 4.03], [51.92, 4.02],
  [51.97, 4.10], [52.05, 4.15],
  // == WEST: Hook / Den Haag / Leiden ==
  [52.10, 4.19], [52.17, 4.28], [52.27, 4.42],
  // == WEST: North Holland coast ==
  [52.37, 4.52], [52.47, 4.55], [52.57, 4.56], [52.63, 4.57],
  [52.73, 4.63], [52.83, 4.70],
  // == NORTH: Den Helder / Wadden ==
  [52.93, 4.76], [53.00, 4.80], [53.07, 4.84], [53.17, 4.87],
  [53.24, 4.90], [53.33, 4.94],
  // == NORTH: Friesland Wadden coast ==
  [53.41, 5.05], [53.41, 5.45], [53.36, 5.60], [53.37, 5.91],
  [53.40, 6.15], [53.44, 6.30], [53.49, 6.62],
  // == NORTH: Groningen ==
  [53.47, 6.83], [53.46, 7.04], [53.33, 7.09],
  // == EAST: Groningen / Drenthe border ==
  [53.24, 7.09], [53.12, 7.05], [53.00, 7.00],
  // == EAST: Overijssel ==
  [52.87, 7.04], [52.81, 7.07], [52.65, 7.05],
  [52.48, 6.97], [52.39, 6.90],
  // == EAST: Gelderland ==
  [52.25, 6.98], [52.10, 6.87], [52.00, 6.74],
  // == EAST: Limburg north ==
  [51.90, 6.38], [51.85, 6.17], [51.84, 6.00],
  // == SOUTHEAST: Limburg ==
  [51.75, 5.97], [51.68, 6.01], [51.49, 6.07],
  [51.44, 6.08], [51.36, 6.12], [51.27, 5.96],
  // == Limburg south loop ==
  [51.18, 5.85], [51.05, 5.84], [50.95, 5.78],
  [50.88, 5.88], [50.83, 5.99], [50.76, 5.99],
])

// IJsselmeer / Markermeer water body
const IJSSELMEER = makePath([
  [53.00, 5.12], [52.93, 5.22], [52.83, 5.23], [52.73, 5.20],
  [52.63, 5.15], [52.55, 5.12], [52.48, 5.10],
  [52.42, 5.18], [52.38, 5.25], [52.40, 5.35],
  [52.48, 5.45], [52.57, 5.52], [52.67, 5.55],
  [52.77, 5.48], [52.87, 5.38], [52.95, 5.22], [53.00, 5.12],
])

export default function LocatieMap({ locaties }: { locaties: MapLocatie[] }) {
  const [active, setActive] = useState<string | null>(null)
  const activeLocatie = locaties.find(l => l.slug === active)

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-zinc-100">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <MapPin size={18} className="text-primary-500" />
          Onze locaties op de kaart
        </h2>
        <p className="text-sm text-zinc-500 mt-1">Klik op een locatie voor meer informatie</p>
      </div>

      <div className="relative flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-blue-50/40 to-white min-h-[400px] lg:min-h-[540px]">
          <svg viewBox={`-15 -15 ${W + 30} ${H + 30}`} className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] h-auto">
            {/* Sea background */}
            <rect x="-15" y="-15" width={W + 30} height={H + 30} fill="#f0f7ff" rx="8" />

            {/* Land mass */}
            <path d={NL_MAINLAND} fill="#e2eedb" stroke="#b8cfa8" strokeWidth="1.5" strokeLinejoin="round" />

            {/* IJsselmeer water */}
            <path d={IJSSELMEER} fill="#d6e8f5" stroke="#bdd5ea" strokeWidth="0.8" />

            {/* Grid dots for texture */}
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.4" fill="#b8cfa8" opacity="0.5" />
            </pattern>
            <path d={NL_MAINLAND} fill="url(#dots)" />

            {/* Location markers */}
            {locaties.map((loc) => {
              const { x, y } = toXY(loc.lat, loc.lng)
              const isActive = active === loc.slug

              return (
                <g key={loc.slug} className="cursor-pointer" onClick={() => setActive(loc.slug)} onMouseEnter={() => setActive(loc.slug)}>
                  {isActive && (
                    <>
                      <circle cx={x} cy={y} r="15" fill="#1B6AB3" opacity="0.06" />
                      <circle cx={x} cy={y} r="10" fill="#1B6AB3" opacity="0.10" />
                    </>
                  )}

                  <circle cx={x} cy={y + 1} r={isActive ? 6.5 : 4.5} fill="black" opacity="0.06" />
                  <circle
                    cx={x} cy={y}
                    r={isActive ? 6.5 : 4.5}
                    fill={isActive ? '#1B6AB3' : '#F49800'}
                    stroke="white" strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && <circle cx={x} cy={y} r="2" fill="white" />}

                  {isActive && (
                    <g>
                      <rect
                        x={x - loc.naam.length * 3.2 - 6}
                        y={y - 26}
                        width={loc.naam.length * 6.4 + 12}
                        height="16"
                        rx="3"
                        fill="#1B6AB3"
                      />
                      <polygon points={`${x - 3},${y - 10} ${x + 3},${y - 10} ${x},${y - 7}`} fill="#1B6AB3" />
                      <text x={x} y={y - 15.5} textAnchor="middle" fill="white" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
                        {loc.naam}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Side panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-100">
          {activeLocatie ? (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <h3 className="font-bold text-lg">{activeLocatie.naam}</h3>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                {activeLocatie.adres}<br />
                {activeLocatie.postcode} {activeLocatie.naam}
              </p>
              <Link
                href={`/locaties/${activeLocatie.slug}`}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-all w-full justify-center"
              >
                Bekijk locatie <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="p-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={14} />
                Selecteer een locatie
              </div>
            </div>
          )}

          <div className="border-t border-zinc-100 max-h-[320px] overflow-y-auto">
            {locaties.map((loc) => (
              <button
                key={loc.slug}
                onClick={() => setActive(loc.slug)}
                className={`w-full text-left px-5 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                  active === loc.slug
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <MapPin size={13} className={active === loc.slug ? 'text-primary-500' : 'text-zinc-400'} />
                {loc.naam}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
