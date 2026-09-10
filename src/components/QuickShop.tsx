'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/hooks/useCart'

type Props = {
  productId: string
  slug: string
  name: string
  price: number
  image?: string | null
  inStock?: boolean
  sizes?: string[] | null
  shoeSizes?: string | null
}

export default function QuickShop({
  productId, slug, name, price, image, inStock, sizes, shoeSizes,
}: Props) {
  const { addItem, openMiniCart } = useCart()
  const [sizesOpen, setSizesOpen] = useState(false)
  const [added, setAdded] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sizesOpen) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setSizesOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sizesOpen])

  if (inStock === false) return null

  const allSizes: string[] = [
    ...(sizes ?? []),
    ...(shoeSizes ? shoeSizes.split(',').map(s => s.trim()).filter(Boolean) : []),
  ]

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (allSizes.length === 0) {
      addItem({ productId, slug, name, price, image: image ?? undefined, size: 'One Size', quantity: 1 })
      openMiniCart()
    } else {
      setSizesOpen(prev => !prev)
    }
  }

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId, slug, name, price, image: image ?? undefined, size, quantity: 1 })
    setAdded(size)
    openMiniCart()
    setTimeout(() => { setAdded(null); setSizesOpen(false) }, 1200)
  }

  return (
    <div ref={ref}>
      {/* "+" CTA — bottom-right corner, appears on card hover */}
      {!sizesOpen && (
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <button
            onClick={handleAddToCartClick}
            aria-label="Quick add to cart"
            className="
              pointer-events-auto
              w-8 h-8 flex items-center justify-center
              rounded-sm border shadow-md font-light text-lg leading-none
              bg-white text-black border-gray-200
              hover:bg-black hover:text-white hover:border-black
              visible opacity-100 scale-100
              md:invisible md:opacity-0 md:scale-90
              md:group-hover:visible md:group-hover:opacity-100 md:group-hover:scale-100
              transition-all duration-150
            "
          >
            +
          </button>
        </div>
      )}

      {/* Size list — left-aligned, appears after clicking "Add to Cart" */}
      {sizesOpen && (
        <div className="absolute bottom-4 left-2 z-20 flex flex-col gap-1.5">
          {allSizes.map(size => (
            <button
              key={size}
              onClick={(e) => handleSizeClick(e, size)}
              className={`block px-2 py-1 text-[8px] rounded border shadow-sm
                         transition-all duration-150 whitespace-nowrap font-semibold
                         ${added === size
                           ? 'bg-black text-white border-black'
                           : 'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black hover:shadow-md'
                         }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
