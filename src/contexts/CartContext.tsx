'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (sessieId: string) => void
  clearCart: () => void
  getTotal: () => number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'compuact-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Initialiseer vanuit localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // localStorage niet beschikbaar
    }
    setLoaded(true)
  }, [])

  // Sync naar localStorage bij wijziging
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
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((sessieId: string) => {
    setItems(prev => prev.filter(i => i.sessieId !== sessieId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.prijs, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        itemCount: items.length,
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
