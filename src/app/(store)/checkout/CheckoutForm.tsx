'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePaystackPayment } from 'react-paystack'
import { useCartContext } from '@/context/CartContext'
import { pixel } from '@/lib/pixel'
import type { SavedDetails } from './page'

const inputClass = `
  w-full px-4 py-3 border border-gray-300 rounded text-sm
  focus:outline-none focus:border-black transition-colors duration-200
`

const labelClass = 'text-[12px] text-black'

// ── Delivery zones (shipping from Lagos) ────────────────────────────────────
// Normalised state names are matched case-insensitively against user input.
const DELIVERY_ZONES: Array<{ states: string[]; fee: number; label: string }> = [
  {
    fee:    2500,
    label:  'Lagos (same city)',
    states: ['lagos'],
  },
  {
    fee:    7000,
    label:  'Remote delivery',
    states: ['adamawa', 'bauchi', 'borno', 'gombe', 'taraba', 'yobe'],
  },
  {
    fee:    4000,
    label:  'Interstate delivery',
    states: [
      'ogun', 'oyo', 'osun', 'ondo', 'ekiti',
      'delta', 'edo', 'rivers', 'anambra', 'imo', 'abia',
      'cross river', 'akwa ibom', 'bayelsa', 'enugu', 'ebonyi',
      'abuja', 'fct', 'federal capital territory',
      'kwara', 'kogi', 'niger', 'benue', 'plateau', 'nasarawa',
      'kano', 'kaduna', 'katsina', 'sokoto', 'kebbi', 'zamfara', 'jigawa',
    ],
  },
]

function getDeliveryFee(state: string, totalPrice: number): number | null {
  if (totalPrice >= 50000) return 0  // free nationwide on orders over ₦50,000
  const s = state.trim().toLowerCase()
  if (!s) return null
  for (const zone of DELIVERY_ZONES) {
    if (zone.states.some(z => s === z || s.startsWith(z) || z.startsWith(s))) {
      return zone.fee
    }
  }
  return 4000 // default interstate for any unrecognised state
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={htmlFor} className={labelClass}>{children}</label>
      <span className="text-[12px] text-gray-400">Required</span>
    </div>
  )
}

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
  const [promoInput,   setPromoInput]   = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError,   setPromoError]   = useState('')
  const [applied, setApplied] = useState<{ code: string; percentage: number; amount: number } | null>(null)

  // Pre-fill all fields from session + saved delivery details on first load.
  // Uses || so that any field the user has already typed into is never overwritten.
  useEffect(() => {
    const user = session?.user
    if (!user) return
    setForm(prev => ({
      ...prev,
      fullName: prev.fullName || user.name  || '',
      email:    prev.email    || user.email || '',
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

  const discountAmount  = applied ? Math.round(totalPrice * applied.percentage / 100) : 0
  const discountedPrice = totalPrice - discountAmount
  const deliveryFee     = getDeliveryFee(form.state, discountedPrice)
  const grandTotal      = discountedPrice + (deliveryFee ?? 0)

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

  // Fire InitiateCheckout once when checkout page loads
  useEffect(() => { pixel.initiateCheckout(grandTotal) }, [grandTotal])

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

  async function applyPromo() {
    const code = promoInput.trim().toUpperCase()
    if (!code) { setPromoError('Please enter a discount code'); return }
    setPromoLoading(true)
    setPromoError('')
    try {
      const res  = await fetch('/api/discount/validate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.valid) {
        const amount = Math.round(totalPrice * data.percentage / 100)
        setApplied({ code: data.code, percentage: data.percentage, amount })
        setPromoInput('')
      } else {
        setPromoError(data.message ?? 'Invalid code')
      }
    } catch {
      setPromoError('Could not apply code — please try again')
    } finally {
      setPromoLoading(false)
    }
  }

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
        discountCode:   applied?.code         ?? null,
        discountAmount: applied?.amount        ?? null,
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
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name'
    if (!form.email.trim()) {
      e.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address'
    }
    if (!form.phone.trim()) {
      e.phone = 'Please enter your phone number'
    } else if (!/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      e.phone = 'Please enter a valid Nigerian phone number (e.g. 08012345678)'
    }
    if (!form.address.trim()) e.address = 'Please enter your street address'
    if (!form.city.trim()) e.city = 'Please enter your city'
    if (!form.state.trim()) e.state = 'Please enter your state'
    if (!form.country.trim()) e.country = 'Please enter your country'
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
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] lg:gap-16">

        {/* ── LEFT: Customer details ── order-2 on mobile so summary appears first ── */}
        <div className="order-2 lg:order-1 flex flex-col gap-10">

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-light mb-6" data-testid="checkout-section-contact">
              Contact Information
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <RequiredLabel htmlFor="fullName">Full Name</RequiredLabel>
                <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange}
                  className={inputClass} data-testid="checkout-full-name" />
                {errors.fullName && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-fullName">{errors.fullName}</p>}
              </div>

              <div>
                <RequiredLabel htmlFor="email">Email</RequiredLabel>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                  className={inputClass} data-testid="checkout-email" />
                {errors.email && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-email">{errors.email}</p>}
              </div>
              <div>
                <RequiredLabel htmlFor="phone">Phone Number</RequiredLabel>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                  className={inputClass} data-testid="checkout-phone" />
                {errors.phone && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-phone">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h2 className="text-2xl font-light mb-6" data-testid="checkout-section-delivery">
              Delivery Address
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <RequiredLabel htmlFor="address">Street Address</RequiredLabel>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
                  className={inputClass} data-testid="checkout-address" />
                {errors.address && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-address">{errors.address}</p>}
              </div>

              <div>
                <RequiredLabel htmlFor="city">City</RequiredLabel>
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange}
                  className={inputClass} data-testid="checkout-city" />
                {errors.city && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-city">{errors.city}</p>}
              </div>
              <div>
                <RequiredLabel htmlFor="state">State</RequiredLabel>
                <input id="state" name="state" type="text" value={form.state} onChange={handleChange}
                  className={inputClass} data-testid="checkout-state" />
                {errors.state && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-state">{errors.state}</p>}
              </div>

              <div>
                <RequiredLabel htmlFor="country">Country</RequiredLabel>
                <input id="country" name="country" type="text" value={form.country} onChange={handleChange}
                  className={inputClass} data-testid="checkout-country" />
                {errors.country && <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-country">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div data-testid="checkout-section-payment">
            <h2 className="text-2xl font-light mb-6">Payment</h2>
            <div className="flex flex-col gap-5">
              <p className="text-xs text-gray-400 leading-relaxed">
                You'll be taken to Paystack to complete your payment. Your card details are never stored by Tomanni.
              </p>
              <button
                type="submit"
                disabled={loading}
                data-testid="checkout-pay-button"
                className="w-full flex items-center justify-center bg-black text-white text-xs py-4 rounded border border-black btn-wipe disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing…' : `Pay ₦${grandTotal.toLocaleString()} with Paystack`}
              </button>
              <p className="text-center text-[10px] text-gray-400">
                Secured by Paystack · 256-bit SSL encryption
              </p>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Order summary — first on mobile, right column on desktop ── */}
        <div className="order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-light" data-testid="checkout-section-summary">
              Order Summary
            </h2>
            <Link href="/cart" className="text-[11px] text-gray-400 hover:text-black underline underline-offset-2 transition-colors duration-150" data-testid="checkout-edit-cart">
              Edit cart
            </Link>
          </div>

          <div className="border border-gray-200 rounded p-6">
            <ul className="flex flex-col gap-4 mb-6" data-testid="checkout-items">
              {items.map(item => (
                <li key={`${item.productId}-${item.size}`} className="flex items-start gap-4" data-testid="checkout-item">
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
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light leading-snug truncate" data-testid="checkout-item-name">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-400 mt-0.5" data-testid="checkout-item-size">Size: {item.size}</p>}
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-400" data-testid="checkout-item-qty">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium" data-testid="checkout-item-price">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ── Promo code ── */}
            <div className="border-t border-gray-100 pt-4 mb-4" data-testid="checkout-promo">
              {applied ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-medium" data-testid="checkout-promo-applied">
                    {applied.code} — {applied.percentage}% off
                  </span>
                  <button
                    type="button"
                    onClick={() => setApplied(null)}
                    className="text-xs text-gray-400 hover:text-black transition-colors duration-150 underline underline-offset-2"
                    data-testid="checkout-promo-remove"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors duration-200"
                    data-testid="checkout-promo-input"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={promoLoading}
                    className="px-4 py-2 border border-black text-xs rounded hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
                    data-testid="checkout-promo-apply"
                  >
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5" data-testid="checkout-promo-error">{promoError}</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-500" data-testid="checkout-subtotal">
                <span>Subtotal</span><span>₦{totalPrice.toLocaleString()}</span>
              </div>
              {applied && (
                <div className="flex justify-between text-green-600" data-testid="checkout-discount">
                  <span>Discount ({applied.percentage}%)</span>
                  <span>−₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500" data-testid="checkout-delivery">
                <span>Delivery</span>
                <span>{deliveryFee === null ? 'Enter your state' : deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-medium text-base border-t border-gray-100 pt-3" data-testid="checkout-total">
                <span>Total</span><span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Mobile sticky pay bar — hidden on lg+ where the desktop button is visible ── */}
      <div
        data-testid="checkout-mobile-bar"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden"
      >
        <button
          type="submit"
          disabled={loading}
          data-testid="checkout-pay-button-mobile"
          className="w-full flex items-center justify-center bg-black text-white text-xs py-4 border border-black btn-wipe disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing…' : `Pay ₦${grandTotal.toLocaleString()} with Paystack`}
        </button>
      </div>

    </form>
  )
}
