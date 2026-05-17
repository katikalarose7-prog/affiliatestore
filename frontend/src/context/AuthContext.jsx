import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token,     setToken]     = useState(() => localStorage.getItem('admin_token'))
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('admin_user'))

  // ── Set up axios interceptor to catch expired tokens globally ──
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        const status = error?.response?.status
        // 401 = Unauthorized (bad/missing token)
        // 403 = Forbidden (token valid but expired or tampered)
        if (status === 401 || status === 403) {
          const isAdminRoute = error?.config?.url?.includes('/api/products') ||
                               error?.config?.url?.includes('/api/banners') ||
                               error?.config?.url?.includes('/api/auth')
          // Only auto-logout if this was an authenticated admin request
          if (isAdminRoute && localStorage.getItem('admin_token')) {
            console.warn('[Auth] Token expired or invalid — logging out')
            doLogout()
            // Redirect to login with a message
            window.location.href = '/admin/login?expired=1'
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  const login = (tkn, username) => {
    setToken(tkn)
    setAdminUser(username)
    localStorage.setItem('admin_token', tkn)
    localStorage.setItem('admin_user', username)
    // Store login time so we can warn before expiry
    localStorage.setItem('admin_login_at', Date.now().toString())
  }

  const doLogout = () => {
    setToken(null)
    setAdminUser(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_login_at')
  }

  const logout = doLogout

  return (
    <AuthContext.Provider value={{ token, adminUser, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)