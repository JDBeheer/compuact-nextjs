'use client'

import { Users, Laptop, BookOpen, Building2 } from 'lucide-react'

function scrollToTab() {
  document.getElementById('cursustabs')?.scrollIntoView({ behavior: 'smooth' })
  window.dispatchEvent(new CustomEvent('activate-cursus-tab', { detail: 'lesmethodes' }))
}

export default function LesmethodeBadges({ lesmethodes }: { lesmethodes: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {lesmethodes.map((m) => {
        const lower = m.toLowerCase()
        if (lower === 'klassikaal') return <button key={m} onClick={scrollToTab} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full hover:border-primary-300 hover:text-primary-500 transition-colors cursor-pointer"><Users size={11} /> Klassikaal</button>
        if (lower === 'live online' || lower === 'online') return <button key={m} onClick={scrollToTab} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full hover:border-accent-300 hover:text-accent-500 transition-colors cursor-pointer"><Laptop size={11} /> Live Online</button>
        if (lower === 'thuisstudie') return <button key={m} onClick={scrollToTab} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full hover:border-violet-300 hover:text-violet-500 transition-colors cursor-pointer"><BookOpen size={11} /> Thuisstudie</button>
        if (lower === 'incompany') return <button key={m} onClick={scrollToTab} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full hover:border-primary-300 hover:text-primary-700 transition-colors cursor-pointer"><Building2 size={11} /> InCompany</button>
        return null
      })}
    </div>
  )
}
