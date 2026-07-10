import { motion } from "framer-motion";
import Logo from "./Logo";

// Pepperoni positions (relative to a 120x120 viewBox pizza).
const PEPPERONI = [
  [44, 42],
  [78, 46],
  [60, 70],
  [42, 80],
  [82, 78],
  [62, 38],
  [38, 60],
];

function PizzaWheel() {
  return (
    <svg
      viewBox="0 0 120 120"
      width="120"
      height="120"
      className="animate-[spin_1.4s_linear_infinite] drop-shadow-xl"
      aria-hidden="true"
    >
      {/* Crust */}
      <circle cx="60" cy="60" r="55" fill="#8B3D2F" />
      {/* Cheese */}
      <circle cx="60" cy="60" r="48" fill="#FEDCBD" />
      {/* Slice cut lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1="60"
            y1="60"
            x2={60 + 48 * Math.cos(a)}
            y2={60 + 48 * Math.sin(a)}
            stroke="#E9C39E"
            strokeWidth="1.4"
          />
        );
      })}
      {/* Pepperoni */}
      {PEPPERONI.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5.2" fill="#AB4C35" />
      ))}
    </svg>
  );
}

export default function PizzaLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(120deg, #AB4C35 0%, #8B3D2F 100%)" }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <PizzaWheel />

        <div className="mt-8">
          <Logo variant="cream" height={48} priority />
        </div>

        <p className="mt-3 font-display text-lg italic text-cream/80">Slicing things up…</p>

        {/* Determinate progress bar that fills over ~1.5s */}
        <div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-cream/20">
          <div className="loader-bar h-full rounded-full bg-cream" />
        </div>
      </motion.div>
    </motion.div>
  );
}
