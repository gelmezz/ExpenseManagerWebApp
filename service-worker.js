const CACHE_NAME = 'expense-manager-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Per index.html e script.js, vai sempre alla rete per garantire il controllo login
    if (url.pathname === '/index.html' || url.pathname === '/script.js' || url.pathname === '/') {
        event.respondWith(fetch(event.request));
    } else {
        // Per gli altri asset, usa la strategia cache-first
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});
