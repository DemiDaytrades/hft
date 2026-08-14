-- One-time invite links.
--
-- Public sign-up is disabled and accounts otherwise only exist after payment,
-- so this is how someone who is not a paying member (an affiliate/creator)
-- gets an account. The owner copies the link and sends it herself -- no email
-- system required.

CREATE TABLE "invite" (
  "id"        text NOT NULL PRIMARY KEY,
  "token"     text NOT NULL UNIQUE,
  "email"     text NOT NULL,
  -- 'affiliate' also creates the affiliate record on acceptance.
  "kind"      text NOT NULL DEFAULT 'affiliate',
  "createdBy" text REFERENCES "user" ("id") ON DELETE SET NULL,
  "createdAt" date NOT NULL,
  "expiresAt" date NOT NULL,
  "usedAt"    date,
  "userId"    text REFERENCES "user" ("id") ON DELETE SET NULL
);

CREATE INDEX "invite_email_idx" ON "invite" ("email");
CREATE INDEX "invite_unused_idx" ON "invite" ("usedAt", "expiresAt");
