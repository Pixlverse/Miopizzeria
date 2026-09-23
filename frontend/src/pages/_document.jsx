import { Html, Head, Main, NextScript } from "next/document";
import { BRAND } from "@/utils/constants";

const SITE_URL = "https://mio-pizzeria.com/";

const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    alternateName: ["Mio", "Mio Pizzeria Qatar"],
    url: SITE_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: BRAND.name,
    url: SITE_URL,
    logo: `${SITE_URL}icon-512.png`,
    image: `${SITE_URL}icon-512.png`,
    telephone: BRAND.phone,
    servesCuisine: "Italian",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dafna Park, Unit 24, Building 55, Street 841, Zone 63",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
  },
];

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* Site icons. Google Search shows the favicon beside results; it needs
            a crawlable square icon at a multiple of 48px (favicon.ico carries
            16–64px, icon-192.png covers high-density screens). */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#AB4C35" />
        {/* Tells Google the site's name (shown above results instead of the
            bare domain) and which logo represents the business. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
