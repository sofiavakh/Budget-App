const CACHE = 'finance-tracker-v6';
const ASSETS = [
  '/Budget-App/',
  '/Budget-App/index.html',
  '/Budget-App/manifest.json',
  '/Budget-App/icon-192.png',
  '/Budget-App/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
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
  // Always fetch HTML fresh — fall back to cache only if offline
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/Budget-App/index.html'))
    );
    return;
  }
  // Static assets: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
