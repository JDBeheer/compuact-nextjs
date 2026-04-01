'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatPrice, formatDateShort, lesmethodeLabel } from '@/lib/utils'
import { Cursus, Locatie } from '@/types'

interface SessieRow {
  id: string
  cursus_id: string
  locatie_id: string
  datum: string
  tijden: string
  prijs: number
  lesmethode: string
  capaciteit: number
  actief: boolean
  cursus: { titel: string } | null
  locatie: { stad: string } | null
}

export default function AdminSessiesPage() {
  const [sessies, setSessies] = useState<SessieRow[]>([])
  const [cursussen, setCursussen] = useState<Cursus[]>([])
  const [locaties, setLocaties] = useState<Locatie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const [sessieRes, cursusRes, locatieRes] = await Promise.all([
      supabase.from('cursus_sessies').select('*, cursus:cursussen(titel), locatie:locaties(stad)').order('datum'),
      supabase.from('cursussen').select('id, titel').order('titel'),
      supabase.from('locaties').select('*').order('stad'),
    ])
    setSessies((sessieRes.data || []) as SessieRow[])
    setCursussen((cursusRes.data || []) as Cursus[])
    setLocaties((locatieRes.data || []) as Locatie[])
    setLoading(false)
  }

  async function deleteSessie(id: string) {
    if (!confirm('Sessie verwijderen?')) return
    const supabase = createClient()
    await supabase.from('cursus_sessies').delete().eq('id', id)
    loadData()
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    await supabase.from('cursus_sessies').insert({
      cursus_id: form.get('cursus_id'),
      locatie_id: form.get('locatie_id'),
      datum: form.get('datum'),
      tijden: form.get('tijden') || '10:00 - 16:30',
      prijs: Number(form.get('prijs')),
      lesmethode: form.get('lesmethode'),
      capaciteit: Number(form.get('capaciteit')) || 8,
      actief: true,
    })
    setShowForm(false)
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sessies</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" /> Nieuwe sessie
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select id="cursus_id" name="cursus_id" label="Cursus" required placeholder="Kies cursus"
              options={cursussen.map(c => ({ value: c.id, label: c.titel }))} />
            <Select id="locatie_id" name="locatie_id" label="Locatie" required placeholder="Kies locatie"
              options={locaties.map(l => ({ value: l.id, label: l.stad }))} />
            <Input id="datum" name="datum" label="Datum" type="date" required />
            <Input id="tijden" name="tijden" label="Tijden" placeholder="10:00 - 16:30" />
            <Input id="prijs" name="prijs" label="Prijs (€)" type="number" step="0.01" required />
            <Select id="lesmethode" name="lesmethode" label="Lesmethode" required
              options={[
                { value: 'klassikaal', label: 'Klassikaal' },
                { value: 'online', label: 'Live Online' },
                { value: 'incompany', label: 'InCompany' },
              ]} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Toevoegen</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuleren</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-4 py-3 font-medium">Cursus</th>
              <th className="text-left px-4 py-3 font-medium">Locatie</th>
              <th className="text-left px-4 py-3 font-medium">Datum</th>
              <th className="text-left px-4 py-3 font-medium">Methode</th>
              <th className="text-right px-4 py-3 font-medium">Prijs</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">Laden...</td></tr>
            ) : (
              sessies.map((s) => (
                <tr key={s.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{s.cursus?.titel || '-'}</td>
                  <td className="px-4 py-3">{s.locatie?.stad || '-'}</td>
                  <td className="px-4 py-3">{formatDateShort(s.datum)}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{lesmethodeLabel(s.lesmethode)}</Badge></td>
                  <td className="px-4 py-3 text-right">{formatPrice(s.prijs)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={s.actief ? 'success' : 'outline'}>{s.actief ? 'Actief' : 'Inactief'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteSessie(s.id)} className="text-zinc-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
