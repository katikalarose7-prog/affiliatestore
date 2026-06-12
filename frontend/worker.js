// Cloudflare Worker — BestDealProducts Store
// FIX: Renamed all PrimeOffers references to BestDealProducts

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // FIX: Updated SITE_URL — replace with your actual Cloudflare Pages domain
    const SITE_URL   = "https://bestdealproducts.pages.dev"
    const OG_IMAGE   = "https://bestdealproducts.pages.dev/og-image.png"
    // FIX: Renamed site name
    const SITE_NAME  = "BestDealProducts"
    // FIX: Renamed title — removed "Prime" branding
    const SITE_TITLE = "BestDealProducts — Handpicked Deals from Amazon, Myntra, Flipkart & AJIO"

    // For API requests, pass through
    if (url.pathname.startsWith('/api/')) {
      return fetch(request)
    }

    // For HTML page requests — inject OG tags
    if (request.headers.get('Accept')?.includes('text/html')) {
      const response = await fetch(request)

      if (!response.ok) return response

      let html = await response.text()

      // Inject dynamic OG tags
      const ogTags = `
    <meta property="og:type"         content="website" />
    <meta property="og:url"          content="${SITE_URL}${url.pathname}" />
    <meta property="og:site_name"    content="${SITE_NAME}" />
    <meta property="og:title"        content="${SITE_TITLE}" />
    <meta property="og:description"  content="Discover curated affiliate products across Beauty, Electronics, Fashion and more." />
    <meta property="og:image"        content="${OG_IMAGE}" />
    <meta property="og:image:width"  content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale"       content="en_IN" />
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:url"         content="${SITE_URL}${url.pathname}" />
    <meta name="twitter:title"       content="${SITE_TITLE}" />
    <meta name="twitter:description" content="Discover curated affiliate products across Beauty, Electronics, Fashion and more." />
    <meta name="twitter:image"       content="${OG_IMAGE}" />
    <!-- FIX: Removed @primeoffers twitter handle — update with your actual handle -->
`

      html = html.replace('</head>', `${ogTags}</head>`)

      return new Response(html, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          // FIX: Updated connect-src to bestdealproducts backend URL
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://res.cloudinary.com *",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://bestdealproducts.up.railway.app https://res.cloudinary.com",
            "frame-src 'none'",
            "object-src 'none'",
          ].join('; '),
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      })
    }

    return fetch(request)
  }
}

// ── Fallback HTML (used when Cloudflare can't fetch the page) ──────
// FIX: Renamed from "Loading PrimeOffers Store…"
const FALLBACK_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>BestDealProducts</title>
</head>
<body><p>Loading BestDealProducts…</p></body>
</html>`
