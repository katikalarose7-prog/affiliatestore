import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

const DISMISS_KEY = 'bdp_pwa_dismissed'
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000

const isPWAInstalled = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
const wasDismissed = () => {
  try { const ts = localStorage.getItem(DISMISS_KEY); return ts && Date.now() - parseInt(ts,10) < DISMISS_TTL }
  catch { return false }
}
const markDismissed = () => { try { localStorage.setItem(DISMISS_KEY, Date.now().toString()) } catch {} }
const isIOSDevice = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [mode,           setMode]           = useState(null)
  const [installing,     setInstalling]     = useState(false)

  useEffect(() => {
    if (isPWAInstalled() || wasDismissed()) return
    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setTimeout(() => setMode('android'), 3500) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => { setMode('success'); setTimeout(() => setMode(null), 3500) })
    if (isIOSDevice()) {
      const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent)
      if (isSafari) setTimeout(() => setMode('ios'), 3500)
    }
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => { setMode(null); markDismissed() }
  const handleInstall = async () => {
    if (!deferredPrompt) return
    setInstalling(true)
    try { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome==='accepted') setMode(null) }
    finally { setInstalling(false); setDeferredPrompt(null) }
  }

  if (mode==='success') return (
    <div className="pwa-toast" role="status">
      <span style={{fontSize:20}}>🎉</span>
      <span style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>BestDealProducts installed!</span>
    </div>
  )

  if (mode==='android') return (
    <div className="pwa-banner" role="dialog" aria-label="Install app">
      <div style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0}}>
        <div className="pwa-app-icon">🛍️</div>
        <div style={{minWidth:0}}>
          <div style={{fontWeight:700,fontSize:14,color:'var(--text)',lineHeight:1.3}}>Install BestDealProducts</div>
          <div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>Add to home screen for instant access</div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <button className="pwa-install-btn" onClick={handleInstall} disabled={installing}>
          {installing
            ? <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:13,height:13,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .6s linear infinite',display:'inline-block'}}/>Installing…</span>
            : <><Download size={14} strokeWidth={2.5}/> Install</>}
        </button>
        <button className="pwa-dismiss-btn" onClick={dismiss} aria-label="Dismiss"><X size={16}/></button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (mode==='ios') return (
    <div className="pwa-ios-banner" role="dialog" aria-label="Install on iPhone">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="pwa-app-icon">🛍️</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>Install BestDealProducts</div>
            <div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>Add to your iPhone home screen</div>
          </div>
        </div>
        <button className="pwa-dismiss-btn" onClick={dismiss} aria-label="Dismiss"><X size={16}/></button>
      </div>
      <div style={{background:'var(--bg2)',borderRadius:12,overflow:'hidden',border:'1px solid var(--border)'}}>
        {[
          { num:1, text: <span>Tap <strong style={{color:'var(--accent)'}}>Share</strong> at the <em>bottom</em> of Safari</span>,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> },
          { num:2, text: <span>Tap <strong style={{color:'var(--accent)'}}>Add to Home Screen</strong></span>,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
          { num:3, text: <span>Tap <strong style={{color:'#10b981'}}>Add</strong> — you're done! 🎉</span>,
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
        ].map((s, i) => (
          <div key={s.num}>
            {i>0 && <div style={{height:1,background:'var(--border)',margin:'0 14px'}}/>}
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px'}}>
              <div style={{width:26,height:26,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,var(--accent),var(--indigo))',color:'#fff',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.num}</div>
              <div style={{flex:1,fontSize:13,color:'var(--text2)',lineHeight:1.5}}>{s.text}</div>
              <div style={{width:44,height:44,borderRadius:10,background:s.num===3?'rgba(16,185,129,.12)':'rgba(109,74,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{fontSize:11,color:'var(--text3)',textAlign:'center',lineHeight:1.5,margin:0}}>
        ↑ Look for the share icon at the bottom of Safari
      </p>
    </div>
  )

  return null
}
