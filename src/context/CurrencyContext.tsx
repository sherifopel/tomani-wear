'use client'

import { createContext, useContext } from 'react'
import type { CurrencyCode, Rates } from '@/lib/currency'
import { formatPrice as _formatPrice } from '@/lib/currency'

type CurrencyContextValue = {
  currency:    CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  formatPrice: (amountNgn: number) => string
}

export const CurrencyContext = createContext<CurrencyContextValue>({
  currency:    'NGN',
  setCurrency: () => {},
  formatPrice: (n) => `₦${Math.round(n).toLocaleString()}`,
})

export function useCurrency() {
  return useContext(CurrencyContext)
}

// Convenience: build the context value from state that lives in CurrencyProvider
export function buildContextValue(
  currency: CurrencyCode,
  setCurrency: (c: CurrencyCode) => void,
  rates: Rates,
): CurrencyContextValue {
  return {
    currency,
    setCurrency,
    formatPrice: (amountNgn: number) => _formatPrice(amountNgn, currency, rates),
  }
}
