'use client'

import React, { useEffect, useState } from 'react'

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

export default function CountdownPage({ targetDate, imageUrls }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = imageUrls.length > 0

  // Используем только первые 6 фотографий для красивого эффекта
  const displayPhotos = imageUrls.slice(0, 6)

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(t)
  }, [targetDate])

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

              {/* Центр - счетчик */}
              <div className="countdown-center">
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
    </div>
  )
}
