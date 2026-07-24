'use client'

import { useRef, useState, useEffect } from 'react'

type Props = {
  audioUrl:      string
  startAt:       number
  snippetLength: number | 'full'  // seconds to play, or 'full' = until track ends
  repeat:        'loop' | 'once'  // loop replays after 30s pause; once stops after first play
}

export default function AudioPlayer({ audioUrl, startAt, snippetLength, repeat }: Props) {
  const audioRef  = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isVisible = useRef(true)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [muted, setMuted] = useState(true)

  // Track whether the hero is on screen
  useEffect(() => {
    const el = buttonRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Playback logic
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    function startSnippet() {
      audio!.currentTime = startAt
      audio!.play().catch(() => {})
    }

    function handleEnd() {
      audio!.pause()
      audio!.currentTime = startAt
      if (repeat === 'loop') {
        timerRef.current = setTimeout(() => {
          if (isVisible.current) startSnippet()
        }, 30_000) // 30 second pause between loops
      }
      // repeat === 'once': just stop, do nothing
    }

    function onTimeUpdate() {
      // Only fires for timed snippets (not 'full')
      if (snippetLength !== 'full' && audio!.currentTime >= startAt + snippetLength) {
        handleEnd()
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', handleEnd)

    if (audio.readyState >= 1) {
      startSnippet()
    } else {
      audio.addEventListener('loadedmetadata', startSnippet, { once: true })
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', handleEnd)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startAt, snippetLength, repeat])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.muted = false
      if (audio.paused) {
        if (timerRef.current) clearTimeout(timerRef.current)
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
        ref={buttonRef}
        onClick={toggle}
        aria-label={muted ? 'Unmute background audio' : 'Mute background audio'}
        className="absolute bottom-5 right-5 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-200"
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
