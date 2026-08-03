import Image from "next/image";
import { FiClipboard, FiTruck, FiCalendar } from "react-icons/fi";
import Layout from "@/components/Layout";
import SectionBackdrop from "@/components/SectionBackdrop";
import HeroBackdrop from "@/components/HeroBackdrop";
import PartyOrderForm from "@/components/PartyOrderForm";
import { useI18n } from "@/context/LocaleContext";

// Dummy showcase of past events (swap for real photos/details later).
const PAST_EVENTS = [
  {
    title: "F1 Grand Prix Watch Party",
    type: "F1 & Watch Parties",
    guests: "60 guests",
    img: "/images/rest1.jpg",
    desc: "A full-house race night with live screens and endless fresh pizza.",
  },
  {
    title: "TechCorp Launch Night",
    type: "Corporate & Office",
    guests: "120 guests",
    img: "/images/rest2.jpg",
    desc: "Corporate catering for a product launch spread across two floors.",
  },
  {
    title: "Al-Sayed Family Birthday",
    type: "Birthdays & Family",
    guests: "40 guests",
    img: "/images/rest3.jpg",
    desc: "A joyful birthday celebration with a custom dessert table.",
  },
  {
    title: "Ramadan Iftar Gathering",
    type: "Community",
    guests: "80 guests",
    img: "/images/rest4.jpg",
    desc: "A warm community iftar with shared platters and fresh juices.",
  },
];

const HIGHLIGHTS = [
  { Icon: FiClipboard, title: "Custom menus", text: "Tailored pizzas & sides for your crowd." },
  { Icon: FiTruck, title: "On-site setup", text: "We deliver, set up and serve." },
  { Icon: FiCalendar, title: "Flexible packages", text: "From 20 to 200+ guests." },
];

export default function EventsPage() {
  const { t } = useI18n();
  const types = t("events.types");

  return (
    <Layout title={t("events.title")}>
      {/* Rust hero header — shared backdrop, no icon/line patterns */}
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-28 md:pt-36">
        <HeroBackdrop />

        <div className="section relative z-10 mx-auto max-w-3xl text-center">
          <p className="font-display text-xl italic text-cream/80">{t("events.eyebrow")}</p>
          <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">{t("events.title")}</h1>
          <p className="mt-6 text-lg leading-relaxed text-cream/85">{t("events.lead")}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(Array.isArray(types) ? types : []).map((type) => (
              <span
                key={type}
                className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-cream ring-1 ring-white/15"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Curved transition into the light content */}
        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      {/* Light content — gallery + request form */}
      <section className="relative overflow-hidden pb-20 pt-10">
        <SectionBackdrop />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(171,76,53,0.13) 1.4px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-32 z-0 h-96 w-96 rounded-full bg-rust-light/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 z-0 h-96 w-96 rounded-full bg-rust/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-24 left-1/4 z-0 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />

        <div className="section relative z-10">
          {/* Events we've done */}
          <div>
            <div className="mb-8 text-center">
              <p className="font-display text-lg italic text-rust-light">Recent celebrations</p>
              <h2 className="mt-1 text-3xl font-bold text-rust md:text-4xl">Events We've Done</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PAST_EVENTS.map((ev) => (
                <article
                  key={ev.title}
                  className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-rust/5 transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={ev.img}
                      alt={ev.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-rust px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream shadow">
                      {ev.type}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold leading-tight text-ink">
                        {ev.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-rust-light">
                      {ev.guests}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{ev.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Request form — side by side with a highlights panel */}
          <div className="mt-20 grid items-start gap-8 lg:grid-cols-2">
            {/* Highlights panel */}
            <div className="rounded-3xl bg-gradient-to-br from-rust to-rust-dark p-8 text-cream shadow-card md:p-10">
              <p className="font-display text-lg italic text-cream/80">Plan with us</p>
              <h2 className="mt-1 text-3xl font-bold text-white md:text-4xl">
                Let's make it memorable
              </h2>
              <p className="mt-4 leading-relaxed text-cream/85">
                Whatever the occasion, we bring the food, the setup and the good vibes. Tell us the
                details and our team will craft the perfect package for you.
              </p>

              <ul className="mt-8 space-y-5">
                {HIGHLIGHTS.map(({ Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream/15 text-cream">
                      <Icon size={19} />
                    </span>
                    <div>
                      <p className="font-bold text-white">{title}</p>
                      <p className="text-sm text-cream/80">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex gap-8 border-t border-cream/20 pt-6">
                <div>
                  <p className="text-3xl font-bold text-white">200+</p>
                  <p className="text-sm text-cream/80">Events catered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">4.7★</p>
                  <p className="text-sm text-cream/80">Guest rating</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <PartyOrderForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
