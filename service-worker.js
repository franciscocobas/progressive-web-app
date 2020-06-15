const cacheName = 'wpa-sw-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.webmanifest',
  '/images/pwa-192.png',
  '/images/pwa-512.png'
]

self.addEventListener('install', event => {
  console.log('installed successfully');
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request.url).then( response => {
      return response || event.request.url;
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhiteList = ['wpa-sw-cache-v1'];
  event.waitUntil(
    caches.keys().then( cacheNames => {
      return Promise.all(
        cacheNames.map( cacheName => {
          if (cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

