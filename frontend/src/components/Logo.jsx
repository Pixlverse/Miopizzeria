import Image from "next/image";

// Real "mio pizzeria" brand logo (pizza slice integrated into the wordmark).
// Two transparent variants, picked to suit the background:
//   variant="cream" → cream logo, for rust / dark backgrounds
//   variant="rust"  → rust logo,  for light / cream backgrounds
const SOURCES = {
  cream: { src: "/images/mio_logo_cream.png", ratio: 1508 / 816 },
  rust: { src: "/images/mio_logo_rust.png", ratio: 1494 / 816 },
};

export default function Logo({ variant = "cream", height = 40, priority = false, className = "" }) {
  const { src, ratio } = SOURCES[variant] || SOURCES.cream;
  const width = Math.round(height * ratio);

  return (
    <Image
      src={src}
      alt="Miopizzeria"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
