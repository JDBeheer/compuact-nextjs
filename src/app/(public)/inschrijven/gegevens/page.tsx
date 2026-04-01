'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, lesmethodeLabel, formatDateShort, ADMIN_FEE } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function InschrijfFormulierPage() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const totaal = getTotal()

  if (typeof window !== 'undefined' && items.length === 0 && !success) {
    router.push('/inschrijven')
    return null
  }

  if (success) {
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="container-narrow py-16 text-center">
          <div className="bg-white rounded-2xl border border-zinc-200 p-12">
            <CheckCircle size={48} className="text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Inschrijving ontvangen!</h1>
            <p className="text-zinc-600 mb-6">
              Bedankt voor je inschrijving. Je ontvangt een bevestigingsmail met alle details.
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
    }

    try {
      const res = await fetch('/api/inschrijving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inschrijving',
          cursussen: items,
          klantgegevens,
          totaalprijs: totaal,
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
            <a href="/inschrijven" className="hover:text-primary-600">Inschrijven</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Gegevens</span>
          </nav>
          <h1 className="text-3xl font-bold">Gegevens invullen</h1>
        </div>
      </div>

      <div className="container-narrow py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Persoonsgegevens */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Persoonsgegevens</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="voornaam" name="voornaam" label="Voornaam" required />
                  <Input id="achternaam" name="achternaam" label="Achternaam" required />
                  <Input id="email" name="email" label="E-mailadres" type="email" required />
                  <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" required />
                  <Input id="bedrijfsnaam" name="bedrijfsnaam" label="Bedrijfsnaam" className="sm:col-span-2" />
                </div>
              </div>

              {/* Facturatiegegevens */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Facturatiegegevens</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="adres" name="adres" label="Adres" required className="sm:col-span-2" />
                  <Input id="postcode" name="postcode" label="Postcode" required />
                  <Input id="stad" name="stad" label="Plaats" required />
                </div>
              </div>

              {/* Opmerkingen */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Opmerkingen</h2>
                <Textarea id="opmerkingen" name="opmerkingen" placeholder="Eventuele opmerkingen of vragen..." />
              </div>

              {/* Privacy */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 rounded border-zinc-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-zinc-600">
                    Ik ga akkoord met de{' '}
                    <a href="/privacybeleid" className="text-primary-600 underline">privacyverklaring</a>
                    {' '}en{' '}
                    <a href="/algemene-voorwaarden" className="text-primary-600 underline">algemene voorwaarden</a>.
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
                  'Inschrijving bevestigen'
                )}
              </Button>
            </div>

            {/* Samenvatting sidebar */}
            <div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Samenvatting</h2>
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
                </div>
                <div className="border-t border-zinc-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600">Subtotaal</span>
                    <span>{formatPrice(totaal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-600">Administratiekosten</span>
                    <span>{formatPrice(ADMIN_FEE)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Totaal</span>
                    <span className="text-primary-600">{formatPrice(totaal + ADMIN_FEE)}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">excl. 21% BTW</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
