'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, UserPlus, Minus, Plus, Users, Copy, Check } from 'lucide-react'
import { Deelnemer, CartItem } from '@/types'
import { formatDateShort, lesmethodeLabel, formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Input from '@/components/ui/Input'

interface DeelnemersPickerProps {
  item: CartItem
  deelnemers: Deelnemer[]
  onDeelnemersChange: (deelnemers: Deelnemer[]) => void
  onAantalChange: (aantal: number) => void
  showSync?: boolean
  onSyncToAll?: (deelnemers: Deelnemer[]) => void
}

export default function DeelnemersPicker({
  item,
  deelnemers,
  onDeelnemersChange,
  onAantalChange,
  showSync = false,
  onSyncToAll,
}: DeelnemersPickerProps) {
  const [open, setOpen] = useState(true)
  const [synced, setSynced] = useState(false)
  const aantal = item.aantalDeelnemers || 1

  const handleAantalChange = (newAantal: number) => {
    const clamped = Math.max(1, Math.min(20, newAantal))
    onAantalChange(clamped)

    if (clamped > deelnemers.length) {
      const extra = Array.from({ length: clamped - deelnemers.length }, () => ({
        voornaam: '',
        achternaam: '',
        email: '',
        telefoon: '',
      }))
      onDeelnemersChange([...deelnemers, ...extra])
    } else if (clamped < deelnemers.length) {
      onDeelnemersChange(deelnemers.slice(0, clamped))
    }
  }

  const updateDeelnemer = (index: number, field: keyof Deelnemer, value: string) => {
    const updated = [...deelnemers]
    updated[index] = { ...updated[index], [field]: value }
    onDeelnemersChange(updated)
  }

  const handleSyncToAll = () => {
    if (onSyncToAll) {
      onSyncToAll(deelnemers)
      setSynced(true)
      setTimeout(() => setSynced(false), 2000)
    }
  }

  const hasFilledDeelnemers = deelnemers.some(d => d.voornaam && d.achternaam)

  const lesdagenText = item.lesdagen && item.lesdagen.length > 1
    ? item.lesdagen.map(d => formatDateShort(d)).join(', ')
    : formatDateShort(item.datum)

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold">{item.cursusTitel}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">
              {lesmethodeLabel(item.lesmethode)} &middot; {item.locatie}
            </p>
            <p className="text-sm text-zinc-500">{lesdagenText}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-lg">{formatPrice(item.prijs * aantal)}</div>
            {aantal > 1 && (
              <div className="text-xs text-zinc-400">{aantal}x {formatPrice(item.prijs)}</div>
            )}
          </div>
        </div>

        {/* Deelnemers stepper */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Users size={16} />
            <span>Aantal deelnemers</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleAantalChange(aantal - 1)}
              disabled={aantal <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-semibold tabular-nums">{aantal}</span>
            <button
              type="button"
              onClick={() => handleAantalChange(aantal + 1)}
              disabled={aantal >= 20}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Deelnemer details toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3 bg-zinc-50 border-t border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <UserPlus size={14} />
          Gegevens deelnemers <span className="text-red-400">*</span>
          {hasFilledDeelnemers && (
            <span className="bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 rounded-full">
              {deelnemers.filter(d => d.voornaam).length}/{aantal}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Deelnemer forms */}
      {open && (
        <div className="border-t border-zinc-200">
          <div className="divide-y divide-zinc-100">
            {deelnemers.map((deelnemer, index) => (
              <div key={index} className="p-4 sm:p-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Deelnemer {index + 1}
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input
                    id={`${item.sessieId}-dn-${index}-voornaam`}
                    value={deelnemer.voornaam}
                    onChange={(e) => updateDeelnemer(index, 'voornaam', e.target.value)}
                    placeholder="Voornaam"
                    label="Voornaam"
                    required
                  />
                  <Input
                    id={`${item.sessieId}-dn-${index}-achternaam`}
                    value={deelnemer.achternaam}
                    onChange={(e) => updateDeelnemer(index, 'achternaam', e.target.value)}
                    placeholder="Achternaam"
                    label="Achternaam"
                    required
                  />
                  <Input
                    id={`${item.sessieId}-dn-${index}-email`}
                    type="email"
                    value={deelnemer.email}
                    onChange={(e) => updateDeelnemer(index, 'email', e.target.value)}
                    placeholder="E-mailadres"
                    label="E-mail"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sync button */}
          {showSync && hasFilledDeelnemers && onSyncToAll && (
            <div className="px-4 sm:px-5 py-3 bg-primary-50 border-t border-primary-100">
              <button
                type="button"
                onClick={handleSyncToAll}
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold transition-all',
                  synced ? 'text-primary-600' : 'text-primary-500 hover:text-primary-700'
                )}
              >
                {synced ? (
                  <>
                    <Check size={15} />
                    Deelnemers toegepast op alle cursussen
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Deze deelnemers toepassen op alle andere cursussen
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
