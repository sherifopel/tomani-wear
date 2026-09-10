'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import QuickShop from '@/components/QuickShop'
import { toTitleCase } from '@/lib/format'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  inStock?: boolean
  image?: string | null
  hoverImage?: string | null
  productType?: string | null
  sizes?: string[] | null
  shoeSizes?: string | null
}

const TYPE_LABELS: Record<string, string> = {
  hoodies:  'Hoodies',
  jackets:  'Jackets',
  joggers:  'Joggers',
  shirts:   'Shirts',
  shorts:   'Shorts',
  tops:     'Tops',
  trousers: 'Pants',
  dresses:  'Dresses',
  bags:     'Bags',
  hats:     'Hats',
  shoes:    'Shoes',
  belts:    'Belts',
}

export default function FilterableGrid({ products }: { products: Product[] }) {
  const [activeType, setActiveType] = useState<string | null>(null)

  const availableTypes = [...new Set(
    products.map(p => p.productType).filter((t): t is string => !!t && t in TYPE_LABELS)
  )]

  const filtered = activeType
    ? products.filter(p => p.productType === activeType)
    : products

  return (
    <>
      {availableTypes.length > 0 && (
        <div className="flex gap-6 pb-5 px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveType(null)}
            className={`text-[12px] leading-[12px] whitespace-nowrap transition-colors ${
              !activeType ? 'text-black border-b border-black pb-[2px]' : 'text-[#434343] hover:text-black'
            }`}
          >
            All
          </button>
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`text-[12px] leading-[12px] whitespace-nowrap transition-colors ${
                activeType === type ? 'text-black border-b border-black pb-[2px]' : 'text-[#434343] hover:text-black'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      )}

      <div className="pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
          {filtered.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`} className="group flex flex-col h-full bg-white border border-gray-100">
              <div className="relative aspect-[3/4] overflow-hidden">
                {p.image && (
                  <>
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={`object-cover object-top transition-opacity duration-300 ${p.hoverImage ? 'group-hover:opacity-0' : ''}`}
                    />
                    {p.hoverImage && (
                      <Image
                        src={p.hoverImage}
                        alt={`${p.name} alternate view`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
                <QuickShop
                  productId={p._id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                  inStock={p.inStock}
                  sizes={p.sizes}
                  shoeSizes={p.shoeSizes}
                />
              </div>
              <div className="flex flex-col flex-1 pt-2 px-3 pb-3">
                <p className="text-[13px] font-normal leading-[17px] text-black font-[family-name:var(--font-dm-sans)]">{toTitleCase(p.name)}</p>
                <p className="mt-auto pt-1 text-[12px] font-normal text-black">₦{p.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
