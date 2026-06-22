import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { PRODUCT_BY_SLUG_QUERY, PRODUCTS_QUERY } from '@/sanity/queries'
import ProductActions from '@/components/ProductActions'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  hotspot?: { x: number; y: number }
  description?: string
  category?: string
  sizes?: string[]
  inStock: boolean
}

// Pre-generate all product pages at build time so they load instantly.
// Next.js calls this at deploy time, fetches all slugs, and builds a static
// HTML file for each one — like pre-printing a menu instead of writing it
// fresh for every customer who walks in.
export async function generateStaticParams() {
  const products: { slug: string }[] = await client.fetch(
    `*[_type == "product"]{ "slug": slug.current }`
  )
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product: Product | null = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug })

  // If no product found for this slug, show the Next.js 404 page
  if (!product) notFound()

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price
  const objectPos = product.hotspot
    ? `${product.hotspot.x * 100}% ${product.hotspot.y * 100}%`
    : 'center center'

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="px-6 py-4 text-xs text-gray-400 uppercase tracking-widest">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-black transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* Main layout: image left, details right */}
      <div className="max-w-7xl mx-auto px-6 pb-16 md:grid md:grid-cols-2 md:gap-16 md:items-start">

        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 mb-8 md:mb-0">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain p-8"
              style={{ objectPosition: objectPos }}
            />
          )}
          {onSale && (
            <span className="absolute top-4 left-4 bg-[var(--brand-red)] text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Details */}
        <div className="md:pt-4 space-y-6">

          {/* Category */}
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-gray-400">
              {product.category}
            </p>
          )}

          {/* Name */}
          <h1 className="text-2xl font-light tracking-wide">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className={`text-lg font-medium ${onSale ? 'text-[var(--brand-red)]' : ''}`}>
              ₦{product.price.toLocaleString()}
            </span>
            {onSale && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.compareAtPrice!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Size selector + Add to cart (client component) */}
          <ProductActions
            sizes={product.sizes ?? []}
            inStock={product.inStock}
          />

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
