importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: 1 },
    { url: '/nav.html', revision: 1 },
    { url: '/css/style.css', revision: 1 },
    { url: '/css/materialize.min.css', revision: 1 },
    { url: '/dist/CLM.bundle.js', revision: 1 },
    { url: '/icon/icon-192.png', revision: 1 },
    { url: '/icon/icon-256.png', revision: 1 },
    { url: '/icon/icon-512.png', revision: 1 },
    { url: '/src/cl.png', revision: 1 },
    { url: '/src/crest.png', revision: 1 },
    { url: '/src/no-internet.png', revision: 1 },
    { url: '/src/spinner.svg', revision: 1 },
    { url: '/apple_icon.png', revision: 1 },
    { url: '/favicon.svg', revision: 1 },
    { url: '/manifest.json', revision: 1 }
]);

workbox.routing.registerRoute(
    new RegExp('/page/'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'page'
    })
)

workbox.routing.registerRoute(
    /^https:\/\/cdnjs\.cloudflare\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'fontawesome',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2\//,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'football-api',
    })
);

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