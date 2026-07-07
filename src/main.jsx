import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// PWA servis çalışanını kaydet (çevrimdışı çalışma için)
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

// Verilerin (harcamalar + fişler) silinmemesi için kalıcı depolama iste
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
