import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";

const OFFERS = [
  {
    id: "first-order",
    tag: "Code FIRST50",
    title: "50% Off",
    sub: "On your very first order",
    image: "/images/slider2.png",
    focus: "center 40%",
    cta: "Order Now",
    href: "/#order",
  },
  {
    id: "free-delivery",
    tag: "No code needed",
    title: "Free Delivery",
    sub: "On orders over QAR 75",
    image: "/images/slider3.png",
    focus: "center 45%",
    cta: "Explore Menu",
    href: "/menu",
  },
  {
    id: "family-combo",
    tag: "From QAR 99",
    title: "Family Combo",
    sub: "2 pizzas, sides & drinks",
    image: "/images/slider1.png",
    focus: "center 50%",
    cta: "Order Now",
    href: "/#order",
  },
];

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <SectionBackdrop tone="light" />

      <div className="section relative z-10">
        <div className="mb-12 text-center">
          <p className="font-display text-xl italic text-rust-light">Don&apos;t miss out</p>
          <h2 className="section-title mt-2">Special Offers</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map((o) => (
            <article
              key={o.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5 sm:aspect-[4/3] md:aspect-[3/4]"
            >
              <Image
                src={o.image}
                alt={o.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectPosition: o.focus }}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dark scrim for legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
                aria-hidden="true"
              />

              <div className="absolute inset-0 z-10 flex flex-col items-start justify-end p-6 md:p-7">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/30 backdrop-blur-sm">
                  {o.tag}
                </span>
                <h3 className="mt-3 text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-md">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm text-white/85">{o.sub}</p>
                <Link
                  href={o.href}
                  className="group/btn mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
                >
                  {o.cta}
                  <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
