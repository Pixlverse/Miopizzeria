import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/context/LocaleContext";
import { updateConsent } from "@/utils/gtag";

const STORAGE_KEY = "mio-cookie-consent";

/** Bottom cookie-consent banner. Persists the choice; hidden once set. */
export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* localStorage unavailable — stay hidden */
    }
  }, []);

  const decide = (choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    updateConsent(choice === "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="section flex flex-col items-center gap-4 rounded-2xl bg-rust-dark/95 p-5 text-cream shadow-2xl backdrop-blur sm:flex-row sm:justify-between">
        <p className="text-sm text-cream/90">
          {t("cookie.text")}{" "}
          <Link href="/privacy" className="underline hover:text-white">
            {t("cookie.privacy")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-full border border-cream/40 px-5 py-2 text-sm font-semibold text-cream/90 hover:border-cream hover:text-white"
          >
            {t("cookie.decline")}
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-cream px-6 py-2 text-sm font-bold text-rust transition-colors hover:bg-white"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
