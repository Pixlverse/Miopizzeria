import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import PopularCategories from "@/components/PopularCategories";
import DeliveryPlatforms from "@/components/DeliveryPlatforms";
import Testimonials from "@/components/Testimonials";
import GoogleReviews from "@/components/GoogleReviews";
import CtaGallery from "@/components/CtaGallery";
import Location from "@/components/Location";
import MenuLanding from "@/components/MenuLanding";

// "1" = interim PDF-menu landing (QR target); anything else = full site (v2).
const SITE_VERSION = process.env.NEXT_PUBLIC_SITE_VERSION || "1";

export default function Home() {
  if (SITE_VERSION === "1") {
    return <MenuLanding />;
  }

  return (
    <Layout>
      <Hero />
      <PopularCategories />
      <DeliveryPlatforms />
      <Testimonials />
      <GoogleReviews />
      <CtaGallery />
      <Location />
    </Layout>
  );
}
