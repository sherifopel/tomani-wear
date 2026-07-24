'use client'

import { useRef, useState, useEffect } from 'react'

type Props = {
  audioUrl:  string
  startAt:   number  // seconds into the track to begin (e.g. 30 = start at 0:30)
  duration:  number  // how many seconds to play before looping back to startAt
}

export default function AudioPlayer({ audioUrl, startAt, duration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Seek to the snippet start as soon as the track has enough data loaded
    const onLoaded = () => {
      audio.currentTime = startAt
      audio.play().catch(() => {})
    }

    // Loop back to startAt when the snippet duration is up
    const onTimeUpdate = () => {
      if (audio.currentTime >= startAt + duration) {
        audio.currentTime = startAt
      }
    }

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [startAt, duration])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  return (
    <>
      {/* loop={false} because we handle looping manually via timeupdate */}
      <audio ref={audioRef} src={audioUrl} muted autoPlay />
      <button
        onClick={toggle}
        aria-label={muted ? 'Unmute background audio' : 'Mute background audio'}
        className="absolute bottom-5 right-5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-200"
      >
        {muted ? (
          // Speaker with X — muted
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Speaker with waves — playing
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
