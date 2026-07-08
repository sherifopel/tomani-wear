export type OrderStatus = 'processing' | 'dispatched' | 'delivered' | 'cancelled' | 'returned'

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    processing: 'Processing',
    dispatched: 'Dispatched',
    delivered:  'Delivered',
    cancelled:  'Cancelled',
    returned:   'Returned',
  }
  return map[status] ?? status
}

export function statusColour(status: string): string {
  switch (status) {
    case 'processing': return 'text-amber-600 bg-amber-50'
    case 'dispatched': return 'text-blue-600 bg-blue-50'
    case 'delivered':  return 'text-green-600 bg-green-50'
    case 'cancelled':  return 'text-red-500 bg-red-50'
    case 'returned':   return 'text-gray-500 bg-gray-100'
    default:           return 'text-gray-500 bg-gray-100'
  }
}
