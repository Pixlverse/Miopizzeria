import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import PaperTexture from "./PaperTexture";

const LEFT_INSET =
  "left-6 md:left-8 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]";

/**
 * Scroll-driven cinematic hero. Pins while a tall track scrolls past and
 * plays a scrubbed GSAP timeline (pizza swap + kinetic type). Used on the
 * About page as an immersive intro.
 */
export default function ScrollHero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cleanup = () => {};

    (async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule.gsap;

      if (reduce) {
        // Static fallback — collapse the scroll track, show the intro scene only.
        if (rootRef.current) rootRef.current.style.height = "100svh";
        gsap.set(rootRef.current.querySelectorAll(".ss-pizzaA"), {
          xPercent: 36,
        });
        gsap.set(rootRef.current.querySelectorAll(".ss-word1, .ss-copy"), {
          autoAlpha: 1,
        });
        return;
      }

      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Initial states
        gsap.set(".ss-copy, .ss-word1, .ss-pizzaA", { autoAlpha: 1 });
        gsap.set(".ss-pizzaA", { xPercent: 36, scale: 1 });
        gsap.set(
          ".ss-pizzaB, .ss-word2, .ss-word3, .ss-info1, .ss-info2, .ss-final",
          { autoAlpha: 0 },
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // Intro idle
        tl.to(".ss-pizzaA", { rotate: 4, duration: 2 }, 0);

        // Scene 1 → centre spotlight
        tl.to(".ss-copy", { autoAlpha: 0, x: -60, duration: 1.5 }, 2)
          .to(
            ".ss-pizzaA",
            { xPercent: 0, scale: 1.18, rotate: -4, duration: 2 },
            2,
          )
          .to(".ss-word1", { autoAlpha: 0, yPercent: -20, duration: 1.5 }, 2)
          .fromTo(
            ".ss-word2",
            { autoAlpha: 0, yPercent: 22 },
            { autoAlpha: 1, yPercent: 0, duration: 1.5 },
            3,
          )
          .fromTo(
            ".ss-info1",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1.5 },
            3.3,
          );

        // Scene 1 → Scene 2 (flavour swap)
        tl.to(".ss-pizzaA", { autoAlpha: 0, scale: 1.35, duration: 1.5 }, 4.8)
          .to(".ss-word2", { autoAlpha: 0, yPercent: -20, duration: 1.2 }, 4.8)
          .to(".ss-info1", { autoAlpha: 0, y: -20, duration: 1.2 }, 4.8)
          .fromTo(
            ".ss-pizzaB",
            { autoAlpha: 0, scale: 0.9, rotate: 8 },
            { autoAlpha: 1, scale: 1.18, rotate: -4, duration: 2 },
            5,
          )
          .fromTo(
            ".ss-word3",
            { autoAlpha: 0, yPercent: 22 },
            { autoAlpha: 1, yPercent: 0, duration: 1.5 },
            5.4,
          )
          .fromTo(
            ".ss-info2",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1.5 },
            5.7,
          );

        // Final CTA
        tl.to(".ss-pizzaB", { scale: 0.85, yPercent: -6, duration: 1.5 }, 7.6)
          .to(".ss-word3", { autoAlpha: 0, duration: 1 }, 7.6)
          .to(".ss-info2", { autoAlpha: 0, duration: 1 }, 7.6)
          .fromTo(
            ".ss-final",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1.5 },
            7.9,
          );
      }, rootRef);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    // Tall scroll track — the panel pins while this scrolls past.
    <section ref={rootRef} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden bg-rust">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #AB4C35 0%, #8B3D2F 100%)",
          }}
          aria-hidden="true"
        />
        <PaperTexture opacity={0.5} blend="overlay" />

        {/* Kinetic words (behind) */}
        {[
          { c: "ss-word1", t: "MIO" },
          { c: "ss-word2", t: "GOOEY" },
          { c: "ss-word3", t: "LOADED" },
        ].map((w) => (
          <div
            key={w.c}
            className={`${w.c} pointer-events-none absolute inset-0 grid place-items-center`}
          >
            <span className="select-none text-[24vw] font-black leading-none tracking-tighter text-cream/10">
              {w.t}
            </span>
          </div>
        ))}

        {/* Pizza stage */}
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <div className="relative aspect-square w-[min(82vw,540px)]">
            <div className="ss-pizzaA absolute inset-0 drop-shadow-2xl">
              <Image
                src="/images/slider5.png"
                alt="Pepperoni Supreme pizza"
                fill
                priority
                sizes="(max-width: 768px) 82vw, 540px"
                className="object-contain"
              />
            </div>
            <div className="ss-pizzaB absolute inset-0 drop-shadow-2xl">
              <Image
                src="/images/slider1.png"
                alt="Garden Deluxe pizza"
                fill
                sizes="(max-width: 768px) 82vw, 540px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Scene 1 — hero copy */}
        <div
          className={`ss-copy absolute top-1/2 z-20 max-w-md -translate-y-1/2 pr-6 ${LEFT_INSET}`}
        >
          <div className="mb-4 flex gap-2">
            {["Classic", "Spicy", "Veggie"].map((f) => (
              <span
                key={f}
                className="rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold text-cream ring-1 ring-cream/25"
              >
                {f}
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Pizza Cravings?
          </h1>
          <h2 className="mt-2 text-3xl font-semibold text-cream sm:text-4xl">
            Get It Delivered Hot &amp; Fresh!
          </h2>
          <p className="mt-4 max-w-sm text-cream/85">
            Handcrafted and delivered fast across Doha.
          </p>
          <Link
            href="/#order"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
          >
            Order Your Pizza Now
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scene 1 spotlight info */}
        <div
          className={`ss-info1 absolute bottom-16 z-20 w-72 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20 ${LEFT_INSET}`}
        >
          <span className="inline-block rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rust">
            Signature
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">
            Pepperoni Supreme
          </h3>
          <p className="mt-1 text-sm text-cream/80">
            Molten mozzarella, double pepperoni, fire-kissed crust.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
            <span className="text-lg font-bold text-cream">QAR 45</span>
            <Link
              href="/#order"
              className="rounded-full bg-cream px-4 py-1.5 text-xs font-bold text-rust"
            >
              Add to Cart
            </Link>
          </div>
        </div>

        {/* Scene 2 info */}
        <div
          className={`ss-info2 absolute bottom-16 z-20 w-72 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20 ${LEFT_INSET}`}
        >
          <span className="inline-block rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rust">
            Garden
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">Garden Deluxe</h3>
          <p className="mt-1 text-sm text-cream/80">
            Olives, peppers, sweet corn and red onion on a hand-stretched base.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
            <span className="text-lg font-bold text-cream">QAR 52</span>
            <Link
              href="/#order"
              className="rounded-full bg-cream px-4 py-1.5 text-xs font-bold text-rust"
            >
              Add to Cart
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="ss-final absolute inset-x-0 bottom-24 z-20 flex flex-col items-center text-center">
          <p className="font-display text-2xl italic text-cream/90">
            Craving more?
          </p>
          <Link
            href="/menu"
            className="group mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
          >
            Explore the Full Menu
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-widest text-cream/60">
          Scroll ↓
        </div>
      </div>
    </section>
  );
}
