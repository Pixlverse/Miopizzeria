import { WHATSAPP_NUMBER } from "./constants";

/**
 * Builds a click-to-chat link, optionally with a prefilled message.
 *
 * `raw` is whatever the admin saved in Settings → Social links → whatsapp: either
 * a full wa.me/chat URL or a bare phone number. Falls back to the number in
 * constants when it's empty.
 */
export function whatsappLink(raw, message) {
  let base = (raw || "").trim() || `https://wa.me/${WHATSAPP_NUMBER}`;

  // A bare number (with optional +, spaces or dashes) becomes a wa.me link.
  if (/^\+?[\d\s()-]+$/.test(base)) {
    base = `https://wa.me/${base.replace(/\D/g, "")}`;
  }

  if (!message) return base;
  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;
}
