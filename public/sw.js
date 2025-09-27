// public/sw.js

self.addEventListener("install", () => {
	console.log("SW: Installed");

	// alert("SW installed old 7209d!"); // for learning only, alerts in SW aren’t standard
});

self.addEventListener("activate", () => {
	console.log("SW: Activated");
});

self.addEventListener("fetch", (event) => {
	console.log("SW: Fetching", event.request.url);
});
