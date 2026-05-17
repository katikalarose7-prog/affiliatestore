// ─────────────────────────────────────────────────────────────────────────────
// API Configuration
//
// HOW THIS WORKS:
//   Vite reads VITE_* environment variables at BUILD TIME and bakes them in.
//   So the value of VITE_API_URL must be set BEFORE you run "npm run build".
//
// LOCAL DEV  → create frontend/.env.local  with: VITE_API_URL=http://localhost:5000
// PRODUCTION → set in Cloudflare Pages dashboard (Settings → Environment Variables)
//              Key:   VITE_API_URL
//              Value: https://your-backend.up.railway.app   ← your Railway URL
// ─────────────────────────────────────────────────────────────────────────────

const RAW = import.meta.env.VITE_API_URL

// Strip trailing slash if someone accidentally added one
const API_URL = RAW ? RAW.replace(/\/$/, '') : 'http://localhost:5000'

if (import.meta.env.DEV) {
  console.log('[Config] API_URL:', API_URL)
}

export const API    = `${API_URL}/api`
export const STATIC = API_URL