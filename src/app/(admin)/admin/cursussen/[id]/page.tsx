'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Categorie, Cursus } from '@/types'

export default function BewerkCursusPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [categorieen, setCategorieen] = useState<Categorie[]>([])

  const [form, setForm] = useState({
    titel: '',
    korte_beschrijving: '',
    beschrijving: '',
    categorie_id: '',
    niveau: 'beginner' as 'beginner' | 'gevorderd' | 'expert',
    prijs_vanaf: '',
    duur: '',
    afbeelding: '',
    actief: true,
    wat_leer_je: '',
    programma: '',
    doelgroep: '',
    voorkennis: '',
    lesmateriaal: '',
    certificaat: '',
    incompany_tekst: '',
  })

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('categorieen').select('*').order('volgorde'),
      supabase.from('cursussen').select('*').eq('id', id).single(),
    ]).then(([{ data: cats }, { data: cursus, error }]) => {
      setCategorieen((cats || []) as Categorie[])
      if (error || !cursus) {
        setNotFound(true)
      } else {
        const c = cursus as Cursus
        setForm({
          titel: c.titel,
          korte_beschrijving: c.korte_beschrijving,
          beschrijving: c.beschrijving,
          categorie_id: c.categorie_id,
          niveau: c.niveau,
          prijs_vanaf: String(c.prijs_vanaf),
          duur: c.duur,
          afbeelding: c.afbeelding || '',
          actief: c.actief,
          wat_leer_je: (c.inhoud?.wat_leer_je || []).join('\n'),
          programma: (c.inhoud?.programma || []).join('\n'),
          doelgroep: c.inhoud?.doelgroep || '',
          voorkennis: c.inhoud?.voorkennis || '',
          lesmateriaal: c.inhoud?.lesmateriaal || '',
          certificaat: c.inhoud?.certificaat || '',
          incompany_tekst: c.inhoud?.incompany_tekst || '',
        })
      }
      setLoading(false)
    })
  }, [id])

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('cursussen')
      .update({
        titel: form.titel,
        korte_beschrijving: form.korte_beschrijving,
        beschrijving: form.beschrijving,
        categorie_id: form.categorie_id,
        niveau: form.niveau,
        prijs_vanaf: Number(form.prijs_vanaf),
        duur: form.duur,
        afbeelding: form.afbeelding || null,
        actief: form.actief,
        updated_at: new Date().toISOString(),
        inhoud: {
          wat_leer_je: form.wat_leer_je.split('\n').filter(Boolean),
          programma: form.programma.split('\n').filter(Boolean),
          doelgroep: form.doelgroep,
          voorkennis: form.voorkennis,
          lesmateriaal: form.lesmateriaal,
          certificaat: form.certificaat,
          ...(form.incompany_tekst ? { incompany_tekst: form.incompany_tekst } : {}),
        },
      })
      .eq('id', id)

    if (error) {
      alert('Er ging iets mis: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/cursussen')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-500 text-lg">Cursus niet gevonden.</p>
        <Link href="/admin/cursussen" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
          Terug naar cursussen
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/cursussen" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">Cursus bewerken</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Basisgegevens</h2>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm text-zinc-600">Actief</span>
              <input
                type="checkbox"
                checked={form.actief}
                onChange={(e) => setForm(f => ({ ...f, actief: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-300 accent-primary-600"
              />
            </label>
          </div>

          <Input id="titel" name="titel" label="Titel" value={form.titel} onChange={set('titel')} required />
          <Input id="korte_beschrijving" name="korte_beschrijving" label="Korte beschrijving" value={form.korte_beschrijving} onChange={set('korte_beschrijving')} required />
          <Textarea id="beschrijving" name="beschrijving" label="Volledige beschrijving" value={form.beschrijving} onChange={set('beschrijving')} required />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              id="categorie_id"
              name="categorie_id"
              label="Categorie"
              required
              value={form.categorie_id}
              onChange={set('categorie_id')}
              options={categorieen.map((c) => ({ value: c.id, label: c.naam }))}
            />
            <Select
              id="niveau"
              name="niveau"
              label="Niveau"
              required
              value={form.niveau}
              onChange={set('niveau')}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'gevorderd', label: 'Gevorderd' },
                { value: 'expert', label: 'Expert' },
              ]}
            />
            <Input id="prijs_vanaf" name="prijs_vanaf" label="Prijs vanaf (€)" type="number" step="0.01" value={form.prijs_vanaf} onChange={set('prijs_vanaf')} required />
            <Input id="duur" name="duur" label="Duur" placeholder="bijv. 1 dag" value={form.duur} onChange={set('duur')} required />
          </div>
          <Input id="afbeelding" name="afbeelding" label="Afbeelding URL" placeholder="https://..." value={form.afbeelding} onChange={set('afbeelding')} />
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Inhoud</h2>
          <Textarea id="wat_leer_je" name="wat_leer_je" label="Wat leer je? (één punt per regel)" rows={6} value={form.wat_leer_je} onChange={set('wat_leer_je')} />
          <Textarea id="programma" name="programma" label="Programma (één onderdeel per regel)" rows={6} value={form.programma} onChange={set('programma')} />
          <Input id="doelgroep" name="doelgroep" label="Doelgroep" value={form.doelgroep} onChange={set('doelgroep')} />
          <Input id="voorkennis" name="voorkennis" label="Voorkennis" value={form.voorkennis} onChange={set('voorkennis')} />
          <Input id="lesmateriaal" name="lesmateriaal" label="Lesmateriaal" value={form.lesmateriaal} onChange={set('lesmateriaal')} />
          <Input id="certificaat" name="certificaat" label="Certificaat" value={form.certificaat} onChange={set('certificaat')} />
          <Textarea id="incompany_tekst" name="incompany_tekst" label="InCompany tekst (optioneel)" rows={3} value={form.incompany_tekst} onChange={set('incompany_tekst')} />
        </div>

        <div className="flex gap-3 pb-8">
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 size={16} className="mr-2 animate-spin" /> Opslaan...</> : 'Wijzigingen opslaan'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/cursussen')}>
            Annuleren
          </Button>
        </div>
      </form>
    </div>
  )
}
