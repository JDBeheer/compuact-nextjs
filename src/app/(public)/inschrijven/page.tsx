'use client'

import Link from 'next/link'
import { Trash2, ShoppingCart, ArrowRight, FileText } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, lesmethodeLabel, formatDateShort, ADMIN_FEE, BTW_PERCENTAGE } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function WinkelwagenPage() {
  const { items, removeFromCart, getTotal } = useCart()
  const totaal = getTotal()

  if (items.length === 0) {
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="container-narrow py-16 text-center">
          <div className="bg-white rounded-2xl border border-zinc-200 p-12">
            <ShoppingCart size={48} className="text-zinc-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Je winkelwagen is leeg</h1>
            <p className="text-zinc-600 mb-6">
              Voeg een cursus toe om door te gaan met inschrijven.
            </p>
            <Link href="/cursussen">
              <Button>Bekijk cursussen</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-white border-b border-zinc-200">
        <div className="container-narrow py-8">
          <nav className="text-sm text-zinc-500 mb-4">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900">Inschrijven</span>
          </nav>
          <h1 className="text-3xl font-bold">Inschrijven</h1>
        </div>
      </div>

      <div className="container-narrow py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cursuslijst */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Gekozen cursussen ({items.length})</h2>
            {items.map((item) => (
              <div
                key={item.sessieId}
                className="bg-white rounded-xl border border-zinc-200 p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold">{item.cursusTitel}</h3>
                  <div className="text-sm text-zinc-600 mt-1 space-y-0.5">
                    <p>{lesmethodeLabel(item.lesmethode)} &middot; {item.locatie}</p>
                    <p>{formatDateShort(item.datum)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg">{formatPrice(item.prijs)}</div>
                  <button
                    onClick={() => removeFromCart(item.sessieId)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1 inline-flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Verwijder
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Samenvatting */}
          <div>
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Overzicht</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Subtotaal</span>
                  <span className="font-medium">{formatPrice(totaal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Administratiekosten</span>
                  <span className="font-medium">{formatPrice(ADMIN_FEE)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>BTW ({BTW_PERCENTAGE}%)</span>
                  <span>{formatPrice((totaal + ADMIN_FEE) * (BTW_PERCENTAGE / 100))}</span>
                </div>
              </div>
              <div className="border-t border-zinc-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Totaal excl. BTW</span>
                  <span className="text-xl font-bold text-primary-600">{formatPrice(totaal + ADMIN_FEE)}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">excl. 21% BTW &amp; €{ADMIN_FEE} administratiekosten</p>
              </div>
              <div className="mt-6 space-y-3">
                <Link href="/inschrijven/gegevens" className="block">
                  <Button className="w-full" size="lg">
                    Direct inschrijven <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/offerte" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    <FileText size={16} className="mr-2" /> Als offerte aanvragen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
