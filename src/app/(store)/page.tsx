import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { client } from '@/sanity/client'
import { HERO_SLIDES_QUERY } from '@/sanity/queries'

type SanityHeroSlide = {
  _id: string
  image: string
  hotspot?: { x: number; y: number }
  label?: string
  heading: string
  sub?: string
  href: string
}

export default async function Home() {
  const sanitySlides: SanityHeroSlide[] = await client.fetch(HERO_SLIDES_QUERY)
  const heroSlides = sanitySlides.map((slide) => ({
    id: slide._id,
    image: slide.image,
    hotspot: slide.hotspot,
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
