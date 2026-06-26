'use client'

import { useRestaurantStore } from '@/store/restaurantStore'
import { timeAgo, formatPrice } from '@/lib/utils'
import { TrendingUp, ShoppingBag, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const { orders, menu, config } = useRestaurantStore()

  const todayOrders = orders.filter((o) => o.status !== 'cancelled')
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const activeOrders = orders.filter((o) => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
  const popularItem = menu
    .filter((i) => i.tags.includes('bestseller') || i.tags.includes('popular'))
    .slice(0, 1)[0]

  const stats = [
    {
      label: 'Orders Today',
      value: todayOrders.length,
      icon: ShoppingBag,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Revenue Today',
      value: formatPrice(todayRevenue, config.currencySymbol),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Orders',
      value: activeOrders.length,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Top Item',
      value: popularItem?.name ?? '—',
      icon: Star,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      small: true,
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className={`font-display font-bold mt-0.5 ${stat.small ? 'text-lg' : 'text-2xl'} text-gray-900`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {orders.slice(0, 6).map((order) => (
            <div key={order.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {order.type}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  {order.customerName}
                  {order.tableNumber ? ` · Table ${order.tableNumber}` : ''} · {timeAgo(order.createdAt)}
                </p>
              </div>
              <p className="font-display font-bold text-gray-900">{formatPrice(order.total, config.currencySymbol)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
