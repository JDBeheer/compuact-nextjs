'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Building2, CheckCircle, Loader2, Users, MapPin, Calendar } from 'lucide-react'
import { trackIncompanyRequest } from '@/lib/analytics'
import { createClient } from '@/lib/supabase/client'
import InCompanyCursusSelector from '@/components/incompany/InCompanyCursusSelector'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface CursusOption {
  id: string
  titel: string
  categorie: string
  niveau: string
  duur: string
  prijs_vanaf: number
}

export default function InCompanyPage() {
  return (
    <Suspense>
      <InCompanyContent />
    </Suspense>
  )
}

function InCompanyContent() {
  const searchParams = useSearchParams()
  const [cursussen, setCursussen] = useState<CursusOption[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedTitels, setSelectedTitels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCursussen() {
      const supabase = createClient()
      const { data } = await supabase
        .from('cursussen')
        .select('id, slug, titel, niveau, duur, prijs_vanaf, categorie:categorieen(naam)')
        .eq('actief', true)
        .order('titel')

      if (data) {
        const mapped = data.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          titel: c.titel as string,
          categorie: (c.categorie as Record<string, string>)?.naam || 'Overig',
          niveau: c.niveau as string,
          duur: c.duur as string,
          prijs_vanaf: c.prijs_vanaf as number,
        }))
        setCursussen(mapped)

        // Auto-select cursus from query param
        const preselect = searchParams.get('cursus')
        if (preselect) {
          const match = data.find((c: Record<string, unknown>) => c.slug === preselect)
          const matchMapped = match ? mapped.find(m => m.id === (match.id as string)) : null
          const finalMatch = matchMapped
          if (finalMatch) {
            setSelectedIds([finalMatch.id])
            setSelectedTitels([finalMatch.titel])
          }
        }
      }
    }
    fetchCursussen()
  }, [searchParams])

  if (success) {
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="container-narrow py-16 text-center">
          <div className="bg-white rounded-2xl border border-zinc-200 p-12">
            <CheckCircle size={48} className="text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Aanvraag ontvangen!</h1>
            <p className="text-zinc-600 mb-6">
              Bedankt voor uw incompany aanvraag. Wij stellen een passend voorstel samen en nemen zo snel mogelijk contact met u op.
            </p>
            <a href="/cursussen">
              <Button>Bekijk cursussen</Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedIds.length === 0) {
      setError('Selecteer minimaal één cursus.')
      return
    }
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/incompany', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursusIds: selectedIds,
          cursusTitels: selectedTitels,
          klantgegevens: {
            voornaam: form.get('voornaam') as string,
            achternaam: form.get('achternaam') as string,
            email: form.get('email') as string,
            telefoon: form.get('telefoon') as string,
            bedrijfsnaam: form.get('bedrijfsnaam') as string,
            adres: form.get('adres') as string,
            postcode: form.get('postcode') as string,
            stad: form.get('stad') as string,
            opmerkingen: form.get('opmerkingen') as string,
          },
          aantalDeelnemers: Number(form.get('aantal_deelnemers')) || 1,
          gewenstePeriode: form.get('gewenste_periode') as string,
          locatieVoorkeur: form.get('locatie_voorkeur') as string,
          opmerkingen: form.get('opmerkingen') as string,
        }),
      })

      if (!res.ok) throw new Error('Er ging iets mis')
      trackIncompanyRequest({
        cursussen: selectedTitels,
        aantalDeelnemers: Number(form.get('aantal_deelnemers')) || 1,
      })
      setSuccess(true)
    } catch {
      setError('Er ging iets mis bij het verzenden. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container-narrow py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Building2 size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">InCompany Training</h1>
          </div>
          <p className="text-primary-100 text-lg max-w-2xl">
            Een training op maat, afgestemd op de behoeften van uw organisatie.
            Kies uw gewenste cursussen en wij stellen een passend programma samen.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Users size={20} className="text-accent-400 mb-2" />
              <div className="font-semibold">Op maat</div>
              <div className="text-sm text-primary-200">Aangepast aan uw team</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <MapPin size={20} className="text-accent-400 mb-2" />
              <div className="font-semibold">Op locatie</div>
              <div className="text-sm text-primary-200">Bij u op kantoor of online</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Calendar size={20} className="text-accent-400 mb-2" />
              <div className="font-semibold">Flexibel</div>
              <div className="text-sm text-primary-200">Datum in overleg</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Cursus selectie */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Selecteer cursussen</h2>
                <InCompanyCursusSelector
                  cursussen={cursussen}
                  selected={selectedIds}
                  onSelectionChange={(ids, titels) => {
                    setSelectedIds(ids)
                    setSelectedTitels(titels)
                    if (error === 'Selecteer minimaal één cursus.') setError('')
                  }}
                />
              </div>

              {/* Training details */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Training details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="aantal_deelnemers" name="aantal_deelnemers" label="Aantal deelnemers" type="number" min="1" required />
                  <Select
                    id="gewenste_periode"
                    name="gewenste_periode"
                    label="Gewenste periode"
                    placeholder="Selecteer periode"
                    options={[
                      { value: 'zo_snel_mogelijk', label: 'Zo snel mogelijk' },
                      { value: 'deze_maand', label: 'Deze maand' },
                      { value: 'volgende_maand', label: 'Volgende maand' },
                      { value: 'komende_3_maanden', label: 'Komende 3 maanden' },
                      { value: 'later', label: 'Later dit jaar' },
                    ]}
                  />
                  <Input
                    id="locatie_voorkeur"
                    name="locatie_voorkeur"
                    label="Locatie voorkeur"
                    placeholder="Eigen locatie of trainingslocatie"
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              {/* Contactgegevens */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Contactgegevens</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="voornaam" name="voornaam" label="Voornaam" required />
                  <Input id="achternaam" name="achternaam" label="Achternaam" required />
                  <Input id="email" name="email" label="E-mailadres" type="email" required />
                  <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" required />
                  <Input id="bedrijfsnaam" name="bedrijfsnaam" label="Bedrijfsnaam" required className="sm:col-span-2" />
                  <Input id="adres" name="adres" label="Adres" required className="sm:col-span-2" />
                  <Input id="postcode" name="postcode" label="Postcode" required />
                  <Input id="stad" name="stad" label="Plaats" required />
                </div>
              </div>

              {/* Opmerkingen */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Opmerkingen</h2>
                <Textarea
                  id="opmerkingen"
                  name="opmerkingen"
                  placeholder="Beschrijf uw wensen, niveau van de deelnemers, specifieke onderwerpen, etc."
                />
              </div>

              {/* Privacy */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 rounded border-zinc-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-zinc-600">
                    Ik ga akkoord met de{' '}
                    <a href="/privacybeleid" className="text-primary-500 underline">privacyverklaring</a>.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600">
                {loading ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Bezig met verzenden...</>
                ) : (
                  'InCompany offerte aanvragen'
                )}
              </Button>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Geselecteerde cursussen</h2>
                {selectedTitels.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTitels.map((titel) => (
                      <div key={titel} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                        {titel}
                      </div>
                    ))}
                    <div className="border-t border-zinc-200 pt-3 mt-3">
                      <span className="text-sm font-semibold text-primary-500">
                        {selectedTitels.length} cursus{selectedTitels.length > 1 ? 'sen' : ''} geselecteerd
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Selecteer cursussen uit de lijst om uw incompany offerte samen te stellen.
                  </p>
                )}

                <div className="mt-6 bg-primary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-sm text-primary-800 mb-2">Waarom InCompany?</h3>
                  <ul className="text-xs text-primary-700 space-y-1.5">
                    <li>&#10003; Training op maat voor uw team</li>
                    <li>&#10003; Op uw eigen locatie of online</li>
                    <li>&#10003; Datum en tijd in overleg</li>
                    <li>&#10003; Voorbeelden uit uw eigen praktijk</li>
                    <li>&#10003; Voordelig vanaf 4 deelnemers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
