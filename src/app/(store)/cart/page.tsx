'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, increment, decrement } = useCart()

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6"
        data-testid="cart-empty"
      >
        <p className="text-sm uppercase tracking-widest text-gray-400">Your cart is empty</p>
        <Link
          href="/products"
          className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors"
          data-testid="cart-start-shopping"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  // ── Filled cart ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="cart-page">

      {/* Header */}
      <h1 className="text-xl font-light tracking-wide mb-8">
        Your Cart <span className="text-gray-400 text-sm">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="md:grid md:grid-cols-[1fr_280px] md:gap-12 md:items-start">

        {/* ── Items list ── */}
        <ul className="divide-y divide-gray-100" data-testid="cart-items">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}`}
              className="py-6 flex gap-4"
              data-testid="cart-item"
            >
              {/* Thumbnail */}
              {item.image && (
                <div className="relative w-20 h-20 shrink-0 bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" data-testid="cart-item-name">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 mt-1" data-testid="cart-item-size">
                  Size: {item.size}
                  {item.colorName && ` · ${item.colorName}`}
                </p>
                <p className="text-sm mt-2">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Quantity + remove */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  data-testid="cart-item-remove"
                  aria-label="Remove item"
                  className="text-gray-300 hover:text-black transition-colors text-lg leading-none"
                >
                  ×
                </button>

                {/* Quantity stepper */}
                <div className="flex items-center border border-gray-200" data-testid="cart-item-qty">
                  <button
                    onClick={() => decrement(item.productId, item.size)}
                    data-testid="cart-quantity-decrement"
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.productId, item.size)}
                    data-testid="cart-quantity-increment"
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ── Order summary ── */}
        <div className="mt-8 md:mt-0 border border-gray-100 p-6 space-y-4">
          <p className="text-xs uppercase tracking-widest font-medium">Order Summary</p>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span data-testid="cart-subtotal">₦{totalPrice.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>

          {/* Checkout — Paystack integration is a future ticket */}
          <Link
            href="/checkout"
            className="block w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-medium text-center hover:bg-gray-900 transition-colors"
            data-testid="cart-checkout-button"
          >
            Checkout
          </Link>

          <Link
            href="/products"
            className="block text-center text-xs text-gray-400 hover:text-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}
