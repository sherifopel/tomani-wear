'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCartContext } from '@/context/CartContext'
import Breadcrumbs from '@/components/Breadcrumbs'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout' },
]

// react-paystack accesses `window` at module load time — SSR crashes without this.
// Importing from a separate file is required: dynamic(() => Promise.resolve(localFn))
// does NOT prevent the module from being evaluated server-side.
const CheckoutForm = dynamic(() => import('./CheckoutForm'), { ssr: false })

export default function CheckoutPage() {
  const { items } = useCartContext()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  if (items.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 lg:pb-16 pt-4" data-testid="checkout-page">
      <Breadcrumbs crumbs={CRUMBS} testId="checkout-breadcrumb" />
      <CheckoutForm />
    </div>
  )
}
