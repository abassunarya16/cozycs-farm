const CACHE_NAME = 'cozycs-farm-v2';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './img/logo-clear.png'
];

// Install & Paksa Langsung Aktif
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Hapus Cache Lama yang Bikin Macet
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Strategi: Ambil dari Internet dulu, kalau gagal (offline) baru pakai Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
