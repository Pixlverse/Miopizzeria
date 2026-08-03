import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import { NAV_LINKS } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t, locale, toggleLocale } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on route change.
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // These pages open on full-bleed rust/red hero panels, so let the header sit
  // transparent over them (blending with the hero) until scrolled.
  const HERO_ROUTES = ["/", "/about", "/book", "/menu"];
  const onHero = HERO_ROUTES.includes(router.pathname);
  // Solid when scrolled, off a hero page, OR when the mobile drawer is open
  // (otherwise the transparent header lets the hero bleed through the menu).
  const solid = scrolled || !onHero || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-rust shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-6 md:h-20 md:px-10 lg:px-14">
        <Link href="/" aria-label="Miopizzeria home" className="shrink-0">
          <Logo variant="cream" height={44} priority className="h-10 w-auto lg:h-[52px]" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-semibold text-cream/90 transition-colors hover:text-white ${
                  router.pathname === link.href ? "font-bold text-white" : ""
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/book" className="btn-outline px-5 py-2">
              {t("nav.book")}
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-full border border-cream/40 px-3 py-1.5 text-sm font-semibold text-cream/90 transition-colors hover:border-cream hover:text-white"
              aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              {locale === "ar" ? "EN" : "العربية"}
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-cream md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden bg-rust shadow-xl transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-[85vh]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-1 font-semibold text-cream/90 hover:text-white">
                {t(`nav.${link.key}`)}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/book" className="btn-outline w-full">
              {t("nav.book")}
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleLocale}
              className="w-full rounded-full border border-cream/40 py-2 text-sm font-semibold text-cream/90 hover:border-cream hover:text-white"
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
