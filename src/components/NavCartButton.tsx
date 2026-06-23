'use client'

// This tiny component exists solely so the server-rendered Navbar can show a
// live cart count. Navbar itself is a server component (it fetches from Sanity),
// so it can't call React hooks directly. We pull the count out into this
// client component and drop it in.

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function NavCartButton() {
  const { totalItems } = useCart()

  return (
    // Outer div is the positioning parent for the badge so it sits outside
    // the link's overflow:hidden (added by nav-icon-fill).
    <div className="relative">
      <Link
        href="/cart"
        data-testid="nav-cart-button"
        aria-label={`Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
        className="nav-icon-fill p-1.5 block"
      >
        <ShoppingBag className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.5} />
      </Link>
      {totalItems > 0 && (
        <span
          data-testid="nav-cart-count"
          className="absolute -top-1 -right-1 bg-[var(--brand-red)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center pointer-events-none"
        >
          {totalItems}
        </span>
      )}
    </div>
  )
}
