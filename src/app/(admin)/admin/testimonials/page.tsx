'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Testimonial } from '@/types'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials((data || []) as Testimonial[])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    await supabase.from('testimonials').insert({
      naam: form.get('naam'),
      bedrijf: form.get('bedrijf'),
      tekst: form.get('tekst'),
      rating: Number(form.get('rating')) || 5,
      actief: true,
    })
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Testimonial verwijderen?')) return
    const supabase = createClient()
    await supabase.from('testimonials').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" /> Nieuw
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Input id="naam" name="naam" label="Naam" required />
            <Input id="bedrijf" name="bedrijf" label="Bedrijf" />
            <Input id="rating" name="rating" label="Rating (1-5)" type="number" min="1" max="5" defaultValue="5" />
          </div>
          <Textarea id="tekst" name="tekst" label="Tekst" required />
          <div className="flex gap-2">
            <Button type="submit">Opslaan</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuleren</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-zinc-200 px-6 py-8 text-center text-zinc-500">Laden...</div>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'} />
                    ))}
                  </div>
                  <p className="text-zinc-700 italic mb-2">&ldquo;{t.tekst}&rdquo;</p>
                  <p className="text-sm font-medium">{t.naam}</p>
                  {t.bedrijf && <p className="text-xs text-zinc-500">{t.bedrijf}</p>}
                </div>
                <button onClick={() => handleDelete(t.id)} className="text-zinc-500 hover:text-red-600 shrink-0 ml-4">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
