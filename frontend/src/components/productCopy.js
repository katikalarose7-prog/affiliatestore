/**
 * productCopy.js (v6 — matches your actual Product schema)
 *
 * Your schema has: name, description (required), highlights[],
 * category, store, affiliateLink, rating. No title/brand/price
 * fields, and no stored bestFor/pros/cons — those were previously
 * computed client-side every render from keyword-matching against
 * name+description text, which is what produced duplicate copy
 * across unrelated products (see below).
 *
 * WHAT THIS VERSION DOES:
 *
 * 1. Prefers product.aiCopy (populated by
 *    services/aiCopyGenerator.js + backfill-ai-copy.js) as the
 *    primary source for description/bestFor/pros/cons/buyingTip/
 *    verdict. aiCopy.description is treated as an override for the
 *    required `description` field — that field is often the
 *    original listing-style text, which is exactly the
 *    duplicate/thin-content risk Amazon flagged; the AI-generated
 *    version is written to be original per product.
 *
 * 2. If a product has real authored `highlights`, those are used
 *    as pros directly — genuine authored content beats anything
 *    generated.
 *
 * 3. Keyword extraction (color/material/fit/etc. detected from
 *    name+description text) is now ONLY the last-resort fallback
 *    when a product has neither aiCopy nor highlights, and its
 *    matching is word-boundary-safe — the old `.includes()` check
 *    was matching "red" inside "Designed", which is why unrelated
 *    products ended up with the same "Best for: fans of red tones"
 *    line.
 */

const CATEGORY_HOOKS = {
  "Women Kurtas": { occasions: "festive days, office wear, and casual outings" },
  "Women Dresses": { occasions: "brunches, evenings out, and casual weekdays" },
  "Women Tops": { occasions: "work, weekends, and layering" },
  "Women Sarees": { occasions: "weddings, festivals, and formal events" },
  Electronics: { occasions: "work, entertainment, and everyday use" },
  Default: { occasions: "regular use" },
};

// --- keyword dictionaries used only by the emergency fallback -------
const COLORS = ["green","beige","pink","red","blue","black","white","yellow","maroon","navy","grey","gray","orange","purple","cream","gold","silver","brown","teal","mustard","lavender","peach","coral","olive","rust","magenta","turquoise","ivory"];
const MATERIALS = ["cotton","rayon","viscose","silk","linen","polyester","georgette","chiffon","denim","wool","satin","velvet","khadi","muslin","crepe","organza"];
const FITS = ["straight","a-line","anarkali","relaxed","slim","regular","flared","asymmetric","fitted","loose","empire"];
const TECHNIQUES = ["embroidered","printed","self-design","self design","hand-block","hand block","sequinned","sequined","tasseled","striped","checked","textured","embellished","hand-embroidered","block-printed"];

/**
 * Word-boundary keyword match. Multi-word phrases are matched as
 * literal phrases; single words use \b so "red" can't fire inside
 * "Designed" or "considered".
 */
function findKeyword(text, list) {
  const lower = text.toLowerCase();
  const hit = list.find((word) => {
    if (word.includes(" ") || word.includes("-")) {
      const pattern = word.replace(/[-\s]+/g, "[-\\s]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(pattern).test(lower);
    }
    return new RegExp(`\\b${word}\\b`).test(lower);
  });
  return hit || null;
}

function extractAttributes(product) {
  const text = [product.name, product.description].filter(Boolean).join(" ");
  if (!text.trim()) return { features: [] };

  const technique = findKeyword(text, TECHNIQUES);
  return {
    color: findKeyword(text, COLORS),
    material: findKeyword(text, MATERIALS),
    fit: findKeyword(text, FITS),
    features: technique ? [`${technique} detailing`] : [],
  };
}

function fallbackBestFor(product, attrs) {
  const { category } = product;
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;
  const audienceBits = [];
  if (attrs.fit) audienceBits.push(`those who prefer a ${attrs.fit} fit`);
  if (attrs.color && audienceBits.length === 0) audienceBits.push(`fans of ${attrs.color} tones`);

  return audienceBits.length > 0
    ? `Shoppers wanting ${audienceBits.join(" and ")}.`
    : `Shoppers looking for ${category?.toLowerCase() || "something"} for ${hook.occasions}.`;
}

function fallbackProsCons(product, attrs) {
  const { rating } = product;
  const pros = [];
  const cons = ["Availability can change quickly"];

  if (rating && rating >= 4) pros.push(`Highly rated at ${rating}/5`);
  if (attrs.material) pros.push(`${attrs.material.charAt(0).toUpperCase() + attrs.material.slice(1)} fabric`);
  if (attrs.features.length > 0) pros.push(attrs.features[0].charAt(0).toUpperCase() + attrs.features[0].slice(1));
  if (pros.length === 0) pros.push("Sold and fulfilled via a trusted retailer");

  return { pros, cons };
}

/**
 * Resolves final display copy for a product using the priority
 * order: aiCopy > authored highlights (for pros only) > keyword
 * fallback (logged — should become rare once the backfill script
 * has run across the catalog).
 */
export function withFallbackCopy(product) {
  const name = product.name?.trim() || "";
  const ai = product.aiCopy || {};
  const usedFallbackFields = [];

  // Description: aiCopy overrides the raw required field, since the
  // raw field is what risked being listing-style/duplicate content.
  let description = ai.description?.trim() || product.description?.trim() || "";
  if (!ai.description?.trim()) usedFallbackFields.push("description (using raw field, not AI copy)");

  let bestFor = ai.bestFor?.trim();
  let pros = ai.pros?.length > 0 ? ai.pros : null;
  let cons = ai.cons?.length > 0 ? ai.cons : null;

  const hasHighlights = product.highlights?.length > 0;
  if (!pros && hasHighlights) {
    pros = product.highlights;
  }

  if (!bestFor || !pros || !cons) {
    const attrs = extractAttributes(product);
    if (!bestFor) {
      bestFor = fallbackBestFor(product, attrs);
      usedFallbackFields.push("bestFor");
    }
    if (!pros || !cons) {
      const gen = fallbackProsCons(product, attrs);
      if (!pros) { pros = gen.pros; usedFallbackFields.push("pros"); }
      if (!cons) { cons = gen.cons; usedFallbackFields.push("cons"); }
    }
  }

  const buyingTip = ai.buyingTip?.trim() || null;
  const verdict = ai.verdict?.trim() || null;

  if (usedFallbackFields.length > 0 && typeof console !== "undefined") {
    console.warn(
      `[productCopy] "${name || product._id || "untitled product"}": falling back on ${usedFallbackFields.join(", ")}. Run backfill-ai-copy.js for this product.`
    );
  }

  return { ...product, name, description, bestFor, pros, cons, buyingTip, verdict };
}