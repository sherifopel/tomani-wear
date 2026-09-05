import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { PRODUCT_BY_SLUG_QUERY } from '@/sanity/queries'
import ProductInteractive, { type GalleryImage, type ColorOption } from '@/components/ProductInteractive'
import Breadcrumbs      from '@/components/Breadcrumbs'
import ProductReviews   from '@/components/ProductReviews'
import { prisma }       from '@/lib/prisma'

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

// ── SEO: per-product title, description, and Open Graph image ─────────────────
// Next.js calls this at build time (for static pages) and on-demand (for dynamic).
// The title template in layout.tsx appends " | Tomanni" automatically.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product: Product | null = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug })
  if (!product) return {}

  const title       = `${product.name} — ₦${product.price.toLocaleString()}`
  const description = product.description
    ?? `Shop ${product.name} at Tomanni. Premium quality clothing from Lagos, Nigeria.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type:   'website',
      images: product.image ? [{ url: product.image, width: 800, height: 1067, alt: product.name }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      product.image ? [product.image] : [],
    },
  }
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
  const [product, reviewStats] = await Promise.all([
    client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug }),
    prisma.review.aggregate({
      where:  { productSlug: slug, status: 'approved' },
      _count: { id: true },
      _avg:   { rating: true },
    }),
  ])

  if (!product) notFound()

  const reviewCount   = reviewStats._count.id
  const reviewAverage = reviewStats._avg.rating ?? 0

  const onSale = !!(product.compareAtPrice && product.compareAtPrice > product.price)

  // JSON-LD structured data — tells Google this is a buyable product with a price and stock status.
  // Google uses this to show rich results (price + availability) directly in search listings.
  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    name:         product.name,
    description:  product.description,
    image:        product.image,
    brand:        { '@type': 'Brand', name: 'Tomanni' },
    offers: {
      '@type':        'Offer',
      price:          product.price,
      priceCurrency:  'NGN',
      availability:   product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Tomanni' },
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   reviewAverage.toFixed(1),
        reviewCount,
        bestRating:    5,
        worstRating:   1,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-white" data-testid="pdp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main layout: handled by ProductInteractive (client component for interactivity) */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Breadcrumbs
          testId="pdp-breadcrumb"
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />
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
          reviewAverage={reviewAverage}
          reviewCount={reviewCount}
        />
      </div>

      <ProductReviews slug={product.slug} />
    </div>
  )
}
