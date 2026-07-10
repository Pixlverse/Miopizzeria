import { useId } from "react";

/**
 * Crumpled / folded-paper texture overlay.
 * Renders an SVG noise + diffuse-lighting filter (embossed creases) that
 * blends over whatever background colour is behind it — so the brand rust
 * shows through while gaining a tactile, folded-paper feel.
 *
 * Drop inside a `position: relative; overflow: hidden` container, before the
 * content (which should sit at a higher z-index).
 */
export default function PaperTexture({ opacity = 0.45, blend = "overlay", className = "" }) {
  const raw = useId().replace(/[:]/g, "");
  const filterId = `paper-${raw}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ mixBlendMode: blend, opacity }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <filter id={filterId}>
        {/* Wrinkle/crease noise field */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.011 0.016"
          numOctaves="5"
          seed="7"
          stitchTiles="stitch"
          result="noise"
        />
        {/* Light the noise to emboss the folds */}
        <feDiffuseLighting
          in="noise"
          lightingColor="#ffffff"
          surfaceScale="2.4"
          diffuseConstant="1.1"
          result="lit"
        >
          <feDistantLight azimuth="235" elevation="58" />
        </feDiffuseLighting>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
