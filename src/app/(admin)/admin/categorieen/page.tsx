'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Categorie } from '@/types'
import { slugify } from '@/lib/utils'

export default function AdminCategorieenPage() {
  const [categorieen, setCategorieen] = useState<Categorie[]>([])
  const [naam, setNaam] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('categorieen').select('*').order('volgorde')
    setCategorieen((data || []) as Categorie[])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!naam.trim()) return
    const supabase = createClient()
    await supabase.from('categorieen').insert({
      naam: naam.trim(),
      slug: slugify(naam),
      volgorde: categorieen.length,
    })
    setNaam('')
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Categorie verwijderen?')) return
    const supabase = createClient()
    await supabase.from('categorieen').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categorieën</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 flex gap-3">
        <Input id="naam" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Nieuwe categorie..." className="flex-1" />
        <Button type="submit"><Plus size={16} className="mr-2" /> Toevoegen</Button>
      </form>

      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {loading ? (
          <div className="px-6 py-8 text-center text-zinc-500">Laden...</div>
        ) : (
          categorieen.map((cat) => (
            <div key={cat.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-medium">{cat.naam}</span>
                <span className="text-zinc-400 text-sm ml-2">/{cat.slug}</span>
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-zinc-500 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
