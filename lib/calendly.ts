"use client";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/jose-robotice/robotice-exploration-of-opportunities";

export function openCalendly() {
  // Intenta abrir si ya está cargado
  if (typeof window !== "undefined" && window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return;
  }
  // Carga diferida del script, luego abre
  const existing = document.querySelector<HTMLScriptElement>('script[src*="assets.calendly.com/assets/external/widget.js"]');
  if (existing) {
    existing.addEventListener("load", () => window.Calendly?.initPopupWidget?.({ url: CALENDLY_URL }), { once: true });
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://assets.calendly.com/assets/external/widget.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.async = true;
  script.type = "text/javascript";
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.onload = () => window.Calendly?.initPopupWidget?.({ url: CALENDLY_URL });
  document.body.appendChild(script);
}
