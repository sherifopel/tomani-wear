'use client'

import Image from 'next/image'
import Link from 'next/link'
import QuickShop from '@/components/QuickShop'
import { toTitleCase } from '@/lib/format'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  image?: string
  hoverImage?: string
  category?: string
  sizes?: string[] | null
  shoeSizes?: string | null
}

export default function PLPCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full"
      data-testid={`plp-product-link-${product.slug}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden" data-testid="plp-product-image-wrapper">
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover object-top transition-opacity duration-300 ${product.hoverImage ? 'group-hover:opacity-0' : ''}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              data-testid="plp-product-image"
            />
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt={`${product.name} alternate view`}
                fill
                className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-[#f7f7f8]" data-testid="plp-product-image-placeholder" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!product.inStock && (
            <span className="text-[10px] tracking-wider bg-gray-800 text-white px-2 py-0.5" data-testid="plp-badge-sold-out">
              Sold Out
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[10px] tracking-wider bg-[var(--brand-red)] text-white px-2 py-0.5" data-testid="plp-badge-sale">
              Sale
            </span>
          )}
        </div>

        <QuickShop
          productId={product._id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          image={product.image}
          inStock={product.inStock}
          sizes={product.sizes}
          shoeSizes={product.shoeSizes}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 pt-2 px-3 pb-3" data-testid="plp-product-info">
        <p className="text-[13px] font-normal leading-[17px] text-black font-[family-name:var(--font-dm-sans)]" data-testid="plp-product-name">
          {toTitleCase(product.name)}
        </p>
        <div className="mt-auto pt-1">
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[rgb(173,165,165)] line-through" data-testid="plp-product-compare-price">₦{product.compareAtPrice.toLocaleString()}</span>
              <span className="text-[12px] font-normal text-[var(--brand-red)]" data-testid="plp-product-price">₦{product.price.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-[12px] font-normal text-black" data-testid="plp-product-price">₦{product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
