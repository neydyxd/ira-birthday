/**
 * Конфиг для страницы "Угадай мелодию".
 * Замените audioUrl на реальные ссылки на аудио (или пути в /public).
 * title — название песни (показывается по кнопке "Показать результат").
 */
export const POINTS = [300, 600, 900] as const
export const CATEGORIES = [
  { id: 'ira', label: 'Песни Иры' },
  { id: 'stepa', label: 'Песни Степы' },
  { id: 'friends', label: 'Песни друзей' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']
export type PointValue = (typeof POINTS)[number]

export interface SongCard {
  categoryId: CategoryId
  points: PointValue
  title: string
  /** URL аудио: путь в /public или внешняя ссылка */
  audioUrl: string
  cardName: string
}

/** Сетка 3×3: для каждой категории по три песни (300, 600, 900) */
export const SONGS: SongCard[] = [
  { categoryId: 'ira', points: 300, title: 'OG BUDA - ОПГ сити', audioUrl: '/melodies/og-buda.mp3', cardName: '1' },
  { categoryId: 'ira', points: 600, title: 'Песня Иры 2', audioUrl: '', cardName: '2' },
  { categoryId: 'ira', points: 900, title: 'Песня Иры 3', audioUrl: '', cardName: '3' },
  { categoryId: 'stepa', points: 300, title: 'Песня Степы 1', audioUrl: '', cardName: '1' },
  { categoryId: 'stepa', points: 600, title: 'Песня Степы 2', audioUrl: '', cardName: '2' },
  { categoryId: 'stepa', points: 900, title: 'Песня Степы 3', audioUrl: '', cardName: '3' },
  { categoryId: 'friends', points: 300, title: 'Песня друзей 1', audioUrl: '', cardName: '1' },
  { categoryId: 'friends', points: 600, title: 'Песня друзей 2', audioUrl: '', cardName: '2' },
  { categoryId: 'friends', points: 900, title: 'Песня друзей 3', audioUrl: '', cardName: '3' },
]

export function getSong(categoryId: CategoryId, points: PointValue): SongCard | undefined {
  return SONGS.find((s) => s.categoryId === categoryId && s.points === points)
}
