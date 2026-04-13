'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [needs2FA, setNeeds2FA] = useState(false)
  const [factorId, setFactorId] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [verifying2FA, setVerifying2FA] = useState(false)

  const [needsEmail2FA, setNeedsEmail2FA] = useState(false)
  const [emailCode, setEmailCode] = useState('')
  const [verifyingEmail2FA, setVerifyingEmail2FA] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Ongeldige inloggegevens. Probeer het opnieuw.')
      setLoading(false)
      return
    }

    const { data: mfaData } = await supabaseBrowser.auth.mfa.listFactors()
    const verifiedFactors = mfaData?.totp?.filter((f) => f.status === 'verified') || []

    if (verifiedFactors.length > 0) {
      setFactorId(verifiedFactors[0].id)
      setNeeds2FA(true)
      setLoading(false)
      return
    }

    try {
      const checkRes = await fetch('/api/admin/auth/email-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      const checkData = await checkRes.json()

      if (checkData.enabled) {
        await fetch('/api/admin/auth/email-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send', email }),
        })
        setNeedsEmail2FA(true)
        setLoading(false)
        return
      }
    } catch {
      // continue without email 2FA
    }

    router.push('/admin')
  }

  async function handle2FAVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!totpCode || totpCode.length !== 6) { setError('Voer een 6-cijferige code in.'); return }
    setVerifying2FA(true)
    setError('')

    const { data: challenge, error: challengeError } = await supabaseBrowser.auth.mfa.challenge({ factorId })
    if (challengeError) { setError(challengeError.message); setVerifying2FA(false); return }

    const { error: verifyError } = await supabaseBrowser.auth.mfa.verify({
      factorId, challengeId: challenge.id, code: totpCode,
    })
    if (verifyError) { setError('Ongeldige code. Probeer opnieuw.'); setVerifying2FA(false); return }

    router.push('/admin')
  }

  async function handleEmail2FAVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!emailCode || emailCode.length !== 6) { setError('Voer een 6-cijferige code in.'); return }
    setVerifyingEmail2FA(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth/email-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: emailCode }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ongeldige code.'); setVerifyingEmail2FA(false); return }
      router.push('/admin')
    } catch {
      setError('Er ging iets mis.')
      setVerifyingEmail2FA(false)
    }
  }

  async function resendEmailCode() {
    setResending(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/email-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Kon code niet opnieuw versturen.') }
    } catch { setError('Kon code niet opnieuw versturen.') }
    setResending(false)
  }

  // Email 2FA verification screen
  if (needsEmail2FA) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-primary-600 text-white font-bold text-lg px-3 py-1.5 rounded inline-block mb-3">CA</div>
            <p className="text-zinc-500 text-sm">Beheerportaal</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail size={24} className="text-primary-600" />
              <h1 className="font-semibold text-xl text-zinc-900">E-mail verificatie</h1>
            </div>
            <p className="text-sm text-zinc-500 mb-6">
              We hebben een 6-cijferige code naar <strong>{email}</strong> gestuurd.
            </p>
            <form onSubmit={handleEmail2FAVerify} className="space-y-5">
              <input type="text" value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} autoFocus className="w-full px-4 py-4 rounded-lg border border-zinc-200 text-2xl text-center font-mono tracking-[0.5em] text-zinc-900 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/20" />
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>}
              <button type="submit" disabled={verifyingEmail2FA} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
                {verifyingEmail2FA && <Loader2 size={16} className="animate-spin" />} Verifi&euml;ren
              </button>
            </form>
            <div className="flex items-center justify-between mt-4">
              <button onClick={resendEmailCode} disabled={resending} className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50">{resending ? 'Versturen...' : 'Code opnieuw versturen'}</button>
              <button onClick={() => { setNeedsEmail2FA(false); setEmailCode(''); setError(''); supabaseBrowser.auth.signOut() }} className="text-sm text-zinc-400 hover:text-zinc-600">Opnieuw inloggen</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TOTP 2FA verification screen
  if (needs2FA) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-primary-600 text-white font-bold text-lg px-3 py-1.5 rounded inline-block mb-3">CA</div>
            <p className="text-zinc-500 text-sm">Beheerportaal</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={24} className="text-primary-600" />
              <h1 className="font-semibold text-xl text-zinc-900">Tweefactor verificatie</h1>
            </div>
            <p className="text-sm text-zinc-500 mb-6">Voer de 6-cijferige code uit uw authenticator app in.</p>
            <form onSubmit={handle2FAVerify} className="space-y-5">
              <input type="text" value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} autoFocus className="w-full px-4 py-4 rounded-lg border border-zinc-200 text-2xl text-center font-mono tracking-[0.5em] text-zinc-900 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/20" />
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>}
              <button type="submit" disabled={verifying2FA} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
                {verifying2FA && <Loader2 size={16} className="animate-spin" />} Verifi&euml;ren
              </button>
            </form>
            <button onClick={() => { setNeeds2FA(false); setTotpCode(''); setError(''); supabaseBrowser.auth.signOut() }} className="w-full text-center text-sm text-zinc-400 hover:text-zinc-600 mt-4">Opnieuw inloggen</button>
          </div>
        </div>
      </div>
    )
  }

  // Normal login screen
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary-600 text-white font-bold text-lg px-3 py-1.5 rounded inline-block mb-3">CA</div>
          <p className="text-zinc-500 text-sm">Beheerportaal</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <h1 className="font-semibold text-xl text-zinc-900 mb-6">Inloggen</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-1.5">E-mailadres</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus className="w-full px-4 py-3 rounded-lg border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/20" placeholder="beheer@jacht.digital" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-1.5">Wachtwoord</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-12 rounded-lg border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/20" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
              {loading && <Loader2 size={16} className="animate-spin" />} Inloggen
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
