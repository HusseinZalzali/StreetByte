'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultConfig, menuItems as defaultMenu, sampleOrders } from '@/config/restaurant'
import type { MenuItem, Order, OrderStatus, RestaurantConfig } from '@/types'

interface RestaurantStore {
  config: RestaurantConfig
  menu: MenuItem[]
  orders: Order[]
  updateConfig: (partial: Partial<RestaurantConfig>) => void
  updateColors: (colors: Partial<RestaurantConfig['colors']>) => void
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleAvailability: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  applyColors: () => void
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      menu: defaultMenu,
      orders: sampleOrders,

      updateConfig: (partial) =>
        set((s) => ({ config: { ...s.config, ...partial } })),

      updateColors: (colors) =>
        set((s) => ({
          config: { ...s.config, colors: { ...s.config.colors, ...colors } },
        })),

      addMenuItem: (item) =>
        set((s) => ({ menu: [...s.menu, item] })),

      updateMenuItem: (id, updates) =>
        set((s) => ({
          menu: s.menu.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        })),

      deleteMenuItem: (id) =>
        set((s) => ({ menu: s.menu.filter((item) => item.id !== id) })),

      toggleAvailability: (id) =>
        set((s) => ({
          menu: s.menu.map((item) =>
            item.id === id ? { ...item, available: !item.available } : item
          ),
        })),

      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      applyColors: () => {
        const { colors } = get().config
        const root = document.documentElement
        root.style.setProperty('--color-primary', colors.primary)
        root.style.setProperty('--color-secondary', colors.secondary)
        root.style.setProperty('--color-bg', colors.bg)
        root.style.setProperty('--color-surface', colors.surface)
        root.style.setProperty('--color-text', colors.text)
        root.style.setProperty('--color-text-muted', colors.textMuted)
        root.style.setProperty('--color-border', colors.border)
      },
    }),
    { name: 'restaurant-store', partialize: (s) => ({ config: s.config, menu: s.menu }) }
  )
)
