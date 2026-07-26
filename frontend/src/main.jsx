import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/Themecontext.jsx'
import './index.css'

// ── Global axios defaults ─────────────────────────────────────────
// 15 second timeout — Railway cold starts can take a while to wake up
axios.defaults.timeout = 15000

// Retry up to 2 times on timeout/network error, with a short backoff.
// Total worst-case runway before giving up: ~15s + 1.5s + 15s + 3s + 15s
// ≈ 49.5s across three attempts — enough to ride out a cold start,
// while failing fast (no wait, no retry) once the server is warm.
axios.interceptors.response.use(
  res => res,
  async err => {
    const config = err.config
    if (!config) return Promise.reject(err)
    config._retryCount = config._retryCount || 0

    const isRetryable = err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response
    if (isRetryable && config._retryCount < 2) {
      config._retryCount += 1
      await new Promise(r => setTimeout(r, 1500 * config._retryCount)) // 1.5s, then 3s
      return axios(config)
    }
    return Promise.reject(err)
  }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)