/**
 * productCopy.js
 *
 * Generates good, readable copy for a product card even when the
 * underlying data (from your feed/DB) is missing fields.
 *
 * This is what was silently producing empty-looking cards before:
 * if `description`, `bestFor`, `pros`, or `cons` were blank/undefined,
 * the card just rendered nothing for that section. This module fills
 * those gaps with sensible, category-aware copy so every card looks
 * complete.
 */

// Light per-category phrasing so fallback copy doesn't read as generic filler
const CATEGORY_HOOKS = {
  "Women Kurtas": {
    hook: "ethnic wardrobe",
    occasions: "festive days, office wear, and casual outings",
  },
  "Women Dresses": {
    hook: "everyday and occasion wear",
    occasions: "brunches, evenings out, and casual weekdays",
  },
  "Women Tops": {
    hook: "everyday styling",
    occasions: "work, weekends, and layering",
  },
  "Women Sarees": {
    hook: "traditional wardrobe",
    occasions: "weddings, festivals, and formal events",
  },
  Electronics: {
    hook: "daily tech setup",
    occasions: "work, entertainment, and everyday use",
  },
  Default: {
    hook: "everyday needs",
    occasions: "regular use",
  },
};

function cleanTitle(title, category) {
  if (title && title.trim()) return title.trim();
  // No generic "Product" placeholder — fall back to something
  // category-specific so the title never reads as a filler word.
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;
  return category ? `${category} Pick` : "Featured Pick";
}

/**
 * Builds a 2–3 sentence description when the feed didn't supply one.
 * Uses title + category + rating, so it reads specific rather than templated.
 */
export function generateDescription(product) {
  const { title, category, rating } = product;
  const t = cleanTitle(title, category);
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const ratingClause =
    rating && rating >= 4
      ? ` It's rated ${rating}/5 by verified buyers, so quality isn't a gamble.`
      : "";

  return (
    `${t} is a solid pick for your ${hook.hook}, chosen for fit, material, and value.` +
    ` Works well for ${hook.occasions}.${ratingClause}`
  );
}

/**
 * Returns a "best for" one-liner when missing.
 */
export function generateBestFor(product) {
  const { category } = product;
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;
  return `Shoppers who want reliable ${category?.toLowerCase() || "picks"} for ${hook.occasions}.`;
}

/**
 * Ensures every card has non-empty pros/cons so the expanded view
 * never looks broken or half-filled.
 */
export function generateProsCons(product) {
  const { rating } = product;
  const pros = [];
  const cons = [];

  if (rating && rating >= 4) pros.push(`Highly rated at ${rating}/5`);
  pros.push("Ships and is sold via Amazon.in");

  cons.push("Availability can change quickly");

  return { pros, cons };
}

/**
 * Normalizes a raw product record into one that's always safe to render.
 * Call this once when the product list is fetched, or inline in ProductCard.
 */
export function withFallbackCopy(product) {
  const title = cleanTitle(product.title, product.category);
  const description =
    product.description && product.description.trim()
      ? product.description.trim()
      : generateDescription(product);
  const bestFor =
    product.bestFor && product.bestFor.trim()
      ? product.bestFor.trim()
      : generateBestFor(product);

  const needsProsCons =
    (!product.pros || product.pros.length === 0) &&
    (!product.cons || product.cons.length === 0);
  const { pros, cons } = needsProsCons
    ? generateProsCons(product)
    : { pros: product.pros || [], cons: product.cons || [] };

  return { ...product, title, description, bestFor, pros, cons };
}