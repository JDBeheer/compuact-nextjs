'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Ongeldige inloggegevens.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-zinc-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="bg-primary-600 text-white font-bold text-xl px-3 py-1 rounded inline-block mb-3">CA</div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">Compu Act Opleidingen</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Inloggen...</> : 'Inloggen'}
          </Button>
        </form>
      </div>
    </div>
  )
}
