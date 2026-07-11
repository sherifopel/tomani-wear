'use client'

import { useState, useEffect } from 'react'
import { CurrencyContext, buildContextValue } from '@/context/CurrencyContext'
import { countryToCurrency } from '@/lib/currency'
import type { CurrencyCode, Rates } from '@/lib/currency'

const LS_KEY = 'tomanni-currency'

export default function CurrencyProvider({
  countryCode,
  children,
}: {
  countryCode: string
  children:    React.ReactNode
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('NGN')
  const [rates,    setRates]          = useState<Rates>({ USD: 0.00063, GBP: 0.00049 })

  // On mount: check localStorage for a manual override, else use detected country
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as CurrencyCode | null
    setCurrencyState(stored ?? countryToCurrency(countryCode))
  }, [countryCode])

  // Fetch live exchange rates from our own cached API route
  useEffect(() => {
    fetch('/api/exchange-rates')
      .then(r => r.json())
      .then(data => setRates(data))
      .catch(() => {}) // silent fail — fallback rates are already in state
  }, [])

  function setCurrency(c: CurrencyCode) {
    localStorage.setItem(LS_KEY, c)
    setCurrencyState(c)
  }

  return (
    <CurrencyContext.Provider value={buildContextValue(currency, setCurrency, rates)}>
      {children}
    </CurrencyContext.Provider>
  )
}
