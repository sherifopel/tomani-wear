import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MiniCart from '@/components/MiniCart'
import { CartProvider } from '@/context/CartContext'
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
        <Navbar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <MiniCart />
      </CartProvider>
  )
}
