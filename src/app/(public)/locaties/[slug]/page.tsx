import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Phone, Mail, Car, Train, ParkingCircle, CheckCircle, ArrowRight, Users, Laptop, BookOpen, Building2, Star, Clock } from 'lucide-react'
import { locaties, getLocatieBySlug } from '@/data/locaties'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const revalidate = 3600

export async function generateStaticParams() {
  return locaties.map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loc = getLocatieBySlug(params.slug)
  if (!loc) return {}
  return {
    title: `Cursuslocatie ${loc.naam} | ${loc.adres} | Compu Act Opleidingen`,
    description: `Volg een cursus bij Compu Act Opleidingen in ${loc.naam}. ${loc.adres}, ${loc.postcode}. Klassikaal, live online of thuisstudie. Bekijk ons cursusaanbod en schrijf je in.`,
  }
}

export default async function LocatieDetailPage({ params }: { params: { slug: string } }) {
  const loc = getLocatieBySlug(params.slug)
  if (!loc) notFound()

  // Fetch upcoming sessions for this location
  const supabase = createServiceRoleClient()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const { data: sessies } = await supabase
    .from('cursus_sessies')
    .select('id, datum, prijs, lesmethode, tijden, cursus_id, cursussen:cursus_id(titel, slug), locaties:locatie_id(stad)')
    .gte('datum', tomorrowStr)
    .eq('actief', true)
    .order('datum')
    .limit(500)

  // Filter sessions for this location
  const locSessies = (sessies || []).filter((s: Record<string, unknown>) => {
    const stad = (s.locaties as Record<string, string>)?.stad?.toLowerCase().replace(/\s+/g, '-')
    return stad === loc.slug || (loc.slug === 'limburg' && stad === 'eindhoven')
  })

  // Group by cursus, take first session per cursus
  const cursusMap = new Map<string, { titel: string; slug: string; datum: string; prijs: number }>()
  for (const s of locSessies) {
    const cursus = s.cursussen as unknown as Record<string, string>
    if (!cursus?.slug || cursusMap.has(cursus.slug)) continue
    cursusMap.set(cursus.slug, {
      titel: cursus.titel,
      slug: cursus.slug,
      datum: s.datum as string,
      prijs: s.prijs as number,
    })
  }
  const aankomendeCursussen = [...cursusMap.values()].slice(0, 12)

  const lesmethodeIcons: Record<string, typeof Users> = {
    'Klassikaal': Users,
    'Live Online': Laptop,
    'Thuisstudie': BookOpen,
    'InCompany': Building2,
  }

  const otherLocaties = locaties.filter(l => l.slug !== loc.slug).slice(0, 6)

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide py-12 lg:py-16">
          <div className="flex items-center gap-2 text-primary-200 text-sm font-medium mb-4">
            <Link href="/locaties" className="hover:text-white transition-colors">Locaties</Link>
            <span>/</span>
            <span>{loc.naam}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3">
            Cursuslocatie {loc.naam}
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl leading-relaxed mb-6">
            {loc.adres}, {loc.postcode} {loc.naam === 'Limburg' ? 'Eindhoven' : loc.naam}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${loc.telefoon}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Phone size={15} /> {loc.telefoon}
            </a>
            <a href={`mailto:${loc.email}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Mail size={15} /> {loc.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Beschrijving */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4">Over deze locatie</h2>
              <div className="text-zinc-600 leading-relaxed space-y-4">
                {loc.beschrijving.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Waarom kiezen */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4">Waarom kiezen voor Compu Act in {loc.naam}?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {loc.waarom.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-primary-50 rounded-lg p-3">
                    <CheckCircle size={16} className="text-primary-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesvormen */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4">Beschikbare lesvormen</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {loc.lesvormen.map((lv) => {
                  const Icon = lesmethodeIcons[lv] || Users
                  return (
                    <div key={lv} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100">
                      <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
                        <Icon size={16} />
                      </div>
                      <span className="font-medium text-sm text-zinc-700">{lv}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bereikbaarheid */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4">Bereikbaarheid</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                    <Car size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-zinc-900">Met de auto</div>
                    <p className="text-sm text-zinc-600">{loc.bereikbaarheid.auto}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0">
                    <Train size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-zinc-900">Openbaar vervoer</div>
                    <p className="text-sm text-zinc-600">{loc.bereikbaarheid.ov}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
                    <ParkingCircle size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-zinc-900">Parkeren</div>
                    <p className="text-sm text-zinc-600">{loc.bereikbaarheid.parkeren}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              <iframe
                src={loc.mapsEmbed}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Kaart ${loc.naam}`}
              />
            </div>

            {/* Aankomende cursussen */}
            {aankomendeCursussen.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-4">Aankomende cursussen in {loc.naam}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {aankomendeCursussen.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/cursussen/${c.slug}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-zinc-100 hover:border-primary-300 hover:bg-primary-50/50 transition-all group"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-zinc-900 truncate">{c.titel}</div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                          <span className="flex items-center gap-1"><Clock size={11} /> {new Date(c.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                          <span>vanaf {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(c.prijs)}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-zinc-300 group-hover:text-primary-500 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/cursussen"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 mt-4 hover:text-primary-600 transition-colors"
                >
                  Bekijk alle cursussen <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 sticky top-24">
              <h3 className="font-bold mb-3">Direct inschrijven</h3>
              <p className="text-sm text-zinc-500 mb-4">
                Kies een cursus en schrijf je direct in voor onze locatie in {loc.naam}.
              </p>
              <Link
                href="/cursussen"
                className="block w-full text-center bg-primary-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98] mb-3"
              >
                Bekijk cursussen
              </Link>
              <Link
                href="/incompany"
                className="flex items-center justify-center gap-2 w-full border-2 border-zinc-200 bg-white text-zinc-700 px-5 py-2.5 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all text-sm"
              >
                <Building2 size={15} /> InCompany offerte
              </Link>

              <div className="mt-6 pt-6 border-t border-zinc-100">
                <h3 className="font-bold text-sm mb-3">Contactgegevens</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="text-primary-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-600">{loc.adres}, {loc.postcode} {loc.naam === 'Limburg' ? 'Eindhoven' : loc.naam}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-primary-500 shrink-0" />
                    <a href={`tel:${loc.telefoon}`} className="text-zinc-600 hover:text-primary-500">{loc.telefoon}</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-primary-500 shrink-0" />
                    <a href={`mailto:${loc.email}`} className="text-zinc-600 hover:text-primary-500">{loc.email}</a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-accent-500 fill-accent-500" />)}</div>
                  <span className="text-sm font-bold">4.8</span>
                </div>
                <p className="text-xs text-zinc-400">Gebaseerd op 90+ Google reviews</p>
              </div>
            </div>

            {/* Andere locaties */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h3 className="font-bold mb-3">Andere locaties</h3>
              <div className="space-y-1.5">
                {otherLocaties.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/locaties/${l.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
                  >
                    <MapPin size={12} className="shrink-0" />
                    {l.naam}
                  </Link>
                ))}
                <Link
                  href="/locaties"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary-500 hover:bg-primary-50 transition-all"
                >
                  Alle 17 locaties <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
