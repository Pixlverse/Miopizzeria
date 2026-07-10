import Layout from "@/components/Layout";
import MenuCard from "@/components/MenuCard";
import SectionBackdrop from "@/components/SectionBackdrop";
import { MENU_CATEGORIES } from "@/utils/constants";

export default function MenuPage() {
  return (
    <Layout title="Menu">
      {/* Heading */}
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-36">
        <SectionBackdrop />
        <div className="section relative z-10 text-center">
          <h1 className="text-4xl font-semibold text-rust md:text-h1">Our Menu</h1>
          <p className="mt-2 font-display text-xl italic text-rust-light">
            Premium Italian, crafted by hand
          </p>
        </div>
      </section>

      {/* Sticky category nav */}
      <nav className="sticky top-16 z-30 border-y border-rust/10 bg-cream/90 backdrop-blur md:top-20">
        <div className="section flex gap-2 overflow-x-auto py-3">
          {MENU_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-ink/80 ring-1 ring-rust/15 transition-colors hover:bg-rust hover:text-cream"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Category sections */}
      <div className="relative overflow-hidden">
        <SectionBackdrop />
        <div className="section relative z-10 space-y-20 py-16 md:py-20">
          {MENU_CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-36">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="section-title">{cat.name}</h2>
                <span className="shrink-0 text-sm text-muted">{cat.items.length} items</span>
              </div>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item, i) => (
                  <MenuCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
