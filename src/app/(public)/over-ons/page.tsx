import { Metadata } from 'next'
import { Users, Award, MapPin, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Over ons',
  description: 'Al meer dan 21 jaar de specialist in Microsoft Office trainingen. Leer ons kennen.',
}

const feiten = [
  { icon: Clock, label: '21+ jaar', beschrijving: 'ervaring in trainingen' },
  { icon: Users, label: '15.000+', beschrijving: 'deelnemers opgeleid' },
  { icon: MapPin, label: '15+', beschrijving: 'locaties in Nederland' },
  { icon: Award, label: '9.2', beschrijving: 'gemiddelde beoordeling' },
]

export default function OverOnsPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Over ons</span>
          </nav>
          <h1 className="text-3xl font-bold">Over Compu Act Opleidingen</h1>
        </div>
      </div>

      <div className="container-narrow py-12 space-y-12">
        {/* Intro */}
        <div className="bg-white rounded-xl border border-zinc-200 p-8">
          <h2 className="text-2xl font-bold mb-4">Wie zijn wij?</h2>
          <div className="prose prose-zinc max-w-none space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Compu Act Opleidingen is al meer dan 21 jaar dé specialist in Microsoft Office trainingen.
              Wij bieden praktijkgerichte cursussen aan voor professionals die hun vaardigheden willen
              verbeteren in Excel, Word, PowerPoint, Outlook, Office 365 en meer.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Onze trainingen worden gegeven door ervaren docenten die niet alleen de theorie beheersen,
              maar ook weten hoe je de kennis direct kunt toepassen in de dagelijkse praktijk. We werken
              met kleine groepen zodat er voldoende ruimte is voor persoonlijke aandacht.
            </p>
          </div>
        </div>

        {/* Feiten */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {feiten.map((feit) => (
            <div key={feit.label} className="bg-white rounded-xl border border-zinc-200 p-6 text-center">
              <feit.icon size={28} className="text-primary-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-zinc-900">{feit.label}</div>
              <div className="text-sm text-zinc-500 mt-1">{feit.beschrijving}</div>
            </div>
          ))}
        </div>

        {/* Waarom Compu Act */}
        <div className="bg-white rounded-xl border border-zinc-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Waarom Compu Act?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Kleine groepen van maximaal 8 deelnemers',
              'Ervaren en gecertificeerde docenten',
              'Praktijkgerichte trainingen met direct toepasbare kennis',
              'Flexibele lesmethodes: klassikaal, online of incompany',
              '15+ trainingslocaties door heel Nederland',
              'Inclusief lesmateriaal en certificaat',
              'Persoonlijke aandacht en begeleiding',
              'Meer dan 21 jaar ervaring',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary-600 mt-0.5 shrink-0" />
                <span className="text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
