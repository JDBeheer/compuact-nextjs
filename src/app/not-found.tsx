'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function NotFound() {
  useEffect(() => {
    fetch('/api/log-404', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-zinc-50">
      <div className="text-center px-6 py-16 max-w-lg mx-auto">
        <p className="text-primary-600 text-[80px] md:text-[120px] font-bold leading-none mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">
          Pagina niet gevonden
        </h1>
        <p className="text-zinc-500 text-base mb-8">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Terug naar home
          </Link>
          <Link
            href="/cursussen"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 text-zinc-700 font-semibold text-sm hover:bg-zinc-100 transition-colors"
          >
            <BookOpen size={16} />
            Cursussen bekijken
          </Link>
        </div>
      </div>
    </div>
  )
}
