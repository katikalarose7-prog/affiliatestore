/**
 * ProductCard.jsx  (full version with content fields)
 *
 * Renders description, pros & cons, who it's best for, how to use.
 * This satisfies Amazon's content quality requirement.
 */

import { useState } from "react";

const ASSOCIATES_TAG = "bestdealsp020-21";

function ensureTag(url) {
  if (!url) return "#";
  try {
    const u = new URL(url);
    if (!u.searchParams.get("tag")) u.searchParams.set("tag", ASSOCIATES_TAG);
    return u.toString();
  } catch {
    return url;
  }
}

export default function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);

  const {
    title, image, price, originalPrice,
    affiliateLink, description,
    pros = [], cons = [], bestFor, howToUse,
    rating, category,
  } = product;

  const taggedLink = ensureTag(affiliateLink);
  const discount   = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const hasContent = description || pros.length || cons.length || bestFor || howToUse;

  return (
    <article className="pc-card">
      <style>{styles}</style>

      {/* Disclosure */}
      <span className="pc-ad-badge">#Ad</span>

      {/* Image */}
      <a href={taggedLink} target="_blank" rel="nofollow sponsored noopener noreferrer"
        className="pc-image-link">
        <img src={image} alt={title} loading="lazy" className="pc-image" />
        {discount && <span className="pc-discount">{discount}% OFF</span>}
      </a>

      {/* Info */}
      <div className="pc-body">
        {category && <span className="pc-category">{category}</span>}

        <h3 className="pc-title">
          <a href={taggedLink} target="_blank" rel="nofollow sponsored noopener noreferrer">
            {title}
          </a>
        </h3>

        {/* Description */}
        {description && <p className="pc-description">{description}</p>}

        {/* Best For */}
        {bestFor && (
          <p className="pc-best-for">
            <span className="pc-best-for-label">Best for:</span> {bestFor}
          </p>
        )}

        {/* Price */}
        <div className="pc-price-row">
          <span className="pc-price">₹{price?.toLocaleString("en-IN")}</span>
          {originalPrice && (
            <span className="pc-original-price">₹{originalPrice?.toLocaleString("en-IN")}</span>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="pc-rating">
            {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
            <span className="pc-rating-val"> {rating}/5</span>
          </div>
        )}

        {/* Expand/collapse for pros, cons, how to use */}
        {hasContent && (
          <>
            <button className="pc-toggle" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "▲ Less details" : "▼ More details"}
            </button>

            {expanded && (
              <div className="pc-details">
                {(pros.length > 0 || cons.length > 0) && (
                  <div className="pc-pros-cons">
                    {pros.length > 0 && (
                      <div className="pc-pros">
                        <p className="pc-detail-label">✓ Pros</p>
                        <ul>{pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </div>
                    )}
                    {cons.length > 0 && (
                      <div className="pc-cons">
                        <p className="pc-detail-label">✗ Cons</p>
                        <ul>{cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
                {howToUse && (
                  <div className="pc-how-to-use">
                    <p className="pc-detail-label">How to use</p>
                    <p>{howToUse}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <a href={taggedLink} target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="pc-cta">
          View on Amazon →
        </a>
      </div>
    </article>
  );
}

const styles = `
  .pc-card {
    position: relative;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s;
  }
  .pc-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .pc-ad-badge {
    position: absolute;
    top: 10px; left: 10px;
    background: rgba(0,0,0,0.55);
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 2;
  }
  .pc-image-link { display: block; position: relative; }
  .pc-image {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: contain;
    background: #f8fafc;
    padding: 12px;
  }
  .pc-discount {
    position: absolute;
    bottom: 10px; right: 10px;
    background: #ef4444;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
  }
  .pc-body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .pc-category {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6366f1;
  }
  .pc-title { margin: 0; font-size: 14px; font-weight: 600; line-height: 1.4; color: #1e293b; }
  .pc-title a { color: inherit; text-decoration: none; }
  .pc-title a:hover { color: #6366f1; }
  .pc-description { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }
  .pc-best-for {
    margin: 0;
    font-size: 12.5px;
    color: #475569;
    background: #f0fdf4;
    border-left: 3px solid #22c55e;
    padding: 6px 10px;
    border-radius: 0 6px 6px 0;
  }
  .pc-best-for-label { font-weight: 600; color: #15803d; }
  .pc-price-row { display: flex; align-items: baseline; gap: 8px; }
  .pc-price { font-size: 18px; font-weight: 700; color: #1e293b; }
  .pc-original-price { font-size: 13px; color: #94a3b8; text-decoration: line-through; }
  .pc-rating { font-size: 13px; color: #f59e0b; }
  .pc-rating-val { color: #64748b; font-size: 12px; }
  .pc-toggle {
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    color: #64748b;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .pc-toggle:hover { border-color: #6366f1; color: #6366f1; }
  .pc-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 13px;
  }
  .pc-pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pc-detail-label {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
  }
  .pc-pros ul, .pc-cons ul { margin: 0; padding-left: 16px; line-height: 1.6; }
  .pc-pros li { color: #15803d; }
  .pc-cons li { color: #b91c1c; }
  .pc-how-to-use p:last-child { margin: 0; color: #475569; line-height: 1.5; }
  .pc-cta {
    display: block;
    background: #FF9900;
    color: #111;
    text-align: center;
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    margin-top: auto;
    transition: background 0.15s;
  }
  .pc-cta:hover { background: #e68900; }
`;