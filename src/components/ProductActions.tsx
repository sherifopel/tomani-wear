'use client'

import { useState } from 'react'
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
      : 'bg-black text-white border border-black btn-wipe'
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
  const { addItem, openMiniCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addItem({ productId, slug, name, price, image, colorName, size: selectedSize ?? '', quantity })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
    openMiniCart()
  }

  const QtySelect = () => (
    <select
      value={quantity}
      onChange={e => setQuantity(Number(e.target.value))}
      aria-label="Quantity"
      className="h-full border border-gray-300 px-3 text-sm bg-white shrink-0 cursor-pointer hover:border-black transition-colors duration-200 appearance-none pr-7"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  )

  return (
    <div className="space-y-4">

      {/* Size selector */}
      {sizes.length > 0 && (
        <div data-testid="pdp-size-selector" className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest mb-3 font-medium">
            Size {selectedSize && <span className="text-gray-400 normal-case tracking-normal font-normal">— {selectedSize}</span>}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => { setSelectedSize(size); setSizeError(false) }}
                data-testid={`pdp-size-${size}`}
                className={`w-12 h-12 text-xs font-medium border rounded-md transition-colors duration-200
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

      {/* Inline quantity + Add to Cart — desktop only */}
      <div className="hidden md:flex gap-3 h-14" data-testid="pdp-add-to-cart-row">
        <QtySelect />
        <button
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

      {/* Spacer so sticky bar never covers content below — mobile only */}
      <div className="h-20 md:hidden" aria-hidden />

      {/* Sticky bar — mobile only, always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-[99] md:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex gap-3 h-14">
          <QtySelect />
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

    </div>
  )
}
