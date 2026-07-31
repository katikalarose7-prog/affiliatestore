import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import PWAInstallBanner from './components/PWAInstallBanner'
import EarnKaroPopup from "./EarnKaroPopup";
// Inside your App return:
import {
  PrivacyPolicy,
  Terms,
  AffiliateDisclosure,
  About,
  Contact,
} from './pages/CompliancePages'

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/admin/login"         element={<AdminLogin />} />
        <Route path="/admin"               element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        {/* Compliance pages */}
        <Route path="/privacy-policy"      element={<PrivacyPolicy />} />
        <Route path="/terms"               element={<Terms />} />
        <Route path="/affiliate-disclosure"element={<AffiliateDisclosure />} />
        <Route path="/about"               element={<About />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
        
      </Routes>
      <PWAInstallBanner />
    </>
  )
}
