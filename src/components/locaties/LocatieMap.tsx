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

// Netherlands bounding box
const NL = { minLat: 50.75, maxLat: 53.55, minLng: 3.35, maxLng: 7.25 }
const W = 400
const H = 520

function toXY(lat: number, lng: number) {
  return {
    x: ((lng - NL.minLng) / (NL.maxLng - NL.minLng)) * W,
    y: ((NL.maxLat - lat) / (NL.maxLat - NL.minLat)) * H,
  }
}

// Accurate simplified Netherlands outline (converted from real geo coords)
// Source: Natural Earth simplified borders
const NL_PATH = (() => {
  const coords: [number, number][] = [
    // North coast - Wadden area
    [53.44, 5.03], [53.42, 5.45], [53.35, 5.58], [53.36, 5.90],
    [53.33, 5.97], [53.40, 6.15], [53.43, 6.28], [53.48, 6.60],
    [53.47, 6.82], [53.46, 7.04], [53.33, 7.09],
    // East border - down through Groningen, Drenthe, Overijssel, Gelderland
    [53.24, 7.09], [53.18, 7.07], [53.00, 7.00], [52.87, 7.04],
    [52.81, 7.07], [52.65, 7.05], [52.48, 6.97], [52.43, 6.94],
    [52.39, 6.90], [52.34, 6.97], [52.24, 6.98], [52.17, 7.01],
    [52.07, 6.87], [52.01, 6.74], [51.96, 6.69], [51.89, 6.38],
    [51.85, 6.17], [51.84, 6.08], [51.81, 5.95], [51.75, 5.97],
    // Limburg
    [51.68, 6.01], [51.59, 6.04], [51.49, 6.07], [51.44, 6.08],
    [51.38, 6.12], [51.35, 6.07], [51.28, 5.96], [51.26, 5.87],
    [51.27, 5.79], [51.26, 5.69], [51.24, 5.61],
    // South border - Brabant, Zeeland
    [51.37, 5.47], [51.39, 5.28], [51.42, 5.07], [51.45, 4.93],
    [51.47, 4.79], [51.44, 4.63], [51.42, 4.39], [51.37, 4.25],
    [51.35, 4.17], [51.31, 3.94], [51.28, 3.83], [51.31, 3.73],
    [51.37, 3.59],
    // Zeeland coast
    [51.43, 3.50], [51.50, 3.56], [51.53, 3.55], [51.57, 3.65],
    [51.60, 3.68], [51.65, 3.79], [51.68, 3.82], [51.73, 3.88],
    [51.78, 3.93], [51.80, 4.05],
    // South Holland coast
    [51.83, 4.09], [51.87, 4.05], [51.90, 3.99], [51.93, 4.02],
    [51.97, 4.09], [52.03, 4.13], [52.06, 4.17], [52.08, 4.17],
    // Hook of Holland, Den Haag, Leiden
    [52.10, 4.19], [52.16, 4.26], [52.21, 4.36], [52.27, 4.42],
    // North Holland coast
    [52.33, 4.52], [52.38, 4.53], [52.46, 4.55], [52.55, 4.56],
    [52.62, 4.57], [52.70, 4.62], [52.78, 4.68], [52.86, 4.72],
    // Den Helder / top
    [52.92, 4.75], [52.97, 4.78], [53.02, 4.82], [53.07, 4.85],
    [53.12, 4.86], [53.17, 4.87], [53.22, 4.89], [53.27, 4.91],
    [53.33, 4.94], [53.38, 4.97], [53.44, 5.03],
  ]
  const points = coords.map(([lat, lng]) => {
    const { x, y } = toXY(lat, lng)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `M${points.join(' L')} Z`
})()

// IJsselmeer outline (simplified)
const IJSSELMEER = (() => {
  const coords: [number, number][] = [
    [52.95, 5.10], [52.85, 5.15], [52.75, 5.20], [52.65, 5.20],
    [52.55, 5.15], [52.50, 5.10], [52.45, 5.15], [52.42, 5.25],
    [52.45, 5.40], [52.55, 5.50], [52.65, 5.55], [52.75, 5.50],
    [52.85, 5.40], [52.93, 5.25], [52.95, 5.10],
  ]
  const points = coords.map(([lat, lng]) => {
    const { x, y } = toXY(lat, lng)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `M${points.join(' L')} Z`
})()

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
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-b from-primary-50/30 to-white min-h-[420px] lg:min-h-[540px]">
          <svg
            viewBox={`-10 -10 ${W + 20} ${H + 20}`}
            className="w-full max-w-[340px] lg:max-w-[400px] h-auto"
          >
            {/* Land */}
            <path
              d={NL_PATH}
              fill="#e8f4fc"
              stroke="#a8d4f0"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* IJsselmeer */}
            <path
              d={IJSSELMEER}
              fill="#d0e8f5"
              stroke="none"
            />

            {/* Province-ish dividers for visual texture */}
            <line x1={toXY(52.08, 4.17).x} y1={toXY(52.08, 4.17).y} x2={toXY(52.17, 7.01).x} y2={toXY(52.17, 7.01).y} stroke="#c8dff0" strokeWidth="0.5" strokeDasharray="4 3" />
            <line x1={toXY(51.85, 3.93).x} y1={toXY(51.85, 3.93).y} x2={toXY(51.85, 6.17).x} y2={toXY(51.85, 6.17).y} stroke="#c8dff0" strokeWidth="0.5" strokeDasharray="4 3" />
            <line x1={toXY(51.50, 3.56).x} y1={toXY(51.50, 3.56).y} x2={toXY(51.50, 6.07).x} y2={toXY(51.50, 6.07).y} stroke="#c8dff0" strokeWidth="0.5" strokeDasharray="4 3" />

            {/* Location markers */}
            {locaties.map((loc) => {
              const { x, y } = toXY(loc.lat, loc.lng)
              const isActive = active === loc.slug

              return (
                <g key={loc.slug} className="cursor-pointer" onClick={() => setActive(loc.slug)} onMouseEnter={() => setActive(loc.slug)}>
                  {/* Outer glow when active */}
                  {isActive && (
                    <>
                      <circle cx={x} cy={y} r="14" fill="#1B6AB3" opacity="0.08" />
                      <circle cx={x} cy={y} r="10" fill="#1B6AB3" opacity="0.12" />
                    </>
                  )}

                  {/* Drop shadow */}
                  <circle cx={x} cy={y + 1.5} r={isActive ? 7 : 5} fill="black" opacity="0.08" />

                  {/* Marker dot */}
                  <circle
                    cx={x} cy={y}
                    r={isActive ? 7 : 5}
                    fill={isActive ? '#1B6AB3' : '#F49800'}
                    stroke="white"
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Inner dot */}
                  {isActive && <circle cx={x} cy={y} r="2.5" fill="white" />}

                  {/* Label tooltip */}
                  {isActive && (
                    <g>
                      <rect
                        x={x - loc.naam.length * 3.5 - 8}
                        y={y - 28}
                        width={loc.naam.length * 7 + 16}
                        height="18"
                        rx="4"
                        fill="#1B6AB3"
                        className="drop-shadow-sm"
                      />
                      <polygon points={`${x - 4},${y - 10} ${x + 4},${y - 10} ${x},${y - 6}`} fill="#1B6AB3" />
                      <text x={x} y={y - 16} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
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
            <div className="p-5">
              <p className="text-sm text-zinc-400 text-center lg:text-left">
                Selecteer een locatie op de kaart
              </p>
            </div>
          )}

          {/* Quick list */}
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
