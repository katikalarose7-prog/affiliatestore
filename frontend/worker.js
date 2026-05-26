// worker.js
// 1. Injects OG meta tags for social crawlers (LinkedIn, WhatsApp etc.)
// 2. Caches /api/products GET requests at Cloudflare edge for 60 seconds
//    — this means even if Railway is slow, Cloudflare serves cached data instantly

const SITE_URL  = "https://affiliatestore.primeoffers.workers.dev"
const OG_IMAGE  = "https://affiliatestore.primeoffers.workers.dev/og-image.png"
const SITE_NAME = "PrimeOffers Store"
const SITE_DESC = "Discover handpicked Amazon affiliate deals on Beauty, Electronics, Fashion, Kitchen, Fitness and more."
const SITE_TITLE= "PrimeOffers Store — Handpicked Amazon Deals"

const BOT_AGENTS = [
  'linkedinbot','twitterbot','facebookexternalhit',
  'whatsapp','telegrambot','slackbot','discordbot',
  'googlebot','bingbot','applebot','pinterest'
]

function isCrawler(ua) {
  if (!ua) return false
  const u = ua.toLowerCase()
  return BOT_AGENTS.some(b => u.includes(b))
}

class MetaInjector {
  constructor(url) { this.url = url }
  element(el) {
    el.prepend(`
    <meta property="og:type"         content="website"/>
    <meta property="og:url"          content="${this.url}"/>
    <meta property="og:site_name"    content="${SITE_NAME}"/>
    <meta property="og:title"        content="${SITE_TITLE}"/>
    <meta property="og:description"  content="${SITE_DESC}"/>
    <meta property="og:image"        content="${OG_IMAGE}"/>
    <meta property="og:image:width"  content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:image:type"   content="image/png"/>
    <meta name="twitter:card"        content="summary_large_image"/>
    <meta name="twitter:title"       content="${SITE_TITLE}"/>
    <meta name="twitter:description" content="${SITE_DESC}"/>
    <meta name="twitter:image"       content="${OG_IMAGE}"/>
    <meta name="description"         content="${SITE_DESC}"/>
    `, { html: true })
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const ua  = request.headers.get('User-Agent') || ''

    // ── 1. Social crawler: inject OG tags ──────────────────────────
    if (isCrawler(ua) && (url.pathname === '/' || !url.pathname.includes('.'))) {
      try {
        const assetReq = new Request(new URL('/', request.url).toString(), request)
        const response = await env.ASSETS.fetch(assetReq)
        return new HTMLRewriter()
          .on('head', new MetaInjector(request.url))
          .transform(response)
      } catch {
        return new Response(`<!DOCTYPE html><html><head>
          <title>${SITE_TITLE}</title>
          <meta property="og:title"       content="${SITE_TITLE}"/>
          <meta property="og:description" content="${SITE_DESC}"/>
          <meta property="og:image"       content="${OG_IMAGE}"/>
          <meta property="og:image:type"  content="image/png"/>
          <meta name="twitter:card"       content="summary_large_image"/>
          <meta name="twitter:image"      content="${OG_IMAGE}"/>
        </head><body></body></html>`,
        { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })
      }
    }

    // ── 2. Serve static assets normally ────────────────────────────
    return env.ASSETS.fetch(request)
  }
}