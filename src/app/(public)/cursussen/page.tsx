import { Metadata } from 'next'
import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import CursusFilters from '@/components/cursussen/CursusFilters'
import CursusCard from '@/components/cursussen/CursusCard'
import { Cursus } from '@/types'
import { Monitor } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alle cursussen',
  description: 'Bekijk ons volledige aanbod aan Microsoft Office cursussen. Van Excel en Word tot Power BI en Office 365.',
}

async function getCursussen(searchParams: Record<string, string | undefined>) {
  const supabase = createServerSupabaseClient()

  // If filtering by category, first get the category ID
  let categorieId: string | null = null
  if (searchParams.categorie) {
    const { data: cat } = await supabase
      .from('categorieen')
      .select('id')
      .eq('slug', searchParams.categorie)
      .single()
    categorieId = cat?.id || null
  }

  let query = supabase
    .from('cursussen')
    .select('*, categorie:categorieen(*)')
    .eq('actief', true)
    .order('titel')

  if (categorieId) {
    query = query.eq('categorie_id', categorieId)
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

  const activeCategorie = searchParams.categorie
  const catLabel = activeCategorie
    ? filterOptions.categorieen.find(c => c.value === activeCategorie)?.label
    : null

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide py-12">
          <nav className="text-sm text-primary-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2 text-primary-400">/</span>
            {catLabel ? (
              <>
                <a href="/cursussen" className="hover:text-white transition-colors">Cursussen</a>
                <span className="mx-2 text-primary-400">/</span>
                <span className="text-white">{catLabel}</span>
              </>
            ) : (
              <span className="text-white">Cursussen</span>
            )}
          </nav>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl hidden sm:block">
              <Monitor size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                {catLabel ? `${catLabel} cursussen` : 'Alle cursussen'}
              </h1>
              <p className="text-primary-200 mt-1">
                {cursussen.length} cursus{cursussen.length !== 1 ? 'sen' : ''} beschikbaar
                {catLabel && <> in {catLabel}</>}
              </p>
            </div>
          </div>
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
          <div className="text-center py-20">
            <Monitor size={48} className="text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg font-semibold">Geen cursussen gevonden</p>
            <p className="text-zinc-400 text-sm mt-1">Pas je filters aan of probeer een andere zoekterm.</p>
          </div>
        )}
      </div>
    </div>
  )
}
