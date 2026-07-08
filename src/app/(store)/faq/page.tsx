export const metadata = { title: 'FAQ — Tomanni' }

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are processed within 1–3 business days. Delivery times vary depending on your location — domestic orders typically arrive within 2–7 business days, international within 5–15 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship to many countries worldwide. Shipping times may vary during holidays or product launches.',
  },
  {
    q: 'Can I return my order?',
    a: 'Yes. Eligible items can be returned within 14 days of delivery, provided they are unworn, unwashed, have original tags attached, and are in their original packaging. Items marked Final Sale cannot be returned.',
  },
  {
    q: 'How do I choose my size?',
    a: 'Please refer to our Size Guide before placing your order. If you are between sizes, we recommend sizing up.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order ships, you will receive a tracking number via email.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept major debit and credit cards and other secure payment methods available at checkout.',
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px]  text-gray-400 mb-3">Help & Support</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-12">
        Frequently Asked Questions
      </h1>

      <div className="flex flex-col divide-y divide-gray-100">
        {FAQS.map(({ q, a }) => (
          <div key={q} className="py-6">
            <p className="text-sm font-medium mb-2">{q}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Still have questions?{' '}
          <a
            href="/contact"
            className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  )
}
