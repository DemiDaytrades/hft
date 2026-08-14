-- Columns required by Better Auth's `admin` plugin.
-- Mirrors node_modules/better-auth/dist/plugins/admin/schema.mjs exactly.
--
-- `role` doubles as our membership tier: "admin" for staff, "student" for
-- paying members (set via admin.defaultRole in lib/auth.ts).

ALTER TABLE "user" ADD COLUMN "role" text;
ALTER TABLE "user" ADD COLUMN "banned" integer DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "banReason" text;
ALTER TABLE "user" ADD COLUMN "banExpires" date;

ALTER TABLE "session" ADD COLUMN "impersonatedBy" text;

-- The admin user list filters and sorts on role constantly.
CREATE INDEX "user_role_idx" ON "user" ("role");
