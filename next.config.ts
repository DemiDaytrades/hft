import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

// Required for `next dev`: it starts a local Workers proxy so
// `getCloudflareContext()` can reach the D1 binding. Without this, any page
// that touches auth throws "getCloudflareContext has been called without
// having called initOpenNextCloudflareForDev". Not needed under `wrangler dev`,
// which runs the already-built worker.
initOpenNextCloudflareForDev();
