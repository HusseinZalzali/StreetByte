'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import type { MenuItem } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface ItemModalProps {
  item: MenuItem | null
  onClose: () => void
  currencySymbol?: string
}

export default function ItemModal({ item, onClose, currencySymbol = '$' }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [instructions, setInstructions] = useState('')
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    if (!item) return
    setQuantity(1)
    setInstructions('')
    const defaults: Record<string, string> = {}
    item.customizations?.forEach((c) => {
      if (c.required && c.options[0]) defaults[c.id] = c.options[0].id
    })
    setSelectedOptions(defaults)
  }, [item])

  useEffect(() => {
    document.body.style.overflow = item ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  function calcTotal() {
    if (!item) return 0
    const extra = Object.values(selectedOptions).reduce((acc, optId) => {
      const mod = item.customizations?.flatMap((c) => c.options).find((o) => o.id === optId)?.priceModifier ?? 0
      return acc + mod
    }, 0)
    return (item.price + extra) * quantity
  }

  function handleAdd() {
    if (!item) return
    for (let i = 0; i < quantity; i++) addItem(item, selectedOptions, instructions)
    onClose()
    setTimeout(openCart, 200)
  }

  const missingRequired = item?.customizations?.filter((c) => c.required && !selectedOptions[c.id]).length ?? 0

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
          />

          {/* Modal wrapper — centers the panel and handles positioning */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none">
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="pointer-events-auto w-full max-w-3xl bg-surface rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] min-h-0"
          >
            {/* ── Left: Image preview ──────────────────────────────────── */}
            <div className="relative shrink-0 md:w-[46%] h-40 sm:h-52 md:h-auto bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Close button (mobile: top-right of preview) */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors md:hidden"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Right: Item info ─────────────────────────────────────── */}
            <div className="flex flex-col flex-1 min-h-0">
              {/* Close button (desktop) */}
              <div className="hidden md:flex justify-end p-4 pb-0 shrink-0">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-background text-text-muted hover:text-text-main hover:bg-border flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-5 pt-4 pb-2 md:pt-2 space-y-4">
                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t) => <Badge key={t} tag={t} />)}
                  </div>
                )}

                {/* Name + price */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-main leading-tight">{item.name}</h2>
                  <p className="text-primary font-display font-bold text-xl mt-1">
                    {formatPrice(item.price, currencySymbol)}
                  </p>
                </div>

                <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>

                {/* Customizations */}
                {item.customizations?.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-sm text-text-main mb-2">
                      {c.name}
                      {c.required && <span className="text-primary ml-1.5 text-xs font-normal">Required</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [c.id]: opt.id }))}
                          className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                            selectedOptions[c.id] === opt.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-text-muted hover:border-primary/40'
                          }`}
                        >
                          {opt.name}
                          {opt.priceModifier !== 0 && (
                            <span className="ml-1 text-xs opacity-70">
                              +{formatPrice(opt.priceModifier, currencySymbol)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Special instructions */}
                <div>
                  <p className="font-semibold text-sm text-text-main mb-1.5">Special Instructions</p>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="No onions, extra sauce…"
                    rows={2}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm text-text-main bg-background focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Footer — always visible */}
              <div className="shrink-0 p-4 border-t border-border bg-surface">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-background rounded-xl px-2 py-1.5 shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-display font-bold text-base w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <Button
                    onClick={handleAdd}
                    disabled={missingRequired > 0 || !item.available}
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingBag size={17} />
                    Add · {formatPrice(calcTotal(), currencySymbol)}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
