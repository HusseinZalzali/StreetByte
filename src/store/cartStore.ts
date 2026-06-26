'use client'

import { create } from 'zustand'
import type { CartItem, MenuItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (menuItem: MenuItem, selectedOptions?: Record<string, string>, instructions?: string) => void
  removeItem: (itemId: string, selectedOptions: Record<string, string>) => void
  updateQuantity: (itemId: string, selectedOptions: Record<string, string>, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

function optionsKey(options: Record<string, string>) {
  return JSON.stringify(Object.entries(options).sort())
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (menuItem, selectedOptions = {}, instructions = '') => {
    set((state) => {
      const key = optionsKey(selectedOptions)
      const existing = state.items.find(
        (i) => i.menuItem.id === menuItem.id && optionsKey(i.selectedOptions) === key
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem.id === menuItem.id && optionsKey(i.selectedOptions) === key
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        items: [...state.items, { menuItem, quantity: 1, selectedOptions, specialInstructions: instructions }],
      }
    })
  },

  removeItem: (itemId, selectedOptions) => {
    const key = optionsKey(selectedOptions)
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.menuItem.id === itemId && optionsKey(i.selectedOptions) === key)
      ),
    }))
  },

  updateQuantity: (itemId, selectedOptions, quantity) => {
    const key = optionsKey(selectedOptions)
    if (quantity <= 0) {
      get().removeItem(itemId, selectedOptions)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === itemId && optionsKey(i.selectedOptions) === key
          ? { ...i, quantity }
          : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  total: () => {
    const { items } = get()
    return items.reduce((sum, item) => {
      const optionTotal = Object.values(item.selectedOptions).reduce((acc, optionId) => {
        const customization = item.menuItem.customizations?.find((c) =>
          c.options.some((o) => o.id === optionId)
        )
        const option = customization?.options.find((o) => o.id === optionId)
        return acc + (option?.priceModifier ?? 0)
      }, 0)
      return sum + (item.menuItem.price + optionTotal) * item.quantity
    }, 0)
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
