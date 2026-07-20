import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

const NEW_IN_QUERY = groq`*[_type == "product" && ("new-in" in coalesce(categories, []) || newIn == true)] | order(orderRank asc) [0...4] {
  _id,
  name,
  "slug": slug.current,
  "image": coalesce(
    productImages[isMain == true][0].image.asset->url,
    productImages[0].image.asset->url,
    image.asset->url,
    gallery[0].asset->url
  )
}`

type Product = {
  _id:   string
  name:  string
  slug:  string
  image?: string
}

export default async function NewInGrid() {
  const products: Product[] = await client.fetch(NEW_IN_QUERY)
  if (products.length === 0) return null

  return (
    <section data-testid="home-new-in">

      {/* Header sits inside the standard page container */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <h2 className="text-[28px] font-light " data-testid="home-new-in-heading">
          New In
        </h2>
        <Link
          href="/products?category=new"
          data-testid="home-new-in-view-all"
          className="border border-black px-6 py-2.5 text-xs  btn-wipe-white rounded"
        >
          View All
        </Link>
      </div>

      {/* Tiles go full-width, edge to edge — no container, tiny gap like ASOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5" data-testid="home-new-in-grid">
        {products.map((product, i) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            data-testid={`home-new-in-tile-${product.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-gray-100"
          >
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <p
              className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium leading-snug"
              data-testid={`home-new-in-caption-${product.slug}`}
            >
              {product.name}
            </p>
          </Link>
        ))}
      </div>

    </section>
  )
}
