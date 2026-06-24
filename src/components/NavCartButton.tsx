'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function NavCartButton() {
  const { totalItems, openMiniCart } = useCart()

  const icon = <ShoppingBag className="h-[18px] w-[18px] md:h-5 md:w-5 text-black" strokeWidth={1.5} />
  const badge = totalItems > 0 && (
    <span
      data-testid="nav-cart-count"
      className="absolute -top-1 -right-1 bg-[var(--brand-red)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center pointer-events-none"
    >
      {totalItems}
    </span>
  )

  return (
    <div className="relative">
      {/* Mobile → go to cart page */}
      <Link
        href="/cart"
        data-testid="nav-cart-button"
        aria-label={`Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
        className="md:hidden p-1.5 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center"
      >
        {icon}
      </Link>

      {/* Desktop → open mini cart drawer */}
      <button
        data-testid="nav-cart-button"
        aria-label={`Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
        onClick={openMiniCart}
        className="hidden md:flex p-1.5 rounded hover:bg-gray-100 transition-colors duration-200 items-center"
      >
        {icon}
      </button>

      {badge}
    </div>
  )
}
