import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Returns</h1>
      <div className="border border-dashed border-gray-200 px-6 py-16 text-center">
        <p className="text-sm text-gray-500 mb-1">Online returns coming soon.</p>
        <p className="text-xs text-gray-300 mb-6">
          For now, contact us directly to arrange a return.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-black text-white text-xs  border border-black btn-wipe"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
