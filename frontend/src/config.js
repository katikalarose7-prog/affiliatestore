// ─────────────────────────────────────────────────────────────────────────────
// API Configuration — auto-selects correct URL per environment
//
//  LOCAL DEV  → uses http://localhost:5000  (via .env.local)
//  PRODUCTION → uses VITE_API_URL set in Cloudflare Pages dashboard
// ─────────────────────────────────────────────────────────────────────────────

const RAW = import.meta.env.VITE_API_URL

// Strip trailing slash if accidentally added
const API_URL = RAW ? RAW.replace(/\/$/, '') : 'http://localhost:5000'

if (import.meta.env.DEV) {
  console.log('[Config] API_URL:', API_URL)
}

export const API    = `${API_URL}/api`
export const STATIC = API_URL