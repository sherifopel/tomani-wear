// ─── Cart types ───────────────────────────────────────────────────────────────
// A CartItem is one line in the cart — a specific product in a specific size.
// If you add the same product + size twice, the quantity goes up, not a new row.

export type CartItem = {
  productId: string
  slug: string
  name: string
  image?: string
  price: number        // price at the time it was added (in Naira)
  size: string
  colorName?: string   // only set when the product has colour variants
  quantity: number
}

export type CartState = {
  items: CartItem[]
}

// Derived values computed from CartState — not stored, just calculated
export type CartDerived = {
  totalItems: number   // sum of all quantities
  totalPrice: number   // sum of (price × quantity) for each item
}
