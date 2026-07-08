'use client'

import { useEffect, useState } from 'react'

type Banner = { message: string; bgColor?: string; textColor?: string }

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

  return (
    <div
      data-testid="nav-announcement-bar"
      className="text-center text-xs px-5 py-2 tracking-widest uppercase overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: active.bgColor  ?? '#000000',
        color:           active.textColor ?? '#ffffff',
      }}
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
