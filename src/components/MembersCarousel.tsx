'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock } from 'lucide-react'

type CarouselProduct = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  inStock?: boolean
  image?: string | null
}

type Props = {
  title: string
  products: CarouselProduct[]
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

export default function MembersCarousel({ title, products }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 1, loop: true })

  if (!products.length) return null

  return (
    <section
      data-testid="members-carousel-section"
      className="py-12 md:py-16 bg-[#0a0a0a] text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock size={14} strokeWidth={1.5} className="text-[var(--brand-yellow)]" />
          <h2
            data-testid="members-carousel-title"
            className="text-xs uppercase tracking-[0.25em] text-[var(--brand-yellow)]"
          >
            {title}
          </h2>
          <Lock size={14} strokeWidth={1.5} className="text-[var(--brand-yellow)]" />
        </div>

        {/* Carousel */}
        <div className="relative px-8 md:px-0">
          <button
            data-testid="members-carousel-prev"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous"
            className="md:hidden absolute left-0 top-[40%] -translate-y-1/2 flex items-center justify-center w-8 h-8 text-white z-10"
          >
            <IconPrev />
          </button>
          <button
            data-testid="members-carousel-next"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next"
            className="md:hidden absolute right-0 top-[40%] -translate-y-1/2 flex items-center justify-center w-8 h-8 text-white z-10"
          >
            <IconNext />
          </button>

          <button
            data-testid="members-carousel-prev"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous"
            className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 z-10 bg-white/10 border border-white/20 text-white items-center justify-center rounded hover:bg-white hover:text-black transition-colors duration-300"
          >
            <IconPrev />
          </button>
          <button
            data-testid="members-carousel-next"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next"
            className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 z-10 bg-white/10 border border-white/20 text-white items-center justify-center rounded hover:bg-white hover:text-black transition-colors duration-300"
          >
            <IconNext />
          </button>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  data-testid={`members-carousel-card-${product._id}`}
                  className="group flex-none w-full sm:w-[50%] md:w-[33%] flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden mb-3 rounded-md">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs uppercase tracking-widest">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-center">
                    <p
                      data-testid={`members-carousel-name-${product._id}`}
                      className="text-sm font-light leading-5 text-white overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {product.name}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <p
                        data-testid={`members-carousel-price-${product._id}`}
                        className="text-base font-normal text-[var(--brand-yellow)]"
                      >
                        ₦{product.price.toLocaleString()}
                      </p>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <p className="text-sm text-neutral-500 line-through">
                          ₦{product.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
