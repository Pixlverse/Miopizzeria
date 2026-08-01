import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import SectionBackdrop from "./SectionBackdrop";
import { useI18n } from "@/context/LocaleContext";

export default function Faq() {
  const { t } = useI18n();
  const items = t("faq.items");
  const [open, setOpen] = useState(0);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop tone="light" />

      <div className="section relative z-10 mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="font-display text-xl italic text-rust-light">{t("faq.eyebrow")}</p>
          <h2 className="section-title mt-2">{t("faq.title")}</h2>
        </div>

        <div className="space-y-4">
          {(Array.isArray(items) ? items : []).map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white/80 shadow-card backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-ink">{item.q}</span>
                  <FiChevronDown
                    className={`shrink-0 text-rust transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    size={22}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 leading-relaxed text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
