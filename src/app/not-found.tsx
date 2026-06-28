import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center"
      data-testid="not-found-page"
    >
      <p
        className="text-[120px] md:text-[180px] font-bold leading-none tracking-tight text-gray-100 select-none"
        data-testid="not-found-number"
        aria-hidden="true"
      >
        404
      </p>

      <h1
        className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] -mt-4 md:-mt-8"
        data-testid="not-found-heading"
      >
        Page Not Found
      </h1>

      <p
        className="mt-4 text-sm text-gray-400 max-w-sm"
        data-testid="not-found-message"
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4" data-testid="not-found-ctas">
        <Link
          href="/"
          data-testid="not-found-home-cta"
          className="px-8 py-3.5 bg-black text-white text-xs uppercase tracking-widest rounded border border-black btn-wipe"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          data-testid="not-found-shop-cta"
          className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-widest rounded border border-black btn-wipe-white"
        >
          Shop All
        </Link>
      </div>
    </div>
  )
}
