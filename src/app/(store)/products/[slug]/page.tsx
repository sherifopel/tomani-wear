import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { client } from '@/sanity/client'
import { PRODUCT_BY_SLUG_QUERY } from '@/sanity/queries'
import ProductInteractive, { type GalleryImage, type ColorOption } from '@/components/ProductInteractive'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  hotspot?: { x: number; y: number }
  gallery?: GalleryImage[]
  colors?: ColorOption[]
  description?: string
  category?: string
  sizes?: string[]
  inStock: boolean
}

// Pre-generate all product pages at build time so they load instantly.
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
  await connection()

  const { slug } = await params
  const product: Product | null = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug })

  if (!product) notFound()

  const onSale = !!(product.compareAtPrice && product.compareAtPrice > product.price)

  return (
    <div className="min-h-screen bg-white" data-testid="pdp-page">

      {/* Breadcrumb */}
      <div className="px-6 py-4 text-xs text-gray-400 uppercase tracking-widest" data-testid="pdp-breadcrumb">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-black transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* Main layout: handled by ProductInteractive (client component for interactivity) */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <ProductInteractive
          productId={product._id}
          slug={product.slug}
          mainImage={product.image}
          gallery={product.gallery}
          colors={product.colors}
          sizes={product.sizes}
          inStock={product.inStock}
          onSale={onSale}
          compareAtPrice={product.compareAtPrice}
          name={product.name}
          price={product.price}
          category={product.category}
          description={product.description}
        />
      </div>
    </div>
  )
}
