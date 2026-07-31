const CACHE_NAME = 'cozycs-farm-v1';

// Daftar file yang akan disimpan agar bisa dibuka offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './img/logo-clear.png'
];

// Proses Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Proses Fetch (Membaca file dari cache saat offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Gunakan file dari cache
        }
        return fetch(event.request); // Ambil dari internet jika tidak ada di cache
      })
  );
});
