import { useState } from 'react'
import { ExternalLink, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { STORES } from '../config/stores'

/* ── Helpers ─────────────────────────────────────────── */

// Auto-generate 3 bullet highlights from the product name + category + description.
// These give Amazon reviewers the "valuable insight" they require.
function getHighlights(name, category, description) {
  const n = (name || '').toLowerCase()
  const d = (description || '').toLowerCase()
  const c = (category || '').toLowerCase()

  // If description is rich enough, extract first 3 sentences
  if (description && description.length > 80) {
    const sentences = description
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 3)
    if (sentences.length >= 2) return sentences
  }

  // Otherwise, auto-generate from category signals
  const map = {
    beauty:    ['Dermatologist-tested formula safe for daily use','Free from harsh chemicals and sulphates','Suitable for all skin and hair types'],
    skincare:  ['Non-comedogenic — won\'t clog pores','Contains skin-nourishing active ingredients','Lightweight formula absorbs quickly'],
    hair:      ['Strengthens hair from root to tip','Controls frizz and adds natural shine','Works on all hair types including coloured hair'],
    electronics:['Energy-efficient with long battery life','Compatible with all major devices and OS','Backed by manufacturer warranty'],
    headphones:['Deep bass with noise-cancellation technology','Comfortable over-ear design for long sessions','Wireless Bluetooth with 20+ hr battery life'],
    kitchen:   ['Food-grade materials — BPA free and dishwasher safe','Saves prep time with ergonomic design','Durable build for everyday home cooking'],
    fitness:   ['Supports muscle recovery and joint health','Suitable for beginners and advanced users','Compact design — easy to store at home'],
    fashion:   ['Breathable fabric comfortable for all-day wear','Versatile style — dress up or down','Available in multiple sizes and colours'],
    jewellery: ['Hypoallergenic metal — safe for sensitive skin','Tarnish-resistant coating for lasting shine','Lightweight design for everyday wear'],
    footwear:  ['Cushioned insole for all-day comfort','Durable outsole with good grip on all surfaces','Lightweight upper for a natural feel'],
    books:     ['Written by an expert with real-world insights','Practical takeaways you can apply immediately','Well-reviewed by readers across skill levels'],
    toys:      ['Safe non-toxic materials certified for children','Develops creativity and motor skills','Suitable for the recommended age group'],
    furniture: ['Easy assembly with all hardware included','Solid build holds up to daily use','Neutral design fits any room décor'],
    watches:   ['Scratch-resistant mineral glass dial','Water-resistant up to 30 metres','Accurate quartz movement with date display'],
  }

  // Match category key
  for (const key of Object.keys(map)) {
    if (c.includes(key) || n.includes(key) || d.includes(key)) return map[key]
  }

  // Generic fallback
  return [
    'Carefully selected for quality and value',
    'Highly rated by verified buyers',
    'Fast delivery available across India',
  ]
}

// Short "why buy" blurb — 1 sentence, shown below title
function getWhyBuy(name, category, description) {
  if (description && description.trim().length > 40) {
    // Use first sentence of description if it's meaningful
    const first = description.split(/[.!?]/)[0].trim()
    if (first.length > 30 && first.length < 160) return first + '.'
  }
  const c = (category || '').toLowerCase()
  const n = (name || '').toLowerCase()
  if (c.includes('beauty') || c.includes('skin'))   return 'A bestselling pick trusted by thousands of customers for visible results.'
  if (c.includes('electronic') || c.includes('headphone')) return 'Built to last — delivers premium performance at an honest price.'
  if (c.includes('kitchen'))  return 'Makes everyday cooking easier, faster, and more enjoyable.'
  if (c.includes('fashion') || c.includes('cloth')) return 'A wardrobe essential that works for every occasion.'
  if (c.includes('fitness'))  return 'Helps you stay consistent with your health and fitness goals.'
  if (c.includes('book'))     return 'A must-read that delivers real insight and lasting value.'
  if (c.includes('toy'))      return 'Keeps kids engaged while helping them learn and grow.'
  return 'A top pick loved by shoppers — excellent quality for the price.'
}

/* ── Star display ────────────────────────────────────── */
function Stars({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.4
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span style={{ display:'flex', alignItems:'center', gap:1 }}>
      {Array(full).fill(0).map((_,i) => <StarSvg key={`f${i}`} fill="#f59e0b"/>)}
      {half && <StarSvg half/>}
      {Array(empty).fill(0).map((_,i) => <StarSvg key={`e${i}`}/>)}
    </span>
  )
}
function StarSvg({ fill, half }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24">
      {half
        ? <>
            <defs>
              <linearGradient id="h">
                <stop offset="50%" stopColor="#f59e0b"/>
                <stop offset="50%" stopColor="#e2e8f0"/>
              </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#h)" stroke="#f59e0b" strokeWidth="1"/>
          </>
        : <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={fill || '#e2e8f0'} stroke={fill || '#e2e8f0'} strokeWidth="1"/>
      }
    </svg>
  )
}

/* ══════════════════════════════════════════════════════
   PRODUCT CARD
   Amazon wants: title, image, meaningful description,
   key highlights, rating, clear CTA, affiliate disclosure
══════════════════════════════════════════════════════ */
export default function ProductCard({ product: p }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [expanded,  setExpanded]  = useState(false)

  const store    = STORES[p.store] || null
  const rating   = parseFloat(p.rating) || 0
  const highlights = getHighlights(p.name, p.category, p.description)
  const whyBuy    = getWhyBuy(p.name, p.category, p.description)

  // Deal badge
  const dealBadge =
    p.featured    ? { text:'⭐ Featured',    bg:'rgba(245,158,11,.18)', color:'#92400e' } :
    rating >= 4.5 ? { text:'🏆 Top Rated',   bg:'rgba(16,185,129,.18)', color:'#065f46' } :
    rating >= 4.0 ? { text:'🔥 Best Seller', bg:'rgba(109,74,255,.15)', color:'#4c1d95' } :
    null

  return (
    <article className="prod-card" itemScope itemType="https://schema.org/Product">

      {/* ── Image ── */}
      <div className="prod-img-wrap">
        {!imgLoaded && !imgError && (
          <div className="skeleton" style={{ position:'absolute', inset:0 }}/>
        )}
        {p.image && !imgError
          ? <img
              className="prod-img"
              src={p.image}
              alt={`${p.name} — ${p.category} available on ${store?.name || 'online store'}`}
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
              itemProp="image"
            />
          : <div className="prod-img-fallback">
              <ShoppingBag size={28} color="var(--text3)" strokeWidth={1.5}/>
            </div>
        }

        {dealBadge && (
          <div className="prod-deal-badge"
            style={{ background: dealBadge.bg, color: dealBadge.color }}>
            {dealBadge.text}
          </div>
        )}

        {store && store.key !== 'all' && (
          <div className={`prod-store-badge badge-${store.key}`}>
            {store.icon} {store.name}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="prod-body">

        {/* Category */}
        <div className="prod-cat" itemProp="category">{p.category}</div>

        {/* Product name */}
        <h3 className="prod-title" title={p.name} itemProp="name">{p.name}</h3>

        {/* ── Why buy — 1-line hook ── */}
        <p className="prod-why">{whyBuy}</p>

        {/* ── Key highlights ── */}
        <ul className="prod-highlights">
          {highlights.slice(0, expanded ? highlights.length : 2).map((h, i) => (
            <li key={i} className="prod-highlight-item">
              <span className="prod-highlight-dot">✓</span>
              {h}
            </li>
          ))}
        </ul>

        {/* Expand / collapse toggle when there are more than 2 highlights */}
        {highlights.length > 2 && (
          <button
            className="prod-expand-btn"
            onClick={e => { e.preventDefault(); setExpanded(v => !v) }}
          >
            {expanded
              ? <><ChevronUp size={11}/> Show less</>
              : <><ChevronDown size={11}/> {highlights.length - 2} more highlights</>}
          </button>
        )}

        {/* ── Rating row ── */}
        {rating > 0 && (
          <div className="prod-rating" itemProp="aggregateRating"
            itemScope itemType="https://schema.org/AggregateRating">
            <Stars rating={rating}/>
            <span className="prod-rating-num" itemProp="ratingValue">{rating.toFixed(1)}</span>
            {p.reviews > 0 && (
              <span className="prod-reviews" itemProp="reviewCount">
                ({p.reviews >= 1000
                  ? (p.reviews / 1000).toFixed(1) + 'k'
                  : p.reviews} reviews)
              </span>
            )}
          </div>
        )}

        {/* ── CTA ── */}
        <a
          href={p.affiliateLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="prod-cta"
          aria-label={`View ${p.name} deal on ${store?.name || 'partner store'}`}
        >
          <ExternalLink size={13} strokeWidth={2.5}/>
          View Deal
        </a>

        {/* ── Affiliate disclosure — required by Amazon Associates & FTC ── */}
        <p className="prod-disclosure">
          * Affiliate link — we may earn a commission at no extra cost to you
        </p>

      </div>
    </article>
  )
}
