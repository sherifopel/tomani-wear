'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

type HeroSlide = {
  id: string
  image: string
  position: string
  label?: string
  heading: string
  sub?: string
  href: string
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 'fallback-1',
    image: '/images/gallary/brian-lundquist-kIdngZOEnnQ-unsplash.jpg',
    position: 'center 20%',
    label: 'New Drop',
    heading: 'Built\nDifferent.',
    sub: 'Premium streetwear. Lagos originals.',
    href: '/products',
  },
  {
    id: 'fallback-2',
    image: '/images/gallary/anthony-a-eT-ORmDdFgE-unsplash.jpg',
    position: 'center 30%',
    label: 'New Collection',
    heading: 'Wear What\nYou Are.',
    sub: 'For the modern African. Worn everywhere.',
    href: '/products',
  },
  {
    id: 'fallback-3',
    image: '/images/gallary/minh-dang-diEOBpC-o1A-unsplash.jpg',
    position: 'center 25%',
    label: 'Lagos Originals',
    heading: 'Steady\nGrowth.',
    sub: 'Growing eternally. Season 01.',
    href: '/products',
  },
]

export default function Hero({ slides = fallbackSlides }: { slides?: HeroSlide[] }) {
  const heroSlides = slides.length ? slides : fallbackSlides
  const [emblaRef] = useEmblaCarousel(
    { loop: true, watchDrag: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  return (
    <section data-testid="home-hero-section" className="w-full h-[calc(100vh-5.25rem)] md:h-[calc(100vh-7.75rem)] overflow-hidden snap-start shrink-0" ref={emblaRef}>
      <div className="flex h-full">
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className="flex-none w-full h-full relative">

            {/* Full-bleed background image */}
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              className="object-cover"
              style={{ objectPosition: slide.position }}
              priority={index === 0}
            />

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
    </section>
  )
}
