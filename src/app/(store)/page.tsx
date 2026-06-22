import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { client } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import { HERO_SLIDES_QUERY, SETTINGS_QUERY } from '@/sanity/queries'
import type { SanityImageSource } from '@sanity/image-url'
import { connection } from 'next/server'

type SanityHeroSlide = {
  _id: string
  image: SanityImageSource
  label?: string
  heading: string
  sub?: string
  href: string
  mobileFocalY: number
  tabletFocalY: number
  desktopFocalY: number
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

  const heroSlides = sanitySlides.map((slide) => ({
    id: slide._id,
    image: urlForImage(slide.image).width(1505).auto('format').url(),
    label: slide.label,
    heading: slide.heading,
    sub: slide.sub,
    href: slide.href,
    mobileFocalY:  slide.mobileFocalY,
    tabletFocalY:  slide.tabletFocalY,
    desktopFocalY: slide.desktopFocalY,
  }))

  return (
    <main className="flex-1">
      <Hero
        slides={heroSlides}
        autoplay={settings?.heroAutoplay !== false}
        showArrows={settings?.heroShowArrows === true}
      />
      <FeaturedProducts />
    </main>
  )
}
