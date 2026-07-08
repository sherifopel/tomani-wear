import Link from 'next/link'

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Wishlist</h1>
      <div className="border border-dashed border-gray-200 px-6 py-16 text-center">
        <p className="text-sm text-gray-400 mb-1">Wishlist coming soon.</p>
        <p className="text-xs text-gray-300 mb-6">
          Save items here and come back to them anytime.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-black text-white text-xs  border border-black btn-wipe"
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}
