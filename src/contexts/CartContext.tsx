'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (sessieId: string) => void
  updateDeelnemers: (sessieId: string, aantal: number) => void
  clearCart: () => void
  getTotal: () => number
  itemCount: number
  totalDeelnemers: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'compuact-cart'

function migrateCartItem(item: CartItem): CartItem {
  return {
    ...item,
    aantalDeelnemers: item.aantalDeelnemers || 1,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        setItems(parsed.map(migrateCartItem))
      }
    } catch {
      // localStorage niet beschikbaar
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch {
        // localStorage niet beschikbaar
      }
    }
  }, [items, loaded])

  const addToCart = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.sessieId === item.sessieId)) return prev
      return [...prev, { ...item, aantalDeelnemers: item.aantalDeelnemers || 1 }]
    })
  }, [])

  const removeFromCart = useCallback((sessieId: string) => {
    setItems(prev => prev.filter(i => i.sessieId !== sessieId))
  }, [])

  const updateDeelnemers = useCallback((sessieId: string, aantal: number) => {
    setItems(prev => prev.map(item =>
      item.sessieId === sessieId
        ? { ...item, aantalDeelnemers: Math.max(1, aantal) }
        : item
    ))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.prijs * (item.aantalDeelnemers || 1)), 0)
  }, [items])

  const totalDeelnemers = items.reduce((sum, item) => sum + (item.aantalDeelnemers || 1), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateDeelnemers,
        clearCart,
        getTotal,
        itemCount: items.length,
        totalDeelnemers,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
