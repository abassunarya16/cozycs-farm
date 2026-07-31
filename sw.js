var CACHE_NAME = 'cozycs-farm-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/dashboard.css',
    '/js/app.js',
    '/js/storage.js',
    '/js/router.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});