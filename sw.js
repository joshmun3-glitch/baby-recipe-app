const CACHE_NAME = 'baby-recipe-v2';  // 버전 업데이트: v1 → v2
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // recipes.json은 제거 - 항상 최신 데이터를 가져오기 위해
];

const EXTERNAL_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW v2] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW v2] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW v2] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW v2] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              const isOldCache = name !== CACHE_NAME;
              if (isOldCache) {
                console.log('[SW v2] Deleting old cache:', name);
              }
              return isOldCache;
            })
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        console.log('[SW v2] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - improved caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle same-origin requests
  if (url.origin === location.origin) {
    // recipes.json - ALWAYS fetch from network (Network First)
    if (url.pathname.includes('recipes.json')) {
      console.log('[SW v2] Network-first for recipes.json');
      event.respondWith(
        fetch(request)
          .then((response) => {
            console.log('[SW v2] Fetched fresh recipes.json');
            // 성공하면 캐시 업데이트 (오프라인 백업용)
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch((error) => {
            console.log('[SW v2] Network failed, trying cache for recipes.json');
            // 네트워크 실패 시에만 캐시 사용
            return caches.match(request);
          })
      );
      return;
    }

    // Other same-origin files - Cache First (for HTML, CSS, JS)
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            console.log('[SW v2] Serving from cache:', url.pathname);
            // 캐시에서 반환하면서 백그라운드에서 업데이트
            event.waitUntil(
              fetch(request)
                .then((response) => {
                  if (response.ok) {
                    caches.open(CACHE_NAME)
                      .then((cache) => cache.put(request, response));
                  }
                })
                .catch(() => {})
            );
            return cached;
          }
          
          // 캐시에 없으면 네트워크에서 가져오기
          console.log('[SW v2] Fetching from network:', url.pathname);
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Handle external resources with network-first, fallback to cache
  if (EXTERNAL_ASSETS.some(asset => request.url.startsWith(asset.split('?')[0]))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          console.log('[SW v2] External resource failed, using cache');
          return caches.match(request);
        })
    );
    return;
  }

  // Default: network only
  event.respondWith(fetch(request));
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    console.log('[SW v2] Received skipWaiting message');
    self.skipWaiting();
  }
});