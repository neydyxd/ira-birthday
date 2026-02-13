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
  { categoryId: 'ira', points: 300, title: 'УННВ - МУЗА', audioUrl: '/melodies/unnv.mp3', cardName: '1' },
  { categoryId: 'ira', points: 600, title: 'Yanix - Кто-то ещё', audioUrl: '/melodies/yanix.mp3', cardName: '2' },
  { categoryId: 'ira', points: 900, title: 'Scally Milano, Voskresenskii - Русская кукла', audioUrl: '/melodies/scaly.mp3', cardName: '3' },
  { categoryId: 'stepa', points: 300, title: 'OG BUDA - ОПГ сити', audioUrl: '/melodies/og-buda.mp3', cardName: '1' },
  { categoryId: 'stepa', points: 600, title: '50 Cent - In Da Club', audioUrl: '/melodies/50cent.mp3', cardName: '2' },
  { categoryId: 'stepa', points: 900, title: 'Sade - Smooth Operator', audioUrl: '/melodies/operator.mp3', cardName: '3' },
  { categoryId: 'friends', points: 300, title: 'Boulevard Depo - Friendly Fire', audioUrl: '/melodies/depo.mp3', cardName: '1' },
  { categoryId: 'friends', points: 600, title: 'GORILLA GLUE, LIL NAKUR - Браги два бидона', audioUrl: '/melodies/braga.mp3', cardName: '2' },
  { categoryId: 'friends', points: 900, title: 'Kanye West - Praise God', audioUrl: '/melodies/west.mp3', cardName: '3' },
]

export function getSong(categoryId: CategoryId, points: PointValue): SongCard | undefined {
  return SONGS.find((s) => s.categoryId === categoryId && s.points === points)
}
