import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Lock, User, Eye, EyeOff, ShoppingBag, Sun, Moon, ArrowLeft, Shield } from 'lucide-react'
import { API } from '../config'

export default function AdminLogin() {
  const [form, setForm]       = useState({ username:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login }    = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate     = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/login`, form)
      login(data.token, data.username)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <style>{`
        .login-input:focus{border-color:var(--accent)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.14)!important}
        .login-btn:hover{opacity:0.9;transform:translateY(-1px)}
        @media(max-width:480px){
          .login-card{padding:28px 20px!important}
        }
      `}</style>
      <div style={s.bgGlow}/>
      <div style={s.bgGlow2}/>

      {/* Top bar */}
      <div style={s.topBar}>
        <Link to="/" style={s.backBtn}>
          <ArrowLeft size={13}/> Back to Store
        </Link>
        <button onClick={toggle} style={s.themeBtn} aria-label="Toggle theme">
          {isDark ? <Sun size={14} color="#f59e0b"/> : <Moon size={14} color="var(--accent)"/>}
        </button>
      </div>

      {/* Card */}
      <div className="login-card" style={s.card}>
        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoIcon}>
            <ShoppingBag size={20} color="#fff"/>
          </div>
          <h1 style={s.title}>Admin Portal</h1>
          <p style={s.subtitle}>Secure access to your store dashboard</p>
        </div>

        {/* Security notice */}
        <div style={s.notice}>
          <Shield size={12} color="var(--accent)"/>
          <span>Restricted to authorized personnel only.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form} autoComplete="off">
          {/* Honeypot */}
          <input type="text" name="website" style={{display:'none'}} tabIndex={-1} autoComplete="off"/>

          <div style={s.field}>
            <label style={s.label}>Username</label>
            <div style={{position:'relative',display:'flex',alignItems:'center'}}>
              <User size={14} style={{position:'absolute',left:'12px',color:'var(--text3)',pointerEvents:'none'}}/>
              <input
                className="login-input"
                style={s.input}
                type="text" required autoFocus
                autoComplete="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm(f => ({...f, username:e.target.value}))}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{position:'relative',display:'flex',alignItems:'center'}}>
              <Lock size={14} style={{position:'absolute',left:'12px',color:'var(--text3)',pointerEvents:'none'}}/>
              <input
                className="login-input"
                style={{...s.input, paddingRight:'44px'}}
                type={showPwd?'text':'password'} required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({...f, password:e.target.value}))}
              />
              <button type="button" tabIndex={-1}
                style={{position:'absolute',right:'12px',background:'none',color:'var(--text3)',display:'flex',alignItems:'center',cursor:'pointer',border:'none',padding:'4px'}}
                onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn" style={s.submitBtn}>
            {loading
              ? <div style={{width:'18px',height:'18px',border:'2.5px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .75s linear infinite'}}/>
              : 'Sign In to Dashboard'
            }
          </button>
        </form>

        <p style={s.footNote}>
          By signing in you agree to our{' '}
          <Link to="/" style={{color:'var(--accent)',textDecoration:'underline'}}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page:{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'clamp(16px,4vw,24px)',position:'relative',overflow:'hidden'},
  bgGlow:{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(37,99,235,0.09) 0%,transparent 70%)',pointerEvents:'none',zIndex:0},
  bgGlow2:{position:'absolute',bottom:'-10%',right:'-5%',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0},
  topBar:{position:'fixed',top:'14px',left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 clamp(14px,3vw,24px)',zIndex:10,pointerEvents:'none'},
  backBtn:{display:'flex',alignItems:'center',gap:'5px',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'6px 13px',color:'var(--text2)',fontSize:'12px',fontWeight:500,pointerEvents:'all',cursor:'pointer',textDecoration:'none',minHeight:'34px'},
  themeBtn:{width:'34px',height:'34px',borderRadius:'8px',background:'var(--bg2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',pointerEvents:'all'},
  card:{position:'relative',zIndex:1,background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'clamp(28px,5vw,40px) clamp(24px,4vw,36px)',width:'100%',maxWidth:'400px',boxShadow:'var(--shadow-lg)',animation:'fadeUp .45s cubic-bezier(.22,1,.36,1)'},
  logoArea:{textAlign:'center',marginBottom:'22px'},
  logoIcon:{width:'52px',height:'52px',borderRadius:'14px',background:'linear-gradient(135deg,#2563eb,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 6px 20px rgba(37,99,235,0.28)'},
  title:{fontFamily:'var(--font-head)',fontSize:'clamp(20px,3vw,24px)',fontWeight:700,color:'var(--text)',marginBottom:'5px'},
  subtitle:{color:'var(--text2)',fontSize:'13px'},
  notice:{display:'flex',alignItems:'center',gap:'7px',background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',borderRadius:'8px',padding:'9px 13px',color:'var(--text2)',fontSize:'12px',fontWeight:500,marginBottom:'22px'},
  form:{display:'flex',flexDirection:'column',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'5px'},
  label:{fontSize:'12px',fontWeight:600,color:'var(--text2)',letterSpacing:'0.2px'},
  input:{width:'100%',background:'var(--bg2)',border:'1.5px solid var(--border)',borderRadius:'9px',padding:'10px 12px 10px 36px',color:'var(--text)',fontSize:'14px',transition:'border-color .2s,box-shadow .2s'},
  submitBtn:{marginTop:'4px',padding:'12px',background:'linear-gradient(135deg,#2563eb,#6366f1)',color:'#fff',borderRadius:'10px',fontWeight:600,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:'0 4px 14px rgba(37,99,235,0.32)',transition:'opacity .2s,transform .15s',cursor:'pointer',minHeight:'46px'},
  footNote:{marginTop:'18px',textAlign:'center',color:'var(--text3)',fontSize:'11px'},
}