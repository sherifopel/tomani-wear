'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCartContext } from '@/context/CartContext'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const { removeItem, items } = useCartContext()
  const ref   = searchParams.get('ref')
  const order = searchParams.get('order')

  // Clear the cart once on this page
  useEffect(() => {
    items.forEach(item => removeItem(item.productId, item.size))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center" data-testid="order-confirmation-page">

      {/* Tick */}
      <div className="mx-auto mb-8 w-16 h-16 rounded-full bg-black flex items-center justify-center" data-testid="order-confirmation-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-xl uppercase tracking-widest font-medium mb-3" data-testid="order-confirmation-heading">
        Order Confirmed
      </h1>

      <p className="text-sm text-gray-500 mb-2" data-testid="order-confirmation-message">
        Thank you for your order. We&apos;ll be in touch with shipping updates.
      </p>

      {order && (
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1" data-testid="order-confirmation-number">
          Order: <span className="text-black font-medium">{order}</span>
        </p>
      )}

      {ref && (
        <p className="text-xs text-gray-300 mb-10" data-testid="order-confirmation-ref">
          Ref: {ref}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          data-testid="order-confirmation-continue"
          className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest rounded border border-black btn-wipe"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          data-testid="order-confirmation-home"
          className="px-8 py-3 text-xs uppercase tracking-widest rounded border border-black btn-wipe-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  )
}
