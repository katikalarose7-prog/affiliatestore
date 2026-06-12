import { useState, useEffect } from 'react'
import { X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { getCategoriesForStore } from '../config/stores'

function useIsMobile(bp = 1024) {
  const [v, setV] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < bp : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp-1}px)`)
    const fn  = e => setV(e.matches)
    mq.addEventListener('change', fn); setV(mq.matches)
    return () => mq.removeEventListener('change', fn)
  }, [bp])
  return v
}

function Section({ title, children, open: defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="filter-section">
      <button className="filter-sec-btn" onClick={() => setOpen(v => !v)}>
        <span className="filter-sec-label">{title}</span>
        <ChevronDown size={13} color="var(--text3)"
          style={{transform:open?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0}}/>
      </button>
      {open && <div className="filter-sec-body">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  filters, onChange, onClear, visible, onClose, activeStore
}) {
  const mobile = useIsMobile()
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const cats = getCategoriesForStore(activeStore)

  const count = [
    filters.category && filters.category !== 'All',
    filters.minRating > 0,
    filters.featured,
    filters.audience && filters.audience !== 'all',
    filters.region   && filters.region   !== 'all',
  ].filter(Boolean).length

  if (!visible) return null

  return (
    <>
      {mobile && <div className="sidebar-overlay" onClick={onClose}/>}

      <aside className="filter-sidebar">

        {/* Header */}
        <div className="filter-head">
          <div className="filter-title">
            <SlidersHorizontal size={14} color="var(--accent)"/>
            Filters
            {count > 0 && <span className="filter-badge">{count}</span>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            {count > 0 && (
              <button className="filter-reset" onClick={onClear}>
                <RotateCcw size={11}/> Reset
              </button>
            )}
            <button className="filter-close" onClick={onClose}>
              <X size={14}/>
            </button>
          </div>
        </div>

        {/* Category */}
        <Section title="Category">
          <div className="filter-cat-list">
            {cats.map(cat => {
              const active = (filters.category || 'All') === cat
              return (
                <button key={cat}
                  className={`filter-cat-item${active ? ' active' : ''}`}
                  onClick={() => set('category', cat)}>
                  {cat}
                  {active && <span className="filter-check">✓</span>}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Audience */}
        <Section title="For">
          <div className="filter-pills">
            {[
              {v:'all',   l:'Everyone',i:'👥'},
              {v:'women', l:'Women',   i:'👩'},
              {v:'men',   l:'Men',     i:'👨'},
              {v:'kids',  l:'Kids',    i:'👦'},
              {v:'unisex',l:'Unisex',  i:'🤝'},
            ].map(({v,l,i}) => (
              <button key={v}
                className={`filter-pill${(filters.audience||'all')===v?' active':''}`}
                onClick={() => set('audience', v)}>
                {i} {l}
              </button>
            ))}
          </div>
        </Section>

        {/* Region */}
        <Section title="Region">
          <div className="filter-pills">
            {[
              {v:'all',   l:'All Regions',i:'🌍'},
              {v:'india', l:'India',      i:'🇮🇳'},
              {v:'global',l:'Global',     i:'🌐'},
            ].map(({v,l,i}) => (
              <button key={v}
                className={`filter-pill${(filters.region||'all')===v?' active':''}`}
                onClick={() => set('region', v)}>
                {i} {l}
              </button>
            ))}
          </div>
        </Section>

        {/* Rating */}
        <Section title="Minimum Rating">
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button key={r}
              className={`filter-rating-btn${filters.minRating===r?' active':''}`}
              onClick={() => set('minRating', r)}>
              {r === 0 ? 'Any Rating' : (
                <>
                  <span style={{color:'#f59e0b'}}>
                    {'★'.repeat(Math.floor(r))}
                  </span>
                  {r%1!==0 && <span style={{color:'#fcd34d'}}>½</span>}
                  <span style={{color:'var(--text3)'}}>
                    {'★'.repeat(5-Math.ceil(r))}
                  </span>
                  {' & up'}
                </>
              )}
            </button>
          ))}
        </Section>

        {/* Featured */}
        <Section title="Show Only" open={false}>
          <button
            className={`filter-toggle${filters.featured?' on':''}`}
            onClick={() => set('featured', !filters.featured)}>
            <span>⭐ Featured Products</span>
            <div className={`toggle-track${filters.featured?' on':''}`}>
              <div className={`toggle-thumb${filters.featured?' on':''}`}/>
            </div>
          </button>
        </Section>

      </aside>
    </>
  )
}