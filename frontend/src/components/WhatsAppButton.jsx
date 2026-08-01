import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMBER } from "@/utils/constants";
import { useI18n } from "@/context/LocaleContext";

/** Site-wide floating click-to-chat button. */
export default function WhatsAppButton() {
  const { t } = useI18n();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
