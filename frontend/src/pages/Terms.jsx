import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function Terms() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar onSearch={()=>{}} searchValue="" activeStore="all" onStoreChange={()=>{}}/>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'clamp(24px,5vw,48px) clamp(16px,4vw,28px)'}}>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'clamp(24px,4vw,40px)'}}>
          <h1 style={{fontFamily:'var(--font-head)',fontSize:'clamp(22px,4vw,32px)',fontWeight:800,color:'var(--text)',marginBottom:'8px'}}>
            Terms of Use
          </h1>
          <p style={{fontSize:'13px',color:'var(--text3)',marginBottom:'32px'}}>
            Last updated: {new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}
          </p>

          {[
            {
              title:'1. Acceptance of Terms',
              body:`By accessing and using DealZone ("the Site"), you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this site.`
            },
            {
              title:'2. Purpose of the Site',
              body:`DealZone is an affiliate product discovery platform. We curate and display product deals from Amazon, Myntra, Flipkart, and AJIO. We do not sell products directly. All purchases are made on the respective store's website.`
            },
            {
              title:'3. Affiliate Disclosure',
              body:`DealZone participates in affiliate programs. We earn a commission when you click a link and make a purchase. This commission comes from the retailer, not from you. Prices and availability are subject to change.`
            },
            {
              title:'4. Accuracy of Information',
              body:`We strive to display accurate product information, ratings, and availability. However, DealZone does not guarantee the accuracy, completeness, or timeliness of any product information. Always verify details on the retailer's website before purchasing.`
            },
            {
              title:'5. Intellectual Property',
              body:`Product names, images, and trademarks belong to their respective owners (Amazon, Myntra, Flipkart, AJIO, and their vendors). DealZone does not claim ownership of any product content.`
            },
            {
              title:'6. Limitation of Liability',
              body:`DealZone is not responsible for any purchase decisions, product quality, delivery, or disputes arising from purchases made through affiliate links. All such matters are solely between you and the retailer.`
            },
            {
              title:'7. External Links',
              body:`All "View Deal" links redirect to third-party retailer websites. DealZone is not responsible for the content, policies, or practices of those websites.`
            },
            {
              title:'8. Modifications',
              body:`We reserve the right to modify these Terms at any time. Continued use of the site after changes constitutes acceptance of the updated Terms.`
            },
            {
              title:'9. Governing Law',
              body:`These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.`
            },
          ].map(({title,body}) => (
            <div key={title} style={{marginBottom:'28px'}}>
              <h2 style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:700,color:'var(--text)',marginBottom:'8px'}}>{title}</h2>
              <p style={{fontSize:'14px',color:'var(--text2)',lineHeight:1.7}}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  )
}