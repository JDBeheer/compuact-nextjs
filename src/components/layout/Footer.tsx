import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

const cursusLinks = [
  { naam: 'Excel cursussen', href: '/cursussen?categorie=excel' },
  { naam: 'Word cursussen', href: '/cursussen?categorie=word' },
  { naam: 'Office 365', href: '/cursussen?categorie=office-365' },
  { naam: 'Outlook', href: '/cursussen?categorie=outlook' },
  { naam: 'Power BI', href: '/cursussen?categorie=power-bi' },
  { naam: 'PowerPoint', href: '/cursussen?categorie=powerpoint' },
]

const lesmethodes = [
  { naam: 'Klassikaal', href: '/cursussen?lesmethode=klassikaal' },
  { naam: 'Live Online', href: '/cursussen?lesmethode=online' },
  { naam: 'InCompany', href: '/cursussen?lesmethode=incompany' },
  { naam: 'Thuisstudie', href: '/cursussen?lesmethode=thuisstudie' },
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
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image src="/images/logo.svg" alt="Compu Act Opleidingen" width={160} height={51} className="brightness-0 invert" />
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Al meer dan 21 jaar dé specialist in Microsoft Office trainingen door heel Nederland.
            </p>
            <div className="space-y-3">
              <a href="tel:0851058919" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Phone size={16} className="text-primary-500" />
                085 105 8919
              </a>
              <a href="mailto:info@computertraining.nl" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail size={16} className="text-primary-500" />
                info@computertraining.nl
              </a>
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="text-primary-500 mt-0.5" />
                <span>Vincent van Goghweg 85<br />1506 JB Zaandam</span>
              </div>
            </div>
          </div>

          {/* Cursussen */}
          <div>
            <h3 className="text-white font-semibold mb-4">Cursussen</h3>
            <ul className="space-y-2">
              {cursusLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lesmethodes */}
          <div>
            <h3 className="text-white font-semibold mb-4">Lesmethodes</h3>
            <ul className="space-y-2">
              {lesmethodes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bedrijf */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bedrijf</h3>
            <ul className="space-y-2">
              {bedrijfLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.naam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800">
        <div className="container-wide py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Compu Act Opleidingen. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-zinc-600">
            KvK: 12345678 | BTW: NL123456789B01
          </p>
        </div>
      </div>
    </footer>
  )
}
