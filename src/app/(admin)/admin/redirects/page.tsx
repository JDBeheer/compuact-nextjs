'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Check, ArrowRight, ToggleLeft, ToggleRight, Search } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

interface Redirect {
  id: string
  from_path: string
  to_path: string
  status_code: number
  actief: boolean
  created_at: string
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newFrom, setNewFrom] = useState('')
  const [newTo, setNewTo] = useState('')
  const [newStatus, setNewStatus] = useState(301)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function loadRedirects() {
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/redirects')
      const data = await res.json()
      setRedirects(data.redirects || [])
    } catch {
      setRedirects([])
    }
    setLoading(false)
  }

  useEffect(() => { loadRedirects() }, [])

  async function addRedirect() {
    if (!newFrom.trim() || !newTo.trim()) return
    setSaving(true)
    const from = newFrom.startsWith('/') ? newFrom : '/' + newFrom
    const to = newTo.startsWith('/') ? newTo : '/' + newTo

    const res = await adminFetch('/api/admin/redirects', {
      method: 'POST',
      body: JSON.stringify({ from_path: from, to_path: to, status_code: newStatus, actief: true }),
    })
    const data = await res.json()
    if (res.ok && data.id) {
      setRedirects((prev) => [data, ...prev])
      setNewFrom('')
      setNewTo('')
      setShowForm(false)
    } else {
      alert(data.error || 'Toevoegen mislukt')
    }
    setSaving(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await adminFetch('/api/admin/redirects', { method: 'PUT', body: JSON.stringify({ id, actief: !current }) })
    setRedirects((prev) => prev.map((r) => r.id === id ? { ...r, actief: !current } : r))
  }

  async function deleteRedirect(id: string) {
    if (!confirm('Redirect verwijderen?')) return
    await adminFetch('/api/admin/redirects', { method: 'DELETE', body: JSON.stringify({ id }) })
    setRedirects((prev) => prev.filter((r) => r.id !== id))
  }

  return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">Redirects</h1>
            <p className="text-zinc-500 text-sm">Beheer URL-redirects om bezoekers naar de juiste pagina te leiden.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors">
            <Plus size={16} /> Nieuwe redirect
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op pad..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600"
          />
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
            <h3 className="font-semibold text-base text-zinc-900 mb-4">Redirect toevoegen</h3>
            <div className="grid md:grid-cols-[1fr_auto_1fr_auto_auto] gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Van (pad)</label>
                <input type="text" value={newFrom} onChange={(e) => setNewFrom(e.target.value)} placeholder="/oud-pad" className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
              </div>
              <ArrowRight size={16} className="text-zinc-400 mb-3 hidden md:block" />
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Naar (pad)</label>
                <input type="text" value={newTo} onChange={(e) => setNewTo(e.target.value)} placeholder="/nieuw-pad" className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                <select value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))} className="px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600">
                  <option value={301}>301 (permanent)</option>
                  <option value={302}>302 (tijdelijk)</option>
                </select>
              </div>
              <button onClick={addRedirect} disabled={saving || !newFrom.trim() || !newTo.trim()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Toevoegen
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
        ) : redirects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-zinc-200">
            <p className="text-zinc-500 text-lg">Geen redirects</p>
            <p className="text-zinc-400 text-sm mt-1">Klik &quot;Nieuwe redirect&quot; om er een toe te voegen.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Van</th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Naar</th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center hidden md:table-cell">Type</th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Actief</th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody>
                {redirects.filter((r) => !search || r.from_path.includes(search) || r.to_path.includes(search)).map((r) => (
                  <tr key={r.id} className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50 ${!r.actief ? 'opacity-50' : ''}`}>
                    <td className="py-3 px-5 text-sm font-mono text-zinc-900">{r.from_path}</td>
                    <td className="py-3 px-5 text-sm font-mono text-primary-600">{r.to_path}</td>
                    <td className="py-3 px-5 text-xs text-center hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status_code === 301 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{r.status_code}</span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button onClick={() => toggleActive(r.id, r.actief)} className="text-zinc-400 hover:text-primary-600 transition-colors">
                        {r.actief ? <ToggleRight size={22} className="text-primary-600" /> : <ToggleLeft size={22} />}
                      </button>
                    </td>
                    <td className="py-3 px-5">
                      <button onClick={() => deleteRedirect(r.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  )
}
