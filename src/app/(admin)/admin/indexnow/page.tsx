'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle, AlertCircle, Globe } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

export default function IndexNowPage() {
  const [urls, setUrls] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string; count?: number } | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResult, setBulkResult] = useState<{ success: boolean; error?: string; count?: number } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean)
    if (urlList.length === 0) return

    setLoading(true)
    setResult(null)

    try {
      const res = await adminFetch('/api/admin/indexnow', {
        method: 'POST',
        body: JSON.stringify({ urls: urlList }),
      })
      const data = await res.json()
      setResult({ ...data, count: urlList.length })
    } catch {
      setResult({ success: false, error: 'Verzoek mislukt' })
    }
    setLoading(false)
  }

  async function pingAllPages() {
    setBulkLoading(true)
    setBulkResult(null)

    // Generate all important URLs
    const allUrls = [
      '/',
      '/cursussen',
      '/incompany',
      '/contact',
      '/over-ons',
      '/lesmethodes',
      '/locaties',
      '/veelgestelde-vragen',
    ]

    // Add category pages
    const categories = ['excel', 'word', 'outlook', 'powerpoint', 'power-bi', 'office-365', 'ai', 'project', 'visio']
    categories.forEach(c => allUrls.push(`/cursussen/${c}`))

    // Fetch course slugs from API
    try {
      const res = await adminFetch('/api/zoeken?q=cursus')
      const data = await res.json()
      if (data.results) {
        data.results.forEach((r: { slug: string }) => {
          allUrls.push(`/cursussen/${r.slug}`)
        })
      }
    } catch { /* continue with what we have */ }

    // Ping in batches of 100
    let totalSent = 0
    for (let i = 0; i < allUrls.length; i += 100) {
      const batch = allUrls.slice(i, i + 100)
      try {
        await adminFetch('/api/admin/indexnow', {
          method: 'POST',
          body: JSON.stringify({ urls: batch }),
        })
        totalSent += batch.length
      } catch {
        setBulkResult({ success: false, error: `Fout bij batch ${i / 100 + 1}` })
        setBulkLoading(false)
        return
      }
    }

    setBulkResult({ success: true, count: totalSent })
    setBulkLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">IndexNow</h1>
        <p className="text-zinc-500 text-sm">Ping Bing, Yandex en andere zoekmachines om pagina&apos;s direct te indexeren.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual ping */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-semibold text-zinc-900 mb-1">Handmatig pingen</h2>
          <p className="text-xs text-zinc-400 mb-4">Voer URL&apos;s in, één per regel (pad of volledige URL).</p>

          <form onSubmit={handleSubmit}>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={'/cursussen/excel-basis\n/cursussen/word-basis\n/over-ons'}
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm font-mono focus:outline-none focus:border-primary-600 resize-none mb-3"
            />
            <button
              type="submit"
              disabled={loading || !urls.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Ping naar IndexNow
            </button>
          </form>

          {result && (
            <div className={`mt-4 flex items-center gap-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {result.success ? `${result.count} URL('s) succesvol gepingd` : result.error}
            </div>
          )}
        </div>

        {/* Bulk ping */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-semibold text-zinc-900 mb-1">Alle pagina&apos;s pingen</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Ping alle belangrijke pagina&apos;s in één keer: homepage, cursussen, categorieën, locaties.
          </p>

          <div className="bg-zinc-50 rounded-lg p-4 mb-4 text-sm text-zinc-600 space-y-1">
            <p>Dit stuurt de volgende pagina&apos;s naar Bing/Yandex:</p>
            <ul className="text-xs text-zinc-400 space-y-0.5 mt-2">
              <li>• Homepage + statische pagina&apos;s (8)</li>
              <li>• Cursuscategorieën (9)</li>
              <li>• Individuele cursuspagina&apos;s (~28)</li>
            </ul>
          </div>

          <button
            onClick={pingAllPages}
            disabled={bulkLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {bulkLoading ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
            {bulkLoading ? 'Bezig met pingen...' : 'Alle pagina\'s pingen'}
          </button>

          {bulkResult && (
            <div className={`mt-4 flex items-center gap-2 text-sm ${bulkResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {bulkResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {bulkResult.success ? `${bulkResult.count} URL('s) succesvol gepingd` : bulkResult.error}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-zinc-50 rounded-xl border border-zinc-200 p-5">
        <h3 className="font-semibold text-zinc-900 text-sm mb-2">Hoe werkt IndexNow?</h3>
        <div className="text-sm text-zinc-500 space-y-1">
          <p>IndexNow is een protocol waarmee je zoekmachines direct laat weten dat een pagina nieuw of gewijzigd is.</p>
          <p>Ondersteund door: <strong>Bing</strong>, <strong>Yandex</strong>, <strong>Seznam</strong>, <strong>Naver</strong>. Google ondersteunt IndexNow (nog) niet — gebruik daarvoor Search Console.</p>
          <p className="text-xs text-zinc-400 mt-2">API key: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">c25f56ae71d415ddc0d266beb46763b5</code></p>
        </div>
      </div>
    </div>
  )
}
