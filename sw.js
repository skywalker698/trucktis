const V = 'sugarlab-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.ico', './apple-touch-icon.png',
  './icons/icon-32.png', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];
const NAV_TIMEOUT = 4000; // สัญญาณอ่อน: รอเครือข่ายไม่เกิน 4 วินาที แล้วใช้แคชแทน

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)));
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const timeout = ms => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return; // ไม่แตะ script.google.com (ข้อมูลต้องสดเสมอ)

  if (r.mode === 'navigate') {
    const net = fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put('./index.html', cp)); }
      return res;
    });
    net.catch(() => {});
    e.respondWith(
      Promise.race([net, timeout(NAV_TIMEOUT)])
        .catch(() => caches.match('./index.html').then(hit => hit || net))
    );
    return;
  }

  // ไฟล์ static: ใช้แคชก่อน แล้วอัปเดตเบื้องหลัง
  e.respondWith(
    caches.match(r).then(hit => {
      const net = fetch(r)
        .then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
