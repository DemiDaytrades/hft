-- Membership state mirrored from Stripe.
--
-- Access is granted by "subscriptionStatus", NOT by role. `role` stays for
-- staff ("admin") vs everyone else, so a member with a lapsed card loses
-- access without any role change.

ALTER TABLE "user" ADD COLUMN "stripeCustomerId"     text;
ALTER TABLE "user" ADD COLUMN "subscriptionId"       text;
ALTER TABLE "user" ADD COLUMN "subscriptionStatus"   text;
ALTER TABLE "user" ADD COLUMN "currentPeriodEnd"     date;
ALTER TABLE "user" ADD COLUMN "referredByAffiliateId" text;

CREATE UNIQUE INDEX "user_stripeCustomerId_idx"
  ON "user" ("stripeCustomerId") WHERE "stripeCustomerId" IS NOT NULL;

CREATE INDEX "user_subscriptionStatus_idx" ON "user" ("subscriptionStatus");
CREATE INDEX "user_referredBy_idx" ON "user" ("referredByAffiliateId");

-- Stripe retries webhooks and can deliver the same event more than once.
-- Every handler checks this table first so a replay is a no-op rather than a
-- duplicate commission or a double-granted membership.
CREATE TABLE "webhook_event" (
  "id"          text NOT NULL PRIMARY KEY,  -- Stripe event id (evt_…)
  "type"        text NOT NULL,
  "processedAt" date NOT NULL
);
