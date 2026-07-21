import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { PRODUCTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY, NEW_IN_PRODUCTS_QUERY } from '@/sanity/queries'
import Breadcrumbs from '@/components/Breadcrumbs'
import SortDropdown from '@/components/SortDropdown'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  image?: string
  category?: string
  _createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  men:         "Tomanni's Men",
  women:       "Tomanni's Women",
  new:         "Tomanni's New In",
  accessories: "Tomanni's Accessories",
  collections: "Tomanni's Collections",
  archives:    "Tomanni's Archives",
  sale:        "Tomanni's Sale",
}

// ── SEO metadata per category/filter ─────────────────────────────────────────
const CATEGORY_META: Record<string, { title: string; description: string }> = {
  men:         { title: "Men's Clothing",   description: "Shop men's streetwear and fashion at Tomanni. Premium quality clothing from Lagos, Nigeria." },
  women:       { title: "Women's Clothing", description: "Shop women's fashion at Tomanni. Dresses, tops, and more from Lagos, Nigeria." },
  new:         { title: "New In",           description: "Fresh drops at Tomanni. New arrivals updated weekly — be the first to shop." },
  accessories: { title: "Accessories",      description: "Shop bags, belts, hats and accessories at Tomanni." },
  collections: { title: "Collections",      description: "Explore curated collections from Tomanni — Lagos streetwear at its finest." },
  archives:    { title: "Archives",         description: "Past collections and archive pieces from Tomanni." },
  sale:        { title: "Sale",             description: "Shop discounted clothing and accessories at Tomanni. Lagos fashion at reduced prices." },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; q?: string }>
}): Promise<Metadata> {
  const { category, type, q } = await searchParams

  if (q) {
    return { title: `Search: "${q}"`, description: `Search results for "${q}" on Tomanni.` }
  }
  if (category && CATEGORY_META[category]) {
    return CATEGORY_META[category]
  }
  if (type) {
    const label = type.charAt(0).toUpperCase() + type.slice(1)
    return { title: label, description: `Shop ${label} at Tomanni. Premium clothing from Lagos, Nigeria.` }
  }
  return {
    title:       'All Products',
    description: 'Browse all Tomanni clothing and accessories. Premium streetwear from Lagos, Nigeria.',
  }
}

const BREADCRUMB_LABELS: Record<string, string> = {
  men:         'Men',
  women:       'Women',
  new:         'New In',
  accessories: 'Accessories',
  collections: 'Collections',
  archives:    'Archives',
  sale:        'Sale',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; sort?: string; q?: string }>
}) {
  await connection()

  const { category, type, sort = 'default', q } = await searchParams
  const searchQuery = q?.trim() ?? ''
  const sanitySearchQuery = searchQuery ? `${searchQuery}*` : ''

  const raw: Product[] = category === 'new' && !searchQuery
    ? await client.fetch(NEW_IN_PRODUCTS_QUERY)
    : (category || type || searchQuery)
    ? await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
        category: category ?? '',
        type:     type     ?? '',
        q:        sanitySearchQuery,
      })
    : await client.fetch(PRODUCTS_QUERY)

  const products = [...raw].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'newest')     return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    return 0 // default — keep Sanity orderRank
  })

  const TYPE_LABELS: Record<string, string> = {
    dresses: 'Dresses', hoodies: 'Hoodies', jackets: 'Jackets',
    joggers: 'Joggers', shirts: 'Shirts', shorts: 'Shorts',
    tops: 'Tops', trousers: 'Pants',
    bags: 'Bags', belts: 'Belts', boots: 'Boots', hats: 'Hats', shoes: 'Shoes',
  }

  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : null
  const breadcrumbLabel = category ? BREADCRUMB_LABELS[category] ?? category : null
  const typeLabel = type ? TYPE_LABELS[type] ?? type : null
  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : typeLabel ?? categoryLabel ?? 'Products'

  const crumbs = searchQuery
    ? [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Search' }]
    : typeLabel && breadcrumbLabel
    ? [{ label: 'Home', href: '/' }, { label: breadcrumbLabel, href: `/products?category=${category}` }, { label: typeLabel }]
    : breadcrumbLabel
    ? [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: breadcrumbLabel }]
    : [{ label: 'Home', href: '/' }, { label: 'Products' }]

  return (
    <div className="bg-[#f9f9f9] min-h-screen" data-testid="plp-page">
    <div className="max-w-7xl mx-auto px-6 pb-16">

      <Breadcrumbs crumbs={crumbs} testId="plp-breadcrumb" />

      {/* Header — hidden when showing coming soon (empty category, no search) */}
      {(products.length > 0 || searchQuery) && (
        <div className="pt-6 mb-4">
          <div className="flex flex-col gap-2" data-testid="plp-header">
            <h1 className="text-[28px] font-medium text-center" data-testid="plp-title">
              {pageTitle}
            </h1>
            <div className="flex justify-end">
              <SortDropdown current={sort} category={category} type={type} query={searchQuery} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center" data-testid="plp-count">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4" data-testid="plp-empty">
          {searchQuery ? (
            <>
              <p className="text-sm text-gray-400">No products found</p>
              <p className="max-w-sm text-center text-sm text-gray-500">
                Try a different search term or browse the full collection.
              </p>
              <Link
                href="/products"
                className="mt-2 px-8 py-3 bg-black text-white border border-black text-xs btn-wipe"
                data-testid="plp-empty-cta"
              >
                View All
              </Link>
            </>
          ) : (
            <>
              <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">
                {pageTitle}
              </p>
              <h2 className="text-3xl font-light tracking-wide text-black">Coming Soon</h2>
              <p className="text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                We&apos;re working on something for this collection. Check back soon.
              </p>
              <Link
                href="/products"
                className="mt-4 px-8 py-3 bg-black text-white border border-black text-xs btn-wipe"
                data-testid="plp-empty-cta"
              >
                Shop All
              </Link>
            </>
          )}
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 && (
        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          data-testid="plp-grid"
        >
          {products.map((product) => (
            <li key={product._id} data-testid="plp-product-card">
              <Link href={`/products/${product.slug}`} className="group block bg-white" data-testid={`plp-product-link-${product.slug}`}>

                {/* Image */}
                <div className="relative aspect-[3/4] bg-white overflow-hidden mb-3" data-testid="plp-product-image-wrapper">
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
                      <span className="text-[10px]  bg-gray-800 text-white px-2 py-0.5 rounded" data-testid="plp-badge-sold-out">
                        Sold Out
                      </span>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-[10px]  bg-[var(--brand-red)] text-white px-2 py-0.5 rounded" data-testid="plp-badge-sale">
                        Sale
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col px-3 pb-3" data-testid="plp-product-info">
                  {/* Fixed 2-line height — keeps price aligned across all cards */}
                  <p className="text-sm font-light leading-snug mb-2 line-clamp-2 min-h-[2.5rem]" data-testid="plp-product-name">
                    {product.name}
                  </p>
                  {product.compareAtPrice && product.compareAtPrice > product.price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through" data-testid="plp-product-compare-price">₦{product.compareAtPrice.toLocaleString()}</span>
                      <span className="text-sm font-medium text-[var(--brand-red)]" data-testid="plp-product-price">₦{product.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium" data-testid="plp-product-price">₦{product.price.toLocaleString()}</span>
                  )}
                </div>

              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
    </div>
  )
}
