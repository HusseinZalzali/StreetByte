'use client'

import { useState } from 'react'
import { useRestaurantStore } from '@/store/restaurantStore'
import { formatPrice, timeAgo } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, config } = useRestaurantStore()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length
    return acc
  }, {} as Record<OrderStatus, number>)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders today</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
            filter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all capitalize ${
              filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {s} {counts[s] > 0 && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No orders with this status.</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full capitalize">
                      {order.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.customerName}
                    {order.tableNumber ? ` · Table ${order.tableNumber}` : ''} · {timeAgo(order.createdAt)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-xl text-gray-900">{formatPrice(order.total, config.currencySymbol)}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items.map((oi, idx) => (
                    <span key={idx} className="text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-700">
                      {oi.quantity}× {oi.menuItem.name}
                    </span>
                  ))}
                </div>

                {/* Status changer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Update status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.filter((s) => s !== order.status).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(order.id, s)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 capitalize transition-colors"
                      >
                        → {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
