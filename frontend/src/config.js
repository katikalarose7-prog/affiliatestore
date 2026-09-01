// src/config.js
// FIX: Renamed SITE_NAME from "PrimeOffers Store" → "BestDealProducts"
// FIX: Updated BACKEND_URL domain from primeoffersstore → bestdealproducts

// ── API base URL ───────────────────────────────────────────────────
// Dev  → hits localhost:5000
// Prod → reads from VITE_API_URL env var (set in Cloudflare Pages / Railway)
export const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api'

// ── Site metadata ──────────────────────────────────────────────────
// FIX: All references renamed from "PrimeOffers" → "BestDealProducts"
export const SITE_NAME  = 'BestDealProducts'
export const SITE_URL   = import.meta.env.VITE_SITE_URL || 'https://bestdealproducts.pages.dev'
export const SITE_EMAIL = 'hello@bestdealproducts.in'

// ── Image fallback ─────────────────────────────────────────────────
export const PLACEHOLDER_IMAGE = '/placeholder.png'

// ── Store definitions ──────────────────────────────────────────────
export const STORES = {
  all:      { key: 'all',      name: 'All Stores', icon: '🏪' },
  amazon:   { key: 'amazon',   name: 'Amazon',     icon: '📦' },
  myntra:   { key: 'myntra',   name: 'Myntra',     icon: '👗' },
  flipkart: { key: 'flipkart', name: 'Flipkart',   icon: '🛒' },
  ajio:     { key: 'ajio',     name: 'AJIO',       icon: '✨' },
  meesho:   { key: 'meesho',   name: 'Meesho',     icon: '🛍️' },
  firstcry: { key: 'firstcry', name: 'FirstCry',   icon: '🧸' },
}
// ── Pagination ─────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 40
export const MAX_PAGE_SIZE     = 200
