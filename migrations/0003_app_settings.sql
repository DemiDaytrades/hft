-- Owner-editable configuration, so price/commission/keys can change without a
-- deploy. Anything the owner can set in /admin/settings lives here.
--
-- Secret values (Stripe key, webhook signing secret) are stored encrypted with
-- SETTINGS_ENCRYPTION_KEY and flagged so the read path knows to decrypt.
-- They are never rendered back to the UI -- only a last-4 hint.

CREATE TABLE "app_setting" (
  "key"       text    NOT NULL PRIMARY KEY,
  "value"     text    NOT NULL,
  "encrypted" integer NOT NULL DEFAULT 0,
  "updatedAt" date    NOT NULL
);
