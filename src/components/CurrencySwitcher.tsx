'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { CURRENCIES, CurrencyCode } from '@/lib/currency'
import FlagCircle, { type FlagCode } from '@/components/FlagCircle'

const SHORT_LABEL: Record<CurrencyCode, string> = {
  NGN: 'NG | NGN',
  USD: 'US | USD',
  GBP: 'UK | GBP',
}

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calculate position each time the dropdown opens (viewport-relative for position:fixed)
  useEffect(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 8, left: rect.left })
  }, [open])

  // Close on outside click — check both the button and the dropdown
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (buttonRef.current?.contains(t)) return
      if (dropdownRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        aria-label="Switch currency"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
      >
        <FlagCircle code={currency as FlagCode} size={24} />
        <span className="text-[12px] font-medium text-black tracking-wide">
          {SHORT_LABEL[currency]}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`text-black transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* position:fixed escapes overflow:hidden without needing a portal */}
      {open && (
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-gray-200 shadow-lg min-w-[150px]"
        >
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code as CurrencyCode); setOpen(false) }}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-[11px] transition-colors duration-150 hover:bg-gray-50 ${
                currency === c.code ? 'font-semibold text-black' : 'text-gray-500'
              }`}
            >
              <FlagCircle code={c.code as FlagCode} size={20} />
              {SHORT_LABEL[c.code as CurrencyCode]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
