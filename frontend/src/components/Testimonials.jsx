import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";
import { MOCK_TESTIMONIALS, TESTIMONIAL_GALLERY } from "@/utils/constants";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = MOCK_TESTIMONIALS.length;
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused, count]);

  const current = MOCK_TESTIMONIALS[index];
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop tone="light" />

      <div className="section relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — heading, quote card, controls */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rust">
            Guest Experiences
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            What Our Guests Say
          </h2>

          <div className="relative mt-8 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl md:p-10">
            {/* Decorative quote glyph */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-2 select-none font-display text-8xl leading-none text-rust/15"
            >
              &rdquo;
            </span>

            <div className="relative min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="font-display text-xl italic leading-relaxed text-ink/90 md:text-2xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rust/10 text-lg font-bold text-rust">
                      {current.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-bold text-ink">{current.name}</span>
                      <span className="block text-sm text-muted">{current.role}</span>
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-rust/30 text-rust transition-colors hover:bg-rust hover:text-cream"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-rust/30 text-rust transition-colors hover:bg-rust hover:text-cream"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right — staggered photo collage */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-4 sm:space-y-5">
            <Tile src={TESTIMONIAL_GALLERY[0]} ratio="aspect-[3/4]" />
            <Tile src={TESTIMONIAL_GALLERY[1]} ratio="aspect-[4/5]" />
          </div>
          <div className="space-y-4 pt-10 sm:space-y-5">
            <Tile src={TESTIMONIAL_GALLERY[2]} ratio="aspect-[4/5]" />
            <Tile src={TESTIMONIAL_GALLERY[3]} ratio="aspect-[3/4]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ src, ratio }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-3xl shadow-xl ${ratio}`}>
      <Image
        src={src}
        alt="Guests enjoying MIO"
        fill
        sizes="(max-width: 1024px) 45vw, 24vw"
        style={{ objectPosition: "center 60%" }}
        className="object-cover transition-transform duration-700 ease-out hover:scale-105"
      />
    </div>
  );
}
