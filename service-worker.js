const CACHE_NAME = "campusbuys-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles.css",
  "/script.js",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/cart.html",
  "/wishlist.html",
  "/menu.html",
  "/products.html",
  // Add any additional CSS, JS, image files your app requires
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Activate the new SW immediately
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
      ))
      .then(() => self.clients.claim()) // Control all clients immediately
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Cache hit
      }
      return fetch(event.request).catch(() => {
        // TODO: Return custom offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});
