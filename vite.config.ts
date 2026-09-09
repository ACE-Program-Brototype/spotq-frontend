import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      module: "restaurants",
      target:
        env.VITE_RESTAURANT_SERVICE_URL || env.RESTAURANT_SERVICE_URL || "http://localhost:3001",
    },
    {
      module: "users",
      target: env.VITE_USER_SERVICE_URL || env.USER_SERVICE_URL || "http://localhost:3000",
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
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: proxyConfig,
    },
  };
});
