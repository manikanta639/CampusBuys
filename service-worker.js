self.addEventListener("install", event => {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open("shophub-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./icon-192x192.png",
        "./icon-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
