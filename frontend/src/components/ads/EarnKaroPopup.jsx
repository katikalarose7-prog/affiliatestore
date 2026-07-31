/**
 * EarnKaroInlineAd.jsx
 *
 * Inline deal card shown between product rows in your product grid.
 *
 * Usage — in your product grid, inject after every N products:
 *
 *   import EarnKaroInlineAd from "./EarnKaroInlineAd";
 *
 *   {products.map((product, index) => (
 *     <>
 *       <ProductCard key={product._id} product={product} />
 *       {(index + 1) % 4 === 0 && (
 *         <EarnKaroInlineAd index={Math.floor(index / 4)} />
 *       )}
 *     </>
 *   ))}
 */

import EARNKARO_ADS from "./Earnkaroads.config";

const INLINE_ADS = EARNKARO_ADS.filter((ad) => ad.placement.includes("inline"));

export default function EarnKaroInlineAd({ index = 0 }) {
  if (!INLINE_ADS.length) return null;

  // Cycle through ads
  const ad = INLINE_ADS[index % INLINE_ADS.length];

  return (
    <div className="ek-inline-wrap">
      <style>{styles}</style>

      <div className="ek-inline-card">

        {/* Label */}
        <div className="ek-inline-label">
          <span className="ek-inline-ad-tag">Sponsored Deal</span>
          <span className="ek-inline-brand" style={{ color: ad.brandColor }}>
            {ad.brand}
          </span>
        </div>

        {/* Image */}
        <div className="ek-inline-image-wrap">
          <img src={ad.imageUrl} alt={ad.title} className="ek-inline-image" />
          {ad.badge && (
            <span className="ek-inline-badge" style={{ background: ad.brandColor }}>
              {ad.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="ek-inline-content">
          <div className="ek-inline-brand-row">
            <img src={ad.brandLogo} alt={ad.brand} className="ek-inline-logo" />
          </div>
          <h4 className="ek-inline-title">{ad.title}</h4>
          <p className="ek-inline-desc">{ad.description}</p>

          <a
            href={ad.earnkaroLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="ek-inline-cta"
            style={{ background: ad.brandColor }}
          >
            Shop Now →
          </a>
        </div>

      </div>
    </div>
  );
}

const styles = `
  .ek-inline-wrap {
    grid-column: 1 / -1;  /* spans full grid width */
    padding: 8px 0;
  }
  .ek-inline-card {
    display: flex;
    align-items: stretch;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    position: relative;
  }
  .ek-inline-label {
    position: absolute;
    top: 10px; left: 10px;
    display: flex;
    gap: 6px;
    align-items: center;
    z-index: 2;
  }
  .ek-inline-ad-tag {
    font-size: 10px;
    background: rgba(0,0,0,0.55);
    color: #fff;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .ek-inline-brand {
    font-size: 11px;
    font-weight: 700;
    background: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  .ek-inline-image-wrap {
    width: 280px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .ek-inline-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 160px;
  }
  .ek-inline-badge {
    position: absolute;
    bottom: 10px; left: 10px;
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.06em;
  }
  .ek-inline-content {
    flex: 1;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
  .ek-inline-brand-row { display: flex; align-items: center; }
  .ek-inline-logo { height: 24px; object-fit: contain; }
  .ek-inline-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }
  .ek-inline-desc {
    margin: 0;
    font-size: 13.5px;
    color: #475569;
    line-height: 1.5;
  }
  .ek-inline-cta {
    display: inline-block;
    color: #fff;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    align-self: flex-start;
    transition: opacity 0.15s;
  }
  .ek-inline-cta:hover { opacity: 0.88; }

  @media (max-width: 600px) {
    .ek-inline-card { flex-direction: column; }
    .ek-inline-image-wrap { width: 100%; height: 160px; }
  }
`;