import { useEffect, useState } from "react";
import api from "@/utils/api";

// Shipped with the site; used until the admin uploads images (and if the API is down).
export const DEFAULT_GALLERY = [
  "/images/rest1.jpg",
  "/images/prod-1.jpg",
  "/images/rest2.jpg",
  "/images/prod-3.jpg",
  "/images/rest3.jpg",
  "/images/prod-5.jpg",
  "/images/rest4.jpg",
  "/images/prod-2.jpg",
  "/images/slider3.png",
  "/images/prod-4.jpg",
];

const FALLBACK = DEFAULT_GALLERY.map((src) => ({ imageUrl: src, alt: "MIO pizzeria" }));

/**
 * Client-side fetch of the admin-managed gallery. Falls back to the bundled
 * images while loading, on failure, or when nothing has been uploaded yet.
 * Safe on static-export pages.
 *
 * @returns {{ images: {imageUrl: string, alt?: string}[], isDefault: boolean }}
 */
export function useGallery() {
  const [images, setImages] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/gallery")
      .then(({ data }) => {
        if (active && Array.isArray(data) && data.length > 0) setImages(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return { images: images || FALLBACK, isDefault: !images };
}
