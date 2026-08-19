import Stripe from "stripe";
import { symmetricDecrypt } from "better-auth/crypto";

/**
 * Affiliate payout sweep.
 *
 * A standalone Worker rather than a route in the Next app: OpenNext's generated
 * worker exports no `scheduled()` handler and has no cron support, so a cron
 * trigger on the main app would fire into nothing.
 *
 * It deliberately does NOT import lib/commissions.ts — those modules are bound
 * to Next (`server-only`, `getCloudflareContext`) and cannot run here. The SQL
 * is duplicated on purpose; the shared contract is the schema.
 */

type Env = {
  DB: D1Database;
  SETTINGS_ENCRYPTION_KEY: string;
};

type PayableCommission = {
  id: string;
  affiliateId: string;
  amountCents: number;
  stripeAccountId: string;
  chargeId: string | null;
};

/** How many transfers to attempt per run. Each is one Stripe call, and Workers
 *  cap subrequests per invocation (50 on the free plan). */
const BATCH_SIZE = 25;

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runPayouts(env));
  },

  /**
   * Manual trigger for testing and for a "pay now" button later. Guarded by the
   * same encryption secret so it is not publicly runnable.
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/run") return new Response("Not found", { status: 404 });

    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${env.SETTINGS_ENCRYPTION_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await runPayouts(env);
    return Response.json(result);
  },
};

export async function runPayouts(env: Env) {
  const stripe = await buildStripe(env);
  if (!stripe) {
    return { ran: false, reason: "Stripe is not connected yet." };
  }

  const due = await listPayable(env);
  if (due.length === 0) return { ran: true, paid: 0, failed: 0, considered: 0 };

  let paid = 0;
  let failed = 0;

  for (const commission of due) {
    try {
      const sourceTransaction = await resolveSourceTransaction(
        stripe,
        commission.chargeId,
      );
      const transfer = await stripe.transfers.create(
        {
          amount: commission.amountCents,
          currency: "usd",
          destination: commission.stripeAccountId,
          // Ties the transfer to the original charge so it draws on those funds
          // rather than requiring a settled platform balance.
          ...(sourceTransaction ? { source_transaction: sourceTransaction } : {}),
          metadata: { commission_id: commission.id },
        },
        {
          // Stripe-side guard: if this run is retried, the same commission
          // cannot produce a second transfer.
          idempotencyKey: `commission_${commission.id}`,
        },
      );

      await markPaid(env, commission.id, transfer.id);
      paid++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transfer failed";
      // Left as 'failed', which the next sweep picks up again -- money owed
      // must never silently disappear from the ledger.
      await markFailed(env, commission.id, message);
      failed++;
    }
  }

  return { ran: true, paid, failed, considered: due.length };
}

/** Current invoice payloads commonly expose a PaymentIntent rather than the
 * underlying Charge. Resolve it before transferring so Stripe can associate
 * the affiliate transfer with the member payment's funds. */
async function resolveSourceTransaction(
  stripe: Stripe,
  paymentRef: string | null,
): Promise<string | null> {
  if (!paymentRef) return null;
  if (paymentRef.startsWith("ch_")) return paymentRef;
  if (!paymentRef.startsWith("pi_")) return null;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentRef);
    const charge = paymentIntent.latest_charge;
    return typeof charge === "string" ? charge : charge?.id ?? null;
  } catch {
    // A restricted key can permit transfers without permitting PaymentIntent
    // reads. After the hold window, falling back to the available platform
    // balance is safer than blocking this commission forever.
    return null;
  }
}

async function buildStripe(env: Env): Promise<Stripe | null> {
  const row = await env.DB.prepare(
    `SELECT value, encrypted FROM "app_setting" WHERE key = 'stripe.secret_key';`,
  ).first<{ value: string; encrypted: number }>();

  if (!row) return null;

  let apiKey = row.value;
  if (row.encrypted) {
    try {
      apiKey = await symmetricDecrypt({
        key: env.SETTINGS_ENCRYPTION_KEY,
        data: row.value,
      });
    } catch {
      return null;
    }
  }

  return new Stripe(apiKey, { httpClient: Stripe.createFetchHttpClient() });
}

async function listPayable(env: Env): Promise<PayableCommission[]> {
  const { results } = await env.DB.prepare(
    `SELECT c.id, c."affiliateId", c."amountCents", c."chargeId",
            a."stripeAccountId" AS "stripeAccountId"
     FROM "commission" c
     JOIN "affiliate" a ON a.id = c."affiliateId"
     WHERE c.status IN ('pending','failed')
       AND c."payableAt" <= ?
       AND a."payoutsEnabled" = 1
       AND a."stripeAccountId" IS NOT NULL
       AND a.status = 'active'
     ORDER BY c."payableAt" ASC
     LIMIT ?;`,
  )
    .bind(new Date().toISOString(), BATCH_SIZE)
    .all<PayableCommission>();

  return results;
}

async function markPaid(env: Env, id: string, transferId: string): Promise<void> {
  await env.DB.prepare(
    `UPDATE "commission"
     SET status = 'paid', "stripeTransferId" = ?, "paidAt" = ?, "failureReason" = NULL
     WHERE id = ?;`,
  )
    .bind(transferId, new Date().toISOString(), id)
    .run();
}

async function markFailed(env: Env, id: string, reason: string): Promise<void> {
  await env.DB.prepare(
    `UPDATE "commission" SET status = 'failed', "failureReason" = ? WHERE id = ?;`,
  )
    .bind(reason.slice(0, 500), id)
    .run();
}
