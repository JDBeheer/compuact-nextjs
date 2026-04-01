import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie } from '@/types'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusDetailTabs from '@/components/cursussen/CursusDetailTabs'
import CursusCard from '@/components/cursussen/CursusCard'
import { formatPrice, formatDateShort, niveauLabel } from '@/lib/utils'
import { Clock, Users, Award, BookOpen, Building2, Star, MapPin, CheckCircle, ArrowRight, Laptop } from 'lucide-react'

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

async function getSessies(cursusId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('cursus_sessies')
    .select('*, locatie:locaties(naam, stad)')
    .eq('cursus_id', cursusId)
    .eq('actief', true)
    .gte('datum', new Date().toISOString().split('T')[0])
    .order('datum')

  return (data || []).map((s: Record<string, unknown>) => ({
    ...s,
    locatie_naam: (s.locatie as Record<string, string>)?.naam || '',
    locatie_stad: (s.locatie as Record<string, string>)?.stad || '',
    lesdagen: Array.isArray(s.lesdagen) ? s.lesdagen as string[] : (typeof s.lesdagen === 'string' ? JSON.parse(s.lesdagen as string) : []),
  })) as CursusSessie[]
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

export async function generateStaticParams() {
  const supabase = createServiceRoleClient()
  const { data } = await supabase.from('cursussen').select('slug').eq('actief', true)
  return (data || []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cursus = await getCursus(params.slug)
  if (!cursus) return { title: 'Cursus niet gevonden' }
  return {
    title: `${cursus.titel} Cursus | Compu Act Opleidingen`,
    description: cursus.korte_beschrijving || `Volg de ${cursus.titel} training bij Compu Act Opleidingen. Klassikaal of live online, op 18 locaties door heel Nederland.`,
    openGraph: { title: `${cursus.titel} - Compu Act Opleidingen`, description: cursus.korte_beschrijving, type: 'website' },
  }
}

export default async function CursusDetailPage({ params }: { params: { slug: string } }) {
  const cursus = await getCursus(params.slug)
  if (!cursus) notFound()

  const [sessies, related] = await Promise.all([
    getSessies(cursus.id),
    getRelatedCursussen(cursus.categorie_id, cursus.id),
  ])

  const courseInstances = sessies.slice(0, 20).map(s => ({
    '@type': 'CourseInstance',
    courseMode: s.lesmethode === 'online' ? 'Online' : 'InPerson',
    location: s.lesmethode === 'online'
      ? { '@type': 'VirtualLocation', url: 'https://www.computertraining.nl' }
      : { '@type': 'Place', name: s.locatie_stad, address: { '@type': 'PostalAddress', addressLocality: s.locatie_stad, addressCountry: 'NL' } },
    startDate: s.datum,
    offers: { '@type': 'Offer', price: s.prijs, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
  }))

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: cursus.titel, description: cursus.korte_beschrijving || cursus.beschrijving,
    provider: { '@type': 'Organization', name: 'Compu Act Opleidingen', url: 'https://www.computertraining.nl' },
    offers: { '@type': 'Offer', price: cursus.prijs_vanaf, priceCurrency: 'EUR' },
    hasCourseInstance: courseInstances,
  }

  const niveauColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    gevorderd: 'bg-amber-100 text-amber-700',
    expert: 'bg-red-100 text-red-700',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero — Above the fold */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8 lg:py-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-zinc-400 mb-5">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/cursussen" className="hover:text-primary-500">Cursussen</a>
            {cursus.categorie && (
              <>
                <span className="mx-1.5">/</span>
                <a href={`/cursussen/categorie/${cursus.categorie.slug}`} className="hover:text-primary-500">{cursus.categorie.naam}</a>
              </>
            )}
            <span className="mx-1.5">/</span>
            <span className="text-zinc-700">{cursus.titel}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left: Title + subtitle + USPs */}
            <div className="flex-1 lg:max-w-2xl">
              {/* Google rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-accent-500 fill-accent-500" />)}
                </div>
                <span className="text-sm text-zinc-500">4.8 &middot; 84 Google recensies</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
                {cursus.titel}
              </h1>

              <p className="text-zinc-600 text-lg leading-relaxed mb-6">
                {cursus.korte_beschrijving || `Praktijkgericht leren werken met ${cursus.titel}. Direct toepasbaar in je werk.`}
              </p>

              {/* USP row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Al meer dan 21 jaar specialist</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Ervaren docenten uit de praktijk</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Direct toepasbaar</span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="#cursusaanbod" className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]">
                  Direct inschrijven
                </a>
                <a href="#cursusaanbod" className="inline-flex items-center border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all">
                  Cursusdata bekijken
                </a>
              </div>
            </div>

            {/* Right: Compact course overview (sticky on desktop) */}
            <div className="mt-8 lg:mt-0 lg:w-[300px] shrink-0">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 lg:sticky lg:top-24">
                <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4">Cursusinformatie</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 flex items-center gap-2"><Clock size={15} /> Duur</span>
                    <span className="font-semibold text-sm">{cursus.duur}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 flex items-center gap-2"><Award size={15} /> Niveau</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${niveauColors[cursus.niveau]}`}>{niveauLabel(cursus.niveau)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 flex items-center gap-2"><Users size={15} /> Groepsgrootte</span>
                    <span className="font-semibold text-sm">Max 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 flex items-center gap-2"><MapPin size={15} /> Locaties</span>
                    <span className="font-semibold text-sm">18 + online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500 flex items-center gap-2"><BookOpen size={15} /> Materiaal</span>
                    <span className="font-semibold text-sm">Inbegrepen</span>
                  </div>
                  {sessies.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">Eerstvolgende</span>
                      <span className="font-semibold text-sm">{formatDateShort(sessies[0].datum)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-200 mt-4 pt-4">
                  <div className="text-xs text-zinc-400 mb-1">Vanaf</div>
                  <div className="text-3xl font-extrabold text-zinc-900">{formatPrice(cursus.prijs_vanaf)}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">excl. 21% BTW &amp; €15 administratiekosten</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full">
                    <Users size={11} /> Klassikaal
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full">
                    <Laptop size={11} /> Online
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full">
                    <Building2 size={11} /> InCompany
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-zinc-50">
        <div className="container-wide py-10">
          {/* 2-column layout: content left, info right */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              {/* Cursusinformatie */}
              {cursus.beschrijving && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Cursusinformatie</h2>
                  <p className="text-zinc-600 leading-relaxed">{cursus.beschrijving}</p>
                </div>
              )}

              {/* Wat leer je — resultaatgericht */}
              {cursus.inhoud?.wat_leer_je && cursus.inhoud.wat_leer_je.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Wat leer je tijdens de cursus?</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cursus.inhoud.wat_leer_je.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg border border-zinc-100 p-3">
                        <CheckCircle size={16} className="text-primary-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-zinc-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs for deeper content */}
              <CursusDetailTabs cursus={cursus} />
            </div>

            {/* Right column — hidden on mobile (already shown in hero) */}
            <div className="hidden lg:block">
              {/* Sticky CTA */}
              <div className="sticky top-24">
                <a href="#cursusaanbod" className="block w-full text-center bg-primary-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98] mb-3">
                  Direct inschrijven
                </a>
                <Link href="/incompany" className="flex items-center justify-center gap-2 w-full border-2 border-zinc-200 bg-white text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all text-sm">
                  <Building2 size={15} /> InCompany offerte
                </Link>

                {/* Trust compact */}
                <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-accent-500 fill-accent-500" />)}</div>
                    <span className="text-sm font-bold">4.8</span>
                    <span className="text-xs text-zinc-400">84 reviews</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-primary-500" /> 21+ jaar ervaring</div>
                    <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-primary-500" /> 15.000+ deelnemers opgeleid</div>
                    <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-primary-500" /> Niet goed? Geld terug</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cursusaanbod — sessietabel */}
          <div className="mt-10" id="cursusaanbod">
            <h2 className="text-2xl font-extrabold mb-6">Cursusaanbod</h2>
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <SessieTable sessies={sessies} cursusTitel={cursus.titel} />
            </div>
          </div>

          {/* Reviews sectie */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold">Dit zeggen onze cursisten</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-accent-500 fill-accent-500" />)}</div>
                  <span className="text-sm text-zinc-500">4.8 gemiddeld &middot; 1.564+ positieve beoordelingen</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { naam: 'Stefan van Vliet', tekst: 'Binnen een dag waren mijn vaardigheden weer op niveau. Zeer tevreden over de inhoud en begeleiding van de cursus.', methode: 'Klassikaal' },
                { naam: 'Sandra de Vries', tekst: 'De docent nam ruim de tijd voor persoonlijke vragen en de stof was direct toepasbaar in mijn werk.', methode: 'Live Online' },
                { naam: 'Mark Jansen', tekst: 'De training was perfect afgestemd op onze organisatie. Onze medewerkers konden alles direct toepassen.', methode: 'InCompany' },
              ].map((review) => (
                <div key={review.naam} className="bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-accent-500 fill-accent-500" />)}</div>
                  <p className="text-sm text-zinc-700 leading-relaxed mb-4">&ldquo;{review.tekst}&rdquo;</p>
                  <div className="border-t border-zinc-100 pt-3">
                    <p className="font-semibold text-sm">{review.naam}</p>
                    <p className="text-xs text-zinc-400">{review.methode}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* InCompany CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold flex items-center gap-3">
                <Building2 size={28} />
                {cursus.titel} als InCompany training
              </h3>
              <p className="text-primary-200 mt-2 max-w-xl leading-relaxed">
                Wilt u deze cursus op maat voor uw team? Wij komen naar uw locatie met een programma afgestemd op uw organisatie. Flexibel, voordelig en persoonlijk.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-300 mt-3">
                <span>&#10003; Op uw locatie of online</span>
                <span>&#10003; Inhoud op maat</span>
                <span>&#10003; Voordelig vanaf 4 deelnemers</span>
              </div>
            </div>
            <Link href="/incompany" className="bg-white text-primary-700 px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0">
              InCompany offerte aanvragen
            </Link>
          </div>

          {/* Gerelateerde cursussen */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">Gerelateerde cursussen</h2>
                {cursus.categorie && (
                  <Link href={`/cursussen/categorie/${cursus.categorie.slug}`} className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600">
                    Alle {cursus.categorie.naam} cursussen <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <CursusCard key={r.id} cursus={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
