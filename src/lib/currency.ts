export type CurrencyCode = 'NGN' | 'USD' | 'GBP'

export type Currency = {
  code:   CurrencyCode
  symbol: string
  label:  string
}

export const CURRENCIES: Currency[] = [
  { code: 'NGN', symbol: '₦', label: 'NGN' },
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
]

// Map a country code to the default display currency
export function countryToCurrency(country: string): CurrencyCode {
  if (country === 'NG') return 'NGN'
  if (country === 'GB') return 'GBP'
  return 'USD' // default for US, CA, DE, AU, everywhere else
}

// Rates are NGN → other currencies, e.g. { USD: 0.00063, GBP: 0.00049 }
export type Rates = Record<string, number>

export function formatPrice(amountNgn: number, currency: CurrencyCode, rates: Rates): string {
  if (currency === 'NGN') {
    return `₦${Math.round(amountNgn).toLocaleString()}`
  }
  const rate = rates[currency]
  if (!rate) return `₦${Math.round(amountNgn).toLocaleString()}`

  const converted = amountNgn * rate
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? currency

  // Format with 2 decimal places for foreign currencies
  return `${symbol}${converted.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
