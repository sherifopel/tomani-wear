import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedProducts />
    </main>
  )
}
