import { FiMapPin, FiMessageCircle } from "react-icons/fi";
import Layout from "@/components/Layout";
import Location from "@/components/Location";
import DeliveryPlatforms from "@/components/DeliveryPlatforms";
import Faq from "@/components/Faq";
import HeroBackdrop from "@/components/HeroBackdrop";
import { useI18n } from "@/context/LocaleContext";

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <Layout title={t("nav.contact")}>
      {/* Rust hero header — shared backdrop, no icon/line patterns */}
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-28 md:pt-36">
        <HeroBackdrop />

        <div className="section relative z-10 text-center">
          <p className="font-display text-xl italic text-cream/80">{t("contact.eyebrow")}</p>
          <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">{t("contact.title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            {t("contact.lead")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#locations"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-transform hover:scale-105"
            >
              <FiMapPin /> {t("contact.findUs")}
            </a>
            <a
              href="#faq"
              className="inline-flex items-center gap-2 rounded-full border border-cream/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-white/10"
            >
              <FiMessageCircle /> {t("contact.faqs")}
            </a>
          </div>
        </div>

        {/* Curved transition into the light sections */}
        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      <div id="locations">
        <Location hideHeader />
      </div>
      <DeliveryPlatforms />
      <div id="faq">
        <Faq />
      </div>
    </Layout>
  );
}
