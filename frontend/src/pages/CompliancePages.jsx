// ─────────────────────────────────────────────────────────────────────────────
// compliance-pages.jsx  —  All 5 pages in one file for easy reference.
// In production, split each export into its own file under src/pages/
// ─────────────────────────────────────────────────────────────────────────────

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// Shared page shell
// ─────────────────────────────────────────────────────────────────────────────
function PageShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar onSearch={() => {}} searchValue="" activeStore="all"
        onStoreChange={() => {}} onFilterChange={() => {}} onAudienceChange={() => {}} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(24px,5vw,48px) clamp(16px,4vw,28px)' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 'clamp(24px,4vw,40px)' }}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Shared styles
const hdr = { fontFamily: 'var(--font-head)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }
const sub = { fontSize: '13px', color: 'var(--text3)', marginBottom: '32px' }
const sec = (i) => ({ marginBottom: '24px', paddingBottom: i ? '24px' : 0, borderBottom: i ? '1px solid var(--border)' : 'none' })
const sTitle = { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--text)', marginBottom: '8px' }
const sBody  = { color: 'var(--text2)', fontSize: '14px', lineHeight: 1.7 }
const updated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

// ─────────────────────────────────────────────────────────────────────────────
// 1. Privacy Policy
// ─────────────────────────────────────────────────────────────────────────────
export function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      body:  'BestDealProducts does not collect any personal information from visitors. No registration or login is required to browse products. We do not store personal data, payment details, or sensitive information.',
    },
    {
      title: '2. Affiliate Links & Commissions',
      body:  'BestDealProducts participates in affiliate programs with Amazon, Myntra, Flipkart, and AJIO. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. This helps keep the site running and free for all users.',
    },
    {
      title: '3. Cookies & Analytics',
      body:  'We may use anonymous analytics tools (e.g. Cloudflare Analytics) to understand site traffic patterns. These do not collect personally identifiable information. You can disable cookies through your browser settings at any time.',
    },
    {
      title: '4. Third-Party Websites',
      body:  'Our site contains links to third-party stores (Amazon, Myntra, Flipkart, AJIO). Once you leave BestDealProducts, their own privacy policies apply. We have no control over their content, policies, or practices.',
    },
    {
      title: '5. Data Security',
      body:  'Since we do not collect personal data, there is minimal data security risk for users. Our admin panel uses JWT authentication with token expiry to protect store management functionality.',
    },
    {
      title: '6. Children\'s Privacy',
      body:  'BestDealProducts is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has submitted personal information, please contact us immediately.',
    },
    {
      title: '7. Changes to This Policy',
      body:  'This policy may be updated periodically. Changes are reflected on this page with a new "Last Updated" date. Continued use of the site constitutes acceptance of any changes.',
    },
    {
      title: '8. Contact Us',
      body:  'For privacy questions, contact us at: privacy@bestdealproducts.in',
    },
  ]
  return (
    <PageShell>
      <h1 style={hdr}>Privacy Policy</h1>
      <p style={sub}>Last updated: {updated}</p>
      {sections.map((s, i) => (
        <div key={s.title} style={sec(i < sections.length - 1)}>
          <h2 style={sTitle}>{s.title}</h2>
          <p style={sBody}>{s.body}</p>
        </div>
      ))}
    </PageShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Terms & Conditions
// ─────────────────────────────────────────────────────────────────────────────
export function Terms() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      body:  'By accessing and using BestDealProducts ("the Site"), you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use this site.',
    },
    {
      title: '2. Purpose of the Site',
      body:  'BestDealProducts is an affiliate product discovery platform. We curate and display product deals from Amazon, Myntra, Flipkart, and AJIO. We do not sell products directly. All purchases are completed on the respective retailer\'s website. We are not responsible for transactions between you and third-party retailers.',
    },
    {
      title: '3. Affiliate Disclosure',
      body:  'BestDealProducts participates in affiliate programs. We earn a commission when you click a link and make a purchase. This commission comes from the retailer — not from you. Prices and availability are subject to change without notice.',
    },
    {
      title: '4. Accuracy of Information',
      body:  'We strive to keep product information accurate, but we make no warranties regarding the accuracy, completeness, or reliability of product descriptions, prices, images, or availability displayed on this site. Always verify details on the retailer\'s own website before purchasing.',
    },
    {
      title: '5. Intellectual Property',
      body:  'All content on BestDealProducts — including text, design, logo, and code — is the property of BestDealProducts unless otherwise stated. You may not copy, reproduce, or redistribute any content without prior written permission.',
    },
    {
      title: '6. Limitation of Liability',
      body:  'BestDealProducts shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this site or purchases made through affiliate links. Use of this site is at your own risk.',
    },
    {
      title: '7. Third-Party Links',
      body:  'Our site links to third-party retailers. We are not responsible for the content, policies, or practices of those websites. Visiting them is subject to their own Terms of Use and Privacy Policies.',
    },
    {
      title: '8. Changes to Terms',
      body:  'We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes your acceptance.',
    },
    {
      title: '9. Governing Law',
      body:  'These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.',
    },
    {
      title: '10. Contact',
      body:  'Questions about these Terms? Contact us at: legal@bestdealproducts.in',
    },
  ]
  return (
    <PageShell>
      <h1 style={hdr}>Terms & Conditions</h1>
      <p style={sub}>Last updated: {updated}</p>
      {sections.map((s, i) => (
        <div key={s.title} style={sec(i < sections.length - 1)}>
          <h2 style={sTitle}>{s.title}</h2>
          <p style={sBody}>{s.body}</p>
        </div>
      ))}
    </PageShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Affiliate Disclosure  ← REQUIRED by Amazon Associates Operating Agreement
// ─────────────────────────────────────────────────────────────────────────────
export function AffiliateDisclosure() {
  return (
    <PageShell>
      <h1 style={hdr}>Affiliate Disclosure</h1>
      <p style={sub}>Last updated: {updated}</p>

      <div style={sec(true)}>
        <h2 style={sTitle}>Our Affiliate Relationships</h2>
        <p style={sBody}>
          BestDealProducts is a participant in affiliate programs including the{' '}
          <strong>Amazon Associates Program</strong>, an affiliate advertising program
          designed to provide a means for sites to earn advertising fees by advertising
          and linking to Amazon.in and Amazon.com. We also participate in affiliate
          programs with Myntra, Flipkart, and AJIO.
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>What This Means for You</h2>
        <p style={sBody}>
          When you click on a product link on BestDealProducts and make a purchase,
          we may earn a small commission from the retailer. This commission comes
          at <strong>no extra cost to you</strong> — you pay the same price you would
          pay directly on the retailer's site. Commissions help us maintain this site
          and continue curating quality deals.
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>Our Commitment to You</h2>
        <p style={sBody}>
          Our product recommendations are based on quality and relevance — not on
          which products earn us the highest commission. We only recommend products
          that we believe provide genuine value. Affiliate relationships do not
          influence our editorial decisions.
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>Amazon Associates Disclosure</h2>
        <p style={sBody}>
          BestDealProducts is a participant in the Amazon Associates Program.
          As an Amazon Associate, we earn from qualifying purchases. Amazon, the
          Amazon logo, and other Amazon marks are trademarks of Amazon.com, Inc.
          or its affiliates. Use of these marks does not imply endorsement or
          affiliation with BestDealProducts.
        </p>
      </div>

      <div style={sec(false)}>
        <h2 style={sTitle}>Questions?</h2>
        <p style={sBody}>
          If you have any questions about our affiliate relationships or this
          disclosure, please contact us at: disclosure@bestdealproducts.in
        </p>
      </div>
    </PageShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. About Us
// ─────────────────────────────────────────────────────────────────────────────
export function About() {
  return (
    <PageShell>
      <h1 style={hdr}>About BestDealProducts</h1>
      <p style={sub}>Handpicked deals, updated regularly.</p>

      <div style={sec(true)}>
        <h2 style={sTitle}>Who We Are</h2>
        <p style={sBody}>
          BestDealProducts is a curated affiliate product discovery platform. We
          handpick deals across Beauty, Electronics, Fashion, Kitchen, Fitness, and
          more from trusted Indian retailers like Amazon, Myntra, Flipkart, and AJIO.
          Our goal is to help you find quality products at great prices without spending
          hours browsing multiple stores.
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>What We Do</h2>
        <p style={sBody}>
          We research, curate, and present affiliate product links across categories.
          Every product listed is linked directly to the retailer's website where you
          complete your purchase. We do not handle transactions, hold inventory, or
          process payments. We simply help you discover great products.
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>How We Earn</h2>
        <p style={sBody}>
          BestDealProducts earns a small affiliate commission when you purchase a
          product through our links. This is at no extra cost to you. These commissions
          help us keep the site running and free for everyone to use.
        </p>
      </div>

      <div style={sec(false)}>
        <h2 style={sTitle}>Get In Touch</h2>
        <p style={sBody}>
          We'd love to hear from you. Whether you have a product suggestion, partnership
          inquiry, or feedback on the site, reach out to us at:{' '}
          <a href="mailto:hello@bestdealproducts.in"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            hello@bestdealproducts.in
          </a>
        </p>
      </div>
    </PageShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Contact Us
// ─────────────────────────────────────────────────────────────────────────────
export function Contact() {
  return (
    <PageShell>
      <h1 style={hdr}>Contact Us</h1>
      <p style={sub}>We'd love to hear from you.</p>

      <div style={sec(true)}>
        <h2 style={sTitle}>General Enquiries</h2>
        <p style={sBody}>
          Email: <a href="mailto:hello@bestdealproducts.in"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            hello@bestdealproducts.in
          </a>
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>Affiliate & Partnership Enquiries</h2>
        <p style={sBody}>
          Email: <a href="mailto:partnerships@bestdealproducts.in"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            partnerships@bestdealproducts.in
          </a>
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>Privacy Concerns</h2>
        <p style={sBody}>
          Email: <a href="mailto:privacy@bestdealproducts.in"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            privacy@bestdealproducts.in
          </a>
        </p>
      </div>

      <div style={sec(true)}>
        <h2 style={sTitle}>Report a Problem</h2>
        <p style={sBody}>
          Found a broken link or incorrect product info? Let us know at:{' '}
          <a href="mailto:support@bestdealproducts.in"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            support@bestdealproducts.in
          </a>
        </p>
      </div>

      <div style={sec(false)}>
        <h2 style={sTitle}>Response Time</h2>
        <p style={sBody}>
          We aim to respond to all enquiries within 2–3 business days.
        </p>
      </div>
    </PageShell>
  )
}
