import { SlidersHorizontal, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const CATS = ['All','Beauty','Headphones','Electronics','Fashion','Kitchen','Fitness','Books','Home Decor']
const CAT_ICON  = {All:'🛍️',Beauty:'💄',Headphones:'🎧',Electronics:'⚡',Fashion:'👗',Kitchen:'🍳',Fitness:'💪',Books:'📚','Home Decor':'🏠'}
const CAT_COLOR = {All:'#2563eb',Beauty:'#e11d48',Headphones:'#7c3aed',Electronics:'#0284c7',Fashion:'#ea580c',Kitchen:'#b45309',Fitness:'#059669',Books:'#6d28d9','Home Decor':'#0f766e'}

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = e => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

export default function FilterSidebar({ filters, onChange, onClear, visible, onClose }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const mobile = useIsMobile()
  if (!visible) return null

  return (
    <>
      {mobile && <div style={s.overlay} onClick={onClose}/>}
      <aside style={s.sidebar}>
        <style>{`
          .cat-btn:hover{border-color:rgba(99,102,241,0.4)!important;background:var(--bg3)!important}
          .rating-btn:hover{background:var(--bg3)!important}
          @media(max-width:900px){
            aside.filter-sidebar{
              position:fixed!important;left:0!important;top:0!important;bottom:0!important;
              width:260px!important;border-radius:0 16px 16px 0!important;
              z-index:50!important;overflow-y:auto!important;
            }
          }
        `}</style>

        <div style={s.head}>
          <span style={s.headTitle}><SlidersHorizontal size={14} color="var(--accent)"/> Filters</span>
          <div style={{display:'flex',gap:'6px'}}>
            <button onClick={onClear} style={s.resetBtn}>Reset</button>
            <button onClick={onClose} style={s.closeBtn}><X size={13}/></button>
          </div>
        </div>

        {/* Category */}
        <div style={s.section}>
          <div style={s.secLabel}>Category</div>
          <div style={s.catGrid}>
            {CATS.map(cat => {
              const active = filters.category === cat
              const color  = CAT_COLOR[cat]
              return (
                <button key={cat} className="cat-btn" onClick={() => set('category', cat)}
                  style={{...s.catBtn,
                    ...(active ? {background:`${color}12`,border:`1.5px solid ${color}50`,color} : {}),
                  }}>
                  <span style={{fontSize:'16px',lineHeight:1}}>{CAT_ICON[cat]}</span>
                  <span style={{fontSize:'9.5px',lineHeight:1.3,textAlign:'center',fontWeight:active?600:400}}>
                    {cat}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Price */}
        <div style={s.section}>
          <div style={s.secLabel}>Price Range (₹)</div>
          <div style={s.priceRow}>
            <input type="number" style={s.priceInput} placeholder="Min"
              value={filters.minPrice} onChange={e => set('minPrice', e.target.value)}/>
            <span style={{color:'var(--text3)',fontSize:'12px',flexShrink:0}}>—</span>
            <input type="number" style={s.priceInput} placeholder="Max"
              value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)}/>
          </div>
        </div>

        {/* Rating */}
        <div style={s.section}>
          <div style={s.secLabel}>Minimum Rating</div>
          {[0,1,2,3,4].map(r => (
            <button key={r} className="rating-btn" onClick={() => set('minRating', r)}
              style={{...s.ratingBtn, ...(filters.minRating===r ? s.ratingBtnActive : {})}}>
              {r === 0 ? 'Any Rating'
                : <span>{'★'.repeat(r)}<span style={{color:'var(--text4)'}}>{'★'.repeat(5-r)}</span>{' & up'}</span>}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div>
          <div style={s.secLabel}>Show Only</div>
          <button onClick={() => set('featured', !filters.featured)}
            style={{...s.featToggle, ...(filters.featured ? s.featToggleOn : {})}}>
            <span>⭐ Featured Products</span>
            <div style={{...s.pill, ...(filters.featured ? s.pillOn : {})}}>
              <div style={{...s.pillDot, ...(filters.featured ? s.pillDotOn : {})}}/>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

const s = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.38)',zIndex:49,backdropFilter:'blur(2px)'},
  sidebar:{
    width:'240px',flexShrink:0,
    background:'var(--card-bg)',border:'1px solid var(--border)',
    borderRadius:'var(--radius-lg)',padding:'16px',
    height:'fit-content',position:'sticky',top:'130px',
    display:'flex',flexDirection:'column',gap:'16px',
    boxShadow:'var(--shadow)',
  },
  sidebarMobile:{
    position:'fixed',top:0,left:0,bottom:0,
    height:'100vh',borderRadius:'0 16px 16px 0',
    zIndex:50,overflowY:'auto',
    width:'260px',
  },
  head:{display:'flex',alignItems:'center',justifyContent:'space-between'},
  headTitle:{display:'flex',alignItems:'center',gap:'6px',fontFamily:'var(--font-head)',fontWeight:600,fontSize:'14px',color:'var(--text)'},
  resetBtn:{background:'none',color:'var(--accent)',fontSize:'11px',fontWeight:600,border:'1px solid var(--accent-bdr)',borderRadius:'6px',padding:'3px 8px',cursor:'pointer'},
  closeBtn:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'6px',padding:'5px',display:'flex',color:'var(--text2)',cursor:'pointer'},
  section:{paddingBottom:'14px',borderBottom:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:'8px'},
  secLabel:{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--text3)'},
  catGrid:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'5px'},
  catBtn:{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',padding:'8px 3px',borderRadius:'9px',background:'var(--bg2)',border:'1.5px solid var(--border)',color:'var(--text2)',cursor:'pointer',transition:'all .15s'},
  priceRow:{display:'flex',alignItems:'center',gap:'8px'},
  priceInput:{flex:1,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'7px',padding:'7px 9px',color:'var(--text)',fontSize:'13px',minWidth:0},
  ratingBtn:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'7px',padding:'7px 11px',color:'var(--text2)',textAlign:'left',fontSize:'12px',cursor:'pointer',transition:'background .15s',marginBottom:'3px'},
  ratingBtnActive:{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.38)',color:'#b45309',fontWeight:600},
  featToggle:{display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'9px',padding:'9px 12px',cursor:'pointer',color:'var(--text2)',fontSize:'12px',fontWeight:500,width:'100%',transition:'all .15s'},
  featToggleOn:{background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',color:'var(--accent)'},
  pill:{width:'34px',height:'19px',borderRadius:'10px',background:'var(--bg4)',border:'1px solid var(--border2)',position:'relative',flexShrink:0,transition:'all .2s'},
  pillOn:{background:'var(--accent)',borderColor:'var(--accent)'},
  pillDot:{position:'absolute',top:'2px',left:'2px',width:'13px',height:'13px',borderRadius:'50%',background:'var(--text3)',transition:'transform .2s'},
  pillDotOn:{background:'#fff',transform:'translateX(15px)'},
}