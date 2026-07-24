'use client'

import { useRef, useState, useEffect } from 'react'

type Props = {
  audioUrl:    string
  startAt:     number  // seconds into the track to begin
  duration:    number  // how many seconds to play before pausing
  repeatDelay: number  // silent gap before replaying (only if hero still on screen)
}

export default function AudioPlayer({ audioUrl, startAt, duration, repeatDelay }: Props) {
  const audioRef  = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isVisible = useRef(true)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [muted, setMuted] = useState(true)

  // Track whether the hero section is on screen
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

  // Playback: play for `duration` seconds, pause for `repeatDelay` seconds, repeat if visible
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    function startSnippet() {
      audio!.currentTime = startAt
      audio!.play().catch(() => {})
    }

    function onTimeUpdate() {
      if (audio!.currentTime >= startAt + duration) {
        // Snippet finished — pause and schedule a replay
        audio!.pause()
        audio!.currentTime = startAt
        timerRef.current = setTimeout(() => {
          if (isVisible.current) startSnippet()
        }, repeatDelay * 1000)
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)

    // Start as soon as metadata is ready (or immediately if already loaded)
    if (audio.readyState >= 1) {
      startSnippet()
    } else {
      audio.addEventListener('loadedmetadata', startSnippet, { once: true })
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startAt, duration, repeatDelay])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.muted = false
      // If play() was blocked on page load, start on first user gesture
      if (audio.paused) startSnippetFromButton(audio)
      setMuted(false)
    } else {
      audio.muted = true
      setMuted(true)
    }
  }

  function startSnippetFromButton(audio: HTMLAudioElement) {
    if (timerRef.current) clearTimeout(timerRef.current)
    audio.currentTime = startAt
    audio.play().catch(() => {})
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} muted autoPlay />
      <button
        ref={buttonRef}
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
