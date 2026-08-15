import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app/App";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import "@/styles/global.css";

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
