// Meta Pixel event helpers.
// Call these from anywhere in the app — they safely no-op if the pixel isn't loaded.

function fire(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}

export const pixel = {
  viewContent: (name: string, price: number) =>
    fire('ViewContent', { content_name: name, value: price, currency: 'NGN' }),

  addToCart: (name: string, price: number) =>
    fire('AddToCart', { content_name: name, value: price, currency: 'NGN' }),

  purchase: (orderId: string, total: number) =>
    fire('Purchase', { order_id: orderId, value: total, currency: 'NGN' }),

  initiateCheckout: (total: number) =>
    fire('InitiateCheckout', { value: total, currency: 'NGN' }),
}
