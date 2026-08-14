import "server-only";

import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { nextCookies } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Roles are stored on `user.role`. "admin" is staff (Demi + team); "student"
 * is a paying member. New signups get "student" via `defaultRole` below.
 */
export const ROLES = {
  admin: "admin",
  student: "student",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

function createAuth(env: CloudflareEnv) {
  const secret = env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is not set. Add it to .dev.vars locally and via " +
        "`wrangler secret put BETTER_AUTH_SECRET` for deployments.",
    );
  }

  return betterAuth({
    // Better Auth duck-types the D1 binding and uses its own D1SqliteDialect,
    // so the binding is passed straight through -- no kysely wrapper needed.
    database: env.DB,
    secret,
    baseURL: env.BETTER_AUTH_URL,

    // The two dev servers run on different ports and Better Auth rejects any
    // origin that does not match baseURL, so a single BETTER_AUTH_URL cannot
    // satisfy both. Only added in development -- production trusts baseURL.
    trustedOrigins:
      env.NEXTJS_ENV === "development"
        ? ["http://localhost:3000", "http://localhost:8787"]
        : [],

    emailAndPassword: {
      enabled: true,
      // Closed signup: accounts are created only after payment (on /welcome) or
      // by an admin. Without this, /api/auth/sign-up/email is a public endpoint
      // anyone can call to mint a free account.
      disableSignUp: true,
      requireEmailVerification: false,
      minPasswordLength: 12,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refresh the expiry at most once a day
    },

    plugins: [
      admin({
        defaultRole: ROLES.student,
        adminRoles: [ROLES.admin],
        // The plugin ships "admin" | "user"; naming the roles explicitly is
        // what teaches setRole() that "student" is legal. "student" reuses the
        // stock user permission set -- no elevated rights.
        roles: {
          [ROLES.admin]: adminAc,
          [ROLES.student]: userAc,
        },
      }),
      // Must stay last: lets server actions (e.g. sign-in after checkout) set
      // the session cookie.
      nextCookies(),
    ],
  });
}

// Declared via createAuth so the admin plugin's endpoint types survive --
// `ReturnType<typeof betterAuth>` would erase them.
type Auth = ReturnType<typeof createAuth>;

// The D1 binding only exists inside a request, so the instance is built lazily
// and memoised per isolate rather than at module load (which would break
// `next build`, where there is no Cloudflare context at all).
let instance: Auth | null = null;

export function getAuth(): Auth {
  if (!instance) instance = createAuth(getCloudflareContext().env);
  return instance;
}
