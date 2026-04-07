import Link from 'next/link'
import {
  Monitor, Users, MapPin, Award, ArrowRight, Building2, Laptop,
  FileSpreadsheet, FileText, Bot, Mail, Presentation, BarChart3,
  CheckCircle, Zap, Clock, Shield
} from 'lucide-react'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsSection } from '@/components/GoogleReviews'
import { StudiegidsCTA } from '@/components/StudiegidsModal'

const categorieen = [
  { naam: 'Excel', slug: 'excel', icon: FileSpreadsheet, color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { naam: 'Word', slug: 'word', icon: FileText, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { naam: 'Outlook', slug: 'outlook', icon: Mail, color: 'bg-sky-100 text-sky-700 hover:bg-sky-200' },
  { naam: 'PowerPoint', slug: 'powerpoint', icon: Presentation, color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
  { naam: 'Power BI', slug: 'power-bi', icon: BarChart3, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { naam: 'Office 365', slug: 'office-365', icon: Monitor, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { naam: 'AI', slug: 'ai', icon: Bot, color: 'bg-violet-100 text-violet-700 hover:bg-violet-200' },
]

const stats = [
  { value: '21+', label: 'Jaar ervaring', icon: Award, href: '/over-ons' },
  { value: '15.000+', label: 'Deelnemers', icon: Users, href: '/over-ons' },
  { value: '17', label: 'Locaties', icon: MapPin, href: '/locaties' },
  { value: '26', label: 'Cursussen', icon: Monitor, href: '/cursussen' },
]

const populaireCursussen = [
  { titel: 'Excel Basis', slug: 'excel-basis', prijs: 335, niveau: 'Beginner', duur: '1 dag', cat: 'Excel', gradient: 'from-emerald-500 to-emerald-700', icon: FileSpreadsheet },
  { titel: 'Excel Gevorderd', slug: 'excel-gevorderd', prijs: 335, niveau: 'Gevorderd', duur: '1 dag', cat: 'Excel', gradient: 'from-emerald-500 to-emerald-700', icon: FileSpreadsheet },
  { titel: 'Power BI Desktop', slug: 'power-bi-desktop', prijs: 515, niveau: 'Gevorderd', duur: '1 dag', cat: 'Power BI', gradient: 'from-yellow-500 to-amber-600', icon: BarChart3 },
  { titel: 'Prompting met AI', slug: 'prompting-met-ai', prijs: 335, niveau: 'Beginner', duur: '1 dag', cat: 'AI', gradient: 'from-violet-500 to-purple-700', icon: Bot, badge: 'Nieuw' },
  { titel: 'Word Basis', slug: 'word-basis', prijs: 335, niveau: 'Beginner', duur: '1 dag', cat: 'Word', gradient: 'from-blue-500 to-blue-700', icon: FileText },
  { titel: 'Outlook Alles-in-een', slug: 'outlook-alles-in-een', prijs: 335, niveau: 'Beginner', duur: '1 dag', cat: 'Outlook', gradient: 'from-sky-500 to-sky-700', icon: Mail },
]

const lesmethodes = [
  {
    icon: Users,
    titel: 'Klassikaal',
    beschrijving: 'Leer in een kleine groep op een van onze 17 locaties door heel Nederland. Persoonlijke begeleiding door ervaren docenten.',
    features: ['Max 10 deelnemers', 'Lesmateriaal inbegrepen', 'Certificaat'],
    href: '/locaties',
    color: 'bg-primary-500',
  },
  {
    icon: Laptop,
    titel: 'Live Online',
    beschrijving: 'Volg de training vanuit huis of kantoor. Dezelfde kwaliteit en interactie, maar dan via een live verbinding.',
    features: ['Vanuit huis/kantoor', 'Live interactie', 'Voordeliger'],
    href: '/cursussen',
    color: 'bg-accent-500',
  },
  {
    icon: Building2,
    titel: 'InCompany',
    beschrijving: 'Training op maat op uw eigen locatie. Inhoud volledig afgestemd op de wensen van uw organisatie.',
    features: ['Op uw locatie', 'Maatwerk programma', 'Flexibele planning'],
    href: '/incompany',
    color: 'bg-primary-800',
  },
]

export default async function HomePage() {
  const reviewData = await getGoogleReviews() ?? fallbackReviews
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />

        <div className="container-wide relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} />
              Nieuw: AI cursussen nu beschikbaar
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Microsoft Office trainingen die je{' '}
              <span className="text-accent-400">direct</span> verder helpen
            </h1>
            <p className="text-lg sm:text-xl text-primary-200 mb-10 leading-relaxed max-w-2xl">
              Klassikaal, live online of incompany. Al meer dan 21 jaar de specialist in
              praktijkgerichte Microsoft Office cursussen door heel Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cursussen"
                className="inline-flex items-center justify-center bg-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/25 transition-all active:scale-[0.98]"
              >
                Bekijk alle cursussen
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                href="/incompany"
                className="inline-flex items-center justify-center border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                InCompany offerte
              </Link>
            </div>
          </div>

          {/* Categorie chips */}
          <div className="mt-14 flex flex-wrap gap-2">
            <span className="text-sm text-primary-400 mr-2 self-center">Populair:</span>
            {categorieen.map((cat) => (
              <Link
                key={cat.slug}
                href={`/cursussen/${cat.slug}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${cat.color}`}
              >
                <cat.icon size={14} />
                {cat.naam}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const content = (
                <>
                  <div className="bg-primary-50 text-primary-500 p-3 rounded-xl">
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-zinc-900">{stat.value}</div>
                    <div className="text-sm text-zinc-500">{stat.label}</div>
                  </div>
                </>
              )
              return 'href' in stat && stat.href ? (
                <Link key={stat.label} href={stat.href} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  {content}
                </Link>
              ) : (
                <div key={stat.label} className="flex items-center gap-4">
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Populaire cursussen */}
      <section className="bg-zinc-50">
        <div className="container-wide py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">Populaire cursussen</h2>
              <p className="text-zinc-500 max-w-lg">
                Onze meest gevolgde Microsoft Office trainingen. Direct inschrijven of vraag een offerte aan.
              </p>
            </div>
            <Link
              href="/cursussen"
              className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 shrink-0"
            >
              Alle cursussen <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {populaireCursussen.map((cursus) => (
              <Link key={cursus.slug} href={`/cursussen/${cursus.slug}`} className="group">
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-200">
                  <div className={`h-32 bg-gradient-to-br ${cursus.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <cursus.icon size={44} className="text-white/90 relative z-10" strokeWidth={1.5} />
                    {cursus.badge && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-accent-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {cursus.badge}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {cursus.cat}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                        {cursus.niveau}
                      </span>
                      <span className="text-[11px] text-zinc-500">{cursus.duur}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary-500 transition-colors">{cursus.titel}</h3>
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                      <div>
                        <span className="text-xs text-zinc-400">vanaf</span>
                        <span className="text-lg font-bold text-zinc-900 ml-1">&euro;{cursus.prijs}</span>
                      </div>
                      <span className="text-sm text-primary-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Bekijk <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lesmethodes */}
      <section className="bg-white">
        <div className="container-wide py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Kies jouw lesmethode</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Elke cursus is beschikbaar in meerdere vormen. Kies wat het beste bij jou past.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {lesmethodes.map((methode) => (
              <Link key={methode.titel} href={methode.href} className="group">
                <div className="bg-white rounded-2xl border-2 border-zinc-100 p-8 h-full transition-all duration-300 group-hover:border-primary-200 group-hover:shadow-lg">
                  <div className={`${methode.color} text-white p-4 rounded-2xl inline-block mb-5`}>
                    <methode.icon size={28} />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{methode.titel}</h3>
                  <p className="text-zinc-500 text-sm mb-5 leading-relaxed">{methode.beschrijving}</p>
                  <ul className="space-y-2">
                    {methode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                        <CheckCircle size={15} className="text-primary-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="bg-zinc-50">
        <div className="container-wide py-20">
          <GoogleReviewsSection
            reviews={reviewData.reviews}
            allReviews={reviewData.allReviews}
            rating={reviewData.rating}
            totalReviews={reviewData.user_ratings_total}
          />
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-y border-zinc-200">
        <div className="container-wide py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <Link href="/algemene-voorwaarden#artikel-3" className="flex flex-col items-center group hover:opacity-80 transition-opacity">
              <Shield size={24} className="text-primary-500 mb-2" />
              <span className="font-semibold text-sm group-hover:text-primary-500 transition-colors">Niet goed? Geld terug</span>
              <span className="text-xs text-zinc-400 mt-0.5">Annuleer tot 14 dagen van tevoren</span>
            </Link>
            <Link href="/lesmethodes" className="flex flex-col items-center group hover:opacity-80 transition-opacity">
              <Award size={24} className="text-primary-500 mb-2" />
              <span className="font-semibold text-sm group-hover:text-primary-500 transition-colors">Erkend certificaat</span>
              <span className="text-xs text-zinc-400 mt-0.5">Na succesvolle afronding</span>
            </Link>
            <Link href="/algemene-voorwaarden#artikel-3" className="flex flex-col items-center group hover:opacity-80 transition-opacity">
              <Clock size={24} className="text-primary-500 mb-2" />
              <span className="font-semibold text-sm group-hover:text-primary-500 transition-colors">Flexibel plannen</span>
              <span className="text-xs text-zinc-400 mt-0.5">Verplaats kosteloos uw datum</span>
            </Link>
            <Link href="/incompany" className="flex flex-col items-center group hover:opacity-80 transition-opacity">
              <Users size={24} className="text-primary-500 mb-2" />
              <span className="font-semibold text-sm group-hover:text-primary-500 transition-colors">500+ bedrijven</span>
              <span className="text-xs text-zinc-400 mt-0.5">Vertrouwen op Compu Act</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Studiegids CTA */}
      <section className="bg-white">
        <div className="container-wide py-12">
          <StudiegidsCTA />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-wide py-20 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Klaar om te starten?
            </h2>
            <p className="text-primary-200 mb-10 text-lg leading-relaxed">
              Bekijk ons cursusaanbod, kies je favoriete lesmethode en schrijf je direct in.
              Of vraag een vrijblijvende offerte aan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cursussen"
                className="inline-flex items-center justify-center bg-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/25 transition-all active:scale-[0.98]"
              >
                Bekijk cursussen <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
