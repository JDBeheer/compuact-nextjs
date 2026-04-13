import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import OrganizationSchema from '@/components/schema/OrganizationSchema'
import CookieConsent from '@/components/CookieConsent'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { Suspense } from 'react'
import AnalyticsPageTracker from '@/components/analytics/AnalyticsProvider'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Compu Act Opleidingen | Microsoft Office Trainingen',
    template: '%s | Compu Act Opleidingen',
  },
  description:
    'Al meer dan 21 jaar dé specialist in Microsoft Office trainingen. Klassikaal, live online of incompany door heel Nederland.',
  keywords: [
    'Microsoft Office training',
    'Excel cursus',
    'Word cursus',
    'Office 365 training',
    'computertraining',
    'Compu Act',
  ],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Compu Act Opleidingen',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={plusJakartaSans.className}>
        <OrganizationSchema />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          adsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
          conversionLabels={{
            inschrijving: process.env.NEXT_PUBLIC_CONVERSION_LABEL_INSCHRIJVING,
            offerte: process.env.NEXT_PUBLIC_CONVERSION_LABEL_OFFERTE,
            incompany: process.env.NEXT_PUBLIC_CONVERSION_LABEL_INCOMPANY,
            contact: process.env.NEXT_PUBLIC_CONVERSION_LABEL_CONTACT,
          }}
        />
        <Suspense fallback={null}>
          <AnalyticsPageTracker />
        </Suspense>
        <CartProvider>
          {children}
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  )
}
