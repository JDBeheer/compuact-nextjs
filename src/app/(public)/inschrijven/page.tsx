'use client'

import Link from 'next/link'
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus, Users } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, lesmethodeLabel, formatDateShort, ADMIN_FEE, BTW_PERCENTAGE } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function WinkelwagenPage() {
  const { items, removeFromCart, updateDeelnemers, getTotal, totalDeelnemers } = useCart()
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
            <a href="/" className="hover:text-primary-500">Home</a>
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
            {items.map((item) => {
              const aantal = item.aantalDeelnemers || 1
              return (
                <div
                  key={item.sessieId}
                  className="bg-white rounded-xl border border-zinc-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.cursusTitel}</h3>
                      <div className="text-sm text-zinc-600 mt-1 space-y-0.5">
                        <p>{lesmethodeLabel(item.lesmethode)} &middot; {item.locatie}</p>
                        <p>{formatDateShort(item.datum)}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-lg">{formatPrice(item.prijs * aantal)}</div>
                      {aantal > 1 && (
                        <div className="text-xs text-zinc-400">{aantal}x {formatPrice(item.prijs)}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <Users size={14} />
                        <span>Deelnemers:</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => updateDeelnemers(item.sessieId, aantal - 1)}
                          disabled={aantal <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm tabular-nums">{aantal}</span>
                        <button
                          onClick={() => updateDeelnemers(item.sessieId, aantal + 1)}
                          disabled={aantal >= 20}
                          className="w-7 h-7 flex items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.sessieId)}
                      className="text-red-500 hover:text-red-700 text-sm inline-flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Verwijder
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Samenvatting */}
          <div>
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-32">
              <h2 className="text-lg font-semibold mb-4">Overzicht</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">{items.length} cursus{items.length > 1 ? 'sen' : ''}, {totalDeelnemers} deelnemer{totalDeelnemers > 1 ? 's' : ''}</span>
                </div>
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
                  <span className="text-xl font-bold text-primary-500">{formatPrice(totaal + ADMIN_FEE)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Link href="/inschrijven/gegevens" className="block">
                  <Button className="w-full" size="lg">
                    Doorgaan <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <div className="bg-primary-50 border border-primary-100 rounded-lg px-4 py-3 flex items-start gap-2.5">
                  <Users size={15} className="text-primary-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-primary-700">
                    <span className="font-semibold">Volgende stap:</span> vul de naam en e-mail in van elke deelnemer per cursus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
