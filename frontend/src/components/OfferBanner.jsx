import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";
import { HOME_OFFER } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

/**
 * Home promo — a single editable image (HOME_OFFER.image) that links to a menu
 * item/section (HOME_OFFER.href). Swap the image + href from the admin later.
 */
export default function OfferBanner() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop tone="light" />

      <div className="section relative z-10">
        <div className="mb-8 text-center">
          <p className="font-display text-xl italic text-rust-light">{t("offer.eyebrow")}</p>
          <h2 className="section-title mt-2">{t("offer.title")}</h2>
        </div>

        <Link
          href={HOME_OFFER.href}
          className="group relative mx-auto block max-w-4xl overflow-hidden rounded-[2rem] shadow-card"
        >
          <Image
            src={HOME_OFFER.image}
            alt={t("offer.alt")}
            width={1600}
            height={800}
            className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-7 py-3 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-transform duration-300 group-hover:scale-105">
            {t("offer.cta")}
            <FiArrowRight className="rtl:rotate-180" />
          </span>
        </Link>
      </div>
    </section>
  );
}
