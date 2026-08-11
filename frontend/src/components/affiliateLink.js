/**
 * affiliateLink.js (v2 — multi-platform)
 *
 * You sell across Amazon, Myntra, Flipkart, and AJIO, going through
 * an affiliate network (Cuelinks/EarnKaro/INRDeals/Admitad/vCommission
 * etc.) for the non-Amazon platforms. Those networks work differently
 * from Amazon Associates:
 *
 *   - Amazon: you build the link yourself and append ?tag=YOUR_TAG.
 *   - Networks: you generate/convert the link on their side, and they
 *     hand you back a URL already carrying your tracking (often on
 *     their own domain, e.g. cuelinks.com, ekaro.in, ad.admitad.com —
 *     or the original merchant domain with their own tracking params
 *     baked in).
 *
 * v1 of this file only recognized Amazon domains, so it treated every
 * Myntra/Flipkart/AJIO link as invalid and showed "Link unavailable" —
 * even though those were real, already-tracked links. This version
 * recognizes all four platforms plus common network redirect domains,
 * and only blocks a link when it's genuinely broken (not a URL at all,
 * or completely empty) — not just because it isn't Amazon.
 *
 * IMPORTANT: add your specific network's actual domain(s) below if
 * they're not already listed — I've included the common ones, but
 * confirm against a real generated link from your dashboard.
 */

export const ASSOCIATES_TAG = "picksystore03-21";

const AMAZON_HOSTS = [
  "amazon.in",
  "amazon.com",
  "amzn.in",
  "amzn.to",
];

// Direct merchant domains — allowed even without a network wrapper,
// since some networks tag the merchant URL directly rather than
// redirecting through their own domain.
const MERCHANT_HOSTS = [
  "myntra.com",
  "flipkart.com",
  "ajio.com",
];

// Common affiliate network redirect domains. Trusted as already
// tracked — we don't modify these, since altering query params on a
// network's own redirect URL can break their tracking.
const NETWORK_HOSTS = [
  "cuelinks.com",
  "linksredirect.com",
  "ekaro.in",
  "earnkaro.com",
  "inrdeals.com",
  "admitad.com",
  "ad.admitad.com",
  "vcommission.com",
  "vc-cdn.com",
];

// Display names for each recognized merchant domain, used to build
// "View on X" CTA text automatically from the link itself.
const PLATFORM_NAMES = {
  "amazon.in": "Amazon",
  "amazon.com": "Amazon",
  "amzn.in": "Amazon",
  "amzn.to": "Amazon",
  "myntra.com": "Myntra",
  "flipkart.com": "Flipkart",
  "ajio.com": "Ajio",
};

/**
 * Returns a display name ("Amazon", "Myntra", "Flipkart", "Ajio") based
 * on the link's domain, or null if it can't be determined (e.g. the
 * link is wrapped in a network redirect domain rather than the direct
 * merchant domain — in that case, use a `store`/`platform` field from
 * your product data instead, if you have one).
 */
export function getPlatformName(rawUrl) {
  if (!rawUrl) return null;
  try {
    const host = normalizeHost(new URL(rawUrl).hostname);
    const match = Object.keys(PLATFORM_NAMES).find(
      (h) => host === h || host.endsWith(`.${h}`)
    );
    return match ? PLATFORM_NAMES[match] : null;
  } catch {
    return null;
  }
}

function normalizeHost(hostname) {
  return hostname.replace(/^www\./, "");
}

function hostMatches(host, list) {
  return list.some((h) => host === h || host.endsWith(`.${h}`));
}

/**
 * Builds a working, appropriately-tracked link for any of your
 * platforms, or returns null only when the link is genuinely broken
 * (missing / not a valid URL). Never blocks a link just for being a
 * non-Amazon platform.
 */
export function buildAffiliateLink(rawUrl, { context = "" } = {}) {
  if (!rawUrl) {
    console.warn(
      `[affiliateLink] Missing affiliateLink${context ? ` for ${context}` : ""}.`
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

  const host = normalizeHost(u.hostname);

  // Amazon: we control the tagging directly — always force our tag.
  if (hostMatches(host, AMAZON_HOSTS)) {
    u.searchParams.set("tag", ASSOCIATES_TAG);
    return u.toString();
  }

  // Known network redirect domain — trust it as already tracked,
  // pass through unchanged.
  if (hostMatches(host, NETWORK_HOSTS)) {
    return u.toString();
  }

  // Direct merchant domain (Myntra/Flipkart/AJIO) not wrapped by a
  // known network domain. Still render it — but warn, since a raw
  // merchant link with no visible tracking params is worth
  // double-checking against your network dashboard.
  if (hostMatches(host, MERCHANT_HOSTS)) {
    const hasTrackingParams = [...u.searchParams.keys()].length > 0;
    if (!hasTrackingParams) {
      console.warn(
        `[affiliateLink] "${rawUrl}"${context ? ` (${context})` : ""} is a ` +
          `direct ${host} link with no tracking parameters. Confirm this ` +
          `was actually generated through your affiliate network — a raw, ` +
          `untracked merchant link earns no commission and can also cause ` +
          `the same "tracking ID not used" issue Amazon flagged.`
      );
    }
    return u.toString();
  }

  // Unrecognized domain entirely — still render it, but flag loudly
  // so you notice and can add it to the allowlists above if it's
  // actually legitimate (e.g. a new platform or network you've added).
  console.warn(
    `[affiliateLink] "${rawUrl}"${context ? ` (${context})` : ""} is on an ` +
      `unrecognized domain (${host}). If this is a real platform/network, ` +
      `add "${host}" to MERCHANT_HOSTS or NETWORK_HOSTS in affiliateLink.js.`
  );
  return u.toString();
}