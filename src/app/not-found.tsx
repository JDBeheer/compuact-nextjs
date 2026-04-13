'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Search, ArrowRight, Home, BookOpen, MapPin, Phone,
  FileSpreadsheet, FileText, Mail, Presentation, BarChart3, Monitor
} from 'lucide-react'

interface SearchResult {
  slug: string
  titel: string
  categorie: string
  prijs: number
}

const populaireCursussen = [
  { slug: 'excel-basis', titel: 'Excel Basis', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50' },
  { slug: 'excel-gevorderd', titel: 'Excel Gevorderd', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50' },
  { slug: 'word-basis', titel: 'Word Basis', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  { slug: 'outlook-alles-in-een', titel: 'Outlook Alles-in-een', icon: Mail, color: 'text-sky-600 bg-sky-50' },
  { slug: 'powerpoint-alles-in-een', titel: 'PowerPoint Alles-in-een', icon: Presentation, color: 'text-rose-600 bg-rose-50' },
  { slug: 'power-bi-desktop', titel: 'Power BI Desktop', icon: BarChart3, color: 'text-amber-600 bg-amber-50' },
]

const snellinks = [
  { href: '/', label: 'Homepage', icon: Home },
  { href: '/cursussen', label: 'Alle cursussen', icon: BookOpen },
  { href: '/locaties', label: 'Locaties', icon: MapPin },
  { href: '/contact', label: 'Contact', icon: Phone },
]

export default function NotFound() {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [pagePath, setPagePath] = useState('')

  useEffect(() => {
    const path = window.location.pathname
    setPagePath(path)

    // Log the 404
    fetch('/api/log-404', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})

    // Auto-suggest based on URL path
    const words = path.split(/[-/]/).filter((w) => w.length > 2)
    if (words.length > 0) {
      const query = words.slice(-2).join(' ')
      fetch(`/api/zoeken?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => setSuggestions((data.results || []).slice(0, 4)))
        .catch(() => {})
    }
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/zoeken?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch {
      setSearchResults([])
    }
    setSearching(false)
  }

  return (
    <>
    <Header />
    <div className="min-h-[80vh] bg-zinc-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container-wide relative py-16 lg:py-20 text-center">
          <p className="text-[80px] md:text-[120px] font-extrabold leading-none opacity-20 select-none">404</p>
          <h1 className="text-2xl md:text-4xl font-bold -mt-4 md:-mt-8 mb-3">
            Pagina niet gevonden
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-lg mx-auto mb-8">
            De pagina die u zoekt bestaat niet of is verplaatst. Geen zorgen — we helpen u graag op weg.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center pl-4 text-zinc-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek een cursus, bijv. 'Excel' of 'draaitabellen'..."
                className="flex-1 px-3 py-4 text-zinc-900 text-base outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-4 bg-accent-500 text-white font-semibold text-sm hover:bg-accent-600 transition-colors"
              >
                {searching ? 'Zoeken...' : 'Zoeken'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-wide py-10 lg:py-14">
        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">
              Zoekresultaten voor &ldquo;{searchQuery}&rdquo;
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cursussen/${r.slug}`}
                  className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-primary-600 font-medium mb-1">{r.categorie}</p>
                  <p className="font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors">{r.titel}</p>
                  <p className="text-sm text-zinc-400 mt-2">Vanaf &euro;{r.prijs}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        {searchResults.length === 0 && searchQuery && !searching && (
          <div className="mb-10 bg-white rounded-xl border border-zinc-200 p-6 text-center">
            <p className="text-zinc-500">Geen resultaten gevonden voor &ldquo;{searchQuery}&rdquo;. Probeer een andere zoekterm.</p>
          </div>
        )}

        {/* Auto-suggestions based on URL */}
        {suggestions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Bedoelde u misschien</h2>
            <p className="text-sm text-zinc-400 mb-4">Op basis van de URL <code className="bg-zinc-100 px-2 py-0.5 rounded text-xs font-mono">{pagePath}</code></p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/cursussen/${s.slug}`}
                  className="bg-white rounded-xl border border-primary-100 border-l-4 border-l-primary-500 p-5 hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-primary-600 font-medium mb-1">{s.categorie}</p>
                  <p className="font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors">{s.titel}</p>
                  <div className="flex items-center gap-1 text-primary-600 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Bekijk cursus <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Popular courses */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Populaire cursussen</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {populaireCursussen.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cursussen/${c.slug}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-zinc-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.color}`}>
                    <c.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 text-sm group-hover:text-primary-600 transition-colors">{c.titel}</p>
                    <p className="text-xs text-zinc-400">Bekijk cursus</p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-zinc-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>

            {/* Categories */}
            <h2 className="text-lg font-bold text-zinc-900 mb-4 mt-8">Cursuscategorieën</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { slug: 'excel', label: 'Excel', icon: FileSpreadsheet },
                { slug: 'word', label: 'Word', icon: FileText },
                { slug: 'outlook', label: 'Outlook', icon: Mail },
                { slug: 'powerpoint', label: 'PowerPoint', icon: Presentation },
                { slug: 'power-bi', label: 'Power BI', icon: BarChart3 },
                { slug: 'office-365', label: 'Office 365', icon: Monitor },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/cursussen/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  <cat.icon size={16} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Snellinks</h2>
            <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
              {snellinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors group"
                >
                  <link.icon size={18} className="text-zinc-400 group-hover:text-primary-600 transition-colors" />
                  <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-600 transition-colors">{link.label}</span>
                  <ArrowRight size={14} className="ml-auto text-zinc-300 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="bg-primary-50 rounded-xl border border-primary-100 p-6 mt-6">
              <h3 className="font-bold text-zinc-900 mb-2">Hulp nodig?</h3>
              <p className="text-sm text-zinc-600 mb-4">
                Onze adviseurs helpen u graag bij het vinden van de juiste cursus.
              </p>
              <a
                href="tel:0235513409"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                <Phone size={16} />
                023-551 3409
              </a>
              <p className="text-xs text-zinc-400 mt-3">Ma-vr 09:00 - 17:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
