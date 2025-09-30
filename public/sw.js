// public/sw.js
const CACHE = "learn-cache-v1";
const CORE = ["/", "/offline.html"];

self.addEventListener("install", (e) => {
	console.log("[SW] install");
	e.waitUntil(
		caches
			.open(CACHE)
			.then((c) => c.addAll(CORE))
			.then(() => {
				console.log("[SW] core cached:", CORE);
				// alert("SW installed!"); // for learning only, alerts in SW aren’t standard
			})
	);
});

self.addEventListener("activate", (e) => {
	console.log("[SW] activate");
	e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))));
	self.clients.claim();
});

self.addEventListener("fetch", (e) => {
	const req = e.request;
	// Log all navigations (page loads)
	// Cache-first for navigations (pages)
	/*
	if (e.request.mode === "navigate") {
		e.respondWith(
			(async () => {
				const cached = await caches.match(e.request);
				if (cached) return cached; // serve instantly if we have it

				try {
					const fresh = await fetch(e.request); // otherwise go to network
					const cache = await caches.open(CACHE);
					cache.put(e.request, fresh.clone()); // keep a copy for next time
					return fresh;
				} catch {
					// if no exact page cached, try '/', then offline.html
					return (await caches.match("/")) || (await caches.match("/offline.html"));
				}
			})()
		);
		return;
	}


    */

	// Cache-first for navigations (pages)
	if (e.request.mode === "navigate") {
		e.respondWith(
			(async () => {
				const cached = await caches.match(e.request);
				if (cached) return cached; // serve old HTML instantly
				const fresh = await fetch(e.request); // cache for next time
				const c = await caches.open(CACHE);
				c.put(e.request, fresh.clone());
				return fresh;
			})()
		);
		return;
	}

	// For simple GET assets: cache-first (learning)
	if (req.method === "GET") {
		e.respondWith(
			caches.match(req).then((cached) => {
				if (cached) {
					console.log("[SW] asset from cache:", req.url);
					return cached;
				}
				return fetch(req)
					.then((resp) => {
						const copy = resp.clone();
						caches.open(CACHE).then((c) => c.put(req, copy));
						console.log("[SW] asset fetched+cached:", req.url);
						return resp;
					})
					.catch(() => caches.match("/offline.html"));
			})
		);
	}
});

// (optional) notify page once after install
self.addEventListener("message", (ev) => {
	if (ev.data?.type === "PING") ev.source.postMessage({ type: "PONG" });
});
