/**
 * EarnKaroPopup.jsx
 *
 * Shows a deal popup 2 seconds after the site loads.
 * Rotates through popup-tagged ads from your config.
 * Remembers dismissal for 24 hours (localStorage).
 *
 * Usage:
 *   import EarnKaroPopup from "./EarnKaroPopup";
 *   // Add once in App.jsx or your root layout:
 *   <EarnKaroPopup />
 */

import { useState, useEffect } from "react";
import EARNKARO_ADS from "./earnkaroAds.config";

const POPUP_ADS    = EARNKARO_ADS.filter((ad) => ad.placement.includes("popup"));
const DISMISS_KEY  = "ek_popup_dismissed_until";
const DISMISS_HOURS = 24;

export default function EarnKaroPopup() {
  const [visible, setVisible]   = useState(false);
  const [adIndex, setAdIndex]   = useState(0);
  const [closing, setClosing]   = useState(false);

  useEffect(() => {
    if (!POPUP_ADS.length) return;

    // Check if dismissed recently
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    // Pick a random ad
    setAdIndex(Math.floor(Math.random() * POPUP_ADS.length));

    // Show after 2 seconds
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      // Remember for 24 hours
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + DISMISS_HOURS * 60 * 60 * 1000)
      );
    }, 300);
  };

  if (!visible || !POPUP_ADS.length) return null;

  const ad = POPUP_ADS[adIndex];

  return (
    <>
      <style>{styles}</style>

      {/* Backdrop */}
      <div
        className={`ek-backdrop ${closing ? "ek-fade-out" : "ek-fade-in"}`}
        onClick={dismiss}
      />

      {/* Popup */}
      <div className={`ek-popup ${closing ? "ek-slide-out" : "ek-slide-in"}`}>

        {/* Brand header */}
        <div className="ek-popup-header" style={{ background: ad.brandColor }}>
          <img src={ad.brandLogo} alt={ad.brand} className="ek-popup-logo" />
          {ad.badge && <span className="ek-badge">{ad.badge}</span>}
          <button className="ek-close" onClick={dismiss} aria-label="Close">✕</button>
        </div>

        {/* Deal image */}
        <div className="ek-popup-image-wrap">
          <img src={ad.imageUrl} alt={ad.title} className="ek-popup-image" />
        </div>

        {/* Content */}
        <div className="ek-popup-body">
          <h3 className="ek-popup-title">{ad.title}</h3>
          <p className="ek-popup-desc">{ad.description}</p>
          <p className="ek-disclosure">Ad · via EarnKaro</p>

          <a
            href={ad.earnkaroLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="ek-popup-cta"
            style={{ background: ad.brandColor }}
            onClick={dismiss}
          >
            Shop Now →
          </a>

          <button className="ek-popup-skip" onClick={dismiss}>
            No thanks, continue browsing
          </button>
        </div>
      </div>
    </>
  );
}

const styles = `
  .ek-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 9998;
  }
  .ek-fade-in  { animation: ekFadeIn  0.3s ease forwards; }
  .ek-fade-out { animation: ekFadeOut 0.3s ease forwards; }
  @keyframes ekFadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ekFadeOut { from { opacity: 1 } to { opacity: 0 } }

  .ek-popup {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: min(420px, 92vw);
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    z-index: 9999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .ek-slide-in  { animation: ekSlideIn  0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .ek-slide-out { animation: ekSlideOut 0.3s ease forwards; }
  @keyframes ekSlideIn  { from { opacity:0; transform:translate(-50%,-46%) } to { opacity:1; transform:translate(-50%,-50%) } }
  @keyframes ekSlideOut { from { opacity:1; transform:translate(-50%,-50%) } to { opacity:0; transform:translate(-50%,-54%) } }

  .ek-popup-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    position: relative;
  }
  .ek-popup-logo {
    height: 28px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
  .ek-badge {
    font-size: 10px;
    font-weight: 800;
    background: rgba(255,255,255,0.25);
    color: #fff;
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 0.08em;
  }
  .ek-close {
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.2);
    border: none;
    color: #fff;
    width: 28px; height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .ek-close:hover { background: rgba(255,255,255,0.35); }
  .ek-popup-image-wrap { width: 100%; height: 160px; overflow: hidden; }
  .ek-popup-image { width: 100%; height: 100%; object-fit: cover; }
  .ek-popup-body {
    padding: 16px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ek-popup-title { margin: 0; font-size: 17px; font-weight: 700; color: #1e293b; }
  .ek-popup-desc  { margin: 0; font-size: 13.5px; color: #475569; line-height: 1.5; }
  .ek-disclosure  { margin: 0; font-size: 10px; color: #94a3b8; }
  .ek-popup-cta {
    display: block;
    color: #fff;
    text-align: center;
    padding: 12px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    margin-top: 4px;
    transition: opacity 0.15s;
  }
  .ek-popup-cta:hover { opacity: 0.88; }
  .ek-popup-skip {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 12px;
    cursor: pointer;
    text-align: center;
    padding: 4px;
    text-decoration: underline;
  }
  .ek-popup-skip:hover { color: #64748b; }
`;