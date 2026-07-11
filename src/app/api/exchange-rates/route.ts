import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache for 1 hour

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/NGN', {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error('Exchange rate fetch failed')

    const data = await res.json()

    return NextResponse.json({
      USD: data.rates?.USD ?? 0.00063,
      GBP: data.rates?.GBP ?? 0.00049,
    })
  } catch {
    // Fallback rates if the API is down (approximate as of mid-2025)
    return NextResponse.json({ USD: 0.00063, GBP: 0.00049 })
  }
}
