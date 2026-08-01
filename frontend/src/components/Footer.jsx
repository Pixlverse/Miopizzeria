import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import Logo from "./Logo";
import PaperTexture from "./PaperTexture";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-rust-dark text-cream/90">
      <PaperTexture opacity={0.35} blend="overlay" />
      <div className="section relative z-10 grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <Logo variant="cream" height={44} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {BRAND.about}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 font-semibold text-cream">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/login" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-semibold text-cream">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>{BRAND.address}</li>
            <li>
              <a href={`tel:${BRAND.phone}`} className="hover:text-white">
                {BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="mb-4 font-semibold text-cream">Follow Us</h4>
          <div className="flex gap-3">
            {[
              { href: SOCIAL_LINKS.instagram, Icon: FaInstagram, label: "Instagram" },
              { href: SOCIAL_LINKS.facebook, Icon: FaFacebookF, label: "Facebook" },
              { href: SOCIAL_LINKS.whatsapp, Icon: FaWhatsapp, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-all hover:scale-110 hover:bg-cream hover:text-rust"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-cream/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
