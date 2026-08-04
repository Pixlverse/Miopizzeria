import { FaWhatsapp } from "react-icons/fa";
import { useI18n } from "@/context/LocaleContext";
import { useSettings } from "@/hooks/useSettings";
import { whatsappLink } from "@/utils/whatsapp";

/** Site-wide floating click-to-chat button. */
export default function WhatsAppButton() {
  const { t } = useI18n();
  const settings = useSettings();

  return (
    <a
      // Admin-managed number when Settings has one, else the number in constants.
      href={whatsappLink(settings?.socialLinks?.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.label")}
      title={t("whatsapp.label")}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}
