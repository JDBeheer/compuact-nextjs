'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'cursusaanbod', label: 'Inschrijven' },
  { id: 'cursusinfo', label: 'Info' },
  { id: 'cursustabs', label: 'Inhoud' },
  { id: 'reviews', label: 'Reviews' },
]

export default function MobileCursusNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [headerHeight, setHeaderHeight] = useState(0)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header')
      if (header) setHeaderHeight(header.offsetHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setVisible(y > 350)

      // Track if header is hidden (same logic as Header component)
      if (y > 80) {
        if (y > lastScrollY.current + 10) setHeaderHidden(true)
        else if (y < lastScrollY.current - 5) setHeaderHidden(false)
      } else {
        setHeaderHidden(false)
      }
      lastScrollY.current = y

      // Active section detection
      let current = ''
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 180) current = section.id
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
      const offset = headerHeight + 44 // header + this nav bar
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const topOffset = headerHidden ? 0 : headerHeight

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 lg:hidden transition-all duration-300',
        visible ? 'opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ top: topOffset }}
    >
      <div className="bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
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
