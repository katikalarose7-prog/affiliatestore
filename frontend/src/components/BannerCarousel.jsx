import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const INTERVAL = 5000

export default function BannerCarousel({ banners }) {
  const [idx, setIdx]         = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [dir, setDir]         = useState('next')
  const [touchX, setTouchX]   = useState(null)
  const timerRef              = useRef()
  const total                 = banners.length

  const goTo = useCallback((next, direction = 'next') => {
    if (next === idx) return
    setDir(direction)
    setAnimKey(k => k + 1)
    setIdx(next)
  }, [idx])

  const next = useCallback(() => goTo((idx + 1) % total, 'next'), [idx, total, goTo])
  const prev = useCallback(() => goTo((idx - 1 + total) % total, 'prev'), [idx, total, goTo])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    if (total > 1) timerRef.current = setInterval(next, INTERVAL)
  }, [next, total])

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current) }, [resetTimer])

  const handlePrev = () => { prev(); resetTimer() }
  const handleNext = () => { next(); resetTimer() }

  const onTouchStart = e => setTouchX(e.touches[0].clientX)
  const onTouchEnd   = e => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) { dx < 0 ? handleNext() : handlePrev() }
    setTouchX(null)
  }

  if (!total) return null
  const b = banners[idx]
  const accent = b.accentColor || '#fbbf24'

  return (
    <div style={s.wrapper} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style>{`
        @keyframes slideInRight{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:translateX(0)}}
        @keyframes floatUD{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes floatUDR{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(5deg)}}
        @keyframes ringPulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.06)}}
        @keyframes shimmerSweep{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes badgePop{0%{transform:scale(0.6);opacity:0}80%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes ctaShine{0%{left:-100%}100%{left:200%}}
        @keyframes bannerProgress{from{width:0}to{width:100%}}
        .bn-cta:hover{transform:translateY(-2px) !important;box-shadow:0 12px 32px rgba(0,0,0,0.35) !important}
        .bn-arrow:hover{background:rgba(0,0,0,0.48) !important;transform:translateY(-50%) scale(1.12) !important}
      `}</style>

      {/* Slide container */}
      <div
        key={animKey}
        style={{
          ...s.slide,
          background: `linear-gradient(135deg, ${b.bgColor||'#1e3a8a'} 0%, ${b.bgColor2||'#4338ca'} 100%)`,
          animation: `${dir==='next'?'slideInRight':'slideInLeft'} 0.42s cubic-bezier(.22,1,.36,1) forwards`,
        }}
      >
        {/* Orbs */}
        <div style={{position:'absolute',top:'-35%',right:'-10%',width:'55%',height:'230%',borderRadius:'50%',background:`${accent}12`,filter:'blur(52px)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-45%',left:'-8%',width:'42%',height:'190%',borderRadius:'50%',background:`${b.bgColor2||'#4338ca'}55`,filter:'blur(44px)',pointerEvents:'none'}}/>

        {/* Shimmer sweep */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.045) 50%,transparent 60%)',backgroundSize:'200% 100%',animation:'shimmerSweep 3.5s ease-in-out infinite'}}/>

        {/* LEFT — text */}
        <div style={s.content}>
          {b.badge && (
            <span style={{...s.badge, background:`${accent}22`, color:accent, borderColor:`${accent}44`, animation:'badgePop 0.5s cubic-bezier(.22,1,.36,1)'}}>
              {b.badge}
            </span>
          )}
          <h2 style={s.title}>{b.title}</h2>
          {b.subtitle && <p style={s.subtitle}>{b.subtitle}</p>}
          {b.ctaLink && (
            <a href={b.ctaLink} target="_blank" rel="noopener noreferrer"
              className="bn-cta"
              style={{...s.cta, background:accent, color:'#1a1200'}}>
              <span style={{position:'absolute',top:0,left:'-100%',width:'60%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)',animation:'ctaShine 2.8s ease-in-out infinite',pointerEvents:'none'}}/>
              <span style={{position:'relative',zIndex:1}}>{b.ctaText||'Shop Now'}</span>
              <ExternalLink size={12} strokeWidth={2.5} style={{position:'relative',zIndex:1}}/>
            </a>
          )}
        </div>

        {/* RIGHT — image/emoji */}
        <div style={s.imgArea}>
          {b.image ? (
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
              <div style={{position:'absolute',width:'115%',height:'115%',borderRadius:'50%',border:`1px solid ${accent}35`,animation:'ringPulse 3s ease-in-out infinite'}}/>
              <div style={{position:'absolute',width:'90%',height:'90%',borderRadius:'50%',border:`1px solid ${accent}18`,animation:'ringPulse 3s ease-in-out infinite 1s'}}/>
              <img src={b.image} alt={b.title}
                style={{...s.img, animation:'floatUD 5s ease-in-out infinite'}}/>
            </div>
          ) : (
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}>
              <div style={{...s.emojiCircle, borderColor:`${accent}35`, animation:'floatUD 4s ease-in-out infinite'}}>
                <span style={{fontSize:'clamp(38px,7vw,70px)',filter:'drop-shadow(0 6px 20px rgba(0,0,0,0.4))'}}>🛍️</span>
              </div>
              <span style={{...s.floatTag, top:'4%', right:'-6%', background:`${accent}22`, color:accent, animation:'floatUDR 5s ease-in-out infinite'}}>✨ Deal</span>
              <span style={{...s.floatTag, bottom:'6%', left:'-4%', background:'rgba(255,255,255,0.14)', color:'#fff', animation:'floatUDR 6s ease-in-out infinite 1.2s'}}>🔥 Hot</span>
            </div>
          )}
        </div>
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button className="bn-arrow" onClick={handlePrev}
            style={{...s.arrow, left:'10px'}} aria-label="Previous">
            <ChevronLeft size={16} strokeWidth={2.5}/>
          </button>
          <button className="bn-arrow" onClick={handleNext}
            style={{...s.arrow, right:'10px'}} aria-label="Next">
            <ChevronRight size={16} strokeWidth={2.5}/>
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div style={s.dots}>
          {banners.map((_,i) => (
            <button key={i}
              onClick={() => { goTo(i, i>idx?'next':'prev'); resetTimer() }}
              style={{...s.dot,
                width:      i===idx ? '22px':'7px',
                opacity:    i===idx ? 1 : 0.38,
                background: i===idx ? accent : 'rgba(255,255,255,0.75)',
              }}
              aria-label={`Slide ${i+1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {total > 1 && (
        <div style={s.progress}>
          <div key={`prog-${idx}-${animKey}`}
            style={{...s.progressFill, background:accent,
              animation:`bannerProgress ${INTERVAL}ms linear`}}/>
        </div>
      )}
    </div>
  )
}

const s = {
  wrapper:{
    position:'relative',borderRadius:'var(--radius-xl)',
    overflow:'hidden',userSelect:'none',
    boxShadow:'0 20px 64px rgba(0,0,0,0.16),0 4px 20px rgba(0,0,0,0.1)',
  },
  slide:{
    display:'flex',alignItems:'center',justifyContent:'space-between',
    minHeight:'clamp(155px,20vw,265px)',
    padding:'clamp(16px,3.5vw,40px) clamp(16px,4.5vw,50px)',
    gap:'clamp(8px,2vw,24px)',position:'relative',overflow:'hidden',
  },
  content:{
    position:'relative',zIndex:2,flex:1,
    display:'flex',flexDirection:'column',
    gap:'clamp(6px,1.2vw,12px)',minWidth:0,
  },
  badge:{
    display:'inline-flex',alignItems:'center',gap:'4px',
    padding:'3px 11px',borderRadius:'20px',
    fontSize:'clamp(9px,1vw,11px)',fontWeight:700,letterSpacing:'0.4px',
    width:'fit-content',border:'1px solid',backdropFilter:'blur(6px)',
  },
  title:{
    fontFamily:'var(--font-head)',
    fontSize:'clamp(15px,2.8vw,34px)',
    fontWeight:800,color:'#fff',lineHeight:1.1,letterSpacing:'-0.3px',
    textShadow:'0 2px 14px rgba(0,0,0,0.22)',
  },
  subtitle:{
    fontSize:'clamp(10px,1.2vw,13px)',
    color:'rgba(255,255,255,0.75)',lineHeight:1.5,
    maxWidth:'360px',
  },
  cta:{
    display:'inline-flex',alignItems:'center',gap:'5px',
    position:'relative',overflow:'hidden',
    padding:'clamp(7px,1vw,11px) clamp(12px,1.8vw,22px)',
    borderRadius:'9px',fontWeight:700,
    fontSize:'clamp(10px,1.1vw,13px)',
    width:'fit-content',
    boxShadow:'0 6px 22px rgba(0,0,0,0.28)',
    transition:'transform .2s ease, box-shadow .2s ease',
  },
  imgArea:{
    position:'relative',zIndex:2,flexShrink:0,
    width:'clamp(85px,21vw,250px)',
    height:'clamp(85px,17vw,200px)',
    display:'flex',alignItems:'center',justifyContent:'center',
  },
  img:{
    width:'100%',maxHeight:'100%',objectFit:'contain',
    filter:'drop-shadow(0 10px 26px rgba(0,0,0,0.38))',
    position:'relative',zIndex:2,
  },
  emojiCircle:{
    width:'clamp(70px,13vw,150px)',height:'clamp(70px,13vw,150px)',
    borderRadius:'50%',border:'2px solid',
    background:'rgba(255,255,255,0.08)',backdropFilter:'blur(8px)',
    display:'flex',alignItems:'center',justifyContent:'center',
  },
  floatTag:{
    position:'absolute',padding:'3px 8px',borderRadius:'20px',
    fontSize:'10px',fontWeight:700,backdropFilter:'blur(6px)',
    border:'1px solid rgba(255,255,255,0.14)',whiteSpace:'nowrap',
  },
  arrow:{
    position:'absolute',top:'50%',transform:'translateY(-50%)',
    width:'clamp(24px,3.2vw,36px)',
    height:'clamp(24px,3.2vw,36px)',
    borderRadius:'50%',
    background:'rgba(0,0,0,0.26)',
    border:'1px solid rgba(255,255,255,0.2)',
    color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
    cursor:'pointer',zIndex:5,backdropFilter:'blur(6px)',
    transition:'background .2s,transform .15s',
  },
  dots:{
    position:'absolute',
    bottom:'clamp(6px,1.5vw,12px)',
    left:'50%',transform:'translateX(-50%)',
    display:'flex',alignItems:'center',
    gap:'clamp(3px,0.8vw,5px)',
    zIndex:5,
  },
  dot:{
    height:'clamp(4px,1vw,7px)',
    borderRadius:'4px',border:'none',
    cursor:'pointer',padding:0,
    transition:'width .3s ease,opacity .3s ease,background .3s ease',
  },
  progress:{
    position:'absolute',bottom:0,left:0,right:0,
    height:'clamp(2px,0.5vw,3px)',
    background:'rgba(255,255,255,0.14)',zIndex:5,
  },
  progressFill:{height:'100%',borderRadius:'2px'},
}