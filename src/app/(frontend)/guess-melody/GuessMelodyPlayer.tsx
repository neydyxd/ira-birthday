'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface GuessMelodyPlayerProps {
  src: string
  key?: number | string
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GuessMelodyPlayer({ src, key: _key }: GuessMelodyPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onLoadedMetadata = () => {
      setDuration(el.duration)
      setLoaded(true)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const onCanPlay = () => setLoaded(true)

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('ended', onEnded)
    el.addEventListener('canplay', onCanPlay)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('canplay', onCanPlay)
    }
  }, [src])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current
    if (!el) return
    const v = parseFloat(e.target.value)
    el.currentTime = v
    setCurrentTime(v)
  }, [])

  const progressWrapRef = useRef<HTMLDivElement>(null)
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = audioRef.current
      const wrap = progressWrapRef.current
      if (!el || !wrap || !duration || duration <= 0) return
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = Math.max(0, Math.min(1, x / rect.width))
      const newTime = percent * duration
      el.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration],
  )

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="guess-melody-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className="guess-melody-player-btn"
        onClick={togglePlay}
        disabled={!loaded}
        aria-label={isPlaying ? 'Пауза' : 'Играть'}
      >
        <span className="guess-melody-player-icon" aria-hidden>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </span>
      </button>
      <div
        ref={progressWrapRef}
        className="guess-melody-player-progress-wrap"
        onClick={handleProgressClick}
      >
        <input
          type="range"
          className="guess-melody-player-range"
          min={0}
          max={duration || 100}
          value={currentTime}
          step={0.1}
          onChange={handleSeek}
          onInput={handleSeek}
          onClick={(e) => e.stopPropagation()}
          aria-label="Прогресс воспроизведения"
        />
        <div
          className="guess-melody-player-progress-fill"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>
      <div className="guess-melody-player-time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
