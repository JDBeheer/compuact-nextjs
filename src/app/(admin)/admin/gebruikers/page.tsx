'use client'

import { useState, useEffect } from 'react'
import { Loader2, Trash2, Eye, EyeOff, Shield, ShieldCheck, UserPlus, X, KeyRound } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

interface AdminUser {
  id: string
  auth_user_id: string
  email: string
  naam: string | null
  rol: 'beheerder' | 'redacteur'
  actief: boolean
  totp_verified: boolean
  email_2fa_enabled: boolean
  created_at: string
}

export default function GebruikersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', naam: '', password: '', rol: 'redacteur' as 'beheerder' | 'redacteur' })
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  const [pwUser, setPwUser] = useState<AdminUser | null>(null)
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    adminFetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleAdd() {
    if (!addForm.email || !addForm.password) { setAddError('E-mail en wachtwoord zijn verplicht'); return }
    if (addForm.password.length < 8) { setAddError('Wachtwoord moet minimaal 8 tekens zijn'); return }
    setAdding(true); setAddError('')

    const res = await adminFetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
    const data = await res.json()
    if (!res.ok) { setAddError(data.error || 'Fout bij aanmaken'); setAdding(false); return }
    setUsers((u) => [...u, data])
    setShowAdd(false)
    setAddForm({ email: '', naam: '', password: '', rol: 'redacteur' })
    setAdding(false)
  }

  async function updateUser(id: string, updates: Partial<AdminUser>) {
    const user = users.find((u) => u.id === id)
    if (!user) return
    await adminFetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, ...updates }),
    })
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }

  async function handlePasswordChange() {
    if (!pwUser) return
    if (pwForm.password.length < 8) { setPwError('Wachtwoord moet minimaal 8 tekens zijn'); return }
    if (pwForm.password !== pwForm.confirm) { setPwError('Wachtwoorden komen niet overeen'); return }
    setPwSaving(true); setPwError('')

    const res = await adminFetch(`/api/admin/users/${pwUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwForm.password }),
    })
    const data = await res.json()
    if (!res.ok) { setPwError(data.error || 'Fout bij opslaan'); setPwSaving(false); return }
    setPwSuccess(true)
    setTimeout(() => { setPwUser(null); setPwForm({ password: '', confirm: '' }); setPwSuccess(false) }, 1500)
    setPwSaving(false)
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Gebruiker "${email}" definitief verwijderen?`)) return
    await adminFetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setUsers((u) => u.filter((r) => r.id !== id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary-600" /></div>

  return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-zinc-900">Gebruikers</h1>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700">
            <UserPlus size={16} /> Gebruiker toevoegen
          </button>
        </div>
        <p className="text-zinc-500 text-sm mb-8">{users.length} gebruiker{users.length !== 1 ? 's' : ''} met CMS-toegang.</p>

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl text-zinc-900">Nieuwe gebruiker</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1.5">Naam</label>
                  <input type="text" value={addForm.naam} onChange={(e) => setAddForm({ ...addForm, naam: e.target.value })} placeholder="Volledige naam" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1.5">E-mailadres *</label>
                  <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="naam@bedrijf.nl" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1.5">Wachtwoord *</label>
                  <input type="text" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="Minimaal 8 tekens" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
                  <p className="text-xs text-zinc-400 mt-1">De gebruiker kan dit later wijzigen.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1.5">Rol</label>
                  <select value={addForm.rol} onChange={(e) => setAddForm({ ...addForm, rol: e.target.value as 'beheerder' | 'redacteur' })} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600">
                    <option value="redacteur">Redacteur — kan content bewerken</option>
                    <option value="beheerder">Beheerder — volledige toegang</option>
                  </select>
                </div>
              </div>
              {addError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mt-4">{addError}</p>}
              <div className="flex gap-3 mt-6">
                <button onClick={handleAdd} disabled={adding} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
                  {adding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} Toevoegen
                </button>
                <button onClick={() => setShowAdd(false)} className="px-5 py-3 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Annuleren</button>
              </div>
            </div>
          </div>
        )}

        {/* Password change modal */}
        {pwUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setPwUser(null); setPwForm({ password: '', confirm: '' }); setPwError('') }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-xl text-zinc-900">Wachtwoord wijzigen</h2>
                  <p className="text-sm text-zinc-400 mt-0.5">{pwUser.naam || pwUser.email}</p>
                </div>
                <button onClick={() => { setPwUser(null); setPwForm({ password: '', confirm: '' }); setPwError('') }} className="p-1 text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
              </div>

              {pwSuccess ? (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <KeyRound size={20} className="text-green-600" />
                  </div>
                  <p className="font-medium text-green-700">Wachtwoord bijgewerkt!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-1.5">Nieuw wachtwoord *</label>
                    <input type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} placeholder="Minimaal 8 tekens" autoFocus className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-1.5">Bevestig wachtwoord *</label>
                    <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Herhaal wachtwoord" onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordChange() }} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
                  </div>
                  {pwError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{pwError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={handlePasswordChange} disabled={pwSaving} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50">
                      {pwSaving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Opslaan
                    </button>
                    <button onClick={() => { setPwUser(null); setPwForm({ password: '', confirm: '' }); setPwError('') }} className="px-5 py-3 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Annuleren</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className={`bg-white rounded-xl border border-zinc-200 p-6 ${!user.actief ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${user.rol === 'beheerder' ? 'bg-primary-600/10' : 'bg-zinc-100'}`}>
                    {user.rol === 'beheerder' ? <ShieldCheck size={22} className="text-primary-600" /> : <Shield size={22} className="text-zinc-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{user.naam || user.email}</p>
                    {user.naam && <p className="text-sm text-zinc-400">{user.email}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <select value={user.rol} onChange={(e) => updateUser(user.id, { rol: e.target.value as 'beheerder' | 'redacteur' })} className="px-3 py-1 rounded-lg border border-zinc-200 text-xs font-medium focus:outline-none focus:border-primary-600">
                        <option value="redacteur">Redacteur</option>
                        <option value="beheerder">Beheerder</option>
                      </select>
                      <span className={`text-xs font-medium ${user.totp_verified || user.email_2fa_enabled ? 'text-green-600' : 'text-amber-600'}`}>
                        {user.totp_verified ? '2FA (TOTP)' : user.email_2fa_enabled ? '2FA (e-mail)' : 'Geen 2FA'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateUser(user.id, { actief: !user.actief })} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${user.actief ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {user.actief ? <Eye size={12} /> : <EyeOff size={12} />} {user.actief ? 'Actief' : 'Geblokkeerd'}
                  </button>
                  <button onClick={() => deleteUser(user.id, user.email)} className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-zinc-100 rounded-xl p-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Rollen uitleg</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-zinc-200">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-primary-600" />
                <span className="font-semibold text-sm text-primary-600">Beheerder</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">Volledige toegang tot alle CMS-onderdelen. Kan gebruikers toevoegen, verwijderen en rollen wijzigen.</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-zinc-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-zinc-400" />
                <span className="font-semibold text-sm text-zinc-900">Redacteur</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">Kan cursussen, sessies, categorieën en locaties bewerken. Geen toegang tot gebruikersbeheer of instellingen.</p>
            </div>
          </div>
        </div>
      </div>
  )
}
