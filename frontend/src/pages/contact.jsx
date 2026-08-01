import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiClock, FiSend } from "react-icons/fi";
import Layout from "@/components/Layout";
import Location from "@/components/Location";
import DeliveryPlatforms from "@/components/DeliveryPlatforms";
import Faq from "@/components/Faq";
import { useI18n } from "@/context/LocaleContext";

// Floating contact-themed icons scattered across the hero.
const FLOATERS = [
  { Icon: FiMail, cls: "left-[8%] top-[26%] h-14 w-14" },
  { Icon: FiPhone, cls: "right-[10%] top-[22%] h-16 w-16" },
  { Icon: FiMapPin, cls: "left-[16%] bottom-[18%] h-12 w-12" },
  { Icon: FiMessageCircle, cls: "right-[16%] bottom-[24%] h-14 w-14" },
  { Icon: FiClock, cls: "left-[44%] top-[12%] hidden h-10 w-10 md:block" },
  { Icon: FiSend, cls: "right-[38%] bottom-[12%] hidden h-12 w-12 md:block" },
];

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <Layout title={t("nav.contact")}>
      {/* Catchy, unique hero — warm mesh gradient with a grid + floating icons */}
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-28 md:pt-36">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 120% at 15% 10%, #C4623F 0%, #A6412C 45%, #5E2A20 100%)",
          }}
        />
        {/* Grid pattern, masked to fade at the edges */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(75% 75% at 50% 40%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(75% 75% at 50% 40%, #000 40%, transparent 100%)",
          }}
        />
        {/* Glows */}
        <div aria-hidden className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />
        <div aria-hidden className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rust-light/20 blur-3xl" />
        {/* Floating icons */}
        {FLOATERS.map(({ Icon, cls }, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute grid place-items-center rounded-2xl bg-white/[0.04] text-cream/30 ring-1 ring-white/[0.06] ${cls}`}
          >
            <Icon className="h-[42%] w-[42%]" />
          </span>
        ))}

        <div className="section relative z-10 text-center">
          <p className="font-display text-xl italic text-cream/80">Come say hi</p>
          <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">Get in Touch</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            Questions, comments, heat tolerance — we'd love to hear from you! Drop by, call, or
            message us anytime.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#locations"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-transform hover:scale-105"
            >
              <FiMapPin /> Find us
            </a>
            <a
              href="#faq"
              className="inline-flex items-center gap-2 rounded-full border border-cream/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-white/10"
            >
              <FiMessageCircle /> FAQs
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
