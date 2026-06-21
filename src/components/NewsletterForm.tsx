'use client'

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email"
        className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-white transition-colors duration-200 w-full"
      />
      <button
        type="submit"
        className="border border-white text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-colors duration-300 w-full"
      >
        Subscribe
      </button>
    </form>
  )
}
