import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// PWA: register service worker (relative path so it works at root, under a sub-path on GitHub Pages,
// and inside the Capacitor WebView). Skipped on file:// and when unsupported.
if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* offline support unavailable — app keeps working online */
    });
  });
}
