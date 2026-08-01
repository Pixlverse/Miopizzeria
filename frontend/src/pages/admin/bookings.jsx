import { useCallback, useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiPhone,
  FiCheck,
  FiX,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";

const FILTERS = ["All", "Pending", "Confirmed", "Cancelled"];

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings");
      setBookings(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    // Optimistic update, revert on failure.
    const prev = bookings;
    setBookings((b) => b.map((x) => (x._id === id ? { ...x, status } : x)));
    try {
      await api.patch(`/bookings/${id}`, { status });
    } catch {
      setBookings(prev);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    const prev = bookings;
    setBookings((b) => b.filter((x) => x._id !== id));
    try {
      await api.delete(`/bookings/${id}`);
    } catch {
      setBookings(prev);
    }
  };

  const shown = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);
  const countFor = (f) => (f === "All" ? bookings.length : bookings.filter((b) => b.status === f).length);

  return (
    <AdminLayout title="Bookings">
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
          Loading bookings…
        </div>
      ) : shown.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
          <FiCalendar size={28} className="mb-2 text-slate-400" />
          <p className="font-semibold text-slate-700">No {filter !== "All" ? filter.toLowerCase() : ""} bookings</p>
          <p className="mt-1 text-sm">Reservations submitted from the site will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((b) => (
            <div
              key={b._id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              {/* Details */}
              <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                <Detail Icon={FiCalendar} label="Date" value={fmtDate(b.date)} />
                <Detail Icon={FiClock} label="Time" value={b.time} />
                <Detail Icon={FiUsers} label="Guests" value={b.guests} />
                <Detail
                  Icon={FiPhone}
                  label={b.name}
                  value={<a href={`tel:${b.phone}`} className="text-rust hover:underline">{b.phone}</a>}
                />
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLE[b.status]}`}
                >
                  {b.status}
                </span>
                {b.status !== "Confirmed" && (
                  <button
                    type="button"
                    onClick={() => setStatus(b._id, "Confirmed")}
                    title="Confirm"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <FiCheck size={17} />
                  </button>
                )}
                {b.status !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => setStatus(b._id, "Cancelled")}
                    title="Cancel"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                  >
                    <FiX size={17} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(b._id)}
                  title="Delete"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
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
