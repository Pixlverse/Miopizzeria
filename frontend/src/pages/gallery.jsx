import Image from "next/image";
import Layout from "@/components/Layout";
import SectionBackdrop from "@/components/SectionBackdrop";

const GALLERY = [
  "/images/rest1.jpg",
  "/images/prod-1.jpg",
  "/images/rest2.jpg",
  "/images/prod-3.jpg",
  "/images/rest3.jpg",
  "/images/prod-5.jpg",
  "/images/rest4.jpg",
  "/images/prod-2.jpg",
  "/images/slider3.png",
  "/images/prod-4.jpg",
];

export default function GalleryPage() {
  return (
    <Layout title="Gallery">
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36">
        <SectionBackdrop />
        <div className="section relative z-10">
          <div className="mb-12 text-center">
            <p className="font-display text-xl italic text-rust-light">A taste of MIO</p>
            <h1 className="mt-2 text-4xl font-semibold text-rust md:text-h1">Gallery</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div
                key={src}
                className={`group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5 ${
                  i % 5 === 0 ? "aspect-[4/5] md:row-span-2" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={src}
                  alt="MIO pizzeria"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
