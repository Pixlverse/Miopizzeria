import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiArrowUpRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { DELIVERY_PLATFORMS } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";
import { useSettings } from "@/hooks/useSettings";
import { event as gaEvent } from "@/utils/gtag";
import { whatsappLink } from "@/utils/whatsapp";

/**
 * Hands the guest off to a delivery app. Ordering happens on the platforms, so
 * there is no cart and no dish detail here — just the four apps. `item` is used
 * only to attribute the analytics event.
 *
 * Rendered through a portal — the menu cards use hover/entry transforms, and a
 * `position: fixed` overlay inside a transformed ancestor would anchor to the
 * card instead of the viewport.
 */
export default function OrderModal({ item, open, onClose }) {
  const { t } = useI18n();
  const settings = useSettings();
  const closeRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Escape to close + lock background scrolling while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const platforms = DELIVERY_PLATFORMS.map((p) => ({
    ...p,
    href: settings?.deliveryPlatforms?.[p.id] || p.url,
  }));

  // Prefill the chat with the dish they tapped, so staff know what's being collected.
  const pickupHref = whatsappLink(
    settings?.socialLinks?.whatsapp,
    item?.name ? `${t("pickup.messageItem")} ${item.name}` : t("pickup.message")
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-8 w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white p-6 text-center shadow-2xl sm:p-8"
          >
            <button
              type="button"
              ref={closeRef}
              onClick={onClose}
              aria-label={t("orderModal.close")}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-rust/5 text-rust transition-colors hover:bg-rust/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rust rtl:left-4 rtl:right-auto"
            >
              <FiX size={18} />
            </button>

            <p className="font-display text-xl italic text-rust-light">
              {t("orderModal.eyebrow")}
            </p>
            <h2 id="order-modal-title" className="mt-1 text-xl font-semibold text-ink">
              {t("orderModal.title")}
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{t("orderModal.lead")}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {platforms.map((p) => (
                <a
                  key={p.id}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    gaEvent("order_intent", {
                      item_name: item?.name,
                      platform: p.name,
                      value: item?.price,
                    })
                  }
                  aria-label={`${t("orderModal.orderVia")} ${p.name}`}
                  className="group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rust"
                >
                  {/* Brand glow on hover */}
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: p.color }}
                    className="pointer-events-none absolute inset-x-5 -bottom-4 h-12 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                  />
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={p.logo}
                      alt={`${p.name} logo`}
                      fill
                      sizes="64px"
                      style={{ transform: `scale(${p.zoom || 1})` }}
                      className="object-cover"
                    />
                  </span>
                  <span className="relative flex items-center gap-1 text-sm font-semibold text-ink">
                    {p.name}
                    <FiArrowUpRight
                      size={13}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-[-90deg]"
                      style={{ color: p.color }}
                    />
                  </span>
                </a>
              ))}

              {/* Collect in person — WhatsApp instead of a delivery app. */}
              <a
                href={pickupHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  gaEvent("order_intent", {
                    item_name: item?.name,
                    platform: "Pickup (WhatsApp)",
                    value: item?.price,
                  })
                }
                aria-label={t("pickup.label")}
                className="group relative col-span-2 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white p-3.5 shadow-md ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rust"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-10 -bottom-4 h-12 rounded-full bg-[#25D366] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                />
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
                  <FaWhatsapp size={22} />
                </span>
                <span className="relative flex flex-col items-start">
                  <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                    {t("pickup.label")}
                    <FiArrowUpRight
                      size={13}
                      className="-translate-x-1 text-[#25D366] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-[-90deg]"
                    />
                  </span>
                  <span className="text-[11px] text-muted">{t("pickup.sub")}</span>
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
