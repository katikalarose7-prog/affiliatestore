/**
 * productCopy.js (v3 — attribute-driven, per-item copy)
 *
 * The point of this version: two products in the same category should
 * NOT read like the same sentence with a noun swapped. It pulls from
 * whatever real attributes your product data actually has — brand,
 * material, fit, color, sleeveType, neckType, occasion, features[],
 * careInstructions, sizeNote — and builds sentences whose STRUCTURE
 * changes depending on which attributes exist, not just the words.
 *
 * Recommended fields to add to your product schema (all optional —
 * used opportunistically, the more you have the more specific the
 * copy gets):
 *   brand            "Libas"
 *   material         "cotton", "rayon blend"
 *   fit              "straight", "A-line", "relaxed"
 *   color             "sage green"
 *   sleeveType        "three-quarter sleeve"
 *   neckType          "mandarin collar"
 *   occasion          "festive wear", "daily office wear"
 *   features          ["hand-embroidered yoke", "side pockets"]
 *   careInstructions  "Hand wash separately in cold water"
 *   sizeNote          "Runs true to size" / "Order one size up"
 *
 * Even with all of these filled in, this is still automated copy.
 * Amazon's actual bar is content a real person wrote after evaluating
 * the product — this generator narrows the gap and stops the site
 * from reading as duplicate filler, but authored `description`,
 * `bestFor`, `pros`, `cons` per product (at minimum for your top
 * sellers) is what actually resolves a content-quality rejection.
 *
 * console.warn fires whenever a card falls back to generated content,
 * so you can see in dev tools exactly which products still need a
 * human write-up.
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
 * Builds a 2–4 sentence description whose shape depends on which
 * attributes are present, so products don't converge on one template.
 */
export function generateDescription(product) {
  const {
    title, category, rating, brand, material, fit, color,
    sleeveType, neckType, occasion, features,
  } = product;
  const t = cleanTitle(title, category);
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const sentences = [];

  // Sentence 1: identity — varies based on brand/color/material availability
  const idBits = [];
  if (brand) idBits.push(`from ${brand}`);
  if (color) idBits.push(`in ${color}`);
  if (material) idBits.push(`crafted from ${material}`);
  sentences.push(
    idBits.length > 0 ? `${t} ${idBits.join(", ")}.` : `${t}.`
  );

  // Sentence 2: construction details — only if we have them
  const constructionBits = [];
  if (fit) constructionBits.push(`a ${fit} fit`);
  if (sleeveType) constructionBits.push(sleeveType);
  if (neckType) constructionBits.push(neckType);
  if (constructionBits.length > 0) {
    sentences.push(
      `Cut with ${constructionBits.join(" and ")} for a considered, wearable shape.`
    );
  }

  // Sentence 3: standout feature — only if provided, picks ONE so it
  // doesn't read as a dumped list
  if (Array.isArray(features) && features.length > 0) {
    sentences.push(`Notable detail: ${features[0]}.`);
  }

  // Sentence 4: occasion / use-case
  if (occasion) {
    sentences.push(`Works well for ${occasion}.`);
  } else {
    sentences.push(`Fits naturally into ${hook.occasions}.`);
  }

  // Sentence 5: rating, only if genuinely strong
  if (rating && rating >= 4) {
    sentences.push(`Rated ${rating}/5 by buyers so far.`);
  }

  const isFullyGeneric = !brand && !material && !fit && !color && !occasion &&
    (!Array.isArray(features) || features.length === 0);

  return { text: sentences.join(" "), isGenerated: true, isFullyGeneric };
}

/**
 * "Best for" line — prefers real occasion/fit/sizeNote signals over
 * the generic category hook.
 */
export function generateBestFor(product) {
  const { category, occasion, fit, sizeNote } = product;
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const audienceBits = [];
  if (occasion) audienceBits.push(occasion);
  if (fit) audienceBits.push(`those who prefer a ${fit} fit`);

  let text;
  if (audienceBits.length > 0) {
    text = `Shoppers wanting ${audienceBits.join(" and ")}.`;
  } else {
    text = `Shoppers looking for ${category?.toLowerCase() || "something"} for ${hook.occasions}.`;
  }
  if (sizeNote) text += ` Note: ${sizeNote}.`;

  return { text, isGenerated: true };
}

/**
 * Pros/cons — pulls from features[]/careInstructions/sizeNote when
 * present instead of only generic marketplace boilerplate.
 */
export function generateProsCons(product) {
  const { rating, features, careInstructions, sizeNote } = product;
  const pros = [];
  const cons = [];

  if (rating && rating >= 4) pros.push(`Highly rated at ${rating}/5`);
  if (Array.isArray(features) && features.length > 1) {
    pros.push(features[1]);
  }
  pros.push("Sold and fulfilled via Amazon.in");

  if (careInstructions) cons.push(`Care: ${careInstructions}`);
  if (sizeNote) cons.push(sizeNote);
  if (cons.length === 0) cons.push("Availability can change quickly");

  return { pros, cons, isGenerated: true };
}

export function withFallbackCopy(product) {
  const title = cleanTitle(product.title, product.category);

  let description = product.description?.trim();
  let descriptionIsGenerated = false;
  let descriptionIsFullyGeneric = false;
  if (!description) {
    const gen = generateDescription(product);
    description = gen.text;
    descriptionIsGenerated = true;
    descriptionIsFullyGeneric = gen.isFullyGeneric;
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
    const severity = descriptionIsFullyGeneric ? "HIGH PRIORITY" : "generated";
    console.warn(
      `[productCopy] (${severity}) "${title}" (id: ${product._id || "unknown"}) is ` +
        `showing generated content. ${
          descriptionIsFullyGeneric
            ? "No attributes (brand/material/fit/color/occasion/features) were available at all — this is the thinnest, most generic version of the copy and the most likely to read as duplicate content."
            : "Some real attributes were used, but authored copy is still stronger."
        } Add real description/bestFor/pros/cons (or at least brand/material/fit/occasion/features) before your next Amazon Associates review.`
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