import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCoffee, FiCalendar, FiClock, FiGift, FiSettings, FiArrowRight } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ items: null, pendingBookings: null, pendingParties: null });

  useEffect(() => {
    (async () => {
      try {
        const [m, b, p] = await Promise.all([
          api.get("/menu-items"),
          api.get("/bookings"),
          api.get("/party-orders"),
        ]);
        setStats({
          items: (m.data || []).length,
          pendingBookings: (b.data || []).filter((x) => x.status === "Pending").length,
          pendingParties: (p.data || []).filter((x) => x.status === "Pending").length,
        });
      } catch {
        setStats({ items: "—", pendingBookings: "—", pendingParties: "—" });
      }
    })();
  }, []);

  const cards = [
    { label: "Pending Bookings", value: stats.pendingBookings, Icon: FiClock },
    { label: "Pending Party Orders", value: stats.pendingParties, Icon: FiGift },
    { label: "Menu Items", value: stats.items, Icon: FiCoffee },
  ];

  const actions = [
    { href: "/admin/bookings", label: "Manage bookings", desc: "Confirm or cancel reservations", Icon: FiCalendar },
    { href: "/admin/party-orders", label: "Manage party orders", desc: "Confirm & notify on WhatsApp", Icon: FiGift },
    { href: "/admin/menu", label: "Manage menu", desc: "Add, edit or archive items", Icon: FiCoffee },
    { href: "/admin/settings", label: "Restaurant settings", desc: "Hours, contact, links", Icon: FiSettings },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-rust/10 text-rust">
                <Icon size={22} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {value === null ? "…" : value}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Quick actions
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {actions.map(({ href, label, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-rust/40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-rust/10 group-hover:text-rust">
              <Icon size={20} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">{label}</span>
              <span className="block text-sm text-slate-500">{desc}</span>
            </span>
            <FiArrowRight className="text-slate-400 group-hover:text-rust" />
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
