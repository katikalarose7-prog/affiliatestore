import { useState } from 'react'
import { ExternalLink, ShoppingBag, Star } from 'lucide-react'

// ── Store config ───────────────────────────────────────────────────
const STORE_META = {
  amazon:   { label: 'Amazon',   color: '#FF9900', bg: '#fff3e0', icon: '📦' },
  myntra:   { label: 'Myntra',   color: '#FF3F6C', bg: '#fce4ec', icon: '👗' },
  flipkart: { label: 'Flipkart', color: '#2874F0', bg: '#e8eaf6', icon: '🛒' },
  ajio:     { label: 'AJIO',     color: '#E84393', bg: '#fce4ec', icon: '✨' },
}

// FIX: No Amazon-style star rating widget, no "Prime" badge,
//      no copied Amazon review count, no Amazon logo.
//      We show our own neutral star display using stored rating field only.
function StarDisplay({ rating }) {
  if (!rating || rating === 0) return null
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div style={s.stars}>
      {Array(full).fill(0).map((_,i) => (
        <Star key={`f${i}`} size={11} fill="#f59e0b" color="#f59e0b" />
      ))}
      {half && (
        <div style={{ position:'relative', width:11, height:11, flexShrink:0 }}>
          <Star size={11} color="#e5e7eb" fill="#e5e7eb"/>
          <div style={{ position:'absolute', top:0, left:0, width:'50%', overflow:'hidden' }}>
            <Star size={11} fill="#f59e0b" color="#f59e0b"/>
          </div>
        </div>
      )}
      {Array(empty).fill(0).map((_,i) => (
        <Star key={`e${i}`} size={11} fill="#e5e7eb" color="#e5e7eb" />
      ))}
      <span style={s.ratingNum}>{rating.toFixed(1)}</span>
    </div>
  )
}

// FIX: Image renders from Cloudinary URL stored in product.image.
//      No Amazon image proxy, no scraped Amazon image URLs.
function ProductImage({ src, alt, store }) {
  const [err, setErr] = useState(false)
  const storeMeta     = STORE_META[store]

  if (!src || err) {
    return (
      <div style={s.imgFallback}>
        <span style={s.fallbackIcon}>
          {storeMeta ? storeMeta.icon : '🛍️'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={s.img}
      onError={() => setErr(true)}
    />
  )
}

export default function ProductCard({ product }) {
  const {
    name        = 'Unnamed Product',
    description = '',
    image       = '',
    category    = '',
    affiliateLink = '#',
    rating      = 0,
    featured    = false,
    store       = 'all',
    tags        = [],
  } = product

  const storeMeta = STORE_META[store]

  const handleClick = () => {
    if (affiliateLink && affiliateLink !== '#') {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <article style={s.card} className="product-card" onClick={handleClick}>

      {/* Image container */}
      <div style={s.imgWrap}>
        <ProductImage
          src={image}
          alt={`${name} — ${category}`}   /* FIX: descriptive alt, not "Amazon product" */
          store={store}
        />

        {/* Store badge — top-left */}
        {storeMeta && (
          <div style={{ ...s.storeBadge, background: storeMeta.bg, color: storeMeta.color }}>
            <span style={{ fontSize: 10 }}>{storeMeta.icon}</span>
            {storeMeta.label}
          </div>
        )}

        {/* Featured badge — top-right */}
        {/* FIX: No "Prime" badge. Generic "Featured" only. */}
        {featured && (
          <div style={s.featuredBadge}>⭐ Featured</div>
        )}

        {/* Quick-filter tag chips — bottom */}
        {tags.length > 0 && (
          <div style={s.tagRow}>
            {tags.slice(0, 2).map(tag => (
              <span key={tag} style={s.tagChip}>{TAG_LABEL[tag] || tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={s.body}>
        {category && <span style={s.cat}>{category}</span>}

        <h3 style={s.name} title={name}>{name}</h3>

        {description && (
          <p style={s.desc}>{description.slice(0, 90)}{description.length > 90 ? '…' : ''}</p>
        )}

        <StarDisplay rating={rating} />

        {/* CTA */}
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            ...s.cta,
            ...(storeMeta ? { background: storeMeta.color } : {}),
          }}
          onClick={e => e.stopPropagation()}
          aria-label={`View ${name} on ${storeMeta?.label || 'partner store'}`}
        >
          <ShoppingBag size={13} strokeWidth={2.5} />
          View Deal
          <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.8 }} />
        </a>

        {/* FTC / Amazon Associates required disclosure */}
        <p style={s.disclosure}>
          * Affiliate link — we may earn a commission
        </p>
      </div>
    </article>
  )
}

// Tag → human label map (mirrors PRIMARY_FILTERS in Navbar)
const TAG_LABEL = {
  bestseller:  '🔥 Best Seller',
  under199:    '💰 Under ₹199',
  under499:    '🏷️ Under ₹499',
  under999:    '🎯 Under ₹999',
  trending:    '📈 Trending',
  newarrival:  '🆕 New',
  toprated:    '⭐ Top Rated',
  editorspick: '✨ Editor\'s Pick',
}

// ── Styles ────────────────────────────────────────────────────────
const s = {
  card: {
    background:    'var(--card-bg, #fff)',
    border:        '1px solid var(--border, #e5e7eb)',
    borderRadius:  '14px',
    overflow:      'hidden',
    display:       'flex',
    flexDirection: 'column',
    cursor:        'pointer',
    transition:    'transform .2s, box-shadow .2s',
  },
  imgWrap: {
    position:   'relative',
    width:      '100%',
    paddingTop: '75%',
    background: 'var(--bg2, #f9fafb)',
    overflow:   'hidden',
  },
  img: {
    position:   'absolute',
    inset:      0,
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
  },
  imgFallback: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'var(--bg2, #f9fafb)',
  },
  fallbackIcon: { fontSize: 38, opacity: 0.4 },
  storeBadge: {
    position:    'absolute',
    top:         8,
    left:        8,
    display:     'flex',
    alignItems:  'center',
    gap:         4,
    padding:     '3px 8px',
    borderRadius: 20,
    fontSize:    10,
    fontWeight:  700,
    letterSpacing: '0.3px',
  },
  featuredBadge: {
    position:    'absolute',
    top:         8,
    right:       8,
    padding:     '3px 8px',
    borderRadius: 20,
    fontSize:    10,
    fontWeight:  700,
    background:  'rgba(0,0,0,0.7)',
    color:       '#fff',
    backdropFilter: 'blur(4px)',
  },
  tagRow: {
    position:    'absolute',
    bottom:      8,
    left:        8,
    display:     'flex',
    gap:         4,
    flexWrap:    'wrap',
  },
  tagChip: {
    padding:     '2px 7px',
    borderRadius: 20,
    fontSize:    9,
    fontWeight:  700,
    background:  'rgba(0,0,0,0.65)',
    color:       '#fff',
    backdropFilter: 'blur(4px)',
    letterSpacing: '0.2px',
  },
  body: {
    padding:       '12px',
    display:       'flex',
    flexDirection: 'column',
    gap:           6,
    flex:          1,
  },
  cat: {
    fontSize:    11,
    fontWeight:  600,
    color:       'var(--text3, #9ca3af)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  name: {
    fontSize:     13,
    fontWeight:   600,
    color:        'var(--text, #111)',
    lineHeight:   1.4,
    display:      '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow:     'hidden',
    margin:       0,
  },
  desc: {
    fontSize:   12,
    color:      'var(--text2, #6b7280)',
    lineHeight: 1.5,
    margin:     0,
    display:    '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow:   'hidden',
  },
  stars: {
    display:    'flex',
    alignItems: 'center',
    gap:        2,
    marginTop:  2,
  },
  ratingNum: {
    fontSize:   11,
    fontWeight: 600,
    color:      'var(--text2, #6b7280)',
    marginLeft: 3,
  },
  cta: {
    display:        'flex',
    alignItems:     'center',
    gap:            6,
    width:          '100%',
    padding:        '9px 12px',
    borderRadius:   9,
    border:         'none',
    background:     '#2563eb',
    color:          '#fff',
    fontSize:       13,
    fontWeight:     600,
    cursor:         'pointer',
    textDecoration: 'none',
    marginTop:      4,
  },
  disclosure: {
    fontSize:   10,
    color:      'var(--text3, #9ca3af)',
    margin:     '2px 0 0',
    lineHeight: 1.4,
  },
}
