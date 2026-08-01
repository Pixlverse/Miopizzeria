import { useEffect, useState } from "react";
import api from "@/utils/api";

/**
 * Client-side fetch of the public restaurant settings (hours, phone, address,
 * socials, delivery links). Returns null until loaded / on failure, so callers
 * should fall back to their own defaults. Safe on static-export pages.
 */
export function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/settings")
      .then(({ data }) => {
        if (active) setSettings(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
