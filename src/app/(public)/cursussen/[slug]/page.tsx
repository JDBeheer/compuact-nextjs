import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie } from '@/types'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusDetailTabs from '@/components/cursussen/CursusDetailTabs'
import { formatPrice } from '@/lib/utils'
import { Clock, Users, Award, BookOpen } from 'lucide-react'

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
  })) as CursusSessie[]
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cursus = await getCursus(params.slug)
  if (!cursus) return { title: 'Cursus niet gevonden' }

  return {
    title: cursus.titel,
    description: cursus.korte_beschrijving,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: cursus.titel,
    description: cursus.korte_beschrijving,
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
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/cursussen" className="hover:text-primary-600">Cursussen</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">{cursus.titel}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-3">{cursus.titel}</h1>
              <p className="text-zinc-600 max-w-2xl">{cursus.korte_beschrijving}</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 lg:min-w-[280px]">
              <div className="text-sm text-primary-700 mb-1">Vanaf</div>
              <div className="text-3xl font-bold text-primary-700 mb-3">
                {formatPrice(cursus.prijs_vanaf)}
              </div>
              <div className="text-xs text-zinc-500 mb-4">excl. 21% BTW &amp; €15 administratiekosten</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Clock size={16} className="text-primary-600" /> {cursus.duur}
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Users size={16} className="text-primary-600" /> Max 8 deelnemers
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Award size={16} className="text-primary-600" /> Certificaat inbegrepen
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <BookOpen size={16} className="text-primary-600" /> Lesmateriaal inbegrepen
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50">
        <div className="container-wide py-8">
          {/* Tabs */}
          <CursusDetailTabs cursus={cursus} />

          {/* Beschikbare sessies */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Beschikbare data &amp; locaties</h2>
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <SessieTable sessies={sessies} cursusTitel={cursus.titel} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
