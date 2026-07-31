/**
 * earnkaroAds.config.js
 *
 * Central place to manage all your EarnKaro deal cards.
 * Get your affiliate links from EarnKaro dashboard → My Links.
 *
 * Replace the earnkaroLink values with YOUR actual EarnKaro affiliate URLs.
 * Replace imageUrl with the actual product/banner image.
 */

const EARNKARO_ADS = [
  // ── Amazon ──────────────────────────────────────────────────────────────
  {
    id:          "amz-1",
    brand:       "Amazon",
    brandColor:  "#FF9900",
    brandLogo:   "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    title:       "Great Indian Sale — Up to 70% Off",
    description: "Electronics, fashion, home & more. Limited time deals.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Amazon+Deal",
    badge:       "HOT DEAL",
    earnkaroLink: "https://myntr.it/DCNWCG6", // ← replace
    placement:   ["popup", "inline", "sidebar"],
  },
  {
    id:          "amz-2",
    brand:       "Amazon",
    brandColor:  "#FF9900",
    brandLogo:   "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    title:       "Amazon Fashion — Min 60% Off",
    description: "Top brands in clothing, footwear & accessories.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Amazon+Fashion",
    badge:       "FASHION",
    earnkaroLink: "https://myntr.it/cHYH5ms", // ← replace
    placement:   ["inline", "sidebar"],
  },

  // ── Flipkart ─────────────────────────────────────────────────────────────
  {
    id:          "fk-1",
    brand:       "Flipkart",
    brandColor:  "#2874F0",
    brandLogo:   "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png",
    title:       "Flipkart Big Saving Days",
    description: "Mobiles, TVs, appliances at jaw-dropping prices.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Flipkart+Deal",
    badge:       "LIMITED",
    earnkaroLink: "https://earnkaro.com/your-flipkart-link", // ← replace
    placement:   ["popup", "inline", "sidebar"],
  },
  {
    id:          "fk-2",
    brand:       "Flipkart",
    brandColor:  "#2874F0",
    brandLogo:   "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png",
    title:       "Flipkart Supermart — Grocery Deals",
    description: "Daily essentials delivered fast. Extra 10% off on first order.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Flipkart+Grocery",
    badge:       "NEW",
    earnkaroLink: "https://earnkaro.com/your-flipkart-grocery-link", // ← replace
    placement:   ["inline"],
  },

  // ── Ajio ─────────────────────────────────────────────────────────────────
  {
    id:          "ajio-1",
    brand:       "Ajio",
    brandColor:  "#E91E63",
    brandLogo:   "https://via.placeholder.com/80x30?text=AJIO",
    title:       "Ajio Big Bold Sale — 50–90% Off",
    description: "International & Indian brands. New styles added daily.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Ajio+Sale",
    badge:       "SALE",
    earnkaroLink: "https://earnkaro.com/your-ajio-link", // ← replace
    placement:   ["popup", "inline", "sidebar"],
  },
  {
    id:          "ajio-2",
    brand:       "Ajio",
    brandColor:  "#E91E63",
    brandLogo:   "https://via.placeholder.com/80x30?text=AJIO",
    title:       "Ajio Luxe — Premium Fashion Deals",
    description: "Tommy Hilfiger, Calvin Klein & more at up to 60% off.",
    imageUrl:    "https://via.placeholder.com/400x200?text=Ajio+Luxe",
    badge:       "PREMIUM",
    earnkaroLink: "https://earnkaro.com/your-ajio-luxe-link", // ← replace
    placement:   ["sidebar"],
  },
];

export default EARNKARO_ADS;