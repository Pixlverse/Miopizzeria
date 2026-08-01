import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiKey, FiUser } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";
import { getUser } from "@/utils/adminAuth";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rust focus:ring-2 focus:ring-rust/20";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users");
      setUsers(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMe(getUser());
    load();
  }, [load]);

  const addUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setMsg("");
    if (!email.trim() || password.length < 8) {
      setFormError("Enter a valid email and a password of at least 8 characters.");
      return;
    }
    setAdding(true);
    try {
      const { data } = await api.post("/users", { email: email.trim(), password });
      setUsers((u) => [...u, data]);
      setEmail("");
      setPassword("");
      setMsg("Admin user created.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Couldn't create user.");
    } finally {
      setAdding(false);
    }
  };

  const resetPassword = async (id) => {
    const pw = window.prompt("Enter a new password (min 8 characters):");
    if (!pw) return;
    if (pw.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    try {
      await api.put(`/users/${id}/password`, { password: pw });
      alert("Password updated.");
    } catch (err) {
      alert(err?.response?.data?.message || "Couldn't update password.");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this admin user?")) return;
    const prev = users;
    setUsers((u) => u.filter((x) => x._id !== id));
    try {
      await api.delete(`/users/${id}`);
    } catch (err) {
      setUsers(prev);
      alert(err?.response?.data?.message || "Couldn't delete user.");
    }
  };

  const isMe = (u) => me && (me.id === u._id || me.email === u.email);

  return (
    <AdminLayout title="Users">
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Add admin */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Add admin user</h2>
        <form onSubmit={addUser} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@miopizzeria.qa" />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <input className={field} type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 8 characters" />
          </label>
          <button
            type="submit"
            disabled={adding}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rust px-5 py-2 text-sm font-bold text-white hover:bg-rust-dark disabled:opacity-60"
          >
            <FiPlus size={16} /> {adding ? "Adding…" : "Add"}
          </button>
        </form>
        {formError && <p className="mt-2 text-sm font-semibold text-red-600">{formError}</p>}
        {msg && <p className="mt-2 text-sm font-semibold text-green-600">{msg}</p>}
      </div>

      {/* Users list */}
      {loading ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-slate-500">
          Loading…
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-rust/10 text-rust">
                        <FiUser size={15} />
                      </span>
                      {u.email}
                      {isMe(u) && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">You</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => resetPassword(u._id)}
                        title="Reset password"
                        className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-rust/10 hover:text-rust"
                      >
                        <FiKey size={15} />
                      </button>
                      {!isMe(u) && (
                        <button
                          type="button"
                          onClick={() => removeUser(u._id)}
                          title="Delete"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
