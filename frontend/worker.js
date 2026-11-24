// Cloudflare Worker — BestDealProducts / Picksy
// Serves the Vite build (./dist via the ASSETS binding) and handles SPA routing.

const OLD_ORIGIN = 'https://bestdealproducts.pages.dev'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 1. Try the static assets first
    let response = await env.ASSETS.fetch(request)

    // 2. SPA fallback: unknown extension-less path (e.g. /admin/login) -> app shell
    if (response.status === 404 && request.method === 'GET') {
      const last = url.pathname.split('/').pop()
      if (!last.includes('.')) {
        response = await env.ASSETS.fetch(new Request(new URL('/', url), request))
        response = new Response(response.body, { status: 200, headers: response.headers })
      }
    }

    // 3. Only touch HTML pages
    const type = response.headers.get('Content-Type') || ''
    if (!type.includes('text/html')) return response

    // Make og:url / twitter:url / canonical match the page actually being viewed
    let html = await response.text()
    html = html.split(OLD_ORIGIN).join(url.origin)

    const headers = new Headers(response.headers)
    headers.set('Content-Type', 'text/html;charset=UTF-8')
    headers.delete('Content-Length')
    headers.set('X-Frame-Options', 'DENY')
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return new Response(html, { status: response.status, headers })
  },
}