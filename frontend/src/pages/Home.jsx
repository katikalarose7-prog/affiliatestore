import { useState, useEffect, useCallback, Fragment } from 'react'
import axios from 'axios'
import { SlidersHorizontal, LayoutGrid, List, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import BannerCarousel from '../components/BannerCarousel'
import Footer from '../components/Footer'
import { API } from '../config'
import { useTheme } from '../context/Themecontext'
import { getCategoriesForStore } from '../config/stores'
import EarnKaroInlineAd from '../components/ads/EarnKaroInlineAd'
import EarnKaroSidebar from '../components/ads/EarnKaroSidebar'
import { useParams, useNavigate } from 'react-router-dom'

/* ── Skeleton card ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skeleton skel-img"/>
      <div className="skel-body">
        <div className="skeleton skel-line" style={{width:'40%',height:10}}/>
        <div className="skeleton skel-line" style={{width:'90%',height:14}}/>
        <div className="skeleton skel-line" style={{width:'75%',height:14}}/>
        <div className="skeleton skel-line" style={{width:'100%',height:11}}/>
        <div className="skeleton skel-line" style={{width:'100%',height:11}}/>
        <div className="skeleton skel-line" style={{width:'60%',height:11}}/>
        <div className="skeleton skel-line" style={{width:'45%',height:10}}/>
        <div className="skeleton skel-line" style={{height:'38px',borderRadius:'9px',marginTop:4}}/>
      </div>
    </div>
  )
}

/* ── Section header ────────────────────────────────── */
function SectionHeader({ icon, title, subtitle, count }) {
  return (
    <div className="home-section-header">
      <div className="home-section-left">
        <span className="home-section-icon">{icon}</span>
        <div>
          <h2 className="home-section-title">{title}</h2>
          {subtitle && <p className="home-section-sub">{subtitle}</p>}
        </div>
      </div>
      {count > 0 && (
        <span className="home-section-count">{count} products</span>
      )}
    </div>
  )
}

/* ── Stats bar ─────────────────────────────────────── */
function StatsBar() {
  return (
    <div className="home-stats-bar">
      {[
        { icon:'🛍️', label:'Curated Products', value:'500+' },
        { icon:'🏪', label:'Trusted Stores',   value:'6'    },
        { icon:'⭐', label:'Top Rated Picks',  value:'100+' },
        { icon:'🔄', label:'Updated',          value:'Daily'},
      ].map(s => (
        <div key={s.label} className="home-stat-item">
          <span className="home-stat-icon">{s.icon}</span>
          <span className="home-stat-value">{s.value}</span>
          <span className="home-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Defaults ──────────────────────────────────────── */
const DEFAULT = {
  category:'All', audience:'all', region:'all', minRating:0, featured:false,
}

/* ── Valid store slugs (must match STORE_KEYS in Navbar.jsx
   and the `store` enum in the backend Product model) ───── */
const VALID_STORES = ['all','amazon','myntra','flipkart','ajio','meesho','firstcry']

/* ══════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════ */
export default function Home() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { store: storeParam } = useParams()
  const navigate = useNavigate()

  const [products,      setProducts]      = useState([])
  const [featured,      setFeatured]      = useState([])
  const [banners,       setBanners]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filters,       setFilters]       = useState(DEFAULT)
  const [search,        setSearch]        = useState('')
  const [debounced,     setDebounced]     = useState('')

  // Store is derived from the URL (/amazon, /meesho, etc.) rather than
  // local component state, so /amazon works on direct load/refresh/share.
  const activeStore = VALID_STORES.includes(storeParam) ? storeParam : 'all'

  const [activeFilter,   setActiveFilter]   = useState(null)
  const [activeAudience, setActiveAudience] = useState('all')
  const [sortBy,         setSortBy]         = useState('random')
  const [viewMode,       setViewMode]       = useState('grid')
  const [showSidebar,    setShowSidebar]    = useState(
    () => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  )

  /* Unknown store slug in the URL → bounce back to "/" */
  useEffect(() => {
    if (storeParam && !VALID_STORES.includes(storeParam)) {
      navigate('/', { replace: true })
    }
  }, [storeParam, navigate])

  /* Keep localStorage in sync as a "last visited store" hint only —
     the URL is the source of truth for activeStore. */
  useEffect(() => {
    try { localStorage.setItem('bdp_store', activeStore) } catch {}
  }, [activeStore])

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 320)
    return () => clearTimeout(t)
  }, [search])

  /* Initial load — banners + featured */
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/banners`).catch(() => ({ data:[] })),
      axios.get(`${API}/products?featured=true&limit=8&sort=rating`).catch(() => ({ data:[] })),
    ]).then(([b, f]) => { setBanners(b.data); setFeatured(f.data) })
  }, [])

  /* Fetch products */
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const p = { limit:40, sort:sortBy }
      if (filters.category !== 'All') p.category  = filters.category
      if (filters.region   !== 'all') p.region    = filters.region
      if (filters.minRating > 0)      p.minRating = filters.minRating
      if (filters.featured)           p.featured  = true
      if (activeStore !== 'all')      p.store     = activeStore
      if (activeAudience !== 'all')   p.audience  = activeAudience
      if (activeFilter)               p.tags      = activeFilter
      if (debounced)                  p.search    = debounced
      const { data } = await axios.get(`${API}/products`, { params:p })
      setProducts(data)
    } catch { setProducts([]) }
    finally   { setLoading(false) }
  }, [filters, debounced, activeStore, activeFilter, activeAudience, sortBy])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  /* Handlers */
  const clearFilters = () => {
    setFilters(DEFAULT); setSearch(''); setActiveFilter(null); setActiveAudience('all')
  }
  const handleStoreChange = s => {
    setFilters(DEFAULT); setSearch('')
    setActiveFilter(null); setActiveAudience('all')
    navigate(s === 'all' ? '/' : `/${s}`)
  }
  const handleFilterChange   = tag => setActiveFilter(tag === activeFilter ? null : tag)
  const handleAudienceChange = aud => { setActiveAudience(aud); setFilters(f => ({...f, audience:aud})) }

  const isFiltered = filters.category !== 'All' || filters.audience !== 'all' ||
    filters.region !== 'all' || filters.minRating > 0 || filters.featured ||
    !!debounced || !!activeFilter || activeAudience !== 'all'

  const filterCount = [
    filters.category !== 'All', filters.audience !== 'all',
    filters.region !== 'all', filters.minRating > 0,
    filters.featured, !!activeFilter,
  ].filter(Boolean).length

  const isDefaultView = !isFiltered
  const showFeatured  = featured.length > 0 && isDefaultView

  const FILTER_LABELS = {
    bestseller:'🔥 Best Sellers', under199:'💰 Under ₹199',
    under499:'🏷️ Under ₹499',   under999:'🎯 Under ₹999',
    trending:'📈 Trending Deals', newarrival:'🆕 New Arrivals',
    toprated:'⭐ Top Rated',      editorspick:"✨ Editor's Picks",
  }

  return (
    <div className="home-root">

      {/* Navbar */}
      <Navbar
        onSearch={setSearch}
        searchValue={search}
        activeStore={activeStore}
        onStoreChange={handleStoreChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeAudience={activeAudience}
        onAudienceChange={handleAudienceChange}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      {/* ── Hero / Banner section ── */}
      {banners.length > 0 && isDefaultView && (
        <div className="home-hero">
          <div className="home-hero-inner">
            <BannerCarousel banners={banners}/>
          </div>
        </div>
      )}

      {/* ── Stats bar ── */}
      {isDefaultView && <StatsBar/>}

      {/* ── Page body ── */}
      <div className="home-body">

        {/* ── Featured picks ── */}
        {showFeatured && (
          <section className="home-section">
            <SectionHeader
              icon="⭐"
              title="Featured Picks"
              subtitle="Handpicked by our editors — the best of the best"
              count={featured.length}
            />
            <div className="home-featured-grid">
              {featured.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </section>
        )}

        {/* ── Main products section ── */}
        <section className="home-section">

          {isFiltered ? (
            <SectionHeader
              icon={activeFilter ? FILTER_LABELS[activeFilter]?.split(' ')[0] : '🔍'}
              title={
                debounced              ? `Results for "${debounced}"` :
                activeFilter           ? FILTER_LABELS[activeFilter] :
                filters.category !== 'All' ? filters.category :
                activeAudience !== 'all'   ? `${activeAudience.charAt(0).toUpperCase() + activeAudience.slice(1)}'s Products` :
                'Filtered Products'
              }
              subtitle={loading ? 'Loading…' : `${products.length} products found`}
            />
          ) : (
            <SectionHeader
              icon="🛍️"
              title="All Deals"
              subtitle="Curated affiliate products updated daily"
              count={products.length}
            />
          )}

          {/* Toolbar */}
          <div className="home-toolbar">
            <div className="home-toolbar-left">
              <button
                className={`home-filter-btn${showSidebar ? ' active' : ''}`}
                onClick={() => setShowSidebar(v => !v)}
              >
                <SlidersHorizontal size={14}/>
                Filters
                {filterCount > 0 && (
                  <span className="home-filter-badge">{filterCount}</span>
                )}
              </button>

              {isFiltered && (
                <button className="home-clear-btn" onClick={clearFilters}>
                  <RotateCcw size={12}/> Clear all
                </button>
              )}

              {[
                filters.category !== 'All'  && { label: filters.category,  key:'category', clear:()=>setFilters(f=>({...f,category:'All'}))  },
                activeAudience   !== 'all'  && { label: activeAudience,     key:'audience', clear:()=>setActiveAudience('all')                 },
                filters.region   !== 'all'  && { label: filters.region,     key:'region',   clear:()=>setFilters(f=>({...f,region:'all'}))    },
                activeFilter                && { label: FILTER_LABELS[activeFilter], key:'filter', clear:()=>setActiveFilter(null)             },
              ].filter(Boolean).map(chip => (
                <span key={chip.key} className="home-chip">
                  {chip.label}
                  <button className="home-chip-x" onClick={chip.clear}>×</button>
                </span>
              ))}
            </div>

            <div className="home-toolbar-right">
              <span className="home-item-count">
                {loading ? '…' : `${products.length} items`}
              </span>
              <div className="home-sort-wrap">
                <select className="home-sort-select"
                  value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="random">🔀 Shuffle</option>
                  <option value="latest">🆕 Newest</option>
                  <option value="rating">⭐ Top Rated</option>
                </select>
              </div>
              <div className="home-view-toggle">
                <button
                  className={`home-view-btn${viewMode==='grid'?' active':''}`}
                  onClick={() => setViewMode('grid')} title="Grid view">
                  <LayoutGrid size={14}/>
                </button>
                <button
                  className={`home-view-btn${viewMode==='list'?' active':''}`}
                  onClick={() => setViewMode('list')} title="List view">
                  <List size={14}/>
                </button>
              </div>
            </div>
          </div>

          {/* Main layout: filter sidebar + grid + ad sidebar */}
          <div className="home-main-layout">

            {/* Filter sidebar */}
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
              visible={showSidebar}
              onClose={() => setShowSidebar(false)}
              activeStore={activeStore}
            />
            {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}/>}

            {/* Product grid */}
            <div className="home-grid-col">
              {loading ? (
                <div className={viewMode==='grid' ? 'home-products-grid' : 'home-products-list'}>
                  {Array(8).fill(0).map((_,i) => <SkeletonCard key={i}/>)}
                </div>
              ) : products.length === 0 ? (
                <div className="home-empty">
                  <div className="home-empty-icon">🔍</div>
                  <h3 className="home-empty-title">No products found</h3>
                  <p className="home-empty-sub">
                    {debounced
                      ? `No results for "${debounced}". Try a different keyword.`
                      : 'Try removing some filters to see more products.'}
                  </p>
                  <button className="home-empty-btn" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className={viewMode==='grid' ? 'home-products-grid' : 'home-products-list'}>
                  {products.map((p, index) => (
                    <Fragment key={p._id}>
                      <ProductCard product={p} />
                      {(index + 1) % 4 === 0 && viewMode === 'grid' && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <EarnKaroInlineAd index={Math.floor(index / 4)} />
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* EarnKaro ad sidebar */}
            <EarnKaroSidebar />

          </div>
        </section>

        {/* ── Trust section ── */}
        {isDefaultView && !loading && (
          <section className="home-trust-section">
            <div className="home-trust-grid">
              {[
                { icon:'🔍', title:'Carefully Curated',     body:'Every product is handpicked by our team for quality, value, and genuine buyer satisfaction.' },
                { icon:'💰', title:'Honest Affiliate Links', body:'We earn a small commission when you buy — at zero extra cost to you. This keeps the site free.' },
                { icon:'⭐', title:'Real Ratings Only',      body:'Ratings shown are based on verified buyer reviews — never inflated or fabricated.' },
                { icon:'🔄', title:'Updated Daily',          body:'Our product list refreshes every day so you always see current deals and new arrivals.' },
              ].map(item => (
                <div key={item.title} className="home-trust-card">
                  <span className="home-trust-icon">{item.icon}</span>
                  <h3 className="home-trust-title">{item.title}</h3>
                  <p  className="home-trust-body">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      <Footer/>
    </div>
  )
}