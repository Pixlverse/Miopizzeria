// Google Analytics 4 helpers. Set NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXXXXX") to
// enable; without it, every call is a no-op so the site works untracked.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

const ready = () =>
  !!GA_ID && typeof window !== "undefined" && typeof window.gtag === "function";

// SPA page view — fire on each route change.
export function pageview(url) {
  if (!ready()) return;
  window.gtag("config", GA_ID, { page_path: url });
}

// Custom event helper (optional).
export function event(name, params = {}) {
  if (!ready()) return;
  window.gtag("event", name, params);
}

// Consent Mode — tie analytics to the cookie banner choice.
export function updateConsent(granted) {
  if (!ready()) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}
