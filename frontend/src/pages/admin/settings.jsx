import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";

const DAYS = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rust focus:ring-2 focus:ring-rust/20";

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/settings");
        setS({
          restaurantName: data.restaurantName || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          hours: data.hours || {},
          socialLinks: data.socialLinks || {},
          deliveryPlatforms: data.deliveryPlatforms || {},
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Couldn't load settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key, value) => setS((prev) => ({ ...prev, [key]: value }));
  const setHours = (day, part, value) =>
    setS((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours?.[day], [part]: value } },
    }));
  const setClosed = (day, closed) =>
    setS((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours?.[day], closed } },
    }));
  const setNested = (group, key, value) =>
    setS((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    setError("");
    try {
      await api.put("/settings", s);
      setMsg("Settings saved.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-slate-500">
          Loading…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-6">
        <Section title="General">
          <div className="grid gap-4 sm:grid-cols-2">
            <Labeled label="Restaurant name">
              <input className={field} value={s.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
            </Labeled>
            <Labeled label="Phone">
              <input className={field} value={s.phone} onChange={(e) => set("phone", e.target.value)} />
            </Labeled>
            <Labeled label="Email">
              <input className={field} value={s.email} onChange={(e) => set("email", e.target.value)} />
            </Labeled>
            <Labeled label="Address">
              <input className={field} value={s.address} onChange={(e) => set("address", e.target.value)} />
            </Labeled>
          </div>
        </Section>

        <Section title="Opening hours">
          <div className="space-y-2">
            {DAYS.map((day) => {
              const closed = !!s.hours?.[day]?.closed;
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium capitalize text-slate-700">{day}</span>
                  {closed ? (
                    <span className="flex-1 text-sm font-medium italic text-slate-400">Closed all day</span>
                  ) : (
                    <>
                      <input
                        className={`${field} max-w-[130px]`}
                        placeholder="Open (e.g. 11:00)"
                        value={s.hours?.[day]?.open || ""}
                        onChange={(e) => setHours(day, "open", e.target.value)}
                      />
                      <span className="text-slate-400">—</span>
                      <input
                        className={`${field} max-w-[130px]`}
                        placeholder="Close (e.g. 23:00)"
                        value={s.hours?.[day]?.close || ""}
                        onChange={(e) => setHours(day, "close", e.target.value)}
                      />
                    </>
                  )}
                  <label className="ms-auto flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={closed}
                      onChange={(e) => setClosed(day, e.target.checked)}
                    />
                    Closed
                  </label>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Social links">
          <div className="grid gap-4 sm:grid-cols-3">
            {["instagram", "facebook", "whatsapp"].map((k) => (
              <Labeled key={k} label={k}>
                <input
                  className={field}
                  value={s.socialLinks?.[k] || ""}
                  onChange={(e) => setNested("socialLinks", k, e.target.value)}
                />
              </Labeled>
            ))}
          </div>
        </Section>

        <Section title="Delivery platform links">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["snoonu", "talabat", "rafeeq", "keeta"].map((k) => (
              <Labeled key={k} label={k}>
                <input
                  className={field}
                  value={s.deliveryPlatforms?.[k] || ""}
                  onChange={(e) => setNested("deliveryPlatforms", k, e.target.value)}
                />
              </Labeled>
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-rust-dark disabled:opacity-60"
          >
            <FiSave size={16} /> {saving ? "Saving…" : "Save settings"}
          </button>
          {msg && <span className="text-sm font-semibold text-green-600">{msg}</span>}
        </div>
      </div>
    </AdminLayout>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium capitalize text-slate-700">{label}</span>
      {children}
    </label>
  );
}
