import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import { NAV_LINKS } from "@/utils/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

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

  // Both the home hero and the About scroll-hero are full-bleed rust panels,
  // so let the header sit transparent over them until scrolled.
  const onHero = router.pathname === "/" || router.pathname === "/about";
  const solid = scrolled || !onHero;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-rust shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="section flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="Miopizzeria home">
          <Logo variant="cream" height={52} priority className="h-11 w-auto md:h-[52px]" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-cream/90 transition-colors hover:text-white ${
                  router.pathname === link.href ? "font-semibold text-white" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#order" className="btn-outline px-5 py-2">
              Order Now
            </Link>
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
        className={`overflow-hidden bg-rust transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-72" : "max-h-0"
        }`}
      >
        <ul className="section flex flex-col gap-4 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-1 text-cream/90 hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#order" className="btn-outline w-full">
              Order Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
