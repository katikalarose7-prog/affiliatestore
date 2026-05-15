// ── API base URL ───────────────────────────────────────────────────────────
// Vite exposes VITE_* env vars to the browser at build time.
// In development:  create frontend/.env.local and set VITE_API_URL=http://localhost:5000
// In production:   set VITE_API_URL=https://dealnest-api.onrender.com in Cloudflare Pages
//                  (Settings → Environment Variables)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API    = `${API_URL}/api`
export const STATIC = API_URL