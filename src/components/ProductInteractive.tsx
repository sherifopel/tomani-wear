'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductActions from '@/components/ProductActions'

export type GalleryImage = {
  url: string
  hotspot?: { x: number; y: number }
}

export type Variant = {
  colorName: string
  colorHex?: string
  images: GalleryImage[]
  sizes: string[]
}

type Props = {
  productId: string
  slug: string
  mainImage?: string
  gallery?: GalleryImage[]
  variants?: Variant[]
  sizes?: string[]
  inStock: boolean
  onSale: boolean
  compareAtPrice?: number
  name: string
  price: number
  category?: string
  description?: string
}

function objectPosition(hotspot?: { x: number; y: number }): string {
  return hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : 'center center'
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-')
}

export default function ProductInteractive({
  productId,
  slug,
  mainImage,
  gallery,
  variants,
  sizes,
  inStock,
  onSale,
  compareAtPrice,
  name,
  price,
  category,
  description,
}: Props) {
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const hasVariants = variants && variants.length > 0

  const baseImages: GalleryImage[] = [
    ...(mainImage ? [{ url: mainImage }] : []),
    ...(gallery ?? []),
  ]

  // Determine which images to show
  const activeImages: GalleryImage[] =
    activeVariantIndex !== null && hasVariants
      ? variants![activeVariantIndex].images
      : baseImages

  // Determine which sizes to show
  const activeSizes: string[] =
    activeVariantIndex !== null && hasVariants
      ? variants![activeVariantIndex].sizes
      : sizes ?? []

  const currentImage = activeImages[activeImageIndex] ?? null

  function handleSwatchClick(index: number) {
    setActiveVariantIndex(index)
    setActiveImageIndex(0)
  }

  return (
    <div className="md:grid md:grid-cols-2 md:gap-16 md:items-start">
      {/* LEFT: image gallery */}
      <div data-testid="pdp-gallery">
        {/* Main image */}
        <div className="relative aspect-[3/4] bg-gray-50" data-testid="pdp-main-image">
          {currentImage && (
            <Image
              src={currentImage.url}
              alt={name}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: objectPosition(currentImage.hotspot) }}
            />
          )}
          {onSale && (
            <span
              className="absolute top-4 left-4 bg-[var(--brand-red)] text-white text-[10px] uppercase tracking-widest px-2 py-1"
              data-testid="pdp-sale-badge"
            >
              Sale
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {activeImages.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {activeImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                data-testid={`pdp-thumbnail-${i}`}
                className={`relative w-20 h-20 shrink-0 border-2 transition-colors duration-150 cursor-pointer ${
                  i === activeImageIndex
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectPosition: objectPosition(img.hotspot) }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: product details */}
      <div className="space-y-6 md:pt-4 mt-8 md:mt-0">
        {/* Category */}
        {category && (
          <p className="text-xs uppercase tracking-widest text-gray-400" data-testid="pdp-category">
            {category}
          </p>
        )}

        {/* Name */}
        <h1 className="text-2xl font-light tracking-wide" data-testid="pdp-name">
          {name}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3" data-testid="pdp-price-row">
          <span
            className={`text-lg font-medium ${onSale ? 'text-[var(--brand-red)]' : ''}`}
            data-testid="pdp-price"
          >
            ₦{price.toLocaleString()}
          </span>
          {onSale && compareAtPrice && (
            <span className="text-sm text-gray-400 line-through" data-testid="pdp-compare-price">
              ₦{compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="border-t border-gray-100" />

        {/* Colour swatches */}
        {hasVariants && (
          <div data-testid="pdp-colour-swatches">
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" data-testid="pdp-colour-label">
              Colour
              {activeVariantIndex !== null && (
                <span className="text-gray-400 normal-case tracking-normal font-normal ml-1">
                  — {variants![activeVariantIndex].colorName}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {variants!.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => handleSwatchClick(i)}
                  data-testid={`pdp-colour-swatch-${slugify(variant.colorName)}`}
                  title={variant.colorName}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-150 ${
                    i === activeVariantIndex
                      ? 'border-black ring-2 ring-offset-2 ring-black'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: variant.colorHex ?? '#D1D5DB' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector + Add to cart */}
        <ProductActions
          productId={productId}
          slug={slug}
          name={name}
          price={price}
          image={currentImage?.url ?? mainImage}
          colorName={activeVariantIndex !== null ? variants![activeVariantIndex].colorName : undefined}
          sizes={activeSizes}
          inStock={inStock}
        />

        <div className="border-t border-gray-100" />

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed" data-testid="pdp-description">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
