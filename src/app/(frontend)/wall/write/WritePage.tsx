'use client'

import React, { useState } from 'react'

export default function WritePage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const name = authorName.trim()
    const text = message.trim()
    if (!name || !text) {
      setError('Напишите имя и поздравление')
      return
    }
    if (text.length > 1000) {
      setError('Поздравление не больше 1000 символов')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/congratulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, message: text }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Не удалось отправить')
      }
      setAuthorName('')
      setMessage('')
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка отправки')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="wall-page wall-page--write">
        <div className="wall-bg" aria-hidden />
        <div className="wall-content wall-content--narrow">
          <div className="wall-thanks">
            <h1 className="wall-title">Спасибо! ♥</h1>
            <p className="wall-thanks-text">Ваше поздравление уже на стене.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wall-page wall-page--write">
      <div className="wall-bg" aria-hidden />
      <div className="wall-content wall-content--narrow">
        <h1 className="wall-title">Оставить поздравление</h1>
        <p className="wall-subtitle">Оно появится на общей стене</p>

        <form className="wall-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="wall-input"
            placeholder="Как к вам обращаться?"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={100}
            disabled={sending}
          />
          <textarea
            className="wall-textarea"
            placeholder="Ваше поздравление..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={4}
            disabled={sending}
          />
          <div className="wall-form-footer">
            <span className="wall-char">{message.length}/1000</span>
            <button type="submit" className="wall-submit" disabled={sending}>
              {sending ? 'Отправляем...' : 'Отправить'}
            </button>
          </div>
          {error && <p className="wall-error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
