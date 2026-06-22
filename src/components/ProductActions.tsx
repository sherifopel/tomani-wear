'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

type Props = {
  // Product identity — needed to build the CartItem
  productId: string
  slug: string
  name: string
  price: number
  image?: string
  colorName?: string
  // What the current variant/product offers
  sizes: string[]
  inStock: boolean
}

export default function ProductActions({
  productId,
  slug,
  name,
  price,
  image,
  colorName,
  sizes,
  inStock,
}: Props) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addItem({ productId, slug, name, price, image, colorName, size: selectedSize, quantity: 1 })
    // Brief "✓ Added" feedback on the button, then reset
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="space-y-4">

      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div data-testid="pdp-size-selector">
          <p className="text-xs uppercase tracking-widest mb-3 font-medium">
            Size {selectedSize && <span className="text-gray-400 normal-case tracking-normal font-normal">— {selectedSize}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => { setSelectedSize(size); setSizeError(false) }}
                data-testid={`pdp-size-${size}`}
                className={`w-12 h-12 text-xs font-medium border transition-colors duration-200
                  ${selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock}
        data-testid="pdp-add-to-cart"
        className={`w-full py-4 text-xs uppercase tracking-widest font-medium transition-colors duration-200
          ${!inStock
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : justAdded
            ? 'bg-[var(--brand-yellow)] text-black'
            : 'bg-black text-white hover:bg-gray-900'
          }`}
      >
        {!inStock ? 'Sold Out' : justAdded ? '✓ Added' : 'Add to Cart'}
      </button>

      {/* Inline error when no size selected */}
      {sizeError && (
        <p
          className="text-xs text-red-500 -mt-2"
          data-testid="pdp-size-error"
        >
          Please select a size first
        </p>
      )}

    </div>
  )
}
