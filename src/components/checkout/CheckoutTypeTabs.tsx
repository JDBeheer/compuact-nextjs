'use client'

import { ShoppingCart, FileText } from 'lucide-react'

interface CheckoutTypeTabsProps {
  activeType: 'inschrijving' | 'offerte'
  onTypeChange: (type: 'inschrijving' | 'offerte') => void
}

export default function CheckoutTypeTabs({ activeType, onTypeChange }: CheckoutTypeTabsProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-1.5 flex gap-1.5">
      <button
        type="button"
        onClick={() => onTypeChange('inschrijving')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
          activeType === 'inschrijving'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-zinc-600 hover:bg-zinc-50'
        }`}
      >
        <ShoppingCart size={16} />
        Direct inschrijven
      </button>
      <button
        type="button"
        onClick={() => onTypeChange('offerte')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
          activeType === 'offerte'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-zinc-600 hover:bg-zinc-50'
        }`}
      >
        <FileText size={16} />
        Offerte aanvragen
      </button>
    </div>
  )
}
