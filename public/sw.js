/* UP Studio service worker — offline shell + cached gallery images */
const VERSION = "upstudio-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const MEDIA_CACHE = `${VERSION}-media`;
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-512.png"];
const MEDIA_HOSTS = ["lh3.googleusercontent.com", "drive.google.com", "fonts.gstatic.com", "fonts.googleapis.com"];
const MEDIA_LIMIT = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      Promise.all(SHELL.map((u) => cache.add(u).catch(() => undefined))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // App shell / navigation: network first, fall back to cached index
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put("./index.html", copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  // Same-origin static files: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const net = fetch(request)
          .then((res) => {
            caches.open(SHELL_CACHE).then((c) => c.put(request, res.clone())).catch(() => undefined);
            return res;
          })
          .catch(() => cached);
        return cached || net;
      }),
    );
    return;
  }

  // Gallery images / fonts: cache first (video streams are intentionally not cached)
  if (MEDIA_HOSTS.includes(url.hostname) && request.destination !== "video") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res && (res.ok || res.type === "opaque")) {
              caches
                .open(MEDIA_CACHE)
                .then((c) => c.put(request, res.clone()))
                .then(() => trimCache(MEDIA_CACHE, MEDIA_LIMIT))
                .catch(() => undefined);
            }
            return res;
          }),
      ),
    );
  }
});
