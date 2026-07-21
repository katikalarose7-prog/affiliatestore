/**
 * productCopy.js (v4 — auto-extracts attributes from title/description
 * text, so copy differs per product even without new manual fields)
 *
 * THE PROBLEM THIS FIXES:
 * Without explicit brand/material/fit/color/occasion fields, every
 * product in a category fell back to the SAME generic "Best for" /
 * pros-cons line — which is exactly the duplicate-content problem
 * Amazon flagged.
 *
 * THE FIX:
 * Your product titles already contain real, unique descriptive detail
 * ("Women's Green Embroidered Straight Kurta Set with Dupatta",
 * "Beige Self-Design Kurta Set"). extractAttributes() scans the title
 * (and existing description, if any) for color/material/fit/neckline/
 * sleeve/technique keywords and uses whatever it finds to drive the
 * generated copy — so two different titles now reliably produce two
 * different "Best for" / pros / cons, with zero new data entry.
 *
 * Priority order for every attribute: explicit product field (e.g.
 * product.material) > extracted from title/description text >
 * generic category fallback (last resort only).
 *
 * This narrows the duplicate-content gap a lot, but it's still
 * automated. If you have real per-product attributes or authored
 * copy, that always wins — see the explicit-field checks below.
 */

const CATEGORY_HOOKS = {
  "Women Kurtas": { hook: "ethnic wardrobe", occasions: "festive days, office wear, and casual outings" },
  "Women Dresses": { hook: "everyday and occasion wear", occasions: "brunches, evenings out, and casual weekdays" },
  "Women Tops": { hook: "everyday styling", occasions: "work, weekends, and layering" },
  "Women Sarees": { hook: "traditional wardrobe", occasions: "weddings, festivals, and formal events" },
  Electronics: { hook: "daily tech setup", occasions: "work, entertainment, and everyday use" },
  Default: { hook: "everyday needs", occasions: "regular use" },
};

// --- keyword dictionaries used to parse title/description text -----
const COLORS = ["green","beige","pink","red","blue","black","white","yellow","maroon","navy","grey","gray","orange","purple","cream","gold","silver","brown","teal","mustard","lavender","peach","coral","olive","rust","magenta","turquoise","ivory"];
const MATERIALS = ["cotton","rayon","viscose","silk","linen","polyester","georgette","chiffon","denim","wool","satin","velvet","khadi","muslin","crepe","organza"];
const FITS = ["straight","a-line","anarkali","relaxed","slim","regular","flared","asymmetric","fitted","loose","empire"];
const NECKLINES = ["mandarin collar","round neck","v-neck","v neck","boat neck","collar neck","keyhole neck","notched neck"];
const SLEEVES = ["three-quarter sleeve","three quarter sleeve","full sleeve","half sleeve","sleeveless","bell sleeve","puff sleeve","cap sleeve"];
const TECHNIQUES = ["embroidered","printed","self-design","self design","hand-block","hand block","sequinned","sequined","tasseled","striped","checked","textured","embellished","hand-embroidered","block-printed"];

function findKeyword(text, list) {
  const lower = text.toLowerCase();
  const hit = list.find((word) => lower.includes(word));
  return hit || null;
}

/**
 * Scans the title (and description, if present) for descriptive
 * keywords and returns whatever attributes it can find. Returns {}
 * for anything it can't detect — never guesses.
 */
export function extractAttributes(product) {
  const text = [product.title, product.description].filter(Boolean).join(" ");
  if (!text.trim()) return {};

  const technique = findKeyword(text, TECHNIQUES);
  return {
    color: findKeyword(text, COLORS),
    material: findKeyword(text, MATERIALS),
    fit: findKeyword(text, FITS),
    neckType: findKeyword(text, NECKLINES),
    sleeveType: findKeyword(text, SLEEVES),
    features: technique ? [`${technique} detailing`] : [],
  };
}

function cleanTitle(title, category) {
  if (title && title.trim()) return title.trim();
  return category ? `${category} Pick` : "Featured Pick";
}

/** Merges explicit product fields over extracted ones (explicit wins). */
function resolveAttributes(product) {
  const extracted = extractAttributes(product);
  return {
    brand: product.brand || null,
    material: product.material || extracted.material || null,
    fit: product.fit || extracted.fit || null,
    color: product.color || extracted.color || null,
    sleeveType: product.sleeveType || extracted.sleeveType || null,
    neckType: product.neckType || extracted.neckType || null,
    occasion: product.occasion || null,
    features: (product.features && product.features.length > 0)
      ? product.features
      : extracted.features,
    careInstructions: product.careInstructions || null,
    sizeNote: product.sizeNote || null,
  };
}

export function generateDescription(product) {
  const { title, category, rating } = product;
  const attrs = resolveAttributes(product);
  const t = cleanTitle(title, category);
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const sentences = [];

  const idBits = [];
  if (attrs.brand) idBits.push(`from ${attrs.brand}`);
  if (attrs.color) idBits.push(`in ${attrs.color}`);
  if (attrs.material) idBits.push(`crafted from ${attrs.material}`);
  sentences.push(idBits.length > 0 ? `${t} ${idBits.join(", ")}.` : `${t}.`);

  const constructionBits = [];
  if (attrs.fit) constructionBits.push(`a ${attrs.fit} fit`);
  if (attrs.sleeveType) constructionBits.push(attrs.sleeveType);
  if (attrs.neckType) constructionBits.push(attrs.neckType);
  if (constructionBits.length > 0) {
    sentences.push(`Cut with ${constructionBits.join(" and ")} for a considered, wearable shape.`);
  }

  if (attrs.features.length > 0) {
    sentences.push(`Notable detail: ${attrs.features[0]}.`);
  }

  if (attrs.occasion) {
    sentences.push(`Works well for ${attrs.occasion}.`);
  } else {
    sentences.push(`Fits naturally into ${hook.occasions}.`);
  }

  if (rating && rating >= 4) {
    sentences.push(`Rated ${rating}/5 by buyers so far.`);
  }

  const isFullyGeneric = !attrs.brand && !attrs.material && !attrs.fit &&
    !attrs.color && !attrs.occasion && attrs.features.length === 0;

  return { text: sentences.join(" "), isGenerated: true, isFullyGeneric, attrs };
}

export function generateBestFor(product, attrs) {
  const { category } = product;
  const resolved = attrs || resolveAttributes(product);
  const hook = CATEGORY_HOOKS[category] || CATEGORY_HOOKS.Default;

  const audienceBits = [];
  if (resolved.occasion) audienceBits.push(resolved.occasion);
  if (resolved.fit) audienceBits.push(`those who prefer a ${resolved.fit} fit`);
  if (resolved.color && audienceBits.length === 0) audienceBits.push(`fans of ${resolved.color} tones`);

  let text = audienceBits.length > 0
    ? `Shoppers wanting ${audienceBits.join(" and ")}.`
    : `Shoppers looking for ${category?.toLowerCase() || "something"} for ${hook.occasions}.`;

  if (resolved.sizeNote) text += ` Note: ${resolved.sizeNote}.`;
  return { text, isGenerated: true };
}

export function generateProsCons(product, attrs) {
  const { rating } = product;
  const resolved = attrs || resolveAttributes(product);
  const pros = [];
  const cons = [];

  if (rating && rating >= 4) pros.push(`Highly rated at ${rating}/5`);
  if (resolved.material) pros.push(`${resolved.material.charAt(0).toUpperCase() + resolved.material.slice(1)} fabric`);
  if (resolved.features.length > 0) pros.push(resolved.features[0].charAt(0).toUpperCase() + resolved.features[0].slice(1));
  if (pros.length === 0) pros.push("Sold and fulfilled via Amazon.in");

  if (resolved.careInstructions) cons.push(`Care: ${resolved.careInstructions}`);
  if (resolved.sizeNote) cons.push(resolved.sizeNote);
  if (cons.length === 0) cons.push("Availability can change quickly");

  return { pros, cons, isGenerated: true };
}

export function withFallbackCopy(product) {
  const title = cleanTitle(product.title, product.category);
  const attrs = resolveAttributes(product);

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
    const gen = generateBestFor(product, attrs);
    bestFor = gen.text;
    bestForIsGenerated = true;
  }

  const hasAuthoredProsCons =
    (product.pros && product.pros.length > 0) ||
    (product.cons && product.cons.length > 0);
  const prosConsResult = hasAuthoredProsCons
    ? { pros: product.pros || [], cons: product.cons || [], isGenerated: false }
    : generateProsCons(product, attrs);

  if (
    (descriptionIsGenerated || bestForIsGenerated || prosConsResult.isGenerated) &&
    typeof console !== "undefined"
  ) {
    const severity = descriptionIsFullyGeneric ? "HIGH PRIORITY" : "generated (attributes auto-detected)";
    console.warn(
      `[productCopy] (${severity}) "${title}" (id: ${product._id || "unknown"}). ${
        descriptionIsFullyGeneric
          ? "No color/material/fit/technique keywords were found in the title or description at all — this one is still fully generic and worth writing by hand first."
          : "Copy was auto-built from keywords detected in the title/description."
      }`
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