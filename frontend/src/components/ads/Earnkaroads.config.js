
import EraserImg from '../../assets/Eraser.png';
import Bangleimg from '../../assets/Bangles.png';
import BedsheetImg from '../../assets/Bedsheet.png';
import ShoeImg from '../../assets/Shoe.png';


// Fix brand assignment — your myntr.it links are MYNTRA not Amazon
const EARNKARO_ADS = [

  // ── Myntra (your actual links) ───────────────────
  {
    id:          "myn-1",
    brand:       "Myntra",
    brandColor:  "#FF3F6C",
    brandLogo:   "https://constant.myntassets.com/web/assets/img/logo_myntra.png",
    title:       "Myntra Sale — Up to 70% Off",
    description: "Top fashion brands at unbeatable prices.",
    imageUrl:    "Bangleimg",
    badge:       "HOT DEAL",
    earnkaroLink: "https://myntr.it/VOJDq2l", // ✅ your real link
    placement:   ["popup", "inline", "sidebar"],
  },
  {
    id:          "myn-2",
    brand:       "Myntra",
    brandColor:  "#FF3F6C",
    brandLogo:   "https://constant.myntassets.com/web/assets/img/logo_myntra.png",
    title:       "Myntra Fashion — Min 60% Off",
    description: "Clothing, footwear & accessories from top brands.",
    imageUrl:    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop",
    badge:       "FASHION",
    earnkaroLink: "https://myntr.it/VOJDq2l", // ✅ your real link
    placement:   ["inline", "sidebar"],
  },

  // ── Amazon — PASTE YOUR EARNKARO AMAZON LINK ─────
  {
    id:          "amz-1",
    brand:       "Amazon",
    brandColor:  "#FF9900",
    brandLogo:   "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    title:       "Amazon Great Indian Sale",
    description: "Electronics, fashion, home & more. Limited time deals.",
    imageUrl:    EraserImg,
    badge:       "HOT DEAL",
    earnkaroLink: "https://link.amazon/B0eoTs0ik", // TODO: replace before going live
    placement:   ["popup", "inline", "sidebar"],
  },

  // ── Flipkart — PASTE YOUR EARNKARO FLIPKART LINK ─
  {
    id:          "fk-1",
    brand:       "Flipkart",
    brandColor:  "#2874F0",
    brandLogo:   "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png",
    title:       "Flipkart Big Saving Days",
    description: "Mobiles, TVs, appliances at jaw-dropping prices.",
    imageUrl:    "BedsheetImg",
    badge:       "LIMITED",
    earnkaroLink: "https://fktr.in/8ymbjbs",
    placement:   ["inline", "sidebar"],
  },

  // ── Ajio — PASTE YOUR EARNKARO AJIO LINK ─────────
  {
    id:          "ajio-1",
    brand:       "Ajio",
    brandColor:  "#E91E63",
    brandLogo:   "https://via.placeholder.com/80x30?text=AJIO",
    title:       "Ajio Big Bold Sale — 50–90% Off",
    description: "International & Indian brands. New styles added daily.",
    imageUrl:    "ShoeImg",
    badge:       "SALE",
    earnkaroLink: "https://ajiio.in/JwoWNsx",
    placement:   ["popup", "inline", "sidebar"],
  },
];

/**
 * Returns only the ads that (a) are tagged for the given placement
 * ("popup" | "inline" | "sidebar") and (b) have a real EarnKaro link
 * filled in — so an unfinished "PASTE_YOUR_..._LINK_HERE" entry never
 * gets shown to a visitor.
 */
export function getAdsForPlacement(placement) {
  return EARNKARO_ADS.filter(
    (ad) =>
      ad.placement.includes(placement) &&
      ad.earnkaroLink &&
      !ad.earnkaroLink.startsWith("PASTE_YOUR_")
  );
}

export default EARNKARO_ADS;