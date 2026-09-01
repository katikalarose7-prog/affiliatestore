/**
 * SearchDropdown.jsx
 * 
 * Standalone grouped-search dropdown component.
 * Used inside Navbar. Shows results split by category,
 * up to 4 products per category, max 6 categories.
 *
 * Props:
 *   query       string   — current search text
 *   store       string   — active store filter
 *   onPick      fn(name) — called when user taps a product
 *   onViewAll   fn(q)    — called when "View all results" is tapped
 *   onClose     fn()     — called when dropdown should close
 */

import { useEffect, useRef, useState } from 'react'
import { Search, Star, ExternalLink, ChevronRight } from 'lucide-react'
import { API } from '../config'

const STORE_COLORS = {
  amazon:   { bg:'#fff7ed', color:'#c2410c', icon:'📦' },
  myntra:   { bg:'#fff1f2', color:'#be123c', icon:'👗' },
  flipkart: { bg:'#eff6ff', color:'#1d4ed8', icon:'🛒' },
  ajio:     { bg:'#faf5ff', color:'#7e22ce', icon:'✨' },
  meesho:   { bg:'#fdf2f8', color:'#be185d', icon:'🛍️' },
  firstcry: { bg:'#eefaf3', color:'#0f766e', icon:'🧸' },
  all:      { bg:'#f0ebff', color:'#6d4aff', icon:'🛍️' },
}

function StoreBadge({ store }) {
  if (!store || store === 'all') return null
  const s = STORE_COLORS[store] || STORE_COLORS.all
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '1px 5px',
      borderRadius: 999, background: s.bg, color: s.color,
      letterSpacing: '0.2px', whiteSpace: 'nowrap',
    }}>
      {s.icon} {store.charAt(0).toUpperCase() + store.slice(1)}
    </span>
  )
}

function StarRow({ rating }) {
  if (!rating || rating === 0) return null
  return (
    <span style={{ display:'flex', alignItems:'center', gap:2 }}>
      <Star size={9} fill="#f59e0b" color="#f59e0b"/>
      <span style={{ fontSize:10, color:'var(--text2)', fontWeight:600 }}>{rating.toFixed(1)}</span>
    </span>
  )
}

export default function SearchDropdown({ query, store, onPick, onViewAll, onClose }) {
  const [groups,    setGroups]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setGroups([]); setTotal(0); return
    }
    clearTimeout(timerRef.current)
    setLoading(true); setError(null)

    timerRef.current = setTimeout(async () => {
      try {
        const storeParam = store && store !== 'all' ? `&store=${store}` : ''
        const res  = await fetch(`${API.replace('/api','')}/api/search?q=${encodeURIComponent(query.trim())}${storeParam}`)
        const data = await res.json()
        setGroups(data.groups || [])
        setTotal(data.total  || 0)
      } catch {
        setError('Search failed. Please try again.')
        setGroups([])
      } finally {
        setLoading(false)
      }
    }, 260)

    return () => clearTimeout(timerRef.current)
  }, [query, store])

  // Nothing to show
  if (!query || query.trim().length < 1) return null

  return (
    <div style={s.wrap} role="listbox" aria-label="Search results">

      {/* ── Loading ── */}
      {loading && (
        <div style={s.loadingRow}>
          <span style={s.spinner}/>
          <span style={{ fontSize:13, color:'var(--text3)' }}>Searching…</span>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={s.emptyRow}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <span style={{ fontSize:13, color:'var(--text3)' }}>{error}</span>
        </div>
      )}

      {/* ── No results ── */}
      {!loading && !error && groups.length === 0 && (
        <div style={s.emptyRow}>
          <span style={{ fontSize:22 }}>🔍</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>No results for "{query}"</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>Try a different keyword</div>
          </div>
        </div>
      )}

      {/* ── Grouped results ── */}
      {!loading && groups.length > 0 && groups.map((group, gi) => (
        <div key={group.category}>

          {/* Category header */}
          <div style={s.catHeader}>
            <span style={s.catLabel}>{group.category}</span>
            <span style={s.catCount}>{group.count} found</span>
          </div>

          {/* Products in this category */}
          {group.products.map((p, pi) => (
            <div
              key={p._id || pi}
              style={s.item}
              onMouseDown={e => { e.preventDefault(); onPick(p.name) }}
              onTouchEnd={e => { e.preventDefault(); onPick(p.name) }}
              role="option"
              tabIndex={-1}
            >
              {/* Thumbnail */}
              <div style={s.thumb}>
                {p.image
                  ? <img src={p.image} alt="" style={s.thumbImg} loading="lazy"/>
                  : <span style={{ fontSize:20 }}>{STORE_COLORS[p.store]?.icon || '🛍️'}</span>}
              </div>

              {/* Text */}
              <div style={s.itemText}>
                <div style={s.itemName}>{p.name}</div>
                <div style={s.itemMeta}>
                  <StoreBadge store={p.store}/>
                  <StarRow rating={p.rating}/>
                </div>
              </div>

              {/* Quick-go arrow */}
              <a
                href={p.affiliateLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                style={s.quickGo}
                onMouseDown={e => e.stopPropagation()}
                title="Open deal"
                aria-label={`Open ${p.name}`}
              >
                <ExternalLink size={12}/>
              </a>
            </div>
          ))}

          {/* Divider between categories (not after last) */}
          {gi < groups.length - 1 && <div style={s.divider}/>}
        </div>
      ))}

      {/* ── View all results footer ── */}
      {!loading && total > 0 && (
        <div
          style={s.viewAll}
          onMouseDown={e => { e.preventDefault(); onViewAll?.(query) }}
          onTouchEnd={e => { e.preventDefault(); onViewAll?.(query) }}
          role="button"
          tabIndex={-1}
        >
          <Search size={13} style={{ color:'var(--accent)', flexShrink:0 }}/>
          <span style={s.viewAllText}>
            View all <strong>{total}</strong> results for "<em>{query}</em>"
          </span>
          <ChevronRight size={14} style={{ color:'var(--text3)', marginLeft:'auto' }}/>
        </div>
      )}

      <style>{`
        @keyframes bdp-spin { to { transform: rotate(360deg); } }
        [role="option"]:hover, [role="option"]:focus { background: var(--bg2, #f9fafb) !important; }
        [role="button"]:hover { background: var(--accent-bg, #f0ebff) !important; }
      `}</style>
    </div>
  )
}

/* ── Styles ──────────────────────────────────────────── */
const s = {
  wrap: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0, right: 0,
    background: 'var(--card, #fff)',
    border: '1px solid var(--border, #e2e8f0)',
    borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
    zIndex: 300,
    overflow: 'hidden',
    /* max height + scroll so it never goes off screen */
    maxHeight: 'min(72vh, 540px)',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    WebkitOverflowScrolling: 'touch',
    animation: 'fadeUp .18s cubic-bezier(.22,1,.36,1)',
  },

  loadingRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px',
  },
  spinner: {
    display: 'inline-block',
    width: 15, height: 15,
    border: '2px solid var(--border, #e2e8f0)',
    borderTopColor: 'var(--accent, #6d4aff)',
    borderRadius: '50%',
    animation: 'bdp-spin .6s linear infinite',
    flexShrink: 0,
  },

  emptyRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 16px',
  },

  // Category header row
  catHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px 6px',
    background: 'var(--bg2, #f5f7ff)',
    borderBottom: '1px solid var(--border, #e2e8f0)',
    position: 'sticky', top: 0, zIndex: 1,
  },
  catLabel: {
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.6px', color: 'var(--text2, #4a5568)',
  },
  catCount: {
    fontSize: 10, color: 'var(--text3, #94a3b8)',
    background: 'var(--bg3, #e4eaf6)',
    padding: '1px 7px', borderRadius: 999,
  },

  // Product row
  item: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 16px',
    cursor: 'pointer',
    transition: 'background .1s',
    /* min touch target height */
    minHeight: 52,
  },
  thumb: {
    width: 44, height: 44,
    borderRadius: 8,
    background: 'var(--bg2, #f5f7ff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0,
  },
  thumbImg: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  itemText: {
    flex: 1, minWidth: 0,
  },
  itemName: {
    fontSize: 13, fontWeight: 500,
    color: 'var(--text, #0f172a)',
    overflow: 'hidden', textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  },
  itemMeta: {
    display: 'flex', alignItems: 'center', gap: 6, marginTop: 3,
  },
  quickGo: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 7,
    border: '1px solid var(--border, #e2e8f0)',
    background: 'transparent', flexShrink: 0,
    color: 'var(--text3, #94a3b8)',
    transition: 'all .15s',
    textDecoration: 'none',
  },

  divider: {
    height: 1,
    background: 'var(--border, #e2e8f0)',
    margin: '0 16px',
  },

  // View all footer
  viewAll: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 16px',
    borderTop: '1px solid var(--border, #e2e8f0)',
    cursor: 'pointer',
    transition: 'background .1s',
    minHeight: 44,
    background: 'var(--bg2, #f5f7ff)',
  },
  viewAllText: {
    fontSize: 13, color: 'var(--text2, #4a5568)',
  },
}
