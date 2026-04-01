import { Metadata } from 'next'
import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import CursusFilters from '@/components/cursussen/CursusFilters'
import CursusCard from '@/components/cursussen/CursusCard'
import { Cursus } from '@/types'

export const metadata: Metadata = {
  title: 'Alle cursussen',
  description: 'Bekijk ons volledige aanbod aan Microsoft Office cursussen. Van Excel en Word tot Power BI en Office 365.',
}

async function getCursussen(searchParams: Record<string, string | undefined>) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('cursussen')
    .select('*, categorie:categorieen(*)')
    .eq('actief', true)
    .order('titel')

  if (searchParams.categorie) {
    query = query.eq('categorie:categorieen.slug', searchParams.categorie)
  }

  if (searchParams.zoek) {
    query = query.ilike('titel', `%${searchParams.zoek}%`)
  }

  const { data } = await query
  return (data || []) as Cursus[]
}

async function getFilterOptions() {
  const supabase = createServerSupabaseClient()

  const [{ data: categorieen }, { data: locaties }] = await Promise.all([
    supabase.from('categorieen').select('*').order('volgorde'),
    supabase.from('locaties').select('*').order('stad'),
  ])

  return {
    categorieen: (categorieen || []).map((c) => ({ value: c.slug, label: c.naam })),
    locaties: (locaties || []).map((l) => ({ value: l.id, label: l.stad })),
  }
}

export default async function CursussenPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const [cursussen, filterOptions] = await Promise.all([
    getCursussen(searchParams),
    getFilterOptions(),
  ])

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Cursussen</span>
          </nav>
          <h1 className="text-3xl font-bold">Alle cursussen</h1>
          <p className="text-zinc-600 mt-2">
            {cursussen.length} cursus{cursussen.length !== 1 ? 'sen' : ''} beschikbaar
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Filters */}
        <Suspense fallback={null}>
          <CursusFilters
            categorieen={filterOptions.categorieen}
            locaties={filterOptions.locaties}
          />
        </Suspense>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cursussen.map((cursus) => (
            <CursusCard key={cursus.id} cursus={cursus} />
          ))}
        </div>

        {cursussen.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">Geen cursussen gevonden.</p>
            <p className="text-zinc-400 text-sm mt-1">Pas je filters aan of probeer een andere zoekterm.</p>
          </div>
        )}
      </div>
    </div>
  )
}
