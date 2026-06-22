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
    <Link
      href="/cart"
      data-testid="nav-cart-button"
      aria-label={`Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
      className="relative transition-transform duration-200 hover:scale-125 active:scale-95"
    >
      <ShoppingBag className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.5} />
      {totalItems > 0 && (
        <span
          data-testid="nav-cart-count"
          className="absolute -top-1 -right-1 bg-[var(--brand-red)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
        >
          {totalItems}
        </span>
      )}
    </Link>
  )
}
