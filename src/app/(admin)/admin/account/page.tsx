'use client'

import { useState, useEffect } from 'react'
import { Loader2, ShieldCheck, ShieldAlert, Smartphone, Check, Mail } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Factor {
  id: string
  friendly_name?: string
  status: string
}

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [factors, setFactors] = useState<Factor[]>([])
  const [loading, setLoading] = useState(true)

  const [enrolling, setEnrolling] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [verifySuccess, setVerifySuccess] = useState(false)

  const [email2FAEnabled, setEmail2FAEnabled] = useState(false)
  const [togglingEmail2FA, setTogglingEmail2FA] = useState(false)
  const [email2FASuccess, setEmail2FASuccess] = useState('')

  useEffect(() => {
    async function load() {
      const { data: session } = await supabaseBrowser.auth.getSession()
      if (session.session) {
        setEmail(session.session.user.email || '')
        try {
          const res = await fetch('/api/admin/auth/email-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.session.access_token}` },
            body: JSON.stringify({ action: 'check', email: session.session.user.email }),
          })
          const data = await res.json()
          setEmail2FAEnabled(data.enabled ?? false)
        } catch { /* ignore */ }
      }
      const { data: mfa } = await supabaseBrowser.auth.mfa.listFactors()
      setFactors(mfa?.totp || [])
      setLoading(false)
    }
    load()
  }, [])

  async function startEnroll() {
    setEnrolling(true)
    setVerifyError('')
    setVerifySuccess(false)
    const { data, error } = await supabaseBrowser.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Authenticator App' })
    if (error) { setVerifyError(error.message); setEnrolling(false); return }
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
  }

  async function completeEnroll() {
    if (!verifyCode || verifyCode.length !== 6) { setVerifyError('Voer een 6-cijferige code in'); return }
    setVerifyError('')
    const { data: challenge, error: challengeError } = await supabaseBrowser.auth.mfa.challenge({ factorId })
    if (challengeError) { setVerifyError(challengeError.message); return }
    const { error: verifyErr } = await supabaseBrowser.auth.mfa.verify({ factorId, challengeId: challenge.id, code: verifyCode })
    if (verifyErr) { setVerifyError('Ongeldige code. Probeer opnieuw.'); return }
    setVerifySuccess(true)
    setEnrolling(false)
    setQrCode('')
    setSecret('')
    setVerifyCode('')
    const { data: mfa } = await supabaseBrowser.auth.mfa.listFactors()
    setFactors(mfa?.totp || [])
  }

  async function removeFactor(id: string) {
    if (!confirm('2FA uitschakelen? Uw account is dan minder beveiligd.')) return
    const { error } = await supabaseBrowser.auth.mfa.unenroll({ factorId: id })
    if (error) { setVerifyError(error.message); return }
    setFactors((f) => f.filter((x) => x.id !== id))
  }

  async function toggleEmail2FA() {
    setTogglingEmail2FA(true)
    setEmail2FASuccess('')
    setVerifyError('')
    try {
      const { data: session } = await supabaseBrowser.auth.getSession()
      if (!session.session) return
      const res = await fetch('/api/admin/auth/email-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.session.access_token}` },
        body: JSON.stringify({ action: 'toggle' }),
      })
      const data = await res.json()
      if (res.ok) {
        setEmail2FAEnabled(data.enabled)
        setEmail2FASuccess(data.enabled ? 'E-mail 2FA is ingeschakeld.' : 'E-mail 2FA is uitgeschakeld.')
      } else {
        setVerifyError(data.error || 'Kon instelling niet wijzigen.')
      }
    } catch { setVerifyError('Er ging iets mis.') }
    setTogglingEmail2FA(false)
  }

  const hasVerifiedFactor = factors.some((f) => f.status === 'verified')

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  }

  return (
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Mijn account</h1>
        <p className="text-zinc-500 text-sm mb-8">Accountinstellingen en beveiliging.</p>

        <section className="bg-white rounded-xl border border-zinc-200 p-8 mb-6">
          <h2 className="font-semibold text-xl text-zinc-900 mb-4">Account</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-600/10 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-lg">{email.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">{email}</p>
              <p className="text-sm text-zinc-400">Ingelogd als CMS-gebruiker</p>
            </div>
          </div>
        </section>

        {/* TOTP 2FA */}
        <section className="bg-white rounded-xl border border-zinc-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            {hasVerifiedFactor ? <ShieldCheck size={24} className="text-green-500" /> : <ShieldAlert size={24} className="text-amber-500" />}
            <div>
              <h2 className="font-semibold text-xl text-zinc-900">Tweefactorauthenticatie (2FA)</h2>
              <p className="text-sm text-zinc-400">{hasVerifiedFactor ? 'Uw account is extra beveiligd met 2FA.' : 'Beveilig uw account met een authenticator app.'}</p>
            </div>
          </div>

          {factors.filter((f) => f.status === 'verified').map((factor) => (
            <div key={factor.id} className="flex items-center justify-between bg-green-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">{factor.friendly_name || 'Authenticator App'}</p>
                  <p className="text-xs text-green-600">Actief</p>
                </div>
              </div>
              <button onClick={() => removeFactor(factor.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Uitschakelen</button>
            </div>
          ))}

          {!hasVerifiedFactor && !enrolling && (
            <button onClick={startEnroll} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700">
              <Smartphone size={16} /> 2FA instellen
            </button>
          )}

          {verifySuccess && <div className="flex items-center gap-2 text-green-600 mt-4"><Check size={16} /><span className="text-sm font-medium">2FA succesvol ingesteld!</span></div>}

          {enrolling && qrCode && (
            <div className="mt-4">
              <div className="bg-zinc-50 rounded-xl p-6 mb-4">
                <p className="text-sm text-zinc-600 mb-4"><strong>Stap 1:</strong> Scan de QR-code met uw authenticator app.</p>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
                <p className="text-xs text-zinc-400 text-center">Of voer handmatig in: <code className="bg-white px-2 py-0.5 rounded text-xs font-mono select-all">{secret}</code></p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-6">
                <p className="text-sm text-zinc-600 mb-3"><strong>Stap 2:</strong> Voer de 6-cijferige code in:</p>
                <div className="flex gap-3">
                  <input type="text" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="w-36 px-4 py-3 rounded-lg border border-zinc-200 text-lg text-center font-mono tracking-[0.5em] focus:outline-none focus:border-primary-600" autoFocus />
                  <button onClick={completeEnroll} className="px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700">Verifi&euml;ren</button>
                </div>
                {verifyError && <p className="text-sm text-red-600 mt-2">{verifyError}</p>}
              </div>
              <button onClick={() => { setEnrolling(false); setQrCode(''); setSecret('') }} className="text-sm text-zinc-400 hover:text-zinc-600 mt-3">Annuleren</button>
            </div>
          )}
        </section>

        {/* Email 2FA */}
        <section className="bg-white rounded-xl border border-zinc-200 p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            {email2FAEnabled ? <ShieldCheck size={24} className="text-green-500" /> : <ShieldAlert size={24} className="text-amber-500" />}
            <div>
              <h2 className="font-semibold text-xl text-zinc-900">E-mail verificatie (2FA)</h2>
              <p className="text-sm text-zinc-400">{email2FAEnabled ? 'Bij het inloggen ontvangt u een verificatiecode per e-mail.' : 'Ontvang een verificatiecode per e-mail bij het inloggen.'}</p>
            </div>
          </div>

          {email2FAEnabled && (
            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">E-mail verificatie</p>
                  <p className="text-xs text-green-600">Actief — codes worden verstuurd naar {email}</p>
                </div>
              </div>
              <button onClick={() => { if (confirm('E-mail 2FA uitschakelen?')) toggleEmail2FA() }} disabled={togglingEmail2FA} className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                {togglingEmail2FA ? 'Bezig...' : 'Uitschakelen'}
              </button>
            </div>
          )}

          {!email2FAEnabled && (
            <button onClick={toggleEmail2FA} disabled={togglingEmail2FA} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
              {togglingEmail2FA ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} E-mail 2FA inschakelen
            </button>
          )}

          {email2FASuccess && <div className="flex items-center gap-2 text-green-600 mt-4"><Check size={16} /><span className="text-sm font-medium">{email2FASuccess}</span></div>}
        </section>
      </div>
    </AdminShell>
  )
}
