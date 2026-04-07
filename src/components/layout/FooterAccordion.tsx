'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:contents">
      {/* Mobile: accordion */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full py-3 border-b border-zinc-800"
      >
        <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-6 h-px bg-primary-500" />
          {title}
        </h3>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`lg:hidden overflow-hidden transition-all duration-200 ${open ? 'max-h-96 pt-3 pb-2' : 'max-h-0'}`}>
        {children}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-6 h-px bg-primary-500" />
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}
