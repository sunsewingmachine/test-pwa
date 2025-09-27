"use client";
import { useEffect } from "react";

export default function SwMount() {
	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;

		navigator.serviceWorker.register("/sw.js").then((reg) => {
			console.log("[PAGE] SW registered:", reg.scope);

			if (reg.installing) console.log("[PAGE] installing…");
			if (reg.waiting) console.log("[PAGE] installed (waiting)…");
			if (reg.active) console.log("[PAGE] active");

			reg.addEventListener("updatefound", () => {
				const nw = reg.installing;
				nw?.addEventListener("statechange", () => {
					console.log("[PAGE] state:", nw.state);
				});
			});

			navigator.serviceWorker.addEventListener("message", (e) => {
				console.log("[PAGE] message from SW:", e.data);
			});
			reg.active?.postMessage({ type: "PING" });
		});
	}, []);
	return null;
}
