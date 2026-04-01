'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import { Inschrijving, CartItem } from '@/types'
import { formatPrice, formatDateShort } from '@/lib/utils'

export default function AdminInzendingenPage() {
  const [inzendingen, setInzendingen] = useState<Inschrijving[]>([])
  const [filter, setFilter] = useState<'alle' | 'inschrijving' | 'offerte'>('alle')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inschrijving | null>(null)

  useEffect(() => {
    loadInzendingen()
  }, [filter])

  async function loadInzendingen() {
    const supabase = createClient()
    let query = supabase
      .from('inschrijvingen')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'alle') {
      query = query.eq('type', filter)
    }

    const { data } = await query
    setInzendingen((data || []) as Inschrijving[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('inschrijvingen').update({ status }).eq('id', id)
    loadInzendingen()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inzendingen</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['alle', 'inschrijving', 'offerte'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {f === 'alle' ? 'Alle' : f === 'inschrijving' ? 'Inschrijvingen' : 'Offertes'}
          </button>
        ))}
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
                return (
                  <button
                    key={inz.id}
                    onClick={() => setSelected(inz)}
                    className={`w-full text-left px-6 py-4 hover:bg-zinc-50 transition-colors ${
                      selected?.id === inz.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{klant.voornaam} {klant.achternaam}</div>
                        <div className="text-sm text-zinc-500">{klant.email}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={inz.type === 'inschrijving' ? 'success' : 'primary'}>
                          {inz.type}
                        </Badge>
                        <div className="text-xs text-zinc-400 mt-1">
                          {new Date(inz.created_at).toLocaleDateString('nl-NL')}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-lg">Details</h2>

              <div className="space-y-2 text-sm">
                <p><strong>Naam:</strong> {selected.klantgegevens.voornaam} {selected.klantgegevens.achternaam}</p>
                <p><strong>Email:</strong> {selected.klantgegevens.email}</p>
                <p><strong>Telefoon:</strong> {selected.klantgegevens.telefoon}</p>
                {selected.klantgegevens.bedrijfsnaam && (
                  <p><strong>Bedrijf:</strong> {selected.klantgegevens.bedrijfsnaam}</p>
                )}
                <p><strong>Adres:</strong> {selected.klantgegevens.adres}, {selected.klantgegevens.postcode} {selected.klantgegevens.stad}</p>
              </div>

              {selected.cursussen.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Cursussen</h3>
                  <div className="space-y-2">
                    {selected.cursussen.map((c: CartItem) => (
                      <div key={c.sessieId} className="text-sm bg-zinc-50 rounded-lg p-3">
                        <div className="font-medium">{c.cursusTitel}</div>
                        <div className="text-zinc-500">{c.locatie} &middot; {formatDateShort(c.datum)}</div>
                        <div className="font-medium mt-1">{formatPrice(c.prijs)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-zinc-200 pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Totaal</span>
                  <span className="text-primary-600">{formatPrice(selected.totaalprijs)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Status wijzigen</h3>
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
