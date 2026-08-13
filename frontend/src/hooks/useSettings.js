import { useEffect, useState } from "react";
import api from "@/utils/api";

/**
 * Client-side fetch of the public restaurant settings (hours, phone, address,
 * socials, delivery links). Returns null until loaded / on failure, so callers
 * should fall back to their own defaults. Safe on static-export pages.
 *
 * The request is shared process-wide: the menu page renders one card per dish,
 * and each card used to fire its own /settings call — 80+ identical requests on
 * a full menu. One in-flight promise now serves every caller.
 */
let cache = null; // resolved settings, once we have them
let inFlight = null; // the shared promise while the request is open

function loadSettings() {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = api
      .get("/settings")
      .then(({ data }) => {
        cache = data;
        return data;
      })
      .catch(() => null)
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function useSettings() {
  const [settings, setSettings] = useState(cache);

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    loadSettings().then((data) => {
      if (active && data) setSettings(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
