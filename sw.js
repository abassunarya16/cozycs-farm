// Cozycs Farm V1.0 - Service Worker
const CACHE_NAME = 'cozycs-farm-v1.0-cache';
const DYNAMIC_CACHE = 'cozycs-farm-v1.0-dynamic';

// Resources to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/css/dashboard.css',
    '/css/form.css',
    '/css/table.css',
    '/css/modal.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/router.js',
    '/js/storage.js',
    '/js/helper.js',
    '/js/notification.js',
    '/js/chart.js',
    '/js/dashboard.js',
    '/js/greenhouse.js',
    '/js/tanaman.js',
    '/js/polinasi.js',
    '/js/buah.js',
    '/js/nutrisi.js',
    '/js/pruning.js',
    '/js/hama.js',
    '/js/spray.js',
    '/js/jadwal.js',
    '/js/panen.js',
    '/js/laporan.js',
    '/js/gudang.js',
    '/js/keuangan.js',
    '/js/setting.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker v1.0...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker v1.0...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch Event - NETWORK FIRST STRATEGY (Anti Nyangkut)
self.addEventListener('fetch', event => {
    // Abaikan selain GET request
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        // 1. COBA AMBIL DARI INTERNET DULU (Biar selalu update)
        fetch(event.request)
            .then(response => {
                // Simpan versi terbarunya ke cache diam-diam
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // 2. KALAU OFFLINE/TIDAK ADA SINYAL, BARU PAKAI CACHE LAMA
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Fallback offline
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
