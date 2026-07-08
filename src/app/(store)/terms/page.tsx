export const metadata = { title: 'Terms & Conditions — Tomanni' }

const TERMS = [
  'By accessing this website, you agree to these Terms and Conditions.',
  'Prices and product availability may change without notice.',
  'We reserve the right to refuse or cancel orders where necessary.',
  'Customers are responsible for providing accurate shipping information.',
  'All website content, including images, logos, and designs, remains the property of Tomanni and may not be reproduced without permission.',
]

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px]  text-gray-400 mb-3">Legal</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Terms & Conditions</h1>
      <p className="text-xs text-gray-400 mb-10">Last updated: July 2026</p>

      <div className="flex flex-col gap-5">
        {TERMS.map((term, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="text-[10px] text-gray-300 mt-0.5 shrink-0 w-4">{i + 1}.</span>
            <p className="text-sm text-gray-600 leading-relaxed">{term}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Questions?{' '}
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
