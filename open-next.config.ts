import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incrementalCache override: the marketing pages are statically rendered and
// served from Workers Assets, and the /admin and /dashboard routes are dynamic
// per-session. Add an R2 incremental cache here if we later add ISR pages.
export default defineCloudflareConfig();
