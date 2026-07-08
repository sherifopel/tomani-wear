'use client'

import { useEffect, useState } from 'react'

type Banner = { message: string; theme?: string }

const THEMES: Record<string, { bg: string; text: string }> = {
  'black-white': { bg: '#000000', text: '#ffffff' },
  'grey-red':    { bg: '#f0f0f0', text: '#E8000D' },
}

export default function RotatingAnnouncementBar({ banners }: { banners: Banner[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % banners.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [banners.length])

  const active = banners[activeIndex] ?? banners[0]
  const { bg, text } = THEMES[active.theme ?? 'black-white']

  return (
    <div
      data-testid="nav-announcement-bar"
      className="flex items-center justify-center text-center text-xs px-5 tracking-widest uppercase overflow-hidden transition-colors duration-500 min-h-[3.5rem]"
      style={{ backgroundColor: bg, color: text }}
    >
      <span
        key={activeIndex}
        className="mx-auto block max-w-[34rem] leading-relaxed animate-[announcement-slide_400ms_ease-out]"
      >
        {active.message}
      </span>
    </div>
  )
}
