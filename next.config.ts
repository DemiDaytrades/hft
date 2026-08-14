import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Everything except immutable build output. HTML must revalidate:
        // pages reference hashed JS chunks, and a deploy replaces those
        // filenames. A cached page pointing at deleted chunks fails to
        // hydrate with a minified React error, which is exactly what
        // s-maxage=31536000 on the document was causing.
        source: "/:path((?!_next/static|_next/image).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Build output is content-hashed, so it is safe to cache forever.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// Required for `next dev`: it starts a local Workers proxy so
// `getCloudflareContext()` can reach the D1 binding. Without this, any page
// that touches auth throws "getCloudflareContext has been called without
// having called initOpenNextCloudflareForDev". Not needed under `wrangler dev`,
// which runs the already-built worker.
initOpenNextCloudflareForDev();
