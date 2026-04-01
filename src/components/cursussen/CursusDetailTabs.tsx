'use client'

import { useState } from 'react'
import { Cursus } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

const tabs = [
  { id: 'wat-leer-je', label: 'Wat leer je?' },
  { id: 'programma', label: 'Programma' },
  { id: 'lesmethodes', label: 'Lesmethodes' },
  { id: 'incompany', label: 'InCompany' },
  { id: 'praktisch', label: 'Praktische info' },
]

export default function CursusDetailTabs({ cursus }: { cursus: Cursus }) {
  const [activeTab, setActiveTab] = useState('wat-leer-je')

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Tab headers */}
      <div className="flex overflow-x-auto border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'wat-leer-je' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Wat leer je in deze cursus?</h3>
            <ul className="space-y-2">
              {cursus.inhoud?.wat_leer_je?.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-primary-600 mt-0.5 shrink-0" />
                  <span className="text-zinc-700">{item}</span>
                </li>
              )) || (
                <li className="text-zinc-500">Cursusinhoud wordt binnenkort toegevoegd.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'programma' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Programma</h3>
            <ol className="space-y-3">
              {cursus.inhoud?.programma?.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="bg-primary-100 text-primary-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-zinc-700 pt-0.5">{item}</span>
                </li>
              )) || (
                <li className="text-zinc-500">Programma wordt binnenkort toegevoegd.</li>
              )}
            </ol>
          </div>
        )}

        {activeTab === 'lesmethodes' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Beschikbare lesmethodes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-zinc-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Klassikaal</h4>
                <p className="text-sm text-zinc-600">
                  Volg de cursus op een van onze 15+ locaties door heel Nederland.
                  Kleine groepen met persoonlijke aandacht van de docent.
                </p>
              </div>
              <div className="border border-zinc-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Live Online</h4>
                <p className="text-sm text-zinc-600">
                  Volg de training vanuit huis of kantoor. Dezelfde interactie als
                  klassikaal, maar dan via een online verbinding.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incompany' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">InCompany training</h3>
            <p className="text-zinc-700 mb-4">
              {cursus.inhoud?.incompany_tekst ||
                'Deze cursus is ook beschikbaar als InCompany training. Wij komen naar uw locatie met een programma op maat, afgestemd op de wensen van uw organisatie.'}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary-600 mt-0.5" />
                <span className="text-zinc-700">Training op uw eigen locatie</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary-600 mt-0.5" />
                <span className="text-zinc-700">Inhoud afgestemd op uw organisatie</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary-600 mt-0.5" />
                <span className="text-zinc-700">Flexibele planning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary-600 mt-0.5" />
                <span className="text-zinc-700">Voordeliger bij meerdere deelnemers</span>
              </li>
            </ul>
            <a
              href="/offerte"
              className="inline-flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Offerte aanvragen
            </a>
          </div>
        )}

        {activeTab === 'praktisch' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Praktische informatie</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-1">Doelgroep</h4>
                <p className="text-zinc-700">{cursus.inhoud?.doelgroep || 'Neem contact op voor meer informatie.'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-1">Voorkennis</h4>
                <p className="text-zinc-700">{cursus.inhoud?.voorkennis || 'Geen specifieke voorkennis vereist.'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-1">Lesmateriaal</h4>
                <p className="text-zinc-700">{cursus.inhoud?.lesmateriaal || 'Inbegrepen in de cursusprijs.'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-1">Certificaat</h4>
                <p className="text-zinc-700">{cursus.inhoud?.certificaat || 'Certificaat van deelname na afloop.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
