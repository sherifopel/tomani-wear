'use client'

import dynamic from 'next/dynamic'
import type { SavedDetails } from './page'

// react-paystack accesses `window` at module load time — SSR crashes without this.
// `ssr: false` is only allowed in Client Components, so this wrapper exists purely
// to sit between the Server Component page and the actual CheckoutForm.
const CheckoutForm = dynamic(() => import('./CheckoutForm'), { ssr: false })

export default function CheckoutClient({ savedDetails }: { savedDetails: SavedDetails }) {
  return <CheckoutForm savedDetails={savedDetails} />
}
