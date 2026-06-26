'use client'

import { useEffect } from 'react'
import { useRestaurantStore } from '@/store/restaurantStore'

export default function ThemeSync() {
  const applyColors = useRestaurantStore((s) => s.applyColors)

  useEffect(() => {
    applyColors()
  }, [applyColors])

  return null
}
