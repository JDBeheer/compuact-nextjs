import Link from 'next/link'
import { Monitor, Users, MapPin, Award, Star, ArrowRight, Building2, Laptop } from 'lucide-react'
import Card, { CardBody } from '@/components/ui/Card'

const populaireCursussen = [
  { titel: 'Excel Basis', slug: 'excel-basis', prijs: 275, niveau: 'Beginner', duur: '1 dag' },
  { titel: 'Excel Gevorderd', slug: 'excel-gevorderd', prijs: 275, niveau: 'Gevorderd', duur: '1 dag' },
  { titel: 'Excel voor Financials', slug: 'excel-voor-financials', prijs: 275, niveau: 'Expert', duur: '2 dagen' },
  { titel: 'Office 365', slug: 'office-365-voor-eindgebruikers', prijs: 335, niveau: 'Beginner', duur: '1 dag' },
  { titel: 'Outlook Alles-in-een', slug: 'outlook-alles-in-een', prijs: 310, niveau: 'Beginner', duur: '1 dag' },
  { titel: 'PowerPoint', slug: 'powerpoint', prijs: 275, niveau: 'Beginner', duur: '1 dag' },
]

const usps = [
  {
    icon: Users,
    titel: 'Kleine groepen',
    beschrijving: 'Maximaal 8 deelnemers per training voor persoonlijke aandacht en interactie.',
  },
  {
    icon: Monitor,
    titel: 'Praktijkgericht',
    beschrijving: 'Direct toepasbare kennis met oefeningen uit de dagelijkse praktijk.',
  },
  {
    icon: MapPin,
    titel: '15+ locaties',
    beschrijving: 'Trainingslocaties door heel Nederland, van Amsterdam tot Maastricht.',
  },
  {
    icon: Award,
    titel: 'Certificaat',
    beschrijving: 'Na afloop ontvangt u een officieel certificaat van deelname.',
  },
]

const lesmethodes = [
  {
    icon: Users,
    titel: 'Klassikaal',
    beschrijving: 'Leer in een groep op een van onze 15+ locaties door heel Nederland.',
    href: '/cursussen?lesmethode=klassikaal',
  },
  {
    icon: Laptop,
    titel: 'Live Online',
    beschrijving: 'Volg de training vanuit huis met live interactie met de docent.',
    href: '/cursussen?lesmethode=online',
  },
  {
    icon: Building2,
    titel: 'InCompany',
    beschrijving: 'Training op maat op uw eigen locatie, afgestemd op uw organisatie.',
    href: '/cursussen?lesmethode=incompany',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="container-wide py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Microsoft Office trainingen die je direct verder helpen
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
              Klassikaal, live online of incompany. Al meer dan 21 jaar de specialist in
              praktijkgerichte Microsoft Office cursussen door heel Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cursussen"
                className="inline-flex items-center justify-center bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Bekijk alle cursussen
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Offerte aanvragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USPs strip */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp) => (
              <div key={usp.titel} className="flex items-start gap-3">
                <div className="bg-primary-100 text-primary-600 p-2 rounded-lg shrink-0">
                  <usp.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{usp.titel}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{usp.beschrijving}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Populaire cursussen */}
      <section className="bg-zinc-50">
        <div className="container-wide py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Populaire cursussen</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Onze meest gevolgde Microsoft Office trainingen. Direct inschrijven of vraag een offerte aan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {populaireCursussen.map((cursus) => (
              <Link key={cursus.slug} href={`/cursussen/${cursus.slug}`}>
                <Card hover className="h-full">
                  <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <Monitor size={48} className="text-white/80" />
                  </div>
                  <CardBody>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        {cursus.niveau}
                      </span>
                      <span className="text-xs text-zinc-500">{cursus.duur}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{cursus.titel}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-primary-600 font-bold">
                        vanaf &euro;{cursus.prijs}
                      </span>
                      <span className="text-sm text-primary-600 font-medium flex items-center gap-1">
                        Bekijk cursus <ArrowRight size={14} />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/cursussen"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              Bekijk alle cursussen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Lesmethodes */}
      <section className="bg-white">
        <div className="container-wide py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Kies jouw lesmethode</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Elke cursus is beschikbaar in meerdere vormen. Kies wat het beste bij jou past.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {lesmethodes.map((methode) => (
              <Link key={methode.titel} href={methode.href}>
                <Card hover className="h-full">
                  <CardBody className="text-center py-8">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded-2xl inline-block mb-4">
                      <methode.icon size={32} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{methode.titel}</h3>
                    <p className="text-zinc-600 text-sm">{methode.beschrijving}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-zinc-50">
        <div className="container-narrow py-16">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-zinc-200 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-accent-500 fill-accent-500" />
              ))}
            </div>
            <blockquote className="text-lg lg:text-xl text-zinc-700 mb-6 italic leading-relaxed max-w-3xl mx-auto">
              &ldquo;De persoonlijke aandacht en het juiste niveau van de training maakten het verschil.
              Onze medewerkers konden de geleerde vaardigheden direct toepassen in hun dagelijks werk.&rdquo;
            </blockquote>
            <div>
              <p className="font-semibold text-zinc-900">Walther Piek</p>
              <p className="text-sm text-zinc-500">Arbeidsconsulent</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white">
        <div className="container-wide py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Klaar om te starten?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Bekijk ons cursusaanbod, kies je favoriete lesmethode en schrijf je direct in.
            Of vraag een vrijblijvende offerte aan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cursussen"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Bekijk cursussen
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
