/**
 * affiliateLink.js (v3 — multi-platform + EarnKaro shortener support)
 *
 * You sell across Amazon, Myntra, Flipkart, AJIO, Meesho, and FirstCry.
 * Amazon links you build yourself (?tag=...). The rest go through an
 * affiliate network — in your case EarnKaro, whose links come back as
 * bitli.in short URLs.
 *
 * v2 only knew about Cuelinks/EarnKaro's own domain/vCommission/Admitad
 * etc. as network hosts, but not bitli.in specifically — so every
 * FirstCry (and Meesho) link, which is a bitli.in short link, fell
 * through to the "unrecognized domain" branch. It still rendered the
 * link (so DB inserts weren't literally blocked), but it warned loudly
 * on every single product and getPlatformName() returned null for all
 * of them.
 *
 * v3 adds bitli.in to NETWORK_HOSTS, and firstcry.com / meesho.com to
 * MERCHANT_HOSTS + PLATFORM_NAMES.
 *
 * IMPORTANT CAVEAT: bitli.in is a SHARED shortener domain used for
 * both Meesho and FirstCry (and potentially others via EarnKaro). You
 * cannot tell which store a bitli.in link belongs to just by looking
 * at the URL — getPlatformName() will return "EarnKaro" (generic) for
 * any bitli.in link rather than "FirstCry" or "Meesho" specifically.
 * When inserting products, set the `store` field on the product
 * record directly from your source data (e.g. JSON's `source` field
 * lowercased) rather than trying to derive it from the affiliate URL.
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
  "firstcry.com",
  "meesho.com",
  "blinkit.com"
];

// Common affiliate network redirect domains. Trusted as already
// tracked — we don't modify these, since altering query params on a
// network's own redirect URL can break their tracking.
const NETWORK_HOSTS = [
  "cuelinks.com",
  "linksredirect.com",
  "ekaro.in",
  "earnkaro.com",
  "bitli.in",       // EarnKaro's URL shortener — used for Meesho & FirstCry
  "inrdeals.com",
  "admitad.com",
  "ad.admitad.com",
  "vcommission.com",
  "vc-cdn.com",
];

// Display names for each recognized merchant domain, used to build
// "View on X" CTA text automatically from the link itself.
// NOTE: bitli.in is intentionally NOT here — it's a shared shortener,
// so a bitli.in URL alone can't tell you which store it points to.
// Use getPlatformName(url, fallbackStore) below and pass your own
// store/source field as the fallback for shortener links.
const PLATFORM_NAMES = {
  "amazon.in": "Amazon",
  "amazon.com": "Amazon",
  "amzn.in": "Amazon",
  "amzn.to": "Amazon",
  "myntra.com": "Myntra",
  "flipkart.com": "Flipkart",
  "ajio.com": "Ajio",
  "firstcry.com": "FirstCry",
  "meesho.com": "Meesho",
  "blinkit.com":"Blinkit"
};

// Shortener/network-only domains that can't tell you the merchant on
// their own — used to decide when to fall back to a provided store name.
const SHORTENER_ONLY_HOSTS = ["bitli.in"];

/**
 * Returns a display name ("Amazon", "Myntra", "Flipkart", "Ajio",
 * "FirstCry", "Meesho") based on the link's domain.
 *
 * If the link is on a shared shortener domain (e.g. bitli.in) where
 * the merchant can't be determined from the URL alone, pass a
 * `fallbackStore` (e.g. your product's `store` or JSON `source` field)
 * and that will be returned instead, title-cased. Returns null only if
 * nothing can be determined at all.
 */
export function getPlatformName(rawUrl, fallbackStore = null) {
  if (!rawUrl) return fallbackStore ? titleCase(fallbackStore) : null;
  try {
    const host = normalizeHost(new URL(rawUrl).hostname);

    if (hostMatches(host, SHORTENER_ONLY_HOSTS)) {
      return fallbackStore ? titleCase(fallbackStore) : null;
    }

    const match = Object.keys(PLATFORM_NAMES).find(
      (h) => host === h || host.endsWith(`.${h}`)
    );
    if (match) return PLATFORM_NAMES[match];

    return fallbackStore ? titleCase(fallbackStore) : null;
  } catch {
    return fallbackStore ? titleCase(fallbackStore) : null;
  }
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
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
 * non-Amazon platform or a shortener domain.
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

  // Known network / shortener redirect domain (Cuelinks, EarnKaro,
  // bitli.in, etc.) — trust it as already tracked, pass through
  // unchanged.
  if (hostMatches(host, NETWORK_HOSTS)) {
    return u.toString();
  }

  // Direct merchant domain (Myntra/Flipkart/AJIO/FirstCry/Meesho) not
  // wrapped by a known network domain. Still render it — but warn,
  // since a raw merchant link with no visible tracking params is
  // worth double-checking against your network dashboard.
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