import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";
// import PromoBanner from "@/components/PromoBanner"; // hidden for now — not needed
import DeliveryPlatforms from "@/components/DeliveryPlatforms";
import Testimonials from "@/components/Testimonials";
import CtaGallery from "@/components/CtaGallery";
import Location from "@/components/Location";
import MenuLanding from "@/components/MenuLanding";

// "1" = interim PDF-menu landing (QR target); anything else = full site (v2).
const SITE_VERSION = process.env.NEXT_PUBLIC_SITE_VERSION || "2";

export default function Home() {
  if (SITE_VERSION === "1") {
    return <MenuLanding />;
  }

  return (
    <Layout>
      <Hero />
      <FeaturedMenu />
      {/* <PromoBanner /> */}
      <DeliveryPlatforms />
      <Testimonials />
      <CtaGallery />
      <Location />
    </Layout>
  );
}
