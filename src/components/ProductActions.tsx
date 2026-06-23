'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/hooks/useCart'

type Props = {
  productId: string
  slug: string
  name: string
  price: number
  image?: string
  colorName?: string
  sizes: string[]
  inStock: boolean
}

const btnClass = (inStock: boolean, justAdded: boolean) =>
  `flex-1 py-4 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
    !inStock
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : justAdded
      ? 'bg-[var(--brand-yellow)] text-black'
      : 'bg-black text-white btn-collision'
  }`

const btnLabel = (inStock: boolean, justAdded: boolean) =>
  !inStock ? 'Sold Out' : justAdded ? 'Added ✓' : 'Add to Cart'

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
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const mainBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = mainBtnRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addItem({ productId, slug, name, price, image, colorName, size: selectedSize ?? '', quantity })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const Stepper = () => (
    <div className="flex items-center border border-gray-300 h-full shrink-0">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQuantity(q => Math.max(1, q - 1))}
        className="px-2 h-full text-base leading-none hover:bg-gray-50 transition-colors"
      >
        −
      </button>
      <span className="px-2 text-sm font-medium w-6 text-center">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQuantity(q => Math.min(10, q + 1))}
        className="px-2 h-full text-base leading-none hover:bg-gray-50 transition-colors"
      >
        +
      </button>
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Size selector */}
      {sizes.length > 0 && (
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

      {/* Quantity + Add to Cart row */}
      <div className="flex gap-3 h-14" data-testid="pdp-add-to-cart-row">
        <Stepper />
        <button
          ref={mainBtnRef}
          onClick={handleAddToCart}
          disabled={!inStock}
          data-testid="pdp-add-to-cart"
          className={btnClass(inStock, justAdded)}
        >
          {btnLabel(inStock, justAdded)}
        </button>
      </div>

      {sizeError && (
        <p className="text-xs text-red-500 -mt-2" data-testid="pdp-size-error">
          Please select a size first
        </p>
      )}

      {/* Spacer so sticky bar never covers content below */}
      {showSticky && <div className="h-20 md:hidden" aria-hidden />}

      {/* Sticky bar — mobile only, appears when main button scrolls out of view */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-[99] md:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="flex gap-3 h-14">
            <Stepper />
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              data-testid="pdp-sticky-add-to-cart"
              className={btnClass(inStock, justAdded)}
            >
              {btnLabel(inStock, justAdded)}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
