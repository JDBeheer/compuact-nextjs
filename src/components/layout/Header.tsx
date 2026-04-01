'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const cursusCategorieen = [
  { naam: 'Excel cursussen', slug: '/cursussen?categorie=excel' },
  { naam: 'Word cursussen', slug: '/cursussen?categorie=word' },
  { naam: 'Office 365', slug: '/cursussen?categorie=office-365' },
  { naam: 'Outlook', slug: '/cursussen?categorie=outlook' },
  { naam: 'PowerPoint', slug: '/cursussen?categorie=powerpoint' },
  { naam: 'Power BI', slug: '/cursussen?categorie=power-bi' },
  { naam: 'Project', slug: '/cursussen?categorie=project' },
  { naam: 'AI cursussen', slug: '/cursussen?categorie=ai' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cursussenOpen, setCursussenOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      {/* Top bar */}
      <div className="bg-primary-700 text-white">
        <div className="container-wide flex justify-between items-center py-1.5 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:0851058919" className="flex items-center gap-1.5 hover:text-primary-200 transition-colors">
              <Phone size={14} />
              085 105 8919
            </a>
            <a href="mailto:info@computertraining.nl" className="hidden sm:flex items-center gap-1.5 hover:text-primary-200 transition-colors">
              <Mail size={14} />
              info@computertraining.nl
            </a>
          </div>
          <div className="text-primary-200 text-xs sm:text-sm">
            21+ jaar ervaring in Microsoft Office trainingen
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-500 text-white font-bold text-xl px-3 py-1 rounded">CA</div>
            <div>
              <div className="font-bold text-zinc-900 text-lg leading-tight">Compu Act</div>
              <div className="text-xs text-zinc-500 leading-tight">Opleidingen</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setCursussenOpen(true)}
              onMouseLeave={() => setCursussenOpen(false)}
            >
              <Link
                href="/cursussen"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cursussen
                <ChevronDown size={16} className={cn('transition-transform', cursussenOpen && 'rotate-180')} />
              </Link>
              {cursussenOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 mt-0.5">
                  <Link
                    href="/cursussen"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary-50 hover:text-primary-500"
                  >
                    Alle cursussen
                  </Link>
                  <div className="border-t border-zinc-100 my-1" />
                  {cursusCategorieen.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.slug}
                      className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary-50 hover:text-primary-500"
                    >
                      {cat.naam}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/incompany" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
              InCompany
            </Link>
            <Link href="/over-ons" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
              Over ons
            </Link>
            <Link href="/veelgestelde-vragen" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/cursussen"
              className="bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Bekijk cursussen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white">
          <nav className="container-wide py-4 space-y-1">
            <Link href="/cursussen" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg">
              Alle cursussen
            </Link>
            {cursusCategorieen.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-lg"
              >
                {cat.naam}
              </Link>
            ))}
            <div className="border-t border-zinc-100 my-2" />
            <Link href="/incompany" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg">
              InCompany
            </Link>
            <Link href="/over-ons" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg">
              Over ons
            </Link>
            <Link href="/veelgestelde-vragen" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg">
              FAQ
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
