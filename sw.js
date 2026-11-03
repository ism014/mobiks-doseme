// MOBİKS uygulama servisi (03.11.2026). Sayfalar her zaman ÖNCE internetten alınır (güncel kalsın);
// internet yoksa son kaydedilen kopya açılır. Veri (Google Apps Script) asla önbelleğe alınmaz.
const SURUM = "mobiks-v1";
const KABUK = ["./index.html", "./paket.html", "./manifest.json", "./manifest-paket.json",
  "./ikon-usta-192.png", "./ikon-paket-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // API, CDN: tarayıcıya bırak
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const k = r.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
