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
    <div className="relative h-full md:h-auto px-8 md:px-0">

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
        className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-black text-white items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
      >
        <IconPrev />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-black text-white items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
      >
        <IconNext />
      </button>

      {/* ── Carousel viewport ─────────────────────────────────────────── */}
      {/* h-full on mobile so embla fills the section height */}
      <div ref={emblaRef} className="overflow-hidden h-full md:h-auto">
        <div className="flex h-full md:h-auto gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              data-testid={`home-product-card-${product.id}`}
              // The fixed info height keeps every image frame the same size,
              // even when product names have different lengths.
              className="group flex-none w-full sm:w-[50%] md:w-[33%] h-full md:h-auto grid grid-rows-[minmax(0,1fr)_5.75rem] md:flex md:flex-col"
            >
              {/* Image area: flex-1 fills all space above the text on mobile.
                  min-h-0 lets Safari honour flex-1 in a deep h-full chain. */}
              <div className="relative min-h-0 md:flex-none md:aspect-[4/5] bg-white overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-contain p-2 transition-transform duration-500 md:object-cover md:p-0 md:group-hover:scale-105"
                />
              </div>
              <div className="min-h-0 shrink-0">
                <p
                  data-testid={`home-product-name-${product.id}`}
                  className="text-base font-medium overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {product.name}
                </p>
                <p
                  data-testid={`home-product-price-${product.id}`}
                  className="text-[28px] font-light tracking-widest text-gray-400 mt-1"
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
