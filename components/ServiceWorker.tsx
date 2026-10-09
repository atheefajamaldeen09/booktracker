"use client";

import { useEffect } from "react";

// Registers public/sw.js in production builds. It's skipped in development,
// where cached scripts would get in the way of hot reloading.
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // Not critical: the app works the same without it, just not offline
    });
  }, []);
  return null;
}
