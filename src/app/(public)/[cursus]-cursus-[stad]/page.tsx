import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie } from '@/types'
import { locaties, getLocatieBySlug } from '@/data/locaties'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusCard from '@/components/cursussen/CursusCard'
import { formatPrice, formatDateShort, niveauLabel } from '@/lib/utils'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsBadge } from '@/components/GoogleReviews'
import {
  MapPin, Clock, Users, Award, BookOpen, CheckCircle, Star,
  ArrowRight, Building2, Car, Train, ParkingSquare, Laptop,
  Phone, Shield, Navigation
} from 'lucide-react'

// Parse the combined slug: "excel-basis-cursus-amsterdam" → { cursus: "excel-basis", stad: "amsterdam" }
function parseSlug(fullSlug: string): { cursusSlug: string; stadSlug: string } | null {
  const match = fullSlug.match(/^(.+)-cursus-(.+)$/)
  if (!match) return null
  return { cursusSlug: match[1], stadSlug: match[2] }
}

async function getCursus(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('cursussen')
    .select('*, categorie:categorieen(*)')
    .eq('slug', slug)
    .eq('actief', true)
    .single()
  return data as Cursus | null
}

async function getSessiesForLocatie(cursusId: string, stadNaam: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('cursus_sessies')
    .select('*, locatie:locaties(naam, stad)')
    .eq('cursus_id', cursusId)
    .eq('actief', true)
    .gte('datum', new Date().toISOString().split('T')[0])
    .order('datum')

  const all = (data || []).map((s: Record<string, unknown>) => ({
    ...s,
    locatie_naam: (s.locatie as Record<string, string>)?.naam || '',
    locatie_stad: (s.locatie as Record<string, string>)?.stad || '',
    lesdagen: Array.isArray(s.lesdagen) ? s.lesdagen as string[] : (typeof s.lesdagen === 'string' ? JSON.parse(s.lesdagen as string) : []),
  })) as CursusSessie[]

  // Sessies voor deze stad bovenaan, daarna online, daarna rest
  const local = all.filter(s => s.locatie_stad.toLowerCase() === stadNaam.toLowerCase())
  const online = all.filter(s => s.lesmethode === 'online')
  const nearby = all.filter(s => s.locatie_stad.toLowerCase() !== stadNaam.toLowerCase() && s.lesmethode !== 'online')

  return { local, online, nearby, all }
}

async function getRelatedCursussen(categorieId: string, currentId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('cursussen')
    .select('*, categorie:categorieen(*)')
    .eq('categorie_id', categorieId)
    .eq('actief', true)
    .neq('id', currentId)
    .limit(3)
  return (data || []) as Cursus[]
}

export async function generateMetadata({ params }: { params: { 'cursus-cursus-stad': string } }): Promise<Metadata> {
  const parsed = parseSlug(params['cursus-cursus-stad'])
  if (!parsed) return { title: 'Pagina niet gevonden' }

  const cursus = await getCursus(parsed.cursusSlug)
  const locatie = getLocatieBySlug(parsed.stadSlug)
  if (!cursus || !locatie) return { title: 'Pagina niet gevonden' }

  const title = `${cursus.titel} cursus ${locatie.naam} | Compu Act Opleidingen`
  const description = `Volg de ${cursus.titel} cursus in ${locatie.naam}. Klassikaal op onze locatie aan ${locatie.adres} of live online. Kleine groepen, ervaren docenten, certificaat inbegrepen. Vanaf ${formatPrice(cursus.prijs_vanaf)}.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  }
}

export default async function LocalSeoPage({ params }: { params: { 'cursus-cursus-stad': string } }) {
  const parsed = parseSlug(params['cursus-cursus-stad'])
  if (!parsed) notFound()

  const cursus = await getCursus(parsed.cursusSlug)
  const locatie = getLocatieBySlug(parsed.stadSlug)
  if (!cursus || !locatie) notFound()

  const [sessieData, related, reviewData] = await Promise.all([
    getSessiesForLocatie(cursus.id, locatie.naam),
    getRelatedCursussen(cursus.categorie_id, cursus.id),
    getGoogleReviews().then(r => r ?? fallbackReviews),
  ])

  const allSessies = [...sessieData.local, ...sessieData.online]
  const niveauColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    gevorderd: 'bg-amber-100 text-amber-700',
    expert: 'bg-red-100 text-red-700',
  }

  // Other cities with this course (for internal linking)
  const otherCities = locaties
    .filter(l => l.slug !== parsed.stadSlug)
    .slice(0, 12)

  // Schema.org
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${cursus.titel} cursus ${locatie.naam}`,
    description: cursus.korte_beschrijving,
    provider: {
      '@type': 'Organization',
      name: 'Compu Act Opleidingen',
      url: 'https://www.computertraining.nl',
    },
    location: {
      '@type': 'Place',
      name: `Compu Act Opleidingen ${locatie.naam}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: locatie.adres,
        postalCode: locatie.postcode,
        addressLocality: locatie.naam,
        addressCountry: 'NL',
      },
    },
    offers: {
      '@type': 'Offer',
      price: cursus.prijs_vanaf,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: sessieData.local.slice(0, 5).map(s => ({
      '@type': 'CourseInstance',
      courseMode: 'InPerson',
      startDate: s.datum,
      location: {
        '@type': 'Place',
        name: locatie.naam,
        address: { '@type': 'PostalAddress', addressLocality: locatie.naam, addressCountry: 'NL' },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8 lg:py-10">
          <nav className="text-sm text-zinc-400 mb-5">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/cursussen" className="hover:text-primary-500">Cursussen</a>
            <span className="mx-1.5">/</span>
            <a href={`/cursussen/${cursus.slug}`} className="hover:text-primary-500">{cursus.titel}</a>
            <span className="mx-1.5">/</span>
            <span className="text-zinc-700">{locatie.naam}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left */}
            <div className="flex-1 lg:max-w-2xl">
              <GoogleReviewsBadge rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} />

              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 mb-3 leading-tight">
                {cursus.titel} cursus in {locatie.naam}
              </h1>

              <p className="text-zinc-600 text-lg leading-relaxed mb-5">
                Volg de {cursus.titel} training in {locatie.naam}. Praktijkgericht leren met ervaren docenten in kleine groepen.
                {sessieData.local.length > 0
                  ? ` Eerstvolgende startdatum: ${formatDateShort(sessieData.local[0].datum)}.`
                  : ' Ook beschikbaar als live online training.'}
              </p>

              {/* USPs */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> All-in prijs incl. laptop en certificaat</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Klassikaal, online of incompany</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> {locatie.bereikbaarheid.parkeren.includes('Gratis') ? 'Gratis parkeren' : 'Parkeren bij locatie'}</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a href="#cursusdata" className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]">
                  Bekijk data &amp; inschrijven
                </a>
                <Link href={`/incompany?cursus=${cursus.slug}`} className="inline-flex items-center gap-2 border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all">
                  <Building2 size={16} /> InCompany offerte
                </Link>
              </div>
            </div>

            {/* Right: Locatie info card */}
            <div className="mt-8 lg:mt-0 lg:w-[320px] shrink-0">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden">
                {/* Map embed */}
                <div className="h-40 bg-zinc-200 relative">
                  <iframe
                    src={locatie.mapsEmbed}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Kaart ${locatie.naam}`}
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">Trainingslocatie {locatie.naam}</h2>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="text-primary-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">{locatie.adres}</div>
                        <div className="text-zinc-500">{locatie.postcode} {locatie.naam}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Car size={15} className="text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-zinc-600">{locatie.bereikbaarheid.auto}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Train size={15} className="text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-zinc-600">{locatie.bereikbaarheid.ov}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ParkingSquare size={15} className="text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-zinc-600">{locatie.bereikbaarheid.parkeren}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <Link href={`/locaties/${locatie.slug}`} className="text-sm text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1">
                      Meer over deze locatie <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursusinfo strip */}
      <section className="bg-primary-50 border-b border-primary-100">
        <div className="container-wide py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-zinc-600"><Clock size={15} className="text-primary-500" /> {cursus.duur}</span>
              <span className="flex items-center gap-1.5 text-zinc-600"><Award size={15} className="text-primary-500" /> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${niveauColors[cursus.niveau]}`}>{niveauLabel(cursus.niveau)}</span></span>
              <span className="flex items-center gap-1.5 text-zinc-600"><Users size={15} className="text-primary-500" /> Max 10 deelnemers</span>
              <span className="flex items-center gap-1.5 text-zinc-600"><BookOpen size={15} className="text-primary-500" /> Lesmateriaal inbegrepen</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Vanaf</span>
              <span className="text-2xl font-extrabold text-zinc-900 ml-1.5">{formatPrice(cursus.prijs_vanaf)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-zinc-50">
        <div className="container-wide py-10">
          {/* Wat leer je */}
          {cursus.inhoud?.wat_leer_je && cursus.inhoud.wat_leer_je.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-extrabold mb-5">Wat leer je bij de {cursus.titel} cursus?</h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {cursus.inhoud.wat_leer_je.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg border border-zinc-100 p-3.5">
                    <CheckCircle size={16} className="text-primary-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cursusdata voor deze locatie */}
          <div id="cursusdata" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-extrabold">{cursus.titel} in {locatie.naam}</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {sessieData.local.length} klassikale sessie{sessieData.local.length !== 1 ? 's' : ''} in {locatie.naam}
                  {sessieData.online.length > 0 && ` + ${sessieData.online.length} live online`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <SessieTable sessies={allSessies} cursusTitel={cursus.titel} />
            </div>
          </div>

          {/* Locatie details */}
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-extrabold mb-4">Trainingslocatie {locatie.naam}</h2>
              <p className="text-zinc-600 leading-relaxed mb-5">{locatie.beschrijving.split('\n\n')[0]}</p>
              <div className="space-y-3">
                {locatie.waarom.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-primary-500 shrink-0" />
                    <span className="text-sm text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <iframe
                  src={locatie.mapsEmbed}
                  className="w-full h-64 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Kaart trainingslocatie ${locatie.naam}`}
                />
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Navigation size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    <div><strong>Adres:</strong> {locatie.adres}, {locatie.postcode} {locatie.naam}</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Car size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    <div><strong>Auto:</strong> {locatie.bereikbaarheid.auto}</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Train size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    <div><strong>OV:</strong> {locatie.bereikbaarheid.ov}</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ParkingSquare size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    <div><strong>Parkeren:</strong> {locatie.bereikbaarheid.parkeren}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust section */}
          <div className="mt-12 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Shield size={22} className="text-primary-500 mb-2" />
                <span className="font-semibold text-sm">Niet goed? Geld terug</span>
                <span className="text-xs text-zinc-400 mt-0.5">14 dagen bedenktijd</span>
              </div>
              <div className="flex flex-col items-center">
                <Award size={22} className="text-primary-500 mb-2" />
                <span className="font-semibold text-sm">Erkend certificaat</span>
                <span className="text-xs text-zinc-400 mt-0.5">Na succesvolle afronding</span>
              </div>
              <div className="flex flex-col items-center">
                <Users size={22} className="text-primary-500 mb-2" />
                <span className="font-semibold text-sm">15.000+ cursisten</span>
                <span className="text-xs text-zinc-400 mt-0.5">Succesvol opgeleid</span>
              </div>
              <div className="flex flex-col items-center">
                <Phone size={22} className="text-primary-500 mb-2" />
                <span className="font-semibold text-sm">Persoonlijk advies</span>
                <span className="text-xs text-zinc-400 mt-0.5">023-551 3409</span>
              </div>
            </div>
          </div>

          {/* Gerelateerde cursussen in deze stad */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">Andere cursussen in {locatie.naam}</h2>
                <Link href={`/locaties/${locatie.slug}`} className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600">
                  Alle cursussen <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <CursusCard key={r.id} cursus={r} />
                ))}
              </div>
            </div>
          )}

          {/* Internal links: same course in other cities */}
          <div className="mt-12 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8">
            <h2 className="font-bold text-lg mb-2">{cursus.titel} op andere locaties</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Deze cursus is ook beschikbaar op onze andere trainingslocaties door heel Nederland.
            </p>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${cursus.slug}-cursus-${city.slug}`}
                  className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-lg text-sm text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <MapPin size={12} />
                  {city.naam}
                </Link>
              ))}
              <Link
                href={`/cursussen/${cursus.slug}`}
                className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 px-3.5 py-2 rounded-lg text-sm text-primary-600 font-semibold hover:bg-primary-100 transition-colors"
              >
                Alle locaties <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* InCompany CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold flex items-center gap-3">
                <Building2 size={28} />
                {cursus.titel} als InCompany training in {locatie.naam}
              </h3>
              <p className="text-primary-200 mt-2 max-w-xl leading-relaxed">
                Wil je deze cursus op maat voor jouw team in {locatie.naam} of omgeving? Wij komen naar je locatie met een programma afgestemd op jouw organisatie.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-300 mt-3">
                <span>&#10003; Op je eigen locatie</span>
                <span>&#10003; Inhoud op maat</span>
                <span>&#10003; Voordelig vanaf 4 deelnemers</span>
              </div>
            </div>
            <Link href={`/incompany?cursus=${cursus.slug}`} className="bg-white text-primary-700 px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0">
              InCompany offerte
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
