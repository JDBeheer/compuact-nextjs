'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, Search, FileSpreadsheet, FileText, Monitor, Presentation, BarChart3, FolderKanban, Bot, PenTool, Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const categorieen = [
  {
    naam: 'Excel',
    slug: 'excel',
    icon: FileSpreadsheet,
    color: 'text-emerald-600 bg-emerald-50',
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
    ],
  },
  {
    naam: 'Word',
    slug: 'word',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
    cursussen: [
      { naam: 'Word Basis', slug: 'word-basis', niveau: 'Beginner' },
      { naam: 'Word Gevorderd', slug: 'word-gevorderd', niveau: 'Gevorderd' },
      { naam: 'Word: Complexe Documenten', slug: 'word-complexe-documenten', niveau: 'Gevorderd' },
      { naam: 'Word: Formulieren en Sjablonen', slug: 'word-formulieren-en-sjablonen', niveau: 'Gevorderd' },
      { naam: 'Word: Mailingen Verzorgen', slug: 'word-mailingen-verzorgen', niveau: 'Gevorderd' },
    ],
  },
  {
    naam: 'Outlook',
    slug: 'outlook',
    icon: Mail,
    color: 'text-sky-600 bg-sky-50',
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
    cursussen: [
      { naam: 'PowerPoint Alles-in-een', slug: 'powerpoint-alles-in-een', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Power BI',
    slug: 'power-bi',
    icon: BarChart3,
    color: 'text-amber-600 bg-amber-50',
    cursussen: [
      { naam: 'Power BI Desktop', slug: 'power-bi-desktop', niveau: 'Gevorderd' },
    ],
  },
  {
    naam: 'Office 365',
    slug: 'office-365',
    icon: Monitor,
    color: 'text-orange-600 bg-orange-50',
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
    cursussen: [
      { naam: 'Cursus VBA', slug: 'cursus-vba', niveau: 'Expert' },
    ],
  },
  {
    naam: 'Project',
    slug: 'project',
    icon: FolderKanban,
    color: 'text-teal-600 bg-teal-50',
    cursussen: [
      { naam: 'Project Basis', slug: 'project-basis', niveau: 'Beginner' },
    ],
  },
  {
    naam: 'Visio',
    slug: 'visio',
    icon: PenTool,
    color: 'text-indigo-600 bg-indigo-50',
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
  const megaRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut for search
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

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

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
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        {/* Top bar */}
        <div className="bg-primary-900 text-white">
          <div className="container-wide flex justify-between items-center py-1.5 text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:0851058919" className="flex items-center gap-1.5 hover:text-primary-200 transition-colors">
                <Phone size={13} />
                <span className="hidden sm:inline">085 105 8919</span>
              </a>
              <a href="mailto:info@computertraining.nl" className="hidden sm:flex items-center gap-1.5 hover:text-primary-200 transition-colors">
                <Mail size={13} />
                info@computertraining.nl
              </a>
            </div>
            <div className="text-primary-300 text-xs">
              21+ jaar ervaring in Microsoft Office trainingen
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
                    'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                    megaOpen ? 'text-primary-500 bg-primary-50' : 'text-zinc-700 hover:text-primary-500 hover:bg-zinc-50'
                  )}
                >
                  Cursussen
                  <ChevronDown size={15} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                </button>

                {/* Mega menu */}
                {megaOpen && (
                  <div className="absolute top-full -left-4 pt-1">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-zinc-900/10 border border-zinc-200 w-[720px] overflow-hidden">
                      <div className="flex">
                        {/* Left: categories */}
                        <div className="w-52 bg-zinc-50 border-r border-zinc-100 py-3">
                          {categorieen.map((cat, i) => {
                            const Icon = cat.icon
                            return (
                              <button
                                key={cat.naam}
                                onMouseEnter={() => setActiveCategory(i)}
                                className={cn(
                                  'w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left',
                                  activeCategory === i
                                    ? 'bg-white text-zinc-900 font-semibold shadow-sm border-r-2 border-primary-500'
                                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
                                )}
                              >
                                <span className={cn('p-1 rounded', cat.color)}>
                                  <Icon size={14} />
                                </span>
                                {cat.naam}
                                <ChevronRight size={12} className="ml-auto text-zinc-300" />
                              </button>
                            )
                          })}
                        </div>

                        {/* Right: courses for active category */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-zinc-900">
                              {categorieen[activeCategory].naam} cursussen
                            </h3>
                            <Link
                              href={`/cursussen?categorie=${categorieen[activeCategory].slug}`}
                              onClick={closeMega}
                              className="text-xs text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1"
                            >
                              Alle bekijken <ArrowRight size={11} />
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {categorieen[activeCategory].cursussen.map((cursus) => (
                              <Link
                                key={cursus.slug}
                                href={`/cursussen/${cursus.slug}`}
                                onClick={closeMega}
                                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-zinc-50 group transition-colors"
                              >
                                <span className="text-sm text-zinc-700 group-hover:text-primary-500 transition-colors font-medium truncate">
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
                            className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 hover:border-primary-200 transition-colors group"
                          >
                            <div className="bg-primary-500 text-white p-2 rounded-lg">
                              <Building2 size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-zinc-900">InCompany training</div>
                              <div className="text-xs text-zinc-500">Op maat, op uw locatie</div>
                            </div>
                            <ArrowRight size={14} className="text-zinc-400 group-hover:text-primary-500 transition-colors" />
                          </Link>
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="border-t border-zinc-100 px-4 py-3 bg-zinc-50 flex items-center justify-between">
                        <Link
                          href="/cursussen"
                          onClick={closeMega}
                          className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1"
                        >
                          Alle 26 cursussen bekijken <ArrowRight size={14} />
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
                )}
              </div>

              <Link href="/incompany" className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
                InCompany
              </Link>
              <Link href="/over-ons" className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
                Over ons
              </Link>
              <Link href="/contact" className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-primary-500 rounded-lg hover:bg-zinc-50 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
                title="Zoeken (⌘K)"
              >
                <Search size={20} />
              </button>
              <Link
                href="/cursussen"
                className="bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]"
              >
                Bekijk cursussen
              </Link>
            </div>

            {/* Mobile: search + menu */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-500 hover:text-zinc-900"
              >
                <Search size={22} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-zinc-600 hover:text-zinc-900"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white max-h-[70vh] overflow-y-auto">
            <nav className="container-wide py-4 space-y-1">
              {/* Categories accordion */}
              {categorieen.map((cat, i) => {
                const Icon = cat.icon
                const isOpen = mobileCategory === i
                return (
                  <div key={cat.naam}>
                    <button
                      onClick={() => setMobileCategory(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={cn('p-1.5 rounded-lg', cat.color)}>
                          <Icon size={16} />
                        </span>
                        {cat.naam}
                      </span>
                      <ChevronDown size={16} className={cn('text-zinc-400 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="ml-10 space-y-0.5 mb-2">
                        {cat.cursussen.map((cursus) => (
                          <Link
                            key={cursus.slug}
                            href={`/cursussen/${cursus.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-zinc-600 hover:text-primary-500 hover:bg-zinc-50 rounded-lg"
                          >
                            {cursus.naam}
                          </Link>
                        ))}
                        <Link
                          href={`/cursussen?categorie=${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-primary-500 font-semibold hover:bg-primary-50 rounded-lg"
                        >
                          Alle {cat.naam} cursussen &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="border-t border-zinc-100 my-2" />
              <Link href="/incompany" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg">
                <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600"><Building2 size={16} /></span>
                InCompany
              </Link>
              <Link href="/over-ons" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg">
                Over ons
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay (Spotlight style) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative max-w-2xl mx-auto mt-[12vh] px-4">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-zinc-200">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 border-b border-zinc-100">
                <Search size={20} className="text-zinc-400 shrink-0" />
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
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Populaire cursussen</p>
                    <div className="space-y-1">
                      {['excel-basis', 'excel-gevorderd', 'power-bi-desktop', 'prompting-met-ai', 'word-basis'].map(slug => {
                        const c = allCursussen.find(x => x.slug === slug)
                        if (!c) return null
                        const Icon = c.icon
                        return (
                          <Link
                            key={slug}
                            href={`/cursussen/${slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 group transition-colors"
                          >
                            <span className={cn('p-1.5 rounded-lg', c.color)}>
                              <Icon size={14} />
                            </span>
                            <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-500">{c.naam}</span>
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
                    <p className="text-zinc-500">Geen cursussen gevonden voor &ldquo;{searchQuery}&rdquo;</p>
                    <Link
                      href="/cursussen"
                      onClick={() => setSearchOpen(false)}
                      className="text-sm text-primary-500 font-semibold mt-2 inline-block"
                    >
                      Bekijk alle cursussen &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2 mb-2">
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
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-50 group transition-colors"
                          >
                            <span className={cn('p-1.5 rounded-lg', c.color)}>
                              <Icon size={14} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-zinc-700 group-hover:text-primary-500 truncate">{c.naam}</div>
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
              <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between bg-zinc-50">
                <Link
                  href="/cursussen"
                  onClick={() => setSearchOpen(false)}
                  className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600"
                >
                  Alle cursussen <ArrowRight size={13} />
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
