// ===========================================================
// Image delivery helpers.
//
// The site is a static export, so next.config.js sets images.unoptimized —
// next/image serves the original file untouched and ignores `sizes`. A 2000px
// Cloudinary upload therefore downloads in full to fill a 300px card, and the
// menu page has 80+ of them. Resize at the CDN instead.
// ===========================================================

const CLOUDINARY_MARKER = "res.cloudinary.com";

/**
 * Adds Cloudinary delivery transforms to a stored image URL.
 * `f_auto` picks WebP/AVIF per browser, `q_auto` compresses, `w_` caps width.
 * Non-Cloudinary and already-transformed URLs pass through untouched.
 */
export function cdnImage(url, width = 600) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes(CLOUDINARY_MARKER) || !url.includes("/upload/")) return url;
  if (url.includes("/upload/f_auto")) return url; // already done
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
