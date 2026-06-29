'use client'

/**
 * Noble Panacea-style scroll-collapse header — full implementation.
 *
 * Sections and behaviour per breakpoint:
 *
 *  Mobile (<960px):
 *    - Announcement bar  → collapses on scroll down
 *    - Main header row   → always visible (hamburger + cart must stay reachable)
 *
 *  Desktop (≥960px):
 *    - Announcement bar  → collapses on scroll down
 *    - Main header row   → also collapses; logo fades out simultaneously
 *    - Category nav      → always visible, becomes the sole header in compact mode
 *
 * Constants:
 *   ENTER_THRESHOLD  100px  — how far down before compact activates
 *   EXIT_DELTA        50px  — how far up (from last downward position) to re-expand
 *   JITTER             5px  — ignore micro-movements
 *   TRANSITION_MS    300ms  — CSS transition duration (must match Tailwind class below)
 *   DESKTOP_BP       960px  — matches np-medium-tablet
 *
 * The "second header" fix:
 *   When compact state changes, the header height changes by ~128px (announcement bar
 *   + main row). Because position:sticky elements occupy document flow, this height
 *   change shifts content, which the browser's scroll anchor compensates for by
 *   adjusting scrollY — which then re-fires our scroll handler and toggles compact
 *   again (oscillation loop).
 *
 *   Fix: block the scroll handler for TRANSITION_MS after every state change.
 *   During that window, scrollY adjustments from the browser anchor are ignored.
 */

import { useEffect, useRef, useState } from 'react'

const ENTER_THRESHOLD = 100
const EXIT_DELTA      = 50
const JITTER          = 5
const TRANSITION_MS   = 300
const DESKTOP_BP      = 960

export default function StickyHeader({
  announcementBar,
  mainRow,
  children,
}: {
  announcementBar?: React.ReactNode
  mainRow: React.ReactNode
  children?: React.ReactNode
}) {
  const [compact, setCompact] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const compactRef     = useRef(false)
  const lastY          = useRef(0)
  const anchorY        = useRef(0)
  const rafId          = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const transitioning  = useRef(false)  // true while CSS transition is running

  function enterCompact() {
    // Suppress overflowAnchor so collapsing the header doesn't shift content
    document.documentElement.style.overflowAnchor = 'none'
    transitioning.current = true
    setCompact(true)
    compactRef.current = true
    setTimeout(() => {
      document.documentElement.style.overflowAnchor = ''
      transitioning.current = false
    }, TRANSITION_MS)
  }

  function exitCompact() {
    // Let browser scroll-anchor compensate for the expanding header naturally,
    // but block our own handler so the anchor-driven scrollY change doesn't
    // immediately re-enter compact mode.
    transitioning.current = true
    setCompact(false)
    compactRef.current = false
    setTimeout(() => { transitioning.current = false }, TRANSITION_MS)
  }

  useEffect(() => {
    function handleScroll() {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        // Ignore scroll events fired during a compact transition — these are
        // caused by the browser's scroll anchor adjusting scrollY to compensate
        // for the header height change, not by the user actually scrolling.
        if (transitioning.current) return

        const y     = window.scrollY
        const delta = y - lastY.current

        if (Math.abs(delta) < JITTER) return
        lastY.current = y

        if (y < ENTER_THRESHOLD) {
          if (compactRef.current) exitCompact()
        } else if (delta > 0) {
          // Scrolling DOWN → enter compact; refresh anchorY on every downward
          // tick so EXIT_DELTA measures from the most recent downward position.
          if (!compactRef.current) enterCompact()
          anchorY.current = y
        } else {
          // Scrolling UP → only exit after EXIT_DELTA of committed upward movement
          if (compactRef.current && anchorY.current - y >= EXIT_DELTA) exitCompact()
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => setMenuOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    document.addEventListener('mobilemenu', handler)
    return () => document.removeEventListener('mobilemenu', handler)
  }, [])

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BP
  const suppressCompact = compact && !menuOpen
  const collapseMainRow = suppressCompact && isDesktop

  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header
      ref={headerRef}
      data-testid="nav-header"
      data-compact={suppressCompact}
      className="sticky top-0 z-[101] bg-white group"
    >

      {/* ── Announcement bar ──────────────────────────────────────────────
          Collapses on both mobile and desktop — but never when the mobile
          menu is open (banner must stay visible above the menu panel). */}
      {announcementBar && (
        <div
          style={{ maxHeight: (suppressCompact && isDesktop) ? '0' : '3rem' }}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        >
          {announcementBar}
        </div>
      )}

      {/* ── Main header row ───────────────────────────────────────────────
          On desktop: collapses (max-height → 0) AND logo fades out.
          On mobile:  always visible so hamburger + cart stay reachable.
          5rem covers our py-4 row height (~52px) with room to spare. */}
      <div
        style={{ maxHeight: collapseMainRow ? '0' : '5rem' }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        {mainRow}
      </div>

      {/* ── Category nav / other children ─────────────────────────────── */}
      {children}

    </header>
  )
}
