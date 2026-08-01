import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useI18n } from "@/context/LocaleContext";
import { DELIVERY_PLATFORMS } from "@/utils/constants";

/* ---------------------------------------------------------------------------
 * PREVIOUS HERO (commented out per redesign) — imageless, typography-led: bold
 * centred copy on a layered rust background with a slowly rotating line-art
 * pizza ring and a trust strip. Superseded by the image-led hero below.
 * (The earlier 60/40 split hero remains available in git history.)
 * ---------------------------------------------------------------------------
 * const FEATURES = ["Wood-Fired in 90s", "Delivered Across Doha", "48h Proofed Dough"];
 *
 * export default function Hero() {
 *   const { t } = useI18n();
 *   return (
 *     <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-rust py-28">
 *       <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, #A5482F 0%, #86331F 55%, #5E2418 100%)" }} aria-hidden="true" />
 *       <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 50% at 50% 40%, rgba(254,220,189,0.12) 0%, rgba(254,220,189,0) 62%), radial-gradient(50% 45% at 95% 105%, rgba(60,22,15,0.6) 0%, rgba(60,22,15,0) 55%)" }} aria-hidden="true" />
 *       <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(90% 75% at 50% 45%, rgba(0,0,0,0) 45%, rgba(45,16,10,0.55) 100%)" }} aria-hidden="true" />
 *       <div className="pointer-events-none absolute inset-0 grid place-items-center">
 *         <svg viewBox="0 0 100 100" className="aspect-square w-[128vh] animate-[pizzaSpin_140s_linear_infinite] text-cream/[0.09] motion-reduce:animate-none" fill="none" stroke="currentColor" strokeWidth="0.15" strokeLinecap="round" aria-hidden="true">
 *           <circle cx="50" cy="50" r="48" />
 *           <circle cx="50" cy="50" r="43" strokeWidth="0.1" />
 *           <circle cx="50" cy="50" r="34" strokeDasharray="1.2 1.8" />
 *           (8 slice lines + topping dots)
 *         </svg>
 *       </div>
 *       <PaperTexture opacity={0.4} blend="overlay" />
 *       <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
 *         <span className="... rounded-full border ...">Authentic Neapolitan • Doha</span>
 *         <h1 className="text-6xl font-bold ... text-white ...">{t("hero.title")}</h1>
 *         <h2 className="mt-4 text-3xl font-semibold text-cream ...">{t("hero.subtitle")}</h2>
 *         <p className="mt-6 max-w-lg text-lg text-cream/85 ...">{t("hero.description")}</p>
 *         (Order + Menu CTAs, then a dot-separated trust strip)
 *       </div>
 *     </section>
 *   );
 * }
 * ------------------------------------------------------------------------- */

/**
 * Home hero — full-bleed food photography (mainslider.png) with left-aligned
 * copy: a script eyebrow, a bold two-line headline, a short pitch, primary
 * CTAs, and a delivery bar showing the ETA plus the platforms Mio is on.
 * Dark scrim on the copy side keeps text crisp; mirrored for RTL.
 */
export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#3a1610]">
      {/* Full-bleed food photography (mirrored in RTL so copy sits over the void) */}
      <Image
        src="/images/mainslider.png"
        alt="Wood-fired pepperoni pizza on a plate with tomatoes, olive oil and fresh basil"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right rtl:-scale-x-100"
      />

      {/* Readability scrim — dark on the copy side, fading to reveal the pizza */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rtl:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(38,13,8,0.94) 0%, rgba(38,13,8,0.78) 28%, rgba(38,13,8,0.28) 54%, rgba(38,13,8,0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden rtl:block"
        style={{
          background:
            "linear-gradient(270deg, rgba(38,13,8,0.94) 0%, rgba(38,13,8,0.78) 28%, rgba(38,13,8,0.28) 54%, rgba(38,13,8,0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(28,9,5,0.65) 0%, rgba(28,9,5,0) 42%)",
        }}
      />

      {/* Copy */}
      <div className="section relative z-10 w-full pt-24">
        <div className="max-w-xl">
          <h1 className="font-bold leading-[1.02] tracking-tight text-white">
            <span className="block text-5xl sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </span>
            <span className="mt-2 block text-3xl font-semibold text-cream sm:text-4xl lg:text-5xl">
              {t("hero.subtitle")}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/85">
            {t("hero.description")}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#order"
              className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-105 hover:bg-white"
            >
              {t("hero.ctaOrder")}
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-cream/50 px-8 py-4 text-sm font-bold uppercase tracking-wide text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10"
            >
              {t("hero.ctaMenu")}
              <FaPizzaSlice className="text-cream/80" />
            </Link>
          </div>

          {/* Delivery + platforms bar */}
          <div className="mt-10 inline-flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-cream/20 bg-black/25 px-5 py-3 backdrop-blur-md">
            <span className="flex items-center gap-3 text-cream">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-rust text-cream">
                <MdDeliveryDining size={20} />
              </span>
              <span className="text-xs font-bold uppercase leading-tight tracking-wide">
                {t("hero.deliveryTime")}
              </span>
            </span>

            <span className="hidden h-8 w-px bg-cream/20 sm:block" aria-hidden="true" />

            <span className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-cream/70">
                {t("hero.alsoOn")}
              </span>
              <span className="flex items-center gap-2">
                {DELIVERY_PLATFORMS.map((p) => (
                  <span
                    key={p.id}
                    className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5"
                    title={p.name}
                  >
                    <span
                      className="relative h-full w-full"
                      style={{ transform: `scale(${p.zoom})` }}
                    >
                      <Image
                        src={p.logo}
                        alt={p.name}
                        fill
                        sizes="32px"
                        className="object-contain p-1"
                      />
                    </span>
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
