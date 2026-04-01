import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie } from '@/types'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusDetailTabs from '@/components/cursussen/CursusDetailTabs'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { Clock, Users, Award, BookOpen, Building2 } from 'lucide-react'
import Button from '@/components/ui/Button'

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

export async function generateStaticParams() {
  const supabase = createServiceRoleClient()
  const { data } = await supabase.from('cursussen').select('slug').eq('actief', true)
  return (data || []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cursus = await getCursus(params.slug)
  if (!cursus) return { title: 'Cursus niet gevonden' }

  return {
    title: `${cursus.titel} Cursus`,
    description: cursus.korte_beschrijving || `Volg de ${cursus.titel} training bij Compu Act Opleidingen. Klassikaal of live online, op 17 locaties door heel Nederland.`,
    openGraph: {
      title: `${cursus.titel} - Compu Act Opleidingen`,
      description: cursus.korte_beschrijving,
      type: 'website',
    },
  }
}

export default async function CursusDetailPage({ params }: { params: { slug: string } }) {
  const cursus = await getCursus(params.slug)
  if (!cursus) notFound()

  const sessies = await getSessies(cursus.id)

  // Build CourseInstance offers for Schema.org
  const courseInstances = sessies.slice(0, 20).map(s => ({
    '@type': 'CourseInstance',
    courseMode: s.lesmethode === 'online' ? 'Online' : 'InPerson',
    location: s.lesmethode === 'online'
      ? { '@type': 'VirtualLocation', url: 'https://www.computertraining.nl' }
      : { '@type': 'Place', name: s.locatie_stad, address: { '@type': 'PostalAddress', addressLocality: s.locatie_stad, addressCountry: 'NL' } },
    startDate: s.datum,
    offers: {
      '@type': 'Offer',
      price: s.prijs,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: cursus.titel,
    description: cursus.korte_beschrijving || cursus.beschrijving,
    provider: {
      '@type': 'Organization',
      name: 'Compu Act Opleidingen',
      url: 'https://www.computertraining.nl',
    },
    offers: {
      '@type': 'Offer',
      price: cursus.prijs_vanaf,
      priceCurrency: 'EUR',
    },
    hasCourseInstance: courseInstances,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-2">/</span>
            <a href="/cursussen" className="hover:text-primary-500">Cursussen</a>
            {cursus.categorie && (
              <>
                <span className="mx-2">/</span>
                <a href={`/cursussen/categorie/${cursus.categorie.slug}`} className="hover:text-primary-500">
                  {cursus.categorie.naam}
                </a>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-zinc-900">{cursus.titel}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-3">{cursus.titel}</h1>
              <p className="text-zinc-600 max-w-2xl">{cursus.korte_beschrijving}</p>
              {sessies.length > 0 && (
                <p className="text-sm text-zinc-400 mt-2">
                  Eerstvolgende datum: {formatDateShort(sessies[0].datum)}
                </p>
              )}
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 lg:min-w-[280px]">
              <div className="text-sm text-primary-700 mb-1">Vanaf</div>
              <div className="text-3xl font-bold text-primary-700 mb-3">
                {formatPrice(cursus.prijs_vanaf)}
              </div>
              <div className="text-xs text-zinc-500 mb-4">excl. 21% BTW &amp; €15 administratiekosten</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Clock size={16} className="text-primary-500" /> {cursus.duur}
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Users size={16} className="text-primary-500" /> Max 10 deelnemers
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Award size={16} className="text-primary-500" /> Certificaat inbegrepen
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <BookOpen size={16} className="text-primary-500" /> Lesmateriaal inbegrepen
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50">
        <div className="container-wide py-8">
          {/* Beschrijving */}
          {cursus.beschrijving && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8 prose prose-zinc max-w-none">
              <p>{cursus.beschrijving}</p>
            </div>
          )}

          {/* Tabs */}
          <CursusDetailTabs cursus={cursus} />

          {/* Beschikbare sessies */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Beschikbare data &amp; locaties</h2>
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <SessieTable sessies={sessies} cursusTitel={cursus.titel} />
            </div>
          </div>

          {/* InCompany CTA */}
          <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Building2 size={24} />
                {cursus.titel} als InCompany training
              </h3>
              <p className="text-primary-100 mt-1 max-w-xl">
                Deze cursus is ook beschikbaar als maatwerk training voor uw organisatie. Op uw locatie of online, afgestemd op uw team.
              </p>
            </div>
            <Link href="/incompany">
              <Button className="bg-white text-primary-700 hover:bg-zinc-100 shrink-0" size="lg">
                InCompany offerte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
