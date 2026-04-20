import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie, Categorie } from '@/types'
import { locaties, getLocatieBySlug, type Locatie as LocatieData } from '@/data/locaties'
import { getStadBySlug, berekenAfstand } from '@/data/steden'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusCard from '@/components/cursussen/CursusCard'
import { formatPrice, formatDateShort, niveauLabel } from '@/lib/utils'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsBadge } from '@/components/GoogleReviews'
import {
  MapPin, Clock, Users, Award, BookOpen, CheckCircle,
  ArrowRight, Building2, Car, Train, ParkingSquare,
  Phone, Shield, Navigation, Laptop
} from 'lucide-react'

// Known category slugs that map to categorie+stad pages
const CATEGORIE_SLUGS = ['excel', 'word', 'outlook', 'powerpoint', 'power-bi', 'office-365', 'ai', 'project', 'visio', 'vba']

type ParsedSlug =
  | { type: 'cursus'; cursusSlug: string; stadSlug: string }
  | { type: 'categorie'; categorieSlug: string; stadSlug: string }

function parseSlug(slug: string): ParsedSlug | null {
  const match = slug.match(/^(.+)-cursus-(.+)$/)
  if (!match) return null
  const [, prefix, stadSlug] = match
  if (CATEGORIE_SLUGS.includes(prefix)) {
    return { type: 'categorie', categorieSlug: prefix, stadSlug }
  }
  return { type: 'cursus', cursusSlug: prefix, stadSlug }
}

async function getCursus(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('slug', slug).eq('actief', true).single()
  return data as Cursus | null
}

async function getCategorie(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('categorieen').select('*').eq('slug', slug).single()
  return data as Categorie | null
}

async function getCursussenByCategorie(categorieId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('categorie_id', categorieId).eq('actief', true).order('titel')
  return (data || []) as Cursus[]
}

async function getSessies(cursusId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursus_sessies').select('*, locatie:locaties(naam, stad)').eq('cursus_id', cursusId).eq('actief', true).gte('datum', new Date().toISOString().split('T')[0]).order('datum')
  return (data || []).map((s: Record<string, unknown>) => ({
    ...s,
    locatie_naam: (s.locatie as Record<string, string>)?.naam || '',
    locatie_stad: (s.locatie as Record<string, string>)?.stad || '',
    lesdagen: Array.isArray(s.lesdagen) ? s.lesdagen as string[] : (typeof s.lesdagen === 'string' ? JSON.parse(s.lesdagen as string) : []),
  })) as CursusSessie[]
}

async function getRelated(categorieId: string, currentId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('categorie_id', categorieId).eq('actief', true).neq('id', currentId).limit(3)
  return (data || []) as Cursus[]
}

function findNearestLocaties(lat: number, lng: number, count: number = 3): (LocatieData & { afstand: number })[] {
  return locaties
    .map(l => ({ ...l, afstand: Math.round(berekenAfstand(lat, lng, l.lat, l.lng)) }))
    .sort((a, b) => a.afstand - b.afstand)
    .slice(0, count)
}

import { extraSteden } from '@/data/steden'

export const revalidate = 86400 // Revalidate daily

// Generate all cursus+stad and categorie+stad combinations at build time
export async function generateStaticParams() {
  const { createServiceRoleClient } = await import('@/lib/supabase/server')
  const supabase = createServiceRoleClient()
  const { data: cursusData } = await supabase.from('cursussen').select('slug').eq('actief', true)
  const cursussen = cursusData || []

  const alleSteden = [
    ...locaties.map(l => l.slug),
    ...extraSteden.map(s => s.slug),
  ]

  const params: { slug: string }[] = []

  // Cursus + stad combinations (e.g. excel-basis-cursus-amsterdam)
  for (const cursus of cursussen) {
    for (const stad of alleSteden) {
      params.push({ slug: `${cursus.slug}-cursus-${stad}` })
    }
  }

  // Categorie + stad combinations (e.g. excel-cursus-amsterdam)
  for (const cat of CATEGORIE_SLUGS) {
    for (const stad of alleSteden) {
      params.push({ slug: `${cat}-cursus-${stad}` })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const parsed = parseSlug(params.slug)
  if (!parsed) return { title: 'Niet gevonden' }

  const locatie = getLocatieBySlug(parsed.stadSlug)
  const stad = !locatie ? getStadBySlug(parsed.stadSlug) : null
  const stadNaam = locatie?.naam || stad?.naam
  if (!stadNaam) return { title: 'Niet gevonden' }

  if (parsed.type === 'categorie') {
    const categorie = await getCategorie(parsed.categorieSlug)
    if (!categorie) return { title: 'Niet gevonden' }
    const title = `${categorie.naam} cursus ${stadNaam} | Compu Act Opleidingen`
    const description = `Bekijk alle ${categorie.naam} cursussen in ${stadNaam}. Van beginner tot expert. Klassikaal${locatie ? ` aan ${locatie.adres}` : ''} of live online. Compu Act Opleidingen.`
    return { title, description, openGraph: { title, description, type: 'website' } }
  }

  const cursus = await getCursus(parsed.cursusSlug)
  if (!cursus) return { title: 'Niet gevonden' }
  const title = `${cursus.titel} cursus ${stadNaam} | Compu Act Opleidingen`
  const description = locatie
    ? `Volg de ${cursus.titel} cursus in ${stadNaam}. Klassikaal aan ${locatie.adres} of live online. Kleine groepen, ervaren docenten. Vanaf ${formatPrice(cursus.prijs_vanaf)}.`
    : `Zoek je een ${cursus.titel} cursus bij ${stadNaam}? Compu Act biedt trainingen op locaties dichtbij en live online. Vanaf ${formatPrice(cursus.prijs_vanaf)}.`
  return { title, description, openGraph: { title, description, type: 'website' } }
}

export default async function LocalSeoPage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug)
  if (!parsed) notFound()

  // ─── CATEGORIE + STAD ───
  if (parsed.type === 'categorie') {
    return <CategoriStadPage categorieSlug={parsed.categorieSlug} stadSlug={parsed.stadSlug} />
  }

  // ─── CURSUS + STAD ───
  const cursus = await getCursus(parsed.cursusSlug)
  if (!cursus) notFound()

  // Stad kan een eigen locatie zijn OF een extra stad zonder locatie
  const eigenLocatie = getLocatieBySlug(parsed.stadSlug)
  const extraStad = !eigenLocatie ? getStadBySlug(parsed.stadSlug) : null
  if (!eigenLocatie && !extraStad) notFound()

  const stadNaam = eigenLocatie?.naam || extraStad!.naam
  const heeftEigenLocatie = !!eigenLocatie

  // Dichtstbijzijnde locaties (voor steden zonder eigen locatie)
  const nearestLocaties = !heeftEigenLocatie
    ? findNearestLocaties(extraStad!.lat, extraStad!.lng, 3)
    : []

  const [allSessies, related, reviewData] = await Promise.all([
    getSessies(cursus.id),
    getRelated(cursus.categorie_id, cursus.id),
    getGoogleReviews().then(r => r ?? fallbackReviews),
  ])

  // Filter sessies
  let displaySessies: CursusSessie[]
  if (heeftEigenLocatie) {
    const local = allSessies.filter(s => s.locatie_stad.toLowerCase() === stadNaam.toLowerCase())
    const online = allSessies.filter(s => s.lesmethode === 'online')
    displaySessies = [...local, ...online]
  } else {
    // Toon sessies van de dichtstbijzijnde locaties + online
    const nearbyNames = nearestLocaties.map(l => l.naam.toLowerCase())
    const nearby = allSessies.filter(s => nearbyNames.includes(s.locatie_stad.toLowerCase()))
    const online = allSessies.filter(s => s.lesmethode === 'online')
    displaySessies = [...nearby, ...online]
  }

  const niveauColors: Record<string, string> = { beginner: 'bg-green-100 text-green-700', gevorderd: 'bg-amber-100 text-amber-700', expert: 'bg-red-100 text-red-700' }
  const otherCities = locaties.filter(l => l.slug !== parsed.stadSlug).slice(0, 12)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: `${cursus.titel} cursus ${stadNaam}`,
    description: cursus.korte_beschrijving,
    provider: { '@type': 'Organization', name: 'Compu Act Opleidingen', url: 'https://www.computertraining.nl' },
    ...(heeftEigenLocatie ? {
      location: { '@type': 'Place', name: `Compu Act ${stadNaam}`, address: { '@type': 'PostalAddress', streetAddress: eigenLocatie!.adres, postalCode: eigenLocatie!.postcode, addressLocality: stadNaam, addressCountry: 'NL' } }
    } : {}),
    offers: { '@type': 'Offer', price: cursus.prijs_vanaf, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
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
            <span className="text-zinc-700">{stadNaam}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-10">
            <div className="flex-1 lg:max-w-2xl">
              <GoogleReviewsBadge rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} />
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 mb-3 leading-tight">
                {cursus.titel} cursus in {stadNaam}
              </h1>
              <p className="text-zinc-600 text-lg leading-relaxed mb-5">
                {heeftEigenLocatie ? (
                  <>Volg de {cursus.titel} training in {stadNaam}. Praktijkgericht leren met ervaren docenten in kleine groepen. {displaySessies.length > 0 && displaySessies[0].datum ? `Eerstvolgende startdatum: ${formatDateShort(displaySessies[0].datum)}.` : ''}</>
                ) : (
                  <>Op zoek naar een {cursus.titel} cursus in de buurt van {stadNaam}? Compu Act Opleidingen biedt deze training aan op {nearestLocaties.length} locaties dichtbij {stadNaam} en als live online training.</>
                )}
              </p>

              {/* USPs */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> All-in prijs incl. materiaal en certificaat</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Klassikaal, online of incompany</span>
                {heeftEigenLocatie && eigenLocatie!.bereikbaarheid.parkeren.includes('Gratis') && (
                  <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Gratis parkeren</span>
                )}
                {!heeftEigenLocatie && (
                  <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> {nearestLocaties[0]?.afstand} km van {stadNaam}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#cursusdata" className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]">
                  Bekijk data &amp; inschrijven
                </a>
                <Link href={`/incompany?cursus=${cursus.slug}`} className="inline-flex items-center gap-2 border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all">
                  <Building2 size={16} /> InCompany offerte
                </Link>
              </div>
            </div>

            {/* Right panel */}
            <div className="mt-8 lg:mt-0 lg:w-[320px] shrink-0">
              {heeftEigenLocatie ? (
                /* Eigen locatie kaart */
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden">
                  <LazyMap src={eigenLocatie!.mapsEmbed} title={`Kaart ${stadNaam}`} height="h-40" />
                  <div className="p-5">
                    <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">Locatie {stadNaam}</h2>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-start gap-2.5"><MapPin size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><div className="font-medium">{eigenLocatie!.adres}</div><div className="text-zinc-500">{eigenLocatie!.postcode} {stadNaam}</div></div></div>
                      <div className="flex items-start gap-2.5"><Car size={15} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-zinc-600">{eigenLocatie!.bereikbaarheid.auto}</span></div>
                      <div className="flex items-start gap-2.5"><Train size={15} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-zinc-600">{eigenLocatie!.bereikbaarheid.ov}</span></div>
                      <div className="flex items-start gap-2.5"><ParkingSquare size={15} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-zinc-600">{eigenLocatie!.bereikbaarheid.parkeren}</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-200">
                      <Link href={`/locaties/${eigenLocatie!.slug}`} className="text-sm text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1">Meer over deze locatie <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dichtstbijzijnde locaties card */
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                  <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">
                    <MapPin size={13} className="inline mr-1" />
                    Dichtstbijzijnde locaties
                  </h2>
                  <div className="space-y-3">
                    {nearestLocaties.map((loc, i) => (
                      <Link
                        key={loc.slug}
                        href={`/locaties/${loc.slug}`}
                        className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-zinc-100 hover:border-primary-200 hover:shadow-sm transition-all group"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-primary-500 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm group-hover:text-primary-500 transition-colors">{loc.naam}</div>
                          <div className="text-xs text-zinc-500">{loc.adres}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{loc.bereikbaarheid.parkeren}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-primary-500">{loc.afstand} km</div>
                          <div className="text-[10px] text-zinc-400">afstand</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-200">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Laptop size={14} className="text-accent-500" />
                      <span>Of volg de cursus <strong className="text-zinc-700">live online</strong> vanuit {stadNaam}</span>
                    </div>
                  </div>
                </div>
              )}
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
              <span className="flex items-center gap-1.5 text-zinc-600"><BookOpen size={15} className="text-primary-500" /> Inclusief materiaal</span>
            </div>
            <div><span className="text-xs text-zinc-400">Vanaf</span><span className="text-2xl font-extrabold text-zinc-900 ml-1.5">{formatPrice(cursus.prijs_vanaf)}</span></div>
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

          {/* Cursusdata */}
          <div id="cursusdata" className="scroll-mt-24 mb-12">
            <h2 className="text-2xl font-extrabold mb-1">
              {heeftEigenLocatie
                ? `${cursus.titel} in ${stadNaam}`
                : `${cursus.titel} in de buurt van ${stadNaam}`}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
              {heeftEigenLocatie
                ? `Sessies in ${stadNaam} en live online`
                : `Sessies op ${nearestLocaties.map(l => l.naam).join(', ')} en live online`}
            </p>
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <SessieTable sessies={displaySessies} cursusTitel={cursus.titel} />
            </div>
          </div>

          {/* Locatie details — alleen bij eigen locatie */}
          {heeftEigenLocatie && (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Trainingslocatie {stadNaam}</h2>
                <p className="text-zinc-600 leading-relaxed mb-5">{eigenLocatie!.beschrijving.split('\n\n')[0]}</p>
                <div className="space-y-3">
                  {eigenLocatie!.waarom.map((item) => (
                    <div key={item} className="flex items-center gap-2.5"><CheckCircle size={16} className="text-primary-500 shrink-0" /><span className="text-sm text-zinc-700">{item}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <iframe src={eigenLocatie!.mapsEmbed} className="w-full h-56 border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Kaart ${stadNaam}`} />
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex items-start gap-2.5"><Navigation size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><strong>Adres:</strong> {eigenLocatie!.adres}, {eigenLocatie!.postcode} {stadNaam}</div></div>
                  <div className="flex items-start gap-2.5"><Car size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><strong>Auto:</strong> {eigenLocatie!.bereikbaarheid.auto}</div></div>
                  <div className="flex items-start gap-2.5"><Train size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><strong>OV:</strong> {eigenLocatie!.bereikbaarheid.ov}</div></div>
                  <div className="flex items-start gap-2.5"><ParkingSquare size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><strong>Parkeren:</strong> {eigenLocatie!.bereikbaarheid.parkeren}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* Bij geen eigen locatie: uitleg dichtstbijzijnde locaties */}
          {!heeftEigenLocatie && (
            <div className="mb-12">
              <h2 className="text-2xl font-extrabold mb-4">Trainingslocaties bij {stadNaam}</h2>
              <p className="text-zinc-600 mb-6 max-w-2xl">
                Compu Act heeft geen trainingslocatie in {stadNaam} zelf, maar je kunt de {cursus.titel} cursus volgen op een van deze locaties in de buurt. Je kunt de cursus ook <strong>live online</strong> volgen vanuit {stadNaam}.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearestLocaties.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locaties/${loc.slug}`}
                    className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-primary-200 hover:shadow-md transition-all group"
                  >
                    <iframe src={loc.mapsEmbed} className="w-full h-32 border-0 pointer-events-none" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Kaart ${loc.naam}`} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold group-hover:text-primary-500 transition-colors">{loc.naam}</h3>
                        <span className="text-sm font-bold text-primary-500">{loc.afstand} km</span>
                      </div>
                      <p className="text-xs text-zinc-500">{loc.adres}, {loc.postcode}</p>
                      <p className="text-xs text-zinc-400 mt-1">{loc.bereikbaarheid.parkeren}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trust */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, label: 'Niet goed? Geld terug', sub: '14 dagen bedenktijd' },
                { icon: Award, label: 'Erkend certificaat', sub: 'Na succesvolle afronding' },
                { icon: Users, label: '15.000+ cursisten', sub: 'Succesvol opgeleid' },
                { icon: Phone, label: 'Persoonlijk advies', sub: '023-551 3409' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <t.icon size={22} className="text-primary-500 mb-2" />
                  <span className="font-semibold text-sm">{t.label}</span>
                  <span className="text-xs text-zinc-400 mt-0.5">{t.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gerelateerde cursussen */}
          {related.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">Andere cursussen {heeftEigenLocatie ? `in ${stadNaam}` : `bij ${stadNaam}`}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => <CursusCard key={r.id} cursus={r} />)}
              </div>
            </div>
          )}

          {/* SEO content block met interne links */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-3">Over de {cursus.titel} training</h2>
            <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
              <p>
                De <Link href={`/cursussen/${cursus.slug}`} className="text-primary-500 font-semibold hover:text-primary-600">{cursus.titel} cursus</Link> is een van onze populairste{' '}
                {cursus.categorie && <Link href={`/cursussen/${(cursus.categorie as unknown as {slug: string}).slug}`} className="text-primary-500 hover:text-primary-600">{(cursus.categorie as unknown as {naam: string}).naam} trainingen</Link>}.
                {' '}Onze ervaren docenten werken met praktijkvoorbeelden zodat je het geleerde direct kunt toepassen.
              </p>
              <p>
                Bekijk ons complete <Link href="/cursussen" className="text-primary-500 hover:text-primary-600">cursusaanbod</Link> of vraag een <Link href="/incompany" className="text-primary-500 hover:text-primary-600">incompany offerte</Link> aan voor training op je eigen locatie.
              </p>
            </div>
          </div>

          {/* Alle categoriepagina's */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-2">Alle cursuscategorieën</h2>
            <p className="text-sm text-zinc-500 mb-4">Bekijk ons complete aanbod aan trainingen.</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIE_SLUGS.map((slug) => {
                const catSlug = cursus.categorie ? (cursus.categorie as unknown as {slug: string}).slug : ''
                return (
                  <Link key={slug} href={`/cursussen/${slug}`} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${slug === catSlug ? 'bg-primary-500 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'}`}>
                    <BookOpen size={12} /> {slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Interne links: zelfde cursus in andere steden */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-2"><Link href={`/cursussen/${cursus.slug}`} className="hover:text-primary-500">{cursus.titel}</Link> op andere locaties</h2>
            <p className="text-sm text-zinc-500 mb-4">Deze cursus is beschikbaar op al onze <Link href="/locaties" className="text-primary-500 hover:text-primary-600">trainingslocaties</Link> door heel Nederland.</p>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((city) => (
                <Link key={city.slug} href={`/${cursus.slug}-cursus-${city.slug}`} className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-lg text-sm text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                  <MapPin size={12} /> {city.naam}
                </Link>
              ))}
              <Link href={`/cursussen/${cursus.slug}`} className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 px-3.5 py-2 rounded-lg text-sm text-primary-600 font-semibold hover:bg-primary-100 transition-colors">
                Alle locaties <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* InCompany CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold flex items-center gap-3"><Building2 size={28} />{cursus.titel} als InCompany training</h3>
              <p className="text-primary-200 mt-2 max-w-xl leading-relaxed">Wil je deze cursus op maat voor jouw team in {stadNaam}? Wij komen naar je locatie met een programma afgestemd op jouw organisatie.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-300 mt-3">
                <span>&#10003; Op je eigen locatie</span><span>&#10003; Inhoud op maat</span><span>&#10003; Voordelig vanaf 4 deelnemers</span>
              </div>
            </div>
            <Link href={`/incompany?cursus=${cursus.slug}`} className="bg-white text-primary-700 px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0">InCompany offerte</Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════
// CATEGORIE + STAD PAGE (e.g. /excel-cursus-amsterdam)
// ════════════════════════════════════════════════════════════

async function CategoriStadPage({ categorieSlug, stadSlug }: { categorieSlug: string; stadSlug: string }) {
  const categorie = await getCategorie(categorieSlug)
  if (!categorie) notFound()

  const eigenLocatie = getLocatieBySlug(stadSlug)
  const extraStad = !eigenLocatie ? getStadBySlug(stadSlug) : null
  if (!eigenLocatie && !extraStad) notFound()

  const stadNaam = eigenLocatie?.naam || extraStad!.naam
  const heeftEigenLocatie = !!eigenLocatie
  const nearestLocaties = !heeftEigenLocatie ? findNearestLocaties(extraStad!.lat, extraStad!.lng, 3) : []

  const [cursussen, reviewData] = await Promise.all([
    getCursussenByCategorie(categorie.id),
    getGoogleReviews().then(r => r ?? fallbackReviews),
  ])

  const prijsRange = cursussen.length > 0 ? Math.min(...cursussen.map(c => c.prijs_vanaf)) : 0
  const niveaus = [...new Set(cursussen.map(c => c.niveau))]
  const niveauColors: Record<string, string> = { beginner: 'bg-green-100 text-green-700', gevorderd: 'bg-amber-100 text-amber-700', expert: 'bg-red-100 text-red-700' }

  // Other categories for cross-links
  const otherCategories = CATEGORIE_SLUGS.filter(s => s !== categorieSlug).slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `${categorie.naam} cursussen ${stadNaam}`,
    numberOfItems: cursussen.length,
    itemListElement: cursussen.map((c, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Course', name: c.titel, url: `https://www.computertraining.nl/${c.slug}-cursus-${stadSlug}`, offers: { '@type': 'Offer', price: c.prijs_vanaf, priceCurrency: 'EUR' } },
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
            <a href={`/cursussen/${categorieSlug}`} className="hover:text-primary-500">{categorie.naam}</a>
            <span className="mx-1.5">/</span>
            <span className="text-zinc-700">{stadNaam}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-10">
            <div className="flex-1 lg:max-w-2xl">
              <GoogleReviewsBadge rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} />
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 mb-3 leading-tight">
                {categorie.naam} cursus in {stadNaam}
              </h1>
              <p className="text-zinc-600 text-lg leading-relaxed mb-5">
                {heeftEigenLocatie ? (
                  <>Bekijk alle {cursussen.length} {categorie.naam} cursussen in {stadNaam}. Van beginner tot expert, klassikaal op onze locatie of live online. Praktijkgericht leren met ervaren docenten.</>
                ) : (
                  <>Op zoek naar een {categorie.naam} cursus in de buurt van {stadNaam}? Wij bieden {cursussen.length} {categorie.naam} trainingen aan op locaties dichtbij {stadNaam} en als live online cursus.</>
                )}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> {cursussen.length} {categorie.naam} cursussen</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Vanaf {formatPrice(prijsRange)}</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Klassikaal en live online</span>
              </div>

              {/* Niveau badges */}
              <div className="flex gap-2 mb-6">
                {niveaus.map((n) => (
                  <span key={n} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${niveauColors[n]}`}>{niveauLabel(n)}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#aanbod" className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]">
                  Bekijk alle {categorie.naam} cursussen
                </a>
                <Link href="/incompany" className="inline-flex items-center gap-2 border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all">
                  <Building2 size={16} /> InCompany offerte
                </Link>
              </div>
            </div>

            {/* Right panel */}
            <div className="mt-8 lg:mt-0 lg:w-[320px] shrink-0">
              {heeftEigenLocatie ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden">
                  <LazyMap src={eigenLocatie!.mapsEmbed} title={`Kaart ${stadNaam}`} height="h-40" />
                  <div className="p-5">
                    <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">Locatie {stadNaam}</h2>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-start gap-2.5"><MapPin size={15} className="text-primary-500 mt-0.5 shrink-0" /><div><div className="font-medium">{eigenLocatie!.adres}</div><div className="text-zinc-500">{eigenLocatie!.postcode} {stadNaam}</div></div></div>
                      <div className="flex items-start gap-2.5"><Car size={15} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-zinc-600">{eigenLocatie!.bereikbaarheid.auto}</span></div>
                      <div className="flex items-start gap-2.5"><ParkingSquare size={15} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-zinc-600">{eigenLocatie!.bereikbaarheid.parkeren}</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-200">
                      <Link href={`/locaties/${eigenLocatie!.slug}`} className="text-sm text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1">Meer over deze locatie <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                  <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3"><MapPin size={13} className="inline mr-1" />Dichtstbijzijnde locaties</h2>
                  <div className="space-y-3">
                    {nearestLocaties.map((loc, i) => (
                      <Link key={loc.slug} href={`/locaties/${loc.slug}`} className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-zinc-100 hover:border-primary-200 hover:shadow-sm transition-all group">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-primary-500 text-white' : 'bg-zinc-200 text-zinc-600'}`}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm group-hover:text-primary-500 transition-colors">{loc.naam}</div>
                          <div className="text-xs text-zinc-500">{loc.adres}</div>
                        </div>
                        <div className="text-right shrink-0"><div className="text-sm font-bold text-primary-500">{loc.afstand} km</div></div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-200">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Laptop size={14} className="text-accent-500" />
                      <span>Of volg de cursus <strong className="text-zinc-700">live online</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cursusaanbod */}
      <div className="bg-zinc-50" id="aanbod">
        <div className="container-wide py-10">
          <h2 className="text-2xl font-extrabold mb-2">Alle {categorie.naam} cursussen {heeftEigenLocatie ? `in ${stadNaam}` : `bij ${stadNaam}`}</h2>
          <p className="text-sm text-zinc-500 mb-8">{cursussen.length} trainingen beschikbaar — van beginner tot expert</p>

          {/* Cursus cards met link naar specifieke cursus+stad pagina */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cursussen.map((cursus) => (
              <Link key={cursus.id} href={`/${cursus.slug}-cursus-${stadSlug}`} className="group">
                <div className="bg-white rounded-xl border border-zinc-200 p-5 h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${niveauColors[cursus.niveau]}`}>{niveauLabel(cursus.niveau)}</span>
                    <span className="text-[11px] text-zinc-500">{cursus.duur}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1.5 group-hover:text-primary-500 transition-colors">{cursus.titel}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{cursus.korte_beschrijving}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <div>
                      <span className="text-xs text-zinc-400">vanaf</span>
                      <span className="text-lg font-bold text-zinc-900 ml-1">{formatPrice(cursus.prijs_vanaf)}</span>
                    </div>
                    <span className="text-sm text-primary-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Bekijk <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, label: 'Niet goed? Geld terug', sub: '14 dagen bedenktijd' },
                { icon: Award, label: 'Erkend certificaat', sub: 'Na succesvolle afronding' },
                { icon: Users, label: '15.000+ cursisten', sub: 'Succesvol opgeleid' },
                { icon: Phone, label: 'Persoonlijk advies', sub: '023-551 3409' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <t.icon size={22} className="text-primary-500 mb-2" />
                  <span className="font-semibold text-sm">{t.label}</span>
                  <span className="text-xs text-zinc-400 mt-0.5">{t.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO content block met interne links naar categoriepagina */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-3">Waarom een {categorie.naam} cursus volgen?</h2>
            <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
              <p>
                Een <Link href={`/cursussen/${categorieSlug}`} className="text-primary-500 font-semibold hover:text-primary-600">{categorie.naam} cursus</Link> bij Compu Act Opleidingen is de snelste manier om je vaardigheden te verbeteren. Onze ervaren docenten werken met praktijkvoorbeelden zodat je het geleerde direct kunt toepassen op je werk.
              </p>
              <p>
                Alle <Link href="/cursussen" className="text-primary-500 font-semibold hover:text-primary-600">cursussen</Link> zijn beschikbaar als <Link href="/lesmethodes" className="text-primary-500 hover:text-primary-600">klassikale training</Link> op onze <Link href="/locaties" className="text-primary-500 hover:text-primary-600">17 locaties</Link>, als live online training of als <Link href="/incompany" className="text-primary-500 hover:text-primary-600">incompany training</Link> op je eigen locatie.
              </p>
              <p>
                Met meer dan 21 jaar ervaring en 15.000+ opgeleide cursisten is Compu Act dé specialist in <Link href="/cursussen" className="text-primary-500 hover:text-primary-600">Microsoft Office trainingen</Link> in Nederland.
              </p>
            </div>
          </div>

          {/* Cross-links: alle categoriepagina's */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-2">Alle cursuscategorieën</h2>
            <p className="text-sm text-zinc-500 mb-4">Bekijk ons complete aanbod aan Microsoft Office en IT trainingen.</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIE_SLUGS.map((slug) => (
                <Link key={slug} href={`/cursussen/${slug}`} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${slug === categorieSlug ? 'bg-primary-500 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50'}`}>
                  <BookOpen size={12} /> {slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>

          {/* Cross-links: andere categorieën in deze stad */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-2">Andere cursussen in {stadNaam}</h2>
            <p className="text-sm text-zinc-500 mb-4">Naast <Link href={`/cursussen/${categorieSlug}`} className="text-primary-500 hover:text-primary-600">{categorie.naam}</Link> bieden we ook andere Microsoft Office en IT trainingen aan in {stadNaam}.</p>
            <div className="flex flex-wrap gap-2">
              {otherCategories.map((slug) => (
                <Link key={slug} href={`/${slug}-cursus-${stadSlug}`} className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-lg text-sm text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-colors capitalize">
                  <MapPin size={12} /> {slug.replace(/-/g, ' ')} cursus {stadNaam}
                </Link>
              ))}
            </div>
          </div>

          {/* Cross-links: deze categorie in andere steden */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-12">
            <h2 className="font-bold text-lg mb-2"><Link href={`/cursussen/${categorieSlug}`} className="hover:text-primary-500">{categorie.naam} cursus</Link> op andere locaties</h2>
            <p className="text-sm text-zinc-500 mb-4">Onze <Link href={`/cursussen/${categorieSlug}`} className="text-primary-500 hover:text-primary-600">{categorie.naam} cursussen</Link> zijn beschikbaar op al onze <Link href="/locaties" className="text-primary-500 hover:text-primary-600">trainingslocaties</Link> door heel Nederland.</p>
            <div className="flex flex-wrap gap-2">
              {locaties.filter(l => l.slug !== stadSlug).map((city) => (
                <Link key={city.slug} href={`/${categorieSlug}-cursus-${city.slug}`} className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-lg text-sm text-zinc-600 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                  <MapPin size={12} /> {city.naam}
                </Link>
              ))}
              <Link href={`/cursussen/${categorieSlug}`} className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 px-3.5 py-2 rounded-lg text-sm text-primary-600 font-semibold hover:bg-primary-100 transition-colors">
                Alle {categorie.naam} cursussen <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* InCompany */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold flex items-center gap-3"><Building2 size={28} />{categorie.naam} InCompany training</h3>
              <p className="text-primary-200 mt-2 max-w-xl leading-relaxed">Wil je een {categorie.naam} training op maat voor jouw team in {stadNaam}? Wij komen naar je locatie met een programma afgestemd op jouw organisatie.</p>
            </div>
            <Link href="/incompany" className="bg-white text-primary-700 px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0">InCompany offerte</Link>
          </div>
        </div>
      </div>
    </>
  )
}
