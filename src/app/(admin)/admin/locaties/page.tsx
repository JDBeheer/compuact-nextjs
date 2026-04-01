'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Locatie } from '@/types'

export default function AdminLocatiesPage() {
  const [locaties, setLocaties] = useState<Locatie[]>([])
  const [naam, setNaam] = useState('')
  const [stad, setStad] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('locaties').select('*').order('stad')
    setLocaties((data || []) as Locatie[])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!stad.trim()) return
    const supabase = createClient()
    await supabase.from('locaties').insert({ naam: naam.trim() || stad.trim(), stad: stad.trim() })
    setNaam('')
    setStad('')
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Locatie verwijderen?')) return
    const supabase = createClient()
    await supabase.from('locaties').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Locaties</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 flex gap-3">
        <Input id="naam" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Locatienaam..." className="flex-1" />
        <Input id="stad" value={stad} onChange={(e) => setStad(e.target.value)} placeholder="Stad..." className="flex-1" />
        <Button type="submit"><Plus size={16} className="mr-2" /> Toevoegen</Button>
      </form>

      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {loading ? (
          <div className="px-6 py-8 text-center text-zinc-500">Laden...</div>
        ) : (
          locaties.map((loc) => (
            <div key={loc.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-medium">{loc.naam}</span>
                <span className="text-zinc-400 text-sm ml-2">{loc.stad}</span>
              </div>
              <button onClick={() => handleDelete(loc.id)} className="text-zinc-500 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
