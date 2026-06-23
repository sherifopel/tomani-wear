'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductActions from '@/components/ProductActions'

export type GalleryImage = {
  url: string
  hotspot?: { x: number; y: number }
}

export type ColorOption = {
  colorName: string
  colorHex?: string
}

type Props = {
  productId: string
  slug: string
  mainImage?: string
  gallery?: GalleryImage[]
  colors?: ColorOption[]
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

const IconPrev = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 4 7 10 13 16" />
  </svg>
)

const IconNext = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 4 13 10 7 16" />
  </svg>
)

const IconZoomIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
)

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function ProductInteractive({
  productId,
  slug,
  mainImage,
  gallery,
  colors,
  sizes,
  inStock,
  onSale,
  compareAtPrice,
  name,
  price,
  category,
  description,
}: Props) {
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const hasColors = colors && colors.length > 0

  const allImages: GalleryImage[] = [
    ...(mainImage ? [{ url: mainImage }] : []),
    ...(gallery ?? []),
  ]

  const currentImage = allImages[activeImageIndex] ?? null
  const activeSizes: string[] = sizes ?? []

  const gotoPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveImageIndex(i => (i - 1 + allImages.length) % allImages.length)
  }
  const gotoNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveImageIndex(i => (i + 1) % allImages.length)
  }

  const priceBlock = (
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
  )

  return (
    <>
      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {isZoomed && currentImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <button
            aria-label="Close zoom"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <IconClose />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={gotoPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 transition-colors z-10"
              >
                <IconPrev />
              </button>
              <button
                aria-label="Next image"
                onClick={gotoNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 transition-colors z-10"
              >
                <IconNext />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-2xl mx-8 aspect-[3/4]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      )}

      <div className="md:grid md:grid-cols-2 md:gap-16 md:items-start">

        {/* ── Mobile-only: name + price above the image ─────────────────────── */}
        <div className="md:hidden mb-4">
          <h1 className="text-2xl font-light tracking-wide" data-testid="pdp-name">
            {name}
          </h1>
          <div className="mt-2">{priceBlock}</div>
        </div>

        {/* ── LEFT: image gallery ───────────────────────────────────────────── */}
        <div data-testid="pdp-gallery">
          {/* Main image with arrows + zoom button */}
          <div
            className="relative aspect-[3/4] bg-gray-50 cursor-zoom-in"
            data-testid="pdp-main-image"
            onClick={() => setIsZoomed(true)}
          >
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
                className="absolute top-4 left-4 bg-[var(--brand-red)] text-white text-[10px] uppercase tracking-widest px-2 py-1 z-10"
                data-testid="pdp-sale-badge"
              >
                Sale
              </span>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 bg-white/80 p-1.5 z-10 pointer-events-none">
              <IconZoomIn />
            </div>

            {/* Gallery arrows — only shown when there are multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  data-testid="pdp-gallery-prev"
                  onClick={gotoPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 transition-colors"
                >
                  <IconPrev />
                </button>
                <button
                  aria-label="Next image"
                  data-testid="pdp-gallery-next"
                  onClick={gotoNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 transition-colors"
                >
                  <IconNext />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
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

        {/* ── RIGHT: product details ────────────────────────────────────────── */}
        <div className="space-y-6 md:pt-4 mt-8 md:mt-0">

          {/* Category — desktop only */}
          {category && (
            <p className="hidden md:block text-xs uppercase tracking-widest text-gray-400" data-testid="pdp-category">
              {category}
            </p>
          )}

          {/* Name — desktop only (mobile version is above the image) */}
          <h1 className="hidden md:block text-2xl font-light tracking-wide" data-testid="pdp-name-desktop">
            {name}
          </h1>

          {/* Price — desktop only */}
          <div className="hidden md:flex">{priceBlock}</div>

          <div className="border-t border-gray-100" />

          {/* Colour swatches */}
          {hasColors && (
            <div data-testid="pdp-colour-swatches">
              <p className="text-xs uppercase tracking-widest mb-3 font-medium" data-testid="pdp-colour-label">
                Colour
                {activeColorIndex !== null && (
                  <span className="text-gray-400 normal-case tracking-normal font-normal ml-1">
                    — {colors![activeColorIndex].colorName}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                {colors!.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColorIndex(i)}
                    data-testid={`pdp-colour-swatch-${slugify(color.colorName)}`}
                    title={color.colorName}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-150 ${
                      i === activeColorIndex
                        ? 'border-black ring-2 ring-offset-2 ring-black'
                        : 'border-transparent hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.colorHex ?? '#D1D5DB' }}
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
            colorName={activeColorIndex !== null ? colors![activeColorIndex].colorName : undefined}
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
    </>
  )
}
