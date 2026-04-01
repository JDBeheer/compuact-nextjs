import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ArrowRight, Star, CheckCircle, Clock } from 'lucide-react'

const cursusLinks = [
  { naam: 'Excel cursussen', href: '/cursussen/categorie/excel' },
  { naam: 'Word cursussen', href: '/cursussen/categorie/word' },
  { naam: 'Outlook cursussen', href: '/cursussen/categorie/outlook' },
  { naam: 'PowerPoint cursussen', href: '/cursussen/categorie/powerpoint' },
  { naam: 'Power BI cursussen', href: '/cursussen/categorie/power-bi' },
  { naam: 'AI cursussen', href: '/cursussen/categorie/ai' },
  { naam: 'Office 365 cursussen', href: '/cursussen/categorie/office-365' },
  { naam: 'Alle cursussen', href: '/cursussen' },
]

const populaireCursussen = [
  { naam: 'Excel Basis', href: '/cursussen/excel-basis' },
  { naam: 'Excel Gevorderd', href: '/cursussen/excel-gevorderd' },
  { naam: 'Word Basis', href: '/cursussen/word-basis' },
  { naam: 'Prompting met AI', href: '/cursussen/prompting-met-ai' },
  { naam: 'Power BI Desktop', href: '/cursussen/power-bi-desktop' },
  { naam: 'Outlook Alles-in-een', href: '/cursussen/outlook-alles-in-een' },
]

const lesmethodes = [
  { naam: 'Klassikaal', href: '/cursussen', beschrijving: '18 locaties door heel Nederland' },
  { naam: 'Live Online', href: '/cursussen', beschrijving: 'Volg de training vanuit huis' },
  { naam: 'Thuisstudie', href: '/cursussen', beschrijving: 'Leer in je eigen tempo' },
  { naam: 'InCompany', href: '/incompany', beschrijving: 'Training op maat bij jou op locatie' },
]

const bedrijfLinks = [
  { naam: 'Over ons', href: '/over-ons' },
  { naam: 'Contact', href: '/contact' },
  { naam: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
  { naam: 'Privacybeleid', href: '/privacybeleid' },
  { naam: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
]

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      {/* Pre-footer CTA band */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-wide py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl lg:text-2xl font-extrabold text-white">
                Niet gevonden wat je zoekt?
              </h3>
              <p className="text-primary-200 mt-1 max-w-lg">
                Neem contact met ons op. We helpen je graag bij het kiezen van de juiste cursus of stellen een programma op maat samen.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:0851058919"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Phone size={16} />
                085 105 8919
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Stuur een bericht
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand — wider column */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Image src="/images/logo.svg" alt="Compu Act Opleidingen" width={160} height={51} className="brightness-0 invert" />
            </div>
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              Al meer dan 21 jaar dé specialist in Microsoft Office trainingen door heel Nederland. Van beginner tot expert, klassikaal of online.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <a href="tel:0851058919" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors group">
                <span className="bg-zinc-800 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <Phone size={14} className="text-primary-400" />
                </span>
                085 105 8919
              </a>
              <a href="mailto:info@computertraining.nl" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors group">
                <span className="bg-zinc-800 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <Mail size={14} className="text-primary-400" />
                </span>
                info@computertraining.nl
              </a>
              <div className="flex items-start gap-2.5 text-sm">
                <span className="bg-zinc-800 p-2 rounded-lg">
                  <MapPin size={14} className="text-primary-400" />
                </span>
                <span>Vincent van Goghweg 85<br />1506 JB Zaandam</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-500">
                <span className="bg-zinc-800 p-2 rounded-lg">
                  <Clock size={14} className="text-primary-400" />
                </span>
                Ma t/m vr: 09:00 - 17:00
              </div>
            </div>

            {/* Google review badge */}
            <div className="bg-zinc-800/80 rounded-xl p-4 border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">4.8</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-accent-400 fill-accent-400" />)}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Gebaseerd op 90 Google recensies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cursussen */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Cursussen</h3>
            <ul className="space-y-2.5">
              {cursusLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white hover:pl-1 transition-all duration-150">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Populaire cursussen */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Populair</h3>
            <ul className="space-y-2.5">
              {populaireCursussen.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white hover:pl-1 transition-all duration-150">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lesmethodes */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Lesmethodes</h3>
            <ul className="space-y-3">
              {lesmethodes.map((link) => (
                <li key={link.naam}>
                  <Link href={link.href} className="group">
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors block">
                      {link.naam}
                    </span>
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      {link.beschrijving}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bedrijf */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Bedrijf</h3>
            <ul className="space-y-2.5">
              {bedrijfLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white hover:pl-1 transition-all duration-150">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CheckCircle size={13} className="text-primary-400 shrink-0" />
                <span>All-in cursusprijs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CheckCircle size={13} className="text-primary-400 shrink-0" />
                <span>Niet goed? Geld terug</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CheckCircle size={13} className="text-primary-400 shrink-0" />
                <span>15.000+ deelnemers opgeleid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="container-wide py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Compu Act Opleidingen. Alle rechten voorbehouden.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
            <span>KvK: 37101857</span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span>BTW: NL002497551B01</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
