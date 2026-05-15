export default function StarRating({ rating, size = 14 }) {
  return (
    <span style={{ display:'flex', alignItems:'center', gap:'2px' }}>
      {[1,2,3,4,5].map(i => {
        const filled = i <= Math.floor(rating)
        const half   = !filled && (i - 0.5) <= rating
        const id     = `sg${i}${String(rating).replace('.','')}`
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>
            <defs>
              <linearGradient id={id} x1="0" x2="1">
                <stop offset="50%" stopColor="#f59e0b"/>
                <stop offset="50%" stopColor="var(--bg3)"/>
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={filled ? '#f59e0b' : half ? `url(#${id})` : 'var(--bg3)'}
              stroke={filled || half ? '#d97706' : 'var(--border2)'}
              strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        )
      })}
      <span style={{ marginLeft:'4px', fontSize:'11px', color:'var(--text3)', fontWeight:500 }}>
        {Number(rating).toFixed(1)}
      </span>
    </span>
  )
}