import { useCallback, useEffect, useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";
import { ACCEPT_ATTR, uploadImage, validateImage } from "@/utils/upload";

export default function AdminGallery() {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(null); // { done, total }
  const [dragging, setDragging] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/gallery");
      setImages(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load the gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---- Upload (multiple files at once) ---- */
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setError("");

    const rejected = files.filter((f) => validateImage(f));
    if (rejected.length) {
      setError(`Skipped ${rejected.length} file(s): images only, under 5 MB each.`);
    }
    const valid = files.filter((f) => !validateImage(f));
    if (valid.length === 0) return;

    setUploading({ done: 0, total: valid.length });
    const added = [];
    for (const [i, file] of valid.entries()) {
      try {
        const { url, publicId } = await uploadImage(file, "gallery");
        const { data } = await api.post("/gallery", {
          imageUrl: url,
          publicId,
          alt: file.name.replace(/\.[^.]+$/, "").slice(0, 160),
        });
        added.push(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Upload failed.");
      }
      setUploading({ done: i + 1, total: valid.length });
    }
    setImages((prev) => [...prev, ...added]);
    setUploading(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ---- Per-image actions ---- */
  const patch = async (img, changes) => {
    const prev = images;
    setImages((list) => list.map((x) => (x._id === img._id ? { ...x, ...changes } : x)));
    try {
      await api.put(`/gallery/${img._id}`, {
        imageUrl: img.imageUrl,
        publicId: img.publicId,
        alt: img.alt,
        status: img.status,
        order: img.order,
        ...changes,
      });
    } catch (err) {
      setImages(prev);
      setError(err?.response?.data?.message || "Couldn't save that change.");
    }
  };

  const remove = async (img) => {
    if (!window.confirm("Delete this image? It will also be removed from Cloudinary.")) return;
    const prev = images;
    setImages((list) => list.filter((x) => x._id !== img._id));
    try {
      await api.delete(`/gallery/${img._id}`);
    } catch (err) {
      setImages(prev);
      setError(err?.response?.data?.message || "Couldn't delete that image.");
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((img, i) => ({ ...img, order: i }));
    setImages(ordered);
    setSavingOrder(true);
    try {
      await api.patch("/gallery/reorder", {
        items: ordered.map((img) => ({ id: img._id, order: img.order })),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the new order.");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <AdminLayout title="Gallery">
      {error && (
        <div className="mb-4 flex items-start justify-between gap-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="font-bold">
            ×
          </button>
        </div>
      )}

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`mb-6 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
          dragging ? "border-rust bg-rust/5" : "border-slate-300 bg-white hover:border-rust/60"
        } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      >
        {uploading ? (
          <>
            <FiLoader className="animate-spin text-rust" size={26} />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Uploading {uploading.done} of {uploading.total}…
            </p>
          </>
        ) : (
          <>
            <FiUploadCloud className="text-slate-400" size={26} />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Drop images here, or <span className="text-rust">browse</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              PNG, JPG or WebP · up to 5 MB each · you can pick several at once
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Images ({images.length})
        </h2>
        {savingOrder && <span className="text-xs text-slate-400">Saving order…</span>}
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-slate-500">
          Loading…
        </div>
      ) : images.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
          <p className="font-semibold text-slate-700">No gallery images yet</p>
          <p className="mt-1 text-sm">
            Upload some above. Until then the site shows its built-in default photos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={img._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.alt || ""}
                  className={`h-full w-full object-cover ${img.status === "Inactive" ? "opacity-40" : ""}`}
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white">
                  #{i + 1}
                </span>
                {img.status === "Inactive" && (
                  <span className="absolute right-2 top-2 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs font-bold text-white">
                    Hidden
                  </span>
                )}
              </div>

              <div className="space-y-3 p-3">
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
                  placeholder="Alt text (for accessibility & SEO)"
                  defaultValue={img.alt || ""}
                  onBlur={(e) => {
                    const alt = e.target.value;
                    if (alt !== (img.alt || "")) patch(img, { alt });
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      title="Move earlier"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <FiArrowLeft size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === images.length - 1}
                      title="Move later"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <FiArrowRight size={15} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        patch(img, { status: img.status === "Active" ? "Inactive" : "Active" })
                      }
                      title={img.status === "Active" ? "Hide from site" : "Show on site"}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-rust/10 hover:text-rust"
                    >
                      {img.status === "Active" ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(img)}
                      title="Delete"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
