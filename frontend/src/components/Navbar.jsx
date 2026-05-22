import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/Themecontext'
import { ShoppingBag, LayoutDashboard, LogOut, Search, Sun, Moon, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ onSearch, searchValue }) {
  const { isAdmin, logout } = useAuth()
  const { isDark, toggle }  = useTheme()
  const navigate = useNavigate()
  const [mobileSearch, setMobileSearch] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header style={s.header} className="sticky-top-pwa">
      <style>{`
        .nav-search-wrap:focus-within{border-color:var(--accent)!important;box-shadow:0 0 0 3px rgba(37,99,235,0.12)!important}.nav-search-input:focus{outline:none!important;box-shadow:none!important;border:none!important}
        .theme-btn:hover{background:var(--bg3)!important}
        .nav-icon-btn:hover{background:var(--bg3)!important;border-color:var(--border2)!important}
        @media(max-width:640px){
          .nav-desktop-search{display:none!important}
          .nav-mobile-toggle{display:flex!important}
          .nav-admin-label{display:none!important}
        }
        @media(min-width:641px){
          .nav-mobile-toggle{display:none!important}
          .nav-mobile-search{display:none!important}
        }
      `}</style>

      <div style={s.inner}>
        {/* Logo */}
        <Link to="/" style={s.logo}>
          <div style={s.logoIcon}>
            <ShoppingBag size={15} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={s.logoText}>Prime<span style={{color:'var(--accent)'}}>Offers</span></span>
        </Link>

        {/* Desktop search */}
        {onSearch && (
          <div className="nav-desktop-search nav-search-wrap" style={s.searchOuter}>
            <Search size={15} style={s.searchIcon}/>
            <input
              className="nav-search-input"
              style={s.searchInput}
              type="text"
              placeholder="Search products, brands, categories…"
              value={searchValue||''}
              onChange={e => onSearch(e.target.value)}
              autoComplete="off"
            />
            {searchValue && (
              <button style={s.clearX} onClick={() => onSearch('')} aria-label="Clear">
                <X size={13}/>
              </button>
            )}
            <button style={s.searchBtn} aria-label="Search">
              <Search size={14} color="#fff" strokeWidth={2.5}/>
            </button>
          </div>
        )}

        {/* Right actions */}
        <div style={s.actions}>
          {/* Mobile search toggle */}
          {onSearch && (
            <button className="nav-mobile-toggle" style={{...s.iconBtn, display:'none'}}
              onClick={() => setMobileSearch(v => !v)} aria-label="Search">
              {mobileSearch ? <X size={16}/> : <Search size={16}/>}
            </button>
          )}

          {/* Theme */}
          <button className="theme-btn" onClick={toggle} style={s.themeBtn}
            aria-label={isDark?'Light mode':'Dark mode'}>
            {isDark ? <Sun size={15} color="#f59e0b"/> : <Moon size={15} color="var(--accent)"/>}
          </button>

          {/* Admin */}
          {isAdmin && (
            <>
              <Link to="/admin" className="nav-icon-btn" style={s.iconBtn}>
                <LayoutDashboard size={14}/>
                <span className="nav-admin-label">Dashboard</span>
              </Link>
              <button className="nav-icon-btn" onClick={handleLogout}
                style={{...s.iconBtn, color:'var(--hot)'}}>
                <LogOut size={14}/>
                <span className="nav-admin-label">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearch && onSearch && (
        <div className="nav-mobile-search" style={s.mobileSearch}>
          <div className="nav-search-wrap" style={{...s.searchOuter, maxWidth:'100%'}}>
            <Search size={15} style={s.searchIcon}/>
            <input
              className="nav-search-input"
              style={{...s.searchInput, width:'100%'}}
              type="text"
              placeholder="Search products…"
              value={searchValue||''}
              onChange={e => onSearch(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            {searchValue && (
              <button style={s.clearX} onClick={() => onSearch('')}>
                <X size={13}/>
              </button>
            )}
            <button style={s.searchBtn}>
              <Search size={14} color="#fff" strokeWidth={2.5}/>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

const s = {
  header:{
    background:'var(--nav-bg)',
    backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    borderBottom:'1px solid var(--nav-bdr)',
    position:'sticky',top:0,zIndex:100,
    boxShadow:'0 1px 0 var(--border)',
    // Safe area handled via CSS class .sticky-top-pwa in index.css
  },
  inner:{
    maxWidth:'1300px',margin:'0 auto',
    padding:'0 clamp(14px,3vw,24px)',
    display:'flex',alignItems:'center',gap:'clamp(10px,2vw,16px)',
    height:'clamp(54px,7vw,64px)',
  },
  logo:{display:'flex',alignItems:'center',gap:'8px',flexShrink:0},
  logoIcon:{
    width:'clamp(28px,3.5vw,32px)',height:'clamp(28px,3.5vw,32px)',borderRadius:'9px',
    background:'linear-gradient(135deg,var(--accent),var(--indigo))',
    display:'flex',alignItems:'center',justifyContent:'center',
    boxShadow:'0 2px 8px rgba(37,99,235,0.32)',flexShrink:0,
  },
  logoText:{
    fontFamily:'var(--font-head)',fontWeight:700,
    fontSize:'clamp(16px,2.2vw,19px)',letterSpacing:'-0.3px',color:'var(--text)',
  },
  searchOuter:{
    flex:1,minWidth:0,maxWidth:'520px',
    position:'relative',display:'flex',alignItems:'center',
    background:'var(--bg2)',
    border:'1.5px solid var(--border)',
    borderRadius:'9px',overflow:'hidden',
    height:'clamp(36px,5vw,42px)',
    transition:'border-color .2s,box-shadow .2s',
  },
  searchInput:{
    flex:1,minWidth:0,
    background:'transparent',
    border:'none',outline:'none',
    padding:'0 8px 0 38px',
    color:'var(--text)',fontSize:'clamp(12px,1.3vw,14px)',
    height:'100%',width:'100%',
  },
  searchIcon:{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--text3)',pointerEvents:'none',zIndex:1},
  clearX:{
    position:'absolute',right:'46px',top:'50%',transform:'translateY(-50%)',
    background:'none',color:'var(--text3)',
    display:'flex',alignItems:'center',cursor:'pointer',
    border:'none',padding:'4px',zIndex:1,
  },
  searchBtn:{
    flexShrink:0,alignSelf:'stretch',
    background:'linear-gradient(135deg,var(--accent),var(--indigo))',
    padding:'0 clamp(12px,1.8vw,16px)',
    borderRadius:'0 9px 9px 0',
    display:'flex',alignItems:'center',justifyContent:'center',
    border:'none',cursor:'pointer',minWidth:'42px',
  },
  actions:{
    display:'flex',alignItems:'center',
    gap:'clamp(4px,1vw,8px)',flexShrink:0,marginLeft:'auto',
  },
  themeBtn:{
    width:'clamp(32px,4vw,36px)',height:'clamp(32px,4vw,36px)',borderRadius:'8px',
    background:'var(--bg2)',border:'1px solid var(--border)',
    display:'flex',alignItems:'center',justifyContent:'center',
    cursor:'pointer',flexShrink:0,transition:'background .2s',
  },
  iconBtn:{
    display:'flex',alignItems:'center',gap:'5px',
    padding:'7px clamp(8px,1.5vw,13px)',borderRadius:'8px',
    background:'var(--bg2)',border:'1px solid var(--border)',
    color:'var(--text2)',fontSize:'13px',fontWeight:500,
    cursor:'pointer',whiteSpace:'nowrap',
    transition:'background .2s,border-color .2s',
    textDecoration:'none',minHeight:'36px',
  },
  mobileSearch:{
    padding:'10px clamp(14px,3vw,24px)',
    borderTop:'1px solid var(--border)',
    background:'var(--nav-bg)',
    position:'relative',
  },
}