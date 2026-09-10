import { connection } from 'next/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { PRODUCTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY, NEW_IN_PRODUCTS_QUERY } from '@/sanity/queries'
import Breadcrumbs from '@/components/Breadcrumbs'
import SortDropdown from '@/components/SortDropdown'
import PLPCard from '@/components/PLPCard'

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  image?: string
  hoverImage?: string
  category?: string
  _createdAt: string
  sizes?: string[] | null
  shoeSizes?: string | null
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
    <div className="bg-white min-h-screen" data-testid="plp-page">

      {/* Header — padded */}
      <div className="px-6">
        <Breadcrumbs crumbs={crumbs} testId="plp-breadcrumb" />

        {(products.length > 0 || searchQuery) && (
          <div className="pt-4 pb-3 flex items-center justify-between" data-testid="plp-header">
            <h1 className="text-[13px] font-medium text-black" data-testid="plp-title">
              {pageTitle}
            </h1>
            <SortDropdown current={sort} category={category} type={type} query={searchQuery} />
          </div>
        )}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="px-6 min-h-[50vh] flex flex-col items-center justify-center gap-4" data-testid="plp-empty">
          {searchQuery ? (
            <>
              <p className="text-sm text-gray-500">No products found</p>
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
              <p className="text-[11px] tracking-[0.2em] uppercase text-gray-500">
                {pageTitle}
              </p>
              <h2 className="text-3xl font-light tracking-wide text-black">Coming Soon</h2>
              <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
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

      {/* Product grid — full bleed, 1px hairline gap (bg-gray-100 bleeds through as the separator) */}
      {products.length > 0 && (
        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100 pb-16"
          data-testid="plp-grid"
        >
          {products.map((product) => (
            <li key={product._id} className="bg-white border border-gray-100" data-testid="plp-product-card">
              <PLPCard product={product} />
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}
