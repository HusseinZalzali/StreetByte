import { cn } from '@/lib/utils'

const tagStyles: Record<string, string> = {
  popular: 'bg-primary/10 text-primary border-primary/20',
  bestseller: 'bg-secondary/20 text-amber-700 border-secondary/40',
  spicy: 'bg-red-100 text-red-700 border-red-200',
  vegetarian: 'bg-green-100 text-green-700 border-green-200',
  new: 'bg-blue-100 text-blue-700 border-blue-200',
}

const tagLabels: Record<string, string> = {
  popular: '🔥 Popular',
  bestseller: '⭐ Bestseller',
  spicy: '🌶️ Spicy',
  vegetarian: '🌿 Veggie',
  new: '✨ New',
}

export default function Badge({ tag }: { tag: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
        tagStyles[tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'
      )}
    >
      {tagLabels[tag] ?? tag}
    </span>
  )
}
