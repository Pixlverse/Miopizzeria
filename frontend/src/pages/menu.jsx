import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiGrid, FiMapPin, FiRepeat } from "react-icons/fi";
import { FaPizzaSlice, FaMugHot, FaConciergeBell, FaLeaf, FaIceCream } from "react-icons/fa";
import { GiSandwich, GiCoffeeCup, GiSodaCan } from "react-icons/gi";
import Layout from "@/components/Layout";
import MenuCard from "@/components/MenuCard";
import SectionBackdrop from "@/components/SectionBackdrop";
import ShopPicker from "@/components/ShopPicker";
import { SHOPS, availableAt } from "@/utils/constants";
import api from "@/utils/api";
import { useI18n } from "@/context/LocaleContext";

const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

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
  const { t, locale } = useI18n();
  const router = useRouter();
  // Each shop has its own menu, so nothing is listed until one is chosen —
  // either via /menu?shop=<id> (shareable) or the picker that opens otherwise.
  const [shop, setShop] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
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

  useEffect(() => {
    if (!router.isReady) return;
    const fromUrl = SHOPS.find((s) => s.id === router.query.shop);
    if (fromUrl) setShop(fromUrl.id);
    else setPickerOpen(true);
    // Only on arrival — later changes come from the picker itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const chooseShop = useCallback(
    (id) => {
      setShop(id);
      setPickerOpen(false);
      // Keep the choice in the URL so a refresh or a shared link lands on it.
      router.replace(
        { pathname: router.pathname, query: { ...router.query, shop: id } },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    [router],
  );
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const currentShop = SHOPS.find((s) => s.id === shop);
  const shopItems = useMemo(
    () => (shop ? items.filter((it) => availableAt(it, shop)) : []),
    [items, shop],
  );

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

  // Only offer categories this shop actually has items in.
  const filters = useMemo(() => {
    const present = new Set(shopItems.map((it) => it.category));
    return [
      { name: "all", label: t("menu.all") },
      ...categories.filter((c) => present.has(c.name)).map((c) => ({ name: c.name, label: c.name })),
    ];
  }, [categories, shopItems, t]);

  // Switching shop can leave the selected category empty — fall back to All.
  useEffect(() => {
    if (loading || !shop || active === "all") return;
    if (!shopItems.some((it) => it.category === active)) setActive("all");
  }, [active, shopItems, loading, shop]);

  // Category display order comes from the admin (GET /categories is sorted by
  // its `order` field), so the menu follows it without a hardcoded list here.
  // Categories with no matching record sort to the end, alphabetically.
  const rank = useMemo(() => {
    const map = new Map(categories.map((c, i) => [c.name.toLowerCase(), i]));
    return (name) => {
      const i = map.get(String(name || "").toLowerCase());
      return i === undefined ? categories.length : i;
    };
  }, [categories]);

  // "All" is one continuous grid — no section headings — but ordered so each
  // category's items sit together: every Breakfast item, then Pizza, and so on.
  // Array.sort is stable, so each item's admin `order` survives within its
  // category. Unlisted categories fall to the end, alphabetically.
  const visible = useMemo(() => {
    if (active !== "all") return shopItems.filter((it) => it.category === active);
    return [...shopItems].sort(
      (a, b) =>
        rank(a.category) - rank(b.category) ||
        String(a.category || "").localeCompare(String(b.category || "")),
    );
  }, [active, shopItems, rank]);

  // Split the heading so the first word is white and the rest is the accent italic.
  const heading = t("menu.title");
  const [headWord, ...headRest] = heading.split(" ");

  return (
    <Layout title={t("nav.menu")}>
      {/* Fills <main>'s min-h-screen so a short menu (empty state, or before a
          shop is picked) doesn't leave white body showing above the footer. */}
      <div className="flex min-h-screen flex-col">
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

            {currentShop && (
              <div className="mt-6 inline-flex max-w-full items-center gap-3 rounded-full bg-white/10 p-1.5 pe-2 ring-1 ring-white/20 backdrop-blur-md">
                <span className="relative hidden h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-cream/70 sm:block">
                  <Image src={currentShop.image} alt="" fill sizes="40px" className="scale-[1.6] object-cover" />
                </span>
                <span className="min-w-0 ps-2 text-start leading-tight sm:ps-0">
                  <span className="block whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-cream/70 sm:text-[11px]">
                    {t("menu.viewingShop")}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-white">
                    <FiMapPin size={13} className="shrink-0" />
                    {locale === "ar" ? currentShop.nameAr : currentShop.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="ms-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cream px-3.5 py-2 text-xs font-bold text-rust transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                >
                  <FiRepeat size={13} />
                  {t("menu.changeShop")}
                </button>
              </div>
            )}
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
      <section className="relative flex-1 overflow-hidden pb-20 pt-8">
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
            <div className="flex justify-center">
              <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white/95 p-1.5 shadow-card ring-1 ring-rust/10 backdrop-blur [&::-webkit-scrollbar]:hidden">
                {filters.map((f) => {
                  const isActive = active === f.name;
                  const Icon = f.name === "all" ? FiGrid : catIcon(f.name);
                  return (
                    <button
                      key={f.name}
                      type="button"
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
          )}

          {/* Cards / states */}
          {loading || !shop ? (
            <div className="mt-16 grid place-items-center text-muted">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-rust/30 border-t-rust" />
              <p className="mt-4 text-sm font-medium">{t("menu.loading")}</p>
            </div>
          ) : visible.length === 0 ? (
            <p className="mt-16 text-center text-muted">
              {shopItems.length === 0 ? t("menu.shopEmpty") : t("menu.empty")}
            </p>
          ) : (
            <div className={`mt-10 ${GRID}`}>
              {visible.map((item, i) => (
                <MenuCard key={item._id || `${item.category}-${i}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
      </div>

      <ShopPicker
        open={pickerOpen}
        current={shop}
        onSelect={chooseShop}
        // First visit: a shop must be picked. Afterwards it can be dismissed.
        onClose={shop ? closePicker : undefined}
      />
    </Layout>
  );
}
