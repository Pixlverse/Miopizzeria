import { FaGoogle, FaStar, FaRegStar } from "react-icons/fa";
import SectionBackdrop from "./SectionBackdrop";
import { GOOGLE_REVIEWS } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

function Stars({ rating, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(rating) ? <FaStar key={n} /> : <FaRegStar key={n} />,
      )}
    </span>
  );
}

export default function GoogleReviews() {
  const { t } = useI18n();
  const { rating, count, reviewUrl, placeUrl, items } = GOOGLE_REVIEWS;
  const ratingLabel = t("reviews.ratingLabel").replace("{count}", count);

  return (
    <section className="relative overflow-hidden pb-14 pt-0 md:pb-20">
      <SectionBackdrop tone="light" />

      <div className="section relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <FaGoogle className="text-rust" size={22} />
              <span className="text-3xl font-bold text-ink">{rating.toFixed(1)}</span>
              <Stars rating={rating} className="text-xl" />
            </div>
            <p className="text-sm text-muted">{ratingLabel}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((r) => (
            <div key={r.id} className="flex flex-col rounded-3xl bg-white/85 p-6 shadow-card backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rust text-base font-bold text-cream">
                  {r.author.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{r.author}</p>
                  {r.meta && <p className="truncate text-xs text-muted">{r.meta}</p>}
                </div>
                <FaGoogle className="ms-auto shrink-0 text-rust/70" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Stars rating={r.rating} />
                {r.time && <span className="text-xs text-muted">{r.time}</span>}
              </div>

              <p className="mt-3 leading-relaxed text-ink/80">“{r.text}”</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-rust-dark px-7 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-rust"
          >
            <FaGoogle /> {t("reviews.leave")}
          </a>
          <a
            href={placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-rust/30 px-7 py-3 text-sm font-bold uppercase tracking-wide text-rust transition-colors hover:bg-rust/10"
          >
            {t("reviews.seeAll")}
          </a>
        </div>
      </div>
    </section>
  );
}
