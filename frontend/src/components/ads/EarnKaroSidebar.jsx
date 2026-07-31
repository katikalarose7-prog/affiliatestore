/**
 * EarnKaroSidebar.jsx
 *
 * Sticky sidebar showing stacked EarnKaro deal cards.
 *
 * Usage — add to your layout next to the product grid:
 *
 *   import EarnKaroSidebar from "./EarnKaroSidebar";
 *
 *   <div className="layout">
 *     <main className="product-grid">...</main>
 *     <aside>
 *       <EarnKaroSidebar />
 *     </aside>
 *   </div>
 *
 * CSS for your layout:
 *   .layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; }
 *   @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
 */

import EARNKARO_ADS from "./earnkaroAds.config";

const SIDEBAR_ADS = EARNKARO_ADS.filter((ad) => ad.placement.includes("sidebar"));

export default function EarnKaroSidebar() {
  if (!SIDEBAR_ADS.length) return null;

  return (
    <aside className="ek-sidebar">
      <style>{styles}</style>

      <p className="ek-sidebar-heading">Today's Top Deals</p>

      {SIDEBAR_ADS.map((ad) => (
        <a
          key={ad.id}
          href={ad.earnkaroLink}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="ek-sidebar-card"
        >
          {/* Brand strip */}
          <div className="ek-sidebar-brand-strip" style={{ background: ad.brandColor }}>
            <img src={ad.brandLogo} alt={ad.brand} className="ek-sidebar-logo" />
            {ad.badge && (
              <span className="ek-sidebar-badge">{ad.badge}</span>
            )}
          </div>

          {/* Image */}
          <div className="ek-sidebar-image-wrap">
            <img src={ad.imageUrl} alt={ad.title} className="ek-sidebar-image" />
          </div>

          {/* Text */}
          <div className="ek-sidebar-body">
            <p className="ek-sidebar-title">{ad.title}</p>
            <p className="ek-sidebar-desc">{ad.description}</p>
            <span className="ek-sidebar-cta" style={{ color: ad.brandColor }}>
              Shop Now →
            </span>
            <p className="ek-sidebar-disclosure">Sponsored · via EarnKaro</p>
          </div>
        </a>
      ))}
    </aside>
  );
}

const styles = `
  .ek-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 80px;   /* adjust to match your navbar height */
  }
  .ek-sidebar-heading {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .ek-sidebar-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ek-sidebar-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  .ek-sidebar-brand-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
  }
  .ek-sidebar-logo {
    height: 20px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
  .ek-sidebar-badge {
    font-size: 9px;
    font-weight: 800;
    color: #fff;
    background: rgba(255,255,255,0.25);
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.07em;
  }
  .ek-sidebar-image-wrap { width: 100%; height: 120px; overflow: hidden; }
  .ek-sidebar-image { width: 100%; height: 100%; object-fit: cover; }
  .ek-sidebar-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ek-sidebar-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }
  .ek-sidebar-desc {
    margin: 0;
    font-size: 11.5px;
    color: #64748b;
    line-height: 1.4;
  }
  .ek-sidebar-cta {
    font-size: 12.5px;
    font-weight: 700;
    margin-top: 4px;
  }
  .ek-sidebar-disclosure {
    margin: 4px 0 0;
    font-size: 10px;
    color: #cbd5e1;
  }
`;