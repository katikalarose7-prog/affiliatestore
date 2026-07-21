/**
 * ProductCard.jsx (v4)
 *
 * Changes in this version:
 * - Price section removed entirely (no price row, no discount badge).
 * - No more literal "Product" placeholder text — see productCopy.js,
 *   the title fallback now uses the category instead (e.g. "Women
 *   Kurtas Pick") so it never reads as a filler word.
 * - Responsive by design instead of fixed pixel sizes: the image box
 *   uses aspect-ratio (scales proportionally at any card width) and
 *   text uses clamp() (scales fluidly between mobile and desktop).
 *   This means the card looks right whether your grid gives it 160px
 *   on a small phone or 320px on desktop — no media query needed.
 *
 * Still uses inline styles (no CSS file/import required) since that
 * was what fixed the "styles not loading" issue.
 */

import { useState } from "react";
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

const styles = {
  card: {
    position: "relative",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  adBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "rgba(15,23,42,0.65)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.03em",
    padding: "2px 7px",
    borderRadius: 4,
    zIndex: 2,
  },
  imageLink: {
    display: "block",
  },
  imageBox: {
    width: "100%",
    aspectRatio: "3 / 4",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "4%",
    boxSizing: "border-box",
  },
  body: {
    padding: "3.5% 4% 4%",
    display: "flex",
    flexDirection: "column",
    gap: "0.55em",
    flex: 1,
  },
  category: {
    fontSize: "clamp(10px, 2.4vw, 11px)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#6366f1",
  },
  title: {
    margin: 0,
    fontSize: "clamp(13px, 3.2vw, 15px)",
    fontWeight: 700,
    lineHeight: 1.35,
    color: "#0f172a",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  titleLink: {
    color: "inherit",
    textDecoration: "none",
  },
  description: {
    margin: 0,
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
    color: "#475569",
    lineHeight: 1.55,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  bestFor: {
    margin: 0,
    fontSize: "clamp(11px, 2.6vw, 12.5px)",
    color: "#14532d",
    background: "#f0fdf4",
    borderLeft: "3px solid #22c55e",
    padding: "6px 9px",
    borderRadius: "0 6px 6px 0",
  },
  bestForLabel: {
    fontWeight: 700,
    color: "#15803d",
  },
  rating: {
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
    color: "#f59e0b",
    letterSpacing: 1,
  },
  ratingVal: {
    color: "#64748b",
    fontSize: "clamp(10.5px, 2.4vw, 12px)",
    letterSpacing: "normal",
  },
  toggle: {
    alignSelf: "flex-start",
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: "clamp(11px, 2.6vw, 12px)",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "3%",
    background: "#f8fafc",
    borderRadius: 8,
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
  },
  prosCons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  detailLabel: {
    margin: "0 0 4px",
    fontSize: "clamp(10px, 2.4vw, 11px)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#475569",
  },
  prosList: { margin: 0, paddingLeft: 16, lineHeight: 1.6 },
  consList: { margin: 0, paddingLeft: 16, lineHeight: 1.6 },
  prosItem: { color: "#15803d" },
  consItem: { color: "#b91c1c" },
  howToUseText: { margin: 0, color: "#475569", lineHeight: 1.5 },
  cta: {
    display: "block",
    background: "#ff9900",
    color: "#111",
    textAlign: "center",
    padding: "9px 10px",
    borderRadius: 8,
    fontSize: "clamp(12.5px, 3vw, 14px)",
    fontWeight: 700,
    textDecoration: "none",
    marginTop: "auto",
  },
};

export default function ProductCard({ product: rawProduct }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const product = withFallbackCopy(rawProduct);

  const {
    title,
    image,
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
  const hasDetails = pros.length > 0 || cons.length > 0 || Boolean(howToUse);

  return (
    <article
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 8px 24px rgba(15,23,42,0.12)"
          : styles.card.boxShadow,
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.adBadge}>#Ad</span>

      <a
        href={taggedLink}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        style={styles.imageLink}
      >
        <div style={styles.imageBox}>
          <img src={image} alt={title} loading="lazy" style={styles.image} />
        </div>
      </a>

      <div style={styles.body}>
        {category && <span style={styles.category}>{category}</span>}

        <h3 style={styles.title}>
          <a
            href={taggedLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            style={styles.titleLink}
          >
            {title}
          </a>
        </h3>

        <p style={styles.description}>{description}</p>

        {bestFor && (
          <p style={styles.bestFor}>
            <span style={styles.bestForLabel}>Best for:</span> {bestFor}
          </p>
        )}

        {rating && (
          <div style={styles.rating}>
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span style={styles.ratingVal}> {rating}/5</span>
          </div>
        )}

        {hasDetails && (
          <>
            <button
              type="button"
              style={styles.toggle}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "▲ Less details" : "▼ More details"}
            </button>

            {expanded && (
              <div style={styles.details}>
                {(pros.length > 0 || cons.length > 0) && (
                  <div style={styles.prosCons}>
                    {pros.length > 0 && (
                      <div>
                        <p style={styles.detailLabel}>✓ Pros</p>
                        <ul style={styles.prosList}>
                          {pros.map((p, i) => (
                            <li key={i} style={styles.prosItem}>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cons.length > 0 && (
                      <div>
                        <p style={styles.detailLabel}>✗ Cons</p>
                        <ul style={styles.consList}>
                          {cons.map((c, i) => (
                            <li key={i} style={styles.consItem}>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {howToUse && (
                  <div>
                    <p style={styles.detailLabel}>How to use</p>
                    <p style={styles.howToUseText}>{howToUse}</p>
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
          style={styles.cta}
        >
          View on Amazon →
        </a>
      </div>
    </article>
  );
}