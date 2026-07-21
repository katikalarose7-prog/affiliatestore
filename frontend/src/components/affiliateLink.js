/**
 * affiliateLink.js
 *
 * Amazon rejected the account partly because tracking IDs weren't
 * reliably present on outbound links. The most common causes of that:
 *
 *   1. The product feed contains a shortened/redirect link (bit.ly,
 *      a custom short domain, etc.) instead of a real amazon.in / .com
 *      URL — Amazon's reviewers can't verify a tag hidden behind a
 *      redirect they don't control.
 *   2. The tagging function was only wired up in ONE component. If any
 *      other page/component builds an Amazon link directly (search
 *      results, a "view all" link, JSON-LD structured data, a sitemap,
 *      server-side rendering, etc.) without calling this, that link
 *      ships untagged.
 *
 * Fix: one function, used EVERYWHERE a product link is rendered
 * (cards, category pages, sitemaps, structured data). It:
 *   - Refuses to silently pass through non-Amazon domains
 *   - Always forces YOUR tag, overwriting any different tag already present
 *   - Logs a clear console warning the moment it hits a bad link, so you
 *     catch it in dev instead of finding out from Amazon
 */

export const ASSOCIATES_TAG = "bestdealsp020-21";

// Add every Amazon domain you actually link to
const ALLOWED_HOSTS = [
  "amazon.in",
  "www.amazon.in",
  "amazon.com",
  "www.amazon.com",
  "amzn.in", // Amazon's own official short-link domain — fine to allow
  "amzn.to", // Amazon's own official short-link domain — fine to allow
];

/**
 * Builds a guaranteed-tagged Amazon affiliate link, or returns null
 * (never a broken/untagged link) if the URL isn't actually Amazon.
 *
 * Use this instead of rendering `affiliateLink` directly, anywhere
 * in the codebase.
 */
export function buildAffiliateLink(rawUrl, { context = "" } = {}) {
  if (!rawUrl) {
    console.warn(
      `[affiliateLink] Missing affiliateLink${context ? ` for ${context}` : ""}. ` +
        `This product will not render a working link.`
    );
    return null;
  }

  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    console.warn(
      `[affiliateLink] "${rawUrl}" is not a valid URL${context ? ` (${context})` : ""}.`
    );
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");
  const isAmazon = ALLOWED_HOSTS.some(
    (h) => host === h || host === h.replace(/^www\./, "")
  );

  if (!isAmazon) {
    console.warn(
      `[affiliateLink] "${rawUrl}" is not an Amazon domain${
        context ? ` (${context})` : ""
      }. Shortened/third-party redirect links can hide your tag from ` +
        `Amazon's reviewers and violate Associates policy — link directly ` +
        `to the amazon.in product page instead.`
    );
    return null;
  }

  // Always force OUR tag — overwrite anything already there, don't just
  // fill it in if absent. Guarantees every rendered link is attributed.
  u.searchParams.set("tag", ASSOCIATES_TAG);
  return u.toString();
}