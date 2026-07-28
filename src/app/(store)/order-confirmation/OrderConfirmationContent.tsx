'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartContext } from '@/context/CartContext'
import { pixel } from '@/lib/pixel'

type Props = {
  paystackRef: string | null
  order:       string | null
  userName:    string | null
  userEmail:   string | null
  isLoggedIn:  boolean
}

export default function OrderConfirmationContent({ paystackRef, order, userName, userEmail, isLoggedIn }: Props) {
  const { removeItem, items } = useCartContext()

  // Fire Purchase event and clear the cart once on mount
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (total > 0) pixel.purchase(order ?? paystackRef ?? 'unknown', total)
    items.forEach(item => removeItem(item.productId, item.size))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstName = userName?.split(' ')[0] ?? null

  return (
    <div className="max-w-7xl mx-auto px-6" data-testid="order-confirmation-page">
      <div className="max-w-xl mx-auto py-20 text-center">

        {/* Animated tick */}
        <div
          className="mx-auto mb-8 w-20 h-20 rounded-full bg-black flex items-center justify-center"
          data-testid="order-confirmation-icon"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Personalised greeting */}
        <h1 className="text-2xl  font-medium mb-3" data-testid="order-confirmation-heading">
          {firstName ? `Thank you, ${firstName}!` : 'Order Confirmed'}
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-2" data-testid="order-confirmation-message">
          Your order has been confirmed and is being prepared.
        </p>

        {userEmail && (
          <p className="text-sm text-gray-500 mb-8" data-testid="order-confirmation-email">
            We&apos;ll send shipping updates to{' '}
            <span className="text-black font-medium">{userEmail}</span>
          </p>
        )}

        {!userEmail && (
          <p className="text-sm text-gray-500 mb-8">
            We&apos;ll be in touch with shipping updates.
          </p>
        )}

        {/* Order details card */}
        {(paystackRef || order) && (
          <div className="border border-gray-100 rounded-md px-6 py-5 mb-10 text-left" data-testid="order-confirmation-number">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Order reference</span>
              <span className="text-sm font-semibold tracking-wider">{paystackRef ?? order}</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            data-testid="order-confirmation-continue"
            className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs  rounded border border-black btn-wipe"
          >
            Continue Shopping
          </Link>

          {isLoggedIn ? (
            <Link
              href="/account"
              data-testid="order-confirmation-account"
              className="w-full sm:w-auto px-8 py-3.5 text-xs  rounded border border-black btn-wipe-white"
            >
              View My Orders
            </Link>
          ) : (
            <Link
              href="/"
              data-testid="order-confirmation-home"
              className="w-full sm:w-auto px-8 py-3.5 text-xs  rounded border border-black btn-wipe-white"
            >
              Back to Home
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
