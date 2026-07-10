/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export for GitHub Pages (v1). No server features are used.
  output: "export",
  trailingSlash: true,
  images: {
    // Required for static export — serves images as-is (no on-the-fly optimizer).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

module.exports = nextConfig;
