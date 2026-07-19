'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PostHogPageView() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) posthog.capture('$pageview', { $current_url: url })
    })
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key || typeof window === 'undefined') return

    // WebKit builds may have navigator.storage but lack persisted() — polyfill both gaps
    if (!('storage' in navigator) || typeof navigator.storage?.persisted !== 'function') {
      Object.defineProperty(navigator, 'storage', {
        value:        { persisted: () => Promise.resolve(false), persist: () => Promise.resolve(false) },
        configurable: true,
        writable:     true,
      })
    }

    import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(key, {
          api_host:          process.env.NEXT_PUBLIC_POSTHOG_HOST,
          ui_host:           'https://eu.posthog.com',
          capture_pageview:  false,
          capture_pageleave: true,
          session_recording: { maskAllInputs: true },
        })
      }
    })
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
