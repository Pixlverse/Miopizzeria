import Head from "next/head";
import Image from "next/image";
import { BRAND } from "@/utils/constants";

/**
 * Interim "version 1" landing (NEXT_PUBLIC_SITE_VERSION="1"). The QR points here
 * and it shows nothing but the menu pages, full-width and zoomable — like
 * opening the PDF directly. Full-resolution images so pinch-zoom stays crisp.
 */
export default function MenuLanding() {
  return (
    <>
      <Head>
        <title>{BRAND.name} — Menu</title>
        <meta name="description" content={`${BRAND.name} menu — ${BRAND.tagline}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="min-h-screen w-full bg-[#2A1512]">
        <Image
          src="/documents/menu-1.jpg"
          alt="MIO menu — page 1"
          width={3639}
          height={2573}
          className="block h-auto w-full"
          sizes="100vw"
          priority
          unoptimized
        />
        <Image
          src="/documents/menu-2.jpg"
          alt="MIO menu — page 2"
          width={3639}
          height={2573}
          className="block h-auto w-full"
          sizes="100vw"
          unoptimized
        />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 md:p-4">
          <Image
            src="/documents/menu-breakfast-1.jpg"
            alt="MIO breakfast menu"
            width={2304}
            height={3456}
            className="block h-auto w-full"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          <Image
            src="/documents/menu-breakfast-2.jpg"
            alt="MIO breakfast menu — Arabic"
            width={2304}
            height={3456}
            className="block h-auto w-full"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </main>
    </>
  );
}
