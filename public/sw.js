// public/sw.js
// Versión: 1.0.1 (Actualizar este número fuerza la recarga en los clientes)
const SW_VERSION = '1.0.1';

self.addEventListener('install', (event) => {
  // Fuerza al Service Worker a instalarse de inmediato sin esperar a que se cierren las pestañas
  self.skipWaiting();
  console.log('Service Worker instalado, versión:', SW_VERSION);
});

self.addEventListener('activate', (event) => {
  // Reclama el control de las pestañas abiertas inmediatamente
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Necesario para que sea instalable. No cacheamos agresivamente
  // para que el navegador siempre solicite la última versión de la web.
});
