import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: '404 — Page not found' },
]

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6" data-testid="not-found-page">
      <Breadcrumbs crumbs={CRUMBS} testId="not-found-breadcrumb" />

      <div className="flex flex-col items-center text-center py-20 md:py-28">

        <h1
          className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em]"
          data-testid="not-found-heading"
        >
          404 Error — Page Not Found
        </h1>

        <p
          className="mt-5 text-sm text-gray-400 max-w-sm leading-relaxed"
          data-testid="not-found-message"
        >
          Uh oh, looks like the page you are looking for has moved or no longer exists.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4" data-testid="not-found-ctas">
          <Link
            href="/"
            data-testid="not-found-home-cta"
            className="px-10 py-3.5 bg-black text-white text-xs uppercase tracking-widest rounded border border-black btn-wipe"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            data-testid="not-found-shop-cta"
            className="px-10 py-3.5 bg-white text-black text-xs uppercase tracking-widest rounded border border-black btn-wipe-white"
          >
            Shop All
          </Link>
        </div>

      </div>
    </div>
  )
}
