'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, lesmethodeLabel, formatDateShort } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { CheckCircle, Loader2, FileText } from 'lucide-react'

export default function OffertePage() {
  const { items, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (success) {
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="container-narrow py-16 text-center">
          <div className="bg-white rounded-2xl border border-zinc-200 p-12">
            <CheckCircle size={48} className="text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Offerte aanvraag ontvangen!</h1>
            <p className="text-zinc-600 mb-6">
              Bedankt voor je aanvraag. Wij sturen je zo snel mogelijk een offerte op maat.
            </p>
            <a href="/cursussen">
              <Button>Bekijk meer cursussen</Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const klantgegevens = {
      voornaam: form.get('voornaam') as string,
      achternaam: form.get('achternaam') as string,
      email: form.get('email') as string,
      telefoon: form.get('telefoon') as string,
      bedrijfsnaam: form.get('bedrijfsnaam') as string,
      adres: form.get('adres') as string,
      postcode: form.get('postcode') as string,
      stad: form.get('stad') as string,
      opmerkingen: form.get('opmerkingen') as string,
      aantal_deelnemers: Number(form.get('aantal_deelnemers')) || undefined,
      gewenste_periode: form.get('gewenste_periode') as string,
      locatie_voorkeur: form.get('locatie_voorkeur') as string,
    }

    try {
      const res = await fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'offerte',
          cursussen: items,
          klantgegevens,
          totaalprijs: getTotal(),
        }),
      })

      if (!res.ok) throw new Error('Er ging iets mis')

      clearCart()
      setSuccess(true)
    } catch {
      setError('Er ging iets mis bij het verzenden. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Offerte aanvragen</span>
          </nav>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-primary-600" /> Offerte aanvragen
          </h1>
        </div>
      </div>

      <div className="container-narrow py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Persoonsgegevens */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Contactgegevens</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="voornaam" name="voornaam" label="Voornaam" required />
                  <Input id="achternaam" name="achternaam" label="Achternaam" required />
                  <Input id="email" name="email" label="E-mailadres" type="email" required />
                  <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" required />
                  <Input id="bedrijfsnaam" name="bedrijfsnaam" label="Bedrijfsnaam" required className="sm:col-span-2" />
                </div>
              </div>

              {/* Facturatiegegevens */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Adresgegevens</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="adres" name="adres" label="Adres" required className="sm:col-span-2" />
                  <Input id="postcode" name="postcode" label="Postcode" required />
                  <Input id="stad" name="stad" label="Plaats" required />
                </div>
              </div>

              {/* Extra offerte velden */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Details offerte</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="aantal_deelnemers" name="aantal_deelnemers" label="Aantal deelnemers" type="number" min="1" />
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
                  <Input id="locatie_voorkeur" name="locatie_voorkeur" label="Locatie voorkeur" placeholder="Bijv. Amsterdam of eigen locatie" className="sm:col-span-2" />
                </div>
              </div>

              {/* Opmerkingen */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Opmerkingen</h2>
                <Textarea id="opmerkingen" name="opmerkingen" placeholder="Eventuele wensen of vragen..." />
              </div>

              {/* Privacy */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 rounded border-zinc-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-zinc-600">
                    Ik ga akkoord met de{' '}
                    <a href="/privacybeleid" className="text-primary-600 underline">privacyverklaring</a>.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Bezig met verzenden...</>
                ) : (
                  'Offerte aanvragen'
                )}
              </Button>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Geselecteerde cursussen</h2>
                {items.length > 0 ? (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.sessieId} className="text-sm border-b border-zinc-100 pb-3">
                        <div className="font-medium">{item.cursusTitel}</div>
                        <div className="text-zinc-500">
                          {lesmethodeLabel(item.lesmethode)} &middot; {item.locatie}
                        </div>
                        <div className="text-zinc-500">{formatDateShort(item.datum)}</div>
                        <div className="font-medium mt-1">{formatPrice(item.prijs)}</div>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between font-semibold">
                      <span>Indicatief totaal</span>
                      <span className="text-primary-600">{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Je kunt ook zonder cursusselectie een offerte aanvragen. Beschrijf je wensen in het opmerkingenveld.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
