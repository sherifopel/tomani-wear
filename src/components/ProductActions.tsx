'use client'

import { useState } from 'react'

type Props = {
  sizes: string[]
  inStock: boolean
}

export default function ProductActions({ sizes, inStock }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className="space-y-6">

      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest mb-3 font-medium">
            Size {selectedSize && <span className="text-gray-400 normal-case tracking-normal font-normal">— {selectedSize}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
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
        disabled={!inStock}
        className={`w-full py-4 text-xs uppercase tracking-widest font-medium transition-colors duration-200
          ${inStock
            ? 'bg-black text-white hover:bg-gray-900'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
      >
        {inStock ? 'Add to Cart' : 'Sold Out'}
      </button>

    </div>
  )
}
