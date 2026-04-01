/**
 * Google Analytics / Google Ads event tracking
 *
 * Events follow the GA4 recommended ecommerce schema so they work
 * out-of-the-box with Google Ads P-MAX campaigns.
 *
 * Key events:
 * - view_item          → cursuspagina bekeken
 * - add_to_cart        → cursus toegevoegd
 * - remove_from_cart   → cursus verwijderd
 * - begin_checkout     → checkout gestart
 * - purchase           → inschrijving voltooid
 * - generate_lead      → offerte aangevraagd
 */

// Extend window with gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// ── Ecommerce events (GA4 + Google Ads P-MAX compatible) ──

interface ItemData {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  quantity?: number
  item_variant?: string // lesmethode
  location_id?: string  // locatie
}

export function trackViewItem(item: {
  id: string
  titel: string
  categorie?: string
  prijs: number
  lesmethode?: string
}) {
  gtag('event', 'view_item', {
    currency: 'EUR',
    value: item.prijs,
    items: [{
      item_id: item.id,
      item_name: item.titel,
      item_category: item.categorie,
      price: item.prijs,
      quantity: 1,
    }],
  })
}

export function trackAddToCart(item: {
  id: string
  titel: string
  prijs: number
  lesmethode: string
  locatie: string
  aantal?: number
}) {
  const qty = item.aantal || 1
  gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: item.prijs * qty,
    items: [{
      item_id: item.id,
      item_name: item.titel,
      item_variant: item.lesmethode,
      location_id: item.locatie,
      price: item.prijs,
      quantity: qty,
    }],
  })
}

export function trackRemoveFromCart(item: {
  id: string
  titel: string
  prijs: number
}) {
  gtag('event', 'remove_from_cart', {
    currency: 'EUR',
    value: item.prijs,
    items: [{
      item_id: item.id,
      item_name: item.titel,
      price: item.prijs,
      quantity: 1,
    }],
  })
}

export function trackBeginCheckout(items: ItemData[], value: number) {
  gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value,
    items,
  })
}

export function trackPurchase(data: {
  transactionId: string
  value: number
  items: ItemData[]
  type: 'inschrijving' | 'offerte'
}) {
  // GA4 purchase event — maps to Google Ads conversion
  gtag('event', 'purchase', {
    transaction_id: data.transactionId,
    currency: 'EUR',
    value: data.value,
    items: data.items,
  })

  // Also fire specific conversion events for Google Ads
  const conversionId = getConversionId()
  const conversionLabel = data.type === 'inschrijving'
    ? getConversionLabel('inschrijving')
    : getConversionLabel('offerte')

  if (conversionId && conversionLabel) {
    gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
      transaction_id: data.transactionId,
      value: data.value,
      currency: 'EUR',
    })
  }
}

export function trackGenerateLead(data: {
  value: number
  cursussen: string[]
}) {
  gtag('event', 'generate_lead', {
    currency: 'EUR',
    value: data.value,
    items: data.cursussen.map(titel => ({ item_name: titel })),
  })
}

// ── Custom events ──

export function trackIncompanyRequest(data: {
  cursussen: string[]
  aantalDeelnemers: number
}) {
  gtag('event', 'incompany_request', {
    cursussen: data.cursussen.join(', '),
    aantal_deelnemers: data.aantalDeelnemers,
  })

  const conversionId = getConversionId()
  const label = getConversionLabel('incompany')
  if (conversionId && label) {
    gtag('event', 'conversion', {
      send_to: `${conversionId}/${label}`,
    })
  }
}

export function trackContactForm() {
  gtag('event', 'contact_form_submit')

  const conversionId = getConversionId()
  const label = getConversionLabel('contact')
  if (conversionId && label) {
    gtag('event', 'conversion', {
      send_to: `${conversionId}/${label}`,
    })
  }
}

export function trackPhoneClick() {
  gtag('event', 'phone_click', {
    event_category: 'contact',
    event_label: '023-5513409',
  })
}

// ── Enhanced conversions (hashed user data for better attribution) ──

export function setUserData(data: {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  postalCode?: string
}) {
  gtag('set', 'user_data', {
    email: data.email,
    phone_number: data.phone,
    address: {
      first_name: data.firstName,
      last_name: data.lastName,
      city: data.city,
      postal_code: data.postalCode,
      country: 'NL',
    },
  })
}

// ── Config helpers ──

// These read from window.__ANALYTICS_CONFIG__ which is set by the
// GoogleAnalytics component from site_settings or env vars.
function getConversionId(): string | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as Record<string, unknown>).__GA_CONVERSION_ID__ as string || null
}

function getConversionLabel(type: string): string | null {
  if (typeof window === 'undefined') return null
  const labels = (window as unknown as Record<string, unknown>).__GA_CONVERSION_LABELS__ as Record<string, string> | undefined
  return labels?.[type] || null
}
