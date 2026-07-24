'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Banner = { message: string; theme?: string; href?: string }

const THEMES: Record<string, { bg: string; text: string }> = {
  'black-white': { bg: '#000000', text: '#ffffff' },
  'grey-red':    { bg: '#f0f0f0', text: '#E8000D' },
}

export default function RotatingAnnouncementBar({ banners }: { banners: Banner[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasRotated, setHasRotated] = useState(false)

  useEffect(() => {
    if (banners.length < 2) return
    const id = window.setInterval(() => {
      setHasRotated(true)
      setActiveIndex((i) => (i + 1) % banners.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [banners.length])

  const active = banners[activeIndex] ?? banners[0]
  const { bg, text } = THEMES[active.theme ?? 'black-white']

  const inner = (
    <span
      key={activeIndex}
      className={`mx-auto block max-w-[34rem] leading-relaxed ${hasRotated ? 'animate-[announcement-slide_400ms_ease-out]' : ''}`}
    >
      {active.message}
      {active.href && <span className="ml-2 underline underline-offset-2">→</span>}
    </span>
  )

  const sharedClass = "flex items-center justify-center text-center text-xs px-5 overflow-hidden transition-colors duration-500 min-h-[3.5rem]"

  if (active.href) {
    return (
      <Link
        href={active.href}
        data-testid="nav-announcement-bar"
        className={`${sharedClass} hover:opacity-80 transition-opacity`}
        style={{ backgroundColor: bg, color: text }}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      data-testid="nav-announcement-bar"
      className={sharedClass}
      style={{ backgroundColor: bg, color: text }}
    >
      {inner}
    </div>
  )
}
