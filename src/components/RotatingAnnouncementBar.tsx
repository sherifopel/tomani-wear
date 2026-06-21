'use client'

import { useEffect, useState } from 'react'

export default function RotatingAnnouncementBar({
  messages,
}: {
  messages: string[]
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
      className="bg-black text-white text-center text-xs py-2 tracking-widest uppercase overflow-hidden"
    >
      <span
        key={activeIndex}
        className="block animate-[announcement-slide_400ms_ease-out]"
      >
        {messages[activeIndex]}
      </span>
    </div>
  )
}
