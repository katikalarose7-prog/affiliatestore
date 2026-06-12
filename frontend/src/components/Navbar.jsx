import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Sun, Moon, ShoppingBag, ChevronDown } from 'lucide-react'
import { API } from '../config'
import SearchDropdown from './SearchDropdown'

/* ── Store config ────────────────────────────────────── */
const STORES = {
  all:      { key:'all',      name:'All',      short:'All',      icon:'🏪' },
  amazon:   { key:'amazon',   name:'Amazon',   short:'Amazon',   icon:'📦' },
  myntra:   { key:'myntra',   name:'Myntra',   short:'Myntra',   icon:'👗' },
  flipkart: { key:'flipkart', name:'Flipkart', short:'Flipkart', icon:'🛒' },
  ajio:     { key:'ajio',     name:'AJIO',     short:'AJIO',     icon:'✨' },
}
const STORE_KEYS = ['all','amazon','myntra','flipkart','ajio']

/* ── Primary quick-filters (Row 2) ───────────────────── */
export const PRIMARY_FILTERS = [
  { label:'Best Sellers',   tag:'bestseller',  icon:'🔥' },
  { label:'Under ₹199',    tag:'under199',    icon:'💰' },
  { label:'Under ₹499',    tag:'under499',    icon:'🏷️' },
  { label:'Under ₹999',    tag:'under999',    icon:'🎯' },
  { label:'Trending Deals', tag:'trending',   icon:'📈' },
  { label:'New Arrivals',   tag:'newarrival', icon:'🆕' },
  { label:'Top Rated',      tag:'toprated',   icon:'⭐' },
  { label:"Editor's Picks", tag:'editorspick',icon:'✨' },
]

/* ── Audience tabs (Row 3) ───────────────────────────── */
const AUDIENCE_TABS = [
  { val:'all',   label:'All'   },
  { val:'women', label:'Women' },
  { val:'men',   label:'Men'   },
  { val:'kids',  label:'Kids'  },
]

const ACCENT = '#6d4aff'

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */
export default function Navbar({
  onSearch,
  searchValue,
  activeStore    = 'all',
  onStoreChange,
  activeFilter,
  onFilterChange,
  activeAudience = 'all',
  onAudienceChange,
  isDark,
  onThemeToggle,
}) {
  const [query,      setQuery]     = useState(searchValue || '')
  const [dropOpen,   setDropOpen]  = useState(false)
  const [moreOpen,   setMoreOpen]  = useState(false)
  const [hiddenTabs, setHiddenTabs]= useState([])
  const [ready,      setReady]     = useState(false)

  const searchRef = useRef()
  const tabsRef   = useRef()
  const moreRef   = useRef()

  /* Sync external searchValue */
  useEffect(() => { setQuery(searchValue || '') }, [searchValue])

  /* Open dropdown whenever there is a non-empty query */
  useEffect(() => { setDropOpen(query.trim().length > 0) }, [query])

  /* Overflow detection for store chips */
  const calcOverflow = useCallback(() => {
    const wrap = tabsRef.current
    if (!wrap) return
    const btns  = [...wrap.querySelectorAll('[data-tab]')]
    if (!btns.length) return
    const avail = wrap.offsetWidth + 500
    let used = 0; const hid = []
    btns.forEach((el, i) => {
      used += el.offsetWidth + 4
      if (used > avail) hid.push(STORE_KEYS[i])
    })
    setHiddenTabs(hid); setReady(true)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      calcOverflow()
      const ro = new ResizeObserver(calcOverflow)
      if (tabsRef.current) ro.observe(tabsRef.current)
      return () => ro.disconnect()
    }, 150)
    return () => clearTimeout(t)
  }, [calcOverflow])

  /* Close dropdowns on outside click / touch */
  useEffect(() => {
    const fn = e => {
      if (!searchRef.current?.contains(e.target)) {
        setDropOpen(false)
      }
      if (!moreRef.current?.contains(e.target)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', fn)
    document.addEventListener('touchstart', fn)
    return () => {
      document.removeEventListener('mousedown', fn)
      document.removeEventListener('touchstart', fn)
    }
  }, [])

  /* Handlers */
  const handleInput = val => {
    setQuery(val)
    if (!val.trim()) onSearch?.('')
  }

  const clearSearch = () => {
    setQuery(''); setDropOpen(false); onSearch?.('')
  }

  const submit = () => {
    if (query.trim()) { setDropOpen(false); onSearch?.(query) }
  }

  // Called from SearchDropdown when user clicks a product name
  const handlePick = name => {
    setQuery(name); setDropOpen(false); onSearch?.(name)
  }

  // Called from SearchDropdown "View all results" row
  const handleViewAll = q => {
    setQuery(q); setDropOpen(false); onSearch?.(q)
  }

  /* ─────────────────────────────────────────────────── */
  return (
    <nav className="navbar">

      {/* ── ROW 1: Logo | Store chips | Search | Moon ── */}
      <div className="navbar-row1">

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <ShoppingBag size={14} color="#fff" strokeWidth={2.5}/>
          </div>
          <span className="navbar-logo-text">
            BestDeal<span>Products</span>
          </span>
        </a>

        {/* Store chips — desktop only */}
        <div ref={tabsRef} className="navbar-store-chips" >
          {STORE_KEYS.map(k => {
            const st     = STORES[k]
            const active = activeStore === k
            const hidden = ready && hiddenTabs.includes(k)
            return (
              <button
                key={k}
                data-tab={k}
                className={`store-chip${active?' active':''}${hidden?' bdp-hidden':''}`}
                onClick={() => onStoreChange?.(k)}
              >
                <span style={{ fontSize:14 }}>{st.icon}</span>
                {st.name}
              </button>
            )
          })}

       
        </div>

        {/* Search bar */}
        <div ref={searchRef} className="navbar-search-wrap">
          <div className="search-box">
            <div className="search-icon-wrap">
              <Search size={15}/>
            </div>
            <input
              className="search-input"
              placeholder={
                activeStore === 'all'
                  ? 'Search across all stores…'
                  : `Search in ${STORES[activeStore]?.name}…`
              }
              value={query}
              onChange={e => handleInput(e.target.value)}
              onFocus={() => { if (query.trim()) setDropOpen(true) }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {query && (
              <button className="search-clear" onClick={clearSearch} aria-label="Clear search">
                <X size={13}/>
              </button>
            )}
            <button className="search-submit" onClick={submit}>
              <Search size={13}/>
              <span className="search-submit-label">Search</span>
            </button>
          </div>

          {/* ── Grouped search dropdown ── */}
          {dropOpen && (
            <SearchDropdown
              query={query}
              store={activeStore}
              onPick={handlePick}
              onViewAll={handleViewAll}
              onClose={() => setDropOpen(false)}
            />
          )}
        </div>

        {/* Theme toggle */}
        <button
          className="nav-icon-btn"
          onClick={onThemeToggle}
          title={isDark ? 'Light mode' : 'Dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} color="#f59e0b"/> : <Moon size={16}/>}
        </button>
      </div>

      {/* ── ROW 2: Primary quick-filters ── */}
      <div className="navbar-row2">
        <div className="filter-scroll">
          {PRIMARY_FILTERS.map(f => (
            <button
              key={f.tag}
              className={`primary-filter-pill${activeFilter===f.tag?' active':''}`}
              onClick={() => onFilterChange?.(activeFilter===f.tag ? null : f.tag)}
            >
              <span style={{ fontSize:13 }}>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

 

      {/* ── Mobile store bar ── */}
      <div className="mobile-store-bar">
        <div className="mobile-store-bar-inner">
          {STORE_KEYS.map(k => (
            <button
              key={k}
              className={`mobile-store-pill${activeStore===k?' active':''}`}
              onClick={() => onStoreChange?.(k)}
            >
              <span style={{ fontSize:14 }}>{STORES[k].icon}</span>
              {STORES[k].short}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .bdp-hidden { display: none !important; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </nav>
  )
}
