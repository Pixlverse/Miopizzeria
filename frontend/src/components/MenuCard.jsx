import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { formatPrice } from "@/utils/formatters";

/**
 * Clean white product card — a photo panel on top, then a centered name,
 * star rating, short description, and a price + order hint. The whole card is
 * a link to the delivery-apps ("order") section.
 */
export default function MenuCard({ item, index = 0 }) {
  // Decorative rating until real review data is wired in.
  const rating = item.bestSeller ? 5 : 4;

  return (
    <Link
      href="/#order"
      aria-label={`Order ${item.name}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2"
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(139,61,47,0.10)] ring-1 ring-rust/5 transition-all duration-400 ease-bounce group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_rgba(139,61,47,0.18)]"
      >
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image || item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
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
            {item.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={14}
                className={i < rating ? "fill-amber-400" : "text-amber-400/30"}
              />
            ))}
          </div>

          <p className="mt-2.5 line-clamp-2 text-sm text-muted">{item.description}</p>

          <div className="mt-auto flex w-full items-center justify-between gap-3 pt-4">
            <span className="text-lg font-bold text-rust">{formatPrice(item.price)}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-rust/70 transition-colors group-hover:text-rust">
              Order
              <FiArrowRight className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
