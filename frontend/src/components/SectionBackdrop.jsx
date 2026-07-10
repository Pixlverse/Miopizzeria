import PaperTexture from "./PaperTexture";

// Two warm tones so stacked sections can alternate (rhythm, not one flat block).
const TONES = {
  warm: "radial-gradient(120% 95% at 50% 50%, #FDF5ED 0%, #FAECDC 55%, #EFD3B6 100%)",
  light: "radial-gradient(120% 95% at 50% 50%, #FFFCF8 0%, #FEF6EE 55%, #F8E9D9 100%)",
};

/**
 * Warm, textured backdrop that matches the hero's standard on light sections.
 * `tone` picks a warmer or lighter cream wash (each edge shares its tone, so a
 * section reads as one clean band); both carry the same embossed paper texture
 * used on the rust panels. Drop inside a `relative overflow-hidden` section,
 * before the content (which should sit at a higher z-index).
 */
export default function SectionBackdrop({ className = "", tone = "warm" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Warm cream wash */}
      <div className="absolute inset-0" style={{ background: TONES[tone] || TONES.warm }} />

      {/* Embossed paper/concrete grain */}
      <PaperTexture opacity={0.65} blend="overlay" />

      {/* Soft warm glows for depth */}
      <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-rust/10 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-rust/10 blur-3xl" />
    </div>
  );
}
