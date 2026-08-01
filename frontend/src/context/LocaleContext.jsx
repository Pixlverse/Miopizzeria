import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, dirForLocale, translate } from "@/i18n";

const STORAGE_KEY = "mio-locale";

const LocaleContext = createContext({
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (path) => path,
});

export function LocaleProvider({ children }) {
  // Always start on the default locale so the client render matches the
  // statically-exported HTML (no hydration mismatch). The stored preference is
  // applied in the effect below, after mount.
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== locale) setLocaleState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect the active locale on <html> for correct lang + RTL layout.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dirForLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore persistence failure */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({
      locale,
      dir: dirForLocale(locale),
      setLocale,
      toggleLocale,
      t: (path) => translate(locale, path),
    }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  return useContext(LocaleContext);
}
