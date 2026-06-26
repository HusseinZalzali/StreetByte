import type { Category, MenuItem, Order, RestaurantConfig } from '@/types'

export const defaultConfig: RestaurantConfig = {
  name: 'StreetByte',
  tagline: 'Bold Flavors. Real Streets.',
  description: 'Crispy, saucy, shareable. Made fresh every day with the flavors you crave.',
  heroTitle: 'EAT BOLD',
  colors: {
    primary: '247 52 46',
    secondary: '255 184 0',
    bg: '255 251 240',
    surface: '255 255 255',
    text: '26 26 26',
    textMuted: '107 114 128',
    border: '229 231 235',
  },
  currency: 'USD',
  currencySymbol: '$',
  address: '42 Street Food Lane, Downtown',
  phone: '+1 (555) 123-4567',
  email: 'hello@streetbyte.com',
  hours: {
    Monday: '11:00 AM – 10:00 PM',
    Tuesday: '11:00 AM – 10:00 PM',
    Wednesday: '11:00 AM – 10:00 PM',
    Thursday: '11:00 AM – 11:00 PM',
    Friday: '11:00 AM – 12:00 AM',
    Saturday: '10:00 AM – 12:00 AM',
    Sunday: '10:00 AM – 9:00 PM',
  },
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}

export const categories: Category[] = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'starters', name: 'Starters', emoji: '🔥' },
  { id: 'wings', name: 'Wings', emoji: '🍗' },
  { id: 'sandwiches', name: 'Sandwiches', emoji: '🥙' },
  { id: 'salads', name: 'Salads', emoji: '🥗' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'sides', name: 'Sides', emoji: '🍟' },
  { id: 'kids', name: 'Kids', emoji: '⭐' },
]

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 'st1',
    name: 'Tawook Bites',
    description: 'Crispy golden fried chicken bites marinated in our house tawook spice blend. Served with garlic sauce.',
    price: 8.99,
    category: 'starters',
    image: '/samples/tawook bites.jpg',
    tags: ['popular', 'bestseller'],
    available: true,
    customizations: [
      {
        id: 'size',
        name: 'Portion',
        required: true,
        options: [
          { id: 'regular', name: 'Regular (6 pcs)', priceModifier: 0 },
          { id: 'large', name: 'Large (10 pcs)', priceModifier: 4 },
        ],
      },
    ],
  },
  {
    id: 'st2',
    name: 'Hot Cheddar Triangles',
    description: 'Crispy breaded triangles oozing with melted cheddar cheese. Served with a smoky chipotle dip.',
    price: 7.49,
    category: 'starters',
    image: '/samples/hot cheddar trirangles.jpg',
    tags: ['popular'],
    available: true,
  },
  {
    id: 'st3',
    name: 'Starter Combo',
    description: 'The ultimate sharing platter — fried chicken pieces, hot triangles, curly fries, and dips. Feeds 2–3.',
    price: 19.99,
    category: 'starters',
    image: '/samples/starter combo.jpg',
    tags: ['bestseller', 'new'],
    available: true,
  },
  // Wings
  {
    id: 'w1',
    name: 'Wings Platter',
    description: 'Crispy wings tossed in your choice of sauce: Classic Buffalo, BBQ Honey, Cheesy Garlic, or Sriracha. Served on a wooden board.',
    price: 14.99,
    category: 'wings',
    image: '/samples/wings.jpg',
    tags: ['popular', 'bestseller'],
    available: true,
    customizations: [
      {
        id: 'sauce',
        name: 'Sauce',
        required: true,
        options: [
          { id: 'buffalo', name: 'Classic Buffalo', priceModifier: 0 },
          { id: 'bbq', name: 'BBQ Honey', priceModifier: 0 },
          { id: 'cheesy', name: 'Cheesy Garlic', priceModifier: 0 },
          { id: 'sriracha', name: 'Sriracha', priceModifier: 0 },
        ],
      },
      {
        id: 'size',
        name: 'Size',
        required: true,
        options: [
          { id: '6pc', name: '6 Wings', priceModifier: 0 },
          { id: '12pc', name: '12 Wings', priceModifier: 7 },
        ],
      },
    ],
  },
  // Sandwiches
  {
    id: 'sw1',
    name: 'Fahita Sandwich',
    description: 'Grilled chicken strips with caramelised peppers, onions, melted cheese and corn, piled into a toasted sesame bun. Served with fries.',
    price: 12.99,
    category: 'sandwiches',
    image: '/samples/fahita.jpg',
    tags: ['popular'],
    available: true,
  },
  // Salads
  {
    id: 'sa1',
    name: 'Magnifici Salad',
    description: 'Sliced grilled chicken over a bed of mixed greens, cherry tomatoes, walnuts, cranberries and mushrooms. Drizzled with warm honey mustard dressing.',
    price: 11.49,
    category: 'salads',
    image: '/samples/magnifici salad.jpg',
    tags: ['vegetarian', 'new'],
    available: true,
  },
  {
    id: 'sa2',
    name: 'Chicken Caesar',
    description: 'Seasoned grilled chicken on crisp romaine, house-made caesar dressing, parmesan shavings, golden croutons.',
    price: 11.99,
    category: 'salads',
    image: '/samples/chicken ceasar.jpg',
    tags: ['popular'],
    available: true,
  },
  // Pasta
  {
    id: 'pa1',
    name: 'Cheesy Pesto Fusilli',
    description: 'Al dente fusilli tossed in a rich, velvety basil pesto cream sauce, finished with freshly grated parmesan.',
    price: 10.99,
    category: 'pasta',
    image: '/samples/cheesy pesto.jpg',
    tags: ['vegetarian', 'bestseller'],
    available: true,
  },
  // Sides
  {
    id: 'si1',
    name: 'Curly Fries',
    description: 'Seasoned spiral-cut curly fries, perfectly crispy. Served with your choice of dipping sauce.',
    price: 4.99,
    category: 'sides',
    image: '/samples/curly fries.jpg',
    tags: ['popular'],
    available: true,
    customizations: [
      {
        id: 'dip',
        name: 'Dipping Sauce',
        required: false,
        options: [
          { id: 'mayo', name: 'Garlic Mayo', priceModifier: 0 },
          { id: 'chipotle', name: 'Chipotle', priceModifier: 0 },
          { id: 'ketchup', name: 'Ketchup', priceModifier: 0 },
        ],
      },
    ],
  },
  // Kids
  {
    id: 'k1',
    name: 'Kids Nuggets Meal',
    description: 'Golden crispy chicken nuggets served with seasoned fries and a Mango Sensation juice box. The kids\' favourite!',
    price: 8.99,
    category: 'kids',
    image: '/samples/kids nuggets.jpg',
    tags: ['new'],
    available: true,
  },
]

export const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Carlos M.',
    tableNumber: '4',
    type: 'dine-in',
    status: 'preparing',
    total: 36.97,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    items: [
      { menuItem: menuItems[0], quantity: 2, selectedOptions: { size: 'large' } },
      { menuItem: menuItems[3], quantity: 1, selectedOptions: { sauce: 'buffalo', size: '6pc' } },
      { menuItem: menuItems[8], quantity: 1, selectedOptions: { dip: 'chipotle' } },
    ],
  },
  {
    id: 'ORD-002',
    customerName: 'Sofia R.',
    type: 'takeaway',
    status: 'ready',
    total: 23.48,
    createdAt: new Date(Date.now() - 28 * 60 * 1000),
    items: [
      { menuItem: menuItems[4], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[6], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[8], quantity: 1, selectedOptions: { dip: 'mayo' } },
    ],
  },
  {
    id: 'ORD-003',
    customerName: 'James K.',
    tableNumber: '7',
    type: 'dine-in',
    status: 'confirmed',
    total: 54.96,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    items: [
      { menuItem: menuItems[2], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[3], quantity: 1, selectedOptions: { sauce: 'bbq', size: '12pc' } },
      { menuItem: menuItems[7], quantity: 2, selectedOptions: {} },
    ],
  },
  {
    id: 'ORD-004',
    customerName: 'Maria L.',
    type: 'takeaway',
    status: 'pending',
    total: 26.97,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    items: [
      { menuItem: menuItems[1], quantity: 2, selectedOptions: {} },
      { menuItem: menuItems[5], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[8], quantity: 2, selectedOptions: { dip: 'ketchup' } },
    ],
  },
  {
    id: 'ORD-005',
    customerName: 'David H.',
    tableNumber: '2',
    type: 'dine-in',
    status: 'completed',
    total: 31.97,
    createdAt: new Date(Date.now() - 65 * 60 * 1000),
    items: [
      { menuItem: menuItems[4], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[6], quantity: 1, selectedOptions: {} },
      { menuItem: menuItems[9], quantity: 2, selectedOptions: {} },
    ],
  },
]
