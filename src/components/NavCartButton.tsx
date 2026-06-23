'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function NavCartButton() {
  const { totalItems, openMiniCart } = useCart()

  return (
    <div className="relative">
      <button
        data-testid="nav-cart-button"
        aria-label={`Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
        onClick={openMiniCart}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
      >
        <ShoppingBag className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.5} />
      </button>
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
