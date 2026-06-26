'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function CartDrawer({ currencySymbol = '$' }: { currencySymbol?: string }) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-surface flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={22} />
                <h2 className="font-display text-xl font-bold text-text-main">Your Order</h2>
                {items.length > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-text-muted hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Clear cart"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="text-text-muted hover:text-text-main transition-colors p-2 rounded-lg hover:bg-border"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center gap-4 text-center py-20"
                  >
                    <div className="text-6xl">🛍️</div>
                    <p className="font-display text-xl font-semibold text-text-main">Cart is empty</p>
                    <p className="text-text-muted text-sm">Add some delicious items to get started!</p>
                    <Button variant="ghost" onClick={closeCart}>Browse Menu</Button>
                  </motion.div>
                ) : (
                  items.map((item) => {
                    const key = `${item.menuItem.id}-${JSON.stringify(item.selectedOptions)}`
                    const optionExtra = Object.values(item.selectedOptions).reduce((acc, optId) => {
                      const mod = item.menuItem.customizations
                        ?.flatMap((c) => c.options)
                        .find((o) => o.id === optId)?.priceModifier ?? 0
                      return acc + mod
                    }, 0)
                    const unitPrice = item.menuItem.price + optionExtra

                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 bg-background rounded-2xl p-3"
                      >
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-text-main truncate">
                            {item.menuItem.name}
                          </p>
                          {Object.keys(item.selectedOptions).length > 0 && (
                            <p className="text-text-muted text-xs mt-0.5">
                              {Object.values(item.selectedOptions).join(', ')}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-text-muted text-xs italic mt-0.5 truncate">
                              {item.specialInstructions}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-bold text-sm font-display">
                              {formatPrice(unitPrice * item.quantity, currencySymbol)}
                            </span>

                            {/* Qty controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.selectedOptions, item.quantity - 1)}
                                className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.selectedOptions, item.quantity + 1)}
                                className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal, currencySymbol)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-text-main">Total</span>
                  <span className="font-display font-bold text-xl text-primary">
                    {formatPrice(cartTotal, currencySymbol)}
                  </span>
                </div>
                <Button size="lg" className="w-full">
                  Place Order
                </Button>
                <p className="text-center text-text-muted text-xs">
                  Taxes and service charge calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
