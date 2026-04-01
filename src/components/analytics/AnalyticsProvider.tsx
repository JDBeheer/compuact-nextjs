'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPhoneClick } from '@/lib/analytics'

/**
 * Tracks page views on route changes and phone click events.
 */
export default function AnalyticsPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  // Track phone link clicks globally
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="tel:"]')
      if (link) trackPhoneClick()
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}
