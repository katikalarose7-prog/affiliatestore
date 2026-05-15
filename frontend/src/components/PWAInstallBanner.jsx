import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

/**
 * PWAInstallBanner
 * Shows a native-style "Add to Home Screen" prompt.
 * - On Chrome/Android: uses the beforeinstallprompt event
 * - On iOS Safari: shows manual instructions
 * - Remembers dismissal for 7 days
 */
export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner]         = useState(false)
  const [showIOSHint, setShowIOSHint]       = useState(false)
  const [installing, setInstalling]         = useState(false)

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  const isDismissedRecently = () => {
    const d = localStorage.getItem('pwa_dismissed_at')
    if (!d) return false
    return Date.now() - parseInt(d) < 7 * 24 * 60 * 60 * 1000 // 7 days
  }

  useEffect(() => {
    // Already installed as PWA — don't show
    if (isInStandaloneMode()) return
    // User dismissed recently — don't show
    if (isDismissedRecently()) return

    // Chrome/Android/Desktop: intercept install prompt
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show banner after 3 seconds delay (not immediately on load)
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari: show manual hint (no API available)
    if (isIOS() && !isInStandaloneMode()) {
      setTimeout(() => setShowIOSHint(true), 4000)
    }

    // Hide banner when installed
    window.addEventListener('appinstalled', () => {
      setShowBanner(false)
      setDeferredPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setInstalling(true)
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setShowBanner(false)
    } finally {
      setInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setShowIOSHint(false)
    localStorage.setItem('pwa_dismissed_at', Date.now().toString())
  }

  // Chrome/Android install banner
  if (showBanner) {
    return (
      <div style={s.banner} role="banner" aria-label="Install app">
        <div style={s.bannerLeft}>
          <div style={s.appIcon}>🛍️</div>
          <div>
            <div style={s.bannerTitle}>Install DealNest</div>
            <div style={s.bannerSub}>Add to home screen for quick access</div>
          </div>
        </div>
        <div style={s.bannerRight}>
          <button onClick={handleInstall} disabled={installing} style={s.installBtn}>
            {installing ? '…' : (
              <><Download size={13} strokeWidth={2.5}/> Install</>
            )}
          </button>
          <button onClick={handleDismiss} style={s.dismissBtn} aria-label="Dismiss">
            <X size={14}/>
          </button>
        </div>
      </div>
    )
  }

  // iOS Safari hint
  if (showIOSHint) {
    return (
      <div style={{...s.banner, flexDirection:'column', gap:'10px', alignItems:'flex-start'}} role="banner">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
          <div style={s.bannerLeft}>
            <Smartphone size={20} color="var(--accent)"/>
            <div style={s.bannerTitle}>Add to Home Screen</div>
          </div>
          <button onClick={handleDismiss} style={s.dismissBtn} aria-label="Dismiss">
            <X size={14}/>
          </button>
        </div>
        <p style={s.iosHint}>
          Tap <strong>Share</strong> <span style={{fontSize:'15px'}}>⎙</span> at the bottom of your browser,
          then tap <strong>"Add to Home Screen"</strong> to install DealNest as an app.
        </p>
      </div>
    )
  }

  return null
}

const s = {
  banner: {
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 150,
    width: 'calc(100% - 32px)',
    maxWidth: '460px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
    animation: 'fadeUp 0.4s cubic-bezier(.22,1,.36,1)',
  },
  bannerLeft: {
    display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0,
  },
  appIcon: {
    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
    background: 'linear-gradient(135deg, #2563eb, #6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  },
  bannerTitle: {
    fontFamily: 'var(--font-head)', fontWeight: 700,
    fontSize: '14px', color: 'var(--text)',
  },
  bannerSub: {
    fontSize: '12px', color: 'var(--text2)', marginTop: '1px',
  },
  bannerRight: {
    display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
  },
  installBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'linear-gradient(135deg, #2563eb, #6366f1)',
    color: '#fff', border: 'none', borderRadius: '8px',
    padding: '7px 14px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  },
  dismissBtn: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '7px', padding: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text3)',
    flexShrink: 0,
  },
  iosHint: {
    fontSize: '13px', color: 'var(--text2)',
    lineHeight: 1.55, paddingLeft: '4px',
  },
}