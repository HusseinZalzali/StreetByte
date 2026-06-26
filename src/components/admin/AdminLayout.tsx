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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-[#1a0800] text-white transition-all duration-300 shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <span className="font-display text-xl font-bold text-secondary">{config.name}</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
