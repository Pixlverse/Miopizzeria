import Script from "next/script";
import { GA_ID } from "@/utils/gtag";

/**
 * Loads GA4 (gtag.js) with Consent Mode. Analytics storage defaults to
 * "denied" and is only granted once the visitor accepts cookies (see
 * CookieConsent). Renders nothing unless NEXT_PUBLIC_GA_ID is set.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });
          try {
            if (localStorage.getItem('mio-cookie-consent') === 'accepted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            }
          } catch (e) {}
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
