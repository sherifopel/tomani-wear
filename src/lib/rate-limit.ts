import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// One Redis client shared across all rate limiters in this process.
// Falls back gracefully when env vars are not set (local dev without Upstash).
function makeRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = makeRedis()

// Pre-built limiters for each use case.
// sliding window = fairest for APIs: the window moves with each request,
// not resetting on a fixed clock boundary.
export const limiters = redis
  ? {
      // 5 discount code attempts per IP per 60 seconds
      discount: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60s'),
        prefix:  'rl:discount',
      }),

      // 10 order submissions per IP per 60 seconds
      orders: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60s'),
        prefix:  'rl:orders',
      }),
    }
  : null

// Call this at the top of any route handler.
// Returns a 429 Response if the limit is exceeded, or null if the request is allowed.
export async function checkRateLimit(
  req: NextRequest,
  limiter: Ratelimit,
): Promise<NextResponse | null> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'

  const { success, limit, remaining, reset } = await limiter.limit(ip)

  if (!success) {
    const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a moment and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After':          String(retryAfterSeconds),
          'X-RateLimit-Limit':    String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':    String(reset),
        },
      },
    )
  }

  return null
}
