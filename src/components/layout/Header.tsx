'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, Search, FileSpreadsheet, FileText, Monitor, Presentation, BarChart3, FolderKanban, Bot, PenTool, Building2, ArrowRight, Star, Shield, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import OpeningsTijden from '@/components/OpeningsTijden'

const categorieen = [
  {
    naam: 'Excel',
    slug: 'excel',
    icon: FileSpreadsheet,
    color: 'text-emerald-600 bg-emerald-50',
    activeColor: 'text-emerald-700 bg-emerald-100',
    cursussen: [
      { naam: 'Excel Basis', slug: 'excel-basis', niveau: 'Beginner' },
      { naam: 'Excel Gevorderd', slug: 'excel-gevorderd', niveau: 'Gevorderd' },
      { naam: 'Excel: Functies en Formules', slug: 'excel-functies-en-formules', niveau: 'Gevorderd' },
      { naam: 'Excel: Draaitabellen en Grafieken', slug: 'excel-draaitabellen-en-grafieken', niveau: 'Gevorderd' },
      { naam: 'Excel: Analyse en Rapportage', slug: 'excel-analyse-en-rapportage', niveau: 'Gevorderd' },
      { naam: 'Excel: Koppelingen en Macro\'s', slug: 'excel-koppelingen-en-macros', niveau: 'Gevorderd' },
      { naam: 'Excel voor Financials', slug: 'excel-voor-financials', niveau: 'Gevorderd' },
      { naam: 'Excel met VBA', slug: 'excel-met-vba', niveau: 'Expert' },
      { naam: 'Excel met AI', slug: 'excel-met-ai', niveau: 'Beginner' },
      { naam: 'Excel Power BI', slug: 'excel-power-bi', niveau: 'Gevorderd' },
      { naam: 'Word en Excel', slug: 'word-en-excel', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Word',
    slug: 'word',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
    activeColor: 'text-blue-700 bg-blue-100',
    cursussen: [
      { naam: 'Word Basis', slug: 'word-basis', niveau: 'Beginner' },
      { naam: 'Word Gevorderd', slug: 'word-gevorderd', niveau: 'Gevorderd' },
      { naam: 'Word: Complexe Documenten', slug: 'word-complexe-documenten', niveau: 'Gevorderd' },
      { naam: 'Word: Formulieren en Sjablonen', slug: 'word-formulieren-en-sjablonen', niveau: 'Gevorderd' },
      { naam: 'Word: Mailingen Verzorgen', slug: 'word-mailingen-verzorgen', niveau: 'Gevorderd' },
      { naam: 'Word en Excel', slug: 'word-en-excel', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Outlook',
    slug: 'outlook',
    icon: Mail,
    color: 'text-sky-600 bg-sky-50',
    activeColor: 'text-sky-700 bg-sky-100',
    cursussen: [
      { naam: 'Outlook Alles-in-een', slug: 'outlook-alles-in-een', niveau: 'Beginner' },
      { naam: 'Outlook en Time Management', slug: 'outlook-en-time-management', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'PowerPoint',
    slug: 'powerpoint',
    icon: Presentation,
    color: 'text-rose-600 bg-rose-50',
    activeColor: 'text-rose-700 bg-rose-100',
    cursussen: [
      { naam: 'PowerPoint Alles-in-een', slug: 'powerpoint-alles-in-een', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Power BI',
    slug: 'power-bi',
    icon: BarChart3,
    color: 'text-amber-600 bg-amber-50',
    activeColor: 'text-amber-700 bg-amber-100',
    cursussen: [
      { naam: 'Power BI Desktop', slug: 'power-bi-desktop', niveau: 'Gevorderd' },
    ],
  },
  {
    naam: 'Office 365',
    slug: 'office-365',
    icon: Monitor,
    color: 'text-orange-600 bg-orange-50',
    activeColor: 'text-orange-700 bg-orange-100',
    cursussen: [
      { naam: 'Office 365 voor eindgebruikers', slug: 'office-365-voor-eindgebruikers', niveau: 'Beginner' },
      { naam: 'Microsoft Teams', slug: 'microsoft-teams', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'AI',
    slug: 'ai',
    icon: Bot,
    color: 'text-violet-600 bg-violet-50',
    activeColor: 'text-violet-700 bg-violet-100',
    cursussen: [
      { naam: 'Introductiecursus AI', slug: 'introductiecursus-ai', niveau: 'Beginner' },
      { naam: 'Prompting met AI', slug: 'prompting-met-ai', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'VBA',
    slug: 'excel',
    icon: Monitor,
    color: 'text-emerald-600 bg-emerald-50',
    activeColor: 'text-emerald-700 bg-emerald-100',
    cursussen: [
      { naam: 'Cursus VBA', slug: 'cursus-vba', niveau: 'Expert' },
    ],
  },
  {
    naam: 'Project',
    slug: 'project',
    icon: FolderKanban,
    color: 'text-teal-600 bg-teal-50',
    activeColor: 'text-teal-700 bg-teal-100',
    cursussen: [
      { naam: 'Project Basis', slug: 'project-basis', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Visio',
    slug: 'visio',
    icon: PenTool,
    color: 'text-indigo-600 bg-indigo-50',
    activeColor: 'text-indigo-700 bg-indigo-100',
    cursussen: [
      { naam: 'Visio Basis', slug: 'visio-basis', niveau: 'Beginner' },
    ],
  },
]

const allCursussen = categorieen.flatMap(cat =>
  cat.cursussen.map(c => ({ ...c, categorie: cat.naam, icon: cat.icon, color: cat.color }))
)

const niveauColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Gevorderd: 'bg-amber-100 text-amber-700',
  Expert: 'bg-red-100 text-red-700',
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileCategory, setMobileCategory] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMegaOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const searchResults = searchQuery.length > 0
    ? allCursussen.filter(c =>
        c.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.categorie.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const closeMega = useCallback(() => {
    setMegaOpen(false)
  }, [])

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 bg-white transition-all duration-300',
        scrolled ? 'shadow-lg shadow-zinc-900/8 border-b border-zinc-100' : 'border-b border-zinc-200'
      )}>
        {/* Top bar */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-900 to-primary-950 text-white">
          <div className="container-wide flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:0235513409" className="flex items-center gap-1.5 hover:text-white transition-colors text-primary-200 group">
                <span className="bg-primary-800/60 p-1 rounded group-hover:bg-primary-700/60 transition-colors">
                  <Phone size={11} />
                </span>
                <span className="hidden sm:inline font-medium">023-551 3409</span>
              </a>
              <a href="mailto:info@computertraining.nl" className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors text-primary-200 group">
                <span className="bg-primary-800/60 p-1 rounded group-hover:bg-primary-700/60 transition-colors">
                  <Mail size={11} />
                </span>
                info@computertraining.nl
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-primary-800/40 rounded-full px-3 py-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-accent-400 fill-accent-400" />)}
                  </div>
                  <span className="text-xs font-semibold text-white">4.8/5</span>
                  <span className="text-xs text-primary-300">Google</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-primary-300 text-xs">
                  <span className="text-primary-600">|</span>
                  <Shield size={10} />
                  <span>15.000+ deelnemers</span>
                </div>
              </div>
              <span className="hidden xl:inline text-primary-600">|</span>
              <span className="hidden xl:inline">
                <OpeningsTijden />
              </span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center shrink-0">
              <Image src="/images/logo.svg" alt="Compu Act Opleidingen" width={170} height={54} priority />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              <div
                ref={megaRef}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={closeMega}
              >
                <button
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                    megaOpen ? 'text-primary-600 bg-primary-50' : 'text-zinc-700 hover:text-primary-600 hover:bg-zinc-50'
                  )}
                >
                  Cursussen
                  <ChevronDown size={14} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                </button>

                {/* Mega menu */}
                <div className={cn(
                  'absolute top-full -left-4 pt-2 transition-all duration-200',
                  megaOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                )}>
                  <div className="bg-white rounded-2xl shadow-2xl shadow-zinc-900/12 border border-zinc-200/80 w-[740px] overflow-hidden">
                    <div className="flex">
                      {/* Left: categories */}
                      <div className="w-56 bg-gradient-to-b from-zinc-50 to-zinc-100/50 border-r border-zinc-100 py-2">
                        <p className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Categorieën</p>
                        {categorieen.map((cat, i) => {
                          const Icon = cat.icon
                          return (
                            <button
                              key={cat.naam}
                              onMouseEnter={() => setActiveCategory(i)}
                              className={cn(
                                'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 text-left',
                                activeCategory === i
                                  ? 'bg-white text-zinc-900 font-semibold shadow-sm border-r-2 border-primary-500'
                                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/70'
                              )}
                            >
                              <span className={cn(
                                'p-1.5 rounded-lg transition-colors duration-150',
                                activeCategory === i ? cat.activeColor : cat.color
                              )}>
                                <Icon size={14} />
                              </span>
                              {cat.naam}
                              <ChevronRight size={12} className={cn(
                                'ml-auto transition-all duration-150',
                                activeCategory === i ? 'text-primary-400 translate-x-0.5' : 'text-zinc-300'
                              )} />
                            </button>
                          )
                        })}
                      </div>

                      {/* Right: courses for active category */}
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-sm text-zinc-900">
                            {categorieen[activeCategory].naam} cursussen
                          </h3>
                          <Link
                            href={`/cursussen/${categorieen[activeCategory].slug}`}
                            onClick={closeMega}
                            className="text-xs text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1 group"
                          >
                            Alle bekijken <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {categorieen[activeCategory].cursussen.map((cursus) => (
                            <Link
                              key={cursus.slug}
                              href={`/cursussen/${cursus.slug}`}
                              onClick={closeMega}
                              className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-primary-50/60 group transition-all duration-150"
                            >
                              <span className="text-sm text-zinc-700 group-hover:text-primary-600 transition-colors font-medium truncate">
                                {cursus.naam}
                              </span>
                              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0', niveauColor[cursus.niveau])}>
                                {cursus.niveau}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* InCompany promo */}
                        <Link
                          href="/incompany"
                          onClick={closeMega}
                          className="mt-4 flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50/50 border border-primary-100/80 hover:border-primary-200 hover:shadow-sm transition-all duration-200 group"
                        >
                          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2.5 rounded-lg shadow-sm">
                            <Building2 size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-zinc-900">InCompany training</div>
                            <div className="text-xs text-zinc-500">Op maat, op je eigen locatie</div>
                          </div>
                          <ArrowRight size={14} className="text-zinc-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-zinc-100 px-5 py-3 bg-zinc-50/80 flex items-center justify-between">
                      <Link
                        href="/cursussen"
                        onClick={closeMega}
                        className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1.5 group"
                      >
                        Alle 26 cursussen bekijken <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      <button
                        onClick={() => { closeMega(); setSearchOpen(true) }}
                        className="text-xs text-zinc-400 flex items-center gap-1.5 hover:text-zinc-600 transition-colors"
                      >
                        <Search size={12} />
                        Zoeken
                        <kbd className="bg-zinc-200 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded font-mono">&#8984;K</kbd>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/locaties" className="px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-600 rounded-lg hover:bg-zinc-50 transition-all duration-200">
                Locaties
              </Link>
              <Link href="/incompany" className="px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-600 rounded-lg hover:bg-zinc-50 transition-all duration-200">
                InCompany
              </Link>
              <Link href="/over-ons" className="px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-600 rounded-lg hover:bg-zinc-50 transition-all duration-200">
                Over ons
              </Link>
              <Link href="/contact" className="px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-600 rounded-lg hover:bg-zinc-50 transition-all duration-200">
                Contact
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-all duration-200 border border-zinc-200 hover:border-zinc-300"
                title="Zoeken (⌘K)"
              >
                <Search size={15} />
                <span className="hidden xl:inline">Zoek cursus...</span>
                <kbd className="hidden xl:block text-[10px] bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded font-mono ml-1">&#8984;K</kbd>
              </button>
              <a
                href="tel:0235513409"
                className="flex items-center gap-2 border-2 border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200"
              >
                <Phone size={14} />
                <span className="hidden xl:inline">023-551 3409</span>
              </a>
              <Link
                href="/cursussen"
                className="bg-gradient-to-b from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
              >
                Bekijk cursussen
              </Link>
            </div>

            {/* Mobile: search + phone + menu */}
            <div className="flex lg:hidden items-center gap-0.5">
              <a href="tel:0235513409" className="p-2.5 text-zinc-500 hover:text-primary-500 transition-colors">
                <Phone size={20} />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Search size={22} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden border-t border-zinc-200 bg-white overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-[calc(100vh-8rem)] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <nav className="container-wide py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {/* Quick search on mobile */}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true) }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl text-sm text-zinc-400 border border-zinc-200 mb-3 hover:border-zinc-300 transition-colors"
            >
              <Search size={16} />
              Zoek een cursus...
            </button>

            {/* Categories accordion */}
            {categorieen.map((cat, i) => {
              const Icon = cat.icon
              const isOpen = mobileCategory === i
              return (
                <div key={cat.naam}>
                  <button
                    onClick={() => setMobileCategory(isOpen ? null : i)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 text-base font-semibold rounded-lg transition-all duration-200',
                      isOpen ? 'text-primary-600 bg-primary-50/50' : 'text-zinc-700 hover:bg-zinc-50'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={cn('p-1.5 rounded-lg transition-colors', isOpen ? cat.activeColor : cat.color)}>
                        <Icon size={16} />
                      </span>
                      {cat.naam}
                    </span>
                    <ChevronDown size={16} className={cn('text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180 text-primary-400')} />
                  </button>
                  <div className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="ml-10 space-y-0.5 mb-2 pt-1">
                      {cat.cursussen.map((cursus) => (
                        <Link
                          key={cursus.slug}
                          href={`/cursussen/${cursus.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-sm text-zinc-600 hover:text-primary-500 hover:bg-primary-50/50 rounded-lg transition-colors"
                        >
                          <span>{cursus.naam}</span>
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', niveauColor[cursus.niveau])}>
                            {cursus.niveau}
                          </span>
                        </Link>
                      ))}
                      <Link
                        href={`/cursussen/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-primary-500 font-semibold hover:bg-primary-50 rounded-lg"
                      >
                        Alle {cat.naam} cursussen <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="border-t border-zinc-100 my-2" />
            <Link href="/incompany" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">
              <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600"><Building2 size={16} /></span>
              InCompany
            </Link>
            <Link href="/over-ons" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">
              Over ons
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">
              Contact
            </Link>

            {/* Mobile CTA */}
            <div className="border-t border-zinc-100 pt-4 mt-3 space-y-2.5">
              <Link
                href="/cursussen"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white px-5 py-3 rounded-xl text-base font-bold hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm"
              >
                Bekijk alle cursussen
              </Link>
              <a
                href="tel:0235513409"
                className="flex items-center justify-center gap-2 w-full border-2 border-zinc-200 text-zinc-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                <Phone size={15} />
                Bel ons: 023-551 3409
              </a>
            </div>

            {/* Mobile trust */}
            <div className="pt-4 flex items-center justify-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 bg-zinc-50 rounded-full px-3 py-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-accent-400 fill-accent-400" />)}
                </div>
                <span className="font-medium text-zinc-600">4.8/5</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Users size={10} />
                <span>15.000+ deelnemers</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Search overlay (Spotlight style) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative max-w-2xl mx-auto mt-[12vh] px-4">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-zinc-200 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 border-b border-zinc-100">
                <Search size={20} className="text-primary-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek een cursus..."
                  className="flex-1 py-4 text-lg outline-none placeholder:text-zinc-400"
                />
                <kbd className="hidden sm:block text-xs bg-zinc-100 text-zinc-400 px-2 py-1 rounded font-mono">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Populaire cursussen</p>
                    <div className="space-y-0.5">
                      {['excel-basis', 'excel-gevorderd', 'power-bi-desktop', 'prompting-met-ai', 'word-basis'].map(slug => {
                        const c = allCursussen.find(x => x.slug === slug)
                        if (!c) return null
                        const Icon = c.icon
                        return (
                          <Link
                            key={slug}
                            href={`/cursussen/${slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50/60 group transition-all duration-150"
                          >
                            <span className={cn('p-1.5 rounded-lg', c.color)}>
                              <Icon size={14} />
                            </span>
                            <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-600">{c.naam}</span>
                            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto', niveauColor[c.niveau])}>
                              {c.niveau}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 font-medium">Geen cursussen gevonden voor &ldquo;{searchQuery}&rdquo;</p>
                    <Link
                      href="/cursussen"
                      onClick={() => setSearchOpen(false)}
                      className="text-sm text-primary-500 font-semibold mt-2 inline-flex items-center gap-1 hover:text-primary-600"
                    >
                      Bekijk alle cursussen <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 mb-2">
                      {searchResults.length} resultaten
                    </p>
                    <div className="space-y-0.5">
                      {searchResults.map((c) => {
                        const Icon = c.icon
                        return (
                          <Link
                            key={c.slug}
                            href={`/cursussen/${c.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-50/60 group transition-all duration-150"
                          >
                            <span className={cn('p-1.5 rounded-lg', c.color)}>
                              <Icon size={14} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-zinc-700 group-hover:text-primary-600 truncate">{c.naam}</div>
                              <div className="text-xs text-zinc-400">{c.categorie}</div>
                            </div>
                            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0', niveauColor[c.niveau])}>
                              {c.niveau}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between bg-zinc-50/80">
                <Link
                  href="/cursussen"
                  onClick={() => setSearchOpen(false)}
                  className="text-sm text-primary-500 font-semibold flex items-center gap-1.5 hover:text-primary-600 group"
                >
                  Alle cursussen <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <div className="text-xs text-zinc-400 hidden sm:flex items-center gap-3">
                  <span className="flex items-center gap-1"><kbd className="bg-zinc-200 text-zinc-500 px-1 py-0.5 rounded text-[10px] font-mono">&uarr;&darr;</kbd> navigeer</span>
                  <span className="flex items-center gap-1"><kbd className="bg-zinc-200 text-zinc-500 px-1 py-0.5 rounded text-[10px] font-mono">&#9166;</kbd> open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
