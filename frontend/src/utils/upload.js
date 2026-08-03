import axios from "axios";
import api from "./api";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export const ACCEPT_ATTR = ACCEPTED.join(",");

// Rejects obviously bad files before we bother asking for a signature.
export function validateImage(file) {
  if (!file) return "No file selected.";
  if (!ACCEPTED.includes(file.type)) return "Use a JPG, PNG, WebP, AVIF or GIF image.";
  if (file.size > MAX_UPLOAD_BYTES) return "Image must be under 5 MB.";
  return null;
}

/**
 * Uploads straight to Cloudinary using a short-lived signature from our API.
 * The file never passes through the backend.
 *
 * @param {File} file
 * @param {"menu"|"gallery"} folder
 * @param {(percent:number)=>void} [onProgress]
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImage(file, folder = "menu", onProgress) {
  const invalid = validateImage(file);
  if (invalid) throw new Error(invalid);

  let sig;
  try {
    const { data } = await api.get("/uploads/signature", { params: { folder } });
    sig = data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Couldn't start the upload.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      form,
      {
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
      }
    );
    return { url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    throw new Error(err?.response?.data?.error?.message || "Upload failed. Please try again.");
  }
}

// Best-effort cleanup of a replaced/removed asset — never blocks the caller.
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await api.delete("/uploads", { params: { publicId } });
  } catch {
    /* stranded asset is harmless; the record is what matters */
  }
}
