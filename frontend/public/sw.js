/* ═══════════════════════════════════════════════════════════
   DealNest Service Worker  — Cache-first with network fallback
   Version: bump this string to force all clients to update
═══════════════════════════════════════════════════════════ */

const SW_VERSION   = 'v1.0.0'
const CACHE_STATIC = `dealnest-static-${SW_VERSION}`
const CACHE_API    = `dealnest-api-${SW_VERSION}`
const CACHE_IMG    = `dealnest-images-${SW_VERSION}`

/* Assets to pre-cache on install */
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
]

/* ── Install: pre-cache shell ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

/* ── Activate: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_API && k !== CACHE_IMG)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

/* ── Fetch strategy ── */
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  /* Skip non-GET and browser-extension requests */
  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  /* 1. API calls — Network first, cache fallback (30s TTL) */
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request))
    return
  }

  /* 2. Uploaded images — Cache first, network fallback */
  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(cacheFirstImages(request))
    return
  }

  /* 3. Static assets (JS, CSS, fonts, icons) — Cache first */
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|svg|png|jpg|webp|ico)$/) ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(cacheFirstStatic(request))
    return
  }

  /* 4. HTML navigation — Network first, fallback to cached / */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstHTML(request))
    return
  }

  /* 5. Everything else — Network first */
  event.respondWith(fetch(request).catch(() => caches.match(request)))
})

/* ── Strategies ── */

async function networkFirstAPI(request) {
  const cache = await caches.open(CACHE_API)
  try {
    const response = await fetchWithTimeout(request, 8000)
    if (response.ok) {
      /* Clone and cache with timestamp header */
      const clone = response.clone()
      const body  = await clone.blob()
      const headers = new Headers(clone.headers)
      headers.set('sw-cached-at', Date.now().toString())
      cache.put(request, new Response(body, { status: clone.status, headers }))
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function cacheFirstImages(request) {
  const cache  = await caches.open(CACHE_IMG)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    return new Response('', { status: 404 })
  }
}

async function cacheFirstStatic(request) {
  const cache  = await caches.open(CACHE_STATIC)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    return new Response('', { status: 404 })
  }
}

async function networkFirstHTML(request) {
  try {
    const response = await fetchWithTimeout(request, 5000)
    const cache    = await caches.open(CACHE_STATIC)
    cache.put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request) || await caches.match('/')
    return cached || new Response('<h1>Offline</h1><p>Please check your connection.</p>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms)
    fetch(request).then(r => { clearTimeout(timer); resolve(r) }).catch(e => { clearTimeout(timer); reject(e) })
  })
}

/* ── Background sync — retry failed requests ── */
self.addEventListener('sync', event => {
  if (event.tag === 'retry-failed') {
    event.waitUntil(retryFailed())
  }
})

async function retryFailed() {
  /* Placeholder for future background sync logic */
  console.log('[SW] Background sync triggered')
}

/* ── Push notifications (future use) ── */
self.addEventListener('push', event => {
  if (!event.data) return
  const data = event.data.json()
  self.registration.showNotification(data.title || 'DealNest', {
    body:    data.body    || 'New deals available!',
    icon:    data.icon    || '/icons/icon-192x192.svg',
    badge:   data.badge   || '/icons/icon-72x72.svg',
    tag:     data.tag     || 'dealnest-notification',
    data:    data.url     || '/',
    actions: [
      { action: 'view',    title: 'View Deal' },
      { action: 'dismiss', title: 'Dismiss'   },
    ],
  })
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.action === 'view' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data || '/'))
  }
})