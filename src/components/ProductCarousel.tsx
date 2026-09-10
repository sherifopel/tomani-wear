'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import QuickShop from '@/components/QuickShop'
import { toTitleCase } from '@/lib/format'
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

type Product = {
  id: number
  productId?: string
  name: string
  price: number
  image: string
  hoverImage?: string
  href: string
  slug?: string
  inStock?: boolean
  sizes?: string[] | null
  shoeSizes?: string | null
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', slidesToScroll: 1, loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  return (
    // On mobile: h-full threads height down from the flex-1 section wrapper.
    // px-8 keeps 32px gutters on each side for the arrow buttons.
    // On desktop: back to normal flow (h-auto).
    <div className="relative px-8 md:px-0">

      {/* ── Mobile arrows ─────────────────────────────────────────────────
          Absolutely positioned in the px-8 gutters, vertically centred
          at 40% of the card height — sits within the image area regardless
          of how tall the card grows. */}
      <button
        data-testid="home-carousel-prev-button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous"
        className="md:hidden absolute left-0 top-[40%] -translate-y-1/2 flex items-center justify-center w-8 h-8 text-black z-10"
      >
        <IconPrev />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="md:hidden absolute right-0 top-[40%] -translate-y-1/2 flex items-center justify-center w-8 h-8 text-black z-10"
      >
        <IconNext />
      </button>

      {/* ── Desktop arrows ────────────────────────────────────────────── */}
      <button
        data-testid="home-carousel-prev-button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous"
        className="hidden md:flex absolute left-0 top-1/3 -translate-y-1/2 w-10 h-10 z-10 bg-white border border-gray-300 text-gray-800 items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
      >
        <IconPrev />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 w-10 h-10 z-10 bg-white border border-gray-300 text-gray-800 items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
      >
        <IconNext />
      </button>

      {/* ── Carousel viewport ─────────────────────────────────────────── */}
      {/* h-full on mobile so embla fills the section height */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              data-testid={`home-product-card-${product.id}`}
              className="group flex-none w-full sm:w-[50%] md:w-[33%] lg:w-[19%] flex flex-col border border-gray-100"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className={`object-cover object-top transition-opacity duration-300 ${product.hoverImage ? 'group-hover:opacity-0' : ''}`}
                />
                {product.hoverImage && (
                  <Image
                    src={product.hoverImage}
                    alt={`${product.name} alternate view`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                )}
                <QuickShop
                  productId={product.productId ?? String(product.id)}
                  slug={product.slug ?? String(product.id)}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  inStock={product.inStock}
                  sizes={product.sizes}
                  shoeSizes={product.shoeSizes}
                />
              </div>
              <div className="shrink-0 pt-2 px-3 pb-3">
                <p
                  data-testid={`home-product-name-${product.id}`}
                  className="text-[13px] font-normal leading-[17px] text-black font-[family-name:var(--font-dm-sans)]"
                >
                  {toTitleCase(product.name)}
                </p>
                <p
                  data-testid={`home-product-price-${product.id}`}
                  className="mt-1 text-[12px] font-normal text-black"
                >
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
