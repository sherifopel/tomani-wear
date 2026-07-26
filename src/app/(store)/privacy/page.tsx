export const metadata = { title: 'Privacy Policy — Tomanni' }

const SECTIONS = [
  {
    title: 'What We Collect',
    body: [
      'When you create an account, we collect your name and email address via Google Sign-In.',
      'When you place an order, we collect your full name, email address, phone number, and delivery address to fulfil your order.',
      'We store your order history so you can view it in your account.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use a session cookie (next-auth.session-token) to keep you signed in. This is an HTTP-only cookie — it cannot be accessed by JavaScript and is not used for tracking.',
      'We also use a security cookie (next-auth.csrf-token) to protect against cross-site request forgery.',
      'We do not use analytics cookies, advertising cookies, or any third-party tracking technologies.',
    ],
  },
  {
    title: 'Payments',
    body: [
      'Payments are processed securely by Paystack. We never see or store your card details — they go directly to Paystack and are handled under their own security standards.',
      'We store only the Paystack transaction reference for reconciliation purposes.',
    ],
  },
  {
    title: 'How We Use Your Data',
    body: [
      'To process and fulfil your orders.',
      'To provide customer support.',
      'To allow you to view your order history.',
      'We do not sell, rent, or share your personal information with third parties for marketing purposes.',
    ],
  },
  {
    title: 'Data Storage',
    body: [
      'Your data is stored securely on Supabase (PostgreSQL), hosted in the EU. Access is restricted and your data is never sold to third parties.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'You can request deletion of your account and associated data at any time by contacting us.',
      'You can view your order history and account details in your account dashboard.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'If you have any questions about this privacy policy or how we handle your data, contact us at Tomanniworldwide@gmail.com.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px]  text-gray-500 mb-3">Legal</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-12">Last updated: July 2026</p>

      <div className="flex flex-col divide-y divide-gray-100">
        {SECTIONS.map(({ title, body }) => (
          <div key={title} className="py-7">
            <h2 className="text-[10px]  text-gray-500 mb-4">{title}</h2>
            <div className="flex flex-col gap-3">
              {body.map((paragraph, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
