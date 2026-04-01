'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { Categorie } from '@/types'
import { slugify } from '@/lib/utils'

export default function NieuweCursusPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categorieen, setCategorieen] = useState<Categorie[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categorieen').select('*').order('volgorde').then(({ data }) => {
      setCategorieen((data || []) as Categorie[])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const titel = form.get('titel') as string

    const cursus = {
      titel,
      slug: slugify(titel),
      beschrijving: form.get('beschrijving') as string,
      korte_beschrijving: form.get('korte_beschrijving') as string,
      categorie_id: form.get('categorie_id') as string,
      prijs_vanaf: Number(form.get('prijs_vanaf')),
      niveau: form.get('niveau') as string,
      duur: form.get('duur') as string,
      afbeelding: form.get('afbeelding') as string || null,
      actief: true,
      inhoud: {
        wat_leer_je: (form.get('wat_leer_je') as string).split('\n').filter(Boolean),
        programma: (form.get('programma') as string).split('\n').filter(Boolean),
        doelgroep: form.get('doelgroep') as string,
        voorkennis: form.get('voorkennis') as string,
        lesmateriaal: form.get('lesmateriaal') as string || 'Inbegrepen in de cursusprijs.',
        certificaat: form.get('certificaat') as string || 'Certificaat van deelname na afloop.',
      },
    }

    const supabase = createClient()
    const { error } = await supabase.from('cursussen').insert(cursus)

    if (error) {
      alert('Er ging iets mis: ' + error.message)
      setLoading(false)
      return
    }

    router.push('/admin/cursussen')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nieuwe cursus</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Basisgegevens</h2>
          <Input id="titel" name="titel" label="Titel" required />
          <Input id="korte_beschrijving" name="korte_beschrijving" label="Korte beschrijving" required />
          <Textarea id="beschrijving" name="beschrijving" label="Volledige beschrijving" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              id="categorie_id"
              name="categorie_id"
              label="Categorie"
              required
              placeholder="Kies categorie"
              options={categorieen.map((c) => ({ value: c.id, label: c.naam }))}
            />
            <Select
              id="niveau"
              name="niveau"
              label="Niveau"
              required
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'gevorderd', label: 'Gevorderd' },
                { value: 'expert', label: 'Expert' },
              ]}
            />
            <Input id="prijs_vanaf" name="prijs_vanaf" label="Prijs vanaf (€)" type="number" step="0.01" required />
            <Input id="duur" name="duur" label="Duur" placeholder="bijv. 1 dag" required />
          </div>
          <Input id="afbeelding" name="afbeelding" label="Afbeelding URL" placeholder="https://..." />
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Inhoud</h2>
          <Textarea id="wat_leer_je" name="wat_leer_je" label="Wat leer je? (één punt per regel)" rows={6} />
          <Textarea id="programma" name="programma" label="Programma (één onderdeel per regel)" rows={6} />
          <Input id="doelgroep" name="doelgroep" label="Doelgroep" />
          <Input id="voorkennis" name="voorkennis" label="Voorkennis" />
          <Input id="lesmateriaal" name="lesmateriaal" label="Lesmateriaal" />
          <Input id="certificaat" name="certificaat" label="Certificaat" />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Opslaan...</> : 'Cursus aanmaken'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Annuleren
          </Button>
        </div>
      </form>
    </div>
  )
}
