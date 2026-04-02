'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, BookOpen, CheckCircle, Loader2, Download, Star } from 'lucide-react'
import Input from '@/components/ui/Input'
import TurnstileWidget from '@/components/TurnstileWidget'

interface StudiegidsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StudiegidsModal({ isOpen, onClose }: StudiegidsModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState<'bedrijven' | 'particulieren'>('bedrijven')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

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
      bedrijfsnaam: form.get('bedrijfsnaam') as string,
      type,
    }

    try {
      const res = await fetch('/api/studiegids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })
      if (!res.ok) throw new Error('Er ging iets mis')
      setSuccess(true)
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[9999]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative pointer-events-auto">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>

          {success ? (
            /* Success state */
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Studiegids is onderweg!</h2>
              <p className="text-zinc-600 mb-6">
                Je ontvangt de studiegids binnen enkele minuten in je mailbox.
                Check eventueel je spam-folder.
              </p>
              <button onClick={onClose} className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all">
                Sluiten
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Left: visual */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 md:w-[280px] shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="relative">
                  <div className="bg-white/15 p-3 rounded-xl inline-block mb-4">
                    <BookOpen size={28} />
                  </div>
                  <h2 className="text-xl font-extrabold mb-2">Gratis Studiegids 2025-2026</h2>
                  <p className="text-primary-200 text-sm leading-relaxed mb-6">
                    Ontvang ons complete cursusoverzicht met alle trainingen, prijzen en data.
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-primary-200">
                      <CheckCircle size={14} className="text-accent-400 shrink-0" />
                      26 cursussen uitgelicht
                    </div>
                    <div className="flex items-center gap-2 text-primary-200">
                      <CheckCircle size={14} className="text-accent-400 shrink-0" />
                      Inclusief prijzen en planning
                    </div>
                    <div className="flex items-center gap-2 text-primary-200">
                      <CheckCircle size={14} className="text-accent-400 shrink-0" />
                      Tips voor de juiste cursuskeuze
                    </div>
                    <div className="flex items-center gap-2 text-primary-200">
                      <CheckCircle size={14} className="text-accent-400 shrink-0" />
                      Direct gratis in je mailbox
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="mt-8 pt-6 border-t border-white/15">
                    <div className="flex items-center gap-1.5 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-accent-400 fill-accent-400" />)}
                      <span className="text-xs font-semibold ml-1">4.8</span>
                    </div>
                    <p className="text-xs text-primary-300">Beoordeeld door 15.000+ cursisten</p>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div className="flex-1 p-6 sm:p-8">
                <h3 className="font-bold text-lg mb-1">Ontvang de studiegids</h3>
                <p className="text-sm text-zinc-500 mb-5">Vul je gegevens in en ontvang de gids direct per e-mail.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type toggle */}
                  <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setType('bedrijven')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                        type === 'bedrijven' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                      }`}
                    >
                      Zakelijk
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('particulieren')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                        type === 'particulieren' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                      }`}
                    >
                      Particulier
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input id="sg-voornaam" name="voornaam" label="Voornaam" required />
                    <Input id="sg-achternaam" name="achternaam" label="Achternaam" required />
                  </div>
                  <Input id="sg-email" name="email" label="E-mailadres" type="email" required />
                  <Input id="sg-telefoon" name="telefoon" label="Telefoon" type="tel" />
                  {type === 'bedrijven' && (
                    <Input id="sg-bedrijf" name="bedrijfsnaam" label="Bedrijfsnaam" />
                  )}

                  <TurnstileWidget onVerify={setTurnstileToken} className="mb-3" />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Bezig met verzenden...</>
                    ) : (
                      <><Download size={16} /> Gratis studiegids ontvangen</>
                    )}
                  </button>

                  <p className="text-[11px] text-zinc-400 text-center">
                    Door het formulier in te vullen ga je akkoord met ons{' '}
                    <a href="/privacybeleid" className="underline">privacybeleid</a>.
                    We sturen je geen spam.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Full CTA banner — for homepage
export function StudiegidsCTA() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-600 p-2.5 rounded-xl shrink-0">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Gratis Studiegids 2025-2026</h3>
              <p className="text-zinc-500 text-sm mt-0.5">
                Ontvang ons complete cursusoverzicht met alle trainingen, prijzen en planning.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="border-2 border-primary-500 text-primary-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-all shrink-0 flex items-center gap-2"
          >
            <Download size={15} /> Download gratis
          </button>
        </div>
      </div>

      <StudiegidsModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

// Subtle inline mention — for course pages
export function StudiegidsInline() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-400">
        <BookOpen size={14} />
        <span>Liever alles rustig nalezen?</span>
        <button onClick={() => setOpen(true)} className="text-primary-500 font-semibold hover:text-primary-600 underline underline-offset-2">
          Download de gratis studiegids
        </button>
      </div>
      <StudiegidsModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
