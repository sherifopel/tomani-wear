'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, increment, decrement } = useCart()

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10" data-testid="cart-empty">
        <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
          <p className="text-sm uppercase tracking-widest text-gray-400">Your cart is empty</p>
          <Link
            href="/products"
            className="px-8 py-3 bg-black text-white border border-black text-xs uppercase tracking-widest btn-wipe"
            data-testid="cart-start-shopping"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  // ── Filled cart ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-28 md:pb-10" data-testid="cart-page">

      <Breadcrumbs />

      {/* Header */}
      <h1 className="text-2xl font-medium uppercase tracking-widest mb-8">
        Shopping Cart{' '}
        <span className="text-gray-400 text-sm normal-case tracking-normal">
          ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-16 md:items-start">

        {/* ── Items list ── */}
        <ul data-testid="cart-items">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}`}
              className="py-6 flex gap-4 border-b border-gray-100"
              data-testid="cart-item"
            >
              {/* Square thumbnail */}
              <div className="relative aspect-square w-24 md:w-28 shrink-0 bg-gray-50 overflow-hidden border border-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 112px, 96px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              {/* Right column: name top, controls + price bottom */}
              <div className="flex flex-col flex-1 min-w-0 justify-between gap-3">

                {/* Name + size */}
                <div>
                  <p className="text-sm font-light uppercase tracking-wide leading-snug" data-testid="cart-item-name">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1" data-testid="cart-item-size">
                    Size: {item.size}
                    {item.colorName && ` · ${item.colorName}`}
                  </p>
                </div>

                {/* Stepper + price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center" data-testid="cart-item-qty">
                    <button
                      onClick={() => item.quantity === 1
                        ? removeItem(item.productId, item.size)
                        : decrement(item.productId, item.size)
                      }
                      data-testid="cart-quantity-decrement"
                      aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                      className="h-8 w-8 flex items-center justify-center hover:opacity-50 transition-opacity duration-200"
                    >
                      {item.quantity === 1
                        ? <Trash2 size={14} strokeWidth={1.5} />
                        : <Minus size={14} strokeWidth={1.5} />
                      }
                    </button>
                    <span className="min-w-[28px] text-center text-sm select-none">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.productId, item.size)}
                      data-testid="cart-quantity-increment"
                      aria-label="Increase quantity"
                      className="h-8 w-8 flex items-center justify-center hover:opacity-50 transition-opacity duration-200"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>

                  <p className="text-sm font-medium whitespace-nowrap">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

              </div>
            </li>
          ))}
        </ul>

        {/* ── Order summary — hidden on mobile (shown in sticky bar instead) ── */}
        <div className="hidden md:block mt-10 md:mt-0 bg-gray-50 p-6 space-y-4" data-testid="cart-order-summary">
          <p className="text-xs uppercase tracking-widest font-medium" data-testid="cart-summary-heading">Order Summary</p>

          <div className="flex justify-between text-xs text-gray-400" data-testid="cart-summary-shipping-row">
            <span>Shipping</span>
            <span data-testid="cart-shipping">Calculated at checkout</span>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm" data-testid="cart-summary-subtotal-row">
              <span className="text-gray-500">Subtotal</span>
              <span data-testid="cart-subtotal">₦{totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-medium" data-testid="cart-summary-total-row">
              <span>Total</span>
              <span data-testid="cart-total">₦{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full py-4 bg-black text-white border border-black text-xs uppercase tracking-widest font-medium text-center btn-wipe"
            data-testid="cart-checkout-button"
          >
            Checkout
          </Link>
        </div>

      </div>

      {/* ── Sticky checkout bar — mobile only ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium uppercase tracking-widest">Total</span>
          <span className="text-sm font-medium">₦{totalPrice.toLocaleString()}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full py-4 bg-black text-white border border-black text-xs uppercase tracking-widest font-medium text-center btn-wipe"
          data-testid="cart-checkout-button-mobile"
        >
          Checkout
        </Link>
      </div>

    </div>
  )
}

