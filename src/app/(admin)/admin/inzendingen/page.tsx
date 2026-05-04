'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import { Inschrijving } from '@/types'
import { formatPrice, formatDateShort, lesmethodeLabel } from '@/lib/utils'
import { Trash2, Users, MapPin, Calendar, Mail, Phone, Building2, AlertTriangle, Send, X } from 'lucide-react'

export default function AdminInzendingenPage() {
  const [alle, setAlle] = useState<Inschrijving[]>([])
  const [filter, setFilter] = useState<string>('nieuw')
  const [datumVan, setDatumVan] = useState('')
  const [datumTot, setDatumTot] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inschrijving | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [resending, setResending] = useState<string | null>(null)

  async function loadInzendingen() {
    const supabase = createClient()
    const { data } = await supabase
      .from('inschrijvingen')
      .select('*')
      .order('created_at', { ascending: false })
    setAlle((data || []) as Inschrijving[])
    setLoading(false)
  }

  useEffect(() => { loadInzendingen() }, [])

  // Counts per type (always from full dataset)
  const counts: Record<string, number> = {
    alle: alle.length,
    nieuw: alle.filter(i => i.status === 'nieuw').length,
    inschrijving: alle.filter(i => i.type === 'inschrijving').length,
    offerte: alle.filter(i => i.type === 'offerte').length,
    incompany: alle.filter(i => i.type === 'incompany').length,
    studiegids: alle.filter(i => i.type === 'studiegids').length,
  }

  // Apply filters
  const inzendingen = alle.filter(i => {
    if (filter === 'nieuw') { if (i.status !== 'nieuw') return false }
    else if (filter !== 'alle') { if (i.type !== filter) return false }
    if (datumVan) { if (new Date(i.created_at) < new Date(datumVan)) return false }
    if (datumTot) { if (new Date(i.created_at) > new Date(datumTot + 'T23:59:59')) return false }
    return true
  })

  async function updateStatus(id: string, status: Inschrijving['status']) {
    const supabase = createClient()
    await supabase.from('inschrijvingen').update({ status }).eq('id', id)
    setAlle(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  async function resendEmail(id: string, target: 'klant' | 'admin') {
    setResending(`${id}-${target}`)
    try {
      const res = await fetch('/api/admin/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, target }),
      })
      if (!res.ok) throw new Error()
      alert(`E-mail naar ${target === 'klant' ? 'klant' : 'admin'} is opnieuw verzonden.`)
    } catch {
      alert('Verzenden mislukt. Probeer het opnieuw.')
    } finally {
      setResending(null)
    }
  }

  async function deleteInzending(id: string) {
    const supabase = createClient()
    await supabase.from('inschrijvingen').delete().eq('id', id)
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
    setAlle(prev => prev.filter(i => i.id !== id))
  }

  const typeBadge = (type: string) => {
    switch (type) {
      case 'inschrijving': return <Badge variant="success">Inschrijving</Badge>
      case 'offerte': return <Badge variant="primary">Offerte</Badge>
      case 'incompany': return <Badge variant="warning">InCompany</Badge>
      case 'studiegids': return <Badge variant="secondary">Studiegids</Badge>
      default: return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inzendingen</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Nieuw — special status filter */}
        <button
          onClick={() => setFilter('nieuw')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'nieuw' ? 'bg-amber-500 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          Nieuw & onafgehandeld
          {counts.nieuw > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded-full text-xs font-semibold ${filter === 'nieuw' ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700'}`}>
              {counts.nieuw}
            </span>
          )}
        </button>

        <div className="w-px bg-zinc-200 self-stretch mx-1" />

        {[
          { key: 'alle', label: 'Alle' },
          { key: 'inschrijving', label: 'Inschrijvingen' },
          { key: 'offerte', label: 'Offertes' },
          { key: 'incompany', label: 'InCompany' },
          { key: 'studiegids', label: 'Studiegids' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-primary-500 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {f.label}
            <span className={`inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded-full text-xs font-semibold ${filter === f.key ? 'bg-white/30 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
              {counts[f.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Datumfilter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm text-zinc-500 font-medium">Periode:</span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={datumVan}
            onChange={(e) => setDatumVan(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-500"
          />
          <span className="text-zinc-400 text-sm">t/m</span>
          <input
            type="date"
            value={datumTot}
            onChange={(e) => setDatumTot(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-primary-500"
          />
          {(datumVan || datumTot) && (
            <button onClick={() => { setDatumVan(''); setDatumTot('') }} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <span className="text-xs text-zinc-400">{inzendingen.length} resultaten</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lijst */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {loading ? (
              <div className="px-6 py-8 text-center text-zinc-500">Laden...</div>
            ) : inzendingen.length === 0 ? (
              <div className="px-6 py-8 text-center text-zinc-500">Geen inzendingen gevonden.</div>
            ) : (
              inzendingen.map((inz) => {
                const klant = inz.klantgegevens
                const aantalCursussen = inz.cursussen?.length || 0
                const totalDeelnemers = inz.cursussen?.reduce((sum, c) => sum + ((c as unknown as Record<string, number>).aantalDeelnemers || 1), 0) || 0

                return (
                  <div key={inz.id} className={`relative ${selected?.id === inz.id ? 'bg-primary-50' : ''}`}>
                    <button
                      onClick={() => setSelected(inz)}
                      className="w-full text-left px-6 py-4 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{klant.voornaam} {klant.achternaam}</div>
                          <div className="text-sm text-zinc-500 truncate">{klant.email}</div>
                          {klant.bedrijfsnaam && (
                            <div className="text-xs text-zinc-400 truncate">{klant.bedrijfsnaam}</div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-2 justify-end">
                            {typeBadge(inz.type)}
                            <Badge variant={inz.status === 'nieuw' ? 'warning' : inz.status === 'verwerkt' ? 'success' : 'secondary'}>
                              {inz.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-zinc-400 mt-1">
                            {new Date(inz.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {aantalCursussen > 0 && inz.type !== 'studiegids' && (
                            <div className="text-xs text-zinc-400">
                              {aantalCursussen} cursus{aantalCursussen !== 1 ? 'sen' : ''} &middot; {totalDeelnemers} deelnemer{totalDeelnemers !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <h2 className="font-bold text-lg">Details</h2>
                {typeBadge(selected.type)}
              </div>

              {/* Klantgegevens */}
              <div className="space-y-2 text-sm">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Klantgegevens</h3>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-zinc-400" />
                  <span className="font-medium">{selected.klantgegevens.voornaam} {selected.klantgegevens.achternaam}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-zinc-400" />
                  <a href={`mailto:${selected.klantgegevens.email}`} className="text-primary-500 hover:underline">{selected.klantgegevens.email}</a>
                </div>
                {selected.klantgegevens.telefoon && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-zinc-400" />
                    <a href={`tel:${selected.klantgegevens.telefoon}`} className="hover:underline">{selected.klantgegevens.telefoon}</a>
                  </div>
                )}
                {selected.klantgegevens.bedrijfsnaam && (
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-zinc-400" />
                    <span>{selected.klantgegevens.bedrijfsnaam}</span>
                  </div>
                )}
                {selected.klantgegevens.adres && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-zinc-400" />
                    <span>{selected.klantgegevens.adres}, {selected.klantgegevens.postcode} {selected.klantgegevens.stad}</span>
                  </div>
                )}
                {selected.klantgegevens.opmerkingen && (
                  <div className="bg-zinc-50 rounded-lg p-3 mt-2">
                    <div className="text-xs font-semibold text-zinc-400 mb-1">Opmerkingen</div>
                    <p className="text-zinc-700">{selected.klantgegevens.opmerkingen}</p>
                  </div>
                )}
              </div>

              {/* Cursussen + deelnemers */}
              {selected.cursussen && selected.cursussen.length > 0 && selected.type !== 'studiegids' && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Cursussen &amp; deelnemers</h3>
                  <div className="space-y-3">
                    {selected.cursussen.map((c, idx) => {
                      const cursus = c as unknown as Record<string, unknown>
                      const deelnemers = (cursus.deelnemers || []) as Array<{ voornaam: string; achternaam: string; email: string; telefoon?: string }>
                      const aantal = (cursus.aantalDeelnemers as number) || 1

                      return (
                        <div key={idx} className="bg-zinc-50 rounded-lg p-3">
                          <div className="font-medium text-sm">{String(cursus.cursusTitel)}</div>
                          <div className="flex flex-wrap gap-x-3 text-xs text-zinc-500 mt-1">
                            {Boolean(cursus.locatie) && (
                              <span className="flex items-center gap-1"><MapPin size={11} />{String(cursus.locatie)}</span>
                            )}
                            {Boolean(cursus.datum) && (
                              <span className="flex items-center gap-1"><Calendar size={11} />{formatDateShort(String(cursus.datum))}</span>
                            )}
                            {Boolean(cursus.lesmethode) && (
                              <span>{lesmethodeLabel(String(cursus.lesmethode))}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-zinc-400">{aantal} deelnemer{aantal !== 1 ? 's' : ''}</span>
                            {Boolean(cursus.prijs) && (
                              <span className="font-semibold text-sm">{formatPrice(Number(cursus.prijs) * aantal)}</span>
                            )}
                          </div>

                          {/* Deelnemer details */}
                          {deelnemers.length > 0 && deelnemers.some(d => d.voornaam) && (
                            <div className="mt-2 pt-2 border-t border-zinc-200">
                              <div className="text-xs font-semibold text-zinc-400 mb-1">Deelnemers:</div>
                              <div className="space-y-1">
                                {deelnemers.map((d, i) => (
                                  <div key={i} className="flex items-center justify-between gap-2 text-xs">
                                    <span className="text-zinc-700 shrink-0">
                                      {d.voornaam || d.achternaam ? `${d.voornaam} ${d.achternaam}`.trim() : `Deelnemer ${i + 1}`}
                                    </span>
                                    <div className="flex items-center gap-3 min-w-0">
                                      {d.telefoon && (
                                        <a href={`tel:${d.telefoon}`} className="text-zinc-500 hover:text-primary-500 hover:underline shrink-0">{d.telefoon}</a>
                                      )}
                                      {d.email && (
                                        <a href={`mailto:${d.email}`} className="text-primary-500 hover:underline truncate">{d.email}</a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Totaal */}
              {selected.totaalprijs > 0 && (
                <div className="border-t border-zinc-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Totaal</span>
                    <span className="text-primary-500">{formatPrice(selected.totaalprijs)}</span>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Status wijzigen</h3>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                >
                  <option value="nieuw">Nieuw</option>
                  <option value="verwerkt">Verwerkt</option>
                  <option value="geannuleerd">Geannuleerd</option>
                </select>
              </div>

              {/* E-mail opnieuw verzenden */}
              {selected.type !== 'studiegids' && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">E-mail opnieuw verzenden</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resendEmail(selected.id, 'klant')}
                      disabled={resending !== null}
                      className="flex items-center gap-1.5 text-sm bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg font-medium hover:bg-primary-100 transition-colors disabled:opacity-50"
                    >
                      <Send size={13} />
                      {resending === `${selected.id}-klant` ? 'Verzenden...' : 'Naar klant'}
                    </button>
                    <button
                      onClick={() => resendEmail(selected.id, 'admin')}
                      disabled={resending !== null}
                      className="flex items-center gap-1.5 text-sm bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      <Send size={13} />
                      {resending === `${selected.id}-admin` ? 'Verzenden...' : 'Naar admin'}
                    </button>
                  </div>
                </div>
              )}

              {/* Verwijderen */}
              <div className="border-t border-zinc-200 pt-3">
                {deleteConfirm === selected.id ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-2">
                      <AlertTriangle size={14} />
                      Weet je zeker dat je deze inzending wilt verwijderen?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteInzending(selected.id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Ja, verwijderen
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="bg-white border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(selected.id)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} /> Inzending verwijderen
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center text-zinc-500">
              Selecteer een inzending om details te bekijken.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
