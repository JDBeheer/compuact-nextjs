import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { Cursus, CursusSessie, Categorie } from '@/types'
import SessieTable from '@/components/cursussen/SessieTable'
import CursusDetailTabs from '@/components/cursussen/CursusDetailTabs'
import CursusCard from '@/components/cursussen/CursusCard'
import { formatPrice, formatDateShort, niveauLabel } from '@/lib/utils'
import { Clock, Users, Award, BookOpen, Building2, Star, MapPin, CheckCircle, ArrowRight, Laptop,
  FileSpreadsheet, FileText, Monitor, Mail, Presentation, BarChart3, FolderKanban, Bot, PenTool,
  Shield, Phone
} from 'lucide-react'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsSection, GoogleReviewsBadge } from '@/components/GoogleReviews'

// ──── Category config ────
const categorieConfig: Record<string, {
  icon: typeof Monitor
  gradient: string
  lightBg: string
  h1: string
  subtitle: string
  beschrijving: string
  seoTitle: string
  seoDescription: string
  highlights: string[]
  seoContent: { title: string; text: string }[]
}> = {
  excel: {
    icon: FileSpreadsheet, gradient: 'from-emerald-600 to-emerald-800', lightBg: 'bg-emerald-50',
    h1: 'Excel Cursussen — Klassikaal en Online, van Basis tot Expert',
    subtitle: 'Leer Excel op jouw niveau. Praktijkgericht, met ervaren docenten, op 18 locaties door heel Nederland of live online.',
    seoTitle: 'Excel Cursus | Klassikaal & Online | Compu Act Opleidingen',
    seoDescription: 'Volg een Excel cursus bij Compu Act Opleidingen. Van Excel Basis tot VBA en Power BI. Klassikaal op 18 locaties of live online. Direct inschrijven of offerte aanvragen.',
    beschrijving: 'Onze Excel trainingen nemen je mee van de basis tot expert-niveau. Of je nu wilt leren werken met formules, draaitabellen, macro\'s of VBA — wij hebben de juiste cursus voor jou.',
    highlights: ['Formules en functies', 'Draaitabellen', 'Grafieken', 'VBA en macro\'s', 'Power BI', 'AI in Excel'],
    seoContent: [
      { title: 'Voor wie zijn onze Excel cursussen?', text: 'Onze Excel trainingen zijn geschikt voor iedereen die efficiënter wil werken met spreadsheets. Of je nu administratief medewerker bent, financieel analist, projectmanager of ondernemer — er is altijd een cursus die aansluit bij jouw niveau en leerdoelen. Van absolute beginners tot gevorderde gebruikers die VBA willen leren.' },
      { title: 'Wat maakt onze Excel trainingen anders?', text: 'Bij Compu Act leer je niet uit een boek, maar door te doen. Onze ervaren docenten werken met praktijkvoorbeelden uit het bedrijfsleven. Je leert vaardigheden die je direct kunt toepassen op je werk. Met kleine groepen van maximaal 10 deelnemers is er altijd ruimte voor persoonlijke vragen en aandacht.' },
    ],
  },
  word: {
    icon: FileText, gradient: 'from-blue-600 to-blue-800', lightBg: 'bg-blue-50',
    h1: 'Word Cursussen — Professionele Documenten Maken',
    subtitle: 'Van basis tekstverwerking tot complexe documenten, mailingen en sjablonen.',
    seoTitle: 'Word Cursus | Klassikaal & Online | Compu Act Opleidingen',
    seoDescription: 'Leer professioneel werken met Microsoft Word. Van basis tot complexe documenten, mailingen en sjablonen. Klassikaal of online bij Compu Act.',
    beschrijving: 'Word is veel meer dan een tekstverwerker. Onze trainingen leren je professionele documenten maken, sjablonen ontwerpen en mailingen verzorgen.',
    highlights: ['Professionele opmaak', 'Sjablonen', 'Formulieren', 'Mailingen', 'Complexe documenten'],
    seoContent: [
      { title: 'Voor wie zijn onze Word cursussen?', text: 'Onze Word trainingen zijn ideaal voor secretaresses, administratief medewerkers, communicatieprofessionals en iedereen die regelmatig professionele documenten maakt. Van brieven en rapporten tot contracten en brochures.' },
      { title: 'Praktijkgericht leren werken met Word', text: 'Je leert niet alleen de knoppen kennen, maar ook hoe je Word efficiënt inzet voor je dagelijkse werk. Denk aan het maken van huisstijl-documenten, het automatiseren van mailingen en het werken met lange, complexe documenten.' },
    ],
  },
  outlook: {
    icon: Mail, gradient: 'from-sky-600 to-sky-800', lightBg: 'bg-sky-50',
    h1: 'Outlook Cursussen — Efficiënt Werken met E-mail',
    subtitle: 'Leer e-mailbeheer, agenda planning en time management technieken.',
    seoTitle: 'Outlook Cursus | E-mail & Planning | Compu Act Opleidingen',
    seoDescription: 'Werk efficiënter met Outlook. Leer e-mailbeheer, agenda planning en time management bij Compu Act Opleidingen.',
    beschrijving: 'Outlook is de spil van je dagelijkse communicatie. Onze trainingen helpen je efficiënter te werken met e-mail, agenda, taken en contacten.',
    highlights: ['E-mailbeheer', 'Agenda planning', 'Time management', 'Taken', 'Tips en trucs'],
    seoContent: [
      { title: 'Waarom een Outlook cursus volgen?', text: 'De meeste professionals besteden dagelijks uren aan e-mail. Met de juiste technieken kun je tot 30 minuten per dag besparen. Onze Outlook training leert je slim omgaan met je inbox, agenda en taken.' },
    ],
  },
  powerpoint: {
    icon: Presentation, gradient: 'from-rose-600 to-rose-800', lightBg: 'bg-rose-50',
    h1: 'PowerPoint Cursus — Professionele Presentaties',
    subtitle: 'Leer overtuigende presentaties maken die indruk achterlaten.',
    seoTitle: 'PowerPoint Cursus | Presentaties | Compu Act Opleidingen',
    seoDescription: 'Maak professionele presentaties met PowerPoint bij Compu Act Opleidingen. Klassikaal of online.',
    beschrijving: 'Een goede presentatie maakt het verschil. Leer professionele slides ontwerpen en je boodschap overtuigend overbrengen.',
    highlights: ['Professioneel ontwerp', 'Animaties', 'SmartArt', 'Templates', 'Presentatietechnieken'],
    seoContent: [],
  },
  'power-bi': {
    icon: BarChart3, gradient: 'from-amber-600 to-amber-800', lightBg: 'bg-amber-50',
    h1: 'Power BI Cursussen — Data Visualisatie en Analyse',
    subtitle: 'Maak interactieve dashboards en rapportages met Power BI Desktop.',
    seoTitle: 'Power BI Cursus | Data Analyse | Compu Act Opleidingen',
    seoDescription: 'Leer data analyseren en visualiseren met Power BI Desktop bij Compu Act Opleidingen.',
    beschrijving: 'Power BI is hét platform voor data-analyse en visualisatie. Leer data importeren, transformeren en omzetten naar interactieve dashboards.',
    highlights: ['Data importeren', 'DAX formules', 'Dashboards', 'Rapportages', 'Excel integratie'],
    seoContent: [],
  },
  'office-365': {
    icon: Monitor, gradient: 'from-orange-600 to-red-700', lightBg: 'bg-orange-50',
    h1: 'Office 365 & Teams Cursussen',
    subtitle: 'Haal het maximale uit Microsoft 365, Teams, SharePoint en OneDrive.',
    seoTitle: 'Office 365 Cursus | Microsoft Teams | Compu Act Opleidingen',
    seoDescription: 'Leer werken met Office 365 en Microsoft Teams bij Compu Act Opleidingen.',
    beschrijving: 'Office 365 biedt een compleet pakket voor modern werken. Leer het maximale uit Teams, SharePoint, OneDrive en de Office-apps.',
    highlights: ['Microsoft Teams', 'SharePoint', 'OneDrive', 'Samenwerken', 'Office web apps'],
    seoContent: [],
  },
  ai: {
    icon: Bot, gradient: 'from-violet-600 to-purple-800', lightBg: 'bg-violet-50',
    h1: 'AI Cursussen — Werken met Kunstmatige Intelligentie',
    subtitle: 'Leer AI-tools zoals ChatGPT en Copilot effectief inzetten in je werk.',
    seoTitle: 'AI Cursus | ChatGPT & Copilot | Compu Act Opleidingen',
    seoDescription: 'Leer werken met AI tools zoals ChatGPT en Copilot. Praktijkgerichte AI cursussen bij Compu Act Opleidingen.',
    beschrijving: 'AI verandert de manier waarop we werken. Onze trainingen helpen je AI-tools effectief in te zetten — van introductie tot geavanceerd prompting.',
    highlights: ['ChatGPT', 'Copilot', 'Prompting', 'AI in Office', 'Praktische toepassingen'],
    seoContent: [
      { title: 'Waarom een AI cursus volgen?', text: 'Kunstmatige intelligentie is niet meer weg te denken uit het moderne werkveld. Met onze AI cursussen leer je hoe je tools als ChatGPT en Microsoft Copilot effectief en verantwoord inzet om je productiviteit te verhogen.' },
    ],
  },
  project: {
    icon: FolderKanban, gradient: 'from-teal-600 to-teal-800', lightBg: 'bg-teal-50',
    h1: 'Microsoft Project Cursus — Projectmanagement',
    subtitle: 'Leer projecten professioneel plannen en beheren.',
    seoTitle: 'Microsoft Project Cursus | Compu Act Opleidingen',
    seoDescription: 'Leer projecten plannen en beheren met Microsoft Project bij Compu Act Opleidingen.',
    beschrijving: 'Microsoft Project is de standaard voor professioneel projectmanagement. Leer projecten opzetten, plannen en voortgang bewaken.',
    highlights: ['Projectplanning', 'Gantt-diagrammen', 'Resources', 'Voortgang', 'Rapportages'],
    seoContent: [],
  },
  visio: {
    icon: PenTool, gradient: 'from-indigo-600 to-indigo-800', lightBg: 'bg-indigo-50',
    h1: 'Microsoft Visio Cursus — Diagrammen en Flowcharts',
    subtitle: 'Maak professionele diagrammen, flowcharts en processchema\'s.',
    seoTitle: 'Microsoft Visio Cursus | Compu Act Opleidingen',
    seoDescription: 'Leer professionele diagrammen en flowcharts maken met Visio bij Compu Act Opleidingen.',
    beschrijving: 'Visio is het professionele hulpmiddel voor diagrammen, flowcharts en plattegronden. Leer snel en efficiënt werken met Visio.',
    highlights: ['Flowcharts', 'Netwerkdiagrammen', 'Plattegronden', 'Processchema\'s', 'Sjablonen'],
    seoContent: [],
  },
}

const categorySlugs = new Set(Object.keys(categorieConfig))

const relatedCategories: Record<string, string[]> = {
  excel: ['word', 'power-bi', 'ai', 'office-365'],
  word: ['excel', 'outlook', 'powerpoint', 'office-365'],
  outlook: ['office-365', 'word', 'excel'],
  powerpoint: ['word', 'excel', 'office-365'],
  'power-bi': ['excel', 'ai', 'project'],
  'office-365': ['outlook', 'excel', 'word'],
  ai: ['excel', 'power-bi', 'office-365'],
  project: ['excel', 'visio', 'power-bi'],
  visio: ['project', 'excel', 'powerpoint'],
}

// ──── Data fetching ────
async function getCursus(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('slug', slug).eq('actief', true).single()
  return data as Cursus | null
}

async function getSessies(cursusId: string) {
  const supabase = createServerSupabaseClient()
  // Filter out sessions that have already started (tomorrow or later)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const { data } = await supabase.from('cursus_sessies').select('*, locatie:locaties(naam, stad)').eq('cursus_id', cursusId).eq('actief', true).gte('datum', minDate).order('datum')
  return (data || []).map((s: Record<string, unknown>) => ({
    ...s,
    locatie_naam: (s.locatie as Record<string, string>)?.naam || '',
    locatie_stad: (s.locatie as Record<string, string>)?.stad || '',
    lesdagen: Array.isArray(s.lesdagen) ? s.lesdagen as string[] : (typeof s.lesdagen === 'string' ? JSON.parse(s.lesdagen as string) : []),
  })) as CursusSessie[]
}

async function getRelatedCursussen(categorieId: string, currentId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('categorie_id', categorieId).eq('actief', true).neq('id', currentId).limit(3)
  return (data || []) as Cursus[]
}

async function getCategorie(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('categorieen').select('*').eq('slug', slug).single()
  return data as Categorie | null
}

async function getCategoryCursussen(categorieId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('cursussen').select('*, categorie:categorieen(*)').eq('categorie_id', categorieId).eq('actief', true).order('titel')
  return (data || []) as Cursus[]
}

// ──── Static params: both categories + courses ────
export async function generateStaticParams() {
  const supabase = createServiceRoleClient()
  const [{ data: cursusData }, { data: catData }] = await Promise.all([
    supabase.from('cursussen').select('slug').eq('actief', true),
    supabase.from('categorieen').select('slug'),
  ])
  const slugs = [
    ...(catData || []).map((c) => ({ slug: c.slug })),
    ...(cursusData || []).map((c) => ({ slug: c.slug })),
  ]
  return slugs
}

// ──── Metadata ────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Category?
  if (categorySlugs.has(params.slug)) {
    const config = categorieConfig[params.slug]
    return {
      title: config.seoTitle,
      description: config.seoDescription,
      openGraph: { title: `${config.seoTitle} | Compu Act Opleidingen`, description: config.seoDescription, type: 'website' },
    }
  }
  // Course
  const cursus = await getCursus(params.slug)
  if (!cursus) return { title: 'Niet gevonden' }
  return {
    title: `${cursus.titel} Cursus | Compu Act Opleidingen`,
    description: cursus.korte_beschrijving || `Volg de ${cursus.titel} training bij Compu Act Opleidingen. Klassikaal of live online, op 18 locaties door heel Nederland.`,
    openGraph: { title: `${cursus.titel} - Compu Act Opleidingen`, description: cursus.korte_beschrijving, type: 'website' },
  }
}

// ──── Page component ────
export default async function CursusOrCategoriePage({ params }: { params: { slug: string } }) {
  // Route to category page if slug matches a category
  if (categorySlugs.has(params.slug)) {
    return <CategoriePage slug={params.slug} />
  }
  // Otherwise render course detail
  return <CursusDetailPage slug={params.slug} />
}

// ══════════════════════════════════════════════
// CATEGORY PAGE
// ══════════════════════════════════════════════
async function CategoriePage({ slug }: { slug: string }) {
  const categorie = await getCategorie(slug)
  if (!categorie) notFound()
  const config = categorieConfig[slug]
  if (!config) notFound()

  const [cursussen, reviewData] = await Promise.all([
    getCategoryCursussen(categorie.id),
    getGoogleReviews().then(r => r ?? fallbackReviews),
  ])
  const Icon = config.icon
  const prijsRange = cursussen.length > 0 ? { min: Math.min(...cursussen.map(c => c.prijs_vanaf)) } : null
  const niveaus = [...new Set(cursussen.map(c => c.niveau))]
  const related = (relatedCategories[slug] || []).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `${categorie.naam} cursussen - Compu Act Opleidingen`,
    description: config.seoDescription,
    numberOfItems: cursussen.length,
    itemListElement: cursussen.map((c, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Course', name: c.titel, description: c.korte_beschrijving, url: `https://www.computertraining.nl/cursussen/${c.slug}`, provider: { '@type': 'Organization', name: 'Compu Act Opleidingen' }, offers: { '@type': 'Offer', price: c.prijs_vanaf, priceCurrency: 'EUR' } },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`bg-gradient-to-br ${config.gradient} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container-wide relative py-12 lg:py-16">
          <nav className="text-sm mb-6 opacity-60">
            <a href="/" className="hover:opacity-100">Home</a>
            <span className="mx-2">/</span>
            <a href="/cursussen" className="hover:opacity-100">Cursussen</a>
            <span className="mx-2">/</span>
            <span className="opacity-100">{categorie.naam}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/15 p-3 rounded-xl"><Icon size={28} /></div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{config.h1}</h1>
              </div>
              <p className="text-lg text-white/80 leading-relaxed mb-6">{config.subtitle}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Al meer dan 21 jaar specialist</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> All-in prijzen incl. materiaal</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Klassikaal, online of incompany</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:min-w-[260px] shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-accent-400 fill-accent-400" />)}</div>
                <span className="text-sm font-bold">{reviewData.rating}</span>
              </div>
              <p className="text-sm text-white/70 mb-4">Gebaseerd op {reviewData.user_ratings_total} Google recensies</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">Cursussen</span><span className="font-bold">{cursussen.length}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Locaties</span><span className="font-bold">18</span></div>
                {prijsRange && <div className="flex justify-between"><span className="text-white/60">Vanaf</span><span className="font-bold">{formatPrice(prijsRange.min)}</span></div>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {config.highlights.map((h) => (
              <span key={h} className="bg-white/10 text-white/90 text-sm px-3 py-1 rounded-full">{h}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {[
              { icon: Users, text: 'Kleine groepen (max 10)' },
              { icon: MapPin, text: '18 locaties + live online' },
              { icon: Award, text: 'Certificaat inbegrepen' },
              { icon: Shield, text: 'Niet goed? Geld terug' },
            ].map((usp) => (
              <div key={usp.text} className="flex items-center gap-2.5">
                <usp.icon size={16} className="text-primary-500 shrink-0" />
                <span className="text-zinc-600">{usp.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="container-wide py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">Kies jouw {categorie.naam} training</h2>
              <p className="text-zinc-500 text-sm mt-1">{cursussen.length} cursus{cursussen.length !== 1 ? 'sen' : ''} beschikbaar</p>
            </div>
            <div className="flex gap-2">
              {niveaus.map((n) => (
                <span key={n} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${n === 'beginner' ? 'bg-green-100 text-green-700' : n === 'gevorderd' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{niveauLabel(n)}</span>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursussen.map((cursus) => <CursusCard key={cursus.id} cursus={cursus} />)}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-wide py-16">
          <GoogleReviewsSection reviews={reviewData.reviews} allReviews={reviewData.allReviews} rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} title={`Wat cursisten vinden van onze ${categorie.naam} trainingen`} variant="gray" />
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="container-wide py-16">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-extrabold mb-4">Waarom een {categorie.naam} cursus bij Compu Act?</h2>
              <p className="text-zinc-600 mb-6 leading-relaxed max-w-xl">Al meer dan 21 jaar trainen wij professionals in Microsoft Office. Onze ervaren docenten zorgen ervoor dat je de stof direct kunt toepassen.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Award, text: 'Ervaren, gecertificeerde docenten' },
                  { icon: Users, text: 'Kleine groepen, persoonlijke aandacht' },
                  { icon: CheckCircle, text: 'Praktijkgerichte oefeningen' },
                  { icon: BookOpen, text: 'Inclusief lesmateriaal en certificaat' },
                  { icon: MapPin, text: 'Klassikaal op 18 locaties of online' },
                  { icon: Building2, text: 'InCompany training op maat' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 bg-white rounded-lg p-3 border border-zinc-100">
                    <item.icon size={16} className="text-primary-500 shrink-0" />
                    <span className="text-sm text-zinc-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className={`${config.lightBg} rounded-2xl p-7`}>
                <h3 className="font-bold text-lg mb-2">Niet zeker welke cursus past?</h3>
                <p className="text-zinc-600 text-sm mb-5 leading-relaxed">Onze opleidingsadviseurs helpen je graag bij het kiezen van de juiste training voor jouw niveau en doelen.</p>
                <div className="space-y-2.5">
                  <a href="tel:0235513409" className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all text-sm">
                    <Phone size={16} /> 023-551 3409
                  </a>
                  <Link href="/incompany" className="flex items-center justify-center gap-2 w-full border-2 border-zinc-200 bg-white text-zinc-700 px-5 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all text-sm">
                    <Building2 size={16} /> InCompany offerte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {config.seoContent.length > 0 && (
        <section className="bg-white">
          <div className="container-narrow py-16">
            <div className="grid md:grid-cols-2 gap-10">
              {config.seoContent.map((block) => (
                <div key={block.title}>
                  <h3 className="font-bold text-lg mb-3">{block.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{block.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-zinc-50 border-t border-zinc-200">
        <div className="container-wide py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg">Niet gevonden wat je zocht?</h3>
              <p className="text-sm text-zinc-500">Ontdek ons brede aanbod aan Office en IT trainingen.</p>
            </div>
            <Link href="/cursussen" className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600 shrink-0">
              Alle cursussen <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((s) => {
              const conf = categorieConfig[s]
              if (!conf) return null
              const CatIcon = conf.icon
              return (
                <Link key={s} href={`/cursussen/${s}`} className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-primary-200 hover:shadow-md transition-all group">
                  <div className={`bg-gradient-to-br ${conf.gradient} text-white p-2.5 rounded-lg inline-block mb-3`}><CatIcon size={20} /></div>
                  <h4 className="font-bold group-hover:text-primary-500 transition-colors">{s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')} cursussen</h4>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{conf.beschrijving}</p>
                </Link>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {Object.entries(categorieConfig).filter(([s]) => s !== slug && !related.includes(s)).map(([s, conf]) => {
              const CatIcon = conf.icon
              return (
                <Link key={s} href={`/cursussen/${s}`} className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-full text-sm text-zinc-600 hover:border-primary-300 hover:text-primary-500 transition-colors">
                  <CatIcon size={13} />
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

// ══════════════════════════════════════════════
// COURSE DETAIL PAGE
// ══════════════════════════════════════════════
async function CursusDetailPage({ slug }: { slug: string }) {
  const cursus = await getCursus(slug)
  if (!cursus) notFound()

  const [sessies, related, reviewData] = await Promise.all([
    getSessies(cursus.id),
    getRelatedCursussen(cursus.categorie_id, cursus.id),
    getGoogleReviews().then(r => r ?? fallbackReviews),
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

      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8 lg:py-10">
          <nav className="text-sm text-zinc-400 mb-5">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/cursussen" className="hover:text-primary-500">Cursussen</a>
            {cursus.categorie && (
              <>
                <span className="mx-1.5">/</span>
                <a href={`/cursussen/${cursus.categorie.slug}`} className="hover:text-primary-500">{cursus.categorie.naam}</a>
              </>
            )}
            <span className="mx-1.5">/</span>
            <span className="text-zinc-700">{cursus.titel}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-10">
            <div className="flex-1 lg:max-w-2xl">
              <div className="mb-3">
                <GoogleReviewsBadge rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} size="sm" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight">{cursus.titel}</h1>
              <p className="text-zinc-600 text-lg leading-relaxed mb-6">{cursus.korte_beschrijving || `Praktijkgericht leren werken met ${cursus.titel}. Direct toepasbaar in je werk.`}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> All-in prijs incl. laptop, lesmateriaal en certificaat</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Klassikaal, Live Online, Thuisstudie of InCompany</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-primary-500" /> Landelijke locaties, goed bereikbaar</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#cursusaanbod" className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98]">Direct inschrijven</a>
                <a href="#cursusaanbod" className="inline-flex items-center border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all">Cursusdata bekijken</a>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:w-[300px] shrink-0">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 lg:sticky lg:top-24">
                <h2 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4">Cursusinformatie</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-zinc-500 flex items-center gap-2"><Clock size={15} /> Duur</span><span className="font-semibold text-sm">{cursus.duur}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-zinc-500 flex items-center gap-2"><Award size={15} /> Niveau</span><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${niveauColors[cursus.niveau]}`}>{niveauLabel(cursus.niveau)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-zinc-500 flex items-center gap-2"><Users size={15} /> Groepsgrootte</span><span className="font-semibold text-sm">Max 10</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-zinc-500 flex items-center gap-2"><MapPin size={15} /> Locaties</span><span className="font-semibold text-sm">18 + online</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-zinc-500 flex items-center gap-2"><BookOpen size={15} /> Materiaal</span><span className="font-semibold text-sm">Inbegrepen</span></div>
                  {sessies.length > 0 && (
                    <div className="flex items-center justify-between"><span className="text-sm text-zinc-500">Eerstvolgende</span><span className="font-semibold text-sm">{formatDateShort(sessies[0].datum)}</span></div>
                  )}
                </div>
                <div className="border-t border-zinc-200 mt-4 pt-4">
                  <div className="text-xs text-zinc-400 mb-1">Vanaf</div>
                  <div className="text-3xl font-extrabold text-zinc-900">{formatPrice(cursus.prijs_vanaf)}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">excl. 21% BTW &amp; €15 administratiekosten</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full"><Users size={11} /> Klassikaal</span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full"><Laptop size={11} /> Live Online</span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full"><BookOpen size={11} /> Thuisstudie</span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-full"><Building2 size={11} /> InCompany</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-zinc-50">
        <div className="container-wide py-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              {cursus.beschrijving && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Cursusinformatie</h2>
                  <p className="text-zinc-600 leading-relaxed">{cursus.beschrijving}</p>
                </div>
              )}
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
              <CursusDetailTabs cursus={cursus} />
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <a href="#cursusaanbod" className="block w-full text-center bg-primary-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-[0.98] mb-3">Direct inschrijven</a>
                <Link href="/incompany" className="flex items-center justify-center gap-2 w-full border-2 border-zinc-200 bg-white text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 transition-all text-sm"><Building2 size={15} /> InCompany offerte</Link>
                <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-accent-500 fill-accent-500" />)}</div>
                    <span className="text-sm font-bold">{reviewData.rating}</span>
                    <span className="text-xs text-zinc-400">{reviewData.user_ratings_total} reviews</span>
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

          <div className="mt-10" id="cursusaanbod">
            <h2 className="text-2xl font-extrabold mb-6">Cursusaanbod</h2>
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <SessieTable sessies={sessies} cursusTitel={cursus.titel} />
            </div>
          </div>

          <div className="mt-12">
            <GoogleReviewsSection reviews={reviewData.reviews} allReviews={reviewData.allReviews} rating={reviewData.rating} totalReviews={reviewData.user_ratings_total} title="Dit zeggen onze cursisten" />
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold flex items-center gap-3"><Building2 size={28} />{cursus.titel} als InCompany training</h3>
              <p className="text-primary-200 mt-2 max-w-xl leading-relaxed">Wil je deze cursus op maat voor jouw team? Wij komen naar je locatie met een programma afgestemd op jouw organisatie. Flexibel, voordelig en persoonlijk.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-300 mt-3">
                <span>&#10003; Op je eigen locatie of online</span>
                <span>&#10003; Inhoud op maat</span>
                <span>&#10003; Voordelig vanaf 4 deelnemers</span>
              </div>
            </div>
            <Link href="/incompany" className="bg-white text-primary-700 px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98] shrink-0">InCompany offerte aanvragen</Link>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">Gerelateerde cursussen</h2>
                {cursus.categorie && (
                  <Link href={`/cursussen/${cursus.categorie.slug}`} className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600">
                    Alle {cursus.categorie.naam} cursussen <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => <CursusCard key={r.id} cursus={r} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
