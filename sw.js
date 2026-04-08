const CACHE = 'finance-tracker-v5';
const STATIC = ['/icon-192.png', '/icon-512.png', '/manifest.json'];

// Only cache static assets — never cache index.html so updates always load fresh
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Always fetch HTML fresh from network — fall back to cache only if offline
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  // Static assets: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
