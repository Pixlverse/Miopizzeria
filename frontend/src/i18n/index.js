import en from "./en";
import ar from "./ar";

export const DEFAULT_LOCALE = "en";
export const RTL_LOCALES = ["ar"];

export const LOCALES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const dictionaries = { en, ar };

export function dirForLocale(locale) {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

// Resolve a dot-path (e.g. "nav.home") against a locale, falling back to
// English and finally to the key itself so nothing renders blank.
export function translate(locale, path) {
  const lookup = (dict) =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), dict);
  const value = lookup(dictionaries[locale]);
  if (value != null) return value;
  const fallback = lookup(dictionaries[DEFAULT_LOCALE]);
  return fallback != null ? fallback : path;
}
