// src/config/stores.js
// ─────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all store data
// Adding a new store = add one entry here. Nothing else changes.
// ─────────────────────────────────────────────────────────────────

export const STORES = {
  all: {
    key:         'all',
    name:        'All Stores',
    short:       'All',
    icon:        '🛍️',
    color:       '#2563eb',
    bgColor:     '#eff6ff',
    badgeClass:  'badge-all',
    count:       null,
    categories:  [],
  },
  amazon: {
    key:        'amazon',
    name:       'Amazon',
    short:      'Amazon',
    icon:       '📦',
    color:      '#f97316',
    bgColor:    '#fff7ed',
    badgeClass: 'badge-amazon',
    count:      null,
    categories: [
      'Electronics','Mobiles','Laptops','Kitchen','Furniture',
      'Home Decor','Appliances','Beauty','Fashion','Fitness',
      'Books','Toys','Pet Supplies',
    ],
  },
  myntra: {
    key:        'myntra',
    name:       'Myntra',
    short:      'Myntra',
    icon:       '👗',
    color:      '#f43f5e',
    bgColor:    '#fff1f2',
    badgeClass: 'badge-myntra',
    count:      null,
    categories: [
      'Women Dresses','Women Tops','Women Kurtas','Women Sarees',
      'Women Ethnic Wear','Women Nightwear','Women Activewear',
      'Women Footwear','Women Handbags',
      'Men T-Shirts','Men Shirts','Men Jeans','Men Trousers',
      'Men Ethnic Wear','Men Activewear','Men Nightwear',
      'Men Footwear','Men Watches','Men Accessories',
      'Kids Clothing','Kids Footwear','Kids Accessories','Beauty',
    ],
  },
  flipkart: {
    key:        'flipkart',
    name:       'Flipkart',
    short:      'Flipkart',
    icon:       '🛒',
    color:      '#2563eb',
    bgColor:    '#eff6ff',
    badgeClass: 'badge-flipkart',
    count:      null,
    categories: [
      'Mobiles','Electronics','Fashion','Home & Furniture',
      'Appliances','Beauty','Grocery','Sports','Toys','Books','Automotive',
    ],
  },
  ajio: {
    key:        'ajio',
    name:       'AJIO',
    short:      'AJIO',
    icon:       '✨',
    color:      '#a855f7',
    bgColor:    '#faf5ff',
    badgeClass: 'badge-ajio',
    count:      null,
    categories: [
      'Women Dresses','Women Kurtas','Women Sarees','Women Ethnic Wear',
      'Women Nightwear','Women Footwear','Women Handbags',
      'Men T-Shirts','Men Shirts','Men Jeans','Men Ethnic Wear',
      'Men Footwear','Men Watches','Men Accessories',
      'Kids Clothing','Kids Footwear','Kids Accessories',
    ],
  },
}

// Legacy categories for existing products (store = 'all')
export const LEGACY_CATEGORIES = [
  'All','Electronics','Fashion','Beauty','Kitchen','Home Decor',
  'Fitness','Books','Headphones','Clothing','Footwear',
  'Watches','Sports','Toys','Other',
]

export const STORE_KEYS = Object.keys(STORES)

export const getStore = (key) => STORES[key] || STORES.all

export const getCategoriesForStore = (storeKey) => {
  if (!storeKey || storeKey === 'all') return LEGACY_CATEGORIES
  const cats = STORES[storeKey]?.categories || []
  return cats.length ? ['All', ...cats] : LEGACY_CATEGORIES
}

// Future stores — just add here when ready
export const FUTURE_STORES = ['meesho','nykaa','firstcry','tatacliq']