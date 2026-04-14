import { Metadata } from 'next'
import Link from 'next/link'
import {
  Users, Laptop, BookOpen, Building2, CheckCircle, ArrowRight,
  MapPin, Clock, Award, Monitor, Star, Phone, Shield,
  Wifi, Home, Calendar, Headphones, Settings, UserCheck
} from 'lucide-react'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsBadge } from '@/components/GoogleReviews'

export const metadata: Metadata = {
  title: 'Lesmethodes | Klassikaal, Online, Thuisstudie & InCompany',
  description: 'Kies de lesmethode die bij jou past. Klassikaal op 17 locaties, live online vanuit huis, thuisstudie in je eigen tempo, of InCompany training op maat.',
  openGraph: {
    title: 'Lesmethodes | Klassikaal, Online, Thuisstudie & InCompany | Compu Act Opleidingen',
    description: 'Kies de lesmethode die bij jou past. Klassikaal op 17 locaties, live online vanuit huis, thuisstudie in je eigen tempo, of InCompany training op maat.',
    type: 'website',
  },
}

const methodes = [
  {
    id: 'klassikaal',
    naam: 'Klassikaal',
    icon: Users,
    color: 'bg-primary-500',
    gradient: 'from-primary-500 to-primary-700',
    tagline: 'Leer in een groep, op een van onze 17 locaties',
    beschrijving: 'Bij een klassikale training volg je de cursus op een van onze trainingslocaties door heel Nederland. Je leert in een kleine groep van maximaal 10 deelnemers, onder begeleiding van een ervaren docent. Je krijgt een laptop, lesmateriaal, lunch en na afloop een certificaat.',
    voordelen: [
      'Persoonlijke begeleiding door een ervaren docent',
      'Kleine groepen van maximaal 10 deelnemers',
      'Direct vragen stellen en oefenen met de docent',
      'Laptop en lesmateriaal inbegrepen',
      'Lunch en certificaat inbegrepen',
      'Leren van en met andere cursisten',
    ],
    geschiktVoor: 'Iedereen die het prettig vindt om in een groep te leren met directe interactie en persoonlijke aandacht.',
    praktisch: [
      { icon: MapPin, text: '17 locaties door heel Nederland' },
      { icon: Clock, text: 'Dagcursussen van 10:00 tot 16:00' },
      { icon: Users, text: 'Maximaal 10 deelnemers per groep' },
      { icon: Monitor, text: 'Laptop wordt beschikbaar gesteld' },
    ],
    cta: { text: 'Bekijk locaties', href: '/locaties' },
  },
  {
    id: 'live-online',
    naam: 'Live Online',
    icon: Laptop,
    color: 'bg-accent-500',
    gradient: 'from-accent-500 to-accent-700',
    tagline: 'Dezelfde training, vanuit je eigen werkplek',
    beschrijving: 'Met een live online training volg je de cursus vanuit huis of kantoor via Microsoft Teams. Je hebt dezelfde interactie met de docent als bij een klassikale training, maar dan zonder reistijd. De docent geeft live les en je kunt op elk moment vragen stellen.',
    voordelen: [
      'Geen reistijd — volg de cursus vanuit je eigen werkplek',
      'Dezelfde kwaliteit en interactie als klassikaal',
      'Live begeleiding door een ervaren docent',
      'Direct vragen stellen via chat of microfoon',
      'Vaak voordeliger dan klassikaal',
      'Lesmateriaal en certificaat inbegrepen',
    ],
    geschiktVoor: 'Iedereen die flexibel wil leren zonder reistijd, maar wel de interactie met een docent waardeert.',
    praktisch: [
      { icon: Wifi, text: 'Via Microsoft Teams (link ontvang je vooraf)' },
      { icon: Clock, text: 'Dagcursussen van 10:00 tot 16:00' },
      { icon: Headphones, text: 'Headset aanbevolen' },
      { icon: Monitor, text: 'Eigen laptop/computer nodig' },
    ],
    cta: { text: 'Bekijk cursussen', href: '/cursussen' },
  },
  {
    id: 'thuisstudie',
    naam: 'Thuisstudie',
    icon: BookOpen,
    color: 'bg-violet-500',
    gradient: 'from-violet-500 to-purple-700',
    tagline: 'Leer in je eigen tempo, wanneer het jou uitkomt',
    beschrijving: 'Met thuisstudie leer je in je eigen tempo met uitgebreid digitaal lesmateriaal. Je bepaalt zelf wanneer en waar je studeert. Bij vragen kun je contact opnemen met onze docenten voor persoonlijke begeleiding.',
    voordelen: [
      'Volledig in je eigen tempo leren',
      'Start wanneer jij wilt',
      'Geen vaste lestijden of locatie',
      'Uitgebreid digitaal lesmateriaal',
      'Persoonlijke begeleiding op afstand',
      'Certificaat na afronding',
    ],
    geschiktVoor: 'Zelfdiscipline en eigen tempo belangrijk? Thuisstudie is ideaal voor drukke professionals die flexibiliteit zoeken.',
    praktisch: [
      { icon: Home, text: 'Leer waar en wanneer je wilt' },
      { icon: Calendar, text: 'Start op een zelfgekozen moment' },
      { icon: BookOpen, text: 'Uitgebreid digitaal lesmateriaal' },
      { icon: UserCheck, text: 'Persoonlijke begeleiding beschikbaar' },
    ],
    cta: { text: 'Bekijk cursussen', href: '/cursussen' },
  },
  {
    id: 'incompany',
    naam: 'InCompany',
    icon: Building2,
    color: 'bg-primary-800',
    gradient: 'from-primary-700 to-primary-900',
    tagline: 'Training op maat, op jouw locatie',
    beschrijving: 'Met een InCompany training komt onze docent naar jouw locatie. De inhoud wordt volledig afgestemd op de wensen en het niveau van jouw team. Ideaal voor bedrijven die meerdere medewerkers tegelijk willen trainen met voorbeelden uit de eigen praktijk.',
    voordelen: [
      'Training op je eigen locatie (of online)',
      'Inhoud afgestemd op jouw organisatie',
      'Voorbeelden uit jullie eigen werkpraktijk',
      'Flexibele planning in overleg',
      'Voordelig vanaf 4 deelnemers',
      'Offerte op maat',
    ],
    geschiktVoor: 'Bedrijven en organisaties die een team willen trainen met een programma op maat, afgestemd op hun werkprocessen.',
    praktisch: [
      { icon: MapPin, text: 'Op jouw locatie of online' },
      { icon: Settings, text: 'Inhoud volledig op maat' },
      { icon: Calendar, text: 'Datum en tijd in overleg' },
      { icon: Users, text: 'Voordelig vanaf 4 deelnemers' },
    ],
    cta: { text: 'InCompany offerte aanvragen', href: '/incompany' },
  },
]

export default async function LesmethodesPage() {
  const reviewData = await getGoogleReviews() ?? fallbackReviews

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container-wide relative py-14 lg:py-20">
          <nav className="text-sm mb-6 opacity-60">
            <a href="/" className="hover:opacity-100">Home</a>
            <span className="mx-2">/</span>
            <span className="opacity-100">Lesmethodes</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Kies de lesmethode die bij jou past
            </h1>
            <p className="text-lg text-primary-100 leading-relaxed mb-6">
              Elke cursus is beschikbaar in meerdere vormen. Of je nu klassikaal wilt leren, vanuit huis, in je eigen tempo of met je hele team — wij hebben de juiste oplossing.
            </p>
            <GoogleReviewsBadge rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} />
          </div>

          {/* Quick jump */}
          <div className="flex flex-wrap gap-3 mt-10">
            {methodes.map((m) => {
              const Icon = m.icon
              return (
                <a key={m.id} href={`#${m.id}`} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                  <Icon size={16} /> {m.naam}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vergelijkingstabel */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-10 overflow-x-auto">
          <h2 className="text-2xl font-extrabold mb-6">Vergelijk lesmethodes</h2>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-zinc-200">
                <th className="text-left py-3 pr-4 font-medium text-zinc-500 w-48"></th>
                <th className="text-center py-3 px-3 font-bold"><Users size={16} className="inline mr-1.5 text-primary-500" />Klassikaal</th>
                <th className="text-center py-3 px-3 font-bold"><Laptop size={16} className="inline mr-1.5 text-accent-500" />Live Online</th>
                <th className="text-center py-3 px-3 font-bold"><BookOpen size={16} className="inline mr-1.5 text-violet-500" />Thuisstudie</th>
                <th className="text-center py-3 px-3 font-bold"><Building2 size={16} className="inline mr-1.5 text-primary-700" />InCompany</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                { label: 'Locatie', vals: ['17 locaties NL', 'Vanuit huis/kantoor', 'Overal', 'Jouw locatie'] },
                { label: 'Groepsgrootte', vals: ['Max 10', 'Max 10', 'Individueel', 'Op maat'] },
                { label: 'Interactie docent', vals: ['Live, in persoon', 'Live, via Teams', 'Op afstand', 'Live, in persoon'] },
                { label: 'Eigen tempo', vals: ['Nee', 'Nee', 'Ja', 'In overleg'] },
                { label: 'Laptop nodig', vals: ['Nee (wordt geleverd)', 'Ja', 'Ja', 'In overleg'] },
                { label: 'Certificaat', vals: ['Ja', 'Ja', 'Ja', 'Ja'] },
                { label: 'Lunch inbegrepen', vals: ['Ja', 'Nee', 'Nee', 'In overleg'] },
                { label: 'Inhoud op maat', vals: ['Nee', 'Nee', 'Nee', 'Ja'] },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-3 pr-4 font-medium text-zinc-700">{row.label}</td>
                  {row.vals.map((val, i) => (
                    <td key={i} className="text-center py-3 px-3 text-zinc-600">
                      {val === 'Ja' ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : val === 'Nee' ? <span className="text-zinc-300">—</span> : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodes detail */}
      <div className="container-wide py-12">
        <div className="space-y-16">
          {methodes.map((m) => {
            const Icon = m.icon
            return (
              <section key={m.id} id={m.id} className="scroll-mt-24">
                {/* Header */}
                <div className={`bg-gradient-to-r ${m.gradient} rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden mb-8`}>
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-3 rounded-xl"><Icon size={28} /></div>
                        <h2 className="text-2xl lg:text-3xl font-extrabold">{m.naam}</h2>
                      </div>
                      <p className="text-white/80 text-lg max-w-xl">{m.tagline}</p>
                    </div>
                    <Link href={m.cta.href} className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0 flex items-center gap-2">
                      {m.cta.text} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Beschrijving + voordelen */}
                  <div className="lg:col-span-2">
                    <p className="text-zinc-600 leading-relaxed mb-6">{m.beschrijving}</p>

                    <h3 className="font-bold text-lg mb-4">Voordelen van {m.naam.toLowerCase()}</h3>
                    <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
                      {m.voordelen.map((v) => (
                        <div key={v} className="flex items-start gap-2.5 bg-white rounded-lg border border-zinc-100 p-3.5">
                          <CheckCircle size={16} className="text-primary-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-zinc-700">{v}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-bold text-lg mb-2">Voor wie?</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{m.geschiktVoor}</p>
                  </div>

                  {/* Praktische info */}
                  <div>
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                      <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4">Praktische info</h3>
                      <div className="space-y-3">
                        {m.praktisch.map((p) => (
                          <div key={p.text} className="flex items-start gap-3">
                            <p.icon size={16} className="text-primary-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-zinc-700">{p.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-zinc-100">
                        <Link href={m.cta.href} className="text-sm text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1">
                          {m.cta.text} <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        {/* Trust */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mt-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: 'Niet goed? Geld terug', sub: '14 dagen bedenktijd' },
              { icon: Award, label: 'Erkend certificaat', sub: 'Bij alle lesmethodes' },
              { icon: Star, label: `${reviewData.rating} Google rating`, sub: `${reviewData.user_ratings_total} reviews` },
              { icon: Phone, label: 'Advies nodig?', sub: '023-551 3409' },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center">
                <t.icon size={22} className="text-primary-500 mb-2" />
                <span className="font-semibold text-sm">{t.label}</span>
                <span className="text-xs text-zinc-400 mt-0.5">{t.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Niet zeker welke methode past?</h2>
          <p className="text-primary-200 mb-6 max-w-xl mx-auto">Neem contact op met onze opleidingsadviseurs. Zij helpen je graag bij het kiezen van de juiste lesmethode en cursus.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:0235513409" className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-all"><Phone size={16} /> 023-551 3409</a>
            <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/25 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">Stuur een bericht <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
