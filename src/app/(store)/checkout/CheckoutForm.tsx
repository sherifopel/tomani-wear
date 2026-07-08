'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePaystackPayment } from 'react-paystack'
import { useCartContext } from '@/context/CartContext'
import type { SavedDetails } from './page'

const inputClass = `
  w-full px-4 py-3 border border-gray-300 rounded text-sm
  focus:outline-none focus:border-black transition-colors duration-200
`

const labelClass = 'block text-[11px] uppercase tracking-widest text-gray-500 mb-1.5'

type FormState = {
  fullName: string
  email:    string
  phone:    string
  address:  string
  city:     string
  state:    string
  country:  string
}

const EMPTY_FORM: FormState = {
  fullName: '', email: '', phone: '',
  address: '', city: '', state: '', country: 'Nigeria',
}

export default function CheckoutForm({ savedDetails }: { savedDetails: SavedDetails }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, totalPrice } = useCartContext()
  const [form, setForm]     = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)

  // Pre-fill all fields from session + saved delivery details on first load.
  // Uses || so that any field the user has already typed into is never overwritten.
  useEffect(() => {
    if (!session?.user) return
    setForm(prev => ({
      ...prev,
      fullName: prev.fullName || session.user.name  || '',
      email:    prev.email    || session.user.email || '',
      phone:    prev.phone    || savedDetails?.phone   || '',
      address:  prev.address  || savedDetails?.address || '',
      city:     prev.city     || savedDetails?.city    || '',
      state:    prev.state    || savedDetails?.state   || '',
      country:  prev.country  || savedDetails?.country || 'Nigeria',
    }))
  }, [session, savedDetails])

  // Redirect to cart if empty — lives here because page.tsx is a server component
  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  if (items.length === 0) return null

  const deliveryFee: number = 0
  const grandTotal = totalPrice + deliveryFee

  const paystackConfig = {
    reference: `TW-${Date.now()}`,
    email:     form.email || 'noemail@placeholder.com',
    amount:    grandTotal * 100,
    currency:  'NGN',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '',
    metadata: {
      custom_fields: [
        { display_name: 'Full Name', variable_name: 'full_name', value: form.fullName },
        { display_name: 'Phone',     variable_name: 'phone',     value: form.phone    },
      ],
    },
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  // Test hook — lets Playwright call onSuccess without opening the iframe.
  // Never runs in production because Next.js removes non-prod env vars at build time.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    const w = window as Window & { __paystackSuccess?: (ref: string) => void }
    w.__paystackSuccess = (ref: string) => {
      onSuccess({ reference: ref })
    }
    return () => { delete w.__paystackSuccess }
  })

  function onSuccess(response: { reference: string }) {
    setLoading(true)
    // Save delivery details back to the user's profile in the background.
    // Fire-and-forget — we don't block the confirmation redirect on this.
    if (session?.user) {
      fetch('/api/user/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone:   form.phone,
          address: form.address,
          city:    form.city,
          state:   form.state,
          country: form.country,
        }),
      }).catch(() => {})
    }

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paystackReference: response.reference,
        totalAmount:       grandTotal,
        customerName:      form.fullName,
        customerEmail:     form.email,
        customerPhone:     form.phone,
        address:           form.address,
        city:              form.city,
        state:             form.state,
        country:           form.country,
        items: items.map(i => ({
          productId: i.productId,
          name:      i.name,
          size:      i.size,
          quantity:  i.quantity,
          price:     i.price,
          image:     i.image ?? '',
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const orderParam = data.orderNumber ? `&order=${data.orderNumber}` : ''
        const nameParam  = form.fullName ? `&name=${encodeURIComponent(form.fullName)}` : ''
        const emailParam = form.email    ? `&email=${encodeURIComponent(form.email)}`   : ''
        router.push(`/order-confirmation?ref=${response.reference}${orderParam}${nameParam}${emailParam}`)
      })
      .catch(() => {
        router.push(`/order-confirmation?ref=${response.reference}`)
      })
      .finally(() => setLoading(false))
  }

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    initializePayment({
      onSuccess,
      onClose: () => {},
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-16">

        {/* ── LEFT: Customer details ── */}
        <div>
          <h2 className="text-xs uppercase tracking-widest font-medium mb-6" data-testid="checkout-section-contact">
            Contact Information
          </h2>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="fullName" className={labelClass}>Full Name</label>
              <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange}
                placeholder="Tomiwa Adeyemi" className={inputClass} data-testid="checkout-full-name" />
              {errors.fullName && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-fullName">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="tomiwa@example.com" className={inputClass} data-testid="checkout-email" />
                {errors.email && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-email">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+234 800 000 0000" className={inputClass} data-testid="checkout-phone" />
                {errors.phone && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-phone">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <h2 className="text-xs uppercase tracking-widest font-medium mt-10 mb-6" data-testid="checkout-section-delivery">
            Delivery Address
          </h2>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="address" className={labelClass}>Street Address</label>
              <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
                placeholder="12 Lagos-Ibadan Expressway" className={inputClass} data-testid="checkout-address" />
              {errors.address && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-address">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange}
                  placeholder="Lagos" className={inputClass} data-testid="checkout-city" />
                {errors.city && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-city">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>State</label>
                <input id="state" name="state" type="text" value={form.state} onChange={handleChange}
                  placeholder="Lagos State" className={inputClass} data-testid="checkout-state" />
                {errors.state && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-state">{errors.state}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="country" className={labelClass}>Country</label>
              <input id="country" name="country" type="text" value={form.country} onChange={handleChange}
                className={inputClass} data-testid="checkout-country" />
              {errors.country && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-country">{errors.country}</p>}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Order summary ── */}
        <div className="mt-12 lg:mt-0">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs uppercase tracking-widest font-medium" data-testid="checkout-section-summary">
              Order Summary
            </h2>
            <Link href="/cart" className="text-[11px] text-gray-400 hover:text-black underline underline-offset-2 transition-colors duration-150" data-testid="checkout-edit-cart">
              Edit cart
            </Link>
          </div>

          <ul className="flex flex-col gap-4 mb-6" data-testid="checkout-items">
            {items.map(item => (
              <li key={`${item.productId}-${item.size}`} className="flex gap-4" data-testid="checkout-item">
                <div className="relative w-16 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light leading-snug truncate" data-testid="checkout-item-name">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5" data-testid="checkout-item-size">Size: {item.size}</p>
                  <p className="text-sm font-medium mt-1" data-testid="checkout-item-price">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-gray-500" data-testid="checkout-subtotal">
              <span>Subtotal</span><span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500" data-testid="checkout-delivery">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-medium text-base border-t border-gray-100 pt-3" data-testid="checkout-total">
              <span>Total</span><span>₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} data-testid="checkout-pay-button"
            className="hidden lg:flex w-full mt-6 items-center justify-center bg-black text-white text-xs uppercase tracking-widest py-4 rounded border border-black btn-wipe disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing…' : `Pay ₦${grandTotal.toLocaleString()} with Paystack`}
          </button>
          <p className="hidden lg:block text-center text-[10px] text-gray-400 mt-3">
            Secured by Paystack · 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* Mobile sticky pay button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 z-50" data-testid="checkout-mobile-bar">
        <button type="submit" disabled={loading} data-testid="checkout-pay-button-mobile"
          className="w-full flex items-center justify-center bg-black text-white text-xs uppercase tracking-widest py-4 rounded border border-black btn-wipe disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Processing…' : `Pay ₦${grandTotal.toLocaleString()}`}
        </button>
      </div>
    </form>
  )
}
