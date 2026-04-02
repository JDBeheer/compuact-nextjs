'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function ContactForm() {
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

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Bericht verzonden!</h2>
        <p className="text-zinc-600 max-w-md mx-auto">
          Bedankt voor je bericht. We nemen binnen 1 werkdag contact met je op.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-8 md:p-10 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Stuur ons een bericht</h2>
        <p className="text-zinc-500 mt-2">Vul het formulier in en we nemen zo snel mogelijk contact met je op.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Persoonlijke gegevens */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Persoonlijke gegevens</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="voornaam" name="voornaam" label="Voornaam" placeholder="Bijv. Jan" required />
            <Input id="achternaam" name="achternaam" label="Achternaam" placeholder="Bijv. de Vries" required />
          </div>
        </div>

        {/* Contactgegevens */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Contactgegevens</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="email" name="email" label="E-mailadres" type="email" placeholder="jan@voorbeeld.nl" required />
            <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" placeholder="06-12345678" />
          </div>
        </div>

        {/* Bericht */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Uw bericht</h3>
          <div className="space-y-4">
            <Input id="onderwerp" name="onderwerp" label="Onderwerp" placeholder="Bijv. Vraag over Excel training" required />
            <Textarea id="bericht" name="bericht" label="Bericht" placeholder="Waar kunnen we je mee helpen?" required />
          </div>
        </div>

        {/* Privacy */}
        <label className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl cursor-pointer group">
          <input
            type="checkbox"
            required
            className="mt-0.5 rounded border-zinc-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
            Ik ga akkoord met de{' '}
            <a href="/privacybeleid" className="text-primary-600 underline hover:text-primary-700">
              privacyverklaring
            </a>
            .
          </span>
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Verzenden...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Verstuur bericht
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
