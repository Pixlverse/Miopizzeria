import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import PaperTexture from "./PaperTexture";

const TILE_IMAGES = [
  "/images/prod-1.jpg",
  "/images/rest1.jpg",
  "/images/prod-3.jpg",
  "/images/rest2.jpg",
  "/images/prod-5.jpg",
  "/images/rest3.jpg",
  "/images/prod-2.jpg",
  "/images/rest4.jpg",
  "/images/prod-4.jpg",
];

// Deterministic U-shaped arc: tiles dip toward the centre, rise at the edges.
const TILE_COUNT = 19;
const TILES = Array.from({ length: TILE_COUNT }, (_, i) => {
  const t = i / (TILE_COUNT - 1); // 0 → 1
  const dip = 1 - (2 * t - 1) ** 2; // 0 at edges, 1 at centre
  return {
    left: 3 + t * 94, // %
    top: 62 + dip * 34, // % — arc sits in the lower band, clear of the content
    size: 46 + (i % 3) * 16, // px
    rotate: (i % 2 === 0 ? -1 : 1) * (5 + (i % 3) * 4),
    delay: (i % 5) * 0.4,
    dur: 3 + (i % 3) * 0.7,
    img: TILE_IMAGES[i % TILE_IMAGES.length],
  };
});

export default function CtaGallery() {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden md:min-h-[480px]">
      {/* Deep rust backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #B4523A 0%, #7A3324 50%, #3A1A14 100%)",
        }}
        aria-hidden="true"
      />
      <PaperTexture opacity={0.3} blend="overlay" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-cream/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Floating square-tile arc */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {TILES.map((tile, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${tile.left}%`, top: `${tile.top}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="animate-float"
              style={{ animationDelay: `${tile.delay}s`, animationDuration: `${tile.dur}s` }}
            >
              <div
                className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/25"
                style={{ width: tile.size, height: tile.size, transform: `rotate(${tile.rotate}deg)` }}
              >
                <div className="relative h-full w-full">
                  <Image src={tile.img} alt="" fill sizes="80px" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="section relative z-10 flex w-full flex-col items-center text-center">
        <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
          Step Inside MIO
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/85">
          Wood-fired pizzas, our dining room, and the little details that make every
          visit special — take a look.
        </p>
        <Link
          href="/gallery"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
        >
          View Gallery
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
