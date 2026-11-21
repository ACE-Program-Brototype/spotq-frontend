import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app/App";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { ensureServiceWorkerController } from "@/lib/firebase/firebase";
import "@/styles/global.css";

// Register Service Worker eagerly so it is ready and controlling the origin before user interactions
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    ensureServiceWorkerController().catch(() => {});
  });
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
