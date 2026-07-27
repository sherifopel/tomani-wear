import Link from 'next/link'

export const metadata = { title: 'Shipping & Returns — Tomanni' }

export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px]  text-gray-500 mb-3">Help & Support</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-12">Shipping & Returns</h1>

      {/* ── Shipping ── */}
      <section className="mb-10">
        <h2 className="text-[10px]  text-gray-500 mb-5">Shipping</h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          Orders are processed within <strong className="text-black font-medium">1–3 business days</strong>.
          Shipping times may vary during holidays or product launches.
        </p>

        <div className="border border-gray-100 divide-y divide-gray-100">
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm">Domestic</span>
            <span className="text-sm text-gray-500">2–7 business days</span>
          </div>
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm">International</span>
            <span className="text-sm text-gray-500">5–15 business days</span>
          </div>
        </div>
      </section>

      {/* ── Returns ── */}
      <section className="mb-10">
        <h2 className="text-[10px]  text-gray-500 mb-5">Returns</h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          We accept returns within <strong className="text-black font-medium">14 days of delivery</strong>.
          Returned items must meet the following conditions:
        </p>

        <ul className="flex flex-col gap-2 mb-5">
          {['Unworn', 'Unwashed', 'Original tags attached', 'In original packaging'].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-500">
          Items marked <strong className="text-black font-medium">Final Sale</strong> cannot be returned.
        </p>
      </section>

      <div className="pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Need to return something?{' '}
          <Link
            href="/contact"
            className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Contact us
          </Link>{' '}
          and our team will guide you through the process.
        </p>
      </div>
    </div>
  )
}
