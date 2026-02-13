'use client'

import React, { useEffect, useRef, useState } from 'react'
import fx from 'fireworks'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_MINUTE = 60 * 1000
const MS_PER_SECOND = 1000

function getTimeLeft(target: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = Date.now()
  const diff = Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / MS_PER_DAY)
  const rest = diff % MS_PER_DAY
  const hours = Math.floor(rest / MS_PER_HOUR)
  const rest2 = rest % MS_PER_HOUR
  const minutes = Math.floor(rest2 / MS_PER_MINUTE)
  const rest3 = rest2 % MS_PER_MINUTE
  const seconds = Math.floor(rest3 / MS_PER_SECOND)
  return { days, hours, minutes, seconds }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

type Props = {
  targetDate: Date
  imageUrls: string[]
}

const isTimeUp = (t: { days: number; hours: number; minutes: number; seconds: number }) =>
  t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0

const FIREWORKS_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#e056fd', '#ff9f43', '#fff']

export default function CountdownPage({ targetDate, imageUrls }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = imageUrls.length > 0
  const fireworksTriggered = useRef(false)
  const fireworksOverlayRef = useRef<HTMLDivElement>(null)

  // Все фотографии из конфига участвуют в карусели
  const displayPhotos = imageUrls

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(t)
  }, [targetDate])

  // Фейерверк поверх счётчика, когда таймер дошёл до нуля
  useEffect(() => {
    if (!isTimeUp(timeLeft) || fireworksTriggered.current || typeof window === 'undefined') return
    const overlay = fireworksOverlayRef.current
    if (!overlay) return
    fireworksTriggered.current = true

    const w = window.innerWidth
    const h = window.innerHeight

    // Библиотека fireworks не останавливает requestAnimationFrame при удалении canvas,
    // поэтому ограничиваем число одновременных «взрывов», иначе страница лагает.
    const MAX_CANVASES = 4
    const salutesPerLaunch = 3
    const intervalMs = 2500
    const particleTimeoutMs = 2000

    const launch = () => {
      if (overlay.querySelectorAll('canvas').length >= MAX_CANVASES) return
      for (let i = 0; i < salutesPerLaunch; i++) {
        setTimeout(() => {
          if (overlay.querySelectorAll('canvas').length >= MAX_CANVASES) return
          fx({
            x: w * (0.2 + Math.random() * 0.6),
            y: h * (0.2 + Math.random() * 0.5),
            count: 55,
            colors: FIREWORKS_COLORS,
            canvasWidth: w,
            canvasHeight: h,
            canvasLeftOffset: w / 2,
            canvasTopOffset: h / 2,
            particleTimeout: particleTimeoutMs,
            bubbleSizeMinimum: 12,
            bubbleSizeMaximum: 38,
            bubbleSpeedMinimum: 8,
            bubbleSpeedMaximum: 16,
            parentNode: overlay,
          })
        }, i * 400)
      }
    }

    launch()
    const interval = setInterval(launch, intervalMs)
    return () => clearInterval(interval)
  }, [isTimeUp(timeLeft)])

  useEffect(() => {
    if (!hasImages || displayPhotos.length === 0) return
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % displayPhotos.length)
    }, 4000)
    return () => clearInterval(t)
  }, [hasImages, displayPhotos.length])

  return (
    <div className="countdown-page">
      <div className="countdown-bg">
        <div className="countdown-bg-gradient" aria-hidden />
      </div>

      <div className="countdown-overlay">
        <div className="countdown-content">
          {hasImages && displayPhotos.length > 0 && (
            <>
              {/* Левая сторона - фотографии */}
              <div className="countdown-photos-left">
                {displayPhotos.map((url, i) => {
                  const isActive = i === activeIndex
                  const isNext = i === (activeIndex + 1) % displayPhotos.length
                  const isPrev =
                    i === (activeIndex - 1 + displayPhotos.length) % displayPhotos.length

                  // Вычисляем смещение по вертикали относительно активной фотографии
                  let offset = i - activeIndex
                  if (offset > displayPhotos.length / 2) offset -= displayPhotos.length
                  if (offset < -displayPhotos.length / 2) offset += displayPhotos.length

                  return (
                    <div
                      key={`left-${i}`}
                      className={`countdown-photo-card ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
                      style={{
                        zIndex: isActive ? 10 : isNext || isPrev ? 5 : 1,
                        transform: `translateY(${offset * 120}px) scale(${isActive ? 1 : 0.75})`,
                      }}
                    >
                      <div className="countdown-photo-frame">
                        <img src={url} alt={`Фото ${i + 1}`} />
                        <div className="countdown-photo-shine"></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Центр - счетчик или поздравление */}
              <div className={`countdown-center ${isTimeUp(timeLeft) ? 'countdown-center--birthday' : ''}`}>
                {isTimeUp(timeLeft) ? (
                  <p className="countdown-birthday-message">С днём рождения!</p>
                ) : (
                  <>
                    <p className="countdown-label">До дня рождения осталось</p>
                    <div className="countdown-grid">
                      <div className="countdown-block">
                        <span className="countdown-value">{timeLeft.days}</span>
                        <span className="countdown-unit">дней</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-value">{pad(timeLeft.hours)}</span>
                        <span className="countdown-unit">часов</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-value">{pad(timeLeft.minutes)}</span>
                        <span className="countdown-unit">минут</span>
                      </div>
                      <div className="countdown-block">
                        <span className="countdown-value">{pad(timeLeft.seconds)}</span>
                        <span className="countdown-unit">секунд</span>
                      </div>
                    </div>
                    <p className="countdown-date">15 февраля 2026 · 00:00</p>
                  </>
                )}
              </div>

              {/* Правая сторона - фотографии */}
              <div className="countdown-photos-right">
                {displayPhotos.map((url, i) => {
                  const isActive = i === activeIndex
                  const isNext = i === (activeIndex + 1) % displayPhotos.length
                  const isPrev =
                    i === (activeIndex - 1 + displayPhotos.length) % displayPhotos.length

                  // Вычисляем смещение по вертикали относительно активной фотографии
                  let offset = i - activeIndex
                  if (offset > displayPhotos.length / 2) offset -= displayPhotos.length
                  if (offset < -displayPhotos.length / 2) offset += displayPhotos.length

                  return (
                    <div
                      key={`right-${i}`}
                      className={`countdown-photo-card ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
                      style={{
                        zIndex: isActive ? 10 : isNext || isPrev ? 5 : 1,
                        transform: `translateY(${offset * 120}px) scale(${isActive ? 1 : 0.75})`,
                      }}
                    >
                      <div className="countdown-photo-frame">
                        <img src={url} alt={`Фото ${i + 1}`} />
                        <div className="countdown-photo-shine"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Слой для фейерверка поверх всего (z-index выше счётчика) */}
      <div
        ref={fireworksOverlayRef}
        className="countdown-fireworks-overlay"
        aria-hidden
      />
    </div>
  )
}
