import { useState } from 'react'
import StarRating from './StarRating'
import { ExternalLink, ShoppingCart } from 'lucide-react'

const STATIC = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CAT_META = {
  Beauty:       { icon:'💄', color:'#e11d48', bg:'rgba(225,29,72,0.08)'   },
  Headphones:   { icon:'🎧', color:'#7c3aed', bg:'rgba(124,58,237,0.08)'  },
  Electronics:  { icon:'⚡', color:'#0284c7', bg:'rgba(2,132,199,0.08)'   },
  Fashion:      { icon:'👗', color:'#ea580c', bg:'rgba(234,88,12,0.08)'   },
  Kitchen:      { icon:'🍳', color:'#b45309', bg:'rgba(180,83,9,0.08)'    },
  Fitness:      { icon:'💪', color:'#059669', bg:'rgba(5,150,105,0.08)'   },
  Books:        { icon:'📚', color:'#6d28d9', bg:'rgba(109,40,217,0.08)'  },
  'Home Decor': { icon:'🏠', color:'#0f766e', bg:'rgba(15,118,110,0.08)'  },
}

// Deterministic label from product id
const DEAL_LABELS = [
  { text:'Best Seller',    icon:'🏆', color:'#b45309', bg:'rgba(245,158,11,0.1)',  bdr:'rgba(245,158,11,0.3)'  },
  { text:'Trending Deal',  icon:'📈', color:'#0284c7', bg:'rgba(2,132,199,0.1)',   bdr:'rgba(2,132,199,0.3)'  },
  { text:'Top Rated',      icon:'⭐', color:'#7c3aed', bg:'rgba(124,58,237,0.1)',  bdr:'rgba(124,58,237,0.3)'  },
  { text:'Hot Pick',       icon:'🔥', color:'#e11d48', bg:'rgba(225,29,72,0.1)',   bdr:'rgba(225,29,72,0.3)'  },
  { text:"Editor's Choice",icon:'✨', color:'#059669', bg:'rgba(5,150,105,0.1)',   bdr:'rgba(5,150,105,0.3)'  },
]
const getLabel = (id) => DEAL_LABELS[(id?.charCodeAt(id.length - 1) || 0) % DEAL_LABELS.length]

export default function ProductCard({ product, index = 0 }) {
  const [imgErr, setImgErr] = useState(false)
  const [hovered, setHovered] = useState(false)
  const meta  = CAT_META[product.category] || { icon:'🛍️', color:'var(--accent)', bg:'var(--accent-bg)' }
  const label = getLabel(product._id)

  return (
    <article
      className="product-card fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{...s.card, animationDelay:`${Math.min(index,8)*55}ms`}}
    >
      {/* Featured crown */}
      {product.featured && (
        <div style={s.featuredBadge}>★ Featured</div>
      )}

      {/* Deal label badge */}
      <div style={{...s.dealBadge, background:label.bg, color:label.color, borderColor:label.bdr}}>
        <span>{label.icon}</span> {label.text}
      </div>

      {/* Image area */}
      <div style={s.imgWrap}>
        <div style={{...s.imgInner, overflow:'hidden'}}>
          {product.image && !imgErr ? (
            <img
              src={`${STATIC}${product.image}`}
              alt={product.name}
              className="card-img"
              style={{...s.img, transform: hovered ? 'scale(1.07)' : 'scale(1)'}}
              onError={() => setImgErr(true)}
            />
          ) : (
            <div style={{...s.placeholder, background:meta.bg}}>
              <span style={{fontSize:'clamp(38px,6vw,54px)'}}>{meta.icon}</span>
            </div>
          )}
        </div>

        {/* Category chip */}
        <span style={{...s.catChip, color:meta.color, background:meta.bg}}>
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div style={s.body}>
        <h3 style={s.name}>{product.name}</h3>
        <p style={s.desc}>{product.description}</p>

        <div style={s.metaRow}>
          <StarRating rating={product.rating} size={13}/>
        </div>

        {/* Footer — no price */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...s.buyBtn,
            background: hovered
              ? 'linear-gradient(135deg, var(--accent-h), var(--indigo))'
              : 'linear-gradient(135deg, var(--accent), var(--indigo))',
            boxShadow: hovered
              ? '0 6px 24px rgba(37,99,235,0.45)'
              : '0 3px 12px rgba(37,99,235,0.28)',
          }}
        >
          <ShoppingCart size={14} strokeWidth={2.2}/>
          <span>View Product</span>
          <ExternalLink size={11} strokeWidth={2.5} style={{marginLeft:'2px'}}/>
        </a>
      </div>
    </article>
  )
}

const s = {
  card:{
    position:'relative',
    background:'var(--card-bg)',
    border:'1px solid var(--card-bdr)',
    borderRadius:'var(--radius-lg)',
    overflow:'hidden',
    display:'flex',flexDirection:'column',
    boxShadow:'var(--shadow-card)',
    opacity:0,
    cursor:'default',
  },
  featuredBadge:{
    position:'absolute',top:'10px',left:'10px',zIndex:4,
    background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
    color:'#78350f',fontSize:'10px',fontWeight:700,
    padding:'3px 10px',borderRadius:'20px',
    boxShadow:'0 2px 8px rgba(245,158,11,0.3)',
    letterSpacing:'0.3px',
  },
  dealBadge:{
    position:'absolute',top:'10px',right:'10px',zIndex:4,
    display:'flex',alignItems:'center',gap:'3px',
    padding:'3px 9px',borderRadius:'20px',
    fontSize:'10px',fontWeight:700,
    border:'1px solid',letterSpacing:'0.2px',
    backdropFilter:'blur(4px)',
  },
  imgWrap:{
    position:'relative',height:'clamp(160px,22vw,210px)',
    background:'var(--bg2)',flexShrink:0,
  },
  imgInner:{width:'100%',height:'100%'},
  img:{
    width:'100%',height:'100%',objectFit:'cover',
    transition:'transform 0.4s cubic-bezier(.22,1,.36,1)',
  },
  placeholder:{
    width:'100%',height:'100%',
    display:'flex',alignItems:'center',justifyContent:'center',
  },
  catChip:{
    position:'absolute',bottom:'10px',left:'10px',
    padding:'3px 9px',borderRadius:'20px',
    fontSize:'10px',fontWeight:600,
    backdropFilter:'blur(6px)',
    border:'1px solid rgba(255,255,255,0.15)',
  },
  body:{
    padding:'clamp(12px,2vw,16px)',
    display:'flex',flexDirection:'column',gap:'8px',flex:1,
  },
  name:{
    fontFamily:'var(--font-head)',fontWeight:600,
    fontSize:'clamp(13px,1.5vw,15px)',lineHeight:1.35,
    color:'var(--text)',
    display:'-webkit-box',WebkitLineClamp:2,
    WebkitBoxOrient:'vertical',overflow:'hidden',
  },
  desc:{
    color:'var(--text3)',fontSize:'clamp(11px,1.2vw,13px)',
    lineHeight:1.5,flex:1,
    display:'-webkit-box',WebkitLineClamp:2,
    WebkitBoxOrient:'vertical',overflow:'hidden',
  },
  metaRow:{display:'flex',alignItems:'center',marginTop:'2px'},
  buyBtn:{
    display:'flex',alignItems:'center',justifyContent:'center',
    gap:'6px',color:'#fff',
    padding:'clamp(9px,1.2vw,11px) 14px',
    borderRadius:'9px',fontSize:'clamp(12px,1.2vw,13px)',fontWeight:600,
    marginTop:'6px',width:'100%',
    transition:'background .25s ease, box-shadow .25s ease, transform .15s ease',
    textDecoration:'none',
  },
}