import Link from "next/link";
import ProductCard from "./ProductCard";
import SectionBackdrop from "./SectionBackdrop";
import { FEATURED_PRODUCTS } from "@/utils/constants";

// Vertical offsets give the row a scattered, unarranged rhythm on desktop.
const OFFSETS = [
  "lg:translate-y-0",
  "lg:translate-y-14",
  "lg:-translate-y-6",
  "lg:translate-y-10",
];

export default function FeaturedMenu() {
  const items = FEATURED_PRODUCTS.slice(0, 4);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <SectionBackdrop />

      <div className="section relative z-10">
        <div className="mb-14 text-center">
          <p className="font-display text-xl italic text-rust-light">Straight from the oven</p>
          <h2 className="section-title mt-2">Featured Favourites</h2>
        </div>

        {/* Scattered poster gallery */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:pb-12">
          {items.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              index={i}
              className={OFFSETS[i % OFFSETS.length]}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/menu" className="btn-primary">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
