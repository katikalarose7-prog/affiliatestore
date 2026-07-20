import { useState } from "react";
import "./ProductCard.css";
import { withFallbackCopy } from "./productCopy";

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

export default function ProductCard({ product: rawProduct }) {
  const [expanded, setExpanded] = useState(false);

  const product = withFallbackCopy(rawProduct);

  const {
    title,
    image,
    price,
    originalPrice,
    affiliateLink,
    description,
    pros = [],
    cons = [],
    bestFor,
    howToUse,
    rating,
    category,
  } = product;

  const taggedLink = ensureTag(affiliateLink);
  const hasPrice = typeof price === "number" && price > 0;
  const discount =
    hasPrice && originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const hasDetails = pros.length > 0 || cons.length > 0 || Boolean(howToUse);

  return (
    <article className="pc-card">
      <span className="pc-ad-badge">#Ad</span>

      <a
        href={taggedLink}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="pc-image-link"
      >
        <img src={image} alt={title} loading="lazy" className="pc-image" />
        {discount && <span className="pc-discount">{discount}% OFF</span>}
      </a>

      <div className="pc-body">
        {category && <span className="pc-category">{category}</span>}

        <h3 className="pc-title">
          <a
            href={taggedLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
          >
            {title}
          </a>
        </h3>

        <p className="pc-description">{description}</p>

        {bestFor && (
          <p className="pc-best-for">
            <span className="pc-best-for-label">Best for:</span> {bestFor}
          </p>
        )}

        <div className="pc-price-row">
          {hasPrice ? (
            <span className="pc-price">₹{price.toLocaleString("en-IN")}</span>
          ) : (
            <span className="pc-price-unavailable">Price unavailable</span>
          )}
          {hasPrice && originalPrice && originalPrice > price && (
            <span className="pc-original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {rating && (
          <div className="pc-rating">
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span className="pc-rating-val"> {rating}/5</span>
          </div>
        )}

        {hasDetails && (
          <>
            <button
              type="button"
              className="pc-toggle"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "▲ Less details" : "▼ More details"}
            </button>

            {expanded && (
              <div className="pc-details">
                {(pros.length > 0 || cons.length > 0) && (
                  <div className="pc-pros-cons">
                    {pros.length > 0 && (
                      <div className="pc-pros">
                        <p className="pc-detail-label">✓ Pros</p>
                        <ul>
                          {pros.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cons.length > 0 && (
                      <div className="pc-cons">
                        <p className="pc-detail-label">✗ Cons</p>
                        <ul>
                          {cons.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
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

        <a
          href={taggedLink}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="pc-cta"
        >
          View on Amazon →
        </a>
      </div>
    </article>
  );
}