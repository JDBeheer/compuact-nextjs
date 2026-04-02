'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, lesmethodeLabel, formatDateShort, ADMIN_FEE } from '@/lib/utils'
import { Deelnemer } from '@/types'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import DeelnemersPicker from '@/components/checkout/DeelnemersPicker'
import { CheckCircle, Loader2, FileText, CreditCard, Building2, User, ChevronDown } from 'lucide-react'
import { trackBeginCheckout, trackPurchase, trackGenerateLead, setUserData } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export default function CheckoutPageWrapper() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  )
}

function StepIndicator({ step, currentStep, label, href }: { step: number; currentStep: number; label: string; href?: string }) {
  const done = currentStep > step
  const active = currentStep === step
  const clickable = done && href

  const content = (
    <div className={cn('flex items-center gap-2', clickable && 'cursor-pointer hover:opacity-80')}>
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
        done ? 'bg-primary-500 text-white' : active ? 'bg-primary-500 text-white ring-4 ring-primary-100' : 'bg-zinc-200 text-zinc-500'
      )}>
        {done ? <CheckCircle size={14} /> : step}
      </div>
      <span className={cn('text-sm font-medium hidden sm:block', active ? 'text-zinc-900' : done ? 'text-primary-500' : 'text-zinc-400')}>{label}</span>
    </div>
  )

  if (clickable) {
    return <a href={href}>{content}</a>
  }
  return content
}

function CheckoutPage() {
  const { items, getTotal, clearCart, updateDeelnemers } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [checkoutType, setCheckoutType] = useState<'inschrijving' | 'offerte'>(
    (searchParams.get('type') as 'offerte') || 'inschrijving'
  )
  const [klantType, setKlantType] = useState<'particulier' | 'zakelijk'>('particulier')
  const [factuurAnders, setFactuurAnders] = useState(false)
  const [deelnemersMap, setDeelnemersMap] = useState<Record<string, Deelnemer[]>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const currentStep = 2

  useEffect(() => {
    const newMap: Record<string, Deelnemer[]> = {}
    for (const item of items) {
      const aantal = item.aantalDeelnemers || 1
      if (!deelnemersMap[item.sessieId] || deelnemersMap[item.sessieId].length !== aantal) {
        newMap[item.sessieId] = deelnemersMap[item.sessieId]?.slice(0, aantal) ||
          Array.from({ length: aantal }, () => ({ voornaam: '', achternaam: '', email: '' }))
      } else {
        newMap[item.sessieId] = deelnemersMap[item.sessieId]
      }
    }
    setDeelnemersMap(newMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Track begin_checkout once
  useEffect(() => {
    if (items.length > 0) {
      trackBeginCheckout(
        items.map(item => ({
          item_id: item.sessieId,
          item_name: item.cursusTitel,
          item_variant: item.lesmethode,
          price: item.prijs,
          quantity: item.aantalDeelnemers || 1,
        })),
        items.reduce((sum, i) => sum + i.prijs * (i.aantalDeelnemers || 1), 0)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totaal = getTotal()

  if (typeof window !== 'undefined' && items.length === 0 && !success) {
    router.push('/inschrijven')
    return null
  }

  if (success) {
    const isOfferte = checkoutType === 'offerte'
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="container-narrow py-16 text-center">
          <div className="bg-white rounded-2xl border border-zinc-200 p-12">
            <CheckCircle size={48} className="text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {isOfferte ? 'Offerte aanvraag ontvangen!' : 'Inschrijving ontvangen!'}
            </h1>
            <p className="text-zinc-600 mb-6">
              {isOfferte
                ? 'Bedankt voor je aanvraag. Wij sturen je zo snel mogelijk een offerte op maat.'
                : 'Bedankt voor je inschrijving. Je ontvangt een bevestigingsmail met alle details.'}
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

    // Validate deelnemers
    for (const item of items) {
      const deelnemers = deelnemersMap[item.sessieId] || []
      for (let i = 0; i < (item.aantalDeelnemers || 1); i++) {
        const d = deelnemers[i]
        if (!d?.voornaam || !d?.achternaam || !d?.email) {
          setError(`Vul de gegevens in van alle deelnemers bij "${item.cursusTitel}" (deelnemer ${i + 1}).`)
          setLoading(false)
          return
        }
      }
    }

    const form = new FormData(e.currentTarget)
    const klantgegevens: Record<string, unknown> = {
      klantType,
      voornaam: form.get('voornaam') as string,
      achternaam: form.get('achternaam') as string,
      email: form.get('email') as string,
      telefoon: form.get('telefoon') as string,
      adres: form.get('adres') as string,
      postcode: form.get('postcode') as string,
      stad: form.get('stad') as string,
      opmerkingen: form.get('opmerkingen') as string,
    }

    if (klantType === 'zakelijk') {
      klantgegevens.bedrijfsnaam = form.get('bedrijfsnaam') as string
      klantgegevens.afdeling = form.get('afdeling') as string
      klantgegevens.kenmerk = form.get('kenmerk') as string
    }

    if (factuurAnders) {
      klantgegevens.factuur_adres = form.get('factuur_adres') as string
      klantgegevens.factuur_postcode = form.get('factuur_postcode') as string
      klantgegevens.factuur_stad = form.get('factuur_stad') as string
      if (klantType === 'zakelijk') {
        klantgegevens.factuur_bedrijfsnaam = form.get('factuur_bedrijfsnaam') as string
        klantgegevens.factuur_contactpersoon = form.get('factuur_contactpersoon') as string
      }
    }

    const enrichedItems = items.map(item => ({
      ...item,
      deelnemers: deelnemersMap[item.sessieId] || [],
    }))

    try {
      const res = await fetch('/api/inschrijving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: checkoutType,
          cursussen: enrichedItems,
          klantgegevens,
          totaalprijs: totaal,
        }),
      })

      if (!res.ok) throw new Error('Er ging iets mis')

      const transactionId = `CA-${Date.now()}`
      const trackingItems = items.map(item => ({
        item_id: item.sessieId,
        item_name: item.cursusTitel,
        item_variant: item.lesmethode,
        price: item.prijs,
        quantity: item.aantalDeelnemers || 1,
      }))

      // Enhanced conversions — send user data for better attribution
      setUserData({
        email: klantgegevens.email as string,
        phone: klantgegevens.telefoon as string,
        firstName: klantgegevens.voornaam as string,
        lastName: klantgegevens.achternaam as string,
        city: klantgegevens.stad as string,
        postalCode: klantgegevens.postcode as string,
      })

      if (checkoutType === 'inschrijving') {
        trackPurchase({ transactionId, value: totaal, items: trackingItems, type: 'inschrijving' })
      } else {
        trackPurchase({ transactionId, value: totaal, items: trackingItems, type: 'offerte' })
        trackGenerateLead({ value: totaal, cursussen: items.map(i => i.cursusTitel) })
      }

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
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-6">
          <nav className="text-sm text-zinc-500 mb-3">
            <a href="/" className="hover:text-primary-500">Home</a>
            <span className="mx-2">/</span>
            <a href="/inschrijven" className="hover:text-primary-500">Inschrijven</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Afronden</span>
          </nav>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Inschrijving afronden</h1>
            <a href="/inschrijven" className="text-sm text-primary-500 font-semibold hover:text-primary-600 flex items-center gap-1">
              &larr; Terug naar overzicht
            </a>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-4 sm:gap-6">
            <StepIndicator step={1} currentStep={currentStep} label="Cursussen" href="/inschrijven" />
            <div className="h-px flex-1 bg-zinc-200" />
            <StepIndicator step={2} currentStep={currentStep} label="Gegevens" />
            <div className="h-px flex-1 bg-zinc-200" />
            <StepIndicator step={3} currentStep={currentStep} label="Bevestigen" />
          </div>
        </div>
      </div>

      <div className="container-narrow py-6 sm:py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-5">

              {/* Stap 1: Type keuze */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6">
                <h2 className="text-base font-bold mb-3">Wat wil je doen?</h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutType('inschrijving')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      checkoutType === 'inschrijving'
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <CreditCard size={20} className={checkoutType === 'inschrijving' ? 'text-primary-500' : 'text-zinc-400'} />
                    <div className="font-bold text-sm mt-2">Direct inschrijven</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Definitieve inschrijving</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutType('offerte')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      checkoutType === 'offerte'
                        ? 'border-accent-400 bg-accent-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <FileText size={20} className={checkoutType === 'offerte' ? 'text-accent-500' : 'text-zinc-400'} />
                    <div className="font-bold text-sm mt-2">Offerte aanvragen</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Vrijblijvend, geen kosten</div>
                  </button>
                </div>
              </div>

              {/* Stap 2: Cursussen & deelnemers */}
              <div>
                <h2 className="text-base font-bold mb-3">Cursussen &amp; deelnemers</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <DeelnemersPicker
                      key={item.sessieId}
                      item={item}
                      deelnemers={deelnemersMap[item.sessieId] || []}
                      onDeelnemersChange={(deelnemers) =>
                        setDeelnemersMap(prev => ({ ...prev, [item.sessieId]: deelnemers }))
                      }
                      onAantalChange={(aantal) => updateDeelnemers(item.sessieId, aantal)}
                      showSync={items.length > 1}
                      onSyncToAll={(deelnemers) => {
                        // Apply these deelnemers to all other courses
                        setDeelnemersMap(prev => {
                          const updated = { ...prev }
                          for (const otherItem of items) {
                            if (otherItem.sessieId === item.sessieId) continue
                            const otherAantal = otherItem.aantalDeelnemers || 1
                            // Copy deelnemers, but respect the other course's aantal
                            const synced = deelnemers.slice(0, otherAantal)
                            // If other course has more deelnemers, keep their extra ones
                            const existing = prev[otherItem.sessieId] || []
                            const merged = [
                              ...synced,
                              ...existing.slice(synced.length),
                            ].slice(0, otherAantal)
                            // Pad if needed
                            while (merged.length < otherAantal) {
                              merged.push({ voornaam: '', achternaam: '', email: '' })
                            }
                            updated[otherItem.sessieId] = merged
                          }
                          return updated
                        })
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stap 3: Particulier / Zakelijk */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6">
                <h2 className="text-base font-bold mb-3">Type aanvraag</h2>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setKlantType('particulier')}
                    className={cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all',
                      klantType === 'particulier'
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <User size={18} className={klantType === 'particulier' ? 'text-primary-500' : 'text-zinc-400'} />
                    <div>
                      <div className="font-semibold text-sm">Particulier</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKlantType('zakelijk')}
                    className={cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all',
                      klantType === 'zakelijk'
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <Building2 size={18} className={klantType === 'zakelijk' ? 'text-primary-500' : 'text-zinc-400'} />
                    <div>
                      <div className="font-semibold text-sm">Zakelijk</div>
                    </div>
                  </button>
                </div>

                {/* Contactgegevens */}
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contactgegevens</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input id="voornaam" name="voornaam" label="Voornaam" required />
                  <Input id="achternaam" name="achternaam" label="Achternaam" required />
                  <Input id="email" name="email" label="E-mailadres" type="email" required />
                  <Input id="telefoon" name="telefoon" label="Telefoon" type="tel" required />
                </div>

                {/* Bedrijfsgegevens */}
                {klantType === 'zakelijk' && (
                  <div className="mt-5 pt-5 border-t border-zinc-100">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Bedrijfsgegevens</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input id="bedrijfsnaam" name="bedrijfsnaam" label="Bedrijfsnaam" required className="sm:col-span-2" />
                      <Input id="afdeling" name="afdeling" label="Afdeling" />
                      <Input id="kenmerk" name="kenmerk" label="Kenmerk / referentienr." />
                    </div>
                  </div>
                )}

                {/* Adresgegevens */}
                <div className="mt-5 pt-5 border-t border-zinc-100">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    {klantType === 'zakelijk' ? 'Bedrijfsadres' : 'Adres'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input id="adres" name="adres" label="Straatnaam + huisnummer" required className="sm:col-span-2" />
                    <Input id="postcode" name="postcode" label="Postcode" required />
                    <Input id="stad" name="stad" label="Plaats" required />
                  </div>
                </div>
              </div>

              {/* Factuuradres */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setFactuurAnders(!factuurAnders)}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="text-base font-bold">Ander factuuradres?</h2>
                  <ChevronDown size={18} className={cn('text-zinc-400 transition-transform', factuurAnders && 'rotate-180')} />
                </button>
                {!factuurAnders && (
                  <p className="text-sm text-zinc-500 mt-1">Factuurgegevens zijn hetzelfde als bovenstaande gegevens.</p>
                )}
                {factuurAnders && (
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {klantType === 'zakelijk' && (
                        <>
                          <Input id="factuur_bedrijfsnaam" name="factuur_bedrijfsnaam" label="Bedrijfsnaam" className="sm:col-span-2" />
                          <Input id="factuur_contactpersoon" name="factuur_contactpersoon" label="Contactpersoon" className="sm:col-span-2" />
                        </>
                      )}
                      <Input id="factuur_adres" name="factuur_adres" label="Straatnaam + huisnummer" required className="sm:col-span-2" />
                      <Input id="factuur_postcode" name="factuur_postcode" label="Postcode" required />
                      <Input id="factuur_stad" name="factuur_stad" label="Plaats" required />
                    </div>
                  </div>
                )}
              </div>

              {/* Opmerkingen */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6">
                <h2 className="text-base font-bold mb-3">Opmerkingen</h2>
                <Textarea id="opmerkingen" name="opmerkingen" placeholder="Eventuele opmerkingen, dieetwensen of speciale verzoeken..." />
              </div>

              {/* Privacy + submit */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6">
                <label className="flex items-start gap-3 mb-5">
                  <input type="checkbox" required className="mt-1 rounded border-zinc-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-zinc-600">
                    Ik ga akkoord met de{' '}
                    <a href="/privacybeleid" className="text-primary-500 underline">privacyverklaring</a>
                    {' '}en{' '}
                    <a href="/algemene-voorwaarden" className="text-primary-500 underline">algemene voorwaarden</a>.
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className={cn(
                    'w-full',
                    checkoutType === 'offerte' ? 'bg-accent-500 hover:bg-accent-600' : ''
                  )}
                >
                  {loading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Bezig met verzenden...</>
                  ) : checkoutType === 'offerte' ? (
                    'Offerte aanvragen'
                  ) : (
                    'Inschrijving bevestigen'
                  )}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 sticky top-24">
                <h2 className="font-bold mb-4">Overzicht</h2>
                <div className="space-y-3">
                  {items.map((item) => {
                    const aantal = item.aantalDeelnemers || 1
                    return (
                      <div key={item.sessieId} className="text-sm border-b border-zinc-100 pb-3">
                        <div className="font-semibold">{item.cursusTitel}</div>
                        <div className="text-zinc-500 text-xs mt-0.5">
                          {lesmethodeLabel(item.lesmethode)} &middot; {item.locatie}
                        </div>
                        <div className="text-zinc-500 text-xs">{formatDateShort(item.datum)}</div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-zinc-400 text-xs">{aantal} deelnemer{aantal > 1 ? 's' : ''}</span>
                          <span className="font-semibold">{formatPrice(item.prijs * aantal)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-zinc-200 mt-3 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotaal</span>
                    <span>{formatPrice(totaal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Administratiekosten</span>
                    <span>{formatPrice(ADMIN_FEE)}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Totaal</span>
                      <span className="text-primary-500">{formatPrice(totaal + ADMIN_FEE)}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">excl. 21% BTW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
