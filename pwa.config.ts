import type { VitePWAOptions } from "vite-plugin-pwa";

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["apple-touch-icon.png", "icons.svg"],
  manifest: {
    name: "spotQ",
    short_name: "spotQ",
    description: "Smart Restaurant Queue & Order Management",
    theme_color: "#ff6b00",
    background_color: "#000000",
    display: "standalone",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  workbox: {
    importScripts: ["/firebase-messaging-sw.js"],
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  },
};
