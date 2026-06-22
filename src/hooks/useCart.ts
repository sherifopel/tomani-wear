// Components import useCart from here — never directly from CartContext.
// This keeps the import path clean and lets us swap the implementation later
// without touching every component.
export { useCartContext as useCart } from '@/context/CartContext'
