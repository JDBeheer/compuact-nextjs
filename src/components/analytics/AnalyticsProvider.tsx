'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Tracks page views on route changes for SPA navigation.
 * The initial page view is handled by gtag config's send_page_view.
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

  return null
}
