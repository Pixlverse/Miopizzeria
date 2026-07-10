import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { formatPrice } from "@/utils/formatters";

/**
 * Poster-style product card. The photo is a portrait 9:16 brand poster with the
 * product name already baked in, so the card shows it uncropped and only layers
 * a price badge + an Order action that lifts on hover.
 */
export default function ProductCard({ item, index = 0, className = "" }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-rust shadow-card transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-card-hover ${className}`}
    >
      {/* Full poster — 9:16, uncropped */}
      <div className="relative aspect-[9/16] w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category pill */}
        {item.category && (
          <span className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md ring-1 ring-white/20">
            {item.category}
          </span>
        )}

        {/* Price badge */}
        <span className="absolute right-4 top-4 rounded-full bg-cream px-3.5 py-1.5 text-sm font-bold text-rust shadow-lg">
          {formatPrice(item.price)}
        </span>

        {/* Bottom scrim + action */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 pt-16">
          <Link
            href="/#order"
            aria-label={`Order ${item.name}`}
            className="group/btn flex translate-y-2 items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-bold uppercase tracking-wide text-rust opacity-0 shadow-lg transition-all duration-500 ease-bounce hover:bg-white group-hover:translate-y-0 group-hover:opacity-100"
          >
            Order Now
            <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
