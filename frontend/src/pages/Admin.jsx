import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import {
  Plus, Pencil, Trash2, X, Search, Package,
  BarChart3, LogOut, Star, Upload, Camera, Home,
  AlertCircle, CheckCircle, RefreshCw, ChevronLeft
} from 'lucide-react'
import { API, SITE_NAME } from '../config'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getCategoriesForStore } from '../config/stores'

const STORES    = ['all','amazon','myntra','flipkart','ajio']
const AUDIENCES = ['all','men','women','kids','unisex']
const REGIONS   = ['all','india','global']

const TAG_OPTIONS = [
  { value:'bestseller',  label:'🔥 Best Seller'  },
  { value:'under199',    label:'💰 Under ₹199'   },
  { value:'under499',    label:'🏷️ Under ₹499'  },
  { value:'under999',    label:'🎯 Under ₹999'   },
  { value:'trending',    label:'📈 Trending'      },
  { value:'newarrival',  label:'🆕 New Arrival'  },
  { value:'toprated',    label:'⭐ Top Rated'     },
  { value:'editorspick', label:"✨ Editor's Pick" },
]

const EMPTY_FORM = {
  name:'', description:'', category:'', affiliateLink:'',
  rating:'', featured:false, audience:'all', region:'all', store:'all', tags:[],
  _imagePreview:'',
}

/* ── Toast ──────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  if (!msg) return null
  return (
    <div className="admin-toast">
      {type==='error'
        ? <AlertCircle size={16} color="#ef4444"/>
        : <CheckCircle size={16} color="#10b981"/>}
      <span style={{fontSize:13,color:type==='error'?'#991b1b':'#065f46',flex:1}}>{msg}</span>
      <button onClick={onClose}
        style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center',minWidth:28,minHeight:28,justifyContent:'center'}}>
        <X size={14}/>
      </button>
    </div>
  )
}

/* ── Confirm modal ──────────────────────────────────── */
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="admin-drawer-overlay" onClick={onCancel}>
      <div style={{
        position:'fixed',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
        background:'var(--card)',border:'1px solid var(--border)',
        borderRadius:16,padding:28,maxWidth:340,width:'90vw',
        boxShadow:'0 20px 60px rgba(0,0,0,.3)',zIndex:1002,
        animation:'popIn .25s cubic-bezier(.22,1,.36,1)',
      }} onClick={e=>e.stopPropagation()}>
        <h3 style={{margin:'0 0 10px',fontSize:16,fontWeight:700,color:'var(--text)'}}>Confirm Delete</h3>
        <p style={{margin:'0 0 20px',fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{msg}</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onCancel}
            style={{padding:'10px 16px',borderRadius:10,border:'1px solid var(--border)',background:'transparent',cursor:'pointer',fontSize:14,color:'var(--text)',fontFamily:'inherit',minHeight:44}}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{padding:'10px 16px',borderRadius:10,border:'none',background:'#ef4444',color:'#fff',cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:'inherit',minHeight:44}}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Product Drawer — side on desktop, bottom sheet on mobile ── */
function ProductDrawer({ editId, initialForm, onClose, onSaved, token }) {
  const [form,         setForm]         = useState(initialForm)
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(initialForm._imagePreview || '')
  const [saving,       setSaving]       = useState(false)
  const galleryRef = useRef()
  const cameraRef  = useRef()
  const cats = getCategoriesForStore(form.store)
  const authHeader = { Authorization:`Bearer ${token}` }

  const toggleTag = tag => setForm(f => ({
    ...f, tags: f.tags.includes(tag) ? f.tags.filter(t=>t!==tag) : [...f.tags, tag]
  }))

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5*1024*1024) { alert('Image must be under 5 MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!form.name?.trim())         { alert('Product name is required');   return }
    if (!form.category)             { alert('Category is required');       return }
    if (!form.affiliateLink?.trim()){ alert('Affiliate link is required'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => {
        if (k==='tags')            fd.append('tags', v.join(','))
        else if (k!=='_imagePreview') fd.append(k, v)
      })
      if (imageFile) fd.append('image', imageFile)
      const headers = { ...authHeader, 'Content-Type':'multipart/form-data' }
      if (editId) await axios.put(`${API}/products/${editId}`, fd, { headers })
      else        await axios.post(`${API}/products`, fd, { headers })
      onSaved(editId ? 'Product updated ✓' : 'Product added ✓')
    } catch(e) {
      alert(e.response?.data?.message || 'Failed to save. Please try again.')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="admin-drawer-overlay" onClick={onClose}/>
      <div className="admin-drawer">
        {/* Drag handle — only visible on mobile bottom sheet */}
        <div className="admin-drawer-handle"/>

        <div className="admin-drawer-header">
          <button className="admin-drawer-close" onClick={onClose} aria-label="Close">
            <ChevronLeft size={20}/>
          </button>
          <h2 className="admin-drawer-title">{editId ? 'Edit Product' : 'Add Product'}</h2>
          <div style={{width:40}}/>
        </div>

        <div className="admin-drawer-body">

          {/* ── Store ── */}
          <label className="form-label">Store</label>
          <select className="form-input form-select" value={form.store}
            onChange={e=>setForm(f=>({...f, store:e.target.value, category:''}))}>
            {STORES.map(s=>(
              <option key={s} value={s}>
                {s==='all' ? 'All Stores' : s.charAt(0).toUpperCase()+s.slice(1)}
              </option>
            ))}
          </select>

          {/* ── Name ── */}
          <label className="form-label">Product Name *</label>
          <input className="form-input"
            placeholder="Enter product name"
            autoCapitalize="words"
            value={form.name}
            onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>

          {/* ── Description ── */}
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea"
            placeholder="Brief product description"
            value={form.description}
            onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>

          {/* ── Category ── */}
          <label className="form-label">Category *</label>
          <select className="form-input form-select" value={form.category}
            onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            <option value="">Select a category</option>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>

          {/* ── Affiliate link ── */}
          <label className="form-label">Affiliate Link *</label>
          <input className="form-input"
            placeholder="https://amzn.to/..."
            inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={form.affiliateLink}
            onChange={e=>setForm(f=>({...f,affiliateLink:e.target.value}))}/>

          {/* ── Audience + Region ── */}
          <div className="form-row">
            <div>
              <label className="form-label">Audience</label>
              <select className="form-input form-select" value={form.audience}
                onChange={e=>setForm(f=>({...f,audience:e.target.value}))}>
                {AUDIENCES.map(a=>(
                  <option key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Region</label>
              <select className="form-input form-select" value={form.region}
                onChange={e=>setForm(f=>({...f,region:e.target.value}))}>
                {REGIONS.map(r=>(
                  <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Rating + Featured ── */}
          <div className="form-row">
            <div>
              <label className="form-label">Rating (0–5)</label>
              <input className="form-input"
                type="number" min="0" max="5" step="0.1"
                inputMode="decimal" placeholder="4.2"
                value={form.rating}
                onChange={e=>setForm(f=>({...f,rating:e.target.value}))}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:2}}>
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',userSelect:'none',minHeight:44,paddingTop:16}}>
                <input type="checkbox"
                  checked={form.featured}
                  onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}
                  style={{width:20,height:20,accentColor:'var(--accent)',cursor:'pointer',flexShrink:0}}/>
                <span style={{fontSize:14,color:'var(--text)',fontWeight:500}}>Featured</span>
              </label>
            </div>
          </div>

          {/* ── Quick-filter tags ── */}
          <label className="form-label">Quick-Filter Tags</label>
          <p style={{fontSize:11,color:'var(--text3)',margin:'2px 0 8px',lineHeight:1.5}}>
            Tags control which Homepage filter row the product appears under.
          </p>
          <div className="tag-grid">
            {TAG_OPTIONS.map(t=>(
              <button key={t.value} type="button"
                className={`tag-option${form.tags.includes(t.value)?' active':''}`}
                onClick={()=>toggleTag(t.value)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Image upload ── */}
          <label className="form-label">Product Image</label>
          <p style={{fontSize:11,color:'var(--text3)',margin:'2px 0 8px',lineHeight:1.5}}>
            Image is uploaded to Cloudinary automatically.
          </p>
          {imagePreview ? (
            <div className="upload-preview">
              <img src={imagePreview} alt="preview" style={{width:100,height:100,objectFit:'cover',borderRadius:8,display:'block'}}/>
              <button className="upload-preview-remove"
                onClick={()=>{setImageFile(null);setImagePreview('')}}
                aria-label="Remove image">
                <X size={12}/>
              </button>
            </div>
          ) : (
            <div style={{display:'flex',gap:10}}>
              {/* Choose from Gallery/Photos — no "capture" attr, so mobile
                  browsers show the normal picker (Photos, Files, etc.) */}
              <div className="upload-zone" style={{flex:1}} onClick={()=>galleryRef.current?.click()}>
                <Upload size={22} style={{margin:'0 auto 8px',opacity:.4,display:'block'}}/>
                <div style={{fontSize:13,color:'var(--text2)',fontWeight:500}}>Upload from Gallery</div>
                <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>
                  Choose an existing photo
                </div>
              </div>

              {/* Take Photo — capture="environment" opens the rear camera directly */}
              <div className="upload-zone" style={{flex:1}} onClick={()=>cameraRef.current?.click()}>
                <Camera size={22} style={{margin:'0 auto 8px',opacity:.4,display:'block'}}/>
                <div style={{fontSize:13,color:'var(--text2)',fontWeight:500}}>Take Photo</div>
                <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>
                  Use your camera 📷
                </div>
              </div>
            </div>
          )}

          {/* Gallery picker — plain file input, works on desktop + mobile */}
          <input ref={galleryRef} type="file" accept="image/*"
            style={{display:'none'}}
            onChange={handleImageChange}/>

          {/* Camera capture — only meaningful on mobile, opens rear camera */}
          <input ref={cameraRef} type="file" accept="image/*"
            capture="environment" style={{display:'none'}}
            onChange={handleImageChange}/>

          <div style={{height:24}}/>
        </div>

        <div className="admin-drawer-footer">
          <button className="drawer-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="drawer-save-btn" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <span style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
                  <span style={{width:16,height:16,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>
                  Saving…
                </span>
              : editId ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Stat card ──────────────────────────────────────── */
function StatCard({ title, value, items, icon }) {
  return (
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:20}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <span style={{fontSize:20}}>{icon}</span>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:'var(--text)'}}>{title}</h3>
      </div>
      {value!==undefined && <div style={{fontSize:36,fontWeight:800,color:'var(--accent)'}}>{value}</div>}
      {items && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {items.map(item=>(
            <div key={item._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}>
              <span style={{color:'var(--text2)'}}>{item._id||'—'}</span>
              <span style={{fontWeight:700,color:'var(--text)',background:'var(--bg2)',padding:'2px 8px',borderRadius:20,fontSize:12}}>{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN ADMIN PAGE
══════════════════════════════════════════════════════ */
export default function Admin() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()

  const [products,    setProducts]    = useState([])
  const [stats,       setStats]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterStore, setFilterStore] = useState('all')
  const [filterAud,   setFilterAud]   = useState('all')
  const [activeTab,   setActiveTab]   = useState('products')
  const [toast,       setToast]       = useState({ msg:'', type:'success' })
  const [confirmDel,  setConfirmDel]  = useState(null)
  const [drawer,      setDrawer]      = useState(null)
  const [page,        setPage]        = useState(1)

  const PER_PAGE   = 20
  const authHeader = { Authorization:`Bearer ${token}` }
  const showToast  = (msg, type='success') => setToast({ msg, type })

  /* ── Fetch products ─────────────────────────────── */
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit:200 }
      if (filterStore!=='all') params.store    = filterStore
      if (filterAud  !=='all') params.audience = filterAud
      if (search)              params.search   = search
      const { data } = await axios.get(`${API}/products`, { params })
      setProducts(data); setPage(1)
    } catch { showToast('Failed to load products','error') }
    finally  { setLoading(false) }
  }, [filterStore, filterAud, search, token])

  useEffect(() => { loadProducts() }, [loadProducts])

  /* ── Fetch stats ────────────────────────────────── */
  useEffect(() => {
    if (activeTab!=='stats') return
    axios.get(`${API}/products/stats`, { headers:authHeader })
      .then(r=>setStats(r.data))
      .catch(()=>showToast('Failed to load stats','error'))
  }, [activeTab])

  /* ── Drawer helpers ─────────────────────────────── */
  const openAdd  = () => setDrawer({ editId:null, form:{...EMPTY_FORM} })
  const openEdit = p  => setDrawer({
    editId: p._id,
    form: {
      name:p.name, description:p.description||'', category:p.category,
      affiliateLink:p.affiliateLink, rating:p.rating||'',
      featured:p.featured||false, audience:p.audience||'all',
      region:p.region||'all', store:p.store||'all',
      tags:p.tags||[], _imagePreview:p.image||'',
    }
  })
  const closeDrawer = () => setDrawer(null)
  const handleSaved = msg => { setDrawer(null); showToast(msg); loadProducts() }

  /* ── Delete ─────────────────────────────────────── */
  const confirmDelete = async () => {
    if (!confirmDel) return
    try {
      await axios.delete(`${API}/products/${confirmDel.id}`, { headers:authHeader })
      showToast('Product deleted')
      setProducts(p=>p.filter(x=>x._id!==confirmDel.id))
    } catch { showToast('Failed to delete','error') }
    finally  { setConfirmDel(null) }
  }

  const totalPages = Math.ceil(products.length/PER_PAGE)
  const paginated  = products.slice((page-1)*PER_PAGE, page*PER_PAGE)

  /* ────────────────────────────────────────────────── */
  return (
    <div className="admin-page">
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:''})}/>

      {confirmDel && (
        <ConfirmModal
          msg={`Delete "${confirmDel.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={()=>setConfirmDel(null)}
        />
      )}

      {drawer && (
        <ProductDrawer
          editId={drawer.editId}
          initialForm={drawer.form}
          token={token}
          onClose={closeDrawer}
          onSaved={handleSaved}
        />
      )}

      {/* ── Desktop sidebar ────────────────────────── */}
      <aside className="admin-sidebar">
        <div style={{padding:'0 12px',flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 4px 20px',borderBottom:'1px solid var(--border)',marginBottom:20}}>
            <span style={{fontSize:22}}>🛍️</span>
            <div>
              <div style={{fontWeight:800,fontSize:13,color:'var(--text)'}}>{SITE_NAME}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:1}}>Admin Panel</div>
            </div>
          </div>
          <nav style={{display:'flex',flexDirection:'column',gap:4}}>
            {[
              { id:'products', icon:<Package size={15}/>,   label:'Products'   },
              { id:'stats',    icon:<BarChart3 size={15}/>, label:'Analytics'  },
            ].map(t=>(
              <button key={t.id}
                style={{
                  display:'flex',alignItems:'center',gap:8,
                  padding:'10px 12px',borderRadius:8,border:'none',
                  background:activeTab===t.id?'var(--accent-bg)':'transparent',
                  color:activeTab===t.id?'var(--accent)':'var(--text2)',
                  fontSize:13,fontWeight:activeTab===t.id?600:400,
                  cursor:'pointer',fontFamily:'inherit',textAlign:'left',minHeight:42,
                }}
                onClick={()=>setActiveTab(t.id)}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={logout}
          style={{display:'flex',alignItems:'center',gap:8,margin:'0 12px',padding:'10px 12px',borderRadius:8,border:'1px solid var(--border)',background:'transparent',fontSize:13,color:'var(--text2)',cursor:'pointer',fontFamily:'inherit',minHeight:42}}>
          <LogOut size={14}/> Sign Out
        </button>
      </aside>

      {/* ── Main ───────────────────────────────────── */}
      <main className="admin-main">

        {/* ── PRODUCTS TAB ── */}
        {activeTab==='products' && (<>

          <div className="admin-header">
            <div>
              <h1 style={{margin:'0 0 4px',fontSize:'clamp(20px,3vw,28px)',fontWeight:800,color:'var(--text)',fontFamily:'var(--font-head)'}}>
                Products
              </h1>
              <p style={{margin:0,fontSize:13,color:'var(--text3)'}}>
                {loading ? '…' : `${products.length} total`}
              </p>
            </div>
            <div className="admin-header-btns">
              <button className="admin-refresh-btn" onClick={loadProducts} title="Refresh">
                <RefreshCw size={16} style={{animation:loading?'spin 1s linear infinite':'none'}}/>
              </button>
              <button className="admin-add-btn" onClick={openAdd}>
                <Plus size={15}/> Add Product
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filter-bar">
            <div className="admin-search-box">
              <Search size={15} style={{color:'var(--text3)',flexShrink:0}}/>
              <input className="admin-search-input"
                placeholder="Search products…"
                value={search}
                onChange={e=>setSearch(e.target.value)}/>
              {search && (
                <button onClick={()=>setSearch('')}
                  style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center',minWidth:36,minHeight:36,justifyContent:'center'}}>
                  <X size={14}/>
                </button>
              )}
            </div>
            <select className="admin-select" value={filterStore} onChange={e=>setFilterStore(e.target.value)}>
              {STORES.map(s=><option key={s} value={s}>{s==='all'?'All Stores':s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
            <select className="admin-select" value={filterAud} onChange={e=>setFilterAud(e.target.value)}>
              {AUDIENCES.map(a=><option key={a} value={a}>{a==='all'?'All Audiences':a.charAt(0).toUpperCase()+a.slice(1)}</option>)}
            </select>
          </div>

          {/* ── Desktop table ── */}
          <div className="admin-table-wrap">
            {loading ? (
              <div style={{textAlign:'center',padding:48,color:'var(--text3)',fontSize:14}}>Loading products…</div>
            ) : paginated.length===0 ? (
              <div style={{textAlign:'center',padding:48,color:'var(--text3)',fontSize:14}}>No products found</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>{['Image','Name','Category','Store','Audience','Rating','Tags','Actions'].map(h=>(
                    <th key={h} className="admin-th">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {paginated.map((p,i)=>(
                    <tr key={p._id} style={{background:i%2===0?'transparent':'var(--bg2)'}}>
                      <td className="admin-td">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="admin-product-thumb"/>
                          : <div className="admin-product-thumb-empty">📦</div>}
                      </td>
                      <td className="admin-td" style={{maxWidth:180}}>
                        <div style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text)'}}>{p.name}</div>
                        {p.featured && <span style={{fontSize:10,padding:'2px 6px',borderRadius:999,background:'#fef3c7',color:'#d97706',fontWeight:600}}>⭐ Featured</span>}
                      </td>
                      <td className="admin-td">
                        <span style={{fontSize:11,padding:'2px 8px',borderRadius:999,background:'var(--bg2)',color:'var(--text2)',fontWeight:500}}>{p.category}</span>
                      </td>
                      <td className="admin-td">
                        <span style={{fontSize:11,padding:'2px 8px',borderRadius:999,background:'var(--accent-bg)',color:'var(--accent)',fontWeight:600}}>{p.store}</span>
                      </td>
                      <td className="admin-td" style={{fontSize:13}}>{p.audience}</td>
                      <td className="admin-td">
                        {p.rating>0 && (
                          <div style={{display:'flex',alignItems:'center',gap:3}}>
                            <Star size={11} fill="#f59e0b" color="#f59e0b"/>
                            <span style={{fontSize:12}}>{p.rating}</span>
                          </div>
                        )}
                      </td>
                      <td className="admin-td">
                        <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                          {(p.tags||[]).slice(0,2).map(t=>(
                            <span key={t} style={{fontSize:10,padding:'1px 6px',borderRadius:999,background:'var(--bg2)',color:'var(--text3)'}}>{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="admin-td">
                        <div style={{display:'flex',gap:6}}>
                          <button className="admin-row-edit-btn" onClick={()=>openEdit(p)} title="Edit"><Pencil size={13}/></button>
                          <button className="admin-row-del-btn"  onClick={()=>setConfirmDel({id:p._id,name:p.name})} title="Delete"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Mobile product list ── */}
          <div className="admin-table-wrap admin-product-list">
            {loading ? (
              <div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>Loading…</div>
            ) : paginated.length===0 ? (
              <div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>No products found</div>
            ) : paginated.map(p=>(
              <div key={p._id} className="admin-product-row">
                <div className="admin-product-row-thumb">
                  {p.image
                    ? <img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : '📦'}
                </div>
                <div className="admin-product-row-info">
                  <div className="admin-product-row-name">{p.name}</div>
                  <div className="admin-product-row-meta">
                    {[p.category, p.store, p.rating>0?`⭐ ${p.rating}`:null].filter(Boolean).join(' · ')}
                  </div>
                  {p.tags?.length>0 && (
                    <div style={{display:'flex',gap:4,marginTop:3,flexWrap:'wrap'}}>
                      {p.tags.slice(0,2).map(t=>(
                        <span key={t} style={{fontSize:9,padding:'1px 6px',borderRadius:999,background:'var(--accent-bg)',color:'var(--accent)',fontWeight:600}}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-product-row-actions">
                  <button className="admin-row-edit-btn" onClick={()=>openEdit(p)}><Pencil size={14}/></button>
                  <button className="admin-row-del-btn"  onClick={()=>setConfirmDel({id:p._id,name:p.name})}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages>1 && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:16,flexWrap:'wrap'}}>
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                style={{padding:'10px 18px',borderRadius:10,border:'1px solid var(--border)',background:'var(--card)',cursor:page===1?'not-allowed':'pointer',fontSize:13,color:'var(--text)',fontFamily:'inherit',minHeight:44,opacity:page===1?.4:1}}>
                ← Prev
              </button>
              <span style={{fontSize:13,color:'var(--text2)',padding:'0 4px'}}>
                Page {page} of {totalPages}
              </span>
              <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                style={{padding:'10px 18px',borderRadius:10,border:'1px solid var(--border)',background:'var(--card)',cursor:page===totalPages?'not-allowed':'pointer',fontSize:13,color:'var(--text)',fontFamily:'inherit',minHeight:44,opacity:page===totalPages?.4:1}}>
                Next →
              </button>
            </div>
          )}
        </>)}

        {/* ── STATS TAB ── */}
        {activeTab==='stats' && (<>
          <h1 style={{margin:'0 0 20px',fontSize:'clamp(20px,3vw,28px)',fontWeight:800,color:'var(--text)',fontFamily:'var(--font-head)'}}>Analytics</h1>
          {!stats
            ? <div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>Loading stats…</div>
            : <div style={{display:'grid',gap:16,gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))'}}>
                <StatCard title="Total Products" value={stats.total}      icon="📦"/>
                <StatCard title="By Store"    items={stats.byStore}       icon="🏪"/>
                <StatCard title="By Audience" items={stats.byAudience}    icon="👤"/>
                <StatCard title="By Region"   items={stats.byRegion}      icon="🌏"/>
              </div>
          }
        </>)}
      </main>

      {/* ── Mobile bottom nav bar ──────────────────── */}
      <nav className="mobile-nav-bar" aria-label="Admin navigation">
        <div className="mobile-nav-bar-inner">
          {[
            { id:'home',     icon:<Home size={20}/>,      label:'Store',    action:()=>navigate('/')            },
            { id:'products', icon:<Package size={20}/>,   label:'Products', action:()=>setActiveTab('products') },
            { id:'stats',    icon:<BarChart3 size={20}/>, label:'Stats',    action:()=>setActiveTab('stats')    },
            { id:'logout',   icon:<LogOut size={20}/>,    label:'Logout',   action:logout                       },
          ].map(item=>(
            <button key={item.id}
              className={`mobile-nav-item${activeTab===item.id?' active':''}`}
              onClick={item.action}
              aria-label={item.label}>
              <div className="mobile-nav-icon">{item.icon}</div>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile FAB — only on products tab ─────── */}
      {activeTab==='products' && (
        <button className="mobile-fab" onClick={openAdd} aria-label="Add new product">
          <Plus size={24}/>
        </button>
      )}

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes popIn  {
          from { opacity:0; transform:translate(-50%,-50%) scale(.9); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        /* Desktop: FAB hidden */
        @media(min-width:769px) { .mobile-fab { display:none !important; } }
        /* Mobile: show FAB */
        @media(max-width:768px) {
          .mobile-fab {
            display:flex !important;
            position:fixed; right:16px;
            bottom:calc(72px + env(safe-area-inset-bottom, 0px));
            width:56px; height:56px; border-radius:50%;
            background:linear-gradient(135deg,var(--accent),var(--indigo));
            border:none; cursor:pointer; z-index:960;
            box-shadow:0 4px 20px rgba(109,74,255,.45);
            align-items:center; justify-content:center;
            color:#fff; transition:transform .2s,box-shadow .2s;
          }
          .mobile-fab:active { transform:scale(.9); }
        }
        @media(hover:hover) { tr:hover td { background: var(--bg2) !important; } }
      `}</style>
    </div>
  )
}
