"use client";
import { useEffect } from "react";

export default function VersionBadge() {
	useEffect(() => {
		console.log("Version: v1");
	}, []);
	return <small id="id-version-badge">v2b</small>;
}
