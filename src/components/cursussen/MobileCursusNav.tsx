'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'cursusaanbod', label: 'Inschrijven' },
  { id: 'cursusinfo', label: 'Info' },
  { id: 'cursustabs', label: 'Inhoud' },
  { id: 'reviews', label: 'Reviews' },
]

export default function MobileCursusNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 400px (past the hero)
      setVisible(window.scrollY > 400)

      // Determine which section is currently in view
      let current = ''
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            current = section.id
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 120 // header height + nav height
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-40 lg:hidden transition-all duration-300',
      visible ? 'translate-y-[88px] opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    )}>
      <div className="bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                activeSection === section.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-zinc-100 text-zinc-600 active:bg-zinc-200'
              )}
            >
              {section.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('cursusaanbod')}
            className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold bg-accent-500 text-white shrink-0 active:bg-accent-600"
          >
            Direct inschrijven
          </button>
        </div>
      </div>
    </div>
  )
}
