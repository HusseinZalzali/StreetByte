'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { MenuItem } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface MenuCardProps {
  item: MenuItem
  onSelect: (item: MenuItem) => void
  currencySymbol?: string
}

export default function MenuCard({ item, onSelect, currencySymbol = '$' }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  // ── 3D tilt ──────────────────────────────────────────────────────────────
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width   // 0–1
    const ny = (e.clientY - rect.top) / rect.height    // 0–1
    const rotY = (nx - 0.5) * 26                       // -13 to +13 deg
    const rotX = -(ny - 0.5) * 18                      // -9 to +9 deg
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`
    if (glare) {
      glare.style.opacity = '1'
      glare.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.28) 0%, transparent 65%)`
    }
  }

  function onMouseLeave() {
    const card = cardRef.current
    const glare = glareRef.current
    if (card) card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glare) glare.style.opacity = '0'
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (!item.available) return
    if (item.customizations?.length) { onSelect(item); return }
    addItem(item)
    openCart()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`relative ${!item.available ? 'opacity-60' : ''}`}
      style={{ perspective: '700px' }}
    >
      <div
        ref={cardRef}
        onClick={() => onSelect(item)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative bg-surface rounded-2xl overflow-hidden cursor-pointer shadow-card"
        style={{
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Glare overlay */}
        <div
          ref={glareRef}
          className="absolute inset-0 z-20 rounded-2xl pointer-events-none"
          style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
        />

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">Unavailable</span>
            </div>
          )}

          {/* Quick-add */}
          {item.available && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Content — pushed forward in z for depth illusion */}
        <div className="p-4" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.slice(0, 2).map((tag) => <Badge key={tag} tag={tag} />)}
            </div>
          )}
          <h3 className="font-display text-lg font-semibold text-text-main leading-tight">{item.name}</h3>
          <p className="text-text-muted text-sm mt-1 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-primary font-bold text-lg font-display">
              {formatPrice(item.price, currencySymbol)}
            </span>
            {item.customizations?.length ? (
              <span className="text-text-muted text-xs">Customizable</span>
            ) : null}
          </div>
        </div>

        {/* Subtle 3D hint on first hover */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <span className="text-[10px] text-white/60 bg-black/30 px-2 py-0.5 rounded-full whitespace-nowrap">
            Click for 3D view
          </span>
        </div>
      </div>
    </motion.div>
  )
}
