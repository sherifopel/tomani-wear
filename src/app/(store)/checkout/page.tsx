'use client'

import dynamic from 'next/dynamic'
import Breadcrumbs from '@/components/Breadcrumbs'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout' },
]

// react-paystack accesses `window` at module load time — SSR crashes without this.
// Must be in a Client Component (Turbopack does not allow ssr:false in Server Components).
// Importing from a SEPARATE file is critical: dynamic(Promise.resolve(localFn)) does
// NOT prevent the current module from being evaluated server-side.
const CheckoutForm = dynamic(() => import('./CheckoutForm'), { ssr: false })

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 lg:pb-16 pt-4" data-testid="checkout-page">
      <Breadcrumbs crumbs={CRUMBS} testId="checkout-breadcrumb" />
      <CheckoutForm />
    </div>
  )
}
