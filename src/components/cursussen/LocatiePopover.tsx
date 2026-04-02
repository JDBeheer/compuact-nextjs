'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Car, Train, ParkingCircle, ArrowRight, X } from 'lucide-react'
import { getLocatieBySlug } from '@/data/locaties'
import { cn } from '@/lib/utils'

interface LocatiePopoverProps {
  stad: string
  children: React.ReactNode
}

export default function LocatiePopover({ stad, children }: LocatiePopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const slug = stad.toLowerCase().replace(/['\s]+/g, '-')
  const locatie = getLocatieBySlug(slug)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!locatie) return <>{children}</>

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="inline-flex items-center gap-1 hover:text-primary-600 transition-colors"
      >
        {children}
      </button>

      {open && (
        <div className={cn(
          'absolute left-0 top-full mt-2 z-50 bg-white rounded-xl border border-zinc-200 shadow-xl shadow-black/10 p-4 w-72',
          'animate-in fade-in slide-in-from-top-1 duration-150'
        )}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-zinc-300 hover:text-zinc-500"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-2 mb-3">
            <MapPin size={14} className="text-primary-500 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-sm text-zinc-900">{locatie.naam}</div>
              <div className="text-xs text-zinc-500">{locatie.adres}, {locatie.postcode}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-600">
            <div className="flex items-start gap-2">
              <Car size={12} className="text-blue-500 mt-0.5 shrink-0" />
              <span>{locatie.bereikbaarheid.auto}</span>
            </div>
            <div className="flex items-start gap-2">
              <Train size={12} className="text-green-500 mt-0.5 shrink-0" />
              <span>{locatie.bereikbaarheid.ov}</span>
            </div>
            <div className="flex items-start gap-2">
              <ParkingCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
              <span>{locatie.bereikbaarheid.parkeren}</span>
            </div>
          </div>

          <Link
            href={`/locaties/${locatie.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 mt-3 pt-3 border-t border-zinc-100"
          >
            Bekijk locatiepagina <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  )
}
