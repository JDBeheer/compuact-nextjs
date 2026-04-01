import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'

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
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
