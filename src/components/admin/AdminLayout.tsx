'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList,
  Settings, ChevronLeft, Menu, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRestaurantStore } from '@/store/restaurantStore'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, exact: false },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const config = useRestaurantStore((s) => s.config)
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-[#1a0800] text-white transition-all duration-300 shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <span className="font-display text-xl font-bold text-secondary truncate">{config.name}</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
                  active
                    ? 'bg-primary text-white shadow-glow-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* View site link */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            className={cn(
              'flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-xs',
              collapsed && 'justify-center'
            )}
          >
            <ExternalLink size={14} />
            {!collapsed && 'View Live Site'}
          </Link>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 bg-[#1a0800] text-white shrink-0">
          <span className="font-display text-lg font-bold text-secondary truncate">{config.name}</span>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors"
          >
            <ExternalLink size={14} /> Live site
          </Link>
        </header>

        {/* Content — pad bottom on mobile so the tab bar doesn't overlap */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#1a0800] border-t border-white/10 flex items-stretch h-16 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                active ? 'text-secondary' : 'text-white/50 hover:text-white'
              )}
            >
              <Icon size={20} className={active ? 'scale-110 transition-transform' : ''} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
