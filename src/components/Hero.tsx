'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type HeroSlide = {
  id: string
  smallImage?: string
  mediumImage?: string
  largeImage?: string
  extraLargeImage?: string
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
  const heroSlides = slides
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, watchDrag: false },
    autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
  )
  const canNavigate = showArrows && heroSlides.length > 1

  return (
    <section
      data-testid="home-hero-section"
      className="relative w-full overflow-hidden snap-start shrink-0 h-[calc(100svh-5.25rem)] lg:h-auto lg:aspect-[1505/600] lg:mx-auto lg:max-w-[1505px]"
      ref={emblaRef}
    >
      <div className="flex h-full">
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className="flex-none w-full h-full relative">
            {(() => {
              const largeImage = slide.largeImage ?? ''
              const smallImage = slide.smallImage ?? largeImage
              const mediumImage = slide.mediumImage ?? smallImage
              const extraLargeImage = slide.extraLargeImage ?? largeImage

              const mobileObjectPosition  = `center ${slide.mobileFocalY  ?? 50}%`
              const tabletObjectPosition  = `center ${slide.tabletFocalY  ?? 50}%`
              const desktopObjectPosition = `center ${slide.desktopFocalY ?? 30}%`

              return (
                <>
                  {/* Mobile: full viewport height, focal point from Sanity */}
                  <Image
                    src={smallImage}
                    alt={slide.heading}
                    fill
                    sizes="100vw"
                    className="block object-cover md:hidden"
                    style={{ objectPosition: mobileObjectPosition }}
                    priority={index === 0}
                  />

                  {/* Tablet: full viewport height, focal point from Sanity */}
                  <Image
                    src={mediumImage}
                    alt={slide.heading}
                    fill
                    sizes="100vw"
                    className="hidden object-cover md:block lg:hidden"
                    style={{ objectPosition: tabletObjectPosition }}
                    priority={index === 0}
                  />

                  {/* Desktop: focal point controlled per-slide from Sanity */}
                  <Image
                    src={largeImage}
                    alt={slide.heading}
                    fill
                    sizes="1505px"
                    className="hidden object-cover lg:block 2xl:hidden"
                    style={{ objectPosition: desktopObjectPosition }}
                    priority={index === 0}
                  />

                  {/* XL: focal point controlled per-slide from Sanity */}
                  <Image
                    src={extraLargeImage}
                    alt={slide.heading}
                    fill
                    sizes="1505px"
                    className="hidden object-cover 2xl:block"
                    style={{ objectPosition: desktopObjectPosition }}
                    priority={index === 0}
                  />
                </>
              )
            })()}

            {/* Dark gradient overlay — fades from transparent at top to black at bottom */}
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
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center border border-white/70 text-white bg-black/20 hover:bg-black/50 transition-colors"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}
    </section>
  )
}
