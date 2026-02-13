'use client'

import React, { useCallback, useEffect, useState } from 'react'

type Congratulation = {
  id: string
  authorName: string
  message: string
  createdAt: string
}

export default function WallDisplayPage() {
  const [list, setList] = useState<Congratulation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch('/api/congratulations?limit=1000&sort=-createdAt')
      if (!res.ok) throw new Error('Не удалось загрузить поздравления')
      const data = await res.json()
      const docs = data.docs ?? []
      setList(docs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList()
    const interval = setInterval(fetchList, 3000)
    return () => clearInterval(interval)
  }, [fetchList])

  return (
    <div className="wall-page wall-page--display wall-page--grid">
      <div className="wall-bg" aria-hidden />
      <div className="wall-content wall-content--grid">
        <h1 className="wall-title">Стена поздравлений</h1>

        <div className="wall-grid">
          {loading ? (
            <p className="wall-loading">Загружаем поздравления...</p>
          ) : error ? (
            <p className="wall-error">{error}</p>
          ) : list.length === 0 ? (
            <div className="wall-empty wall-empty--qr">
              <p className="wall-empty-text">Отсканируйте QR‑код, чтобы оставить поздравление</p>
              <a
                href="https://ira-birthday.vercel.app/wall/write"
                target="_blank"
                rel="noopener noreferrer"
                className="wall-qr-link"
                aria-label="Оставить поздравление"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent('https://ira-birthday.vercel.app/wall/write')}`}
                  alt="QR‑код для добавления поздравления"
                  width={280}
                  height={280}
                  className="wall-qr-code"
                />
              </a>
            </div>
          ) : (
            <div className="wall-grid-inner" aria-live="polite">
              {list.map((item) => (
                <article key={item.id} className="wall-grid-card">
                  <p className="wall-grid-name">{item.authorName}</p>
                  <p className="wall-grid-message">{item.message}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
