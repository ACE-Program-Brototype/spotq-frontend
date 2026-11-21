import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { pwaConfig } from "./pwa.config.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function firebaseServiceWorkerPlugin(env: Record<string, string>): Plugin {
  const replaceEnv = (code: string) => {
    return code
      .replace(/%VITE_FIREBASE_API_KEY%/g, env.VITE_FIREBASE_API_KEY || "")
      .replace(/%VITE_FIREBASE_AUTH_DOMAIN%/g, env.VITE_FIREBASE_AUTH_DOMAIN || "")
      .replace(/%VITE_FIREBASE_PROJECT_ID%/g, env.VITE_FIREBASE_PROJECT_ID || "")
      .replace(/%VITE_FIREBASE_STORAGE_BUCKET%/g, env.VITE_FIREBASE_STORAGE_BUCKET || "")
      .replace(/%VITE_FIREBASE_MESSAGING_SENDER_ID%/g, env.VITE_FIREBASE_MESSAGING_SENDER_ID || "")
      .replace(/%VITE_FIREBASE_APP_ID%/g, env.VITE_FIREBASE_APP_ID || "");
  };

  return {
    name: "firebase-service-worker-env",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url === "/firebase-messaging-sw.js") {
          const swPath = path.resolve(__dirname, "public/firebase-messaging-sw.js");
          if (fs.existsSync(swPath)) {
            const raw = fs.readFileSync(swPath, "utf-8");
            res.setHeader("Content-Type", "application/javascript");
            res.end(replaceEnv(raw));
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      const distSw = path.resolve(__dirname, "dist/firebase-messaging-sw.js");
      if (fs.existsSync(distSw)) {
        const raw = fs.readFileSync(distSw, "utf-8");
        fs.writeFileSync(distSw, replaceEnv(raw), "utf-8");
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = (env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

  const serviceEndpoints = [
    {
      module: "payments",
      target: env.VITE_PAYMENT_SERVICE_URL || env.PAYMENT_SERVICE_URL || "http://localhost:3003",
    },
    {
      module: "subscribers",
      target: env.VITE_PAYMENT_SERVICE_URL || env.PAYMENT_SERVICE_URL || "http://localhost:3003",
      preservePrefix: true,
    },
    {
      module: "restaurants",
      target:
        env.VITE_RESTAURANT_SERVICE_URL || env.RESTAURANT_SERVICE_URL || "http://localhost:3001",
      customRewrite: (p: string) => {
        if (/^\/api\/v1\/restaurants(\?|$)/.test(p)) {
          return p;
        }
        return p.replace(/^\/api\/v1\/restaurants/, "");
      },
    },
    {
      module: "users",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
    },
    {
      module: "auth/admin",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
      customRewrite: (p: string) => p.replace(/^\/api\/v1\/auth\/admin/, "/admin"),
    },
    {
      module: "auth/users",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
      customRewrite: (p: string) => p.replace(/^\/api\/v1\/auth\/users/, ""),
    },
    {
      module: "auth/restaurants",
      target:
        env.VITE_RESTAURANT_SERVICE_URL || env.RESTAURANT_SERVICE_URL || "http://localhost:3001",
      customRewrite: (p: string) => p.replace(/^\/api\/v1\/auth\/restaurants/, ""),
    },
    {
      module: "admin/auth",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
      customRewrite: (p: string) => p.replace(/^\/api\/v1\/admin\/auth/, "/admin"),
    },
    {
      module: "admin",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
      preservePrefix: true,
    },
    {
      module: "orders",
      target: env.VITE_ORDER_SERVICE_URL || env.ORDER_SERVICE_URL || "http://localhost:3002",
    },
    {
      module: "queues",
      target: env.VITE_QUEUE_SERVICE_URL || env.QUEUE_SERVICE_URL || "http://localhost:3004",
    },
    {
      module: "storage",
      target:
        env.VITE_RESTAURANT_SERVICE_URL || env.RESTAURANT_SERVICE_URL || "http://localhost:3500",
      preservePrefix: true,
    },
  ];

  const proxyConfig = serviceEndpoints.reduce<
    Record<string, { target: string; changeOrigin: boolean; rewrite: (p: string) => string }>
  >((acc, { module, target, preservePrefix, customRewrite }) => {
    const route = `${apiBase}/${module}`;
    const pattern = new RegExp(`^${route}`);
    acc[route] = {
      target,
      changeOrigin: true,
      rewrite: (requestPath: string) => {
        if (customRewrite) return customRewrite(requestPath);
        return preservePrefix
          ? requestPath.replace(new RegExp(`^${apiBase}`), "")
          : requestPath.replace(pattern, "");
      },
    };
    return acc;
  }, {});

  return {
    plugins: [react(), tailwindcss(), firebaseServiceWorkerPlugin(env), VitePWA(pwaConfig)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      target: "es2022",
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/")
            ) {
              return "vendor-react";
            }
            if (
              id.includes("node_modules/recharts/") ||
              id.includes("node_modules/d3-") ||
              id.includes("node_modules/victory-vendor/")
            ) {
              return "vendor-recharts";
            }
            if (
              id.includes("node_modules/firebase/") ||
              id.includes("node_modules/@firebase/")
            ) {
              return "vendor-firebase";
            }
            if (
              id.includes("node_modules/@tanstack/") ||
              id.includes("node_modules/ky/") ||
              id.includes("node_modules/zustand/")
            ) {
              return "vendor-state";
            }
            if (
              id.includes("node_modules/@base-ui/") ||
              id.includes("node_modules/lucide-react/") ||
              id.includes("node_modules/@icons-pack/")
            ) {
              return "vendor-ui";
            }
          },
        },
      },
    },
    server: {
      proxy: proxyConfig,
    },
  };
});
