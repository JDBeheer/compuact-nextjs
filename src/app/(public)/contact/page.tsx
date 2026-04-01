'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const data = {
      voornaam: form.get('voornaam') as string,
      achternaam: form.get('achternaam') as string,
      email: form.get('email') as string,
      telefoon: form.get('telefoon') as string,
      onderwerp: form.get('onderwerp') as string,
      bericht: form.get('bericht') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Er ging iets mis')
      setSuccess(true)
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw of neem telefonisch contact op.')
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
            <span className="text-zinc-900">Contact</span>
          </nav>
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-zinc-600 mt-2">Heb je een vraag? Neem gerust contact met ons op.</p>
        </div>
      </div>

      <div className="container-narrow py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulier */}
          <div className="lg:col-span-2">
            {success ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                <CheckCircle size={48} className="text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Bericht verzonden!</h2>
                <p className="text-zinc-600">We nemen zo snel mogelijk contact met je op.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Stuur ons een bericht</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="voornaam" name="voornaam" label="Voornaam" required />
                    <Input id="achternaam" name="achternaam" label="Achternaam" required />
                    <Input id="email" name="email" label="E-mailadres" type="email" required />
                    <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" />
                  </div>
                  <Input id="onderwerp" name="onderwerp" label="Onderwerp" required />
                  <Textarea id="bericht" name="bericht" label="Bericht" required />

                  <label className="flex items-start gap-3">
                    <input type="checkbox" required className="mt-1 rounded border-zinc-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-zinc-600">
                      Ik ga akkoord met de <a href="/privacybeleid" className="text-primary-600 underline">privacyverklaring</a>.
                    </span>
                  </label>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
                  )}

                  <Button type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Verzenden...</> : 'Verstuur bericht'}
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Contactinfo */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Contactgegevens</h2>
              <div className="space-y-4">
                <a href="tel:0235513409" className="flex items-center gap-3 text-zinc-700 hover:text-primary-600">
                  <Phone size={18} className="text-primary-600" />
                  023-551 3409
                </a>
                <a href="mailto:info@computertraining.nl" className="flex items-center gap-3 text-zinc-700 hover:text-primary-600">
                  <Mail size={18} className="text-primary-600" />
                  info@computertraining.nl
                </a>
                <div className="flex items-start gap-3 text-zinc-700">
                  <MapPin size={18} className="text-primary-600 mt-0.5" />
                  <div>
                    Vincent van Goghweg 85<br />
                    1506 JB Zaandam
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Openingstijden</h2>
              <div className="space-y-2 text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary-600" />
                  <span>Maandag - Vrijdag: 08:30 - 17:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-zinc-400" />
                  <span className="text-zinc-400">Weekend: Gesloten</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
