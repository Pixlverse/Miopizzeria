import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiArchive, FiRotateCcw, FiX, FiStar } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import api from "@/utils/api";
import { deleteImage } from "@/utils/upload";

const TAG_OPTIONS = ["Vegetarian", "Spicy", "New", "Gluten-Free"];
const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  imageUrl: "",
  imagePublicId: "",
  tags: [],
  bestSeller: false,
  status: "Active",
};

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rust focus:ring-2 focus:ring-rust/20";

export default function AdminMenu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [view, setView] = useState("active"); // "active" | "archived"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCat, setNewCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  // The image the item had when the modal opened — destroyed once a replacement saves.
  const [originalPublicId, setOriginalPublicId] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = view === "archived" ? { archived: true } : {};
      const [c, m] = await Promise.all([
        api.get("/categories"),
        api.get("/menu-items", { params }),
      ]);
      setCategories(c.data || []);
      setItems(m.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load menu data.");
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---- Categories ---- */
  const addCategory = async (e) => {
    e.preventDefault();
    const name = newCat.trim();
    if (!name) return;
    try {
      const { data } = await api.post("/categories", { name, order: categories.length });
      setCategories((c) => [...c, data]);
      setNewCat("");
    } catch (err) {
      alert(err?.response?.data?.message || "Couldn't add category.");
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const prev = categories;
    setCategories((c) => c.filter((x) => x._id !== id));
    try {
      await api.delete(`/categories/${id}`);
    } catch {
      setCategories(prev);
    }
  };

  /* ---- Items ---- */
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?.name || "" });
    setOriginalPublicId("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      category: item.category || "",
      price: item.price ?? "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      imagePublicId: item.imagePublicId || "",
      tags: item.tags || [],
      bestSeller: !!item.bestSeller,
      status: item.status || "Active",
    });
    setOriginalPublicId(item.imagePublicId || "");
    setFormError("");
    setModalOpen(true);
  };

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((x) => x !== tag) : [...f.tags, tag],
    }));

  const saveItem = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.category || form.price === "") {
      setFormError("Name, category and price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description,
      imageUrl: form.imageUrl,
      imagePublicId: form.imagePublicId,
      tags: form.tags,
      bestSeller: form.bestSeller,
      status: form.status,
    };
    try {
      if (editingId) {
        const { data } = await api.put(`/menu-items/${editingId}`, payload);
        setItems((it) => it.map((x) => (x._id === editingId ? data : x)));
      } else {
        const { data } = await api.post("/menu-items", payload);
        setItems((it) => [...it, data]);
      }
      // The save stuck, so the image it replaced is now unreferenced.
      if (originalPublicId && originalPublicId !== form.imagePublicId) {
        deleteImage(originalPublicId);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Couldn't save item.");
    } finally {
      setSaving(false);
    }
  };

  const archiveItem = async (id) => {
    if (!window.confirm("Archive this item? It will be hidden from the menu but can be restored later."))
      return;
    const prev = items;
    setItems((it) => it.filter((x) => x._id !== id));
    try {
      await api.delete(`/menu-items/${id}`);
    } catch {
      setItems(prev);
    }
  };

  const restoreItem = async (id) => {
    const prev = items;
    setItems((it) => it.filter((x) => x._id !== id));
    try {
      await api.patch(`/menu-items/${id}/restore`);
    } catch {
      setItems(prev);
    }
  };

  return (
    <AdminLayout title="Menu">
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Categories */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Categories</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <span
              key={c._id}
              className="inline-flex items-center gap-2 rounded-full bg-rust/10 px-3 py-1.5 text-sm font-semibold text-rust"
            >
              {c.name}
              <button type="button" onClick={() => removeCategory(c._id)} className="text-rust/60 hover:text-rust">
                <FiX size={14} />
              </button>
            </span>
          ))}
          {categories.length === 0 && <span className="text-sm text-slate-400">No categories yet.</span>}
        </div>
        <form onSubmit={addCategory} className="mt-4 flex gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
            className={`${field} max-w-xs`}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-rust px-4 py-2 text-sm font-semibold text-white hover:bg-rust-dark"
          >
            <FiPlus size={16} /> Add
          </button>
        </form>
      </div>

      {/* Items */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            {view === "archived" ? "Archived" : "Menu Items"} ({items.length})
          </h2>
          <div className="flex rounded-full bg-slate-100 p-0.5">
            {["active", "archived"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${
                  view === v ? "bg-white text-rust shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        {view === "active" && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-rust px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rust-dark"
          >
            <FiPlus size={16} /> Add Item
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-slate-500">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
          <p className="font-semibold text-slate-700">
            {view === "archived" ? "No archived items" : "No menu items yet"}
          </p>
          <p className="mt-1 text-sm">
            {view === "archived"
              ? "Items you archive will appear here and can be restored."
              : "Add a category, then create your first item."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it._id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                      {it.bestSeller && <FiStar className="fill-amber-400 text-amber-400" size={14} />}
                      {it.name}
                    </span>
                    {it.tags?.length > 0 && (
                      <span className="mt-0.5 block text-xs text-slate-400">{it.tags.join(", ")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{it.category}</td>
                  <td className="px-4 py-3 font-semibold text-rust">QAR {it.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        it.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {view === "archived" ? (
                        <button
                          type="button"
                          onClick={() => restoreItem(it._id)}
                          title="Restore"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          <FiRotateCcw size={15} />
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(it)}
                            title="Edit"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-rust/10 hover:text-rust"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => archiveItem(it._id)}
                            title="Archive"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                          >
                            <FiArchive size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit item" : "Add item"}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={saveItem} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    className={field}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price (QAR)</label>
                  <input
                    type="number"
                    min="0"
                    className={field}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows={2}
                  className={field}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <ImageUploader
                label="Image (optional)"
                folder="menu"
                value={form.imageUrl}
                publicId={form.imagePublicId}
                onChange={({ url, publicId }) =>
                  setForm((f) => ({ ...f, imageUrl: url, imagePublicId: publicId }))
                }
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        form.tags.includes(tag)
                          ? "bg-rust text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.bestSeller}
                    onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })}
                  />
                  Best seller
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  Status
                  <select
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

              {formError && <p className="text-sm font-semibold text-red-600">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-rust px-5 py-2 text-sm font-bold text-white hover:bg-rust-dark disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
