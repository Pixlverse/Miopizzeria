import Layout from "@/components/Layout";
import ScrollHero from "@/components/ScrollHero";
import SectionBackdrop from "@/components/SectionBackdrop";
import { BRAND } from "@/utils/constants";

export default function AboutPage() {
  return (
    <Layout title="About" description={BRAND.about}>
      {/* Cinematic scroll-driven intro */}
      <ScrollHero />

      {/* Our story */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-semibold text-rust md:text-h1">Our Story</h1>
          <p className="mt-2 font-display text-xl italic text-rust-light">
            Premium Italian pizza, made in Doha
          </p>
          <p className="mt-8 text-lg leading-relaxed text-gray-700">
            {BRAND.about}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Every pizza is hand-stretched and wood-fired to order, using premium
            ingredients and time-honoured Italian technique — then delivered hot
            and fresh across the city.
          </p>
        </div>
      </section>
    </Layout>
  );
}
