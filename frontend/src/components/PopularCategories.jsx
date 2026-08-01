import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";
import { POPULAR_CATEGORIES } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

export default function PopularCategories() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <SectionBackdrop tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mb-10 text-center">
          <p className="font-display text-xl italic text-rust-light">{t("categories.eyebrow")}</p>
          <h2 className="section-title mt-2">{t("categories.title")}</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {POPULAR_CATEGORIES.map((cat) => {
            const name = t(`categories.${cat.nameKey}`);
            const desc = t(`categories.desc.${cat.nameKey}`);
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative flex min-h-[17rem] items-center overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5 sm:min-h-[19rem] lg:min-h-[16rem]"
              >
                {/* Full-scene photo — product sits on the right (mirrored for RTL).
                    Mirror and hover-zoom live on separate wrappers so they don't
                    fight over the same transform. */}
                <div className="absolute inset-0 rtl:-scale-x-100">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={cat.image}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 92vw, 46vw"
                      className="object-cover"
                      style={
                        cat.zoom
                          ? { transform: `scale(${cat.zoom})`, transformOrigin: cat.origin || "center" }
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Left scrim for copy contrast (flips side in RTL) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rtl:hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(58,20,13,0.85) 0%, rgba(58,20,13,0.55) 35%, rgba(58,20,13,0) 62%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 hidden rtl:block"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(58,20,13,0.85) 0%, rgba(58,20,13,0.55) 35%, rgba(58,20,13,0) 62%)",
                  }}
                />

                {/* Copy — in normal flow so the tile grows to fit it (never clips) */}
                <div className="relative z-10 flex max-w-[62%] flex-col p-7 md:p-9">
                  <h3 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                    {name}
                  </h3>
                  <span className="mt-3 block h-px w-10 bg-cream/50" />
                  <p className="mt-3 text-sm leading-relaxed text-cream/85 md:text-base">
                    {desc}
                  </p>
                  <span className="mt-5 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-rust shadow-md transition-all duration-300 group-hover:gap-3 group-hover:bg-white">
                    {t("categories.viewItems")}
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
