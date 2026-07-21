/**
 * ProductCard.jsx (v5 — designed around the Amazon Associates rejection)
 *
 * Change 1 — tracking ID reliability:
 * Links are now built with buildAffiliateLink() from affiliateLink.js,
 * which refuses to render a non-Amazon URL (no shortened/redirect
 * links slipping through) and always forces your tag onto the URL.
 * If a product's link is missing or invalid, the card shows a
 * disabled state instead of a silently broken/untagged link.
 *
 * Change 2 — content sufficiency:
 * Description, "Best for", and Pros/Cons are shown directly on the
 * card by default — not hidden behind a "More details" click. Content
 * a reviewer (or a crawler that doesn't interact with the page) never
 * sees doesn't count as content. "How to use" stays collapsible since
 * it's supplementary, not core.
 */

import { useState, useRef, useLayoutEffect } from "react";
import { withFallbackCopy } from "./productCopy";
import { buildAffiliateLink, getPlatformName } from "./affiliateLink";

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
  imageLink: { display: "block" },
  imageBox: {
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  body: {
    padding: "3.5% 4% 4%",
    display: "flex",
    flexDirection: "column",
    gap: "0.6em",
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
  titleLink: { color: "inherit", textDecoration: "none" },
  description: {
    margin: 0,
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
    color: "#334155",
    lineHeight: 1.6,
    minHeight: "11.2em", // 7 lines × 1.6 line-height, reserved on every card
  },
  descriptionClamped: {
    display: "-webkit-box",
    WebkitLineClamp: 7,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  readMoreBtn: {
    background: "none",
    border: "none",
    padding: 0,
    margin: "-0.3em 0 0",
    fontSize: "clamp(11.5px, 2.8vw, 13px)", // same font size as description
    fontFamily: "inherit",
    fontWeight: 700,
    color: "#334155",
    textDecoration: "underline",
    cursor: "pointer",
    alignSelf: "flex-start",
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
  bestForLabel: { fontWeight: 700, color: "#15803d" },
  personalNote: {
    margin: 0,
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
    color: "#1e3a5f",
    background: "#eff6ff",
    borderLeft: "3px solid #3b82f6",
    padding: "6px 9px",
    borderRadius: "0 6px 6px 0",
    fontStyle: "italic",
    lineHeight: 1.55,
  },
  personalNoteLabel: { fontWeight: 700, fontStyle: "normal", color: "#1d4ed8" },
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
  prosCons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    padding: "3%",
    background: "#f8fafc",
    borderRadius: 8,
    fontSize: "clamp(11px, 2.6vw, 12.5px)",
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
  howToUseBox: {
    padding: "3%",
    background: "#f8fafc",
    borderRadius: 8,
    fontSize: "clamp(11.5px, 2.8vw, 13px)",
  },
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
  ctaDisabled: {
    display: "block",
    background: "#e2e8f0",
    color: "#94a3b8",
    textAlign: "center",
    padding: "9px 10px",
    borderRadius: 8,
    fontSize: "clamp(12.5px, 3vw, 14px)",
    fontWeight: 700,
    marginTop: "auto",
    cursor: "not-allowed",
  },
};

export default function ProductCard({ product: rawProduct }) {
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descOverflows, setDescOverflows] = useState(false);
  const descRef = useRef(null);

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
    personalNote,
    store, // optional explicit platform name from your data, e.g. "Myntra"
  } = product;

  // Detect whether the description actually exceeds 7 lines while
  // clamped — only then do we show the "Read more" link at all.
  useLayoutEffect(() => {
    if (!descExpanded && descRef.current) {
      setDescOverflows(
        descRef.current.scrollHeight > descRef.current.clientHeight + 1
      );
    }
  }, [description, descExpanded]);

  // Strict: null if not a real, taggable Amazon link — never renders
  // a silently-broken or untagged URL.
  const taggedLink = buildAffiliateLink(affiliateLink, { context: title });
  const linkProps = taggedLink
    ? { href: taggedLink, target: "_blank", rel: "nofollow sponsored noopener noreferrer" }
    : {};

  // "View on Myntra" / "View on Flipkart" / "View on Amazon" / etc.
  // Prefers an explicit `store` field from your product data (most
  // reliable — works even if the link is wrapped by a network
  // redirect domain); falls back to detecting the platform from the
  // link's own domain when no `store` field is present.
  const rawPlatformName = store || getPlatformName(taggedLink) || "Store";
  const platformName =
    rawPlatformName.charAt(0).toUpperCase() + rawPlatformName.slice(1).toLowerCase();

  return (
    <article
      style={{
        ...styles.card,
        boxShadow: hovered ? "0 8px 24px rgba(15,23,42,0.12)" : styles.card.boxShadow,
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.adBadge}>#Ad</span>

      {taggedLink ? (
        <a {...linkProps} style={styles.imageLink}>
          <div style={styles.imageBox}>
            <img src={image} alt={title} loading="lazy" style={styles.image} />
          </div>
        </a>
      ) : (
        <div style={styles.imageBox}>
          <img src={image} alt={title} loading="lazy" style={styles.image} />
        </div>
      )}

      <div style={styles.body}>
        {category && <span style={styles.category}>{category}</span>}

        <h3 style={styles.title}>
          {taggedLink ? <a {...linkProps} style={styles.titleLink}>{title}</a> : title}
        </h3>

        {/* Always visible — not gated behind a click.
            Fixed to reserve 7 lines on every card; only shows
            "Read more" if the text actually exceeds 7 lines. */}
        <p
          ref={descRef}
          style={
            descExpanded
              ? styles.description
              : { ...styles.description, ...styles.descriptionClamped }
          }
        >
          {description}
        </p>
        {descOverflows && (
          <button
            type="button"
            style={styles.readMoreBtn}
            onClick={() => setDescExpanded((v) => !v)}
          >
            {descExpanded ? "Read less" : "Read more"}
          </button>
        )}

        {/* Only rendered when you've actually written it — never
            auto-generated, since a fabricated "I used this" claim
            is a fake-testimonial risk, not a content fix. */}
        {personalNote && personalNote.trim() && (
          <p style={styles.personalNote}>
            <span style={styles.personalNoteLabel}>Our take:</span>{" "}
            {personalNote.trim()}
          </p>
        )}

        {bestFor && (
          <p style={styles.bestFor}>
            <span style={styles.bestForLabel}>Best for:</span> {bestFor}
          </p>
        )}

        {Boolean(rating) && rating > 0 && (
          <div style={styles.rating}>
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span style={styles.ratingVal}> {rating}/5</span>
          </div>
        )}

        {(pros.length > 0 || cons.length > 0) && (
          <div style={styles.prosCons}>
            {pros.length > 0 && (
              <div>
                <p style={styles.detailLabel}>✓ Pros</p>
                <ul style={styles.prosList}>
                  {pros.map((p, i) => (
                    <li key={i} style={styles.prosItem}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div>
                <p style={styles.detailLabel}>✗ Cons</p>
                <ul style={styles.consList}>
                  {cons.map((c, i) => (
                    <li key={i} style={styles.consItem}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {howToUse && (
          <>
            <button
              type="button"
              style={styles.toggle}
              aria-expanded={howToUseOpen}
              onClick={() => setHowToUseOpen((v) => !v)}
            >
              {howToUseOpen ? "▲ Hide how to use" : "▼ How to use"}
            </button>
            {howToUseOpen && (
              <div style={styles.howToUseBox}>
                <p style={styles.howToUseText}>{howToUse}</p>
              </div>
            )}
          </>
        )}

        {taggedLink ? (
          <a {...linkProps} style={styles.cta}>
            View on {platformName} →
          </a>
        ) : (
          <span style={styles.ctaDisabled} title="Missing or invalid Amazon link">
            Link unavailable
          </span>
        )}
      </div>
    </article>
  );
}