import { useEffect, useState } from "react";
import api from "@/utils/api";

/**
 * Client-side fetch of the admin-managed gallery.
 *
 * There is deliberately no bundled fallback set: showing stock photos when the
 * admin has uploaded nothing makes an empty gallery look populated, and the
 * images shipped in the repo for that purpose were ~3 MB of dead weight.
 * Callers get an empty array and should render an empty state instead.
 *
 * @returns {{ images: {imageUrl: string, alt?: string}[], loading: boolean }}
 */
export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/gallery")
      .then(({ data }) => {
        if (active && Array.isArray(data)) setImages(data);
      })
      .catch(() => {
        /* leave empty — the empty state covers it */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { images, loading };
}
