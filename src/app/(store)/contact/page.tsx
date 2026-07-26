export const metadata = { title: 'Contact Us — Tomanni' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px]  text-gray-500 mb-3">Get in Touch</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Contact Us</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        Our support team is here to help. Reach us through any of the channels below.
      </p>

      <div className="flex flex-col divide-y divide-gray-100">

        <div className="py-6">
          <p className="text-[10px]  text-gray-300 mb-2">Email</p>
          <a
            href="mailto:Tomanniworldwide@gmail.com"
            className="text-sm text-black hover:opacity-60 transition-opacity"
          >
            Tomanniworldwide@gmail.com
          </a>
        </div>

        <div className="py-6">
          <p className="text-[10px]  text-gray-300 mb-2">WhatsApp</p>
          <a
            href="https://wa.link/jkd3h9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black hover:opacity-60 transition-opacity"
          >
            Message us on WhatsApp
          </a>
        </div>

        <div className="py-6">
          <p className="text-[10px]  text-gray-300 mb-2">Instagram</p>
          <a
            href="https://www.instagram.com/tomanniofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black hover:opacity-60 transition-opacity"
          >
            @tomanniofficial
          </a>
        </div>

        <div className="py-6">
          <p className="text-[10px]  text-gray-300 mb-2">Business Hours</p>
          <p className="text-sm text-gray-600">Monday – Friday</p>
          <p className="text-sm text-gray-600">9:00 AM – 5:00 PM</p>
        </div>

      </div>
    </div>
  )
}
