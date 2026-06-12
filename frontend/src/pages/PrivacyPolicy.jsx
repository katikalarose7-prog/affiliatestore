import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useState } from 'react'

export default function PrivacyPolicy() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar onSearch={()=>{}} searchValue="" activeStore="all" onStoreChange={()=>{}}/>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'clamp(24px,5vw,48px) clamp(16px,4vw,28px)'}}>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'clamp(24px,4vw,40px)'}}>
          <h1 style={{fontFamily:'var(--font-head)',fontSize:'clamp(22px,4vw,32px)',fontWeight:800,color:'var(--text)',marginBottom:'8px'}}>
            Privacy Policy
          </h1>
          <p style={{fontSize:'13px',color:'var(--text3)',marginBottom:'32px'}}>
            Last updated: {new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}
          </p>

          {[
            {
              title:'1. Information We Collect',
              body:`DealZone does not collect any personal information from visitors. We do not require registration or login to browse products. We do not store cookies for tracking purposes.`
            },
            {
              title:'2. Affiliate Links',
              body:`DealZone participates in affiliate programs with Amazon, Myntra, Flipkart, and AJIO. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. This helps us keep the site running and free for users.`
            },
            {
              title:'3. Third-Party Websites',
              body:`Our site contains links to third-party stores (Amazon, Myntra, Flipkart, AJIO). Once you leave DealZone and visit these sites, their own privacy policies apply. We have no control over their content or practices.`
            },
            {
              title:'4. Cookies',
              body:`DealZone uses minimal browser storage (localStorage) only to remember your preferred store tab selection across page refreshes. No tracking cookies are used. No personal data is stored.`
            },
            {
              title:'5. Images & Content',
              body:`Product images are sourced from official store CDNs (Amazon Media, Cloudinary). We do not host or own the product images displayed on this site.`
            },
            {
              title:'6. Analytics',
              body:`We may use anonymised analytics to understand general traffic patterns. No personally identifiable information is collected through analytics.`
            },
            {
              title:'7. Children\'s Privacy',
              body:`DealZone is not directed at children under 13. We do not knowingly collect any information from children.`
            },
            {
              title:'8. Changes to This Policy',
              body:`We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site constitutes acceptance of the updated policy.`
            },
            {
              title:'9. Contact',
              body:`If you have any questions about this Privacy Policy, please contact us through the Admin section of the website.`
            },
          ].map(({title,body}) => (
            <div key={title} style={{marginBottom:'28px'}}>
              <h2 style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:700,color:'var(--text)',marginBottom:'8px'}}>{title}</h2>
              <p style={{fontSize:'14px',color:'var(--text2)',lineHeight:1.7}}>{body}</p>
            </div>
          ))}

          <div style={{marginTop:'32px',padding:'16px',background:'var(--accent-bg)',border:'1px solid var(--accent-bdr)',borderRadius:'var(--r-lg)',fontSize:'13px',color:'var(--text2)'}}>
            * As an Amazon Associate and affiliate partner of Myntra, Flipkart, and AJIO, DealZone earns from qualifying purchases.
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}