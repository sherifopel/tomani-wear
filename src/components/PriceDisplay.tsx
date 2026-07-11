'use client'

import { useCurrency } from '@/context/CurrencyContext'

export default function PriceDisplay({
  priceNgn,
  className,
  'data-testid': testId,
}: {
  priceNgn:        number
  className?:      string
  'data-testid'?:  string
}) {
  const { formatPrice } = useCurrency()
  return <span className={className} data-testid={testId}>{formatPrice(priceNgn)}</span>
}
