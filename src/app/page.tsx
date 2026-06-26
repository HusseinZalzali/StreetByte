'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin, Phone, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ThemeSync from '@/components/layout/ThemeSync'
import MenuGrid from '@/components/menu/MenuGrid'
import CartDrawer from '@/components/cart/CartDrawer'
import Button from '@/components/ui/Button'
import { useRestaurantStore } from '@/store/restaurantStore'
import { categories } from '@/config/restaurant'

// Lazy-load the heavy 3D scene
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a0800 0%, #0d0400 50%, #1a0800 100%)' }} />
  ),
})

export default function HomePage() {
  const { config, menu } = useRestaurantStore()

  function scrollToMenu() {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <ThemeSync />
      <Navbar />
      <CartDrawer currencySymbol={config.currencySymbol} />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <HeroScene />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-secondary font-display font-semibold text-lg tracking-widest uppercase mb-4"
          >
            {config.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, type: 'spring', stiffness: 120 }}
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: 'clamp(4rem, 15vw, 10rem)' }}
          >
            {config.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-white/70 text-lg mt-4 max-w-md"
          >
            {config.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex gap-3 mt-8"
          >
            <Button size="lg" onClick={scrollToMenu}>
              View Menu
            </Button>
            <Button variant="ghost" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Our Story
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.button>
      </section>

      {/* Menu section */}
      <main id="menu" className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl font-bold text-text-main">
              Our <span className="text-primary">Menu</span>
            </h2>
            <p className="text-text-muted mt-1">{config.description}</p>
          </motion.div>
        </div>

        <MenuGrid items={menu} categories={categories} currencySymbol={config.currencySymbol} />
      </main>

      {/* Footer */}
      <footer className="bg-[rgb(26,8,0)] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-secondary mb-3">{config.name}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{config.description}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white/90">Find Us</h4>
            {config.address && (
              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin size={16} className="mt-0.5 text-primary shrink-0" />
                <span>{config.address}</span>
              </div>
            )}
            {config.phone && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone size={16} className="text-primary shrink-0" />
                <span>{config.phone}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-white/90 mb-3">Hours</h4>
            <div className="space-y-1">
              {config.hours && Object.entries(config.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-white/50">{day.slice(0, 3)}</span>
                  <span className="text-white/80">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} {config.name}. Template powered by StreetByte.
        </div>
      </footer>
    </>
  )
}
