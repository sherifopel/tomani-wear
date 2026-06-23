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
 * Constants match NP production:
 *   ENTER_THRESHOLD  100px  — how far down before compact activates
 *   EXIT_DELTA        50px  — how far up (from last downward position) to re-expand
 *   JITTER             5px  — ignore micro-movements
 *   ANCHOR_WINDOW    400ms  — suppress overflowAnchor during height change
 *   DESKTOP_BP       960px  — matches np-medium-tablet
 */

import { useEffect, useRef, useState } from 'react'

const ENTER_THRESHOLD = 100
const EXIT_DELTA      = 50
const JITTER          = 5
const ANCHOR_WINDOW   = 400
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

  // Refs avoid stale closures inside the scroll handler
  const compactRef = useRef(false)
  const lastY      = useRef(0)
  const anchorY    = useRef(0)  // updated on every downward movement
  const rafId      = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)

  useEffect(() => {
    function handleScroll() {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const y     = window.scrollY
        const delta = y - lastY.current

        if (Math.abs(delta) < JITTER) return
        lastY.current = y

        if (y < ENTER_THRESHOLD) {
          // Always show when near the top
          if (compactRef.current) {
            setCompact(false)
            compactRef.current = false
          }
        } else if (delta > 0) {
          // Scrolling DOWN → enter compact; keep anchor fresh on every downward tick
          // so EXIT_DELTA measures from "where the user last was going down",
          // not from when compact first started.
          if (!compactRef.current) {
            document.documentElement.style.overflowAnchor = 'none'
            setTimeout(() => {
              document.documentElement.style.overflowAnchor = ''
            }, ANCHOR_WINDOW)
            setCompact(true)
            compactRef.current = true
          }
          anchorY.current = y
        } else {
          // Scrolling UP → only exit after 50px of committed upward movement
          if (compactRef.current && anchorY.current - y >= EXIT_DELTA) {
            setCompact(false)
            compactRef.current = false
          }
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

  // On desktop the main row also collapses; on mobile it stays put.
  // We compute this at render time — SSR-safe because compact starts false.
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BP
  // When the mobile menu is open, never collapse — banner must stay visible
  const suppressCompact = compact && !menuOpen
  const collapseMainRow = suppressCompact && isDesktop

  return (
    <header
      data-testid="nav-header"
      data-compact={suppressCompact}
      className="sticky top-0 z-[101] bg-white group"
    >

      {/* ── Announcement bar ──────────────────────────────────────────────
          Collapses on both mobile and desktop — but never when the mobile
          menu is open (banner must stay visible above the menu panel). */}
      {announcementBar && (
        <div
          style={{ maxHeight: suppressCompact ? '0' : '3rem' }}
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
