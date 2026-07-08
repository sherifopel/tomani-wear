'use client'

/**
 * CartContext — global cart state for Tomani Wear
 *
 * Think of this like a global Express middleware that every component can
 * tap into. You "provide" the cart at the top of the app (in layout.tsx)
 * and any component below can "consume" it with useCart().
 *
 * The reducer pattern is like a Redux action handler:
 *   dispatch({ type: 'ADD_ITEM', payload: item })
 *   → reducer decides what the new state looks like
 *
 * localStorage keeps the cart alive across page refreshes — same as
 * a browser cookie but stored as JSON on the client side.
 */

import { createContext, useContext, useReducer, useState, useEffect, useRef, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { CartItem, CartState, CartDerived } from '@/types/cart'

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_ITEM';       payload: CartItem }
  | { type: 'REMOVE_ITEM';    payload: { productId: string; size: string } }
  | { type: 'INCREMENT';      payload: { productId: string; size: string } }
  | { type: 'DECREMENT';      payload: { productId: string; size: string } }
  | { type: 'HYDRATE';        payload: CartItem[] }
  | { type: 'CLEAR' }

function isSameItem(a: CartItem, b: { productId: string; size: string }) {
  return a.productId === b.productId && a.size === b.size
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {

    case 'HYDRATE':
      return { items: action.payload }

    case 'ADD_ITEM': {
      const qty = action.payload.quantity ?? 1
      const existing = state.items.find((i) => isSameItem(i, action.payload))
      if (existing) {
        return {
          items: state.items.map((i) =>
            isSameItem(i, action.payload)
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: qty }] }
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => !isSameItem(i, action.payload)) }

    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          isSameItem(i, action.payload) ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }

    case 'DECREMENT': {
      const item = state.items.find((i) => isSameItem(i, action.payload))
      if (!item) return state
      if (item.quantity === 1) {
        // Reached zero — remove the item entirely
        return { items: state.items.filter((i) => !isSameItem(i, action.payload)) }
      }
      return {
        items: state.items.map((i) =>
          isSameItem(i, action.payload) ? { ...i, quantity: i.quantity - 1 } : i
        ),
      }
    }

    case 'CLEAR':
      return { items: [] }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

type CartContextValue = CartState & CartDerived & {
  addItem:        (item: CartItem) => void
  removeItem:     (productId: string, size: string) => void
  increment:      (productId: string, size: string) => void
  decrement:      (productId: string, size: string) => void
  clearCart:      () => void
  miniCartOpen:   boolean
  openMiniCart:   () => void
  closeMiniCart:  () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'tomani-cart'

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const { status } = useSession()
  const prevStatusRef = useRef<string>('')

  // On first render, load the saved cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
      }
    } catch {
      // localStorage unavailable or malformed JSON — start with empty cart
    }
  }, [])

  // Whenever the cart changes, save it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // ignore write errors (e.g. private browsing with storage disabled)
    }
  }, [state.items])

  // When a guest session becomes authenticated, merge the localStorage cart
  // into the user's saved DB cart — exactly once per browser session.
  // sessionStorage survives SPA navigation but clears when the tab closes,
  // so a fresh sign-in always gets a fresh merge.
  useEffect(() => {
    if (status === 'authenticated' && !sessionStorage.getItem('cart-merged')) {
      sessionStorage.setItem('cart-merged', '1')
      const guestItems = state.items
      fetch('/api/cart/merge', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: guestItems }),
      })
        .then((res) => res.ok ? res.json() : null)
        .then((merged: CartItem[] | null) => {
          if (merged) dispatch({ type: 'HYDRATE', payload: merged })
        })
        .catch(() => {
          // Network error — keep the local cart as-is
        })
    }
    prevStatusRef.current = status
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Derived totals — computed fresh on every render, not stored
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value: CartContextValue = {
    ...state,
    totalItems,
    totalPrice,
    addItem:       (item)            => dispatch({ type: 'ADD_ITEM',    payload: item }),
    removeItem:    (productId, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } }),
    increment:     (productId, size) => dispatch({ type: 'INCREMENT',   payload: { productId, size } }),
    decrement:     (productId, size) => dispatch({ type: 'DECREMENT',   payload: { productId, size } }),
    clearCart:     ()                => dispatch({ type: 'CLEAR' }),
    miniCartOpen,
    openMiniCart:  () => setMiniCartOpen(true),
    closeMiniCart: () => setMiniCartOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>')
  return ctx
}
