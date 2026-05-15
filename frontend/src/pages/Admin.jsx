import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import {
  Plus, Pencil, Trash2, X, Upload, ShoppingBag,
  LogOut, Home, Search, ToggleLeft, ToggleRight,
  ImageIcon, Sun, Moon, Package, Star, Tag, BarChart2,
  Image, Eye, EyeOff, Menu
} from 'lucide-react'
import { API, STATIC } from '../config'

const CATS  = ['Beauty','Headphones','Electronics','Fashion','Kitchen','Fitness','Books','Home Decor']
const EMPTY = { name:'', description:'', price:'', category:'Electronics', affiliateLink:'', rating:'4', featured:false }
const EMPTY_BANNER = { title:'', subtitle:'', badge:'', ctaText:'Shop Now', ctaLink:'', bgColor:'#1e3a8a', bgColor2:'#4338ca', accentColor:'#fbbf24', active:true, order:0 }

export default function Admin() {
  const { token, adminUser, logout } = useAuth()
  const { isDark, toggle }           = useTheme()
  const navigate = useNavigate()

  const [activeTab, setActiveTab]   = useState('products')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Products
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [imgFile, setImgFile]   = useState(null)
  const [imgPrev, setImgPrev]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const fileRef = useRef()

  // Banners
  const [banners, setBanners]               = useState([])
  const [bannerLoading, setBannerLoading]   = useState(true)
  const [bannerModal, setBannerModal]       = useState(false)
  const [editingBanner, setEditingBanner]   = useState(null)
  const [bannerForm, setBannerForm]         = useState(EMPTY_BANNER)
  const [bannerImgFile, setBannerImgFile]   = useState(null)
  const [bannerImgPrev, setBannerImgPrev]   = useState('')
  const [bannerSaving, setBannerSaving]     = useState(false)
  const [deleteBannerId, setDeleteBannerId] = useState(null)
  const bannerFileRef = useRef()

  const hdrs = { Authorization: `Bearer ${token}` }

  const fetchProducts = async () => {
    setLoading(true)
    try { const { data } = await axios.get(`${API}/products`); setProducts(data) }
    catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }
  const fetchBanners = async () => {
    setBannerLoading(true)
    try { const { data } = await axios.get(`${API}/banners?all=true`); setBanners(data) }
    catch { toast.error('Failed to load banners') }
    finally { setBannerLoading(false) }
  }
  useEffect(() => { fetchProducts(); fetchBanners() }, [])

  // Product handlers
  const openAdd  = () => { setEditing(null); setForm(EMPTY); setImgFile(null); setImgPrev(''); setModal(true) }
  const openEdit = p  => {
    setEditing(p)
    setForm({ name:p.name, description:p.description, price:String(p.price), category:p.category, affiliateLink:p.affiliateLink, rating:String(p.rating), featured:p.featured })
    setImgFile(null); setImgPrev(p.image ? `${STATIC}${p.image}` : ''); setModal(true)
  }
  const closeModal  = () => { setModal(false); setEditing(null); setImgFile(null); setImgPrev('') }
  const handleImage = e => {
    const f = e.target.files[0]; if (!f) return
    if (f.size > 5*1024*1024) { toast.error('Max 5MB'); return }
    setImgFile(f); setImgPrev(URL.createObjectURL(f))
  }
  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k,v))
      if (imgFile) fd.append('image', imgFile)
      if (editing) { await axios.put(`${API}/products/${editing._id}`, fd, { headers:hdrs }); toast.success('Updated!') }
      else         { await axios.post(`${API}/products`, fd, { headers:hdrs }); toast.success('Added!') }
      closeModal(); fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }
  const handleDelete = async id => {
    try { await axios.delete(`${API}/products/${id}`, { headers:hdrs }); toast.success('Deleted'); setDeleteId(null); fetchProducts() }
    catch { toast.error('Delete failed') }
  }

  // Banner handlers
  const openAddBanner  = () => { setEditingBanner(null); setBannerForm(EMPTY_BANNER); setBannerImgFile(null); setBannerImgPrev(''); setBannerModal(true) }
  const openEditBanner = b  => {
    setEditingBanner(b)
    setBannerForm({ title:b.title, subtitle:b.subtitle, badge:b.badge, ctaText:b.ctaText, ctaLink:b.ctaLink, bgColor:b.bgColor, bgColor2:b.bgColor2, accentColor:b.accentColor, active:b.active, order:b.order })
    setBannerImgFile(null); setBannerImgPrev(b.image ? `${STATIC}${b.image}` : ''); setBannerModal(true)
  }
  const closeBannerModal = () => { setBannerModal(false); setEditingBanner(null); setBannerImgFile(null); setBannerImgPrev('') }
  const handleBannerImg  = e => {
    const f = e.target.files[0]; if (!f) return
    if (f.size > 8*1024*1024) { toast.error('Max 8MB'); return }
    setBannerImgFile(f); setBannerImgPrev(URL.createObjectURL(f))
  }
  const handleBannerSubmit = async e => {
    e.preventDefault(); setBannerSaving(true)
    try {
      const fd = new FormData()
      Object.entries(bannerForm).forEach(([k,v]) => fd.append(k,v))
      if (bannerImgFile) fd.append('image', bannerImgFile)
      if (editingBanner) { await axios.put(`${API}/banners/${editingBanner._id}`, fd, { headers:hdrs }); toast.success('Banner updated!') }
      else               { await axios.post(`${API}/banners`, fd, { headers:hdrs }); toast.success('Banner created!') }
      closeBannerModal(); fetchBanners()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setBannerSaving(false) }
  }
  const handleDeleteBanner = async id => {
    try { await axios.delete(`${API}/banners/${id}`, { headers:hdrs }); toast.success('Deleted'); setDeleteBannerId(null); fetchBanners() }
    catch { toast.error('Delete failed') }
  }
  const toggleActive = async b => {
    try {
      const fd = new FormData()
      Object.entries({ title:b.title, subtitle:b.subtitle, badge:b.badge, ctaText:b.ctaText, ctaLink:b.ctaLink, bgColor:b.bgColor, bgColor2:b.bgColor2, accentColor:b.accentColor, order:b.order, active:!b.active }).forEach(([k,v]) => fd.append(k,v))
      await axios.put(`${API}/banners/${b._id}`, fd, { headers:hdrs }); fetchBanners()
    } catch { toast.error('Failed') }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  const stats = [
    { icon:<Package size={17}/>, label:'Products', value:products.length,                                                                  color:'#2563eb' },
    { icon:<Star    size={17}/>, label:'Featured', value:products.filter(p=>p.featured).length,                                           color:'#f59e0b' },
    { icon:<BarChart2 size={17}/>,label:'Avg Rating',value:products.length?(products.reduce((a,p)=>a+p.rating,0)/products.length).toFixed(1):'0',color:'#10b981' },
    { icon:<Tag     size={17}/>, label:'Categories',value:[...new Set(products.map(p=>p.category))].length,                               color:'#8b5cf6' },
  ]

  const goTab = tab => { setActiveTab(tab); setSidebarOpen(false) }

  return (
    <div style={s.page}>
      <style>{`
        @media(max-width:768px){.admin-mobile-top{display:flex!important}
          .admin-sidebar{transform:translateX(-100%)!important;z-index:200!important;transition:transform .28s cubic-bezier(.22,1,.36,1)!important}
          .admin-sidebar.open{transform:translateX(0)!important}
          .admin-overlay{display:block!important}
          .admin-main{padding:16px!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .admin-table-wrap{overflow-x:auto!important}
          .form-grid{grid-template-columns:1fr!important}
          .banner-grid{grid-template-columns:1fr!important}
        }
        .nav-btn:hover{background:var(--bg3)!important;color:var(--text)!important}
        .nav-btn-active{background:var(--accent-bg)!important;border:1px solid var(--accent-bdr)!important;color:var(--accent)!important}
        .tbl-row:hover{background:var(--bg2)!important}
        .action-btn:hover{opacity:0.8;transform:scale(1.08)}
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="admin-overlay" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.42)',zIndex:199,backdropFilter:'blur(2px)'}} onClick={() => setSidebarOpen(false)}/>}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar${sidebarOpen?' open':''}`} style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sideLogo}><ShoppingBag size={15} color="#fff"/></div>
          <span style={s.sideLogoText}>Prime<span style={{color:'var(--accent)'}}>Offers</span></span>
        </div>

        <nav style={s.nav}>
          {[{id:'products',icon:<Package size={14}/>,label:'Products'},{id:'banners',icon:<Image size={14}/>,label:'Banners'}].map(({id,icon,label}) => (
            <button key={id} className={`nav-btn${activeTab===id?' nav-btn-active':''}`}
              onClick={() => goTab(id)}
              style={s.navBtn}>
              {icon} {label}
            </button>
          ))}
        </nav>

        <div style={s.sideFooter}>
          <div style={s.adminRow}>
            <div style={s.avatar}>{adminUser?.[0]?.toUpperCase()}</div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:600,fontSize:'12px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{adminUser}</div>
              <div style={{color:'var(--text3)',fontSize:'10px'}}>Administrator</div>
            </div>
          </div>
          <div style={{display:'flex',gap:'5px',marginTop:'10px',flexWrap:'wrap'}}>
            <Link to="/"  style={s.sideBtn}><Home size={12}/> Store</Link>
            <button onClick={toggle}   style={s.sideBtn}>{isDark?<Sun size={12} color="#f59e0b"/>:<Moon size={12} color="#2563eb"/>}</button>
            <button onClick={() => {logout();navigate('/')}} style={{...s.sideBtn,color:'var(--hot)'}}><LogOut size={12}/></button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main" style={s.main}>

        {/* Mobile topbar */}
        <div className="admin-mobile-top" style={s.mobileTop}>
          <button onClick={() => setSidebarOpen(true)} style={s.menuBtn}><Menu size={18}/></button>
          <span style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'16px',color:'var(--text)'}}>
            {activeTab === 'products' ? 'Products' : 'Banners'}
          </span>
          <div style={{width:'36px'}}/>
        </div>

        {/* ════ PRODUCTS ════ */}
        {activeTab === 'products' && (
          <div>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Products</h1>
                <p style={s.pageSub}>Manage your affiliate product catalog</p>
              </div>
              <button onClick={openAdd} style={s.addBtn}><Plus size={14}/> Add Product</button>
            </div>

            <div className="stats-grid" style={s.statsGrid}>
              {stats.map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={{...s.statIcon,background:`${st.color}14`,color:st.color}}>{st.icon}</div>
                  <div>
                    <div style={s.statVal}>{st.value}</div>
                    <div style={s.statLabel}>{st.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.searchRow}>
              <div style={s.searchWrap}>
                <Search size={13} style={{position:'absolute',left:'11px',color:'var(--text3)',pointerEvents:'none'}}/>
                <input style={s.searchInput} placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>

            <div className="admin-table-wrap" style={s.tableWrap}>
              {loading ? (
                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}><div className="spinner"/></div>
              ) : filtered.length === 0 ? (
                <div style={s.empty}>
                  <Package size={36} color="var(--text3)"/>
                  <p style={{color:'var(--text2)',fontSize:'14px'}}>No products. <button onClick={openAdd} style={{color:'var(--accent)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Add one!</button></p>
                </div>
              ) : (
                <table style={s.table}>
                  <thead><tr style={s.thead}>
                    {['Product','Category','Rating','Featured','Actions'].map(h=><th key={h} style={s.th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p._id} className="tbl-row" style={s.tr}>
                        <td style={s.td}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            <div style={s.thumb}>
                              {p.image ? <img src={`${STATIC}${p.image}`} alt={p.name} style={s.thumbImg}/> : <ImageIcon size={14} color="var(--text3)"/>}
                            </div>
                            <div style={{minWidth:0}}>
                              <div style={{fontWeight:500,fontSize:'13px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'180px'}}>{p.name}</div>
                              <div style={{color:'var(--text3)',fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'180px'}}>{p.description.slice(0,45)}…</div>
                            </div>
                          </div>
                        </td>
                        <td style={s.td}><span style={s.catChip}>{p.category}</span></td>
                        <td style={s.td}><StarRating rating={p.rating} size={11}/></td>
                        <td style={s.td}>{p.featured?<span style={s.yes}>★ Yes</span>:<span style={s.no}>No</span>}</td>
                        <td style={s.td}>
                          <div style={{display:'flex',gap:'5px'}}>
                            <button className="action-btn" onClick={()=>openEdit(p)} style={s.editBtn} title="Edit"><Pencil size={12}/></button>
                            <button className="action-btn" onClick={()=>setDeleteId(p._id)} style={s.delBtn} title="Delete"><Trash2 size={12}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ════ BANNERS ════ */}
        {activeTab === 'banners' && (
          <div>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Banners</h1>
                <p style={s.pageSub}>Manage homepage carousel banners</p>
              </div>
              <button onClick={openAddBanner} style={s.addBtn}><Plus size={14}/> Add Banner</button>
            </div>
            <div style={s.tip}>💡 Banners appear as a sliding carousel on the homepage. Active banners are visible to customers.</div>
            <div className="banner-grid" style={s.bannerGrid}>
              {bannerLoading ? (
                <div style={{display:'flex',justifyContent:'center',padding:'50px',gridColumn:'1/-1'}}><div className="spinner"/></div>
              ) : banners.length===0 ? (
                <div style={{...s.empty,gridColumn:'1/-1'}}>
                  <Image size={36} color="var(--text3)"/>
                  <p style={{color:'var(--text2)',fontSize:'14px'}}>No banners. <button onClick={openAddBanner} style={{color:'var(--accent)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Create one!</button></p>
                </div>
              ) : banners.map(b => (
                <div key={b._id} style={s.bannerCard}>
                  <div style={{...s.bannerPrev,background:`linear-gradient(135deg,${b.bgColor},${b.bgColor2})`}}>
                    {b.image ? <img src={`${STATIC}${b.image}`} alt={b.title} style={{height:'64px',width:'64px',objectFit:'cover',borderRadius:'8px',flexShrink:0}}/> : <span style={{fontSize:'30px'}}>🛍️</span>}
                    <div style={{flex:1,minWidth:0}}>
                      {b.badge && <div style={{fontSize:'9px',fontWeight:700,color:b.accentColor,background:`${b.accentColor}22`,padding:'1px 6px',borderRadius:'20px',width:'fit-content',marginBottom:'3px'}}>{b.badge}</div>}
                      <div style={{color:'#fff',fontWeight:700,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.title}</div>
                      {b.subtitle && <div style={{color:'rgba(255,255,255,0.7)',fontSize:'10px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.subtitle}</div>}
                    </div>
                  </div>
                  <div style={s.bannerFoot}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={b.active?s.activePill:s.inactivePill}>{b.active?'● Live':'○ Hidden'}</span>
                      <span style={{color:'var(--text3)',fontSize:'10px'}}>#{b.order}</span>
                    </div>
                    <div style={{display:'flex',gap:'5px'}}>
                      <button className="action-btn" onClick={()=>toggleActive(b)} style={s.visBtn} title={b.active?'Hide':'Show'}>{b.active?<EyeOff size={12}/>:<Eye size={12}/>}</button>
                      <button className="action-btn" onClick={()=>openEditBanner(b)} style={s.editBtn} title="Edit"><Pencil size={12}/></button>
                      <button className="action-btn" onClick={()=>setDeleteBannerId(b._id)} style={s.delBtn} title="Delete"><Trash2 size={12}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ════ PRODUCT MODAL ════ */}
      {modalOpen && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h2 style={s.modalTitle}>{editing?'Edit Product':'Add Product'}</h2>
              <button onClick={closeModal} style={s.modalClose}><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'18px'}}>
              <div className="form-grid" style={s.formGrid}>
                <div style={s.formCol}>
                  <div style={s.field}>
                    <label style={s.lbl}>Image</label>
                    <div style={{...s.imgUp,height:'130px',...(imgPrev?s.imgUpFilled:{})}} onClick={()=>fileRef.current.click()}>
                      {imgPrev?<img src={imgPrev} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        :<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}><Upload size={20} color="var(--text3)"/><span style={{color:'var(--text3)',fontSize:'12px'}}>Click to upload</span></div>}
                      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImage}/>
                    </div>
                    {imgPrev&&<button type="button" style={s.rmImg} onClick={()=>{setImgFile(null);setImgPrev('')}}>Remove</button>}
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Featured</label>
                    <button type="button" onClick={()=>setForm(f=>({...f,featured:!f.featured}))} style={s.togBtn}>
                      {form.featured?<><ToggleRight size={20} color="var(--accent)"/><span style={{color:'var(--accent)',fontWeight:600,fontSize:'13px'}}>Featured</span></>:<><ToggleLeft size={20} color="var(--text3)"/><span style={{color:'var(--text2)',fontSize:'13px'}}>Not Featured</span></>}
                    </button>
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Rating (0–5)</label>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <input style={{...s.inp,flex:1}} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>setForm(f=>({...f,rating:e.target.value}))} required/>
                      <StarRating rating={parseFloat(form.rating)||0} size={14}/>
                    </div>
                  </div>
                </div>
                <div style={s.formCol}>
                  <div style={s.field}><label style={s.lbl}>Name *</label><input style={s.inp} required placeholder="Product name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div style={s.field}><label style={s.lbl}>Description *</label><textarea style={{...s.inp,resize:'vertical',minHeight:'70px'}} required placeholder="Description…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <div style={s.field}><label style={s.lbl}>Price (₹) *</label><input style={s.inp} type="number" min="0" required placeholder="2999" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
                    <div style={s.field}><label style={s.lbl}>Category *</label><select style={s.inp} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div style={s.field}><label style={s.lbl}>Affiliate Link *</label><input style={s.inp} type="url" required placeholder="https://amzn.to/…" value={form.affiliateLink} onChange={e=>setForm(f=>({...f,affiliateLink:e.target.value}))}/></div>
                </div>
              </div>
              <div style={s.modalFoot}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} style={s.saveBtn}>
                  {saving?<div style={{width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .75s linear infinite'}}/>:editing?'Save Changes':'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ DELETE PRODUCT ════ */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={{...s.modal,maxWidth:'360px',textAlign:'center',padding:'28px 24px'}}>
            <div style={{fontSize:'40px',marginBottom:'10px'}}>🗑️</div>
            <h3 style={{fontFamily:'var(--font-head)',fontSize:'17px',fontWeight:700,color:'var(--text)',marginBottom:'7px'}}>Delete product?</h3>
            <p style={{color:'var(--text2)',fontSize:'13px',marginBottom:'20px'}}>This action cannot be undone.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setDeleteId(null)} style={{...s.cancelBtn,flex:1,justifyContent:'center'}}>Cancel</button>
              <button onClick={()=>handleDelete(deleteId)} style={{...s.saveBtn,flex:1,justifyContent:'center',background:'var(--hot)'}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ BANNER MODAL ════ */}
      {bannerModal && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&closeBannerModal()}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h2 style={s.modalTitle}>{editingBanner?'Edit Banner':'New Banner'}</h2>
              <button onClick={closeBannerModal} style={s.modalClose}><X size={16}/></button>
            </div>
            <form onSubmit={handleBannerSubmit} style={{display:'flex',flexDirection:'column',gap:'18px'}}>
              <div className="form-grid" style={s.formGrid}>
                <div style={s.formCol}>
                  <div style={s.field}>
                    <label style={s.lbl}>Image (optional)</label>
                    <div style={{...s.imgUp,height:'110px',...(bannerImgPrev?s.imgUpFilled:{})}} onClick={()=>bannerFileRef.current.click()}>
                      {bannerImgPrev?<img src={bannerImgPrev} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        :<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}><Upload size={18} color="var(--text3)"/><span style={{color:'var(--text3)',fontSize:'11px'}}>Upload image</span></div>}
                      <input ref={bannerFileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleBannerImg}/>
                    </div>
                    {bannerImgPrev&&<button type="button" style={s.rmImg} onClick={()=>{setBannerImgFile(null);setBannerImgPrev('')}}>Remove</button>}
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Gradient Colors</label>
                    <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
                      {[['From','bgColor'],['To','bgColor2'],['Accent','accentColor']].map(([lbl,key])=>(
                        <div key={key} style={{display:'flex',flexDirection:'column',gap:'3px',alignItems:'center'}}>
                          <label style={{fontSize:'9px',color:'var(--text3)',fontWeight:600}}>{lbl}</label>
                          <input type="color" style={{width:'40px',height:'30px',borderRadius:'6px',border:'1px solid var(--border)',cursor:'pointer',padding:'2px'}}
                            value={bannerForm[key]} onChange={e=>setBannerForm(f=>({...f,[key]:e.target.value}))}/>
                        </div>
                      ))}
                    </div>
                    <div style={{height:'22px',borderRadius:'5px',background:`linear-gradient(135deg,${bannerForm.bgColor},${bannerForm.bgColor2})`,border:'1px solid var(--border)',marginTop:'4px'}}/>
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Visibility</label>
                    <button type="button" onClick={()=>setBannerForm(f=>({...f,active:!f.active}))} style={s.togBtn}>
                      {bannerForm.active?<><ToggleRight size={20} color="var(--success)"/><span style={{color:'var(--success)',fontWeight:600,fontSize:'13px'}}>Live</span></>:<><ToggleLeft size={20} color="var(--text3)"/><span style={{color:'var(--text2)',fontSize:'13px'}}>Hidden</span></>}
                    </button>
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Order</label>
                    <input style={s.inp} type="number" min="0" placeholder="0 = first" value={bannerForm.order} onChange={e=>setBannerForm(f=>({...f,order:e.target.value}))}/>
                  </div>
                </div>
                <div style={s.formCol}>
                  <div style={s.field}><label style={s.lbl}>Headline *</label><input style={s.inp} required placeholder="e.g. Up to 50% Off Electronics" value={bannerForm.title} onChange={e=>setBannerForm(f=>({...f,title:e.target.value}))}/></div>
                  <div style={s.field}><label style={s.lbl}>Subtext</label><input style={s.inp} placeholder="e.g. Limited time deals on top brands" value={bannerForm.subtitle} onChange={e=>setBannerForm(f=>({...f,subtitle:e.target.value}))}/></div>
                  <div style={s.field}><label style={s.lbl}>Badge</label><input style={s.inp} placeholder="🔥 Hot Deal" value={bannerForm.badge} onChange={e=>setBannerForm(f=>({...f,badge:e.target.value}))}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <div style={s.field}><label style={s.lbl}>Button Text</label><input style={s.inp} placeholder="Shop Now" value={bannerForm.ctaText} onChange={e=>setBannerForm(f=>({...f,ctaText:e.target.value}))}/></div>
                    <div style={s.field}><label style={s.lbl}>Button Link</label><input style={s.inp} type="url" placeholder="https://amzn.to/…" value={bannerForm.ctaLink} onChange={e=>setBannerForm(f=>({...f,ctaLink:e.target.value}))}/></div>
                  </div>
                  <div style={s.field}>
                    <label style={s.lbl}>Preview</label>
                    <div style={{borderRadius:'9px',overflow:'hidden',background:`linear-gradient(135deg,${bannerForm.bgColor},${bannerForm.bgColor2})`,padding:'14px 16px',minHeight:'70px',display:'flex',flexDirection:'column',gap:'5px',border:'1px solid var(--border)'}}>
                      {bannerForm.badge&&<span style={{fontSize:'10px',fontWeight:700,color:bannerForm.accentColor,background:`${bannerForm.accentColor}22`,padding:'2px 7px',borderRadius:'20px',width:'fit-content'}}>{bannerForm.badge}</span>}
                      <div style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>{bannerForm.title||'Headline'}</div>
                      {bannerForm.subtitle&&<div style={{color:'rgba(255,255,255,0.7)',fontSize:'11px'}}>{bannerForm.subtitle}</div>}
                      {bannerForm.ctaText&&<div style={{background:bannerForm.accentColor,color:'#1a1200',padding:'4px 12px',borderRadius:'6px',fontSize:'11px',fontWeight:700,width:'fit-content',marginTop:'3px'}}>{bannerForm.ctaText}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div style={s.modalFoot}>
                <button type="button" onClick={closeBannerModal} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={bannerSaving} style={s.saveBtn}>
                  {bannerSaving?<div style={{width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .75s linear infinite'}}/>:editingBanner?'Save Changes':'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ DELETE BANNER ════ */}
      {deleteBannerId && (
        <div style={s.overlay}>
          <div style={{...s.modal,maxWidth:'360px',textAlign:'center',padding:'28px 24px'}}>
            <div style={{fontSize:'40px',marginBottom:'10px'}}>🗑️</div>
            <h3 style={{fontFamily:'var(--font-head)',fontSize:'17px',fontWeight:700,color:'var(--text)',marginBottom:'7px'}}>Delete banner?</h3>
            <p style={{color:'var(--text2)',fontSize:'13px',marginBottom:'20px'}}>This cannot be undone.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setDeleteBannerId(null)} style={{...s.cancelBtn,flex:1,justifyContent:'center'}}>Cancel</button>
              <button onClick={()=>handleDeleteBanner(deleteBannerId)} style={{...s.saveBtn,flex:1,justifyContent:'center',background:'var(--hot)'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page:{display:'flex',minHeight:'100vh',background:'var(--bg)'},
  sidebar:{width:'200px',flexShrink:0,background:'var(--bg2)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'16px 12px',position:'sticky',top:0,height:'100vh',transition:'transform .28s cubic-bezier(.22,1,.36,1)'},
  sideTop:{display:'flex',alignItems:'center',gap:'8px',paddingBottom:'14px',borderBottom:'1px solid var(--border)',marginBottom:'12px'},
  sideLogo:{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#2563eb,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(37,99,235,0.28)',flexShrink:0},
  sideLogoText:{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'16px',color:'var(--text)'},
  nav:{display:'flex',flexDirection:'column',gap:'3px',flex:1},
  navBtn:{display:'flex',alignItems:'center',gap:'7px',padding:'8px 10px',borderRadius:'7px',fontWeight:500,fontSize:'13px',cursor:'pointer',border:'1px solid transparent',width:'100%',textAlign:'left',transition:'all .15s',background:'transparent',color:'var(--text2)'},
  sideFooter:{borderTop:'1px solid var(--border)',paddingTop:'12px'},
  adminRow:{display:'flex',alignItems:'center',gap:'8px'},
  avatar:{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#2563eb,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'12px',color:'#fff',flexShrink:0},
  sideBtn:{display:'flex',alignItems:'center',gap:'3px',padding:'5px 8px',borderRadius:'6px',background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text2)',fontSize:'11px',cursor:'pointer',textDecoration:'none'},
  main:{flex:1,padding:'24px 28px',overflowX:'auto',minWidth:0},
  mobileTop:{display:'none',alignItems:'center',justifyContent:'space-between',marginBottom:'16px',padding:'0 0 12px',borderBottom:'1px solid var(--border)'},
  topBar:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'},
  pageTitle:{fontFamily:'var(--font-head)',fontSize:'clamp(20px,2.5vw,24px)',fontWeight:700,color:'var(--text)',letterSpacing:'-0.3px'},
  pageSub:{color:'var(--text2)',fontSize:'12px',marginTop:'3px'},
  addBtn:{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',borderRadius:'8px',background:'linear-gradient(135deg,#2563eb,#6366f1)',color:'#fff',fontWeight:600,fontSize:'13px',boxShadow:'0 3px 12px rgba(37,99,235,0.28)',border:'none',cursor:'pointer',whiteSpace:'nowrap',minHeight:'38px'},
  statsGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'18px'},
  statCard:{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'14px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'var(--shadow-sm)'},
  statIcon:{width:'36px',height:'36px',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
  statVal:{fontFamily:'var(--font-head)',fontSize:'20px',fontWeight:700,color:'var(--text)'},
  statLabel:{color:'var(--text3)',fontSize:'11px',marginTop:'1px'},
  searchRow:{marginBottom:'14px'},
  searchWrap:{position:'relative',maxWidth:'340px',display:'flex',alignItems:'center'},
  searchInput:{width:'100%',background:'var(--bg2)',border:'1.5px solid var(--border)',borderRadius:'7px',padding:'8px 12px 8px 32px',color:'var(--text)',fontSize:'13px'},
  tableWrap:{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-sm)'},
  table:{width:'100%',borderCollapse:'collapse'},
  thead:{background:'var(--bg2)'},
  th:{padding:'10px 14px',textAlign:'left',fontSize:'10px',fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.6px',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'},
  tr:{borderBottom:'1px solid var(--border)',transition:'background .15s'},
  td:{padding:'12px 14px',fontSize:'13px',verticalAlign:'middle',color:'var(--text)'},
  thumb:{width:'38px',height:'38px',borderRadius:'7px',background:'var(--bg2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0},
  thumbImg:{width:'100%',height:'100%',objectFit:'cover'},
  catChip:{background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',color:'var(--accent)',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:500,whiteSpace:'nowrap'},
  yes:{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',color:'#b45309',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:600},
  no:{background:'var(--bg2)',border:'1px solid var(--border)',color:'var(--text3)',padding:'2px 8px',borderRadius:'20px',fontSize:'11px'},
  editBtn:{width:'28px',height:'28px',borderRadius:'6px',background:'rgba(99,102,241,0.1)',color:'#6366f1',border:'1px solid rgba(99,102,241,0.22)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .15s'},
  delBtn:{width:'28px',height:'28px',borderRadius:'6px',background:'rgba(239,68,68,0.1)',color:'var(--hot)',border:'1px solid rgba(239,68,68,0.22)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .15s'},
  visBtn:{width:'28px',height:'28px',borderRadius:'6px',background:'rgba(37,99,235,0.08)',color:'var(--accent)',border:'1px solid rgba(37,99,235,0.18)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .15s'},
  empty:{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'48px 20px'},
  tip:{background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',borderRadius:'9px',padding:'10px 14px',color:'var(--text2)',fontSize:'12px',lineHeight:1.5,marginBottom:'16px'},
  bannerGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'14px'},
  bannerCard:{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-sm)'},
  bannerPrev:{height:'95px',display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',overflow:'hidden'},
  bannerFoot:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',borderTop:'1px solid var(--border)'},
  activePill:{fontSize:'10px',fontWeight:600,color:'var(--success)',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.22)',padding:'2px 7px',borderRadius:'20px'},
  inactivePill:{fontSize:'10px',color:'var(--text3)',background:'var(--bg2)',border:'1px solid var(--border)',padding:'2px 7px',borderRadius:'20px'},
  menuBtn:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'7px',padding:'7px',display:'flex',cursor:'pointer',color:'var(--text2)'},
  // Modals
  overlay:{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.48)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'},
  modal:{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'clamp(18px,3vw,24px)',width:'100%',maxWidth:'740px',maxHeight:'90vh',overflowY:'auto',boxShadow:'var(--shadow-lg)',animation:'fadeUp .25s cubic-bezier(.22,1,.36,1)'},
  modalHead:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px'},
  modalTitle:{fontFamily:'var(--font-head)',fontSize:'17px',fontWeight:700,color:'var(--text)'},
  modalClose:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'7px',padding:'5px',color:'var(--text2)',display:'flex',cursor:'pointer'},
  formGrid:{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:'18px'},
  formCol:{display:'flex',flexDirection:'column',gap:'13px'},
  field:{display:'flex',flexDirection:'column',gap:'4px'},
  lbl:{fontSize:'11px',fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.5px'},
  inp:{background:'var(--bg2)',border:'1.5px solid var(--border)',borderRadius:'7px',padding:'9px 11px',color:'var(--text)',fontSize:'13px',width:'100%',transition:'border-color .2s,box-shadow .2s'},
  imgUp:{border:'2px dashed var(--border)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',background:'var(--bg2)',overflow:'hidden',transition:'border-color .2s'},
  imgUpFilled:{border:'2px dashed var(--accent)'},
  rmImg:{background:'none',color:'var(--hot)',fontSize:'11px',cursor:'pointer',border:'none',padding:0,textAlign:'left'},
  togBtn:{display:'flex',alignItems:'center',gap:'7px',background:'var(--bg2)',border:'1.5px solid var(--border)',borderRadius:'7px',padding:'9px 11px',cursor:'pointer',fontSize:'13px',fontWeight:500,color:'var(--text)'},
  modalFoot:{display:'flex',justifyContent:'flex-end',gap:'8px',borderTop:'1px solid var(--border)',paddingTop:'16px'},
  cancelBtn:{display:'flex',alignItems:'center',gap:'4px',padding:'8px 18px',borderRadius:'7px',background:'var(--bg2)',border:'1px solid var(--border)',color:'var(--text)',fontSize:'13px',cursor:'pointer'},
  saveBtn:{display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',padding:'8px 22px',borderRadius:'7px',background:'linear-gradient(135deg,#2563eb,#6366f1)',color:'#fff',fontSize:'13px',fontWeight:600,boxShadow:'0 3px 10px rgba(37,99,235,0.28)',minWidth:'120px',cursor:'pointer',border:'none'},
}