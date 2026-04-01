'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CheckCircle, Loader2, Send } from 'lucide-react'

export default function AdminInstellingenPage() {
  const [contactSettings, setContactSettings] = useState({ email: '', telefoon: '', adres: '' })
  const [emailSettings, setEmailSettings] = useState({ from_email: '', admin_email: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('*').then(({ data }) => {
      data?.forEach((row) => {
        if (row.id === 'contact') setContactSettings(row.value as typeof contactSettings)
        if (row.id === 'email') setEmailSettings(row.value as typeof emailSettings)
      })
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await Promise.all([
      supabase.from('site_settings').upsert({ id: 'contact', value: contactSettings }),
      supabase.from('site_settings').upsert({ id: 'email', value: emailSettings }),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleTestEmail() {
    if (!testEmail) return
    setTestSending(true)
    setTestResult('')
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      })
      if (res.ok) {
        setTestResult('Test e-mail verzonden!')
      } else {
        setTestResult('Fout bij verzenden.')
      }
    } catch {
      setTestResult('Fout bij verzenden.')
    }
    setTestSending(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instellingen</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Contact */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Contactgegevens</h2>
          <Input id="contact_email" label="E-mailadres" value={contactSettings.email}
            onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })} />
          <Input id="contact_telefoon" label="Telefoonnummer" value={contactSettings.telefoon}
            onChange={(e) => setContactSettings({ ...contactSettings, telefoon: e.target.value })} />
          <Input id="contact_adres" label="Adres" value={contactSettings.adres}
            onChange={(e) => setContactSettings({ ...contactSettings, adres: e.target.value })} />
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">E-mail configuratie</h2>
          <Input id="from_email" label="Afzender e-mail" value={emailSettings.from_email}
            onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })} />
          <Input id="admin_email" label="Admin notificatie e-mail" value={emailSettings.admin_email}
            onChange={(e) => setEmailSettings({ ...emailSettings, admin_email: e.target.value })} />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 size={16} className="mr-2 animate-spin" /> Opslaan...</> : 'Instellingen opslaan'}
          </Button>
          {saved && (
            <span className="text-sm text-primary-600 flex items-center gap-1">
              <CheckCircle size={16} /> Opgeslagen
            </span>
          )}
        </div>

        {/* Test email */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Test e-mail</h2>
          <div className="flex gap-3">
            <Input id="test_email" placeholder="E-mailadres" value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)} className="flex-1" />
            <Button onClick={handleTestEmail} disabled={testSending} variant="outline">
              {testSending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} className="mr-2" /> Verstuur</>}
            </Button>
          </div>
          {testResult && <p className="text-sm text-zinc-600">{testResult}</p>}
        </div>
      </div>
    </div>
  )
}
