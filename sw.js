self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('melisa-store-v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './styles.css',
      './app.js',
      './daily-content.js',
      './games.js',
      './nosotros.jpg'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
