import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Navbar />
      {/*
       * Mobile: main IS the scroll container.
       *   - Fixed height = viewport minus sticky header (84px / 5.25rem).
       *   - overflow-y-scroll + snap-y snap-mandatory = page-by-page magnetic
       *     snap between Hero → New Arrivals → Footer.
       *   - overscroll-y-contain stops iOS rubber-band escaping to the document.
       *
       * Desktop: snap disabled; main grows (flex-1) and the browser page scrolls.
       */}
      <main
        className="
          h-[calc(100vh-5.25rem)] md:h-auto
          overflow-y-scroll md:overflow-visible
          overscroll-y-contain md:overscroll-auto
          snap-y snap-mandatory md:snap-none
          md:flex-1
        "
      >
        {children}
        <Footer />
      </main>
    </CartProvider>
  )
}
