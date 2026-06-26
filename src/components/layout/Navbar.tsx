'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Settings } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useRestaurantStore } from '@/store/restaurantStore'

export default function Navbar() {
  const { itemCount, toggleCart } = useCartStore()
  const config = useRestaurantStore((s) => s.config)
  const count = itemCount()

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-bold text-text-main hover:text-primary transition-colors">
          {config.name}
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface transition-colors"
            title="Admin Dashboard"
          >
            <Settings size={20} />
          </Link>

          {/* Cart button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={toggleCart}
            className="relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-glow-primary hover:opacity-90 transition-opacity"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-text-main text-xs font-bold rounded-full flex items-center justify-center shadow"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  )
}
