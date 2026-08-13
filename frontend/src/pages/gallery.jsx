import Image from "next/image";
import { FiImage } from "react-icons/fi";
import { cdnImage } from "@/utils/images";
import Layout from "@/components/Layout";
import SectionBackdrop from "@/components/SectionBackdrop";
import { useGallery } from "@/hooks/useGallery";

export default function GalleryPage() {
  // Admin-managed images. Empty until the team uploads some.
  const { images, loading } = useGallery();

  return (
    <Layout title="Gallery">
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36">
        <SectionBackdrop />
        <div className="section relative z-10">
          <div className="mb-12 text-center">
            <p className="font-display text-xl italic text-rust-light">A taste of MIO</p>
            <h1 className="mt-2 text-4xl font-semibold text-rust md:text-h1">Gallery</h1>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 text-muted">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-rust/30 border-t-rust" />
            </div>
          ) : images.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl bg-white/60 px-6 py-16 text-center shadow-card ring-1 ring-rust/10">
              <FiImage className="mx-auto text-rust/40" size={44} />
              <h2 className="mt-5 font-display text-2xl font-bold text-ink">
                No photos yet
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We&apos;re busy plating up something worth photographing. Check back
                soon — or come see it in person.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img, i) => (
              <div
                key={img._id || img.imageUrl}
                className={`group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5 ${
                  i % 5 === 0 ? "aspect-[4/5] md:row-span-2" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={cdnImage(img.imageUrl, 800)}
                  alt={img.alt || "MIO pizzeria"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
