
const CACHE_NAME = 'ladolcevita-cache-v1';
const ASSETS_CACHE = 'assets-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/i18n.js',
  '/js/sw.js',
  '/hero-background.png',
  '/locales/de.json',
  '/locales/en.json'
];

const imageAssets = [
  '/20250405_150053.jpg',
  '/20250414_smarties.jpg',
  '/20250405_150501.jpg',
  '/hero-background.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache)),
      caches.open(ASSETS_CACHE)
        .then(cache => cache.addAll(imageAssets))
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
