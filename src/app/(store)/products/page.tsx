import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'
import { client } from '@/sanity/client'
import { PRODUCTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY } from '@/sanity/queries'
import Breadcrumbs from '@/components/Breadcrumbs'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  image?: string
  category?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  men:         'Men',
  women:       'Women',
  new:         'New In',
  accessories: 'Accessories',
  collections: 'Collections',
  sale:        'Sale',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  await connection()

  const { category } = await searchParams

  const products: Product[] = category
    ? await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { category })
    : await client.fetch(PRODUCTS_QUERY)

  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : null

  const crumbs = categoryLabel
    ? [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: categoryLabel }]
    : [{ label: 'Home', href: '/' }, { label: 'Products' }]

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16" data-testid="plp-page">

      <Breadcrumbs crumbs={crumbs} testId="plp-breadcrumb" />

      {/* Header */}
      <div className="py-8 border-b border-gray-100 mb-8" data-testid="plp-header">
        <h1 className="text-2xl font-medium uppercase tracking-widest" data-testid="plp-heading">
          {categoryLabel ?? 'All Products'}
        </h1>
        <p className="text-xs text-gray-400 mt-1" data-testid="plp-count">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10" data-testid="plp-filters">
        <Link
          href="/products"
          data-testid="plp-filter-all"
          className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors duration-200 ${
            !category
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-black'
          }`}
        >
          All
        </Link>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/products?category=${key}`}
            data-testid={`plp-filter-${key}`}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors duration-200 ${
              category === key
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6" data-testid="plp-empty">
          <p className="text-sm uppercase tracking-widest text-gray-400">No products found</p>
          <Link
            href="/products"
            className="px-8 py-3 bg-black text-white border border-black text-xs uppercase tracking-widest btn-wipe"
            data-testid="plp-empty-cta"
          >
            View All
          </Link>
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 && (
        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
          data-testid="plp-grid"
        >
          {products.map((product) => (
            <li key={product._id} data-testid="plp-product-card">
              <Link href={`/products/${product.slug}`} className="group block" data-testid={`plp-product-link-${product.slug}`}>

                {/* Image */}
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-3" data-testid="plp-product-image-wrapper">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      data-testid="plp-product-image"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" data-testid="plp-product-image-placeholder" />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!product.inStock && (
                      <span className="text-[10px] uppercase tracking-widest bg-gray-800 text-white px-2 py-0.5" data-testid="plp-badge-sold-out">
                        Sold Out
                      </span>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-[10px] uppercase tracking-widest bg-[var(--brand-red)] text-white px-2 py-0.5" data-testid="plp-badge-sale">
                        Sale
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div data-testid="plp-product-info">
                  {product.category && (
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1" data-testid="plp-product-category">
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </p>
                  )}
                  <p className="text-sm font-light leading-snug mb-1" data-testid="plp-product-name">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" data-testid="plp-product-price">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <p className="text-xs text-gray-400 line-through" data-testid="plp-product-compare-price">
                        ₦{product.compareAtPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}
