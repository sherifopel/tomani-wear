import Hero from '@/components/Hero'
import NewInGrid from '@/components/NewInGrid'
import FeaturedProducts from '@/components/FeaturedProducts'
import MidBanner from '@/components/MidBanner'
import MembersCarousel from '@/components/MembersCarousel'
import { client } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import { HERO_SLIDES_QUERY, SETTINGS_QUERY, MID_BANNER_QUERY } from '@/sanity/queries'
import type { SanityImageSource } from '@sanity/image-url'
import { connection } from 'next/server'
import { auth } from '@/auth'

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

type CarouselProduct = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  inStock?: boolean
  image?: string | null
}

type MidBannerData = {
  videoUrl?: string
  imageMobile?: SanityImageSource
  imageTablet?: SanityImageSource
  imageDesktop?: SanityImageSource
  imageXl?: SanityImageSource
  mobileFocalY: number
  tabletFocalY: number
  desktopFocalY: number
  xlFocalY: number
  mobileFocalX: number
  tabletFocalX: number
  desktopFocalX: number
  xlFocalX: number
  content?: {
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
}

type Settings = {
  heroAutoplay?: boolean
  heroShowArrows?: boolean
  heroSlideInterval?: number
  midBannerEnabled?: boolean
  membersCarouselEnabled?: boolean
  membersCarouselTitle?: string
  membersCarouselProducts?: CarouselProduct[]
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ draft?: string }>
}) {
  await connection()

  const session = await auth()

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

  const [sanitySlides, settings, midBannerData]: [SanityHeroSlide[], Settings | null, MidBannerData | null] = await Promise.all([
    sanityClient.fetch(HERO_SLIDES_QUERY),
    sanityClient.fetch(SETTINGS_QUERY),
    sanityClient.fetch(MID_BANNER_QUERY),
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

  const midBanner = midBannerData && (midBannerData.videoUrl || midBannerData.imageMobile) ? {
    videoUrl:      midBannerData.videoUrl,
    imageMobile:   midBannerData.imageMobile  ? urlForImage(midBannerData.imageMobile).width(800).auto('format').url()   : '',
    imageTablet:   midBannerData.imageTablet  ? urlForImage(midBannerData.imageTablet).width(1024).auto('format').url()  : '',
    imageDesktop:  midBannerData.imageDesktop ? urlForImage(midBannerData.imageDesktop).width(1505).auto('format').url() : '',
    imageXl:       midBannerData.imageXl      ? urlForImage(midBannerData.imageXl).width(1920).auto('format').url()      : '',
    mobileFocalY:  midBannerData.mobileFocalY,
    tabletFocalY:  midBannerData.tabletFocalY,
    desktopFocalY: midBannerData.desktopFocalY,
    xlFocalY:      midBannerData.xlFocalY,
    mobileFocalX:  midBannerData.mobileFocalX,
    tabletFocalX:  midBannerData.tabletFocalX,
    desktopFocalX: midBannerData.desktopFocalX,
    xlFocalX:      midBannerData.xlFocalX,
    content:       midBannerData.content,
  } : null

  const showMembersCarousel =
    session?.user &&
    settings?.membersCarouselEnabled !== false &&
    (settings?.membersCarouselProducts?.length ?? 0) > 0

  return (
    <main className="flex-1">
      <Hero
        slides={heroSlides}
        autoplay={settings?.heroAutoplay !== false}
        showArrows={settings?.heroShowArrows === true}
        slideInterval={settings?.heroSlideInterval ?? 6000}
      />
      <FeaturedProducts />
      {settings?.midBannerEnabled && midBanner && (
        <MidBanner data={midBanner} />
      )}
      <NewInGrid />
      {showMembersCarousel && (
        <MembersCarousel
          title={settings?.membersCarouselTitle ?? 'Early Access — Members Only'}
          products={settings!.membersCarouselProducts!}
        />
      )}
    </main>
  )
}
