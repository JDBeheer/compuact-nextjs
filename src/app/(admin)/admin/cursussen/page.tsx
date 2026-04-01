'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Cursus } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function AdminCursussenPage() {
  const [cursussen, setCursussen] = useState<Cursus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCursussen()
  }, [])

  async function loadCursussen() {
    const supabase = createClient()
    const { data } = await supabase
      .from('cursussen')
      .select('*, categorie:categorieen(naam)')
      .order('titel')
    setCursussen((data || []) as Cursus[])
    setLoading(false)
  }

  async function deleteCursus(id: string) {
    if (!confirm('Weet je zeker dat je deze cursus wilt verwijderen?')) return
    const supabase = createClient()
    await supabase.from('cursussen').delete().eq('id', id)
    loadCursussen()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cursussen</h1>
        <Link href="/admin/cursussen/nieuw">
          <Button><Plus size={16} className="mr-2" /> Nieuwe cursus</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-4 py-3 font-medium">Titel</th>
              <th className="text-left px-4 py-3 font-medium">Categorie</th>
              <th className="text-left px-4 py-3 font-medium">Niveau</th>
              <th className="text-right px-4 py-3 font-medium">Prijs vanaf</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Acties</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">Laden...</td></tr>
            ) : cursussen.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">Nog geen cursussen.</td></tr>
            ) : (
              cursussen.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{c.titel}</td>
                  <td className="px-4 py-3 text-zinc-600">{(c.categorie as unknown as { naam: string })?.naam || '-'}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{c.niveau}</Badge></td>
                  <td className="px-4 py-3 text-right">{formatPrice(c.prijs_vanaf)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={c.actief ? 'success' : 'outline'}>
                      {c.actief ? 'Actief' : 'Inactief'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/cursussen/${c.id}`}>
                        <button className="text-zinc-500 hover:text-primary-600"><Pencil size={16} /></button>
                      </Link>
                      <button onClick={() => deleteCursus(c.id)} className="text-zinc-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
