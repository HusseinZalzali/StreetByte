'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from 'lucide-react'
import { useRestaurantStore } from '@/store/restaurantStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { MenuItem } from '@/types'
import { categories } from '@/config/restaurant'

const TAG_OPTIONS = ['popular', 'bestseller', 'spicy', 'vegetarian', 'new'] as const
const EMPTY_ITEM: Omit<MenuItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category: 'burgers',
  image: 'https://picsum.photos/seed/newitem/600/400',
  tags: [],
  available: true,
}

function ItemForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<MenuItem, 'id'>
  onSave: (data: Omit<MenuItem, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleTag(tag: typeof TAG_OPTIONS[number]) {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter((t) => t !== tag)
      : [...form.tags, tag] as typeof form.tags
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="Item name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Price *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          >
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
          <input
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                form.tags.includes(tag)
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={15} /> Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.name || form.price <= 0}>
          <Check size={15} /> Save Item
        </Button>
      </div>
    </div>
  )
}

export default function AdminMenuPage() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, config } = useRestaurantStore()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState('all')

  const filtered = filterCat === 'all' ? menu : menu.filter((i) => i.category === filterCat)

  function handleAdd(data: Omit<MenuItem, 'id'>) {
    addMenuItem({ ...data, id: `item-${Date.now()}` })
    setAdding(false)
  }

  function handleUpdate(id: string, data: Omit<MenuItem, 'id'>) {
    updateMenuItem(id, data)
    setEditingId(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Menu Editor</h1>
          <p className="text-gray-500 mt-1">{menu.length} items · {menu.filter((i) => i.available).length} available</p>
        </div>
        <Button onClick={() => { setAdding(true); setEditingId(null) }}>
          <Plus size={16} /> Add Item
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-6">
          <ItemForm
            initial={EMPTY_ITEM}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              filterCat === c.id
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Items table */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id}>
            {editingId === item.id ? (
              <ItemForm
                initial={item}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className={`bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center ${!item.available ? 'opacity-60' : ''}`}>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    {item.tags.slice(0, 2).map((t) => <Badge key={t} tag={t} />)}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>
                  <p className="text-primary font-display font-bold mt-1">{formatPrice(item.price, config.currencySymbol)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`p-2 rounded-xl transition-colors ${item.available ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                    title={item.available ? 'Mark unavailable' : 'Mark available'}
                  >
                    {item.available ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => { setEditingId(item.id); setAdding(false) }}
                    className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
