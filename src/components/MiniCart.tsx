'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function MiniCart() {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    increment,
    decrement,
    miniCartOpen,
    closeMiniCart,
  } = useCart()

  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 20-second auto-close — resets on pointer interaction
  useEffect(() => {
    if (!miniCartOpen) return
    autoCloseTimer.current = setTimeout(closeMiniCart, 10_000)
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
    }
  }, [miniCartOpen, closeMiniCart])

  function resetTimer() {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
    autoCloseTimer.current = setTimeout(closeMiniCart, 10_000)
  }

  function pauseTimer() {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
  }

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMiniCart() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeMiniCart])

  // Lock body scroll on desktop while open
  useEffect(() => {
    if (window.innerWidth < 768) return
    document.body.style.overflow = miniCartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [miniCartOpen])

  const itemList = (
    <ul className="flex-1 overflow-y-auto px-5">
      {items.map((item) => (
        <li
          key={`${item.productId}-${item.size}`}
          data-testid="mini-cart-item"
          className="flex items-start gap-4 border-b border-gray-100 py-4"
        >
          <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-gray-50 rounded-md">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>

          <div className="flex min-w-0 grow flex-col gap-2">
            <div>
              <p className="text-xs font-light uppercase tracking-wide leading-snug">{item.name}</p>
              {item.size && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Size: {item.size}{item.colorName && ` · ${item.colorName}`}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => item.quantity === 1 ? removeItem(item.productId, item.size) : decrement(item.productId, item.size)}
                  aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                  className="h-7 w-7 flex items-center justify-center hover:opacity-50 transition-opacity"
                >
                  {item.quantity === 1 ? <Trash2 size={13} strokeWidth={1.5} /> : <Minus size={13} strokeWidth={1.5} />}
                </button>
                <span className="min-w-[20px] text-center text-xs px-1.5 select-none">{item.quantity}</span>
                <button
                  onClick={() => increment(item.productId, item.size)}
                  aria-label="Increase quantity"
                  className="h-7 w-7 flex items-center justify-center hover:opacity-50 transition-opacity"
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
              <span className="text-xs uppercase tracking-wide whitespace-nowrap">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

  const emptyState = (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-8">
      <p className="text-sm text-gray-400 uppercase tracking-widest">Your bag is empty</p>
      <Link
        href="/products"
        onClick={closeMiniCart}
        className="text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity"
      >
        Continue Shopping
      </Link>
    </div>
  )

  const footer = items.length > 0 && (
    <div className="border-t border-gray-100 px-5 py-4 space-y-3 shrink-0">
      <div className="flex justify-between text-sm font-medium">
        <span>Subtotal</span>
        <span>₦{totalPrice.toLocaleString()}</span>
      </div>
      <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
      <Link
        href="/cart"
        onClick={closeMiniCart}
        data-testid="mini-cart-view-cart"
        className="block w-full py-3 bg-black text-white border border-black text-xs uppercase tracking-widest font-medium text-center rounded btn-wipe"
      >
        View Cart
      </Link>
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeMiniCart}
        className={`fixed inset-0 z-[200] bg-black transition-opacity duration-300 ${
          miniCartOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ── Mobile: bottom sheet (half screen, slides up) ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        onPointerMove={resetTimer}
        className={`md:hidden flex flex-col fixed bottom-0 left-0 right-0 z-[201] h-[55vh] bg-white rounded-t-xl shadow-2xl transition-transform duration-300 ease-in-out ${
          miniCartOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <p className="text-xs uppercase tracking-widest font-medium">
            Your Bag{totalItems > 0 && <span className="ml-2 text-gray-400">({totalItems})</span>}
          </p>
          <button onClick={closeMiniCart} aria-label="Close bag" className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? emptyState : itemList}
        {footer}
      </div>

      {/* ── Desktop: sidebar drawer (full height, slides from right) ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        onMouseEnter={pauseTimer}
        onMouseLeave={resetTimer}
        className={`hidden md:flex flex-col fixed top-0 right-0 z-[201] h-full w-full max-w-[420px] bg-white transition-transform duration-300 ease-in-out ${
          miniCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <p className="text-xs uppercase tracking-widest font-medium">
            Your Bag{totalItems > 0 && <span className="ml-2 text-gray-400">({totalItems})</span>}
          </p>
          <button onClick={closeMiniCart} aria-label="Close bag" className="p-1 rounded hover:bg-gray-100 transition-colors duration-200">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? emptyState : itemList}
        {footer}
      </div>
    </>
  )
}
