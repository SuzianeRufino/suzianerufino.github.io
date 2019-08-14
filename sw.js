const staticCacheName = 'pwa';

this.addEventListener('install', event=>{
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
        .then (cache => {
            return cache.addAll([
                './manifest.json',
                './index.html'
            ])
        })
    )
})

this.addEventListener('activate', event=>{
    event.waitUntil(
        caches.keys().then(cacheName => {
            return Promise.all(
                cacheName.filter(cacheName => cacheName.startsWith('pwa'))
                .filter(cacheName => cacheName != staticCacheName)
                .map(cacheName => caches.delete(cacheName))
            )
        })
    )
})

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then (response => {
            return response || fetch (event.request)
        })
        .catch(()=>{
            return caches.match('./index.html')
        })
    )
})