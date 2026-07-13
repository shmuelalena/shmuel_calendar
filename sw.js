const CACHE_NAME = 'shmuel-calendar-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/setup-guide.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Shmuel Calendar', body: 'אירוע חדש מתקרב' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: data.url || '/'
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || '/'));
});
// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // External API calls stay network-only.
  if (url.origin !== self.location.origin ||
      url.hostname.includes('anthropic.com') ||
      url.hostname.includes('googleapis.com')) {
    return;
  }

  // Navigation requests: network-first with offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (_e) {
        return (await caches.match(req)) || (await caches.match('/index.html'));
      }
    })());
    return;
  }

  // Static assets: cache-first with background refresh.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const networkPromise = fetch(req)
      .then(async res => {
        if (res && res.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
        }
        return res;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(networkPromise);
      return cached;
    }

    const net = await networkPromise;
    if (net) return net;

    return caches.match('/index.html');
  })());
});
