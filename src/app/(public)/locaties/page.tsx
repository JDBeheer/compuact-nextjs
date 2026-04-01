import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { locaties } from '@/data/locaties'
import PostcodeZoeker from '@/components/locaties/PostcodeZoeker'

export const metadata: Metadata = {
  title: 'Cursuslocaties | 17 Locaties door heel Nederland | Compu Act Opleidingen',
  description: 'Volg een cursus bij Compu Act Opleidingen op een van onze 17 trainingslocaties door heel Nederland. Van Alkmaar tot Eindhoven, altijd bij jou in de buurt.',
}

export default function LocatiesOverzicht() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-wide py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary-200 text-sm font-medium mb-4">
              <MapPin size={16} />
              17 locaties door heel Nederland
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Cursuslocaties
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl leading-relaxed">
              Volg een cursus bij jou in de buurt. Onze trainingslocaties zijn goed bereikbaar en modern ingericht. Inclusief laptop, lesmateriaal, lunch en certificaat.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-primary-200">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Kleine groepen (max. 10)</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} /> All-in prijzen</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Gratis parkeren op de meeste locaties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Postcode zoeker */}
      <div className="container-wide pt-12 pb-6">
        <PostcodeZoeker />
      </div>

      {/* Locatie grid */}
      <div className="container-wide pb-12">
        <h2 className="text-2xl font-extrabold mb-6">Alle locaties</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locaties.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locaties/${loc.slug}`}
              className="group bg-white rounded-xl border border-zinc-200 p-5 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-primary-500" />
                    <h2 className="font-bold text-lg text-zinc-900">{loc.naam}</h2>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3">
                    {loc.adres}, {loc.postcode} {loc.naam === 'Limburg' ? 'Eindhoven' : loc.naam}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.lesvormen.slice(0, 3).map((lv) => (
                      <span key={lv} className="text-[11px] font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                        {lv}
                      </span>
                    ))}
                    {loc.lesvormen.length > 3 && (
                      <span className="text-[11px] font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
                        +{loc.lesvormen.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-primary-500 group-hover:text-white text-zinc-400 flex items-center justify-center transition-all">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-10 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Liever vanuit huis leren?</h2>
          <p className="text-primary-200 mb-6 max-w-xl mx-auto">
            Al onze cursussen zijn ook beschikbaar als Live Online training via Microsoft Teams. Dezelfde kwaliteit, vanuit je eigen werkplek.
          </p>
          <Link href="/cursussen" className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-all">
            Bekijk alle cursussen <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
