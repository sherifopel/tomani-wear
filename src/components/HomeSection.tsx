import Image, { getImageProps } from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ProductCarousel from '@/components/ProductCarousel'
import FilterableGrid from '@/components/FilterableGrid'

// ── Types ─────────────────────────────────────────────────────────────────────

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  inStock?: boolean
  image?: string | null
  hoverImage?: string | null
  productType?: string | null
  sizes?: string[] | null
  shoeSizes?: string | null
}

type Heights = {
  height: number
  fit:    'cover' | 'contain'
}

type Content = {
  label?:    string
  heading?:  string
  sub?:      string
  ctaLabel?: string
  href?:     string
  textPosition:          number
  textPositionX:         number
  mobileTextPosition?:   number
  mobileTextPositionX?:  number
  tabletTextPosition?:   number
  tabletTextPositionX?:  number
  desktopTextPosition?:  number
  desktopTextPositionX?: number
  xlTextPosition?:       number
  xlTextPositionX?:      number
  textColor:        'white' | 'black'
  textCustomColor?: string
  buttonColor:      'white' | 'black' | 'gold'
  buttonCustomColor?:     string
  buttonBackgroundColor?: string
}

export type HomeSectionData = {
  _key:         string
  title:        string
  imageMobile?:  string
  imageTablet?:  string
  imageDesktop?: string
  imageXl?:      string
  videoUrl?:        string
  videoDesktopUrl?: string
  audioUrl?:           string
  audioStart?:         number
  audioSnippetLength?: '30' | '60' | '120' | 'full'
  audioRepeat?:        'loop' | 'once'
  mobileFocalY:  number
  tabletFocalY:  number
  desktopFocalY: number
  xlFocalY:      number
  mobileFocalX:  number
  tabletFocalX:  number
  desktopFocalX: number
  xlFocalX:      number
  heights?: Heights
  content?: Content
  carousel?: {
    title?:       string
    viewAllLink?: string
    style:  'scroll' | 'grid'
    filter: string
    limit:  number
    products: Product[]
  }
}

// ── Button classes — mirrors Hero.tsx so the same hover animation fires ───────

const BUTTON_CLASSES: Record<string, string> = {
  white: 'border-white text-white btn-wipe-white',
  black: 'border-black text-black btn-wipe',
  gold:  'border-[var(--brand-yellow)] text-[var(--brand-yellow)] hover:bg-[var(--brand-yellow)] hover:text-black transition-colors duration-150',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomeSection({
  section,
  priority = false,
}: {
  section: HomeSectionData
  priority?: boolean
}) {
  const {
    imageMobile, imageTablet, imageDesktop, imageXl, videoUrl, videoDesktopUrl, audioUrl,
    mobileFocalY,  tabletFocalY,  desktopFocalY,  xlFocalY,
    mobileFocalX,  tabletFocalX,  desktopFocalX,  xlFocalX,
    heights, content, carousel,
  } = section

  const hasMedia = Boolean(videoUrl || videoDesktopUrl || imageMobile)

  // ── CSS variables ──────────────────────────────────────────────────────────
  // These drive .home-section-banner height and .home-section-banner-img
  // fit + position — all defined in globals.css so they respond per breakpoint.

  const bannerVars = {
    '--h':   `${heights?.height ?? 80}vh`,
    '--fit':  heights?.fit      ?? 'cover',

    '--pos-mobile-x':  `${mobileFocalX  ?? 50}%`,
    '--pos-mobile-y':  `${mobileFocalY  ?? 50}%`,
    '--pos-tablet-x':  `${tabletFocalX  ?? 50}%`,
    '--pos-tablet-y':  `${tabletFocalY  ?? 50}%`,
    '--pos-desktop-x': `${desktopFocalX ?? 50}%`,
    '--pos-desktop-y': `${desktopFocalY ?? 30}%`,
    '--pos-xl-x':      `${xlFocalX      ?? 50}%`,
    '--pos-xl-y':      `${xlFocalY      ?? 30}%`,
  } as CSSProperties

  // ── Text position — mirrors Hero.tsx CSS variable pattern ─────────────────

  const tp   = content?.textPosition        ?? 85
  const tpx  = content?.textPositionX       ?? 0
  const textVars = content ? {
    '--hero-mobile-y':  `${content.mobileTextPosition   ?? tp }%`,
    '--hero-mobile-x':  `${content.mobileTextPositionX  ?? tpx}%`,
    '--hero-tablet-y':  `${content.tabletTextPosition   ?? tp }%`,
    '--hero-tablet-x':  `${content.tabletTextPositionX  ?? tpx}%`,
    '--hero-desktop-y': `${content.desktopTextPosition  ?? tp }%`,
    '--hero-desktop-x': `${content.desktopTextPositionX ?? tpx}%`,
    '--hero-xl-y':      `${content.xlTextPosition       ?? tp }%`,
    '--hero-xl-x':      `${content.xlTextPositionX      ?? tpx}%`,
  } as CSSProperties : {}

  // ── Button ────────────────────────────────────────────────────────────────

  const textColor = content?.textCustomColor || (content?.textColor === 'black' ? '#000' : '#fff')
  const hasCustomBtn = Boolean(content?.buttonCustomColor || content?.buttonBackgroundColor)
  const btnClasses   = BUTTON_CLASSES[content?.buttonColor ?? 'white'] ?? BUTTON_CLASSES.white
  const btnStyle = hasCustomBtn
    ? {
        color:           content!.buttonCustomColor || undefined,
        borderColor:     content!.buttonCustomColor || undefined,
        backgroundColor: content!.buttonBackgroundColor || 'transparent',
      }
    : undefined

  // ── Adaptive image sources ────────────────────────────────────────────────
  // Resolve each breakpoint's source (later breakpoints fall back to earlier ones).
  // Used both in <picture> (pure image sections) and in the fallback Image/video path.

  const tabletSrc  = imageTablet  ?? imageMobile
  const desktopSrc = imageDesktop ?? imageTablet  ?? imageMobile
  const xlSrc      = imageXl      ?? imageDesktop ?? imageTablet ?? imageMobile

  // A "pure image section" has a mobile image and no video at any breakpoint.
  // For these we use <picture> + <source media> so the browser downloads only
  // the image that matches the current viewport — not all four.
  const isPureImageSection = Boolean(imageMobile) && !videoUrl && !videoDesktopUrl

  // getImageProps is Next.js's escape hatch: it returns the same optimised srcset
  // that <Image> would produce internally, so we can pass it into native <picture>.
  const mobileImg  = isPureImageSection && imageMobile
    ? getImageProps({ src: imageMobile,  alt: content?.heading ?? '', fill: true, sizes: '100vw',  priority }).props
    : null
  const tabletImg  = isPureImageSection && tabletSrc
    ? getImageProps({ src: tabletSrc,    alt: '',                     fill: true, sizes: '100vw'           }).props
    : null
  const desktopImg = isPureImageSection && desktopSrc
    ? getImageProps({ src: desktopSrc,   alt: '',                     fill: true, sizes: '1505px', priority }).props
    : null
  const xlImg      = isPureImageSection && xlSrc
    ? getImageProps({ src: xlSrc,        alt: '',                     fill: true, sizes: '1920px'           }).props
    : null

  // ── Carousel products (respect limit from Sanity) ─────────────────────────

  const rawProducts = carousel?.products?.slice(0, carousel.limit ?? 8) ?? []
  const carouselProducts = rawProducts.map((p, i) => ({
    id:         i + 1,
    productId:  p._id,
    name:       p.name,
    slug:       p.slug,
    price:      p.price,
    image:      p.image ?? '',
    hoverImage: p.hoverImage ?? undefined,
    href:       `/products/${p.slug}`,
    inStock:    p.inStock,
    sizes:      p.sizes,
    shoeSizes:  p.shoeSizes,
  }))

  return (
    <section data-testid="home-section">

      {/* ── Hero banner ───────────────────────────────────────────────────── */}
      {hasMedia && (
        <div
          data-testid="home-hero-section"
          className="home-section-banner snap-section relative overflow-hidden bg-black"
          style={bannerVars}
        >
          {/* ── Pure image section: <picture> for adaptive serving ─────────────
              The browser reads <source media> top-to-bottom, picks the first
              match, and downloads ONLY that image. One network request total. */}
          {isPureImageSection && mobileImg && (
            <picture>
              {xlImg      && <source media="(min-width: 1280px)" srcSet={xlImg.srcSet}      sizes="1920px" />}
              {desktopImg && <source media="(min-width: 1024px)" srcSet={desktopImg.srcSet} sizes="1505px" />}
              {tabletImg  && <source media="(min-width: 768px)"  srcSet={tabletImg.srcSet}  sizes="100vw"  />}
              {/* <img> is the fallback (mobile) and carries fetchPriority for the whole element.
                  style comes from getImageProps — position:absolute, w/h 100%, inset:0.
                  Using inline style (not Tailwind) so Tailwind preflight can't override it. */}
              <img
                src={mobileImg.src}
                srcSet={mobileImg.srcSet}
                sizes="100vw"
                alt={content?.heading ?? ''}
                style={mobileImg.style}
                fetchPriority={priority ? 'high' : 'auto'}
                loading={priority ? undefined : 'lazy'}
                decoding="async"
                className="home-section-banner-img"
              />
            </picture>
          )}

          {/* ── Video / mixed section: per-breakpoint elements ───────────────
              Only used when there is a video at any breakpoint. ── */}
          {!isPureImageSection && (
            <>
              {/* Mobile — video › image */}
              {videoUrl ? (
                <video src={videoUrl} autoPlay muted loop playsInline preload="none"
                  className="home-section-banner-img absolute inset-0 w-full h-full block md:hidden" />
              ) : imageMobile ? (
                <Image src={imageMobile} alt={content?.heading ?? ''} fill sizes="100vw" priority={priority}
                  className="home-section-banner-img block md:hidden" />
              ) : null}

              {/* Tablet — image › video */}
              {tabletSrc ? (
                <Image src={tabletSrc} alt={content?.heading ?? ''} fill sizes="100vw"
                  className="home-section-banner-img hidden md:block lg:hidden" />
              ) : (videoDesktopUrl ?? videoUrl) ? (
                <video src={videoDesktopUrl ?? videoUrl} autoPlay muted loop playsInline preload="none"
                  className="home-section-banner-img absolute inset-0 w-full h-full hidden md:block lg:hidden" />
              ) : null}

              {/* Desktop — image › video */}
              {desktopSrc ? (
                <Image src={desktopSrc} alt={content?.heading ?? ''} fill sizes="1505px" priority={priority}
                  className="home-section-banner-img hidden lg:block xl:hidden" />
              ) : (videoDesktopUrl ?? videoUrl) ? (
                <video src={videoDesktopUrl ?? videoUrl} autoPlay muted loop playsInline preload="none"
                  className="home-section-banner-img absolute inset-0 w-full h-full hidden lg:block xl:hidden" />
              ) : null}

              {/* XL — image › video */}
              {xlSrc ? (
                <Image src={xlSrc} alt={content?.heading ?? ''} fill sizes="1920px"
                  className="home-section-banner-img hidden xl:block" />
              ) : (videoDesktopUrl ?? videoUrl) ? (
                <video src={videoDesktopUrl ?? videoUrl} autoPlay muted loop playsInline preload="none"
                  className="home-section-banner-img absolute inset-0 w-full h-full hidden xl:block" />
              ) : null}
            </>
          )}

          {/* Sentinel — tells StickyHeader to go transparent while this section is at the top */}
          <div data-hero-sentinel aria-hidden="true" className="absolute top-0 inset-x-0 h-px pointer-events-none" />

          {/* Gradients — bottom for text, top so the transparent header remains legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />


          {/* Text overlay — same CSS variable pattern as Hero.tsx */}
          {content && (content.heading || content.label || content.sub) && (
            <div
              className="
                hero-copy absolute z-10 max-w-xl p-6 md:p-16
                top-[var(--hero-mobile-y)]  left-[var(--hero-mobile-x)]
                -translate-y-full translate-x-[calc(-1*var(--hero-mobile-x))]
                md:top-[var(--hero-tablet-y)]  md:left-[var(--hero-tablet-x)]
                md:translate-x-[calc(-1*var(--hero-tablet-x))]
                lg:top-[var(--hero-desktop-y)] lg:left-[var(--hero-desktop-x)]
                lg:translate-x-[calc(-1*var(--hero-desktop-x))]
                xl:top-[var(--hero-xl-y)]      xl:left-[var(--hero-xl-x)]
                xl:translate-x-[calc(-1*var(--hero-xl-x))]
              "
              style={textVars}
            >
              {content.label && (
                <p data-testid="home-hero-subtitle" className="text-xs  mb-4 font-semibold text-[var(--brand-yellow)]">
                  {content.label}
                </p>
              )}
              {content.heading && (
                <h2
                  data-testid="home-hero-heading"
                  className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4 whitespace-pre-line"
                  style={{ color: textColor }}
                >
                  {content.heading}
                </h2>
              )}
              {content.sub && (
                <p data-testid="home-hero-description" className="mb-8 text-sm leading-relaxed" style={{ color: textColor, opacity: 0.85 }}>
                  {content.sub}
                </p>
              )}
              {content.ctaLabel && content.href && (
                <Link
                  data-testid="home-hero-cta-button"
                  href={content.href}
                  className={`inline-block border px-8 py-3 text-xs  font-medium transition-colors duration-300 ${hasCustomBtn ? '' : btnClasses}`}
                  style={btnStyle}
                >
                  {content.ctaLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Product carousel ──────────────────────────────────────────────── */}
      {carouselProducts.length > 0 && (
        <div data-testid="home-featured-products" className="snap-section bg-white">

          {/* Heading row — 24px gutter on both sides, full viewport width */}
          <div className="pt-8 pb-4 px-6 flex items-center justify-between">
            {carousel?.title && (
              <h2 className="text-[18px] font-normal uppercase leading-[28px] border-b border-black pb-[3px]">
                {carousel.title}
              </h2>
            )}
            {carousel?.viewAllLink && (
              <Link
                href={carousel.viewAllLink}
                className="text-[12px] leading-[12px] font-normal text-[#434343] hover:opacity-60 transition-opacity"
              >
                View All
              </Link>
            )}
          </div>

          {carousel?.style === 'grid' ? (
            /* Grid with type filter tabs */
            <FilterableGrid products={rawProducts} />
          ) : (
            /* Scroll carousel — 24px gutter, full viewport width */
            <div className="px-6 pb-10">
              <ProductCarousel products={carouselProducts} />
            </div>
          )}

        </div>
      )}

    </section>
  )
}
