import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiCheck, FiMapPin, FiX } from "react-icons/fi";
import { SHOPS } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

// Background colour baked into the line drawings, so each card's body runs
// seamlessly on from its illustration.
const DRAWING_BG = "#A54A35";

// How long the "picked" state plays before the modal hands the choice back.
const PICK_DELAY_MS = 520;

/**
 * Asks which shop the guest is ordering from before the menu is shown — each
 * shop has its own menu. `onClose` is optional: on the first visit there's no
 * menu to fall back to, so the guest must pick; when switching shops it lets
 * them keep the current one.
 *
 * Rendered through a portal for the same reason as OrderModal: a fixed overlay
 * inside a transformed ancestor would anchor to that ancestor.
 */
export default function ShopPicker({ open, current, onSelect, onClose }) {
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState(null);
  const cardRefs = useRef([]);
  const timer = useRef(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Reset the picked state each time the picker reopens.
  useEffect(() => {
    if (open) setPicked(null);
  }, [open]);

  // Escape to close (when allowed) + lock background scrolling while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    // Land focus on the current shop (or the first) so Enter picks right away.
    const start = Math.max(0, SHOPS.findIndex((s) => s.id === current));
    const f = setTimeout(() => cardRefs.current[start]?.focus({ preventScroll: true }), 60);
    return () => {
      clearTimeout(f);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, current]);

  const pick = (id) => {
    if (picked) return;
    setPicked(id);
    timer.current = setTimeout(() => onSelect(id), PICK_DELAY_MS);
  };

  // Arrow keys move between the cards (either axis — they stack on mobile).
  const onCardKey = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (i + step + SHOPS.length) % SHOPS.length;
    cardRefs.current[next]?.focus();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose || undefined}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-md sm:items-center"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-picker-title"
            aria-describedby="shop-picker-lead"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-6 w-full max-w-3xl overflow-hidden rounded-[2rem] bg-[#FDF5ED] p-5 text-center shadow-2xl sm:p-8"
          >
            {/* Soft dotted texture, as on the menu page */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage: "radial-gradient(rgba(171,76,53,0.12) 1.4px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
            />

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={t("shopPicker.close")}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-rust/5 text-rust transition-colors hover:bg-rust/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rust rtl:left-4 rtl:right-auto"
              >
                <FiX size={18} />
              </button>
            )}

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-display text-xl italic text-rust-light sm:text-2xl"
              >
                {t("shopPicker.eyebrow")}
              </motion.p>
              <motion.h2
                id="shop-picker-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4 }}
                className="mt-1 text-2xl font-semibold text-ink sm:text-3xl"
              >
                {t("shopPicker.title")}
              </motion.h2>
              <motion.p
                id="shop-picker-lead"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="mx-auto mt-2 max-w-md text-sm text-muted sm:text-base"
              >
                {t("shopPicker.lead")}
              </motion.p>

              <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5" style={{ perspective: 1200 }}>
                {SHOPS.map((shop, i) => (
                  <ShopCard
                    key={shop.id}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    shop={shop}
                    index={i}
                    isAr={locale === "ar"}
                    isCurrent={current === shop.id}
                    state={!picked ? "idle" : picked === shop.id ? "picked" : "dimmed"}
                    ctaLabel={t("shopPicker.cta")}
                    onPick={() => pick(shop.id)}
                    onKeyDown={(e) => onCardKey(e, i)}
                  />
                ))}
              </div>

              <p className="mt-5 text-xs font-medium text-muted">{t("shopPicker.hint")}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const ShopCard = forwardRef(function ShopCard({
  shop,
  index,
  isAr,
  isCurrent,
  state,
  ctaLabel,
  onPick,
  onKeyDown,
}, ref) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  // Pointer position over the card, 0..1 on each axis (0.5 = centre).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], reduce ? [0, 0] : [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], reduce ? [0, 0] : [-9, 9]), spring);
  // The drawing drifts against the tilt for a little depth.
  const imgX = useSpring(useTransform(px, [0, 1], reduce ? [0, 0] : [10, -10]), spring);
  const imgY = useSpring(useTransform(py, [0, 1], reduce ? [0, 0] : [6, -6]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(254,220,189,0.22), transparent 55%)`;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    setHover(false);
    px.set(0.5);
    py.set(0.5);
  };

  const name = isAr ? shop.nameAr : shop.name;
  const kind = isAr ? shop.kindAr : shop.kind;
  const active = hover || state === "picked";

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onPick}
      onKeyDown={onKeyDown}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={onLeave}
      onFocus={() => setHover(true)}
      onBlur={onLeave}
      disabled={state !== "idle"}
      aria-label={name}
      aria-current={isCurrent || undefined}
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: state === "dimmed" ? 0.35 : 1,
        y: 0,
        scale: state === "picked" ? 1.03 : state === "dimmed" ? 0.96 : 1,
        filter: state === "dimmed" ? "grayscale(0.6)" : "grayscale(0)",
      }}
      transition={{ delay: state === "idle" ? 0.25 + index * 0.1 : 0, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileTap={state === "idle" ? { scale: 0.98 } : undefined}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", backgroundColor: DRAWING_BG }}
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl text-start shadow-lg outline-none transition-shadow duration-300 hover:shadow-card-hover focus-visible:ring-4 focus-visible:ring-rust/40 disabled:cursor-default ${
        state === "picked" ? "ring-4 ring-rust" : ""
      }`}
    >
      {/* Drawing */}
      <div className="relative aspect-[2/1] w-full overflow-hidden sm:aspect-[16/9]">
        <motion.div
          className="absolute inset-[-12px]"
          style={{ x: imgX, y: imgY }}
          animate={{ scale: active && !reduce ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={shop.image}
            alt=""
            fill
            sizes="(min-width: 640px) 360px, 100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Shop type badge */}
        <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rust shadow-sm rtl:left-auto rtl:right-3">
          {kind}
        </span>

        {isCurrent && state === "idle" && (
          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-cream text-rust shadow-sm rtl:left-3 rtl:right-auto">
            <FiCheck size={15} strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Copy */}
      <div className="relative flex items-end justify-between gap-3 px-5 pb-5 pt-1">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream/70">
            <FiMapPin size={12} /> Mio Pizzeria
          </p>
          <p className="mt-1 text-lg font-semibold leading-snug text-cream sm:text-xl">{name}</p>
          <motion.p
            className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-cream"
            animate={{ opacity: active ? 1 : 0.7, x: active && !reduce ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {ctaLabel}
            <FiArrowRight size={14} className="rtl:rotate-180" />
          </motion.p>
        </div>

        {/* Round action — spins into a check once picked */}
        <motion.span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-rust shadow-md"
          animate={{
            scale: active ? 1.08 : 1,
            rotate: state === "picked" ? 360 : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          {state === "picked" ? <FiCheck size={20} strokeWidth={3} /> : <FiArrowRight size={18} className="rtl:rotate-180" />}
        </motion.span>
      </div>

      {/* Pointer-follow glare */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />

      {/* Ripple burst on pick */}
      <AnimatePresence>
        {state === "picked" && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-cream"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
});
