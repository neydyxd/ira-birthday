'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  CATEGORIES,
  POINTS,
  getSong,
  type CategoryId,
  type PointValue,
  type SongCard,
} from './guess-melody-config'
import GuessMelodyPlayer from './GuessMelodyPlayer'

type CardStatus = 'pending' | 'correct' | 'incorrect'

function cardKey(categoryId: CategoryId, points: PointValue): string {
  return `${categoryId}-${points}`
}

export default function GuessMelodyPage() {
  const [cardStatus, setCardStatus] = useState<Record<string, CardStatus>>({})
  const [modalSong, setModalSong] = useState<SongCard | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [audioKey, setAudioKey] = useState(0)

  const openModal = useCallback((song: SongCard) => {
    const key = cardKey(song.categoryId, song.points)
    if (cardStatus[key] !== undefined) return
    setModalSong(song)
    setShowAnswer(false)
    setAudioKey((k) => k + 1)
  }, [cardStatus])

  const closeModal = useCallback(() => {
    setModalSong(null)
    setShowAnswer(false)
  }, [])

  const handleCorrect = useCallback(() => {
    if (!modalSong) return
    setCardStatus((prev) => ({
      ...prev,
      [cardKey(modalSong.categoryId, modalSong.points)]: 'correct',
    }))
    closeModal()
  }, [modalSong, closeModal])

  const handleIncorrect = useCallback(() => {
    if (!modalSong) return
    setCardStatus((prev) => ({
      ...prev,
      [cardKey(modalSong.categoryId, modalSong.points)]: 'incorrect',
    }))
    closeModal()
  }, [modalSong, closeModal])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
  }, [])

  useEffect(() => {
    if (!modalSong) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalSong, closeModal])

  return (
    <div className="guess-melody-page">
      <h1 className="guess-melody-title">Угадай мелодию</h1>

      <div className="guess-melody-grid" role="table" aria-label="Игровое поле">
        {/* Верхняя строка: пустая ячейка + очки */}
        <div className="guess-melody-cell guess-melody-cell--header guess-melody-cell--empty" />
        {POINTS.map((points) => (
          <div
            key={points}
            className="guess-melody-cell guess-melody-cell--header guess-melody-cell--points"
          >
            {points}
          </div>
        ))}

        {/* Строки: категория + карточки */}
        {CATEGORIES.map((cat) => (
          <React.Fragment key={cat.id}>
            <div className="guess-melody-cell guess-melody-cell--category">
              {cat.label}
            </div>
            {POINTS.map((points) => {
              const song = getSong(cat.id, points)
              const key = song ? cardKey(cat.id, points) : ''
              const status = key ? cardStatus[key] : undefined
              const isDisabled = status !== undefined

              return (
                <div key={points} className="guess-melody-cell guess-melody-cell--card-wrap">
                  {song ? (
                    <button
                      type="button"
                      className={`guess-melody-card guess-melody-card--${status ?? 'pending'}`}
                      onClick={() => openModal(song)}
                      disabled={isDisabled}
                      aria-label={`${cat.label}, ${points} очков`}
                    >
                      <span className="guess-melody-card-value">{song.cardName}</span>
                    </button>
                  ) : null}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {modalSong && (
        <div
          className="guess-melody-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="guess-melody-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="guess-melody-modal-title"
          >
            <h2 id="guess-melody-modal-title" className="guess-melody-modal-title">
              {modalSong.points} очков
            </h2>

            <div className="guess-melody-modal-audio">
              {modalSong.audioUrl ? (
                <GuessMelodyPlayer key={audioKey} src={modalSong.audioUrl} />
              ) : (
                <p className="guess-melody-modal-placeholder">Добавьте ссылку на песню в конфиг</p>
              )}
            </div>

            {showAnswer && (
              <p className="guess-melody-modal-answer">{modalSong.title}</p>
            )}

            <div className="guess-melody-modal-actions">
              <button
                type="button"
                className="guess-melody-btn guess-melody-btn--correct"
                onClick={handleCorrect}
              >
                Верно
              </button>
              <button
                type="button"
                className="guess-melody-btn guess-melody-btn--incorrect"
                onClick={handleIncorrect}
              >
                Неверно
              </button>
              <button
                type="button"
                className="guess-melody-btn guess-melody-btn--show"
                onClick={handleShowAnswer}
              >
                Показать результат
              </button>
            </div>

            <button
              type="button"
              className="guess-melody-modal-close"
              onClick={closeModal}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
