import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

function getRequestSecret(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }

  return (
    request.headers.get('x-revalidate-secret') ??
    request.nextUrl.searchParams.get('secret')
  )
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET
  const requestSecret = getRequestSecret(request)

  if (!expectedSecret) {
    return Response.json(
      { revalidated: false, message: 'Missing SANITY_REVALIDATE_SECRET' },
      { status: 500 }
    )
  }

  if (requestSecret !== expectedSecret) {
    return Response.json(
      { revalidated: false, message: 'Invalid revalidation secret' },
      { status: 401 }
    )
  }

  revalidatePath('/', 'layout')
  revalidatePath('/products', 'layout')

  return Response.json({
    revalidated: true,
    paths: ['/', '/products'],
    now: Date.now(),
  })
}
