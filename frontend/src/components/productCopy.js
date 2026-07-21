/**
 * productCopy.js
 *
 * IMPORTANT CONTEXT (Amazon Associates rejection — "content is
 * insufficient"): the original version of this file generated the
 * exact same templated sentence for every product, just swapping in
 * the title/category — e.g. "X is a solid pick for your wardrobe,
 * chosen for fit, material, and value." repeated hundreds of times
 * with minor word swaps. That reads as duplicate/thin content to a
 * reviewer or crawler, and is a very plausible contributor to the
 * rejection you received.
 *
 * This version:
 *  1. Prefers REAL fields from your product data (material, fit,
 *     occasion, careInstructions, sizingNote) when present, so the
 *     generated text is actually specific to that product, not just
 *     the category.
 *  2. Falls back to a shorter, honest line (not a padded paragraph)
 *     when no specific attributes are available — padding a sentence
 *     to sound substantial without real information is exactly what
 *     got flagged.
 *  3. Logs a console warning whenever a card is rendering GENERATED
 *     copy instead of authored copy, so you have a visible signal
 *     (in dev tools) of which products still need a human-written
 *     description before your next Associates application/review.
 *
 * The real fix for the content-quality violation is authored content:
 * add `description`, `bestFor`, `pros`, `cons` (and ideally `material`,
 * `fit`, `occasion`, `careInstructions`) to your product records
 * written by a person who's actually looked at the product. This file
 * only prevents a card from looking broken while that's in progress —
 * it is not a substitute for real editorial content at scale.
 */

const CATEGORY_HOOKS = {
  "Women Kurtas": { hook: "ethnic wardrobe", occasions: "festive days, office wear, and casual outings" },
  "Women Dresses": { hook: "everyday and occasion wear", occasions: "brunches, evenings out, and casual weekdays" },
  "Women Tops": { hook: "everyday styling", occasions: "work, weekends, and layering" },
  "Women Sarees": { hook: "traditional wardrobe", occasions: "weddings, festivals, and formal events" },
  Electronics: { hook: "daily tech setup", occasions: "work, entertainment, and everyday use" },
  Default: { hook: "everyday needs", occasions: "regular use" },
};

function cleanTitle(title, category) {
  if (title && title.trim()) return title.trim();
  return category ? `${category} Pick` : "Featured Pick";
}

/**
 * Builds a description. Uses real product-specific attributes when
 * available (material, fit, occasion) so the text is genuinely about
 * THIS product, not a template. Returns { text, isGenerated }.
 */
export function generateDescription(product) {
  const { title, category, rating, material, fit, occasion } = product;
  const t = cleanTitle(title, category);
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const specifics = [];
  if (material) specifics.push(`made from ${material}`);
  if (fit) specifics.push(`a ${fit} fit`);
  if (occasion) specifics.push(`suited to ${occasion}`);

  if (specifics.length > 0) {
    const ratingClause =
      rating && rating >= 4 ? ` Rated ${rating}/5 by buyers who've used it.` : "";
    return {
      text: `${t} features ${specifics.join(", ")}.${ratingClause}`,
      isGenerated: true,
    };
  }

  // No specific attributes to draw on — keep it short and honest
  // rather than padding out a generic paragraph.
  return {
    text: `${t} — a ${hook.hook} option worth a look on Amazon.in. Full details on the product page.`,
    isGenerated: true,
  };
}

export function generateBestFor(product) {
  const { category } = product;
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;
  return {
    text: `Shoppers looking for ${category?.toLowerCase() || "something"} for ${hook.occasions}.`,
    isGenerated: true,
  };
}

export function generateProsCons(product) {
  const { rating } = product;
  const pros = [];
  const cons = [];
  if (rating && rating >= 4) pros.push(`Highly rated at ${rating}/5`);
  pros.push("Sold and fulfilled via Amazon.in");
  cons.push("Availability can change quickly");
  return { pros, cons, isGenerated: true };
}

/**
 * Normalizes a raw product record so every card has content to show —
 * while flagging (via console.warn) which cards are relying on
 * generated filler rather than authored copy, so you can track and
 * prioritize which products still need real editorial content.
 */
export function withFallbackCopy(product) {
  const title = cleanTitle(product.title, product.category);

  let description = product.description?.trim();
  let descriptionIsGenerated = false;
  if (!description) {
    const gen = generateDescription(product);
    description = gen.text;
    descriptionIsGenerated = true;
  }

  let bestFor = product.bestFor?.trim();
  let bestForIsGenerated = false;
  if (!bestFor) {
    const gen = generateBestFor(product);
    bestFor = gen.text;
    bestForIsGenerated = true;
  }

  const hasAuthoredProsCons =
    (product.pros && product.pros.length > 0) ||
    (product.cons && product.cons.length > 0);
  const prosConsResult = hasAuthoredProsCons
    ? { pros: product.pros || [], cons: product.cons || [], isGenerated: false }
    : generateProsCons(product);

  if (
    (descriptionIsGenerated || bestForIsGenerated || prosConsResult.isGenerated) &&
    typeof console !== "undefined"
  ) {
    console.warn(
      `[productCopy] "${title}" (id: ${product._id || "unknown"}) is showing ` +
        `generated fallback content instead of authored copy. Add real ` +
        `description/bestFor/pros/cons to this product's data before your ` +
        `next Amazon Associates review — generated filler across many ` +
        `products is a likely cause of a "content is insufficient" rejection.`
    );
  }

  return {
    ...product,
    title,
    description,
    bestFor,
    pros: prosConsResult.pros,
    cons: prosConsResult.cons,
  };
}