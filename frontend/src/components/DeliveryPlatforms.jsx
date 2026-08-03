import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import PaperTexture from "./PaperTexture";
import { DELIVERY_PLATFORMS } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";
import { useSettings } from "@/hooks/useSettings";

export default function DeliveryPlatforms() {
  const { t } = useI18n();
  const settings = useSettings();
  return (
    // Premium rust panel with curved top/bottom edges and a faint gold lattice.
    <section id="order" className="relative overflow-hidden bg-rust py-16 md:py-24">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #8B3D2F 0%, #A0472F 50%, #8B3D2F 100%)",
        }}
        aria-hidden="true"
      />
      <PaperTexture opacity={0.4} blend="overlay" />

      {/* Faint diamond lattice */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="op-lattice" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M32 0 L64 32 L32 64 L0 32 Z" fill="none" stroke="#FEDCBD" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#op-lattice)" />
      </svg>

      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-cream/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cream/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Curved edges — gentle arcs dome the rust panel top & bottom */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10 w-full md:h-14"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0 H1440 V45 Q720 -10 0 45 Z" fill="#FFFFFF" />
      </svg>
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 w-full md:h-14"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 100 H1440 V55 Q720 110 0 55 Z" fill="#FFFFFF" />
      </svg>

      <div className="section relative z-10 text-center">
        <p className="font-display text-xl italic text-cream/90">{t("delivery.eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{t("delivery.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-cream/80">
          {t("delivery.lead")}
        </p>

        {/* Platform tiles */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {DELIVERY_PLATFORMS.map((p) => (
            <a
              key={p.id}
              href={settings?.deliveryPlatforms?.[p.id] || p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order via ${p.name}`}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
            >
              {/* Brand glow on hover */}
              <span
                aria-hidden="true"
                style={{ backgroundColor: p.color }}
                className="pointer-events-none absolute inset-x-6 -bottom-5 h-14 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
              />

              {/* Logo */}
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl md:h-24 md:w-24">
                <Image
                  src={p.logo}
                  alt={`${p.name} logo`}
                  fill
                  sizes="96px"
                  style={{ transform: `scale(${p.zoom || 1})` }}
                  className="object-cover"
                />
              </span>

              {/* Name + arrow */}
              <span className="relative flex items-center gap-1.5 font-semibold text-ink">
                {p.name}
                <FiArrowUpRight
                  className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: p.color }}
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
