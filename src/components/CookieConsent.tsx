'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ConsentChoice = 'all' | 'necessary' | null

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    } else {
      applyConsent(consent as ConsentChoice)
    }
  }, [])

  function applyConsent(choice: ConsentChoice) {
    if (choice === 'all') {
      // Grant all consent — GA4 + Google Ads will fire
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        })
      }
    } else {
      // Deny marketing/analytics
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        })
      }
    }
  }

  function handleAcceptAll() {
    localStorage.setItem('cookie-consent', 'all')
    applyConsent('all')
    setVisible(false)
  }

  function handleNecessaryOnly() {
    localStorage.setItem('cookie-consent', 'necessary')
    applyConsent('necessary')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 lg:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 text-base mb-1">Cookies</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Wij gebruiken cookies om onze website te verbeteren en om het effect van onze
              advertenties te meten.{' '}
              <Link href="/privacybeleid" className="text-primary-600 hover:underline">
                Lees ons privacybeleid
              </Link>
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3 bg-zinc-50 rounded-lg p-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-zinc-300 bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Noodzakelijke cookies</p>
                    <p className="text-zinc-400 text-xs">Altijd actief. Vereist voor het functioneren van de website (winkelwagen, sessie).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-zinc-50 rounded-lg p-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-zinc-300 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-900">Analytische cookies</p>
                    <p className="text-zinc-400 text-xs">Google Analytics 4 — meet websitegebruik om onze dienstverlening te verbeteren.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-zinc-50 rounded-lg p-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-zinc-300 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-900">Marketing cookies</p>
                    <p className="text-zinc-400 text-xs">Google Ads — voor het meten van advertentie-effectiviteit en remarketing.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Alle cookies accepteren
              </button>
              <button
                onClick={handleNecessaryOnly}
                className="px-5 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showDetails ? 'Minder details' : 'Cookie details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
