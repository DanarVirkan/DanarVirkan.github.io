importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

// workbox.routing.registerRoute(
//     /\.(?:png|gif|jpg|jpeg|svg)$/,
//     new workbox.strategies.CacheFirst({
//         cacheName: 'img',
//         plugins: [
//             new workbox.expiration.ExpirationPlugin({
//                 maxEntries: 100,
//                 maxAgeSeconds: 4 * 30 * 24 * 60 * 60,
//             }),
//         ],
//     }),
// );

workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: 1 },
    { url: '/nav.html', revision: 1 },
    { url: '/css/style.css', revision: 1 },
    { url: '/css/materialize.min.css', revision: 1 },
    { url: '/dist/CLM.bundle.js', revision: 1 }
]);

workbox.routing.registerRoute(
    new RegExp('/page/'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'page'
    })
)

const CACHE_NAME = 'CLMv1.0';
const url_cache = [
    "/",
    "/index.html",
    "/nav.html",
    "/css/style.css",
    "/css/materialize.min.css",
    "/icon/icon-192.png",
    "/icon/icon-256.png",
    "/icon/icon-512.png",
    "/dist/CLM.bundle.js",
    "/page/home.html",
    "/page/matches.html",
    "/page/standings.html",
    "/page/favourites.html",
    "/page/about.html",
    "/src/cl.png",
    "/src/crest.png",
    "/src/no-internet.png",
    "/src/spinner.svg",
    "/apple_icon.png",
    "/favicon.svg",
    "/manifest.json",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/webfonts/fa-solid-900.woff2",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/webfonts/fa-regular-400.woff",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/webfonts/fa-regular-400.woff2"
];

self.addEventListener('fetch', function(event) {
    let base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(res) {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { cacheName: CACHE_NAME }).then(function(res) {
                if (res) {
                    console.log("Menggunakan Asset dari cache: " + res.url);
                    return res
                }

                console.log("Menggunakan Asset dari server: " + event.request.url);
                return fetch(event.request);
            })
        );
    }
});


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            cache.addAll(url_cache);
        })
    );
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log('cache: ' + cacheName + ' Dihapus !');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});