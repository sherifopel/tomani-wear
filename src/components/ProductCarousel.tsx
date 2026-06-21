'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
        <ChevronLeft size={20} strokeWidth={1} />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="md:hidden absolute right-0 top-[40%] -translate-y-1/2 flex items-center justify-center w-8 h-8 text-black z-10"
      >
        <ChevronRight size={20} strokeWidth={1} />
      </button>

      {/* ── Desktop arrows ────────────────────────────────────────────── */}
      <button
        data-testid="home-carousel-prev-button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous"
        className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-black text-white items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        data-testid="home-carousel-next-button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next"
        className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 bg-black text-white items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
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
              // On mobile: h-full + flex-col so the image grows, title/price pin to bottom.
              // On desktop: normal block with fixed aspect-square image.
              className="group flex-none w-full sm:w-[50%] md:w-[33%] h-full md:h-auto flex flex-col md:block"
            >
              {/* Image area: flex-1 fills all space above the text on mobile.
                  min-h-0 lets Safari honour flex-1 in a deep h-full chain. */}
              <div className="relative flex-1 min-h-0 md:flex-none md:aspect-square bg-gray-50 overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="eager"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-medium shrink-0">{product.name}</p>
              <p className="text-sm text-gray-400 mt-0.5 shrink-0">
                ₦{product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
