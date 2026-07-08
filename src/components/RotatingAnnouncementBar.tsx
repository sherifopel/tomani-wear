'use client'

import { useEffect, useState } from 'react'

export default function RotatingAnnouncementBar({
  messages,
  bgColor,
  textColor,
}: {
  messages: string[]
  bgColor?: string
  textColor?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (messages.length < 2) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length)
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [messages.length])

  return (
    <div
      data-testid="nav-announcement-bar"
      className="text-center text-xs px-5 py-2 tracking-widest uppercase overflow-hidden"
      style={{
        backgroundColor: bgColor ?? '#000000',
        color: textColor ?? '#ffffff',
      }}
    >
      <span
        key={activeIndex}
        className="mx-auto block max-w-[34rem] leading-relaxed animate-[announcement-slide_400ms_ease-out]"
      >
        {messages[activeIndex]}
      </span>
    </div>
  )
}
