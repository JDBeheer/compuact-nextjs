'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, ChevronUp, ChevronDown, X, ArrowRight, MapPin, Calendar } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatDateShort, lesmethodeLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [animating, setAnimating] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value !== prevValue.current) {
      setAnimating(true)
      const t = setTimeout(() => {
        setDisplayValue(value)
        setAnimating(false)
      }, 150)
      prevValue.current = value
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span className={cn(
      'inline-block transition-all duration-300',
      animating ? 'scale-125 text-accent-400' : 'scale-100',
      className
    )}>
      {animating ? value : displayValue}
    </span>
  )
}

export default function CartBar() {
  const { items, getTotal, totalDeelnemers, removeFromCart } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [pulse, setPulse] = useState(false)
  const prevItemCount = useRef(items.length)

  // Pulse animation when items change
  useEffect(() => {
    if (items.length !== prevItemCount.current) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 600)
      prevItemCount.current = items.length
      return () => clearTimeout(t)
    }
  }, [items.length])

  if (items.length === 0) return null

  return (
    <>
      {/* Backdrop when expanded */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Expanded panel */}
        {expanded && (
          <div className="bg-white border-t border-zinc-200 shadow-2xl max-h-[60vh] overflow-y-auto">
            <div className="container-wide py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Jouw selectie</h3>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.sessieId}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-50 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{item.cursusTitel}</div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {item.locatie}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDateShort(item.datum)}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          item.lesmethode === 'online'
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-primary-100 text-primary-700'
                        }`}>
                          {lesmethodeLabel(item.lesmethode)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-sm">{formatPrice(item.prijs * (item.aantalDeelnemers || 1))}</span>
                        {(item.aantalDeelnemers || 1) > 1 && (
                          <div className="text-[10px] text-zinc-400">{item.aantalDeelnemers}x</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.sessieId)}
                        className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main bar */}
        <div className={cn(
          'bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300',
          pulse && 'shadow-[0_-4px_30px_rgba(37,99,235,0.4)]'
        )}>
          <div className="container-wide py-3 flex items-center justify-between gap-4">
            {/* Left: expand toggle + info */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative">
                <div className={cn(
                  'bg-white/20 p-2.5 rounded-xl transition-all duration-300',
                  pulse && 'bg-white/30 scale-110'
                )}>
                  <ShoppingCart size={20} />
                </div>
                <div className={cn(
                  'absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300',
                  pulse && 'scale-125 bg-accent-400'
                )}>
                  <AnimatedNumber value={String(items.length)} />
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm leading-tight">
                  <AnimatedNumber value={String(items.length)} /> cursus{items.length !== 1 ? 'sen' : ''}
                  {totalDeelnemers > items.length && (
                    <span className="font-normal text-primary-200"> &middot; <AnimatedNumber value={String(totalDeelnemers)} /> deelnemers</span>
                  )}
                </div>
                <div className="text-primary-200 text-xs flex items-center gap-1">
                  {expanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  {expanded ? 'Verberg details' : 'Bekijk selectie'}
                </div>
              </div>
            </button>

            {/* Right: total + CTA */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-primary-300">Totaal excl. BTW</div>
                <div className="text-xl font-extrabold tracking-tight">
                  <AnimatedNumber value={formatPrice(getTotal())} />
                </div>
              </div>
              <Link
                href="/inschrijven"
                className={cn(
                  'bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-accent-500/25 active:scale-[0.98] flex items-center gap-2',
                  pulse && 'animate-bounce-once'
                )}
              >
                <span className="sm:hidden font-extrabold">
                  <AnimatedNumber value={formatPrice(getTotal())} />
                </span>
                <span className="hidden sm:inline">Inschrijven</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
