import Link from 'next/link'

export default function AddressesPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Addresses</h1>
      <div className="border border-dashed border-gray-200 px-6 py-16 text-center">
        <p className="text-sm text-gray-400 mb-1">Saved addresses coming soon.</p>
        <p className="text-xs text-gray-300 mb-6">
          Your delivery address is saved automatically when you place an order.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-black text-white text-xs  border border-black btn-wipe"
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}
