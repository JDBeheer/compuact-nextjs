'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

const DAGEN = [
  { kort: 'Ma', lang: 'Maandag', open: '09:00', sluit: '17:00' },
  { kort: 'Di', lang: 'Dinsdag', open: '09:00', sluit: '17:00' },
  { kort: 'Wo', lang: 'Woensdag', open: '09:00', sluit: '17:00' },
  { kort: 'Do', lang: 'Donderdag', open: '09:00', sluit: '17:00' },
  { kort: 'Vr', lang: 'Vrijdag', open: '09:00', sluit: '17:00' },
  { kort: 'Za', lang: 'Zaterdag', open: null, sluit: null },
  { kort: 'Zo', lang: 'Zondag', open: null, sluit: null },
]

function getStatus() {
  const now = new Date()
  const dag = now.getDay() // 0=zo, 1=ma
  const uur = now.getHours()
  const minuut = now.getMinutes()
  const tijd = uur * 60 + minuut

  const dagIndex = dag === 0 ? 6 : dag - 1 // convert to 0=ma
  const vandaag = DAGEN[dagIndex]

  if (vandaag.open && vandaag.sluit) {
    const [openU, openM] = vandaag.open.split(':').map(Number)
    const [sluitU, sluitM] = vandaag.sluit.split(':').map(Number)
    const openTijd = openU * 60 + openM
    const sluitTijd = sluitU * 60 + sluitM

    if (tijd >= openTijd && tijd < sluitTijd) {
      // Open nu
      const resterend = sluitTijd - tijd
      if (resterend <= 60) {
        return { open: true, tekst: `Open · sluit om ${vandaag.sluit}`, kleur: 'text-amber-400', dot: 'bg-amber-400' }
      }
      return { open: true, tekst: `Nu geopend`, kleur: 'text-emerald-400', dot: 'bg-emerald-400' }
    }

    if (tijd < openTijd) {
      return { open: false, tekst: `Opent om ${vandaag.open}`, kleur: 'text-primary-300', dot: 'bg-red-400' }
    }
  }

  // Gesloten — vind volgende openingsdag
  let volgendeDag = dagIndex
  for (let i = 1; i <= 7; i++) {
    volgendeDag = (dagIndex + i) % 7
    if (DAGEN[volgendeDag].open) {
      const dagNaam = i === 1 ? 'morgen' : DAGEN[volgendeDag].kort.toLowerCase()
      return { open: false, tekst: `Opent ${dagNaam} om ${DAGEN[volgendeDag].open}`, kleur: 'text-primary-300', dot: 'bg-red-400' }
    }
  }

  return { open: false, tekst: 'Gesloten', kleur: 'text-primary-300', dot: 'bg-red-400' }
}

export default function OpeningsTijden() {
  const [status, setStatus] = useState(getStatus)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => setStatus(getStatus()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const vandaagIndex = (() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  })()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1.5 text-xs ${status.kleur} hover:text-white transition-colors`}
      >
        <span className="relative flex h-2 w-2">
          {status.open && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-75`} />}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dot}`} />
        </span>
        {status.tekst}
        <Clock size={10} className="opacity-60" />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-white rounded-xl shadow-xl shadow-black/15 border border-zinc-200 w-56 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-4 py-3 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Openingstijden</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Telefonisch bereikbaar</p>
            </div>
            <div className="px-4 py-2">
              {DAGEN.map((dag, i) => {
                const isVandaag = i === vandaagIndex
                return (
                  <div
                    key={dag.kort}
                    className={`flex items-center justify-between py-2 ${
                      i < DAGEN.length - 1 ? 'border-b border-zinc-50' : ''
                    } ${isVandaag ? 'bg-primary-50 -mx-4 px-4 rounded-lg' : ''}`}
                  >
                    <span className={`text-sm ${isVandaag ? 'font-bold text-primary-700' : 'text-zinc-600'}`}>
                      {isVandaag ? 'Vandaag' : dag.kort}
                    </span>
                    <span className={`text-sm ${isVandaag ? 'font-bold text-primary-700' : dag.open ? 'text-zinc-700' : 'text-zinc-400'}`}>
                      {dag.open ? `${dag.open}–${dag.sluit}` : 'Gesloten'}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50">
              <a
                href="tel:0235513409"
                className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                Bel 023-551 3409
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
