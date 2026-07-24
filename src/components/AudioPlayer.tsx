'use client'

import { useRef, useState, useEffect } from 'react'

type Props = {
  audioUrl:  string
  startAt:   number
  duration:  number
}

export default function AudioPlayer({ audioUrl, startAt, duration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    function onLoaded() {
      audio!.currentTime = startAt
      audio!.play().catch(() => {})
    }

    function onTimeUpdate() {
      if (audio!.currentTime >= startAt + duration) {
        audio!.currentTime = startAt
      }
    }

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)

    // If metadata already loaded (e.g. cached), fire immediately
    if (audio.readyState >= 1) onLoaded()

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [startAt, duration])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.muted = false
      // If play() was blocked on page load, start it now on user gesture
      if (audio.paused) {
        audio.currentTime = startAt
        audio.play().catch(() => {})
      }
      setMuted(false)
    } else {
      audio.muted = true
      setMuted(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} muted autoPlay />
      <button
        onClick={toggle}
        aria-label={muted ? 'Unmute background audio' : 'Mute background audio'}
        className="absolute bottom-5 right-5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-200"
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
