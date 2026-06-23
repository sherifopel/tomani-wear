import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { client } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import { HERO_SLIDES_QUERY, SETTINGS_QUERY } from '@/sanity/queries'
import type { SanityImageSource } from '@sanity/image-url'
import { connection } from 'next/server'

type SanityHeroSlide = {
  _id: string
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
  heading: string
  sub?: string
  href?: string
  textPosition:  number
  textPositionX: number
  textColor: 'white' | 'black'
  buttonColor: 'white' | 'black' | 'gold'
}

type Settings = {
  heroAutoplay?: boolean
  heroShowArrows?: boolean
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
    .filter((slide) => slide.imageMobile && slide.heading?.trim())
    .map((slide) => ({
      id:            slide._id,
      imageMobile:   urlForImage(slide.imageMobile).width(800).auto('format').url(),
      imageTablet:   urlForImage(slide.imageTablet).width(1024).auto('format').url(),
      imageDesktop:  urlForImage(slide.imageDesktop).width(1505).auto('format').url(),
      imageXl:       urlForImage(slide.imageXl).width(1920).auto('format').url(),
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
      textPosition:  slide.textPosition,
      textPositionX: slide.textPositionX,
      textColor:     slide.textColor,
      buttonColor:   slide.buttonColor,
    }))

  return (
    <main
      className="
        h-[calc(100vh-5.25rem)] md:h-auto
        overflow-y-scroll md:overflow-visible
        overscroll-y-contain md:overscroll-auto
        snap-y snap-mandatory md:snap-none
        md:flex-1
      "
    >
      <Hero
        slides={heroSlides}
        autoplay={settings?.heroAutoplay !== false}
        showArrows={settings?.heroShowArrows === true}
      />
      <FeaturedProducts />
    </main>
  )
}
