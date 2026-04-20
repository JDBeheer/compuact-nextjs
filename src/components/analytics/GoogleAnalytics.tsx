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
      {/* Inline consent default — tiny, no external load */}
      <Script id="gtag-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
          });
          var c = localStorage.getItem('cookie-consent');
          if (c === 'all') {
            gtag('consent', 'update', {
              analytics_storage: 'granted',
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
            });
          }
          ${adsId ? `window.__GA_CONVERSION_ID__ = '${adsId}';` : ''}
          ${conversionLabels ? `window.__GA_CONVERSION_LABELS__ = ${JSON.stringify(conversionLabels)};` : ''}
        `}
      </Script>

      {/* Load gtag.js AFTER page is idle — not render blocking */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}', { send_page_view: true });` : ''}
          ${adsId ? `gtag('config', '${adsId}', { allow_enhanced_conversions: true });` : ''}
        `}
      </Script>
    </>
  )
}
