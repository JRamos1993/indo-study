/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site into ./out at build time (served by Cloudflare
  // Workers Static Assets). Every page is client-rendered, so there is no
  // server to run — all backend logic lives in the Hono Worker (src/worker.ts).
  output: "export",
  // No Next image-optimization server exists in a static export.
  images: { unoptimized: true },
  // Emit /learn/index.html (not /learn.html) so directory-style routes resolve
  // cleanly behind Workers `html_handling: "force-trailing-slash"`.
  trailingSlash: true,
};

export default nextConfig;
