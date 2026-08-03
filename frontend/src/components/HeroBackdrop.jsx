import PaperTexture from "./PaperTexture";

const DOTS =
  "radial-gradient(rgba(254,220,189,0.85) 1.5px, transparent 1.6px)";

/**
 * Shared warm-rust hero backdrop for page headers (Events, Contact, Book).
 * Deep radial gradient + soft organic blobs, faint dot clusters and flowing
 * line-art, a top glow, vignette and film grain — decorative structure with
 * no icons or straight-line patterns. Drop inside a `relative overflow-hidden`
 * section, before the content (which sits above via z-index).
 */
export default function HeroBackdrop({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Deep warm base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 110% at 50% -10%, #B0472F 0%, #8A2E1E 46%, #5E1E14 100%)",
        }}
      />

      {/* Organic blobs for depth */}
      <div
        className="absolute -right-28 -top-32 h-[34rem] w-[34rem] rounded-[46%] blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(74,24,14,0.55) 0%, rgba(74,24,14,0) 70%)" }}
      />
      <div
        className="absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-[52%] blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(210,116,84,0.30) 0%, rgba(210,116,84,0) 70%)" }}
      />
      <div
        className="absolute -right-16 bottom-[-20%] h-[26rem] w-[26rem] rounded-[48%] blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(210,116,84,0.22) 0%, rgba(210,116,84,0) 70%)" }}
      />

      {/* Soft warm glow up top */}
      <div
        className="absolute left-1/2 top-[-32%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(247,150,70,0.20) 0%, rgba(247,150,70,0) 68%)" }}
      />

      {/* Faint dot clusters */}
      <div
        className="absolute right-8 top-8 h-24 w-28 opacity-[0.18]"
        style={{ backgroundImage: DOTS, backgroundSize: "16px 16px" }}
      />
      <div
        className="absolute bottom-16 left-6 hidden h-20 w-28 opacity-[0.14] sm:block"
        style={{ backgroundImage: DOTS, backgroundSize: "16px 16px" }}
      />

      {/* Flowing line-art on the left */}
      <svg
        className="absolute -left-6 top-[22%] hidden h-72 w-44 text-cream/10 sm:block"
        viewBox="0 0 100 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M8 0 Q 44 50 8 100 T 8 200" />
        <path d="M26 0 Q 62 50 26 100 T 26 200" />
        <path d="M44 0 Q 80 50 44 100 T 44 200" />
      </svg>

      {/* Flowing line-art on the bottom-right (mirrored) */}
      <svg
        className="absolute -right-6 bottom-0 hidden h-64 w-40 text-cream/10 sm:block"
        viewBox="0 0 100 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        style={{ transform: "scaleX(-1)" }}
      >
        <path d="M8 0 Q 44 50 8 100 T 8 200" />
        <path d="M26 0 Q 62 50 26 100 T 26 200" />
        <path d="M44 0 Q 80 50 44 100 T 44 200" />
      </svg>
      <div
        className="absolute bottom-10 right-8 hidden h-20 w-28 opacity-[0.15] sm:block"
        style={{ backgroundImage: DOTS, backgroundSize: "16px 16px" }}
      />

      {/* Vignette to frame the copy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 80% at 50% 40%, rgba(0,0,0,0) 55%, rgba(40,12,8,0.45) 100%)",
        }}
      />

      {/* Fine film grain for tactile texture */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
      <PaperTexture opacity={0.5} blend="soft-light" />
    </div>
  );
}
