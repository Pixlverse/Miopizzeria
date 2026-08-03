import { useId, useRef, useState } from "react";
import { FiUploadCloud, FiX, FiLink, FiLoader } from "react-icons/fi";
import { ACCEPT_ATTR, uploadImage, deleteImage } from "@/utils/upload";

/**
 * Click-or-drop image picker that uploads to Cloudinary and reports back the
 * resulting URL. Falls back to a plain URL field (existing /images/… paths, or
 * when Cloudinary isn't configured yet).
 *
 * @param {string}   value      current image URL
 * @param {string}   publicId   current Cloudinary public_id ("" for pasted URLs)
 * @param {Function} onChange   ({ url, publicId }) => void
 * @param {string}   folder     "menu" | "gallery"
 */
export default function ImageUploader({
  value = "",
  publicId = "",
  onChange,
  folder = "menu",
  label = "Image",
  hint = "PNG, JPG or WebP · up to 5 MB",
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  // public_ids uploaded in this session; safe to destroy if swapped out again.
  const sessionUploads = useRef(new Set());

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  // Drop an asset we uploaded moments ago and no longer reference.
  const discardOrphan = (id) => {
    if (id && sessionUploads.current.has(id)) {
      sessionUploads.current.delete(id);
      deleteImage(id);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setBusy(true);
    setProgress(0);
    try {
      const { url, publicId: newId } = await uploadImage(file, folder, setProgress);
      sessionUploads.current.add(newId);
      discardOrphan(publicId);
      onChange({ url, publicId: newId });
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = () => {
    discardOrphan(publicId);
    onChange({ url: "", publicId: "" });
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rust"
        >
          <FiLink size={12} /> {showUrl ? "Hide URL field" : "Use a URL instead"}
        </button>
      </div>

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border border-slate-300 bg-white p-3">
          {/* Plain <img>: admin-only preview, and next/image is unoptimized here anyway. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-20 w-20 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{value}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                {busy ? `Uploading… ${progress}%` : "Replace"}
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
              >
                <FiX size={12} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !busy && inputRef.current?.click()}
          className={`grid cursor-pointer place-items-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragging ? "border-rust bg-rust/5" : "border-slate-300 bg-slate-50 hover:border-rust/60"
          } ${busy ? "pointer-events-none opacity-70" : ""}`}
        >
          {busy ? (
            <>
              <FiLoader className="animate-spin text-rust" size={22} />
              <p className="mt-2 text-sm font-semibold text-slate-700">Uploading… {progress}%</p>
              <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-rust transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <FiUploadCloud className="text-slate-400" size={22} />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Drop an image here, or <span className="text-rust">browse</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
            </>
          )}
        </div>
      )}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {showUrl && (
        <input
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
          placeholder="/images/prod-1.jpg or https://…"
          value={value}
          onChange={(e) => onChange({ url: e.target.value, publicId: "" })}
        />
      )}

      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
