import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import PWAInstallBanner from './components/PWAInstallBanner'

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute><Admin /></ProtectedRoute>
        } />
      </Routes>

      {/* PWA install prompt — shows on eligible devices */}
      <PWAInstallBanner />
    </>
  )
}