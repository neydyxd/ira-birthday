import React from 'react'

import { BIRTHDAY_PHOTOS, TARGET_DATE } from './birthday-config'
import CountdownPage from './CountdownPage'
import './styles.css'

const photoBase = '/birthday-photos'
const imageUrls = BIRTHDAY_PHOTOS.map((name) => `${photoBase}/${name}`)

export default function HomePage() {
  return <CountdownPage targetDate={TARGET_DATE} imageUrls={imageUrls} />
}
