import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { LayoutGrid, List, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import BannerCarousel from '../components/BannerCarousel'
import Footer from '../components/Footer'
import { API } from '../config'
import { getCategoriesForStore } from '../config/stores'

/* ── Skeleton card ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skeleton skel-img"/>
      <div className="skel-body">
        <div className="skeleton skel-line" style={{width:'55%'}}/>
        <div className="skeleton skel-line" style={{width:'100%'}}/>
        <div className="skeleton skel-line" style={{width:'80%'}}/>
        <div className="skeleton skel-line" style={{width:'45%'}}/>
        <div className="skeleton skel-line" style={{height:'34px',borderRadius:'8px'}}/>
      </div>
    </div>
  )
}

/* ── Defaults ──────────────────────────────────────── */
const DEFAULT = {
  category: 'All', audience: 'all', region: 'all',
  minRating: 0, featured: false,
}

/* ── Home page ─────────────────────────────────────── */
export default function Home() {
  const [products,    setProducts]    = useState([])
  const [featured,    setFeatured]    = useState([])
  const [banners,     setBanners]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filters,     setFilters]     = useState(DEFAULT)
  const [search,      setSearch]      = useState('')
  const [debounced,   setDebounced]   = useState('')
  const [activeStore, setActiveStore] = useState(() => {
    try {
      const saved = localStorage.getItem('bdp_store')
      const valid = ['all','amazon','myntra','flipkart','ajio']
      return valid.includes(saved) ? saved : 'all'
    } catch { return 'all' }
  })
  // primary filter = tag string (e.g. 'bestseller', 'under499', etc.) or null
  const [activeFilter,   setActiveFilter]   = useState(null)
  // audience from row-3 tab (all / women / men / kids)
  const [activeAudience, setActiveAudience] = useState('all')
  const [sortBy,    setSortBy]    = useState('random')
  const [viewMode,  setViewMode]  = useState('grid')

 // const [showSidebar, setShowSidebar] = useState(
 //   () => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  //)

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 320)
    return () => clearTimeout(t)
  }, [search])

  /* Initial load */
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/banners`).catch(() => ({data:[]})),
      axios.get(`${API}/products?featured=true&limit=8`).catch(() => ({data:[]})),
    ]).then(([b, f]) => { setBanners(b.data); setFeatured(f.data) })
  }, [])

  /* Products — wires all three rows together */
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const p = { limit: 40, sort: sortBy }

      // Row 3 category sidebar filter
      if (filters.category !== 'All') p.category  = filters.category
      if (filters.region   !== 'all') p.region     = filters.region
      if (filters.minRating > 0)      p.minRating  = filters.minRating
      if (filters.featured)           p.featured   = true

      // Row 1: store tab
      if (activeStore !== 'all')      p.store      = activeStore

      // Row 3: audience tab (Women / Men / Kids)
      if (activeAudience !== 'all')   p.audience   = activeAudience

      // Row 2: primary quick-filter (tag-based)
      if (activeFilter)               p.tags       = activeFilter

      // Search
      if (debounced)                  p.search     = debounced

      const { data } = await axios.get(`${API}/products`, { params: p })
      setProducts(data)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [filters, debounced, activeStore, activeFilter, activeAudience, sortBy])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const clearFilters = () => {
    setFilters(DEFAULT)
    setSearch('')
    setActiveFilter(null)
    setActiveAudience('all')
  }

  const handleStoreChange = s => {
    setActiveStore(s)
    setFilters(DEFAULT)
    setSearch('')
    setActiveFilter(null)
    setActiveAudience('all')
    try { localStorage.setItem('bdp_store', s) } catch {}
  }

  const handleFilterChange = tag => {
    setActiveFilter(tag)
    // Clear conflicting sidebar filters when a quick-filter is chosen
    if (tag) setFilters(f => ({ ...f, featured: false }))
  }

  const handleAudienceChange = aud => {
    setActiveAudience(aud)
    setFilters(f => ({ ...f, audience: aud }))
  }

  const cats = getCategoriesForStore(activeStore)

  const isFiltered = filters.category !== 'All' ||
    filters.audience !== 'all' || filters.region !== 'all' ||
    filters.minRating > 0 || filters.featured || !!debounced ||
    !!activeFilter || activeAudience !== 'all'

  const filterCount = [
    filters.category !== 'All',
    filters.audience !== 'all',
    filters.region   !== 'all',
    filters.minRating > 0,
    filters.featured,
    !!activeFilter,
  ].filter(Boolean).length

  const showFeatured = featured.length > 0 && !debounced &&
    activeStore === 'all' && filters.category === 'All' &&
    activeAudience === 'all' && !activeFilter

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>

      {/* Navbar — all three rows wired */}
      <Navbar
        onSearch={setSearch}
        searchValue={search}
        activeStore={activeStore}
        onStoreChange={handleStoreChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeAudience={activeAudience}
        onAudienceChange={handleAudienceChange}
      />

      {/* Page content */}
      <div className="page-wrap">

        {/* Banner carousel */}
        {banners.length > 0 && !debounced && !activeFilter && (
          <div style={{paddingTop:'16px'}}>
            <div className="carousel-wrap">
              <BannerCarousel banners={banners}/>
            </div>
          </div>
        )}

        {/* Featured strip */}
        {showFeatured && (
          <div style={{paddingTop:'24px'}}>
            <div className="section-header">
              <h2 className="section-title">⭐ Featured Picks</h2>
            </div>
            <div className="featured-grid">
              {featured.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        )}

        {/* Active filter label */}
        {activeFilter && (
          <div style={{padding:'16px 0 4px', display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:'13px', fontWeight:600, color:'var(--text2)'}}>
              Showing: <strong style={{color:'var(--accent)'}}>{activeFilter}</strong>
            </span>
            <button onClick={() => setActiveFilter(null)}
              style={{background:'none',border:'none',cursor:'pointer',fontSize:'13px',color:'var(--text3)'}}>
              ×
            </button>
          </div>
        )}

        {/* Main layout */}
       <div className="main-layout">

  <div style={{ width: '100%' }}>

    {/* Toolbar */}
    <div className="toolbar">
      <div className="toolbar-left">
        {isFiltered && (
          <button className="clear-btn" onClick={clearFilters}>
            <RotateCcw size={11} /> Clear
          </button>
        )}
      </div>

      <div className="toolbar-right">
        <span className="item-count">
          {loading ? '…' : `${products.length} items`}
        </span>

        <select
          className="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="random">🔀 Shuffle</option>
          <option value="latest">🆕 Newest</option>
          <option value="rating">⭐ Top Rated</option>
        </select>

        <div className="view-toggle">
          <button
            className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={13} />
          </button>

          <button
            className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={13} />
          </button>
        </div>
      </div>
    </div>

    {/* Products */}
    {loading ? (
      <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
        {Array(8).fill(0).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : products.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No products found</h3>
        <p className="empty-sub">
          {debounced
            ? `No results for "${debounced}"`
            : 'Try adjusting your search'}
        </p>
      </div>
    ) : (
      <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    )}
  </div>

</div>
      </div>

      <Footer/>
    </div>
  )
}
