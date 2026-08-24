// Kill-switch service worker: removes any previously-installed SW + caches, then reloads clients from network.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    try { var ks = await caches.keys(); await Promise.all(ks.map(function (k) { return caches.delete(k); })); } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    try { var cs = await self.clients.matchAll(); cs.forEach(function (c) { c.navigate(c.url); }); } catch (_) {}
  })());
});
self.addEventListener('fetch', function () { /* pass-through: do not intercept */ });
