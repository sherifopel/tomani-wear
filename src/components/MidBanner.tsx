import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

const BUTTON_CLASSES: Record<string, string> = {
  white: 'border-white text-white btn-wipe-white',
  black: 'border-black text-black btn-wipe',
  gold:  'border-[var(--brand-yellow)] text-[var(--brand-yellow)] hover:bg-[var(--brand-yellow)] hover:text-black transition-colors duration-150',
}

const BUTTON_COLORS: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  gold:  '#FFD700',
}

type BannerContent = {
  label?: string
  heading?: string
  sub?: string
  href?: string
  textPosition: number
  textPositionX: number
  mobileTextPosition: number
  mobileTextPositionX: number
  tabletTextPosition: number
  tabletTextPositionX: number
  desktopTextPosition: number
  desktopTextPositionX: number
  xlTextPosition: number
  xlTextPositionX: number
  textColor: string
  buttonColor: string
  buttonCustomColor?: string
  buttonBackgroundColor?: string
}

type BannerData = {
  videoUrl?: string
  imageMobile: string
  imageTablet: string
  imageDesktop: string
  imageXl: string
  mobileFocalY: number
  tabletFocalY: number
  desktopFocalY: number
  xlFocalY: number
  mobileFocalX: number
  tabletFocalX: number
  desktopFocalX: number
  xlFocalX: number
  content?: BannerContent
}

export default function MidBanner({ data }: { data: BannerData }) {
  const { content } = data
  const hasContent = content && (content.label || content.heading || content.sub)

  const textColor = content?.textColor === 'black' ? '#000' : '#fff'
  const btnClasses = BUTTON_CLASSES[content?.buttonColor ?? 'white'] ?? BUTTON_CLASSES.white
  const hasCustomButtonColor = Boolean(content?.buttonCustomColor || content?.buttonBackgroundColor)
  const fallbackButtonColor = BUTTON_COLORS[content?.buttonColor ?? 'white'] ?? BUTTON_COLORS.white
  const buttonStyle = hasCustomButtonColor
    ? {
        color:           content?.buttonCustomColor || fallbackButtonColor,
        borderColor:     content?.buttonCustomColor || fallbackButtonColor,
        backgroundColor: content?.buttonBackgroundColor || 'transparent',
      }
    : undefined

  const containerStyle = {
    '--banner-img-mobile-x':  `${data.mobileFocalX}%`,
    '--banner-img-mobile-y':  `${data.mobileFocalY}%`,
    '--banner-img-tablet-x':  `${data.tabletFocalX}%`,
    '--banner-img-tablet-y':  `${data.tabletFocalY}%`,
    '--banner-img-desktop-x': `${data.desktopFocalX}%`,
    '--banner-img-desktop-y': `${data.desktopFocalY}%`,
    '--banner-img-xl-x':      `${data.xlFocalX}%`,
    '--banner-img-xl-y':      `${data.xlFocalY}%`,
    ...(content ? {
      '--banner-mobile-y':  `${content.mobileTextPosition}%`,
      '--banner-mobile-x':  `${content.mobileTextPositionX}%`,
      '--banner-tablet-y':  `${content.tabletTextPosition}%`,
      '--banner-tablet-x':  `${content.tabletTextPositionX}%`,
      '--banner-desktop-y': `${content.desktopTextPosition}%`,
      '--banner-desktop-x': `${content.desktopTextPositionX}%`,
      '--banner-xl-y':      `${content.xlTextPosition}%`,
      '--banner-xl-x':      `${content.xlTextPositionX}%`,
    } : {}),
  }

  return (
    <div
      className="relative w-full aspect-[16/7] md:aspect-[21/9] overflow-hidden"
      style={containerStyle as CSSProperties}
      data-testid="mid-banner"
    >
      {data.videoUrl ? (
        <video
          src={data.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="mid-banner-video absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          {/* Mobile image */}
          <Image
            src={data.imageMobile}
            alt={content?.heading ?? ''}
            fill
            sizes="100vw"
            className="block object-cover md:hidden"
            style={{ objectPosition: `${data.mobileFocalX}% ${data.mobileFocalY}%` }}
            priority={false}
          />
          {/* Tablet image */}
          <Image
            src={data.imageTablet}
            alt={content?.heading ?? ''}
            fill
            sizes="100vw"
            className="hidden object-cover md:block lg:hidden"
            style={{ objectPosition: `${data.tabletFocalX}% ${data.tabletFocalY}%` }}
            priority={false}
          />
          {/* Desktop image */}
          <Image
            src={data.imageDesktop}
            alt={content?.heading ?? ''}
            fill
            sizes="1505px"
            className="hidden object-cover lg:block xl:hidden"
            style={{ objectPosition: `${data.desktopFocalX}% ${data.desktopFocalY}%` }}
            priority={false}
          />
          {/* Extra Large image */}
          <Image
            src={data.imageXl}
            alt={content?.heading ?? ''}
            fill
            sizes="1920px"
            className="hidden object-cover xl:block"
            style={{ objectPosition: `${data.xlFocalX}% ${data.xlFocalY}%` }}
            priority={false}
          />
        </>
      )}

      {hasContent && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      )}

      {hasContent && (
        <div
          className="
            absolute z-10 max-w-xl p-6 md:p-16
            top-[var(--banner-mobile-y)]  left-[var(--banner-mobile-x)]
            -translate-y-full translate-x-[calc(-1*var(--banner-mobile-x))]
            md:top-[var(--banner-tablet-y)]  md:left-[var(--banner-tablet-x)]
            md:translate-x-[calc(-1*var(--banner-tablet-x))]
            lg:top-[var(--banner-desktop-y)] lg:left-[var(--banner-desktop-x)]
            lg:translate-x-[calc(-1*var(--banner-desktop-x))]
            xl:top-[var(--banner-xl-y)]      xl:left-[var(--banner-xl-x)]
            xl:translate-x-[calc(-1*var(--banner-xl-x))]
          "
          data-testid="mid-banner-content"
        >
          {content.label && (
            <p
              className="text-xs uppercase tracking-widest mb-4 font-semibold text-[var(--brand-yellow)]"
              data-testid="mid-banner-label"
            >
              {content.label}
            </p>
          )}
          {content.heading && (
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 whitespace-pre-line"
              style={{ color: textColor }}
              data-testid="mid-banner-heading"
            >
              {content.heading}
            </h2>
          )}
          {content.sub && (
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ color: textColor, opacity: 0.85 }}
              data-testid="mid-banner-sub"
            >
              {content.sub}
            </p>
          )}
          {content.href && (
            <Link
              href={content.href}
              className={`inline-block border px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${hasCustomButtonColor ? '' : btnClasses}`}
              style={buttonStyle}
              data-testid="mid-banner-cta"
            >
              Shop Now
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
