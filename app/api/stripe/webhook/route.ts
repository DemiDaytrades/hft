import Stripe from "stripe";

import { SETTING_KEYS, getSecret } from "@/lib/settings";
import { stripeFromKey } from "@/lib/stripe";
import {
  applySubscription,
  claimEvent,
  clearSubscription,
  findUserByCustomerId,
  findUserByEmail,
  linkCustomer,
  setReferrer,
} from "@/lib/membership";
import { getAffiliateByCode, setPayoutsEnabled } from "@/lib/affiliates";
import {
  recordCommission,
  voidCommissionsByPaymentRef,
  voidCommissionsForInvoice,
} from "@/lib/commissions";

export const dynamic = "force-dynamic";

/**
 * Stripe event receiver.
 *
 * Two Workers-specific requirements, both load-bearing:
 *  1. The raw body must be read with request.text() and passed through
 *     untouched -- any JSON round-trip changes bytes and breaks the signature.
 *  2. Verification must use constructEventAsync with a SubtleCrypto provider.
 *     The synchronous constructEvent assumes Node's crypto module and throws
 *     on workerd.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = await getSecret(SETTING_KEYS.stripeWebhookSecret);
  if (!webhookSecret) {
    // Stripe retries on 5xx, which is what we want: once she reconnects
    // payments the queued events will be delivered rather than lost.
    return new Response("Webhook secret not configured", { status: 503 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    // Signature verification is pure crypto and makes no API call, so it must
    // not depend on a valid API key -- otherwise a revoked key would also stop
    // us from accepting events.
    const stripe = stripeFromKey("unused_for_signature_verification");
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (error) {
    console.error("Stripe signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  // Stripe retries; a replay must not double-apply anything.
  const isNew = await claimEvent(event);
  if (!isNew) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    await handleEvent(event);
  } catch (error) {
    console.error(`Failed handling ${event.type} (${event.id})`, error);
    // 500 makes Stripe retry. The event id row is already written, so the
    // retry would be swallowed as a duplicate -- remove it so the retry works.
    await releaseEvent(event.id);
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}

async function releaseEvent(eventId: string): Promise<void> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  await getCloudflareContext()
    .env.DB.prepare(`DELETE FROM "webhook_event" WHERE id = ?;`)
    .bind(eventId)
    .run();
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await linkCheckoutToUser(session);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await earnCommission(invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // Nothing was collected, so nothing is owed. Access itself is handled by
      // customer.subscription.updated.
      if (invoice.id) {
        await voidCommissionsForInvoice(invoice.id, "Payment failed");
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      // Charge no longer carries an `invoice` link in current API versions, so
      // commissions are matched on the payment intent, which both sides share.
      // Only unpaid commissions void -- anything already transferred stays on
      // the ledger as paid, because that money is genuinely gone.
      const paymentRef = charge.payment_intent
        ? String(charge.payment_intent)
        : null;
      if (paymentRef) {
        await voidCommissionsByPaymentRef(paymentRef, "Payment refunded");
      }
      break;
    }

    case "account.updated": {
      // An affiliate finished (or progressed through) Stripe's payout setup.
      const account = event.data.object as Stripe.Account;
      await setPayoutsEnabled(account.id, Boolean(account.payouts_enabled));
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await findUserByCustomerId(String(subscription.customer));
      if (user) await clearSubscription(user.id);
      break;
    }

    default:
      // Unhandled types are acknowledged rather than retried forever. Checkout,
      // invoice and affiliate events are wired up in the next phases.
      break;
  }
}

/**
 * Attaches a completed checkout to an account.
 *
 * The account itself is created on /welcome, where the buyer chooses a
 * password — the webhook cannot invent credentials for them. If the webhook
 * lands first (the common case) there may be no user yet, and that is fine:
 * /welcome links the customer when it creates the account. This handler covers
 * the reverse order, where the account already existed.
 */
async function linkCheckoutToUser(session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email ?? session.customer_email;
  const customerId = session.customer ? String(session.customer) : null;
  if (!email || !customerId) return;

  const user = await findUserByEmail(email);
  if (!user) return;

  if (!user.stripeCustomerId) {
    await linkCustomer(user.id, customerId);
  }

  // Covers the case where the account already existed (e.g. a lapsed member
  // resubscribing through an affiliate link). setReferrer is first-touch, so
  // it will not steal credit from an earlier affiliate.
  if (session.client_reference_id) {
    const affiliate = await getAffiliateByCode(session.client_reference_id);
    if (affiliate) await setReferrer(user.id, affiliate.id);
  }
}

/**
 * Writes the referring affiliate's cut for a paid invoice.
 *
 * Runs on every successful invoice, which is what makes the commission
 * recurring for the life of the subscription rather than a one-off on signup.
 */
async function earnCommission(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.id || !invoice.customer) return;
  // amount_paid, not amount_due: commission is owed on money actually collected.
  if (invoice.amount_paid <= 0) return;

  const user = await findUserByCustomerId(String(invoice.customer));
  if (!user?.referredByAffiliateId) return;

  await recordCommission({
    affiliateId: user.referredByAffiliateId,
    memberId: user.id,
    invoiceId: invoice.id,
    chargeId: readPaymentRef(invoice),
    invoiceAmountCents: invoice.amount_paid,
  });
}

/**
 * Best-effort payment-intent id for an invoice, used to match a later refund.
 *
 * Stripe has moved this between `charge`, `payment_intent` and the nested
 * `payments` list across API versions, and the installed typings expose none of
 * them on Invoice. Read whichever is present rather than pinning to one shape.
 *
 * If none is found the commission still records correctly -- only automatic
 * void-on-refund is lost, and the hold window means she can still cancel it by
 * hand before payout.
 */
function readPaymentRef(invoice: Stripe.Invoice): string | null {
  const loose = invoice as unknown as {
    payment_intent?: string | { id?: string } | null;
    charge?: string | null;
    payments?: {
      data?: Array<{ payment?: { payment_intent?: string | { id?: string } } }>;
    };
  };

  const direct = loose.payment_intent;
  if (typeof direct === "string") return direct;
  if (direct?.id) return direct.id;

  if (typeof loose.charge === "string") return loose.charge;

  const nested = loose.payments?.data?.[0]?.payment?.payment_intent;
  if (typeof nested === "string") return nested;
  if (nested?.id) return nested.id;

  return null;
}

async function syncSubscription(subscription: Stripe.Subscription): Promise<void> {
  const user = await findUserByCustomerId(String(subscription.customer));
  if (!user) return;

  await applySubscription(user.id, {
    id: subscription.id,
    status: subscription.status,
    currentPeriodEnd: readPeriodEnd(subscription),
  });
}

/**
 * current_period_end moved onto subscription items in recent API versions and
 * is not on the top-level Subscription in the current typings. Read whichever
 * is present so this keeps working across versions.
 */
function readPeriodEnd(subscription: Stripe.Subscription): number | null {
  const top = (subscription as unknown as { current_period_end?: number })
    .current_period_end;
  if (typeof top === "number") return top;

  const item = subscription.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined;
  return typeof item?.current_period_end === "number"
    ? item.current_period_end
    : null;
}
