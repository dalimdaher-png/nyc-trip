/* Service worker de NYC Trip 2026.
   - Archivos de la app: primero la red (así siempre ves la última versión)
     y, si no hay conexión, la copia guardada.
   - Tipografía de Google: se guarda para que funcione sin conexión.
   - Pronóstico del clima: siempre de la red (la app guarda su propia copia). */

const CACHE_NAME = 'nyc-trip-v10';
const CORE = [
  './',
  './index.html',
  './styles.css?v=10',
  './icons.js?v=10',
  './app.js?v=10',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './ny.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          if (request.mode === 'navigate') {
            const shell = await caches.match('./index.html');
            if (shell) return shell;
          }
          return Response.error();
        })
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached || Response.error());
        return cached || network;
      })
    );
  }
});
