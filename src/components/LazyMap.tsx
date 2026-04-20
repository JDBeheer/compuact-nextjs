'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface LazyMapProps {
  src: string
  title: string
  height?: string
  className?: string
}

export default function LazyMap({ src, title, height = 'h-40', className = '' }: LazyMapProps) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={src}
        className={`w-full ${height} border-0 ${className}`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    )
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className={`w-full ${height} bg-zinc-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-200 transition-colors ${className}`}
      aria-label={`Kaart laden: ${title}`}
    >
      <MapPin size={24} className="text-primary-500" />
      <span className="text-xs text-zinc-500 font-medium">Klik om kaart te laden</span>
    </button>
  )
}
