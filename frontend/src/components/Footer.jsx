import { ShoppingBag, ExternalLink } from 'lucide-react'

// FIX: Rebranded to BestDealProducts throughout
export default function Footer() {
  const year = new Date().getFullYear()

  const stores = [
    { name:'Amazon',   href:'https://www.amazon.in?&linkCode=ll2&tag=picksystore03-21&linkId=962f5eec78150f5c995a7b70f87525d2&ref_=as_li_ss_tl',    icon:'📦' },
    { name:'Myntra',   href:'https://myntr.it/xKiyFgt',   icon:'👗' },
    { name:'Flipkart', href:'https://fktr.in/id2dasV',    icon:'🛒' },
    { name:'AJIO',     href:'https://ajiio.in/JFcuxqI',   icon:'✨' },
  ]

  const quickLinks = [
    { label:'All Products',    href:'/' },
    { label:'Featured Deals',  href:'/?featured=true' },
    { label:'Amazon Deals',    href:'/?store=amazon' },
    { label:'Myntra Picks',    href:'/?store=myntra' },
    { label:'Flipkart Deals',  href:'/?store=flipkart' },
    { label:'AJIO Fashion',    href:'/?store=ajio' },
  ]

  const legalLinks = [
    { label:'Privacy Policy',      href:'/privacy-policy' },
    { label:'Terms of Use',        href:'/terms' },
    { label:'Affiliate Disclosure',href:'/affiliate-disclosure' },
    { label:'About Us',            href:'/about' },
    { label:'Contact Us',          href:'/contact' },
  ]

  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <div className="footer-logo-row">
            <div className="footer-logo-icon">
              <ShoppingBag size={14} color="#fff" strokeWidth={2.5}/>
            </div>
            {/* FIX: Renamed from BestDeals Store */}
            <span className="footer-logo-text">
              BestDeal<span>Products</span>
            </span>
          </div>
          {/* FIX: Generic tagline — no "Prime" branding */}
          <p className="footer-tagline">
            Your go-to destination for handpicked affiliate deals from Amazon, Myntra, Flipkart & AJIO.
          </p>
          {/* COMPLIANCE: Proper affiliate disclosure required by Amazon Associates & FTC */}
          <p className="footer-disclaimer">
            * As an affiliate partner, we earn from qualifying purchases made through our links.
            Product prices and availability are subject to change without notice.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <div className="footer-col-title">Quick Links</div>
          {quickLinks.map(l => (
            <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
          ))}
        </div>

        {/* Stores */}
        <div>
          <div className="footer-col-title">Partner Stores</div>
          {stores.map(st => (
            <a key={st.name} href={st.href}
              target="_blank" rel="noopener noreferrer"
              className="footer-store-link">
              <span style={{fontSize:'14px'}}>{st.icon}</span>
              {st.name}
              <ExternalLink size={10} style={{marginLeft:'auto',opacity:.45}}/>
            </a>
          ))}
        </div>

        {/* Legal + Admin */}
        <div>
          <div className="footer-col-title">Admin</div>
          <a href="/admin/login" className="footer-admin-link">
            🔐 Admin Login
          </a>

          <div className="footer-col-title" style={{marginTop:'16px'}}>Legal</div>
          {legalLinks.map(l => (
            <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
          ))}
        </div>

      </div>

      <div className="footer-bottom">
        {/* FIX: Renamed from BestDeals Store / PrimeOffers */}
        <span>© {year} BestDealProducts. All rights reserved.</span>
        <span style={{opacity:.5}}>Built with ❤️ for smart shoppers</span>
      </div>
    </footer>
  )
}
