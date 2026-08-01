import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CookieConsent from "./CookieConsent";
import { BRAND } from "@/utils/constants";

export default function Layout({ children, title, description }) {
  const pageTitle = title ? `${title} | ${BRAND.name}` : `${BRAND.name} — ${BRAND.tagline}`;
  const desc =
    description ||
    "Premium handcrafted Italian pizzas delivered in Qatar. Order from Snoonu, Talabat, or WhatsApp.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
