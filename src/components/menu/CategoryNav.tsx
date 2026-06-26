'use client'

import { cn } from '@/lib/utils'
import type { Category } from '@/types'
import { motion } from 'framer-motion'

interface CategoryNavProps {
  categories: Category[]
  active: string
  onChange: (id: string) => void
}

export default function CategoryNav({ categories, active, onChange }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200',
            active === cat.id
              ? 'text-white'
              : 'bg-surface text-text-muted hover:text-text-main border border-border hover:border-primary/40'
          )}
        >
          {active === cat.id && (
            <motion.span
              layoutId="category-pill"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.emoji}</span>
          <span className="relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
