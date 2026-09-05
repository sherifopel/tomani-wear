'use client'

import { useRef, useState, useEffect } from 'react'

export default function FloatingAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)

  // Start playing immediately (muted) so there's no delay when the user unmutes.
  // Browsers allow muted autoplay — unmuting an already-playing track feels instant.
  useEffect(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.muted = false
      if (audio.paused) audio.play().catch(() => {})
      setMuted(false)
    } else {
      audio.muted = true
      setMuted(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} muted loop />
      <button
        onClick={toggle}
        aria-label={muted ? 'Play background music' : 'Mute background music'}
        className="fixed bottom-6 right-5 z-50 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-200"
      >
        {muted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  )
}
