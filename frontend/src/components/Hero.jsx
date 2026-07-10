import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import PaperTexture from "./PaperTexture";

const LEFT_INSET =
  "left-6 md:left-8 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]";

/**
 * Static home hero — copy overlaid on the left, an oversized pizza bleeding off
 * the right edge, "MIO" watermark behind. Free/overlapping composition (no rigid
 * grid). The scroll animation lives on the About page.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-rust">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(120deg, #AB4C35 0%, #8B3D2F 100%)" }}
        aria-hidden="true"
      />
      <PaperTexture opacity={0.5} blend="overlay" />

      {/* MIO watermark */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="select-none text-[30vw] font-black leading-none tracking-tighter text-cream/10 md:text-[26vw]">
          MIO
        </span>
      </div>

      {/* Oversized pizza — bleeds off the right edge, slightly rotated */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center">
        <div className="relative aspect-square w-[92vw] max-w-[820px] translate-x-[14%] -rotate-[6deg] md:translate-x-[10%] lg:w-[58vw]">
          <Image
            src="/images/slider2.png"
            alt="Pepperoni Supreme pizza with a melting cheese pull"
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 58vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Copy — overlaid on the left, vertically centred */}
      <div className={`absolute top-1/2 z-20 max-w-2xl -translate-y-1/2 pr-6 ${LEFT_INSET}`}>
        <h1 className="text-6xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Pizza Cravings?
        </h1>
        <h2 className="mt-4 text-4xl font-semibold text-cream sm:text-5xl">
          Get It Delivered Hot &amp; Fresh!
        </h2>
        <p className="mt-6 max-w-md text-xl text-cream/85">
          Handcrafted, wood-fired and delivered fast across Doha.
        </p>
        <Link
          href="/#order"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-cream px-9 py-4 text-base font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
        >
          Order Your Pizza Now
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
