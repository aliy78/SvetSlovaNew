const CACHE_NAME = 'svetslova-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/read.html',
  '/css/style.css',
  '/manifest.json',
  '/data/bible.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Установка и кэширование
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация — удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
