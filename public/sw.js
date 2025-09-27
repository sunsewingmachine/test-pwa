// public/sw.js
const CACHE = 'learn-cache-v1';
const CORE = ['/', '/offline.html'];

self.addEventListener('install', (e) => {
  console.log('[SW] install');
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => {
      console.log('[SW] core cached:', CORE);
      	// alert("SW installed!"); // for learning only, alerts in SW aren’t standard
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[SW] activate');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Log all navigations (page loads)
  if (req.mode === 'navigate') {
    console.log('[SW] navigate fetch:', req.url);
    e.respondWith(
      fetch(req)
        .then(resp => {
          // update cache copy of the page
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return resp;
        })
        .catch(async () => {
          // offline: try cached page, else offline.html
          return (await caches.match(req)) || (await caches.match('/'));
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // For simple GET assets: cache-first (learning)
  if (req.method === 'GET') {
    e.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          console.log('[SW] asset from cache:', req.url);
          return cached;
        }
        return fetch(req)
          .then(resp => {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
            console.log('[SW] asset fetched+cached:', req.url);
            return resp;
          })
          .catch(() => caches.match('/offline.html'));
      })
    );
  }
});

// (optional) notify page once after install
self.addEventListener('message', (ev) => {
  if (ev.data?.type === 'PING') ev.source.postMessage({ type: 'PONG' });
});
