import ProductCarousel from '@/components/ProductCarousel'
import { client } from '@/sanity/client'
import { PRODUCTS_QUERY } from '@/sanity/queries'

type SanityProduct = {
  _id: string
  name: string
  slug: string
  price: number
  image: string
}

export default async function FeaturedProducts() {
  const sanityProducts: SanityProduct[] = await client.fetch(PRODUCTS_QUERY)

  const products = sanityProducts.map((p, index) => ({
    id: index + 1,
    name: p.name,
    price: p.price,
    image: p.image,
    href: `/products/${p.slug}`,
  }))

  return (
    <section
      data-testid="home-featured-products"
      className="snap-section pt-3 px-4 pb-10 md:pt-10 md:pb-16 md:px-10 bg-[#f9f9f9] border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto w-full">

        <div className="mb-3 md:mb-8 relative flex items-center justify-center">
          <h2 className="text-[28px] font-light tracking-widest uppercase">New Arrivals</h2>
        </div>

        <div>
          <ProductCarousel products={products} />
        </div>

      </div>
    </section>
  )
}
