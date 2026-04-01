'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cursus } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle, Users, Laptop, Building2, BookOpen } from 'lucide-react'

const tabs = [
  { id: 'wat-leer-je', label: 'Wat leer je?' },
  { id: 'doelgroep', label: 'Doelgroep' },
  { id: 'voorkennis', label: 'Voorkennis' },
  { id: 'lesmethodes', label: 'Lesmethodes' },
  { id: 'incompany', label: 'InCompany' },
  { id: 'praktisch', label: 'Praktische info' },
]

export default function CursusDetailTabs({ cursus }: { cursus: Cursus }) {
  const [activeTab, setActiveTab] = useState('wat-leer-je')

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Tab headers */}
      <div className="flex overflow-x-auto gap-1 p-2 bg-zinc-50 border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all',
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 lg:p-8">
        {activeTab === 'wat-leer-je' && (
          <div>
            <h3 className="text-xl font-bold mb-5">Wat leer je in deze cursus?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {cursus.inhoud?.wat_leer_je?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-50 rounded-lg p-3">
                  <CheckCircle size={18} className="text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-700 text-sm">{item}</span>
                </div>
              )) || (
                <p className="text-zinc-500">Cursusinhoud wordt binnenkort toegevoegd.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'doelgroep' && (
          <div>
            <h3 className="text-xl font-bold mb-5">Voor wie is deze cursus?</h3>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              {(cursus.inhoud?.doelgroep || 'Neem contact op voor meer informatie over de doelgroep.').split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voorkennis' && (
          <div>
            <h3 className="text-xl font-bold mb-5">Benodigde voorkennis</h3>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              {(cursus.inhoud?.voorkennis || 'Geen specifieke voorkennis vereist.').split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lesmethodes' && (
          <div>
            <h3 className="text-xl font-bold mb-5">Beschikbare lesmethodes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-zinc-100 rounded-xl p-6 hover:border-primary-200 transition-colors">
                <div className="bg-primary-500 text-white p-2.5 rounded-lg inline-block mb-3">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-lg mb-2">Klassikaal</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Volg de cursus op een van onze 17 locaties door heel Nederland.
                  Kleine groepen met persoonlijke aandacht van de docent. Laptop en lesmateriaal zijn inbegrepen.
                </p>
              </div>
              <div className="border-2 border-zinc-100 rounded-xl p-6 hover:border-accent-200 transition-colors">
                <div className="bg-accent-500 text-white p-2.5 rounded-lg inline-block mb-3">
                  <Laptop size={20} />
                </div>
                <h4 className="font-bold text-lg mb-2">Live Online</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Volg de training vanuit huis of kantoor. Dezelfde interactie als
                  klassikaal, maar dan via een live verbinding met de docent.
                </p>
              </div>
              <div className="border-2 border-zinc-100 rounded-xl p-6 hover:border-green-200 transition-colors">
                <div className="bg-green-500 text-white p-2.5 rounded-lg inline-block mb-3">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-bold text-lg mb-2">Thuisstudie</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Leer in je eigen tempo met uitgebreid lesmateriaal. Je bepaalt zelf wanneer en waar je studeert, ideaal als je flexibel wilt leren.
                </p>
              </div>
              <div className="border-2 border-zinc-100 rounded-xl p-6 hover:border-primary-200 transition-colors">
                <div className="bg-primary-700 text-white p-2.5 rounded-lg inline-block mb-3">
                  <Building2 size={20} />
                </div>
                <h4 className="font-bold text-lg mb-2">InCompany</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Training op je eigen locatie, afgestemd op jouw organisatie. Flexibele planning en voordelig vanaf 4 deelnemers.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incompany' && (
          <div>
            <h3 className="text-xl font-bold mb-5">InCompany training</h3>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500 text-white p-3 rounded-xl shrink-0">
                  <Building2 size={24} />
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  {cursus.inhoud?.incompany_tekst ||
                    'Deze cursus is ook beschikbaar als InCompany training. Wij komen naar je locatie met een programma op maat, afgestemd op de wensen van jouw organisatie.'}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {['Training op je eigen locatie', 'Inhoud afgestemd op jouw organisatie', 'Flexibele planning', 'Voordeliger bij meerdere deelnemers'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-zinc-50 rounded-lg p-3">
                  <CheckCircle size={16} className="text-primary-500 shrink-0" />
                  <span className="text-sm text-zinc-700">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/incompany"
              className="inline-flex items-center bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25 transition-all"
            >
              InCompany offerte aanvragen
            </Link>
          </div>
        )}

        {activeTab === 'praktisch' && (
          <div>
            <h3 className="text-xl font-bold mb-5">Praktische informatie</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Lesmateriaal', value: cursus.inhoud?.lesmateriaal || 'Inbegrepen in de cursusprijs.' },
                { label: 'Certificaat', value: cursus.inhoud?.certificaat || 'Certificaat van deelname na afloop.' },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-50 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{item.label}</h4>
                  <p className="text-zinc-700 text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
