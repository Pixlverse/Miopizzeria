import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";
import { BRAND, HOURS } from "@/utils/constants";

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  BRAND.address
)}`;

export default function Location() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop />

      <div className="section relative z-10">
        <div className="mb-12 text-center">
          <p className="font-display text-xl italic text-rust-light">Come say hi</p>
          <h2 className="section-title mt-2">Visit Us</h2>
        </div>

        {/* Map with floating info card */}
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-card">
            <iframe
              title="Miopizzeria location"
              src="https://www.google.com/maps?q=Doha%2C%20Qatar&output=embed"
              className="h-[420px] w-full border-0 md:h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="relative z-10 mx-auto -mt-24 w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-7 shadow-2xl md:absolute md:left-10 md:top-1/2 md:mx-0 md:mt-0 md:w-[24rem] md:-translate-y-1/2">
            <h3 className="text-2xl font-bold text-ink">{BRAND.name} Doha</h3>

            <p className="mt-3 flex items-start gap-3 text-muted">
              <FiMapPin className="mt-0.5 shrink-0 text-rust" size={18} />
              <span>{BRAND.address}</span>
            </p>

            <hr className="my-5 border-neutral" />

            <div className="flex items-start gap-3">
              <FiClock className="mt-0.5 shrink-0 text-rust" size={18} />
              <div className="flex-1 space-y-1 text-sm">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4">
                    <span className="text-muted">{h.day}</span>
                    <span className="font-medium text-ink">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <FiPhone className="shrink-0 text-rust" size={18} />
              <a href={`tel:${BRAND.phone}`} className="text-sm text-ink hover:text-rust">
                {BRAND.phone}
              </a>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center rounded-2xl bg-rust-dark py-3.5 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-rust"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
