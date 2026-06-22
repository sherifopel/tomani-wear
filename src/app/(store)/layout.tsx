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
      <div className="flex-1">
        {children}
        <Footer />
      </div>
    </CartProvider>
  )
}
