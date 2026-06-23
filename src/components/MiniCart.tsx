'use client'

import { useEffect } from 'react'
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

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMiniCart()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeMiniCart])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = miniCartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [miniCartOpen])

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

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`fixed top-0 right-0 z-[201] h-full w-full max-w-[420px] bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          miniCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <p className="text-xs uppercase tracking-widest font-medium">
            Your Bag
            {totalItems > 0 && (
              <span className="ml-2 text-gray-400">({totalItems})</span>
            )}
          </p>
          <button
            onClick={closeMiniCart}
            aria-label="Close bag"
            className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Items (scrollable) ── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Your bag is empty</p>
            <Link
              href="/products"
              onClick={closeMiniCart}
              className="text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-6">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex flex-col gap-y-4 border-b border-gray-200 py-5">
                <div className="flex w-full items-start gap-5">

                  {/* Square thumbnail */}
                  <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-gray-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 grow flex-col gap-4">
                    {/* Name + size */}
                    <div>
                      <p className="text-sm font-light uppercase tracking-wide leading-snug">
                        {item.name}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-400 mt-1">
                          Size: {item.size}
                          {item.colorName && ` · ${item.colorName}`}
                        </p>
                      )}
                    </div>

                    {/* Controls: [trash][qty][+] ··· price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => item.quantity === 1
                            ? removeItem(item.productId, item.size)
                            : decrement(item.productId, item.size)
                          }
                          aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                          className="h-8 w-8 flex items-center justify-center hover:opacity-50 transition-opacity duration-200"
                        >
                          {item.quantity === 1
                            ? <Trash2 size={15} strokeWidth={1.5} />
                            : <Minus size={15} strokeWidth={1.5} />
                          }
                        </button>
                        <span className="min-w-[24px] text-center text-sm px-2 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.productId, item.size)}
                          aria-label="Increase quantity"
                          className="h-8 w-8 flex items-center justify-center hover:opacity-50 transition-opacity duration-200"
                        >
                          <Plus size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="text-sm uppercase tracking-wide whitespace-nowrap">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeMiniCart}
              className="block w-full py-4 bg-black text-white border border-black text-xs uppercase tracking-widest font-medium text-center btn-wipe"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeMiniCart}
              className="block text-center text-xs text-gray-400 hover:text-black underline underline-offset-4 transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
