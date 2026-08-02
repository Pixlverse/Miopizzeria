import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiGrid } from "react-icons/fi";
import { FaPizzaSlice, FaMugHot, FaConciergeBell, FaLeaf } from "react-icons/fa";
import { GiSandwich, GiCoffeeCup, GiSodaCan } from "react-icons/gi";
import Layout from "@/components/Layout";
import MenuCard from "@/components/MenuCard";
import SectionBackdrop from "@/components/SectionBackdrop";
import { MENU_CATEGORIES } from "@/utils/constants";

const FILTERS = [{ id: "all", name: "All" }, ...MENU_CATEGORIES];

// Line-art icon per filter (falls back to the plate/cloche for anything new).
const FILTER_ICONS = {
  all: FiGrid,
  pizza: FaPizzaSlice,
  sandwich: GiSandwich,
  coffee: GiCoffeeCup,
  tea: FaMugHot,
  coolers: GiSodaCan,
  starters: FaConciergeBell,
  salads: FaLeaf,
};

export default function MenuPage() {
  const router = useRouter();
  const [active, setActive] = useState("all");

  // Pre-select a category when arriving via /menu?cat=<id> (e.g. from the home
  // "Popular Categories" tiles).
  useEffect(() => {
    const { cat } = router.query;
    if (cat && MENU_CATEGORIES.some((c) => c.id === cat)) setActive(cat);
  }, [router.query]);

  const items = useMemo(() => {
    const cats =
      active === "all"
        ? MENU_CATEGORIES
        : MENU_CATEGORIES.filter((c) => c.id === active);
    return cats.flatMap((c) => c.items.map((it) => ({ ...it, catId: c.id })));
  }, [active]);

  return (
    <Layout title="Menu">
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
        {/* Left scrim for copy contrast (flips side in RTL) */}
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
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-cream/80">
              Top Foods
              <span className="h-px w-10 bg-rust-light" aria-hidden="true" />
            </p>
            <h1 className="mt-2 leading-[0.95]">
              <span className="font-display text-6xl font-semibold text-white sm:text-7xl">Our </span>
              <span className="font-display text-6xl italic text-rust-light sm:text-7xl">Menu</span>
            </h1>
            <p className="mt-3 font-display text-xl italic text-cream/90 sm:text-2xl">
              Premium Italian, crafted by hand
            </p>
          </div>
        </div>

        {/* Curved transition into the light content */}
        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      {/* Light content — filter pills + cards */}
      <section className="relative overflow-hidden pb-20 pt-8">
        <SectionBackdrop />
        {/* Decorative dot texture + warm glows so cards don't float on a flat wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(171,76,53,0.14) 1.4px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-24 z-0 h-96 w-96 rounded-full bg-rust-light/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/2 z-0 h-96 w-96 rounded-full bg-rust/15 blur-3xl"
        />

        <div className="section relative z-10">
          {/* Filter — segmented pill control (scrolls horizontally if needed) */}
          <div className="flex justify-center">
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white/95 p-1.5 shadow-card ring-1 ring-rust/10 backdrop-blur [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((f) => {
                const isActive = active === f.id;
                const Icon = FILTER_ICONS[f.id] || FaConciergeBell;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActive(f.id)}
                    aria-pressed={isActive}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-rust text-white shadow-md"
                        : "text-rust/70 hover:bg-rust/5 hover:text-rust"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="whitespace-nowrap">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => (
              <MenuCard key={`${item.catId}-${item.id}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
