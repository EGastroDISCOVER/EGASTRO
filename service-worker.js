const CACHE_NAME = 'egastro-v1.0.8';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Orbitron:wght@500;700;900&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(PRECACHE_URLS.map(url =>
        cache.add(url).catch(err => console.warn('Precache warn:', url, err))
      ))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const networkFirstHosts = ['api.open-meteo.com', 'ipapi.co', 'ipinfo.io', 'ipwho.is'];
  if (networkFirstHosts.some(h => url.hostname.includes(h))) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && (url.protocol === 'http:' || url.protocol === 'https:')) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 503 });
      });
    })
  );
});
