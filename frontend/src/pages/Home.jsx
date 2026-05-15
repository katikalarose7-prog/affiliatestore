import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import BannerCarousel from '../components/BannerCarousel'
import { SlidersHorizontal, Star, TrendingUp, Zap, ChevronDown, Shield, X } from 'lucide-react'
import { API } from '../config'

const DEFAULT = { category:'All', minPrice:'', maxPrice:'', minRating:0, featured:false }

const CATS = ['All','Beauty','Headphones','Electronics','Fashion','Kitchen','Fitness','Books','Home Decor']
const CAT_META = {
  All:{'icon':'🛍️','color':'#2563eb'}, Beauty:{'icon':'💄','color':'#e11d48'},
  Headphones:{'icon':'🎧','color':'#7c3aed'}, Electronics:{'icon':'⚡','color':'#0284c7'},
  Fashion:{'icon':'👗','color':'#ea580c'}, Kitchen:{'icon':'🍳','color':'#b45309'},
  Fitness:{'icon':'💪','color':'#059669'}, Books:{'icon':'📚','color':'#6d28d9'},
  'Home Decor':{'icon':'🏠','color':'#0f766e'},
}

function PrivacyModal({ onClose }) {
  const sections = [
    ['1. Who We Are','PrimeOffers is an affiliate product discovery platform. We curate products from Amazon and other retailers and earn a small commission on purchases at no extra cost to you.'],
    ['2. Affiliate Disclosure','This website participates in the Amazon Associates Program. We earn a small commission when you click a link and make a purchase. This does not affect the price you pay.'],
    ['3. Information We Collect','We do not collect personal information from visitors. No registration is required to browse or purchase products. We do not store payment details.'],
    ['4. Cookies & Analytics','We may use anonymous analytics tools to understand traffic. These may place cookies in your browser. You can disable cookies via browser settings at any time.'],
    ['5. Third-Party Links','Our site links to Amazon and other third-party sites. Once you leave, their own privacy policies apply.'],
    ['6. Security','Since we collect no personal data, there is minimal data risk. Our admin panel uses JWT authentication with token expiry.'],
    ['7. Changes','This policy may be updated. Changes are reflected on this page with a new "Last updated" date.'],
    ['8. Contact','Questions? Email us at privacy@dealnest.in'],
  ]
  return (
    <div style={ps.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={ps.box}>
        <div style={ps.head}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Shield size={16} color="var(--accent)"/>
            <h2 style={{fontFamily:'var(--font-head)',fontSize:'17px',fontWeight:700,color:'var(--text)'}}>Privacy Policy</h2>
          </div>
          <button onClick={onClose} style={ps.close}><X size={16}/></button>
        </div>
        <div style={ps.body}>
          <p style={{color:'var(--text3)',fontSize:'12px',marginBottom:'16px'}}>Last updated: June 2025</p>
          {sections.map(([h,t]) => (
            <div key={h} style={{marginBottom:'16px'}}>
              <div style={{fontFamily:'var(--font-head)',fontWeight:600,fontSize:'14px',color:'var(--text)',marginBottom:'5px'}}>{h}</div>
              <p style={{color:'var(--text2)',fontSize:'13px',lineHeight:1.65}}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts]       = useState([])
  const [featured, setFeatured]       = useState([])
  const [banners, setBanners]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filters, setFilters]         = useState(DEFAULT)
  const [showSidebar, setShowSidebar] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 900 : true)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [debounced, setDebounced]     = useState('')

  useEffect(() => { const t = setTimeout(() => setDebounced(search), 350); return () => clearTimeout(t) }, [search])

  const fetchFeatured = async () => {
    try { const {data} = await axios.get(`${API}/products?featured=true`); setFeatured(data) } catch {}
  }
  const fetchBanners = async () => {
    try { const {data} = await axios.get(`${API}/banners`); setBanners(data) } catch {}
  }
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const p = {}
      if (filters.category !== 'All') p.category  = filters.category
      if (filters.minPrice)           p.minPrice   = filters.minPrice
      if (filters.maxPrice)           p.maxPrice   = filters.maxPrice
      if (filters.minRating > 0)      p.minRating  = filters.minRating
      if (filters.featured)           p.featured   = true
      if (debounced)                  p.search     = debounced
      const {data} = await axios.get(`${API}/products`, { params:p })
      setProducts(data)
    } catch {}
    finally { setLoading(false) }
  }, [filters, debounced])

  useEffect(() => { fetchFeatured(); fetchBanners() }, [])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  const clearAll = () => { setFilters(DEFAULT); setSearch('') }

  const isSearching = debounced.trim().length > 0
  const isFiltered  = filters.category !== 'All' || filters.minPrice || filters.maxPrice || filters.minRating > 0 || filters.featured
  const showHero    = !isSearching && !isFiltered
  const activeCount = [filters.category!=='All',filters.minPrice,filters.maxPrice,filters.minRating>0,filters.featured].filter(Boolean).length

  return (
    <div style={s.page}>
      <style>{`
        .cat-pill:hover{opacity:0.85}
        .filter-toggle:hover{background:var(--bg3)!important}
        .buy-now-link:hover{opacity:0.88;transform:translateY(-1px)}
        @media(max-width:900px){
          .layout-row{flex-direction:column!important}
          .filter-sidebar-wrap{display:none}
          .filter-sidebar-wrap.open{display:block!important}
          .product-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))!important}
          .featured-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))!important}
          .hero-title{font-size:clamp(28px,7vw,52px)!important}
          .stats-row{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:480px){
          .product-grid{grid-template-columns:repeat(2,1fr)!important}
          .featured-grid{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      {/* ── Sticky top ── */}
      <div style={s.stickyTop}>
        <Navbar onSearch={setSearch} searchValue={search}/>

        {/* Category bar */}
        <div style={s.catBar}>
          <div style={s.catScroll}>
            {CATS.map(cat => {
              const m = CAT_META[cat]
              const active = filters.category === cat
              return (
                <button key={cat} className="cat-pill"
                  onClick={() => setFilters(f => ({...f, category:cat}))}
                  style={{...s.catPill,
                    ...(active ? {background:`${m.color}14`,border:`1.5px solid ${m.color}50`,color:m.color,fontWeight:600} : {}),
                  }}>
                  <span style={{fontSize:'14px'}}>{m.icon}</span>
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Context bar (search/filter active) */}
        {(isSearching || isFiltered) && (
          <div style={s.ctxBar}>
            <div className="container" style={s.ctxInner}>
              <div style={s.ctxLeft}>
                <span style={{color:'var(--text2)',fontSize:'13px'}}>
                  {isSearching
                    ? <>Results for <strong style={{color:'var(--text)'}}>&ldquo;{debounced}&rdquo;</strong></>
                    : <>Category: <strong style={{color:'var(--accent)'}}>{filters.category}</strong></>
                  }
                </span>
                <span style={s.countPill}>
                  {loading ? '…' : `${products.length} item${products.length!==1?'s':''}`}
                </span>
              </div>
              <button onClick={clearAll} style={s.clearBtn}>Clear ×</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Hero ── */}
      {showHero && (
        <section style={s.hero}>
          <div style={s.heroGlow}/>
          <div style={s.heroGlow2}/>
          <div className="container" style={s.heroContent}>
            <div style={s.heroBadge}><Zap size={11}/> Best Amazon Affiliate Deals</div>
            <h1 className="hero-title" style={s.heroTitle}>
              Discover Products<br/>
              <span style={s.heroSpan}>You'll Actually Love</span>
            </h1>
            <p style={s.heroSub}>
              Handpicked deals on Beauty, Electronics, Fashion &amp; more.
              Browse by category or search above.
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'5px',color:'var(--text4)',fontSize:'12px',marginTop:'4px'}}>
              <ChevronDown size={12} style={{opacity:0.5}}/>
              <span>Scroll to explore {products.length}+ curated products</span>
            </div>
          </div>
        </section>
      )}

      {/* ── Banners ── */}
      {showHero && banners.length > 0 && (
        <div style={s.bannerWrap}>
          <div className="container">
            <BannerCarousel banners={banners}/>
          </div>
        </div>
      )}

      {/* ── Featured ── */}
      {showHero && featured.length > 0 && (
        <section style={s.featuredSection}>
          <div className="container">
            <div style={s.secHead}>
              <div>
                <div style={s.secBadge}><Star size={10} strokeWidth={2.5}/> Featured</div>
                <h2 style={s.secTitle}>Top Picks Right Now</h2>
              </div>
              <TrendingUp size={16} color="var(--accent)"/>
            </div>
            <div className="featured-grid" style={s.featGrid}>
              {featured.slice(0,4).map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── All products ── */}
      <div className="container" style={s.main}>
        <div style={s.gridHead}>
          <div>
            <h2 style={s.gridTitle}>
              {isSearching ? 'Search Results' : isFiltered ? filters.category : 'All Products'}
            </h2>
            {!loading && <p style={{color:'var(--text3)',fontSize:'12px',marginTop:'2px'}}>{products.length} items</p>}
          </div>
          <button className="filter-toggle"
            onClick={() => setShowSidebar(v => !v)}
            style={{...s.filterBtn, ...(activeCount>0 ? s.filterBtnActive : {})}}>
            <SlidersHorizontal size={13}/>
            Filters
            {activeCount>0 && <span style={s.badge}>{activeCount}</span>}
          </button>
        </div>

        <div className="layout-row" style={s.layout}>
          {/* Sidebar */}
          <div className={`filter-sidebar-wrap${showSidebar?' open':''}`}
            style={{flexShrink:0}}>
            <FilterSidebar
              filters={filters} onChange={setFilters}
              onClear={clearAll}
              visible={showSidebar}
              onClose={() => setShowSidebar(false)}
            />
          </div>

          {/* Grid */}
          <div style={{flex:1,minWidth:0}}>
            {loading ? (
              <div className="product-grid" style={s.grid}>
                {[...Array(8)].map((_,i) => (
                  <div key={i} style={{background:'var(--card-bg)',borderRadius:'var(--radius-lg)',overflow:'hidden',border:'1px solid var(--border)'}}>
                    <div className="skeleton" style={{height:'clamp(140px,20vw,200px)'}}/>
                    <div style={{padding:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                      <div className="skeleton" style={{height:'13px',width:'72%',borderRadius:'4px'}}/>
                      <div className="skeleton" style={{height:'11px',width:'50%',borderRadius:'4px'}}/>
                      <div className="skeleton" style={{height:'34px',borderRadius:'8px',marginTop:'6px'}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={s.empty}>
                <div style={{fontSize:'48px'}}>🔍</div>
                <h3 style={{fontFamily:'var(--font-head)',fontSize:'18px',fontWeight:600,color:'var(--text)'}}>
                  {isSearching ? `No results for "${debounced}"` : 'No products found'}
                </h3>
                <p style={{color:'var(--text2)',fontSize:'13px'}}>Try different keywords or clear filters</p>
                <button onClick={clearAll} style={s.emptyCta}>Clear Everything</button>
              </div>
            ) : (
              <div className="product-grid" style={s.grid}>
                {products.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div className="container">
          <div style={s.footerTop}>
            <div>
              <div style={s.footerLogo}>Deal<span style={{color:'var(--accent)'}}>Nest</span></div>
              <p style={{color:'var(--text3)',fontSize:'12px',marginTop:'4px'}}>Handpicked affiliate deals you can trust.</p>
            </div>
            <div style={s.footerLinks}>
              <button onClick={() => setShowPrivacy(true)} style={s.footerLink}>
                <Shield size={12}/> Privacy Policy
              </button>
              <span style={{color:'var(--text4)'}}>·</span>
              <a href="/admin/login" style={s.footerLink}>Admin</a>
            </div>
          </div>
          <div style={s.footerBottom}>
            <p style={{color:'var(--text3)',fontSize:'11px'}}>© {new Date().getFullYear()} DealNest. All rights reserved.</p>
            <p style={{color:'var(--text3)',fontSize:'11px',maxWidth:'380px',textAlign:'right',lineHeight:1.5}}>
              Contains affiliate links. We may earn a commission on purchases.
            </p>
          </div>
        </div>
      </footer>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)}/>}
    </div>
  )
}

const s = {
  page:{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'},
  stickyTop:{position:'sticky',top:0,zIndex:100},
  catBar:{background:'var(--cat-bg)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--cat-bdr)',overflowX:'auto',scrollbarWidth:'none'},
  catScroll:{display:'flex',alignItems:'center',gap:'5px',padding:'8px clamp(14px,3vw,28px)',width:'max-content',minWidth:'100%'},
  catPill:{display:'flex',alignItems:'center',gap:'5px',padding:'5px 13px',borderRadius:'20px',background:'var(--bg2)',border:'1.5px solid var(--border)',color:'var(--text2)',fontSize:'12px',fontWeight:500,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all .15s',minHeight:'32px'},
  ctxBar:{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'8px 0'},
  ctxInner:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'},
  ctxLeft:{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'},
  countPill:{background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',color:'var(--accent)',padding:'2px 9px',borderRadius:'20px',fontSize:'11px',fontWeight:600},
  clearBtn:{background:'none',color:'var(--hot)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:'7px',padding:'4px 11px',fontSize:'11px',fontWeight:600,cursor:'pointer'},
  hero:{position:'relative',overflow:'hidden',padding:'clamp(25px,8vw,40px) 0 clamp(36px,6vw,18px)',borderBottom:'1px solid var(--border)',background:'linear-gradient(180deg,var(--accent-bg) 0%,var(--bg) 100%)'},
  heroGlow:{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'600px',height:'280px',background:'radial-gradient(ellipse,rgba(37,99,235,0.12) 0%,transparent 70%)',pointerEvents:'none'},
  heroGlow2:{position:'absolute',top:'20%',right:'-5%',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)',pointerEvents:'none'},
  heroContent:{position:'relative',zIndex:1,textAlign:'center',maxWidth:'640px',margin:'0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:'clamp(12px,2vw,18px)'},
  heroBadge:{display:'inline-flex',alignItems:'center',gap:'5px',background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',color:'var(--accent)',padding:'4px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:600,letterSpacing:'0.3px'},
  heroTitle:{fontFamily:'var(--font-head)',fontSize:'clamp(32px,5.5vw,64px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-1.5px',color:'var(--text)'},
  heroSpan:{color:'var(--accent)'},
  heroSub:{color:'var(--text2)',fontSize:'clamp(13px,1.5vw,16px)',lineHeight:1.65,maxWidth:'480px'},
  bannerWrap:{padding:'clamp(20px,4vw,36px) 0 0',background:'var(--bg)'},
  featuredSection:{padding:'clamp(28px,5vw,48px) 0',background:'var(--bg2)',borderBottom:'1px solid var(--border)'},
  secHead:{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'clamp(16px,2.5vw,24px)'},
  secBadge:{display:'inline-flex',alignItems:'center',gap:'4px',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.28)',color:'#b45309',padding:'3px 11px',borderRadius:'20px',fontSize:'10px',fontWeight:600,marginBottom:'7px',width:'fit-content'},
  secTitle:{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'clamp(18px,3vw,26px)',color:'var(--text)',letterSpacing:'-0.3px'},
  featGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'clamp(12px,2vw,18px)'},
  main:{padding:'clamp(20px,4vw,32px) clamp(14px,3vw,28px) clamp(40px,6vw,64px)',flex:1},
  gridHead:{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'clamp(14px,2vw,20px)',paddingBottom:'14px',borderBottom:'1px solid var(--border)'},
  gridTitle:{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'clamp(16px,2.5vw,20px)',color:'var(--text)',letterSpacing:'-0.2px'},
  filterBtn:{display:'flex',alignItems:'center',gap:'6px',padding:'7px 15px',borderRadius:'8px',background:'var(--bg2)',border:'1px solid var(--border)',color:'var(--text2)',fontSize:'12px',fontWeight:500,cursor:'pointer',transition:'all .15s',minHeight:'36px'},
  filterBtnActive:{background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',color:'var(--accent)'},
  badge:{background:'var(--accent)',color:'#fff',width:'17px',height:'17px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700},
  layout:{display:'flex',gap:'clamp(14px,2.5vw,22px)',alignItems:'flex-start'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'clamp(12px,2vw,18px)'},
  empty:{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',padding:'clamp(48px,8vw,80px) 16px',textAlign:'center'},
  emptyCta:{marginTop:'6px',padding:'9px 22px',borderRadius:'9px',background:'var(--accent)',color:'#fff',fontSize:'13px',fontWeight:600,boxShadow:'0 3px 12px rgba(37,99,235,0.28)',border:'none',cursor:'pointer'},
  footer:{background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'clamp(22px,4vw,36px) 0 clamp(16px,3vw,26px)',marginTop:'auto'},
  footerTop:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'clamp(14px,2vw,20px)',paddingBottom:'clamp(14px,2vw,20px)',borderBottom:'1px solid var(--border)'},
  footerLogo:{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'clamp(16px,2.5vw,20px)',color:'var(--text)'},
  footerLinks:{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'},
  footerLink:{display:'flex',alignItems:'center',gap:'4px',background:'none',color:'var(--text2)',fontSize:'12px',fontWeight:500,cursor:'pointer',border:'none',padding:0,transition:'color .15s'},
  footerBottom:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'},
}

const ps = {
  overlay:{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.52)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'},
  box:{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',width:'100%',maxWidth:'580px',maxHeight:'85vh',display:'flex',flexDirection:'column',boxShadow:'var(--shadow-lg)',animation:'fadeUp .3s cubic-bezier(.22,1,.36,1)'},
  head:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px',borderBottom:'1px solid var(--border)',flexShrink:0},
  close:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'7px',padding:'5px',display:'flex',color:'var(--text2)',cursor:'pointer'},
  body:{overflowY:'auto',padding:'20px 22px'},
}