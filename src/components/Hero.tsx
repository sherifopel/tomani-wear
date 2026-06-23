'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

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

// Full static strings so Tailwind includes them in the bundle
const BUTTON_CLASSES: Record<string, string> = {
  white: 'border-white text-white hover:bg-white hover:text-black',
  black: 'border-black text-black hover:bg-black hover:text-white',
  gold:  'border-[var(--brand-yellow)] text-[var(--brand-yellow)] hover:bg-[var(--brand-yellow)] hover:text-black',
}

const BUTTON_COLORS: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  gold:  '#FFD700',
}

type HeroSlide = {
  id: string
  imageMobile:   string
  imageTablet:   string
  imageDesktop:  string
  imageXl:       string
  mobileFocalY:  number
  tabletFocalY:  number
  desktopFocalY: number
  xlFocalY:      number
  mobileFocalX:  number
  tabletFocalX:  number
  desktopFocalX: number
  xlFocalX:      number
  label?: string
  heading: string
  sub?: string
  href?: string
  textPosition:         number
  textPositionX:        number
  mobileTextPosition:   number
  mobileTextPositionX:  number
  tabletTextPosition:   number
  tabletTextPositionX:  number
  desktopTextPosition:  number
  desktopTextPositionX: number
  xlTextPosition:       number
  xlTextPositionX:      number
  textColor: 'white' | 'black'
  buttonColor: 'white' | 'black' | 'gold'
  buttonCustomColor?: string
  buttonBackgroundColor?: string
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
        {slides.map((slide, index) => {
          const textColor = slide.textColor === 'black' ? '#000' : '#fff'
          const btnClasses = BUTTON_CLASSES[slide.buttonColor] ?? BUTTON_CLASSES.white
          const hasCustomButtonColor = Boolean(slide.buttonCustomColor || slide.buttonBackgroundColor)
          const fallbackButtonColor = BUTTON_COLORS[slide.buttonColor] ?? BUTTON_COLORS.white
          const buttonStyle = hasCustomButtonColor
            ? {
                color: slide.buttonCustomColor || fallbackButtonColor,
                borderColor: slide.buttonCustomColor || fallbackButtonColor,
                backgroundColor: slide.buttonBackgroundColor || 'transparent',
              }
            : undefined
          const textPositionStyle = {
            '--hero-mobile-y':  `${slide.mobileTextPosition}%`,
            '--hero-mobile-x':  `${slide.mobileTextPositionX}%`,
            '--hero-tablet-y':  `${slide.tabletTextPosition}%`,
            '--hero-tablet-x':  `${slide.tabletTextPositionX}%`,
            '--hero-desktop-y': `${slide.desktopTextPosition}%`,
            '--hero-desktop-x': `${slide.desktopTextPositionX}%`,
            '--hero-xl-y':      `${slide.xlTextPosition}%`,
            '--hero-xl-x':      `${slide.xlTextPositionX}%`,
          } as CSSProperties

          return (
            <div key={slide.id} className="flex-none w-full h-full relative">

              {/* Mobile image */}
              <Image
                src={slide.imageMobile}
                alt={slide.heading}
                fill
                sizes="100vw"
                className="block object-cover md:hidden"
                style={{ objectPosition: `${slide.mobileFocalX}% ${slide.mobileFocalY}%` }}
                priority={index === 0}
              />

              {/* Tablet image */}
              <Image
                src={slide.imageTablet}
                alt={slide.heading}
                fill
                sizes="100vw"
                className="hidden object-cover md:block lg:hidden"
                style={{ objectPosition: `${slide.tabletFocalX}% ${slide.tabletFocalY}%` }}
                priority={index === 0}
              />

              {/* Desktop image */}
              <Image
                src={slide.imageDesktop}
                alt={slide.heading}
                fill
                sizes="1505px"
                className="hidden object-cover lg:block xl:hidden"
                style={{ objectPosition: `${slide.desktopFocalX}% ${slide.desktopFocalY}%` }}
                priority={index === 0}
              />

              {/* Extra Large image */}
              <Image
                src={slide.imageXl}
                alt={slide.heading}
                fill
                sizes="1920px"
                className="hidden object-cover xl:block"
                style={{ objectPosition: `${slide.xlFocalX}% ${slide.xlFocalY}%` }}
                priority={index === 0}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Text overlay — vertical + horizontal position from CMS */}
              <div
                className="
                  hero-copy absolute z-10 max-w-xl p-6 md:p-16
                  top-[var(--hero-mobile-y)] left-[var(--hero-mobile-x)]
                  -translate-y-full translate-x-[calc(-1*var(--hero-mobile-x))]
                  md:top-[var(--hero-tablet-y)] md:left-[var(--hero-tablet-x)]
                  md:translate-x-[calc(-1*var(--hero-tablet-x))]
                  lg:top-[var(--hero-desktop-y)] lg:left-[var(--hero-desktop-x)]
                  lg:translate-x-[calc(-1*var(--hero-desktop-x))]
                  xl:top-[var(--hero-xl-y)] xl:left-[var(--hero-xl-x)]
                  xl:translate-x-[calc(-1*var(--hero-xl-x))]
                "
                style={textPositionStyle}
              >
                {slide.label && (
                  <p
                    data-testid="home-hero-subtitle"
                    className="text-xs uppercase tracking-widest mb-4 font-semibold text-[var(--brand-yellow)]"
                  >
                    {slide.label}
                  </p>
                )}
                <h1
                  data-testid="home-hero-heading"
                  className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4 whitespace-pre-line"
                  style={{ color: textColor }}
                >
                  {slide.heading}
                </h1>
                {slide.sub && (
                  <p
                    data-testid="home-hero-description"
                    className="mb-8 text-sm leading-relaxed"
                    style={{ color: textColor, opacity: 0.85 }}
                  >
                    {slide.sub}
                  </p>
                )}
                {slide.href && (
                  <Link
                    href={slide.href}
                    data-testid="home-hero-cta-button"
                    className={`inline-block border px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${hasCustomButtonColor ? '' : btnClasses}`}
                    style={buttonStyle}
                  >
                    Shop Now
                  </Link>
                )}
              </div>

            </div>
          )
        })}
      </div>

      {canNavigate && (
        <>
          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={() => emblaApi?.scrollPrev()}
            data-testid="home-carousel-prev-button"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center border border-white/70 text-white bg-black/20 hover:bg-black/50 transition-colors"
          >
            <IconPrev />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => emblaApi?.scrollNext()}
            data-testid="home-carousel-next-button"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center border border-white/70 text-white bg-black/20 hover:bg-black/50 transition-colors"
          >
            <IconNext />
          </button>
        </>
      )}
    </section>
  )
}
