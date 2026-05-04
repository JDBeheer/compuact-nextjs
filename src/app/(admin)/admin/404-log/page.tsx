'use client'

import { useState, useEffect } from 'react'
import { Trash2, ArrowRight, Loader2, RefreshCw, CheckCircle, Download, ExternalLink, Search } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

interface ErrorLog {
  id: string
  ids?: string[]
  path: string
  referrer: string | null
  count: number
  first_seen: string
  last_seen: string
  resolved: boolean
}

type SortKey = 'hits' | 'last_seen'
type Tab = 'open' | 'resolved'

export default function ErrorLogPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortKey>('last_seen')
  const [tab, setTab] = useState<Tab>('open')
  const [search, setSearch] = useState('')

  async function loadLogs() {
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/error-logs')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch {
      setLogs([])
    }
    setLoading(false)
  }

  useEffect(() => { loadLogs() }, [])

  async function toggleResolved(log: ErrorLog) {
    const next = !log.resolved
    setLogs((prev) => prev.map((l) => l.path === log.path ? { ...l, resolved: next } : l))
    try {
      await adminFetch('/api/admin/error-logs', {
        method: 'PATCH',
        body: JSON.stringify({ path: log.path, resolved: next }),
      })
    } catch {
      setLogs((prev) => prev.map((l) => l.path === log.path ? { ...l, resolved: !next } : l))
    }
  }

  async function deleteLog(log: ErrorLog) {
    await adminFetch('/api/admin/error-logs', {
      method: 'DELETE',
      body: JSON.stringify({ path: log.path }),
    })
    setLogs((prev) => prev.filter((l) => l.path !== log.path))
  }

  async function clearAll() {
    const scope = tab === 'open' ? 'open' : 'opgeloste'
    if (!confirm(`Weet je zeker dat je alle ${scope} logs wilt verwijderen?`)) return
    const toDelete = logs.filter((l) => l.resolved === (tab === 'resolved'))
    for (const log of toDelete) {
      await adminFetch('/api/admin/error-logs', {
        method: 'DELETE',
        body: JSON.stringify({ path: log.path }),
      })
    }
    setLogs((prev) => prev.filter((l) => l.resolved !== (tab === 'resolved')))
  }

  async function createRedirect(log: ErrorLog) {
    const toPath = prompt(`Redirect ${log.path} naar:`, '/')
    if (!toPath) return
    await adminFetch('/api/admin/redirects', {
      method: 'POST',
      body: JSON.stringify({ from_path: log.path, to_path: toPath, status_code: 301, actief: true }),
    })
    await adminFetch('/api/admin/error-logs', {
      method: 'PATCH',
      body: JSON.stringify({ path: log.path, resolved: true }),
    })
    setLogs((prev) => prev.map((l) => l.path === log.path ? { ...l, resolved: true } : l))
    alert(`Redirect aangemaakt: ${log.path} → ${toPath}`)
  }

  function exportCSV() {
    const header = 'Pad,Hits,Referrer,Laatst gezien,Status\n'
    const rows = logs.map((log) => {
      const status = log.resolved ? 'Opgelost' : 'Open'
      const ref = (log.referrer || '').replace(/,/g, ';')
      return `${log.path},${log.count},"${ref}",${new Date(log.last_seen).toLocaleString('nl-NL')},${status}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `404-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const openCount = logs.filter((l) => !l.resolved).length
  const resolvedCount = logs.filter((l) => l.resolved).length

  const visibleLogs = logs
    .filter((l) => l.resolved === (tab === 'resolved'))
    .filter((l) => !search || l.path.toLowerCase().includes(search.toLowerCase()) || (l.referrer || '').toLowerCase().includes(search.toLowerCase()))
  const sortedLogs = [...visibleLogs].sort((a, b) => {
    if (sortBy === 'hits') return b.count - a.count
    return b.last_seen.localeCompare(a.last_seen)
  })

  return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">404 Log</h1>
            <p className="text-zinc-500 text-sm">
              {logs.length} pagina&apos;s gelogd — {openCount} open, {resolvedCount} opgelost
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek op pad of referrer..."
                className="pl-8 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-600 w-64"
              />
            </div>
            {logs.length > 0 && (
              <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:text-primary-600 hover:border-primary-600/30 transition-colors">
                <Download size={14} /> Export CSV
              </button>
            )}
            <button onClick={loadLogs} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:text-primary-600 hover:border-primary-600/30 transition-colors">
              <RefreshCw size={14} /> Vernieuwen
            </button>
            {visibleLogs.length > 0 && (
              <button onClick={clearAll} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={14} /> {tab === 'open' ? 'Open wissen' : 'Opgeloste wissen'}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1 mb-4 border-b border-zinc-200">
          <button
            onClick={() => setTab('open')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'open'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Open <span className="ml-1.5 inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{openCount}</span>
          </button>
          <button
            onClick={() => setTab('resolved')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'resolved'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Opgelost <span className="ml-1.5 inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{resolvedCount}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-600" />
          </div>
        ) : visibleLogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-zinc-200">
            <p className="text-zinc-500 text-lg">{tab === 'open' ? 'Geen openstaande 404’s' : 'Geen opgeloste 404’s'}</p>
            <p className="text-zinc-400 text-sm mt-1">{tab === 'open' ? 'Goed nieuws!' : 'Markeer logs als opgelost om ze hier te zien'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="py-3 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center w-10">Status</th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pad</th>
                  <th className="py-3 px-5 text-xs font-semibold uppercase tracking-wider text-center">
                    <button onClick={() => setSortBy('hits')} className={`${sortBy === 'hits' ? 'text-primary-600' : 'text-zinc-500'} hover:text-primary-600`}>
                      Hits {sortBy === 'hits' && '↓'}
                    </button>
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Referrer</th>
                  <th className="py-3 px-5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    <button onClick={() => setSortBy('last_seen')} className={`${sortBy === 'last_seen' ? 'text-primary-600' : 'text-zinc-500'} hover:text-primary-600`}>
                      Laatst gezien {sortBy === 'last_seen' && '↓'}
                    </button>
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log) => (
                  <tr key={log.id} className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50 ${log.resolved ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-3 text-center">
                      <button onClick={() => toggleResolved(log)} title={log.resolved ? 'Markeer als open' : 'Markeer als opgelost'} className={`p-1 rounded-lg transition-colors ${log.resolved ? 'text-green-500 hover:text-green-700' : 'text-zinc-300 hover:text-green-500'}`}>
                        <CheckCircle size={18} className={log.resolved ? 'fill-green-100' : ''} />
                      </button>
                    </td>
                    <td className="py-3 px-5 text-sm font-mono text-zinc-900">{log.path}</td>
                    <td className="py-3 px-5 text-sm text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{log.count}</span>
                    </td>
                    <td className="py-3 px-5 text-xs text-zinc-400 hidden md:table-cell max-w-[300px]">
                      {log.referrer ? <a href={log.referrer} target="_blank" rel="noopener noreferrer" className="block truncate hover:text-primary-600">{log.referrer}</a> : '—'}
                    </td>
                    <td className="py-3 px-5 text-xs text-zinc-400 hidden md:table-cell">{new Date(log.last_seen).toLocaleString('nl-NL')}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1">
                        <a href={log.path} target="_blank" rel="noopener noreferrer" title="Bekijk pagina" className="p-1.5 rounded-lg text-zinc-400 hover:text-primary-600 hover:bg-primary-600/10 transition-colors inline-flex">
                          <ExternalLink size={14} />
                        </a>
                        <button onClick={() => createRedirect(log)} title="Redirect aanmaken" className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-600/10 transition-colors"><ArrowRight size={14} /></button>
                        <button onClick={() => deleteLog(log)} title="Verwijderen" className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
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
