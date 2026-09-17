import { client } from '@/sanity/client'
import { PRODUCTS_QUERY } from '@/sanity/queries'
import CartPageClient from './CartPageClient'

export default async function CartPage() {
  const products = await client.fetch(PRODUCTS_QUERY)
  return <CartPageClient featuredProducts={products.slice(0, 4)} />
}
