'use client'

import { CheckCircle, XCircle, MousePointer, ShoppingCart, CreditCard, FileText, Phone, Building2, Eye, ArrowRight, Send, BarChart3 } from 'lucide-react'

interface TrackingEvent {
  naam: string
  type: 'ecommerce' | 'custom' | 'ads' | 'systeem'
  trigger: string
  ga4: boolean
  googleAds: boolean
  database: boolean
  data: string[]
  bestand: string
  status: 'actief' | 'inactief'
  icon: typeof Eye
  toelichting?: string
}

const events: TrackingEvent[] = [
  {
    naam: 'page_view',
    type: 'systeem',
    trigger: 'Elke pagina-navigatie (route change)',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['page_path', 'page_title'],
    bestand: 'src/components/analytics/AnalyticsProvider.tsx',
    status: 'actief',
    icon: Eye,
  },
  {
    naam: 'view_item',
    type: 'ecommerce',
    trigger: 'Cursuspagina wordt geladen',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['item_id', 'item_name', 'item_category', 'price', 'currency'],
    bestand: 'src/components/analytics/TrackViewItem.tsx',
    status: 'actief',
    icon: Eye,
  },
  {
    naam: 'add_to_cart',
    type: 'ecommerce',
    trigger: 'Cursussessie wordt toegevoegd aan winkelwagen',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['item_id', 'item_name', 'item_variant (lesmethode)', 'location_id', 'price', 'quantity'],
    bestand: 'src/contexts/CartContext.tsx',
    status: 'actief',
    icon: ShoppingCart,
  },
  {
    naam: 'remove_from_cart',
    type: 'ecommerce',
    trigger: 'Cursussessie wordt verwijderd uit winkelwagen',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['item_id', 'item_name', 'price'],
    bestand: 'src/contexts/CartContext.tsx',
    status: 'actief',
    icon: ShoppingCart,
  },
  {
    naam: 'begin_checkout',
    type: 'ecommerce',
    trigger: 'Checkout-pagina (gegevens invullen) wordt geladen',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['items[]', 'value', 'currency'],
    bestand: 'src/app/(public)/inschrijven/gegevens/page.tsx',
    status: 'actief',
    icon: CreditCard,
  },
  {
    naam: 'purchase',
    type: 'ecommerce',
    trigger: 'Inschrijving of offerte-aanvraag succesvol verstuurd',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['transaction_id', 'value', 'currency', 'items[]', 'type (inschrijving/offerte)'],
    bestand: 'src/app/(public)/inschrijven/gegevens/page.tsx',
    status: 'actief',
    icon: CreditCard,
    toelichting: 'Stuurt ook een Google Ads conversion event met het juiste label (inschrijving of offerte).',
  },
  {
    naam: 'generate_lead',
    type: 'ecommerce',
    trigger: 'Offerte-aanvraag succesvol verstuurd',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['value', 'currency', 'items[] (cursus titels)'],
    bestand: 'src/app/(public)/inschrijven/gegevens/page.tsx',
    status: 'actief',
    icon: FileText,
    toelichting: 'Wordt alleen gestuurd bij type "offerte", niet bij directe inschrijving.',
  },
  {
    naam: 'incompany_request',
    type: 'custom',
    trigger: 'InCompany offerte-aanvraag verstuurd',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['cursussen', 'aantal_deelnemers'],
    bestand: 'src/app/(public)/incompany/page.tsx',
    status: 'actief',
    icon: Building2,
    toelichting: 'Stuurt ook een Google Ads conversion event met het incompany-label.',
  },
  {
    naam: 'phone_click',
    type: 'custom',
    trigger: 'Klik op telefoonnummer (tel: link)',
    ga4: true,
    googleAds: false,
    database: true,
    data: ['event_category: contact', 'event_label: 023-5513409', 'pagina (in database)'],
    bestand: 'src/components/analytics/AnalyticsProvider.tsx',
    status: 'actief',
    icon: Phone,
    toelichting: 'Wordt zowel naar GA4 gestuurd als opgeslagen in de telefoon_kliks tabel (Supabase).',
  },
  {
    naam: 'contact_form_submit',
    type: 'custom',
    trigger: 'Contactformulier verstuurd',
    ga4: true,
    googleAds: true,
    database: false,
    data: ['(geen extra parameters)'],
    bestand: 'src/lib/analytics.ts',
    status: 'inactief',
    icon: Send,
    toelichting: 'Functie is gedefinieerd in analytics.ts maar wordt nergens aangeroepen. Moet nog geïmplementeerd worden in het contactformulier.',
  },
  {
    naam: 'conversion',
    type: 'ads',
    trigger: 'Na purchase, incompany_request of contact_form_submit',
    ga4: false,
    googleAds: true,
    database: false,
    data: ['send_to (conversion_id/label)', 'transaction_id', 'value', 'currency'],
    bestand: 'src/lib/analytics.ts',
    status: 'actief',
    icon: BarChart3,
    toelichting: 'Google Ads conversion tracking. Labels: inschrijving, offerte, incompany, contact. Wordt automatisch meegestuurd bij relevante events.',
  },
]

const typeLabels: Record<string, { label: string; color: string }> = {
  ecommerce: { label: 'Ecommerce', color: 'bg-blue-100 text-blue-700' },
  custom: { label: 'Custom', color: 'bg-purple-100 text-purple-700' },
  ads: { label: 'Google Ads', color: 'bg-amber-100 text-amber-700' },
  systeem: { label: 'Systeem', color: 'bg-zinc-100 text-zinc-700' },
}

export default function TrackingPage() {
  const actief = events.filter(e => e.status === 'actief').length
  const inactief = events.filter(e => e.status === 'inactief').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Event Tracking</h1>
          <p className="text-sm text-zinc-500 mt-1">Overzicht van alle analytics events die gemeten worden</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-green-600 font-semibold">{actief}</span> <span className="text-green-500">actief</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-red-600 font-semibold">{inactief}</span> <span className="text-red-500">inactief</span>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Legenda</div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {Object.entries(typeLabels).map(([key, { label, color }]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${color}`}>{label}</span>
            </span>
          ))}
          <span className="text-zinc-400">|</span>
          <span className="flex items-center gap-1 text-zinc-600"><CheckCircle size={13} className="text-green-500" /> Actief</span>
          <span className="flex items-center gap-1 text-zinc-600"><XCircle size={13} className="text-red-400" /> Niet geïmplementeerd</span>
        </div>
      </div>

      {/* Events lijst */}
      <div className="space-y-3">
        {events.map((event) => {
          const Icon = event.icon
          const typeInfo = typeLabels[event.type]

          return (
            <div key={event.naam} className={`bg-white rounded-xl border ${event.status === 'inactief' ? 'border-red-200 bg-red-50/30' : 'border-zinc-200'} overflow-hidden`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg shrink-0 ${event.status === 'actief' ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-400'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <code className="text-sm font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">{event.naam}</code>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeInfo.color}`}>{typeInfo.label}</span>
                      {event.status === 'actief' ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium"><XCircle size={12} /> Niet actief</span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-600 mb-2">{event.trigger}</div>

                    {/* Destinations */}
                    <div className="flex gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${event.ga4 ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-300'}`}>
                        GA4 {event.ga4 ? '✓' : '✗'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${event.googleAds ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-300'}`}>
                        Google Ads {event.googleAds ? '✓' : '✗'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${event.database ? 'bg-green-50 text-green-600' : 'bg-zinc-50 text-zinc-300'}`}>
                        Database {event.database ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Data parameters */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {event.data.map((param) => (
                        <code key={param} className="text-[11px] bg-zinc-50 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-100">{param}</code>
                      ))}
                    </div>

                    {event.toelichting && (
                      <div className="text-xs text-zinc-400 italic">{event.toelichting}</div>
                    )}

                    <div className="text-[11px] text-zinc-300 mt-1">{event.bestand}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced conversions info */}
      <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Enhanced Conversions</div>
        <p className="text-sm text-zinc-600">
          Bij het afronden van een inschrijving/offerte worden gehashte gebruikersgegevens (e-mail, telefoon, naam, stad, postcode) naar Google Ads gestuurd voor betere attributie.
          Dit gebeurt via <code className="text-xs bg-white px-1 py-0.5 rounded border border-zinc-200">setUserData()</code> in <span className="text-zinc-400">src/lib/analytics.ts</span>.
        </p>
      </div>
    </div>
  )
}
