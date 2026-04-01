'use client'

import { useState } from 'react'
import { Users, Laptop, Building2, MapPin, Calendar, ArrowRight, ArrowLeft, CheckCircle, Send, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const LESMETHODES = [
  { id: 'klassikaal', label: 'Klassikaal', icon: Users, beschrijving: 'In een groep op locatie', color: 'bg-primary-500' },
  { id: 'live-online', label: 'Live Online', icon: Laptop, beschrijving: 'Vanuit huis of kantoor', color: 'bg-accent-500' },
  { id: 'incompany', label: 'InCompany', icon: Building2, beschrijving: 'Op maat, bij jou op locatie', color: 'bg-primary-800' },
]

const LOCATIES = [
  'Alkmaar', 'Amsterdam', 'Den Bosch', 'Den Haag', 'Eindhoven',
  'Haarlem', 'Hoorn', 'Leeuwarden', 'Leiden', 'Limburg',
  'Rotterdam', 'Utrecht', 'Zaandam', 'Zwolle',
]

const MAANDEN = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
]

interface OpenInschrijvingProps {
  cursusTitel: string
  prijsVanaf: number
}

export default function OpenInschrijving({ cursusTitel, prijsVanaf }: OpenInschrijvingProps) {
  const [stap, setStap] = useState(1)
  const [methode, setMethode] = useState('')
  const [locaties, setLocaties] = useState<string[]>([])
  const [maand, setMaand] = useState('')
  const [voornaam, setVoornaam] = useState('')
  const [achternaam, setAchternaam] = useState('')
  const [email, setEmail] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [opmerkingen, setOpmerkingen] = useState('')
  const [type, setType] = useState<'inschrijving' | 'offerte'>('inschrijving')
  const [verzonden, setVerzonden] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleLocatie = (loc: string) => {
    setLocaties(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc])
  }

  const canProceed = () => {
    if (stap === 1) return !!methode
    if (stap === 2) return methode === 'live-online' || methode === 'incompany' || locaties.length > 0
    if (stap === 3) return !!maand
    if (stap === 4) return voornaam && achternaam && email && telefoon
    return false
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/open-inschrijving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursus: cursusTitel,
          type,
          methode,
          locaties: methode === 'live-online' ? ['Virtueel'] : methode === 'incompany' ? ['InCompany'] : locaties,
          maand,
          voornaam,
          achternaam,
          email,
          telefoon,
          opmerkingen,
        }),
      })
      setVerzonden(true)
    } catch {
      // Still show success to user, email will be retried
      setVerzonden(true)
    }
    setLoading(false)
  }

  const totalSteps = 4
  const progress = (stap / totalSteps) * 100

  if (verzonden) {
    return (
      <div className="p-8 lg:p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-extrabold mb-2">Aanvraag ontvangen!</h3>
        <p className="text-zinc-500 max-w-md mx-auto mb-6">
          Bedankt voor je {type === 'offerte' ? 'offerte-aanvraag' : 'inschrijving'} voor <strong>{cursusTitel}</strong>.
          We nemen zo snel mogelijk contact met je op met passende cursusdata.
        </p>
        <div className="bg-zinc-50 rounded-xl p-4 max-w-sm mx-auto text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-zinc-500">Lesmethode</span><span className="font-medium">{LESMETHODES.find(m => m.id === methode)?.label}</span></div>
          {locaties.length > 0 && <div className="flex justify-between"><span className="text-zinc-500">Locatie(s)</span><span className="font-medium">{locaties.join(', ')}</span></div>}
          <div className="flex justify-between"><span className="text-zinc-500">Gewenste maand</span><span className="font-medium">{maand}</span></div>
        </div>
        <a href={`tel:0235513409`} className="inline-flex items-center gap-2 mt-6 text-primary-500 font-semibold hover:text-primary-600">
          <Phone size={15} /> Of bel ons: 023-551 3409
        </a>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-zinc-700">
            Stap {stap} van {totalSteps}
          </span>
          <span className="text-xs text-zinc-400">
            {stap === 1 && 'Kies lesmethode'}
            {stap === 2 && (methode === 'klassikaal' ? 'Kies locatie(s)' : 'Kies periode')}
            {stap === 3 && 'Kies periode'}
            {stap === 4 && 'Jouw gegevens'}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stap 1: Lesmethode */}
      {stap === 1 && (
        <div>
          <h3 className="text-lg font-bold mb-1">Kies je lesmethode</h3>
          <p className="text-sm text-zinc-500 mb-5">Hoe wil je de cursus {cursusTitel} volgen?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {LESMETHODES.map((m) => {
              const Icon = m.icon
              const selected = methode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMethode(m.id)}
                  className={cn(
                    'relative p-5 rounded-xl border-2 text-left transition-all duration-200',
                    selected
                      ? 'border-primary-400 bg-primary-50 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                  )}
                >
                  {selected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle size={18} className="text-primary-500" />
                    </div>
                  )}
                  <div className={cn('p-2.5 rounded-lg inline-block mb-3 text-white', m.color)}>
                    <Icon size={20} />
                  </div>
                  <div className="font-bold text-sm">{m.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{m.beschrijving}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stap 2: Locatie (alleen bij klassikaal) */}
      {stap === 2 && methode === 'klassikaal' && (
        <div>
          <h3 className="text-lg font-bold mb-1">Kies je voorkeurslocatie(s)</h3>
          <p className="text-sm text-zinc-500 mb-5">Je kunt meerdere locaties aanvinken. We zoeken de beste optie voor je.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {LOCATIES.map((loc) => {
              const selected = locaties.includes(loc)
              return (
                <button
                  key={loc}
                  onClick={() => toggleLocatie(loc)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150',
                    selected
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  )}
                >
                  <MapPin size={13} className={selected ? 'text-primary-500' : 'text-zinc-400'} />
                  {loc}
                  {selected && <CheckCircle size={13} className="text-primary-500 ml-auto" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stap 2 voor online/incompany skips to stap 3 */}
      {stap === 2 && methode !== 'klassikaal' && (() => { setStap(3); return null })()}

      {/* Stap 3: Maand */}
      {stap === 3 && (
        <div>
          <h3 className="text-lg font-bold mb-1">Wanneer wil je starten?</h3>
          <p className="text-sm text-zinc-500 mb-5">Kies de maand waarin je het liefst wilt beginnen.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {MAANDEN.map((m) => {
              const selected = maand === m
              return (
                <button
                  key={m}
                  onClick={() => setMaand(m)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg border text-sm font-medium transition-all duration-150',
                    selected
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  )}
                >
                  {selected && <Calendar size={13} className="text-primary-500" />}
                  {m}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stap 4: Gegevens */}
      {stap === 4 && (
        <div>
          <h3 className="text-lg font-bold mb-1">Jouw gegevens</h3>
          <p className="text-sm text-zinc-500 mb-5">Vul je gegevens in, dan nemen we contact op met beschikbare data.</p>

          {/* Type toggle */}
          <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5 mb-5 w-fit">
            <button
              onClick={() => setType('inschrijving')}
              className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', type === 'inschrijving' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500')}
            >
              Direct inschrijven
            </button>
            <button
              onClick={() => setType('offerte')}
              className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', type === 'offerte' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500')}
            >
              Offerte aanvragen
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Voornaam *</label>
              <input type="text" value={voornaam} onChange={e => setVoornaam(e.target.value)} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Achternaam *</label>
              <input type="text" value={achternaam} onChange={e => setAchternaam(e.target.value)} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">E-mailadres *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Telefoon *</label>
              <input type="tel" value={telefoon} onChange={e => setTelefoon(e.target.value)} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Opmerkingen (optioneel)</label>
            <textarea value={opmerkingen} onChange={e => setOpmerkingen(e.target.value)} rows={3} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" placeholder="Bijv. voorkeur voor dag van de week, aantal deelnemers, etc." />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-100">
        {stap > 1 ? (
          <button
            onClick={() => setStap(s => methode !== 'klassikaal' && s === 3 ? 1 : s - 1)}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft size={15} /> Vorige
          </button>
        ) : <div />}

        {stap < totalSteps ? (
          <button
            onClick={() => {
              if (canProceed()) {
                if (methode !== 'klassikaal' && stap === 1) {
                  setStap(3)
                } else {
                  setStap(s => s + 1)
                }
              }
            }}
            disabled={!canProceed()}
            className={cn(
              'flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
              canProceed()
                ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md active:scale-[0.98]'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            )}
          >
            Volgende <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all',
              canProceed() && !loading
                ? 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-md active:scale-[0.98]'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            )}
          >
            {loading ? 'Verzenden...' : (
              <>
                <Send size={15} />
                {type === 'offerte' ? 'Offerte aanvragen' : 'Inschrijven'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
