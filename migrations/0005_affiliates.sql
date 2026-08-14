-- Affiliates and their commission ledger.
--
-- An affiliate is a separate row rather than a role, because a member can be
-- both a paying member and an affiliate at the same time.

CREATE TABLE "affiliate" (
  "id"                text    NOT NULL PRIMARY KEY,
  "userId"            text    NOT NULL UNIQUE REFERENCES "user" ("id") ON DELETE CASCADE,
  -- Shared in referral links: /?ref=CODE
  "code"              text    NOT NULL UNIQUE,
  -- Per-affiliate rate. Set from the global default at creation, then editable
  -- individually so she can give a bigger cut to a bigger creator.
  "commissionPercent" real    NOT NULL,
  "status"            text    NOT NULL DEFAULT 'active',  -- active | paused
  -- Stripe Express account. Null until they finish payout setup.
  "stripeAccountId"   text    UNIQUE,
  "payoutsEnabled"    integer NOT NULL DEFAULT 0,
  "createdAt"         date    NOT NULL,
  "updatedAt"         date    NOT NULL
);

CREATE INDEX "affiliate_status_idx" ON "affiliate" ("status");

-- One row per commission earned. This is the ledger she reads, and the queue
-- the payout worker sweeps.
--
-- amountCents is frozen at write time using the rate in force then, so changing
-- an affiliate's percentage never rewrites history.
CREATE TABLE "commission" (
  "id"                text    NOT NULL PRIMARY KEY,
  "affiliateId"       text    NOT NULL REFERENCES "affiliate" ("id") ON DELETE CASCADE,
  "memberId"          text    REFERENCES "user" ("id") ON DELETE SET NULL,
  -- Stripe invoice this was earned on. Unique per affiliate so a webhook replay
  -- cannot pay twice.
  "invoiceId"         text    NOT NULL,
  "chargeId"          text,
  "amountCents"       integer NOT NULL,
  "commissionPercent" real    NOT NULL,
  -- pending  -> inside the hold window, not yet paid
  -- paid     -> transferred to their Stripe account
  -- failed   -> transfer attempted and failed, retryable
  -- void     -> invoice refunded or payment failed; never pay this
  "status"            text    NOT NULL DEFAULT 'pending',
  "stripeTransferId"  text,
  "failureReason"     text,
  -- When the hold expires and this becomes payable.
  "payableAt"         date    NOT NULL,
  "paidAt"            date,
  "createdAt"         date    NOT NULL
);

CREATE UNIQUE INDEX "commission_invoice_affiliate_idx"
  ON "commission" ("invoiceId", "affiliateId");

CREATE INDEX "commission_status_payable_idx"
  ON "commission" ("status", "payableAt");

CREATE INDEX "commission_affiliate_idx" ON "commission" ("affiliateId");

-- Click-through analytics so an affiliate can see the link is working even
-- before anyone converts.
CREATE TABLE "referral_click" (
  "id"          text NOT NULL PRIMARY KEY,
  "affiliateId" text NOT NULL REFERENCES "affiliate" ("id") ON DELETE CASCADE,
  "createdAt"   date NOT NULL
);

CREATE INDEX "referral_click_affiliate_idx"
  ON "referral_click" ("affiliateId", "createdAt");
