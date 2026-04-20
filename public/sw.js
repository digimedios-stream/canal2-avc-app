// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  // Necesario para que sea instalable, aunque no cachee nada
});
