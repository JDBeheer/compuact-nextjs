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

// Netherlands bounding box (approximate)
const NL_BOUNDS = {
  minLat: 50.75,
  maxLat: 53.55,
  minLng: 3.35,
  maxLng: 7.25,
}

const MAP_WIDTH = 400
const MAP_HEIGHT = 520

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - NL_BOUNDS.minLng) / (NL_BOUNDS.maxLng - NL_BOUNDS.minLng)) * MAP_WIDTH
  const y = ((NL_BOUNDS.maxLat - lat) / (NL_BOUNDS.maxLat - NL_BOUNDS.minLat)) * MAP_HEIGHT
  return { x, y }
}

// Simplified Netherlands outline path
const NL_OUTLINE = `M195 10 L210 15 L225 8 L240 12 L260 5 L275 15 L290 25 L300 20 L315 30 L325 45 L330 65 L340 80 L345 95 L350 110 L340 120 L330 115 L325 130 L330 145 L340 155 L350 165 L355 180 L360 200 L355 215 L345 225 L340 240 L350 255 L360 270 L365 290 L370 310 L375 330 L380 350 L375 365 L365 380 L355 395 L340 410 L325 420 L310 430 L295 445 L280 455 L265 460 L250 465 L235 470 L220 475 L205 480 L190 485 L175 488 L160 490 L145 495 L130 498 L115 500 L100 498 L90 490 L85 480 L80 465 L75 450 L70 435 L65 420 L60 400 L55 385 L50 370 L48 355 L50 340 L55 325 L52 310 L48 295 L45 280 L42 265 L40 250 L38 235 L35 220 L33 200 L30 185 L28 170 L30 155 L35 140 L40 125 L50 115 L55 100 L60 85 L70 75 L85 65 L95 55 L105 48 L115 42 L125 38 L135 32 L145 28 L155 22 L165 18 L175 15 L185 12 Z`

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
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-b from-primary-50/30 to-white min-h-[400px] lg:min-h-[520px]">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT + 20}`}
            className="w-full max-w-[320px] lg:max-w-[380px] h-auto"
          >
            {/* Netherlands shape */}
            <path
              d={NL_OUTLINE}
              fill="#e8f4fc"
              stroke="#b8dbff"
              strokeWidth="2"
              className="drop-shadow-sm"
            />

            {/* Water effect - IJsselmeer approximate */}
            <ellipse cx="195" cy="120" rx="45" ry="55" fill="#d4eaf8" opacity="0.5" />

            {/* Location markers */}
            {locaties.map((loc) => {
              const { x, y } = latLngToXY(loc.lat, loc.lng)
              const isActive = active === loc.slug

              return (
                <g key={loc.slug}>
                  {/* Pulse ring when active */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#1B6AB3"
                      strokeWidth="2"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Shadow */}
                  <circle
                    cx={x}
                    cy={y + 2}
                    r={isActive ? 8 : 5}
                    fill="black"
                    opacity="0.1"
                  />

                  {/* Marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 8 : 5.5}
                    fill={isActive ? '#1B6AB3' : '#F49800'}
                    stroke="white"
                    strokeWidth={isActive ? 3 : 2}
                    className="cursor-pointer transition-all duration-200 hover:r-8"
                    onMouseEnter={() => setActive(loc.slug)}
                    onClick={() => setActive(loc.slug)}
                  />

                  {/* Label for active */}
                  {isActive && (
                    <g>
                      <rect
                        x={x - 35}
                        y={y - 30}
                        width="70"
                        height="20"
                        rx="4"
                        fill="#1B6AB3"
                      />
                      <polygon
                        points={`${x - 5},${y - 10} ${x + 5},${y - 10} ${x},${y - 5}`}
                        fill="#1B6AB3"
                      />
                      <text
                        x={x}
                        y={y - 17}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="system-ui"
                      >
                        {loc.naam}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Info panel */}
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
          <div className="border-t border-zinc-100 max-h-[300px] overflow-y-auto">
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
