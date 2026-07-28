'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { statusLabel } from '@/lib/orderStatus'

const STATUSES = ['processing', 'dispatched', 'delivered', 'cancelled', 'returned'] as const

export default function AdminOrderActions({
  orderId,
  currentStatus,
  currentTracking,
  currentPhone,
  currentAddress,
  currentCity,
  currentState,
  currentCountry,
}: {
  orderId:         string
  currentStatus:   string
  currentTracking: string
  currentPhone:    string
  currentAddress:  string
  currentCity:     string
  currentState:    string
  currentCountry:  string
}) {
  const router = useRouter()
  const [status,   setStatus]   = useState(currentStatus)
  const [tracking, setTracking] = useState(currentTracking)
  const [phone,    setPhone]    = useState(currentPhone)
  const [address,  setAddress]  = useState(currentAddress)
  const [city,     setCity]     = useState(currentCity)
  const [state,    setState]    = useState(currentState)
  const [country,  setCountry]  = useState(currentCountry)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/orders/${orderId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status, trackingNumber: tracking, address, city, state, country, customerPhone: phone }),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = 'w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-800 focus:bg-white transition-colors'
  const labelClass = 'text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5'

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Update Order</h2>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4">

        <div>
          <label className={labelClass}>Order Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
            {STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Tracking Number <span className="text-zinc-300 normal-case font-normal">(optional)</span>
          </label>
          <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="e.g. GIG-123456789" className={inputClass} />
        </div>

        <div className="border-t border-zinc-100 pt-4">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Delivery Address</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 08012345678" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Street Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 12 Broad Street" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Lagos" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Lagos State" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Nigeria" className={inputClass} />
            </div>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide transition-all disabled:opacity-50 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-zinc-900 text-white hover:bg-zinc-700'
          }`}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>

      </div>
    </div>
  )
}
