import { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  Award,
  MapPin,
  Star,
  BookOpen,
  CheckCircle,
  UserCheck,
  Target,
  Laptop,
  Calendar,
  GraduationCap,
  Phone,
  ArrowRight,
  Monitor,
  Home,
  Building2,
  Heart,
  Shield,
} from 'lucide-react'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsSection } from '@/components/GoogleReviews'

export const metadata: Metadata = {
  title: 'Over Compu Act Opleidingen | 21+ Jaar Ervaring',
  description:
    'Al meer dan 21 jaar de specialist in Microsoft Office trainingen. 15.000+ deelnemers opgeleid, 17 locaties, kleine groepen en ervaren docenten.',
}

const stats = [
  { value: '21+', label: 'Jaar ervaring', icon: Award },
  { value: '15.000+', label: 'Deelnemers opgeleid', icon: Users },
  { value: '17', label: 'Locaties in Nederland', icon: MapPin },
  { value: '26', label: 'Cursussen', icon: BookOpen },
  { value: '4.8', label: 'Google beoordeling', icon: Star },
]

const differentiators = [
  {
    icon: Users,
    title: 'Kleine groepen',
    description: 'Maximaal 10 deelnemers per training voor optimale persoonlijke aandacht en interactie.',
  },
  {
    icon: UserCheck,
    title: 'Ervaren docenten',
    description: 'Gecertificeerde trainers met jarenlange praktijkervaring in Microsoft Office applicaties.',
  },
  {
    icon: Target,
    title: 'Praktijkgericht',
    description: 'Direct toepasbare kennis met oefeningen uit de dagelijkse praktijk van uw organisatie.',
  },
  {
    icon: Calendar,
    title: 'Flexibel plannen',
    description: 'Kies uit 4 lesmethodes en plan uw training op een moment dat u het beste uitkomt.',
  },
  {
    icon: Shield,
    title: 'All-in prijzen',
    description: 'Laptop, lesmateriaal, lunch, koffie/thee en certificaat zijn altijd inbegrepen.',
  },
  {
    icon: GraduationCap,
    title: 'Certificaat',
    description: 'Na afloop ontvangt u een officieel certificaat als bewijs van uw nieuwe vaardigheden.',
  },
]

const lesmethodes = [
  {
    icon: Laptop,
    title: 'Klassikaal',
    description: 'Volg een training op een van onze 17 locaties door heel Nederland.',
    href: '/lesmethodes#klassikaal',
  },
  {
    icon: Monitor,
    title: 'Live Online',
    description: 'Volg de training live vanuit huis of kantoor met dezelfde interactie.',
    href: '/lesmethodes#live-online',
  },
  {
    icon: Home,
    title: 'Thuisstudie',
    description: 'Leer in uw eigen tempo met uitgebreide videolessen en oefenmateriaal.',
    href: '/lesmethodes#thuisstudie',
  },
  {
    icon: Building2,
    title: 'InCompany',
    description: 'Training op maat bij u op locatie, afgestemd op uw organisatie.',
    href: '/lesmethodes#incompany',
  },
]

const usps = [
  'Al meer dan 21 jaar specialist in Microsoft Office trainingen',
  'Kleine groepen van maximaal 10 deelnemers',
  'Ervaren en gecertificeerde docenten',
  'Praktijkgerichte aanpak met direct toepasbare kennis',
  'Flexibele lesmethodes: klassikaal, online, thuis of incompany',
  'All-in prijzen inclusief laptop, materiaal, lunch en certificaat',
]

export default async function OverOnsPage() {
  const reviewData = await getGoogleReviews() ?? fallbackReviews

  return (
    <div className="bg-zinc-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative container-narrow py-16 sm:py-24">
          <nav className="text-sm text-primary-200 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Over ons</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Over Compu Act Opleidingen
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl leading-relaxed">
            Al meer dan 21 jaar helpen wij professionals in heel Nederland om het maximale uit
            Microsoft Office te halen. Met ervaren docenten, kleine groepen en een praktijkgerichte
            aanpak.
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative -mt-8 z-10">
        <div className="container-narrow">
          <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 px-4 text-center">
                <stat.icon size={22} className="text-accent-500 mb-2" />
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900">{stat.value}</span>
                <span className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onze Missie */}
      <section className="container-narrow py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Onze missie</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2 mb-6">
              Iedereen verdient de kans om efficienter te werken
            </h2>
            <div className="space-y-4 text-zinc-700 leading-relaxed">
              <p>
                Compu Act Opleidingen werd meer dan 21 jaar geleden opgericht door Mathieu Bruens
                met een duidelijke missie: professionals helpen om het maximale uit Microsoft Office
                te halen. Vanuit ons hoofdkantoor aan de Vincent van Goghweg 85 in Zaandam
                verzorgen wij trainingen door heel Nederland.
              </p>
              <p>
                Wij geloven dat iedereen, ongeacht niveau, efficienter kan leren werken met de
                juiste training. Daarom bieden wij 26 praktijkgerichte cursussen aan in Excel, Word,
                PowerPoint, Outlook, Power BI, AI en meer. Altijd in kleine groepen, altijd met
                ervaren docenten.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-8">
            <h3 className="text-lg font-bold text-zinc-900 mb-5">Waarom professionals voor ons kiezen</h3>
            <ul className="space-y-4">
              {usps.map((usp) => (
                <li key={usp} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-700">{usp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Wat ons onderscheidt */}
      <section className="bg-white border-y border-zinc-100">
        <div className="container-narrow py-16 sm:py-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Onze aanpak</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2">
              Wat ons onderscheidt
            </h2>
            <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
              Ontdek waarom meer dan 15.000 deelnemers Compu Act Opleidingen hebben gekozen voor hun Microsoft Office training.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-zinc-200 p-6 hover:border-primary-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lesmethodes preview */}
      <section className="container-narrow py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Flexibel leren</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2">
            4 lesmethodes, 1 doel
          </h2>
          <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
            Kies de lesmethode die het beste bij u past. Elke methode biedt dezelfde hoge kwaliteit training.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lesmethodes.map((methode) => (
            <Link
              key={methode.title}
              href={methode.href}
              className="group bg-white rounded-2xl border border-zinc-200 p-6 hover:border-primary-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors">
                <methode.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{methode.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">{methode.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                Meer info <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Google Reviews */}
      <section className="bg-white border-y border-zinc-100">
        <div className="container-narrow py-16 sm:py-20">
          <GoogleReviewsSection
            reviews={reviewData.reviews}
            allReviews={reviewData.allReviews}
            rating={reviewData.rating}
            totalReviews={reviewData.user_ratings_total}
          />
        </div>
      </section>

      {/* Team / Values */}
      <section className="container-narrow py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Ons team</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2 mb-6">
              Persoonlijke aanpak door ervaren docenten
            </h2>
            <div className="space-y-4 text-zinc-700 leading-relaxed">
              <p>
                Achter Compu Act staat een team van ervaren, gecertificeerde docenten die hun
                passie voor Microsoft Office graag delen. Elke docent heeft jarenlange
                praktijkervaring en weet precies hoe de kennis direct toepasbaar wordt in uw
                dagelijkse werk.
              </p>
              <p>
                Wij geloven in persoonlijke aandacht. Daarom werken wij bewust met kleine groepen
                van maximaal 10 deelnemers. Zo heeft elke deelnemer de ruimte om vragen te stellen
                en op zijn of haar eigen tempo te leren. Onze docenten passen de voorbeelden aan
                op uw branche en functie.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: 'Passie voor leren', description: 'Docenten die enthousiast hun kennis delen' },
              { icon: UserCheck, title: 'Gecertificeerd', description: 'Microsoft gecertificeerde trainers' },
              { icon: Target, title: 'Op maat', description: 'Voorbeelden uit uw eigen branche' },
              { icon: Users, title: 'Persoonlijk', description: 'Ruimte voor al uw vragen' },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-xl border border-zinc-200 p-5">
                <value.icon size={22} className="text-primary-500 mb-3" />
                <h3 className="font-bold text-zinc-900 text-sm mb-1">{value.title}</h3>
                <p className="text-xs text-zinc-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative container-narrow py-14 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Klaar om te starten met een training?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Neem contact met ons op voor persoonlijk advies of schrijf u direct in voor een training.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Neem contact op <ArrowRight size={16} />
            </Link>
            <a
              href="tel:0756 - 200 900"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
            >
              <Phone size={16} />
              075 - 6 200 900
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
