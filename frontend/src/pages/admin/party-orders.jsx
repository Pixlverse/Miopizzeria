import { useCallback, useEffect, useState } from "react";
import {
  FiGift,
  FiCalendar,
  FiUsers,
  FiPhone,
  FiTag,
  FiCheck,
  FiX,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";

const FILTERS = ["All", "Pending", "Confirmed", "Cancelled"];

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

// Build a wa.me link to the customer with a prefilled confirmation message.
function whatsappLink(order) {
  const phone = (order.phone || "").replace(/[^\d]/g, "");
  const parts = [
    `Hi ${order.name}! Your party order with Mio Pizzeria is confirmed. 🎉`,
    order.type && `Occasion: ${order.type}`,
    order.date && `Date: ${order.date}`,
    order.guests && `Guests: ${order.guests}`,
    "",
    "We look forward to hosting you — see you soon!",
  ].filter(Boolean);
  return `https://wa.me/${phone}?text=${encodeURIComponent(parts.join("\n"))}`;
}

export default function AdminPartyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/party-orders");
      setOrders(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load party orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    const prev = orders;
    setOrders((o) => o.map((x) => (x._id === id ? { ...x, status } : x)));
    try {
      await api.patch(`/party-orders/${id}`, { status });
    } catch {
      setOrders(prev);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this request permanently?")) return;
    const prev = orders;
    setOrders((o) => o.filter((x) => x._id !== id));
    try {
      await api.delete(`/party-orders/${id}`);
    } catch {
      setOrders(prev);
    }
  };

  const shown = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const countFor = (f) => (f === "All" ? orders.length : orders.filter((o) => o.status === f).length);

  return (
    <AdminLayout title="Party Orders">
      {/* Filter tabs + refresh */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-rust text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-rust/40"
              }`}
            >
              {f} <span className="opacity-70">({countFor(f)})</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-rust/40"
        >
          <FiRefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-slate-500">
          Loading requests…
        </div>
      ) : shown.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
          <FiGift size={28} className="mb-2 text-slate-400" />
          <p className="font-semibold text-slate-700">
            No {filter !== "All" ? filter.toLowerCase() : ""} requests
          </p>
          <p className="mt-1 text-sm">Party-order requests from the site will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((o) => (
            <div key={o._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {/* Details */}
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                  <Detail
                    Icon={FiPhone}
                    label={o.name}
                    value={<a href={`tel:${o.phone}`} className="text-rust hover:underline">{o.phone}</a>}
                  />
                  <Detail Icon={FiTag} label="Occasion" value={o.type || "—"} />
                  <Detail Icon={FiCalendar} label="Date" value={o.date || "—"} />
                  <Detail Icon={FiUsers} label="Guests" value={o.guests || "—"} />
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLE[o.status]}`}
                  >
                    {o.status}
                  </span>
                  <a
                    href={whatsappLink(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Notify on WhatsApp"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/10 text-[#1da851] hover:bg-[#25D366]/20"
                  >
                    <FaWhatsapp size={17} />
                  </a>
                  {o.status !== "Confirmed" && (
                    <button
                      type="button"
                      onClick={() => setStatus(o._id, "Confirmed")}
                      title="Confirm"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      <FiCheck size={17} />
                    </button>
                  )}
                  {o.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => setStatus(o._id, "Cancelled")}
                      title="Cancel"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                    >
                      <FiX size={17} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(o._id)}
                    title="Delete"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {o.message && (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  “{o.message}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function Detail({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rust/10 text-rust">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="truncate font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
