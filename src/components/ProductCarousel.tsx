'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
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
  name: string
  price: number
  image: string
  href: string
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
        className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-white border border-gray-300 text-gray-800 items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
      >
        <IconPrev />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-white border border-gray-300 text-gray-800 items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
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
              className="group flex-none w-full sm:w-[50%] md:w-[33%] flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-white overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-contain p-2 transition-transform duration-500 md:object-cover md:p-0 md:group-hover:scale-105"
                />
              </div>
              <div className="shrink-0 text-center">
                <p
                  data-testid={`home-product-name-${product.id}`}
                  className="text-base font-light leading-5 text-black overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {product.name}
                </p>
                <p
                  data-testid={`home-product-price-${product.id}`}
                  className="mt-1 text-[18px] font-normal leading-[27px] text-black"
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
