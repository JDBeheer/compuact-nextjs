'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartBar() {
  const { items, getTotal, totalDeelnemers } = useCart()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 text-white shadow-2xl border-t border-zinc-700">
      <div className="container-wide py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <div>
            <span className="font-medium">
              {items.length} cursus{items.length !== 1 ? 'sen' : ''}
              {totalDeelnemers > items.length && (
                <span className="text-zinc-400">, {totalDeelnemers} deelnemer{totalDeelnemers !== 1 ? 's' : ''}</span>
              )}
            </span>
            <span className="mx-2 text-zinc-500">|</span>
            <span className="font-bold text-primary-400">{formatPrice(getTotal())}</span>
            <span className="text-zinc-400 text-xs ml-1.5 hidden sm:inline">excl. BTW</span>
          </div>
        </div>
        <Link
          href="/inschrijven"
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Door naar inschrijving
        </Link>
      </div>
    </div>
  )
}
