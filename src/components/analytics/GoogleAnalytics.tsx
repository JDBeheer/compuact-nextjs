'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId?: string
  adsId?: string
  conversionLabels?: {
    inschrijving?: string
    offerte?: string
    incompany?: string
    contact?: string
  }
}

export default function GoogleAnalytics({ gaId, adsId, conversionLabels }: GoogleAnalyticsProps) {
  const primaryId = gaId || adsId
  if (!primaryId) return null

  return (
    <>
      {/* Global site tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          ${gaId ? `gtag('config', '${gaId}', { send_page_view: true });` : ''}
          ${adsId ? `gtag('config', '${adsId}');` : ''}

          // Enhanced conversions
          ${adsId ? `gtag('config', '${adsId}', { allow_enhanced_conversions: true });` : ''}

          // Make conversion config available to analytics.ts
          ${adsId ? `window.__GA_CONVERSION_ID__ = '${adsId}';` : ''}
          ${conversionLabels ? `window.__GA_CONVERSION_LABELS__ = ${JSON.stringify(conversionLabels)};` : ''}
        `}
      </Script>
    </>
  )
}
