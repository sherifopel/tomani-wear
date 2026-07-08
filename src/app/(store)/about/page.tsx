export const metadata = { title: 'Our Story — Tomanni' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Tomanni</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-12">Our Story</h1>

      <section className="mb-12">
        <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Mission</h2>
        <p className="text-sm text-gray-600 leading-loose">
          Our mission is to create premium streetwear that celebrates culture, inspires confidence,
          and brings people together. Through thoughtful design and a commitment to giving back,
          we aim to use fashion as a force for positive change — supporting communities and
          creating opportunities that make a lasting impact.
        </p>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Vision</h2>
        <p className="text-sm text-gray-600 leading-loose">
          Our vision is to build a globally recognised streetwear brand that unites people through
          creativity, culture, and purpose. We aspire to prove that fashion can inspire change,
          empower communities, and contribute to a better world.
        </p>
      </section>
    </div>
  )
}
