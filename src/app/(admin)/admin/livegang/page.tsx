'use client'

import { useState } from 'react'

type Status = 'live' | 'todo' | 'configuratie' | 'niet_nodig'

interface CheckItem {
  label: string
  status: Status
  note?: string
}

interface Section {
  title: string
  description?: string
  items: CheckItem[]
}

const sections: Section[] = [
  {
    title: "Pagina's",
    description: 'Alle publieke pagina\'s van de website',
    items: [
      { label: '/ (Homepage)', status: 'live' },
      { label: '/cursussen (Overzicht)', status: 'live' },
      { label: '/cursussen/[slug] (Cursusdetail)', status: 'live' },
      { label: '/cursussen/excel, /word, etc. (Categorieën)', status: 'live' },
      { label: '/inschrijven (Winkelwagen)', status: 'live' },
      { label: '/inschrijven/gegevens (Checkout)', status: 'live' },
      { label: '/offerte (Offerte aanvraag)', status: 'live' },
      { label: '/incompany (InCompany training)', status: 'live' },
      { label: '/locaties (Overzicht)', status: 'live' },
      { label: '/locaties/[slug] (17 locaties)', status: 'live' },
      { label: '/over-ons', status: 'live' },
      { label: '/lesmethodes', status: 'live' },
      { label: '/contact', status: 'live' },
      { label: '/veelgestelde-vragen', status: 'live' },
      { label: '/privacybeleid', status: 'live' },
      { label: '/algemene-voorwaarden', status: 'live' },
      { label: '/[slug]-cursus-[stad] (Local SEO)', status: 'live', note: '10 categorieën x alle steden' },
      { label: '404 pagina (not-found.tsx)', status: 'live' },
    ],
  },
  {
    title: 'Formulieren & Conversies',
    description: 'Alle conversie-flows en e-mailnotificaties',
    items: [
      { label: 'Inschrijving → bevestiging klant', status: 'live' },
      { label: 'Inschrijving → notificatie admin', status: 'live' },
      { label: 'Inschrijving → notificatie leads@jacht.digital', status: 'live' },
      { label: 'Offerte → bevestiging klant', status: 'live' },
      { label: 'Offerte → notificatie admin', status: 'live' },
      { label: 'Offerte → notificatie leads@jacht.digital', status: 'live' },
      { label: 'InCompany → bevestiging klant', status: 'live' },
      { label: 'InCompany → notificatie admin', status: 'live' },
      { label: 'InCompany → notificatie leads@jacht.digital', status: 'live' },
      { label: 'Contact → notificatie admin', status: 'live' },
      { label: 'Contact → notificatie leads@jacht.digital', status: 'live' },
      { label: 'Studiegids download tracking', status: 'live' },
      { label: 'Telefoonklik tracking', status: 'live' },
    ],
  },
  {
    title: 'SEO & Indexering',
    items: [
      { label: 'Sitemap.xml (dynamisch)', status: 'live' },
      { label: 'Metadata (title, description, OpenGraph)', status: 'live' },
      { label: 'robots.txt', status: 'todo' },
      { label: 'OpenGraph afbeelding', status: 'todo' },
      { label: 'Structured data (Schema.org)', status: 'todo', note: 'Course, Organization, LocalBusiness' },
      { label: 'Canonical URLs', status: 'live' },
      { label: '301 redirects (oud → nieuw)', status: 'live', note: '3 redirect-regels in next.config.mjs' },
    ],
  },
  {
    title: 'Tracking & Analytics',
    items: [
      { label: 'Google Analytics 4 (GA4)', status: 'configuratie', note: 'NEXT_PUBLIC_GA_MEASUREMENT_ID nodig' },
      { label: 'Google Ads conversion tracking', status: 'configuratie', note: 'Conversion labels nodig' },
      { label: 'Enhanced Conversions', status: 'live', note: 'Code staat klaar' },
      { label: 'PageView tracking component', status: 'live' },
      { label: 'ViewItem tracking (cursuspagina)', status: 'live' },
    ],
  },
  {
    title: 'Beveiliging',
    items: [
      { label: 'Cloudflare Turnstile (botbescherming)', status: 'configuratie', note: 'Site key + secret key nodig' },
      { label: 'Admin authenticatie (Supabase Auth)', status: 'live' },
      { label: 'Admin middleware bescherming', status: 'live' },
      { label: 'Rollen (beheerder/redacteur)', status: 'live' },
      { label: '2FA — TOTP (authenticator app)', status: 'live' },
      { label: '2FA — E-mail verificatie', status: 'live' },
      { label: 'Rate limiting op 2FA', status: 'live' },
      { label: 'RLS policies (Supabase)', status: 'live' },
    ],
  },
  {
    title: 'CMS / Admin Panel',
    items: [
      { label: 'Dashboard', status: 'live' },
      { label: 'Cursussen beheer', status: 'live' },
      { label: 'Sessies beheer', status: 'live' },
      { label: 'Categorieën beheer', status: 'live' },
      { label: 'Locaties beheer', status: 'live' },
      { label: 'Inzendingen overzicht', status: 'live' },
      { label: 'Prestaties dashboard', status: 'live' },
      { label: 'Tracking overzicht', status: 'live' },
      { label: 'Instellingen', status: 'live' },
      { label: 'Gebruikersbeheer', status: 'live' },
      { label: 'Account / 2FA instellingen', status: 'live' },
      { label: '404 Log', status: 'live' },
      { label: 'Redirect manager', status: 'live' },
      { label: 'Livegang dashboard', status: 'live' },
    ],
  },
  {
    title: 'Juridisch & Compliance',
    items: [
      { label: 'Privacybeleid', status: 'live' },
      { label: 'Algemene Voorwaarden', status: 'live' },
      { label: 'Cookie consent banner', status: 'todo', note: 'Verplicht voor AVG/GDPR bij laden van GA4' },
    ],
  },
  {
    title: 'Performance & Techniek',
    items: [
      { label: 'Next.js Image optimalisatie', status: 'live' },
      { label: 'Google Font (Plus Jakarta Sans)', status: 'live' },
      { label: 'Responsive design (mobile-first)', status: 'live' },
      { label: 'TypeScript strict mode', status: 'live' },
      { label: 'Tailwind CSS productie-build', status: 'live' },
      { label: 'Favicon (meerdere formaten)', status: 'live' },
      { label: 'PWA Manifest', status: 'todo', note: 'Voor betere Lighthouse score' },
    ],
  },
  {
    title: 'External Services',
    description: 'Configuratie van externe diensten',
    items: [
      { label: 'Supabase (database)', status: 'live' },
      { label: 'SendGrid (e-mail)', status: 'live' },
      { label: 'Google Places API (reviews)', status: 'configuratie', note: 'GOOGLE_PLACES_API_KEY nodig' },
      { label: 'Vercel (hosting)', status: 'configuratie', note: 'Env vars op Vercel instellen' },
    ],
  },
]

const statusConfig: Record<Status, { label: string; emoji: string; bg: string; text: string }> = {
  live: { label: 'Klaar', emoji: '\uD83D\uDFE2', bg: 'bg-green-100', text: 'text-green-700' },
  todo: { label: 'Todo', emoji: '\uD83D\uDD34', bg: 'bg-red-100', text: 'text-red-700' },
  configuratie: { label: 'Config nodig', emoji: '\uD83D\uDFE1', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  niet_nodig: { label: 'Niet nodig', emoji: '\u26AA', bg: 'bg-gray-100', text: 'text-gray-500' },
}

function countByStatus(items: CheckItem[]): Record<Status, number> {
  const counts: Record<Status, number> = { live: 0, todo: 0, configuratie: 0, niet_nodig: 0 }
  for (const item of items) counts[item.status]++
  return counts
}

function Badge({ status }: { status: Status }) {
  const cfg = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.emoji} {cfg.label}
    </span>
  )
}

function CollapsibleSection({ section, forceOpen }: { section: Section; forceOpen: boolean }) {
  const [manualOpen, setManualOpen] = useState(false)
  const open = forceOpen || manualOpen
  const counts = countByStatus(section.items)

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setManualOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="min-w-0">
          <h2 className="text-zinc-900 text-base font-semibold truncate">
            {section.title}
            <span className="ml-2 text-sm font-normal text-zinc-400">({section.items.length})</span>
          </h2>
          {section.description && <p className="text-xs text-zinc-400 mt-0.5 truncate">{section.description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(['live', 'todo', 'configuratie', 'niet_nodig'] as Status[]).map((s) =>
            counts[s] > 0 ? (
              <span key={s} className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[s].bg} ${statusConfig[s].text}`}>{counts[s]}</span>
            ) : null
          )}
          <svg className={`w-5 h-5 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-2.5 font-medium">Item</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Opmerking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {section.items.map((item, i) => (
                <tr key={i} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-2.5 text-sm text-zinc-900">{item.label}</td>
                  <td className="px-5 py-2.5"><Badge status={item.status} /></td>
                  <td className="px-5 py-2.5 text-xs text-zinc-400">{item.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function LivegangDashboard() {
  const allItems = sections.flatMap((s) => s.items)
  const totals = countByStatus(allItems)
  const total = allItems.length
  const done = totals.live
  const remaining = totals.todo + totals.configuratie
  const progressPct = total > 0 ? Math.round((done / (done + remaining)) * 100) : 100

  const [expandAll, setExpandAll] = useState(false)

  return (
    <AdminShell>
      <div className="max-w-6xl py-8 px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Livegang Dashboard</h1>
          <p className="text-zinc-500 text-sm">Status overzicht voor de livegang van computertraining.nl</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex flex-wrap gap-5 mb-4">
            {(['live', 'configuratie', 'todo', 'niet_nodig'] as Status[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[s].bg} ${statusConfig[s].text}`}>
                  {statusConfig[s].emoji} {statusConfig[s].label}
                </span>
                <span className="text-lg font-semibold text-zinc-900">{totals[s]}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-zinc-500">Totaal:</span>
              <span className="text-lg font-semibold text-zinc-900">{total}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-zinc-500">Voortgang</span>
              <span className="text-sm font-semibold text-primary-600">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full transition-all bg-green-500" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {done} van {done + remaining} items klaar ({remaining} nog te doen)
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button type="button" onClick={() => setExpandAll((v) => !v)} className="text-sm text-primary-600 hover:underline font-medium">
            {expandAll ? 'Alles inklappen' : 'Alles uitklappen'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <CollapsibleSection key={section.title} section={section} forceOpen={expandAll} />
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
