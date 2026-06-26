'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Category, MenuItem } from '@/types'
import CategoryNav from './CategoryNav'
import MenuCard from './MenuCard'
import ItemModal from './ItemModal'

interface MenuGridProps {
  items: MenuItem[]
  categories: Category[]
  currencySymbol?: string
}

export default function MenuGrid({ items, categories, currencySymbol = '$' }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory)

  return (
    <>
      {/* Category filter */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CategoryNav
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-text-muted"
          >
            <div className="text-5xl mb-4">🍽️</div>
            <p className="font-display text-xl">No items in this category yet.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                  currencySymbol={currencySymbol}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Item detail modal */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currencySymbol={currencySymbol}
      />
    </>
  )
}
