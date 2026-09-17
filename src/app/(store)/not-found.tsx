import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: '404 — Page not found' },
]

export default function StoreNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6" data-testid="not-found-page">
      <Breadcrumbs crumbs={CRUMBS} testId="not-found-breadcrumb" />

      <div className="flex flex-col items-center text-center py-20 md:py-28">
        <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">
          404 — Page Not Found
        </p>

        <h1
          className="text-3xl md:text-4xl font-light tracking-wide"
          data-testid="not-found-heading"
        >
          You got lost.
          <br />
          <span className="font-medium">The collection didn&apos;t.</span>
        </h1>

        <p
          className="mt-5 text-sm text-gray-500 max-w-xs leading-relaxed"
          data-testid="not-found-message"
        >
          This page doesn&apos;t exist — but everything else is right where you left it.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4" data-testid="not-found-ctas">
          <Link
            href="/"
            data-testid="not-found-home-cta"
            className="px-10 py-3.5 bg-black text-white text-xs  rounded border border-black btn-wipe"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            data-testid="not-found-shop-cta"
            className="px-10 py-3.5 bg-white text-black text-xs  rounded border border-black btn-wipe-white"
          >
            Shop All
          </Link>
        </div>
      </div>
    </div>
  )
}
