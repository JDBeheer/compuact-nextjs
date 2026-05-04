import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Users, Award, ArrowRight, HelpCircle, Building2, ChevronRight } from 'lucide-react'
import { getGoogleReviews, fallbackReviews } from '@/lib/google-reviews'
import { GoogleReviewsBadge } from '@/components/GoogleReviews'
import LazyMap from '@/components/LazyMap'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Neem contact op met Compu Act. Bel 023-551 3409, mail info@computertraining.nl of bezoek ons in Zaandam. We helpen je graag met Microsoft Office trainingen.',
  openGraph: {
    title: 'Contact | Compu Act Opleidingen',
    description: 'Neem contact op met Compu Act. Bel 023-551 3409, mail info@computertraining.nl of bezoek ons in Zaandam. We helpen je graag met Microsoft Office trainingen.',
    type: 'website',
  },
}

export default async function ContactPage() {
  const reviewData = await getGoogleReviews() ?? fallbackReviews

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative container-narrow py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="text-sm text-primary-200 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Neem contact met ons op
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">
              Heb je een vraag over onze trainingen of wil je een offerte aanvragen?
              We staan voor je klaar en helpen je graag verder.
            </p>

            <GoogleReviewsBadge
              rating={reviewData.rating}
              totalReviews={reviewData.user_ratings_total}
              size="lg"
              variant="dark"
            />
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="-mt-8 relative z-10">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Bellen */}
            <a
              href="tel:0235513409"
              className="group bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                <Phone size={22} className="text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">Bellen</h2>
              <p className="text-xl font-bold text-primary-600 mb-2">023-551 3409</p>
              <p className="text-sm text-zinc-500">Ma t/m Vr: 09:00 - 17:00</p>
            </a>

            {/* E-mailen */}
            <a
              href="mailto:info@computertraining.nl"
              className="group bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-500 transition-colors">
                <Mail size={22} className="text-accent-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">E-mailen</h2>
              <p className="text-lg md:text-xl font-bold text-primary-600 mb-2 break-all">info@computertraining.nl</p>
              <p className="text-sm text-zinc-500">Stuur je vraag of aanvraag</p>
            </a>

            {/* Bezoeken */}
            <a
              href="https://maps.google.com/?q=Vincent+van+Goghweg+85,+1506+JB+Zaandam"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                <MapPin size={22} className="text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">Bezoeken</h2>
              <p className="text-base font-semibold text-zinc-800 mb-1">Vincent van Goghweg 85</p>
              <p className="text-sm text-zinc-500">1506 JB Zaandam</p>
            </a>
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="container-narrow py-16 md:py-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form (2 cols) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Openingstijden */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Openingstijden</h3>
              </div>
              <div className="space-y-3">
                {[
                  { dag: 'Maandag', tijd: '09:00 - 17:00' },
                  { dag: 'Dinsdag', tijd: '09:00 - 17:00' },
                  { dag: 'Woensdag', tijd: '09:00 - 17:00' },
                  { dag: 'Donderdag', tijd: '09:00 - 17:00' },
                  { dag: 'Vrijdag', tijd: '09:00 - 17:00' },
                  { dag: 'Zaterdag', tijd: 'Gesloten' },
                  { dag: 'Zondag', tijd: 'Gesloten' },
                ].map(({ dag, tijd }) => (
                  <div key={dag} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">{dag}</span>
                    <span className={tijd === 'Gesloten' ? 'text-zinc-400' : 'font-medium text-zinc-900'}>{tijd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Adresgegevens */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Adresgegevens</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-zinc-900">Compu Act Opleidingen</p>
                  <p className="text-zinc-600 mt-1">Vincent van Goghweg 85</p>
                  <p className="text-zinc-600">1506 JB Zaandam</p>
                </div>
                <div className="border-t border-zinc-100 pt-4 space-y-3">
                  <a href="tel:0235513409" className="flex items-center gap-3 text-zinc-700 hover:text-primary-600 transition-colors">
                    <Phone size={16} className="text-primary-500" />
                    023-551 3409
                  </a>
                  <a href="mailto:info@computertraining.nl" className="flex items-center gap-3 text-zinc-700 hover:text-primary-600 transition-colors">
                    <Mail size={16} className="text-primary-500" />
                    info@computertraining.nl
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <Link
              href="/veelgestelde-vragen"
              className="group block bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-200 rounded-xl flex items-center justify-center">
                  <HelpCircle size={20} className="text-primary-700" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Veelgestelde vragen</h3>
              </div>
              <p className="text-sm text-primary-700 mb-4">
                Vind snel antwoord op de meest gestelde vragen over onze trainingen, locaties en werkwijze.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                Bekijk FAQ
                <ChevronRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="container-narrow pb-16 md:pb-20">
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Onze locatie</h2>
                <p className="text-sm text-zinc-500">Vincent van Goghweg 85, 1506 JB Zaandam</p>
              </div>
            </div>
          </div>
          <LazyMap
            src="https://www.google.com/maps?q=Vincent+van+Goghweg+85,+1506+JB+Zaandam&output=embed"
            title="Compu Act Opleidingen locatie op Google Maps"
            height="h-80 md:h-96"
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white border-t border-zinc-200">
        <div className="container-narrow py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-3">
              Waarom kiezen voor Compu Act?
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Al meer dan 21 jaar de specialist in Microsoft Office trainingen in Nederland.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { waarde: '21+', label: 'Jaar ervaring', icon: Award },
              { waarde: '15.000+', label: 'Deelnemers opgeleid', icon: Users },
              { waarde: '15+', label: 'Locaties in NL', icon: MapPin },
              { waarde: `${reviewData.rating}`, label: 'Google beoordeling', icon: Award },
            ].map(({ waarde, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-zinc-900">{waarde}</p>
                <p className="text-sm text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Liever direct een offerte?
            </h3>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Vraag vrijblijvend een offerte op maat aan voor je team of organisatie.
            </p>
            <Link
              href="/inschrijven/gegevens?type=offerte"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-primary-50 hover:shadow-lg transition-all duration-300"
            >
              Offerte aanvragen
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
