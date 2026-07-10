/** @type {import('next').NextConfig} */


// Empty for a root/custom-domain deploy (production).
// Set PAGES_BASE_PATH="/Miopizzeria" to preview on pixlverse.github.io/Miopizzeria/.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
 reactStrictMode: true,
 // Static HTML export for GitHub Pages (v1). No server features are used.
 output: "export",
 trailingSlash: true,
 basePath,
 assetPrefix: basePath || undefined,
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
