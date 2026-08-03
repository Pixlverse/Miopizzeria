import { Fragment } from "react";
import Image from "next/image";
import { FiMapPin, FiClock, FiPhone, FiNavigation, FiExternalLink } from "react-icons/fi";
import { FaCar, FaChair, FaPizzaSlice, FaHeart } from "react-icons/fa";
import SectionBackdrop from "./SectionBackdrop";
import { BRANCHES } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";
import { useSettings } from "@/hooks/useSettings";

const DAY_KEYS = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const FEATURES = [
  { Icon: FaCar, key: "parking" },
  { Icon: FaChair, key: "ambience" },
  { Icon: FaPizzaSlice, key: "cuisine" },
  { Icon: FaHeart, key: "loved" },
];

export default function Location({ hideHeader = false }) {
  const { t } = useI18n();
  const settings = useSettings();
  const branch = BRANCHES[0];

  // Live settings win; fall back to the static branch until loaded.
  const phone = settings?.phone || branch.phone;
  const address = settings?.address || branch.address;

  // Build the hours list from settings (object) or the branch (array) fallback,
  // always with translated day names.
  const byDay = {};
  (branch.hours || []).forEach((h) => {
    byDay[h.day.toLowerCase()] = h.time;
  });
  const hours = DAY_KEYS.map((d) => {
    const sh = settings?.hours?.[d];
    let time = "";
    if (sh) time = sh.closed ? t("location.closed") : `${sh.open || ""} – ${sh.close || ""}`;
    else time = byDay[d] || "";
    return { key: d, day: t(`location.days.${d}`), time };
  }).filter((h) => h.time);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapQuery)}`;
  const placeUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`;

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <SectionBackdrop />

      <div className="section relative z-10">
        {!hideHeader && (
          <div className="mb-12 text-center">
            <p className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-rust/70">
              <span className="h-px w-8 bg-rust/30" aria-hidden="true" />
              {t("location.eyebrow")}
              <span className="h-px w-8 bg-rust/30" aria-hidden="true" />
            </p>
            <h2 className="mt-2 font-display text-5xl text-ink md:text-6xl">{t("location.title")}</h2>
            <p className="mt-2 font-display text-lg italic text-muted">{t("location.welcome")}</p>
          </div>
        )}

        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-rust/10 md:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — details */}
            <div className="flex flex-col">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rust text-cream">
                  <FiMapPin size={20} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                    {branch.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {t("location.tagline")}
                  </p>
                  <span className="mt-2 block h-0.5 w-12 rounded-full bg-rust/40" />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-rust/5 p-4">
                <FiMapPin className="mt-0.5 shrink-0 text-rust/60" size={18} />
                <p className="leading-relaxed text-muted">{address}</p>
              </div>

              <hr className="my-6 border-rust/10" />

              <div>
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rust text-cream">
                    <FiClock size={20} />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-rust">
                    {t("location.hoursTitle")}
                  </p>
                </div>
                <ul className="mt-4 grid grid-cols-[auto_auto] justify-start gap-x-6 gap-y-1.5 text-sm">
                  {hours.map((h) => (
                    <Fragment key={h.key}>
                      <span className="text-ink">{h.day}</span>
                      <span className="whitespace-nowrap font-semibold text-rust">{h.time}</span>
                    </Fragment>
                  ))}
                </ul>
              </div>

              <hr className="my-6 border-rust/10" />

              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rust text-cream">
                  <FiPhone size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-rust">
                    {t("location.call")}
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="font-display text-xl text-ink transition-colors hover:text-rust"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Right — map + interior */}
            <div className="flex flex-col gap-4">
              <div className="relative h-64 overflow-hidden rounded-2xl ring-1 ring-rust/10">
                <iframe
                  title={branch.name}
                  src={mapSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rust shadow-md backdrop-blur transition-colors hover:bg-white"
                >
                  <FiExternalLink size={14} /> {t("location.openInMaps")}
                </a>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-2xl">
                <Image
                  src="/images/rest3.jpg"
                  alt="Inside Mio Pizzeria"
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-1 bg-gradient-to-t from-[#3a160e]/95 via-[#3a160e]/80 to-transparent px-2 pb-3 pt-10">
                  {FEATURES.map(({ Icon, key }) => (
                    <div key={key} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon className="text-cream" size={18} />
                      <span className="text-[10px] font-semibold leading-tight text-cream/90">
                        {t(`location.features.${key}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-rust py-4 text-sm font-bold uppercase tracking-wide text-cream shadow-md transition-colors hover:bg-rust-dark"
          >
            <FiNavigation className="transition-transform group-hover:translate-x-0.5" size={16} />
            {t("location.directions")}
          </a>
        </div>
      </div>
    </section>
  );
}
