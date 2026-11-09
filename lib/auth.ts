import "server-only";

import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin } from "better-auth/plugins/admin";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { nextCookies } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getResend } from "@/lib/communications/providers";
import { passwordResetEmail } from "@/lib/communications/templates";

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

  const completePasswordSetup = async (userId: string) => {
    await env.DB.prepare(
      'UPDATE "user" SET "must_change_password" = 0, "updatedAt" = ? WHERE id = ?;',
    ).bind(new Date().toISOString(), userId).run();
  };

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

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/admin/remove-user" || ctx.path.startsWith("/delete-user")) {
          throw new APIError("FORBIDDEN", { message: "Permanent deletion is disabled pending retention policy. Use lifecycle impact preview." });
        }
        if (ctx.path === "/request-password-reset" && !getResend()) {
          throw new APIError("SERVICE_UNAVAILABLE", { message: "Password reset email is not configured." });
        }
        if (ctx.path === "/change-password" && ctx.body?.newPassword === ctx.body?.currentPassword) {
          throw new APIError("BAD_REQUEST", { message: "New password must be different from the current one." });
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/change-password") return;
        // Better Auth also runs after hooks for errors. Its successful response
        // contains the authenticated user; error responses do not.
        const result = ctx.context.returned;
        if (result && typeof result === "object" && "user" in result &&
            ctx.context.session && result.user &&
            typeof result.user === "object" && "id" in result.user &&
            result.user.id === ctx.context.session.user.id) {
          await completePasswordSetup(ctx.context.session.user.id);
        }
      }),
    },

    emailAndPassword: {
      enabled: true,
      // Closed signup: accounts are created only after payment (on /welcome) or
      // by an admin. Without this, /api/auth/sign-up/email is a public endpoint
      // anyone can call to mint a free account.
      disableSignUp: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      // Single-use verification tokens; Better Auth stores/invalidates them in
      // the `verification` table. Keep links short-lived.
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
      revokeSessionsOnPasswordReset: true,
      onPasswordReset: async ({ user }) => {
        await completePasswordSetup(user.id);
      },
      sendResetPassword: async ({ user, url }) => {
        const resend = getResend();
        if (!resend) {
          console.error("[auth] password reset email skipped: RESEND not configured", { userId: user.id });
          throw new Error("Could not send a password reset email.");
        }
        const from = (env as unknown as Record<string, string | undefined>).EMAIL_FROM ?? "High Frequency Trading <noreply@highfrequency.vip>";
        const tpl = passwordResetEmail({ name: user.name ?? "there", resetUrl: url });
        try {
          const result = await resend.emails.send({
            from,
            to: [user.email],
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
          });
          if (result.error) throw new Error("Delivery provider rejected the message.");
        } catch {
          // Never leak details to callers; log redacted context only.
          console.error("[auth] password reset email failed", {
            userId: user.id,
            failed: true,
          });
          throw new Error("Could not send a password reset email.");
        }
      },
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
