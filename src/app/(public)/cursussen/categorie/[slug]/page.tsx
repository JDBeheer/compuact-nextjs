import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { Cursus, Categorie } from '@/types'
import CursusCard from '@/components/cursussen/CursusCard'
import { niveauLabel } from '@/lib/utils'
import {
  FileSpreadsheet, FileText, Monitor, Mail, Presentation,
  BarChart3, FolderKanban, Bot, PenTool, Building2,
  Users, MapPin, Award, BookOpen, CheckCircle
} from 'lucide-react'

const categorieConfig: Record<string, {
  icon: typeof Monitor
  gradient: string
  lightBg: string
  beschrijving: string
  seoTitle: string
  seoDescription: string
  highlights: string[]
}> = {
  excel: {
    icon: FileSpreadsheet,
    gradient: 'from-emerald-600 to-emerald-800',
    lightBg: 'bg-emerald-50',
    seoTitle: 'Excel Cursussen | Van Basis tot Expert',
    seoDescription: 'Volg een Excel cursus bij Compu Act Opleidingen. Van Excel Basis tot VBA en Power BI. Klassikaal op 18 locaties of live online. Direct inschrijven of offerte aanvragen.',
    beschrijving: 'Onze Excel trainingen nemen je mee van de basis tot expert-niveau. Of je nu wilt leren werken met formules, draaitabellen, macro\'s of VBA — wij hebben de juiste cursus voor jou. Alle trainingen zijn praktijkgericht en worden gegeven door ervaren docenten.',
    highlights: ['Formules en functies', 'Draaitabellen', 'Grafieken en dashboards', 'VBA en macro\'s', 'Power BI integratie', 'AI in Excel'],
  },
  word: {
    icon: FileText,
    gradient: 'from-blue-600 to-blue-800',
    lightBg: 'bg-blue-50',
    seoTitle: 'Word Cursussen | Professionele Documenten',
    seoDescription: 'Leer professioneel werken met Microsoft Word. Van basis tot complexe documenten, mailingen en sjablonen. Klassikaal of online bij Compu Act Opleidingen.',
    beschrijving: 'Word is veel meer dan een tekstverwerker. Onze Word trainingen leren je professionele documenten maken, werken met sjablonen, formulieren opstellen en mailingen verzorgen. Van basis tot gevorderd niveau.',
    highlights: ['Professionele opmaak', 'Sjablonen en formulieren', 'Mailingen', 'Complexe documenten', 'Samenwerken'],
  },
  outlook: {
    icon: Mail,
    gradient: 'from-sky-600 to-sky-800',
    lightBg: 'bg-sky-50',
    seoTitle: 'Outlook Cursussen | E-mail & Time Management',
    seoDescription: 'Werk efficiënter met Outlook. Leer e-mailbeheer, agenda planning en time management technieken bij Compu Act Opleidingen.',
    beschrijving: 'Outlook is de spil van je dagelijkse communicatie. Onze trainingen helpen je om efficiënter te werken met e-mail, agenda, taken en contacten. Leer tijdbesparende technieken en verbeter je productiviteit.',
    highlights: ['E-mailbeheer', 'Agenda planning', 'Time management', 'Taken en notities', 'Tips en trucs'],
  },
  powerpoint: {
    icon: Presentation,
    gradient: 'from-rose-600 to-rose-800',
    lightBg: 'bg-rose-50',
    seoTitle: 'PowerPoint Cursus | Professionele Presentaties',
    seoDescription: 'Maak indrukwekkende presentaties met PowerPoint. Leer ontwerpen, animeren en presenteren bij Compu Act Opleidingen.',
    beschrijving: 'Een goede presentatie maakt het verschil. Onze PowerPoint training leert je professionele slides ontwerpen, animaties toepassen en je boodschap overtuigend overbrengen. Van basisvaardigheden tot geavanceerde technieken.',
    highlights: ['Professioneel ontwerp', 'Animaties en overgangen', 'SmartArt en grafieken', 'Presentatietechnieken', 'Templates'],
  },
  'power-bi': {
    icon: BarChart3,
    gradient: 'from-amber-600 to-amber-800',
    lightBg: 'bg-amber-50',
    seoTitle: 'Power BI Cursussen | Data Visualisatie',
    seoDescription: 'Leer data analyseren en visualiseren met Power BI Desktop. Maak interactieve dashboards en rapportages bij Compu Act Opleidingen.',
    beschrijving: 'Power BI is hét platform voor data-analyse en visualisatie. Onze trainingen leren je data importeren, transformeren en omzetten naar interactieve dashboards en rapportages die impact maken.',
    highlights: ['Data importeren', 'DAX formules', 'Interactieve dashboards', 'Rapportages delen', 'Excel integratie'],
  },
  'office-365': {
    icon: Monitor,
    gradient: 'from-orange-600 to-red-700',
    lightBg: 'bg-orange-50',
    seoTitle: 'Office 365 & Teams Cursussen',
    seoDescription: 'Leer werken met Office 365 en Microsoft Teams. Online samenwerken, SharePoint, OneDrive en meer bij Compu Act Opleidingen.',
    beschrijving: 'Office 365 biedt een compleet pakket voor modern werken. Onze trainingen helpen je om het maximale uit Microsoft Teams, SharePoint, OneDrive en de Office-apps te halen. Ideaal voor organisaties die overstappen of meer willen halen uit hun Microsoft 365 omgeving.',
    highlights: ['Microsoft Teams', 'SharePoint Online', 'OneDrive', 'Online samenwerken', 'Office web apps'],
  },
  ai: {
    icon: Bot,
    gradient: 'from-violet-600 to-purple-800',
    lightBg: 'bg-violet-50',
    seoTitle: 'AI Cursussen | Kunstmatige Intelligentie Trainingen',
    seoDescription: 'Leer werken met AI tools zoals ChatGPT en Copilot. Van introductie tot effectief prompting. Praktijkgerichte AI cursussen bij Compu Act Opleidingen.',
    beschrijving: 'Kunstmatige intelligentie verandert de manier waarop we werken. Onze AI trainingen helpen je om AI-tools effectief in te zetten in je dagelijkse werk. Van een introductie tot geavanceerd prompting — ontdek hoe AI jou productiever maakt.',
    highlights: ['ChatGPT en Copilot', 'Effectief prompting', 'AI in Office apps', 'Praktische toepassingen', 'Ethisch AI-gebruik'],
  },
  project: {
    icon: FolderKanban,
    gradient: 'from-teal-600 to-teal-800',
    lightBg: 'bg-teal-50',
    seoTitle: 'Microsoft Project Cursus | Projectmanagement',
    seoDescription: 'Leer projecten plannen en beheren met Microsoft Project. Praktijkgerichte training bij Compu Act Opleidingen.',
    beschrijving: 'Microsoft Project is de standaard voor professioneel projectmanagement. Onze training leert je projecten opzetten, plannen, resources toewijzen en voortgang bewaken. Ideaal voor projectmanagers en teamleiders.',
    highlights: ['Projectplanning', 'Gantt-diagrammen', 'Resources beheren', 'Voortgang bewaken', 'Rapportages'],
  },
  visio: {
    icon: PenTool,
    gradient: 'from-indigo-600 to-indigo-800',
    lightBg: 'bg-indigo-50',
    seoTitle: 'Microsoft Visio Cursus | Diagrammen en Flowcharts',
    seoDescription: 'Leer professionele diagrammen en flowcharts maken met Microsoft Visio bij Compu Act Opleidingen.',
    beschrijving: 'Microsoft Visio is het professionele hulpmiddel voor het maken van diagrammen, flowcharts, netwerkschema\'s en plattegronden. Onze training leert je snel en efficiënt werken met Visio.',
    highlights: ['Flowcharts', 'Netwerkdiagrammen', 'Plattegronden', 'Processchema\'s', 'Sjablonen gebruiken'],
  },
}

async function getCategorie(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('categorieen')
    .select('*')
    .eq('slug', slug)
    .single()

  return data as Categorie | null
}

async function getCursussen(categorieId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('cursussen')
    .select('*, categorie:categorieen(*)')
    .eq('categorie_id', categorieId)
    .eq('actief', true)
    .order('titel')

  return (data || []) as Cursus[]
}

export async function generateStaticParams() {
  const supabase = createServiceRoleClient()
  const { data } = await supabase.from('categorieen').select('slug')
  return (data || []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const config = categorieConfig[params.slug]
  if (!config) return { title: 'Categorie niet gevonden' }

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    openGraph: {
      title: `${config.seoTitle} | Compu Act Opleidingen`,
      description: config.seoDescription,
      type: 'website',
    },
  }
}

export default async function CategoriePage({ params }: { params: { slug: string } }) {
  const categorie = await getCategorie(params.slug)
  if (!categorie) notFound()

  const config = categorieConfig[params.slug]
  if (!config) notFound()

  const cursussen = await getCursussen(categorie.id)
  const Icon = config.icon

  const prijsRange = cursussen.length > 0
    ? { min: Math.min(...cursussen.map(c => c.prijs_vanaf)), max: Math.max(...cursussen.map(c => c.prijs_vanaf)) }
    : null

  const niveaus = [...new Set(cursussen.map(c => c.niveau))]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categorie.naam} cursussen - Compu Act Opleidingen`,
    description: config.seoDescription,
    numberOfItems: cursussen.length,
    itemListElement: cursussen.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.titel,
        description: c.korte_beschrijving,
        url: `https://www.computertraining.nl/cursussen/${c.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'Compu Act Opleidingen',
        },
        offers: {
          '@type': 'Offer',
          price: c.prijs_vanaf,
          priceCurrency: 'EUR',
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className={`bg-gradient-to-br ${config.gradient} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container-wide relative py-14 lg:py-20">
          <nav className="text-sm mb-6 opacity-70">
            <a href="/" className="hover:opacity-100 transition-opacity">Home</a>
            <span className="mx-2">/</span>
            <a href="/cursussen" className="hover:opacity-100 transition-opacity">Cursussen</a>
            <span className="mx-2">/</span>
            <span className="opacity-100">{categorie.naam}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/15 p-3.5 rounded-2xl backdrop-blur-sm">
                  <Icon size={32} />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  {categorie.naam} Cursussen
                </h1>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                {config.beschrijving}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 lg:gap-8 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-extrabold">{cursussen.length}</div>
                <div className="text-sm text-white/60">Cursussen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold">18</div>
                <div className="text-sm text-white/60">Locaties</div>
              </div>
              {prijsRange && (
                <div className="text-center">
                  <div className="text-3xl font-extrabold">&euro;{prijsRange.min}</div>
                  <div className="text-sm text-white/60">Vanaf</div>
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mt-8">
            {config.highlights.map((h) => (
              <span key={h} className="bg-white/10 backdrop-blur-sm text-white/90 text-sm px-3.5 py-1.5 rounded-full">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-primary-500 shrink-0" />
              <span className="text-zinc-600">Kleine groepen (max 10)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-primary-500 shrink-0" />
              <span className="text-zinc-600">18 locaties + live online</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Award size={18} className="text-primary-500 shrink-0" />
              <span className="text-zinc-600">Certificaat inbegrepen</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BookOpen size={18} className="text-primary-500 shrink-0" />
              <span className="text-zinc-600">Lesmateriaal inbegrepen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cursussen */}
      <section className="bg-zinc-50">
        <div className="container-wide py-12 lg:py-16">
          {/* Niveau filter info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">
                Alle {categorie.naam} trainingen
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {cursussen.length} cursus{cursussen.length !== 1 ? 'sen' : ''} beschikbaar — van beginner tot expert
              </p>
            </div>
            <div className="flex gap-2">
              {niveaus.map((n) => (
                <span key={n} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  n === 'beginner' ? 'bg-green-100 text-green-700' :
                  n === 'gevorderd' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {niveauLabel(n)}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursussen.map((cursus) => (
              <CursusCard key={cursus.id} cursus={cursus} />
            ))}
          </div>
        </div>
      </section>

      {/* Waarom kiezen voor Compu Act */}
      <section className="bg-white">
        <div className="container-wide py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-4">
                Waarom een {categorie.naam} cursus bij Compu Act?
              </h2>
              <p className="text-zinc-600 mb-6 leading-relaxed">
                Al meer dan 21 jaar trainen wij professionals in Microsoft Office. Onze ervaren docenten zorgen ervoor dat je de stof direct kunt toepassen in de praktijk.
              </p>
              <div className="space-y-3">
                {[
                  'Ervaren, gecertificeerde docenten',
                  'Praktijkgerichte oefeningen uit het werkveld',
                  'Kleine groepen voor persoonlijke aandacht',
                  'Inclusief lesmateriaal en certificaat',
                  'Klassikaal op 18 locaties of live online',
                  'InCompany training op maat mogelijk',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-primary-500 shrink-0" />
                    <span className="text-zinc-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${config.lightBg} rounded-2xl p-8 lg:p-10`}>
              <h3 className="font-bold text-xl mb-4">Niet zeker welke cursus past?</h3>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Onze opleidingsadviseurs helpen je graag bij het kiezen van de juiste {categorie.naam} training voor jouw niveau en doelen.
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block w-full text-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                  Advies aanvragen
                </Link>
                <Link
                  href="/incompany"
                  className="flex items-center justify-center gap-2 w-full text-center border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  <Building2 size={16} />
                  InCompany offerte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alle categorieën */}
      <section className="bg-zinc-50 border-t border-zinc-200">
        <div className="container-wide py-12">
          <h3 className="font-bold text-lg mb-4">Andere cursuscategorieën</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categorieConfig).filter(([slug]) => slug !== params.slug).map(([slug, conf]) => {
              const CatIcon = conf.icon
              return (
                <Link
                  key={slug}
                  href={`/cursussen/categorie/${slug}`}
                  className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-full text-sm font-medium text-zinc-700 hover:border-primary-300 hover:text-primary-500 transition-colors"
                >
                  <CatIcon size={14} />
                  {slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
