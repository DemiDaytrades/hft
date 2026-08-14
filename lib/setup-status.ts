import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { SETTING_KEYS, getSetting } from "./settings";
import { checkPayoutReadiness } from "./stripe-setup";
import { tryGetStripe } from "./stripe";

/**
 * Live setup state for the admin home checklist.
 *
 * Every item is derived from what is actually true right now, never from a
 * "setup completed" flag. If she revokes her Stripe key six months from now,
 * the checklist reappears and tells her what to do -- which is the difference
 * between a self-serve product and a support request.
 */

export type SetupStep = {
  id: string;
  title: string;
  /** Shown only when the step is outstanding. Written for a non-technical reader. */
  detail: string;
  done: boolean;
  href: string;
  cta: string;
  /** True when we could not determine the state (e.g. restricted key). */
  unknown?: boolean;
};

export type SetupStatus = {
  steps: SetupStep[];
  allDone: boolean;
};

export async function getSetupStatus(): Promise<SetupStatus> {
  const stripe = await tryGetStripe();
  const connected = stripe !== null;

  const priceCents = Number(
    (await getSetting(SETTING_KEYS.membershipPriceCents)) ?? 0,
  );

  const affiliateCount = await countAffiliates();

  // Only ask Stripe about payouts once a key exists, so an unconfigured site
  // makes no network calls at all.
  let payoutsReady = false;
  let payoutsUnknown = false;
  let payoutsMessage =
    "Stripe needs your business details and a bank account before you can pay affiliates.";

  if (connected) {
    const { readiness } = await checkPayoutReadiness(stripe);
    payoutsReady = readiness.state === "ready";
    payoutsUnknown = readiness.state === "unknown";
    if (readiness.state !== "ready") payoutsMessage = readiness.message;
  }

  const steps: SetupStep[] = [
    {
      id: "payments",
      title: "Connect your Stripe account",
      detail:
        "This is how members pay you. Paste your Stripe key once and everything else sets itself up.",
      done: connected,
      href: "/admin/settings/payments",
      cta: "Connect payments",
    },
    {
      id: "price",
      title: "Set what members pay",
      detail: "Choose your monthly membership price.",
      done: connected && priceCents > 0,
      href: "/admin/settings/pricing",
      cta: "Set price",
    },
    {
      id: "payouts",
      title: "Finish your Stripe details",
      detail: payoutsMessage,
      done: connected && (payoutsReady || payoutsUnknown),
      unknown: payoutsUnknown,
      href: "https://dashboard.stripe.com/account/onboarding",
      cta: "Open Stripe",
    },
    {
      id: "affiliates",
      title: "Add your first affiliate",
      detail:
        "Optional. Affiliates share a link and earn a cut of what their referrals pay you.",
      done: affiliateCount > 0,
      href: "/admin/affiliates",
      cta: "Add an affiliate",
    },
  ];

  return { steps, allDone: steps.every((step) => step.done) };
}

async function countAffiliates(): Promise<number> {
  const row = await getCloudflareContext()
    .env.DB.prepare(`SELECT COUNT(*) AS n FROM "affiliate";`)
    .first<{ n: number }>();
  return row?.n ?? 0;
}
