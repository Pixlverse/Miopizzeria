import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { formatPrice } from "@/utils/formatters";

/**
 * Poster-style menu card — shows the full portrait product image (9:16,
 * uncropped) with overlaid tags, a price badge, and an Order button over a slim
 * bottom gradient. Matches the Featured poster look.
 */
export default function MenuCard({ item, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-rust shadow-card ring-1 ring-black/5 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-card-hover"
    >
      <Image
        src={item.image || item.imageUrl}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Best-seller + tags */}
      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {item.bestSeller && (
          <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink shadow ring-1 ring-black/10">
            ★ Best Seller
          </span>
        )}
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Price */}
      <span className="absolute right-4 top-4 rounded-full bg-cream px-3.5 py-1.5 text-sm font-bold text-rust shadow-lg">
        {formatPrice(item.price)}
      </span>

      {/* Order action over a slim scrim */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-16">
        <Link
          href="/#order"
          aria-label={`Order ${item.name}`}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-bold uppercase tracking-wide text-rust shadow-lg transition-all duration-300 ease-bounce hover:scale-[1.02] hover:bg-white"
        >
          Order Now
          <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
