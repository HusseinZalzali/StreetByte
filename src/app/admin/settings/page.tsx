'use client'

import { useState, useEffect } from 'react'
import { useRestaurantStore } from '@/store/restaurantStore'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
import type { RestaurantConfig } from '@/types'

function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const hex = `#${value.split(' ').map((n) => parseInt(n).toString(16).padStart(2, '0')).join('')}`

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r} ${g} ${b}`
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(hexToRgb(e.target.value))}
        className="w-10 h-10 rounded-xl cursor-pointer border-2 border-gray-200 p-0.5"
      />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 font-mono">{hex}</p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea = false, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  type?: string
}) {
  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary'
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

export default function AdminSettingsPage() {
  const { config, updateConfig, updateColors, applyColors } = useRestaurantStore()
  const [form, setForm] = useState<RestaurantConfig>(config)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(config) }, [config])

  function setField<K extends keyof RestaurantConfig>(key: K, value: RestaurantConfig[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setColor(key: keyof RestaurantConfig['colors'], value: string) {
    setForm((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }))
  }

  function handleSave() {
    updateConfig(form)
    updateColors(form.colors)
    setTimeout(() => {
      applyColors()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 50)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Customize your restaurant's branding and information.</p>
      </div>

      <div className="space-y-8">
        {/* Branding */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Branding</h2>
          <Field label="Restaurant Name" value={form.name} onChange={(v) => setField('name', v)} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setField('tagline', v)} />
          <Field label="Hero Title (displayed in 3D scene)" value={form.heroTitle} onChange={(v) => setField('heroTitle', v)} />
          <Field label="Description" value={form.description} onChange={(v) => setField('description', v)} textarea />
        </section>

        {/* Colors */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Theme Colors</h2>
          <p className="text-sm text-gray-400 -mt-3">Click a swatch to pick a color. Changes apply site-wide instantly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ColorSwatch label="Primary" value={form.colors.primary} onChange={(v) => setColor('primary', v)} />
            <ColorSwatch label="Secondary" value={form.colors.secondary} onChange={(v) => setColor('secondary', v)} />
            <ColorSwatch label="Background" value={form.colors.bg} onChange={(v) => setColor('bg', v)} />
            <ColorSwatch label="Surface" value={form.colors.surface} onChange={(v) => setColor('surface', v)} />
            <ColorSwatch label="Text" value={form.colors.text} onChange={(v) => setColor('text', v)} />
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Contact & Location</h2>
          <Field label="Address" value={form.address ?? ''} onChange={(v) => setField('address', v)} />
          <Field label="Phone" value={form.phone ?? ''} onChange={(v) => setField('phone', v)} type="tel" />
          <Field label="Email" value={form.email ?? ''} onChange={(v) => setField('email', v)} type="email" />
        </section>

        {/* Social */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Social Links</h2>
          <Field
            label="Instagram URL"
            value={form.socialLinks?.instagram ?? ''}
            onChange={(v) => setField('socialLinks', { ...form.socialLinks, instagram: v })}
          />
          <Field
            label="Facebook URL"
            value={form.socialLinks?.facebook ?? ''}
            onChange={(v) => setField('socialLinks', { ...form.socialLinks, facebook: v })}
          />
        </section>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button size="lg" onClick={handleSave}>
            {saved ? <><Check size={18} /> Saved!</> : 'Save Changes'}
          </Button>
          {saved && <p className="text-green-600 text-sm font-medium">All changes saved and applied.</p>}
        </div>
      </div>
    </div>
  )
}
