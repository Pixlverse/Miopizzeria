import Layout from "@/components/Layout";
import Location from "@/components/Location";
import DeliveryPlatforms from "@/components/DeliveryPlatforms";
import SectionBackdrop from "@/components/SectionBackdrop";

// Placeholder Contact page — contact form & validation come next.
export default function ContactPage() {
  return (
    <Layout title="Contact">
      <section className="relative overflow-hidden pt-28 pb-4 md:pt-36">
        <SectionBackdrop />
        <div className="section relative z-10 text-center">
          <h1 className="text-4xl font-semibold text-rust md:text-h1">Get in Touch</h1>
          <p className="mt-2 font-display text-xl italic text-rust-light">
            We&apos;d love to hear from you
          </p>
        </div>
      </section>
      <Location />
      <DeliveryPlatforms />
    </Layout>
  );
}
