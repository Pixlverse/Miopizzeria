import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/formatters";
import { useI18n } from "@/context/LocaleContext";
import Logo from "./Logo";
import OrderModal from "./OrderModal";

/**
 * Clean white product card — a square photo panel on top, then a centered
 * name, short description and price. Clicking the card opens the dish dialog,
 * which hands the guest off to a delivery app.
 *
 * Items without a photo yet get a branded rust panel instead, so the grid stays
 * even while the team uploads images from the admin.
 */
export default function MenuCard({ item, index = 0 }) {
  const [open, setOpen] = useState(false);
  const { locale } = useI18n();

  const image = item.image || item.imageUrl;
  const isAr = locale === "ar";
  const name = (isAr && item.nameAr) || item.name;
  const description = (isAr && item.descriptionAr) || item.description;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={name}
        className="group block h-full w-full text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2"
      >
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
          className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(139,61,47,0.10)] ring-1 ring-rust/5 transition-all duration-400 ease-bounce group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_rgba(139,61,47,0.18)]"
        >
          {/* Photo — square. Falls back to a brand panel when there's no image yet. */}
          <div className="relative aspect-square overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center bg-gradient-to-br from-rust to-rust-dark"
                aria-hidden="true"
              >
                <Logo variant="cream" height={40} />
              </div>
            )}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {item.bestSeller && (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink shadow ring-1 ring-black/10">
                  ★ Best Seller
                </span>
              )}
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col items-center p-5 text-center">
            <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover:text-rust">
              {name}
            </h3>

            <p className="mt-2.5 line-clamp-2 text-sm text-muted">{description}</p>

            <div className="mt-auto pt-4">
              <span className="text-lg font-bold text-rust">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
        </motion.article>
      </button>

      <OrderModal item={item} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
