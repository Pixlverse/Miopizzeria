import Link from "next/link";
import Image from "next/image";
import {
  FaLeaf,
  FaFire,
  FaHeart,
  FaUtensils,
  FaMapMarkerAlt,
  FaConciergeBell,
  FaRoute,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { FiArrowRight, FiTruck, FiStar, FiCheck } from "react-icons/fi";
import { GiTomato, GiHerbsBundle, GiCheeseWedge, GiBellPepper } from "react-icons/gi";
import Layout from "@/components/Layout";
import PaperTexture from "@/components/PaperTexture";

const STORY_FEATURES = [
  { Icon: FaLeaf, label: "Finest Italian Ingredients" },
  { Icon: FaFire, label: "Wood-Fired Perfection" },
  { Icon: FaHeart, label: "Made with Passion & Care" },
];

// Our Values — the Naples-rooted ingredients that define authenticity.
const INGREDIENTS = [
  { Icon: GiHerbsBundle, label: "00 Flour Dough" },
  { Icon: GiTomato, label: "San Marzano Tomatoes" },
  { Icon: GiCheeseWedge, label: "Creamy Mozzarella" },
  { Icon: FaFire, label: "Wood-Fired Oven" },
  { Icon: GiBellPepper, label: "Fresh Basil" },
];

// "Looking for authentic Italian flavour" — signature promises.
const FLAVOUR_TAGS = [
  "Unique Recipes",
  "Signature Flavors",
  "Authentic Expertise",
  "Italian Tradition",
];

const BUBBLES = [
  { Icon: FiTruck, label: "Fast Delivery", pos: "left-0 top-4" },
  { Icon: FaUtensils, label: "Authentic Recipes", pos: "right-0 top-4" },
  { Icon: FiStar, label: "Top Rated by You", pos: "left-0 bottom-4" },
  { Icon: FaLeaf, label: "Always Fresh", pos: "right-0 bottom-4" },
];

// "Everything changes, Italian taste remains" — what makes a visit to Mio.
const WHY_FEATURES = [
  {
    Icon: FaMapMarkerAlt,
    title: "Prime Location",
    text: "Set in a vibrant area of Qatar with a warm, relaxed setting — a welcoming space suited for everyday meals and casual gatherings.",
  },
  {
    Icon: FaUtensils,
    title: "Varied Menu",
    text: "A menu rooted in Italian tradition — Neapolitan pizzas, seasonal salads and handmade desserts, prepared with quality ingredients.",
  },
  {
    Icon: FaConciergeBell,
    title: "Maintenance & Service",
    text: "A high standard of service with a friendly team and a cozy environment, designed to make each visit pleasant and enjoyable.",
  },
  {
    Icon: FaRoute,
    title: "Ease of Access",
    text: "Well-connected with nearby parking and delivery support — ideal for dine-in, takeaway or convenient online ordering.",
  },
];

export default function AboutPage() {
  return (
    <Layout title="About">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 25% 0%, #8A2E1E 0%, #5E1E14 48%, #3A130C 100%)",
          }}
        />
        <PaperTexture opacity={0.4} blend="overlay" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="select-none text-[30vw] font-black leading-none tracking-tighter text-cream/[0.06] md:text-[22vw]">
            MIO
          </span>
        </div>

        <div className="section relative z-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="font-display text-xl italic text-cream/80">About Us</p>
            <h1 className="mt-2 text-5xl font-bold leading-[1.05] text-white md:text-6xl">
              About Mio Pizzeria
            </h1>
            <p className="mt-6 max-w-lg leading-relaxed text-cream/85">
              Qatari entrepreneur Mrs. Ghada Khalifa A T Al-Subaey first envisioned opening a
              pizzeria and met Alfonso and Andrea to bring the dream to life. Born from a deep love
              for authentic Italian flavors, Mio Pizzeria honors the rich traditions of Naples —
              staying true to the time-honored art of pizza-making while adding a modern touch.
            </p>
            <a
              href="#story"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all hover:scale-105 hover:bg-white"
            >
              Our Story
              <FiArrowRight className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </a>
          </div>

          {/* Hero image — the Mio storefront */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-cream/20">
            <Image
              src="/images/mio.png"
              alt="Mio Pizzeria storefront in Doha"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 52vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Curved bottom transition */}
        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      {/* ---------- Our Story ---------- */}
      <section id="story" className="relative overflow-hidden bg-[#FDF5ED] py-20 md:py-28">
        <div className="section relative z-10 grid items-center gap-12 lg:grid-cols-2">
          {/* Image with decorations */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-4 top-6 h-24 w-24"
              style={{
                backgroundImage: "radial-gradient(rgba(171,76,53,0.35) 2px, transparent 2px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card ring-1 ring-rust/10">
              <Image
                src="/images/rest1.jpg"
                alt="Handcrafting fresh dough at Mio"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="font-display text-xl italic text-rust-light">Our Story</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-rust md:text-4xl">
              Born in Naples,<br className="hidden sm:block" /> Baked with Purpose
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              In a quiet corner of the city, Mio Pizzeria was born from a deep love for the flavors
              and traditions of Naples. We're Alfonso and Andrea, and our goal was simple: to bring
              the genuine taste of Neapolitan pizza to our community here in Qatar.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Our idea was never to build a restaurant — it was to build a feeling. One rooted in
              tradition, where every pizza tells a story, every ingredient has a reason, and every
              recipe holds a memory. It's not fast. It's not flashy. It's just real.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {STORY_FEATURES.map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rust/10 text-rust">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Real Ingredients band ---------- */}
      <section className="relative bg-[#FDF5ED] pb-20 md:pb-28">
        <div className="section">
          <div className="grid items-center gap-8 rounded-[2rem] bg-gradient-to-br from-rust to-rust-dark p-8 text-cream shadow-card md:p-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="font-display text-xl italic text-cream/80">Our Values</p>
              <h2 className="mt-1 text-3xl font-bold leading-tight text-white md:text-4xl">
                Authentic to<br /> the Last Slice.
              </h2>
              <p className="mt-4 leading-relaxed text-cream/85">
                Naples, the birthplace of Neapolitan pizza, inspires everything we do. From dough
                made with 00 flour to tangy San Marzano tomatoes and creamy mozzarella, each
                ingredient is carefully chosen to ensure authenticity — baked to perfection in a
                wood-fired oven for a soft, airy crust with just the right char.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {INGREDIENTS.map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-white/10 text-cream ring-1 ring-white/15">
                    <Icon size={38} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-cream">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why Choose Mio ---------- */}
      <section className="relative overflow-hidden bg-[#FDF5ED] py-20 md:py-28">
        <div className="section relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-xl italic text-rust-light">The Mio Promise</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-rust md:text-4xl">
              Looking for Authentic Italian Flavour?
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Experience the rich heritage of Naples with every bite. Our handcrafted pizzas, made
              with the finest Italian ingredients and time-honored techniques, bring authentic
              flavors straight from Italy to your table.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FLAVOUR_TAGS.map((tag) => (
                <li key={tag} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rust/10 text-rust">
                    <FiCheck size={15} />
                  </span>
                  <span className="font-semibold text-ink">{tag}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/menu"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-rust px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:bg-rust-dark"
            >
              View Our Menu Card
              <FiArrowRight className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>

          {/* Circular oven with orbiting badges */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <span aria-hidden className="absolute inset-6 rounded-full border border-dashed border-rust/25" />
            <div className="absolute inset-[22%] overflow-hidden rounded-full shadow-card ring-4 ring-white">
              <Image
                src="/images/rest2.jpg"
                alt="Wood-fired pizza fresh from the oven"
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
            {BUBBLES.map(({ Icon, label, pos }) => (
              <div
                key={label}
                className={`absolute ${pos} flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full bg-white text-center shadow-card ring-1 ring-rust/10`}
              >
                <Icon className="text-rust" size={20} />
                <span className="px-2 text-[11px] font-bold leading-tight text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Why visit Mio band ---------- */}
      <section className="relative bg-[#FDF5ED] pb-20 md:pb-28">
        <div className="section">
          <div className="rounded-[2rem] bg-gradient-to-br from-rust to-rust-dark p-8 text-cream shadow-card md:p-12">
            <div className="text-center">
              <p className="font-display text-xl italic text-cream/80">Savor the essence of real Italy</p>
              <h2 className="mt-1 text-3xl font-bold text-white md:text-4xl">
                Everything Changes, Italian Taste Remains
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_FEATURES.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cream/15 text-cream ring-1 ring-white/20">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/#order"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-rust shadow-md transition-all hover:bg-white"
              >
                Order Now for a Flavorful Italian Experience
                <FiArrowRight className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Closing quote — culinary heritage ---------- */}
      <section className="relative overflow-hidden bg-[#FDF5ED] pb-24 pt-4 text-center">
        <img src="/images/leaves.png" alt="" aria-hidden="true" className="absolute left-4 top-2 h-28 w-28 object-contain md:left-20 md:h-36 md:w-36" />
        <img src="/images/tomato-slice.png" alt="" aria-hidden="true" className="absolute right-4 top-4 h-24 w-24 object-contain md:right-24 md:h-32 md:w-32" />
        <div className="section relative z-10">
          <p className="font-display text-lg italic text-rust-light">A legacy passed through generations</p>
          <FaQuoteLeft className="mx-auto mt-4 text-rust/30" size={22} />
          <p className="mx-auto mt-4 max-w-2xl font-display text-2xl italic leading-relaxed text-rust md:text-3xl">
            Our culinary heritage is a legacy of authentic flavors, crafted with passion and
            tradition — the taste of history, reimagined for today.
          </p>
          <FaQuoteRight className="mx-auto mt-4 text-rust/30" size={22} />
        </div>
      </section>
    </Layout>
  );
}
