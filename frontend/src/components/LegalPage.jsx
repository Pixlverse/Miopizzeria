import Layout from "./Layout";
import SectionBackdrop from "./SectionBackdrop";
import { useI18n } from "@/context/LocaleContext";

/** Renders a legal page (privacy | terms) from the i18n dictionary. */
export default function LegalPage({ docKey }) {
  const { t } = useI18n();
  const title = t(`legal.${docKey}.title`);
  const intro = t(`legal.${docKey}.intro`);
  const sections = t(`legal.${docKey}.sections`);

  return (
    <Layout title={title}>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <SectionBackdrop />
        <div className="section relative z-10 mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold text-rust md:text-h1">{title}</h1>
          <p className="mt-2 text-sm text-muted">{t("legal.updated")}</p>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">{intro}</p>

          <div className="mt-10 space-y-8">
            {(Array.isArray(sections) ? sections : []).map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-ink">{s.h}</h2>
                <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
