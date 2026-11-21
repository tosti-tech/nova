// Minimalny service worker: wymagany do instalacji; strona zawsze z sieci, a offline z kopii.
const C = 'nova-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./']))); });
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && e.request.mode === 'navigate') caches.open(C).then(c => c.put('./', r.clone()));
    return r;
  }).catch(() => caches.match(e.request.mode === 'navigate' ? './' : e.request)));
});
