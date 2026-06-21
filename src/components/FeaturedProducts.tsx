import Link from 'next/link'
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
    // On mobile: match hero height (calc(100vh - 5.25rem)) so the user
    // scrolls from one full-screen section to the next.
    // flex-col lets us push the carousel down with a flex-1 spacer.
    <section
      data-testid="home-featured-products"
      className="
        h-[calc(100vh-5.25rem)] md:h-auto
        shrink-0
        flex flex-col md:block
        pt-3 px-4 md:pt-10 md:pb-16 md:px-10
        bg-[#f9f9f9] border-t border-gray-200
        snap-start
      "
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:block">

        <div className="mb-3 md:mb-8 relative flex items-center justify-center shrink-0">
          <h2 className="text-[28px] font-light tracking-widest uppercase">New Arrivals</h2>
          <Link
            href="/products"
            data-testid="home-featured-view-all-link"
            className="hidden md:block absolute right-0 nav-link-underline text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            style={{ '--link-underline-color': 'var(--brand-red)' } as React.CSSProperties}
          >
            View All
          </Link>
        </div>

        {/* flex-1 passes its full remaining height down to ProductCarousel on mobile */}
        <div className="flex-1 md:flex-none min-h-0">
          <ProductCarousel products={products} />
        </div>

      </div>
    </section>
  )
}
