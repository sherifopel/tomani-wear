import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { client } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import { HERO_SLIDES_QUERY, SETTINGS_QUERY } from '@/sanity/queries'
import type { SanityImageSource } from '@sanity/image-url'
import { connection } from 'next/server'

type SanityHeroSlide = {
  _id: string
  videoUrl?:    string
  imageMobile:  SanityImageSource
  imageTablet:  SanityImageSource
  imageDesktop: SanityImageSource
  imageXl:      SanityImageSource
  mobileFocalY:  number
  tabletFocalY:  number
  desktopFocalY: number
  xlFocalY:      number
  mobileFocalX:  number
  tabletFocalX:  number
  desktopFocalX: number
  xlFocalX:      number
  label?: string
  heading?: string
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

type Settings = {
  heroAutoplay?: boolean
  heroShowArrows?: boolean
  heroSlideInterval?: number
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ draft?: string }>
}) {
  await connection()

  const params = await searchParams
  const canReadDrafts =
    process.env.NODE_ENV === 'development' &&
    params?.draft === '1' &&
    Boolean(process.env.SANITY_API_READ_TOKEN)
  const sanityClient = canReadDrafts
    ? client.withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: 'drafts',
        useCdn: false,
      })
    : client

  const [sanitySlides, settings]: [SanityHeroSlide[], Settings | null] = await Promise.all([
    sanityClient.fetch(HERO_SLIDES_QUERY),
    sanityClient.fetch(SETTINGS_QUERY),
  ])

  const heroSlides = sanitySlides
    .filter((slide) => slide.videoUrl || slide.imageMobile)
    .map((slide) => ({
      id:            slide._id,
      videoUrl:      slide.videoUrl,
      imageMobile:   slide.imageMobile ? urlForImage(slide.imageMobile).width(800).auto('format').url()   : '',
      imageTablet:   slide.imageTablet  ? urlForImage(slide.imageTablet).width(1024).auto('format').url() : '',
      imageDesktop:  slide.imageDesktop ? urlForImage(slide.imageDesktop).width(1505).auto('format').url(): '',
      imageXl:       slide.imageXl      ? urlForImage(slide.imageXl).width(1920).auto('format').url()     : '',
      mobileFocalY:  slide.mobileFocalY,
      tabletFocalY:  slide.tabletFocalY,
      desktopFocalY: slide.desktopFocalY,
      xlFocalY:      slide.xlFocalY,
      mobileFocalX:  slide.mobileFocalX,
      tabletFocalX:  slide.tabletFocalX,
      desktopFocalX: slide.desktopFocalX,
      xlFocalX:      slide.xlFocalX,
      label:         slide.label,
      heading:       slide.heading,
      sub:           slide.sub,
      href:          slide.href || undefined,
      textPosition:         slide.textPosition,
      textPositionX:        slide.textPositionX,
      mobileTextPosition:   slide.mobileTextPosition,
      mobileTextPositionX:  slide.mobileTextPositionX,
      tabletTextPosition:   slide.tabletTextPosition,
      tabletTextPositionX:  slide.tabletTextPositionX,
      desktopTextPosition:  slide.desktopTextPosition,
      desktopTextPositionX: slide.desktopTextPositionX,
      xlTextPosition:       slide.xlTextPosition,
      xlTextPositionX:      slide.xlTextPositionX,
      textColor:            slide.textColor,
      buttonColor:          slide.buttonColor,
      buttonCustomColor:    slide.buttonCustomColor,
      buttonBackgroundColor: slide.buttonBackgroundColor,
    }))

  return (
    <main className="flex-1">
      <Hero
        slides={heroSlides}
        autoplay={settings?.heroAutoplay !== false}
        showArrows={settings?.heroShowArrows === true}
        slideInterval={settings?.heroSlideInterval ?? 6000}
      />
      <FeaturedProducts />
    </main>
  )
}
