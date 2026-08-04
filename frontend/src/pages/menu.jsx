import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiGrid, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaPizzaSlice, FaMugHot, FaConciergeBell, FaLeaf, FaIceCream } from "react-icons/fa";
import { GiSandwich, GiCoffeeCup, GiSodaCan } from "react-icons/gi";
import Layout from "@/components/Layout";
import MenuCard from "@/components/MenuCard";
import SectionBackdrop from "@/components/SectionBackdrop";
import api from "@/utils/api";
import { useI18n } from "@/context/LocaleContext";

// Pick a line-art icon from the category name (falls back to the cloche).
function catIcon(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("pizza")) return FaPizzaSlice;
  if (n.includes("sandwich")) return GiSandwich;
  if (n.includes("coffee")) return GiCoffeeCup;
  if (n.includes("tea")) return FaMugHot;
  if (
    n.includes("cooler") ||
    n.includes("refresh") ||
    n.includes("juice") ||
    n.includes("water") ||
    n.includes("drink")
  )
    return GiSodaCan;
  if (n.includes("salad") || n.includes("gluten")) return FaLeaf;
  if (n.includes("breakfast")) return FaMugHot;
  if (n.includes("dessert")) return FaIceCream;
  return FaConciergeBell;
}

export default function MenuPage() {
  const { t, dir } = useI18n();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch categories + menu items from the backend (admin-managed).
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [cats, its] = await Promise.all([
          api.get("/categories"),
          api.get("/menu-items"),
        ]);
        if (!live) return;
        setCategories(Array.isArray(cats.data) ? cats.data : []);
        setItems(Array.isArray(its.data) ? its.data : []);
      } catch {
        /* leave empty on failure */
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  // Pre-select a category when arriving via /menu?cat=<name> (case-insensitive).
  useEffect(() => {
    const { cat } = router.query;
    if (!cat || !categories.length) return;
    const q = String(cat).toLowerCase();
    const match = categories.find(
      (c) => c.name.toLowerCase() === q || c.name.toLowerCase().startsWith(q),
    );
    if (match) setActive(match.name);
  }, [router.query, categories]);

  const filters = useMemo(
    () => [
      { name: "all", label: t("menu.all") },
      ...categories.map((c) => ({ name: c.name, label: c.name })),
    ],
    [categories, t],
  );

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((it) => it.category === active)),
    [active, items],
  );

  /* ---- Category strip: arrow buttons, shown only when it overflows ---- */
  const strip = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Under the current scroll spec, RTL scrollLeft runs from -(max) up to 0,
  // so the reachable range flips while "visually left" stays the negative end.
  const syncArrows = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }
    const rtl = dir === "rtl";
    setCanLeft(el.scrollLeft > (rtl ? -max : 0) + 1);
    setCanRight(el.scrollLeft < (rtl ? 0 : max) - 1);
  }, [dir]);

  useEffect(() => {
    const el = strip.current;
    if (!el) return undefined;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows, filters.length]);

  // Negative always moves the view left on screen, in both text directions.
  const nudge = (sign) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: sign * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // Keep the selected chip visible — it can sit off-screen after a ?cat= deep
  // link, or once the list is long enough to scroll. Done by hand rather than
  // with scrollIntoView, which also scrolls every scrollable ancestor and drags
  // the whole page sideways. Measuring from centres works in RTL too.
  useEffect(() => {
    const el = strip.current;
    const chip = el?.querySelector('[data-active="true"]');
    if (!el || !chip) return;
    const stripBox = el.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    const delta =
      chipBox.left + chipBox.width / 2 - (stripBox.left + stripBox.width / 2);
    if (Math.abs(delta) > 1) el.scrollBy({ left: delta, behavior: "smooth" });
  }, [active, filters.length]);

  // Split the heading so the first word is white and the rest is the accent italic.
  const heading = t("menu.title");
  const [headWord, ...headRest] = heading.split(" ");

  return (
    <Layout title={t("nav.menu")}>
      {/* Full-bleed food hero — copy on the left, the spread on the right */}
      <section className="relative flex min-h-[52vh] items-center overflow-hidden bg-[#5E2A20] pt-24">
        <Image
          src="/images/menu-main.jpg"
          alt="A spread of Mio pizza, sandwich, salad and iced coffee"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right rtl:-scale-x-100"
        />
        <div
          aria-hidden
          className="absolute inset-0 rtl:hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(50,18,12,0.9) 0%, rgba(50,18,12,0.66) 32%, rgba(50,18,12,0.2) 58%, rgba(50,18,12,0) 78%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden rtl:block"
          style={{
            background:
              "linear-gradient(270deg, rgba(50,18,12,0.9) 0%, rgba(50,18,12,0.66) 32%, rgba(50,18,12,0.2) 58%, rgba(50,18,12,0) 78%)",
          }}
        />

        <div className="section relative z-10 w-full pb-16">
          <div className="max-w-xl">
            <h1 className="leading-[0.95]">
              <span className="font-display text-6xl font-semibold text-white sm:text-7xl">
                {headWord}{" "}
              </span>
              {headRest.length > 0 && (
                <span className="font-display text-6xl italic text-rust-light sm:text-7xl">
                  {headRest.join(" ")}
                </span>
              )}
            </h1>
            <p className="mt-3 font-display text-xl italic text-cream/90 sm:text-2xl">
              {t("menu.subtitle")}
            </p>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      {/* Light content — filter + cards */}
      <section className="relative overflow-hidden pb-20 pt-8">
        <SectionBackdrop />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(171,76,53,0.14) 1.4px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="section relative z-10">
          {/* Filter — segmented pill control */}
          {filters.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {/* Kept mounted and faded out so the strip doesn't shift at the ends. */}
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label={t("menu.scrollLeft")}
                tabIndex={canLeft ? 0 : -1}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-rust shadow-card ring-1 ring-rust/10 transition-opacity duration-300 hover:bg-rust/5 sm:h-10 sm:w-10 ${
                  canLeft ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <FiChevronLeft size={18} />
              </button>

              <div className="min-w-0 max-w-full">
                <div
                  ref={strip}
                  className="flex items-center gap-1 overflow-x-auto rounded-full bg-white/95 p-1.5 shadow-card ring-1 ring-rust/10 backdrop-blur [&::-webkit-scrollbar]:hidden"
                >
                  {filters.map((f) => {
                    const isActive = active === f.name;
                    const Icon = f.name === "all" ? FiGrid : catIcon(f.name);
                    return (
                      <button
                        key={f.name}
                        type="button"
                        data-active={isActive}
                        onClick={() => setActive(f.name)}
                        aria-pressed={isActive}
                        className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-rust text-white shadow-md"
                            : "text-rust/70 hover:bg-rust/5 hover:text-rust"
                        }`}
                      >
                        <Icon size={17} className="shrink-0" />
                        <span className="whitespace-nowrap">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label={t("menu.scrollRight")}
                tabIndex={canRight ? 0 : -1}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-rust shadow-card ring-1 ring-rust/10 transition-opacity duration-300 hover:bg-rust/5 sm:h-10 sm:w-10 ${
                  canRight ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Cards / states */}
          {loading ? (
            <div className="mt-16 grid place-items-center text-muted">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-rust/30 border-t-rust" />
              <p className="mt-4 text-sm font-medium">{t("menu.loading")}</p>
            </div>
          ) : visible.length === 0 ? (
            <p className="mt-16 text-center text-muted">{t("menu.empty")}</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((item, i) => (
                <MenuCard key={item._id || `${item.category}-${i}`} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
