import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { client } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import { HERO_SLIDES_QUERY } from '@/sanity/queries'
import type { SanityImageSource } from '@sanity/image-url'

type SanityHeroSlide = {
  _id: string
  image: SanityImageSource
  mobileImage?: SanityImageSource
  label?: string
  heading: string
  sub?: string
  href: string
}

export default async function Home() {
  const sanitySlides: SanityHeroSlide[] = await client.fetch(HERO_SLIDES_QUERY)
  const heroSlides = sanitySlides.map((slide) => ({
    id: slide._id,
    image: urlForImage(slide.image)
      .width(1800)
      .height(1100)
      .fit('crop')
      .auto('format')
      .url(),
    mobileImage: urlForImage(slide.mobileImage ?? slide.image)
      .width(900)
      .height(1400)
      .fit('crop')
      .auto('format')
      .url(),
    label: slide.label,
    heading: slide.heading,
    sub: slide.sub,
    href: slide.href,
  }))

  return (
    <main className="flex-1">
      <Hero slides={heroSlides} />
      <FeaturedProducts />
    </main>
  )
}
