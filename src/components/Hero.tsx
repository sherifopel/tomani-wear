'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

const IconPrev = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14 5 8 11 14 17" />
  </svg>
)

const IconNext = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 5 14 11 8 17" />
  </svg>
)

type HeroSlide = {
  id: string
  image: string
  label?: string
  heading: string
  sub?: string
  href: string
  mobileFocalY?: number
  tabletFocalY?: number
  desktopFocalY?: number
}

export default function Hero({
  slides = [],
  autoplay = true,
  showArrows = false,
}: {
  slides?: HeroSlide[]
  autoplay?: boolean
  showArrows?: boolean
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, watchDrag: false },
    autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
  )
  const canNavigate = showArrows && slides.length > 1

  return (
    <section
      data-testid="home-hero-section"
      className="relative w-full overflow-hidden snap-start shrink-0 h-[calc(100svh-5.25rem)] lg:h-auto lg:aspect-[1505/600] lg:mx-auto lg:max-w-[1505px]"
      ref={emblaRef}
    >
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div key={slide.id} className="flex-none w-full h-full relative">

            {/* Mobile — portrait crop */}
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              sizes="100vw"
              className="block object-cover md:hidden"
              style={{ objectPosition: `center ${slide.mobileFocalY ?? 50}%` }}
              priority={index === 0}
            />

            {/* Tablet — mid crop */}
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              sizes="100vw"
              className="hidden object-cover md:block lg:hidden"
              style={{ objectPosition: `center ${slide.tabletFocalY ?? 50}%` }}
              priority={index === 0}
            />

            {/* Desktop — landscape crop */}
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              sizes="1505px"
              className="hidden object-cover lg:block"
              style={{ objectPosition: `center ${slide.desktopFocalY ?? 30}%` }}
              priority={index === 0}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Text — bottom left */}
            <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-xl z-10">
              <p
                data-testid="home-hero-subtitle"
                className="text-xs uppercase tracking-widest mb-4 font-semibold text-[var(--brand-yellow)]"
              >
                {slide.label ?? 'New Drop'}
              </p>
              <h1
                data-testid="home-hero-heading"
                className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4 text-white whitespace-pre-line"
              >
                {slide.heading}
              </h1>
              <p
                data-testid="home-hero-description"
                className="text-zinc-300 mb-8 text-sm leading-relaxed"
              >
                {slide.sub}
              </p>
              <Link
                href={slide.href}
                data-testid="home-hero-cta-button"
                className="inline-block border border-white text-white px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-colors duration-300"
              >
                Shop Now
              </Link>
            </div>

          </div>
        ))}
      </div>

      {canNavigate && (
        <>
          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center border border-white/70 text-white bg-black/20 hover:bg-black/50 transition-colors"
          >
            <IconPrev />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center border border-white/70 text-white bg-black/20 hover:bg-black/50 transition-colors"
          >
            <IconNext />
          </button>
        </>
      )}
    </section>
  )
}
