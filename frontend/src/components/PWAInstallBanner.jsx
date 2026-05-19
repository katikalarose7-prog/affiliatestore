import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Share } from 'lucide-react'

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showAndroid, setShowAndroid]       = useState(false)
  const [showIOS, setShowIOS]               = useState(false)
  const [installing, setInstalling]         = useState(false)
  const [installed, setInstalled]           = useState(false)

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.MSStream)

  const isAndroid = () =>
    /android/i.test(navigator.userAgent)

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  const wasDismissed = () => {
    const t = localStorage.getItem('pwa_dismissed')
    return t && Date.now() - parseInt(t) < 7 * 24 * 60 * 60 * 1000
  }

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return

    // Android / Chrome Desktop — native install prompt
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowAndroid(true), 3500)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setShowAndroid(false)
      setInstalled(true)
      setTimeout(() => setInstalled(false), 4000)
    })

    // iOS Safari — no API, show manual steps
    if (isIOS()) {
      setTimeout(() => setShowIOS(true), 3500)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setInstalling(true)
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setShowAndroid(false)
    } finally {
      setInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const dismiss = () => {
    setShowAndroid(false)
    setShowIOS(false)
    localStorage.setItem('pwa_dismissed', Date.now().toString())
  }

  /* ── Installed success toast ── */
  if (installed) {
    return (
      <div style={s.toast}>
        <span style={{fontSize:'20px'}}>🎉</span>
        <span style={{fontWeight:600, fontSize:'14px', color:'var(--text)'}}>
          PrimeOffers installed successfully!
        </span>
      </div>
    )
  }

  /* ── Android / Chrome native prompt ── */
  if (showAndroid) {
    return (
      <div style={s.banner}>
        <div style={s.left}>
          <div style={s.appIcon}>🛍️</div>
          <div>
            <div style={s.bannerTitle}>Install PrimeOffers</div>
            <div style={s.bannerSub}>Add to home screen for instant access</div>
          </div>
        </div>
        <div style={s.right}>
          <button onClick={handleInstall} disabled={installing} style={s.installBtn}>
            {installing
              ? <span style={{fontSize:'13px'}}>Installing…</span>
              : <><Download size={13} strokeWidth={2.5}/> Install</>
            }
          </button>
          <button onClick={dismiss} style={s.dismissBtn}><X size={14}/></button>
        </div>
      </div>
    )
  }

  /* ── iOS Safari — step-by-step instructions ── */
  if (showIOS) {
    return (
      <div style={s.iosBanner}>
        {/* Header */}
        <div style={s.iosHead}>
          <div style={s.left}>
            <div style={s.appIcon}>🛍️</div>
            <div>
              <div style={s.bannerTitle}>Install PrimeOffers</div>
              <div style={s.bannerSub}>Use as an app on your iPhone</div>
            </div>
          </div>
          <button onClick={dismiss} style={s.dismissBtn}><X size={14}/></button>
        </div>

        {/* Steps */}
        <div style={s.steps}>
          {/* Step 1 */}
          <div style={s.step}>
            <div style={s.stepNum}>1</div>
            <div style={s.stepText}>
              Tap the{' '}
              <span style={s.highlight}>Share</span>
              {' '}button at the{' '}
              <span style={s.highlight}>bottom</span>
              {' '}of your Safari browser
            </div>
            {/* Share icon illustration */}
            <div style={s.iconBox}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div style={s.stepDivider}/>

          {/* Step 2 */}
          <div style={s.step}>
            <div style={s.stepNum}>2</div>
            <div style={s.stepText}>
              Scroll down in the Share menu and tap{' '}
              <span style={s.highlight}>"Add to Home Screen"</span>
            </div>
            {/* Add to home screen icon */}
            <div style={s.iconBox}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8"  y1="12" x2="16" y2="12"/>
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div style={s.stepDivider}/>

          {/* Step 3 */}
          <div style={s.step}>
            <div style={s.stepNum}>3</div>
            <div style={s.stepText}>
              Tap{' '}
              <span style={s.highlight}>"Add"</span>
              {' '}in the top right corner — PrimeOffers will appear on your home screen!
            </div>
            {/* Check icon */}
            <div style={{...s.iconBox, background:'rgba(16,185,129,0.12)'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Arrow pointing down to Safari toolbar */}
        <div style={s.iosArrow}>
          ↓ Look for the Share icon in the Safari toolbar below
        </div>
      </div>
    )
  }

  return null
}

const s = {
  /* Android banner */
  banner: {
    position:'fixed', bottom:'16px', left:'50%',
    transform:'translateX(-50%)',
    zIndex:999,
    width:'calc(100% - 32px)', maxWidth:'460px',
    background:'var(--card-bg)',
    border:'1px solid var(--border)',
    borderRadius:'14px', padding:'14px 16px',
    display:'flex', alignItems:'center',
    justifyContent:'space-between', gap:'12px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.12)',
    animation:'fadeUp 0.4s cubic-bezier(.22,1,.36,1)',
  },

  /* iOS full-card banner */
  iosBanner: {
    position:'fixed', bottom:'16px', left:'50%',
    transform:'translateX(-50%)',
    zIndex:999,
    width:'calc(100% - 32px)', maxWidth:'400px',
    background:'var(--card-bg)',
    border:'1px solid var(--border)',
    borderRadius:'16px', padding:'16px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.12)',
    animation:'fadeUp 0.4s cubic-bezier(.22,1,.36,1)',
    display:'flex', flexDirection:'column', gap:'14px',
  },
  iosHead: {
    display:'flex', alignItems:'center',
    justifyContent:'space-between', gap:'10px',
  },

  /* Steps */
  steps: {
    display:'flex', flexDirection:'column', gap:'0',
    background:'var(--bg2)',
    borderRadius:'10px', overflow:'hidden',
    border:'1px solid var(--border)',
  },
  step: {
    display:'flex', alignItems:'center', gap:'12px',
    padding:'12px 14px',
  },
  stepNum: {
    width:'24px', height:'24px', borderRadius:'50%',
    background:'linear-gradient(135deg,#2563eb,#6366f1)',
    color:'#fff', fontSize:'12px', fontWeight:700,
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  stepText: {
    flex:1, fontSize:'13px', color:'var(--text2)', lineHeight:1.45,
  },
  stepDivider: {
    height:'1px', background:'var(--border)', margin:'0 14px',
  },
  iconBox: {
    width:'44px', height:'44px', borderRadius:'10px',
    background:'rgba(37,99,235,0.1)',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  highlight: {
    color:'var(--accent)', fontWeight:600,
  },
  iosArrow: {
    textAlign:'center', fontSize:'11px',
    color:'var(--text3)', letterSpacing:'0.3px',
  },

  /* Shared */
  left:  {display:'flex', alignItems:'center', gap:'12px', flex:1, minWidth:0},
  right: {display:'flex', alignItems:'center', gap:'8px', flexShrink:0},
  appIcon: {
    width:'42px', height:'42px', borderRadius:'10px',
    background:'linear-gradient(135deg,#2563eb,#6366f1)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'22px', flexShrink:0,
    boxShadow:'0 2px 8px rgba(37,99,235,0.3)',
  },
  bannerTitle: {
    fontFamily:'var(--font-head)', fontWeight:700,
    fontSize:'14px', color:'var(--text)',
  },
  bannerSub: {fontSize:'12px', color:'var(--text2)', marginTop:'1px'},
  installBtn: {
    display:'flex', alignItems:'center', gap:'5px',
    background:'linear-gradient(135deg,#2563eb,#6366f1)',
    color:'#fff', border:'none', borderRadius:'8px',
    padding:'7px 14px', fontSize:'13px', fontWeight:600,
    cursor:'pointer', whiteSpace:'nowrap',
    boxShadow:'0 2px 8px rgba(37,99,235,0.3)',
  },
  dismissBtn: {
    background:'var(--bg2)', border:'1px solid var(--border)',
    borderRadius:'7px', padding:'6px',
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer', color:'var(--text3)', flexShrink:0,
  },
  toast: {
    position:'fixed', bottom:'20px', left:'50%',
    transform:'translateX(-50%)',
    zIndex:999,
    background:'var(--card-bg)',
    border:'1px solid var(--border)',
    borderRadius:'12px', padding:'12px 20px',
    display:'flex', alignItems:'center', gap:'10px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.15)',
    animation:'fadeUp 0.3s cubic-bezier(.22,1,.36,1)',
    whiteSpace:'nowrap',
  },
}