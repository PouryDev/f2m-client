const CACHE_NAME = 'f2m-shell-v2';
const SHELL_FILES = ['/', '/manifest.webmanifest', '/favicon.ico'];

const isHttpRequest = (request) => request.url.startsWith('http');
const isApiRequest = (request) => {
  try {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/');
  } catch {
    return false;
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => new Response(null, { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request)
          .then((response) => {
            if (response && response.status === 200 && isHttpRequest(request)) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && isHttpRequest(request)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match('/'));
    })
  );
});
