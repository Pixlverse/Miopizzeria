import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { FiGrid, FiCoffee, FiCalendar, FiGift, FiImage, FiSettings, FiUsers, FiLogOut, FiExternalLink } from "react-icons/fi";
import Logo from "@/components/Logo";
import { getToken, getUser, clearSession } from "@/utils/adminAuth";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: FiGrid },
  { href: "/admin/bookings", label: "Bookings", Icon: FiCalendar },
  { href: "/admin/party-orders", label: "Party Orders", Icon: FiGift },
  { href: "/admin/menu", label: "Menu", Icon: FiCoffee },
  { href: "/admin/gallery", label: "Gallery", Icon: FiImage },
  { href: "/admin/settings", label: "Settings", Icon: FiSettings },
  { href: "/admin/users", label: "Users", Icon: FiUsers },
];

export default function AdminLayout({ title, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setUser(getUser());
    setReady(true);
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/admin/login");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F6F1EA] text-[#8A7C6E]">
        Loading…
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex min-h-screen bg-[#F6F1EA] text-[#33291F]">
      <Head>
        <title>{title} | Mio Admin</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#2A211C] text-[#CFC5BB] md:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <Logo variant="cream" height={34} />
          <span className="text-sm font-semibold uppercase tracking-widest text-[#A99C8D]">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#CFC5BB] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-6 py-3 text-sm text-[#A99C8D] hover:text-white"
        >
          <FiExternalLink size={16} /> View site
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 border-t border-white/10 px-6 py-4 text-sm text-[#CFC5BB] hover:text-white"
        >
          <FiLogOut size={16} /> Log out
        </button>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E7DECF] bg-white px-6 py-4 md:px-8">
          <h1 className="text-xl font-bold text-[#2A211C]">{title}</h1>
          <div className="flex items-center gap-3 text-sm text-[#8A7C6E]">
            <span className="hidden sm:inline">{user?.email}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rust font-bold text-white">
              {(user?.email || "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
