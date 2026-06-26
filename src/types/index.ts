export interface CustomizationOption {
  id: string
  name: string
  priceModifier: number
}

export interface Customization {
  id: string
  name: string
  required: boolean
  options: CustomizationOption[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  tags: Array<'popular' | 'spicy' | 'vegetarian' | 'new' | 'bestseller'>
  available: boolean
  customizations?: Customization[]
}

export interface Category {
  id: string
  name: string
  emoji: string
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  selectedOptions: Record<string, string>
  specialInstructions?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  total: number
  createdAt: Date
  customerName: string
  tableNumber?: string
  type: 'dine-in' | 'takeaway'
}

export interface RestaurantColors {
  primary: string       // RGB e.g. "247 52 46"
  secondary: string     // RGB e.g. "255 184 0"
  bg: string            // RGB e.g. "255 251 240"
  surface: string       // RGB e.g. "255 255 255"
  text: string          // RGB e.g. "26 26 26"
  textMuted: string     // RGB e.g. "107 114 128"
  border: string        // RGB e.g. "229 231 235"
}

export interface RestaurantConfig {
  name: string
  tagline: string
  description: string
  logo?: string
  heroTitle: string
  colors: RestaurantColors
  currency: string
  currencySymbol: string
  address?: string
  phone?: string
  email?: string
  hours?: Record<string, string>
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
}
