const CACHE_NAME = 'melisa-store-v27';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      './',
      './index.html',
      './styles.css',
      './app.js',
      './daily-content.js',
      './games.js',
      './fotos/foto_139.jpeg',
      './fotos/foto_186.jpeg',
      './musica/cancion5.mp3',
      './musica/cancion6.mp3',
      './musica/cancion7.mp3'
    ]))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then(response => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(e.request, response.clone());
        return response;
      });
    }).catch(() => caches.match(e.request))
  );
});
