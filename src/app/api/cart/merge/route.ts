import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { CartItem } from '@/types/cart'

// POST /api/cart/merge
// Called by CartContext when a guest session becomes authenticated.
// Merges the guest's localStorage cart into the user's saved DB cart.
// Returns the full merged cart so the client can hydrate from it.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const userId = session.user.id
  const { items }: { items: CartItem[] } = await req.json()

  // Upsert each guest item into the DB cart.
  // @@unique([userId, productId, size]) means we can safely upsert —
  // if the item already exists, increment its quantity; otherwise create it.
  await Promise.all(
    items.map((item) =>
      prisma.cartItem.upsert({
        where: {
          userId_productId_size: {
            userId,
            productId: item.productId,
            size:      item.size ?? '',
          },
        },
        update: {
          quantity: item.quantity,
        },
        create: {
          userId,
          productId: item.productId,
          name:      item.name,
          priceNgn:  item.price,
          size:      item.size ?? '',
          quantity:  item.quantity,
        },
      })
    )
  )

  // Return the full merged cart so the client can hydrate
  const saved = await prisma.cartItem.findMany({ where: { userId } })

  const merged: CartItem[] = saved.map((row) => ({
    productId: row.productId,
    slug:      row.productId, // slug not stored in DB — productId is used as fallback
    name:      row.name,
    price:     row.priceNgn,
    size:      row.size ?? '',
    quantity:  row.quantity,
  }))

  return NextResponse.json(merged)
}
