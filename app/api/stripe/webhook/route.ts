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
  voidCommissionsByPaymentRef,
  voidCommissionsForInvoice,
} from "@/lib/commissions";
import { recordCommissionForInvoice } from "@/lib/commission-attribution";
import {
  notifyConsultationAdmin,
  notifyConsultationConfirmed,
  notifyPaymentFailed,
  notifySubscriptionCanceled,
} from "@/lib/communications";
import { confirmBooking, getBooking } from "@/lib/bookings";
import { BOOKING_TIMEZONE } from "@/lib/availability";
import { site } from "@/lib/site";

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

      // If this checkout was for a consultation booking (metadata carries
      // booking_id), confirm the booking instead of linking to a member.
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        await handleBookingCheckoutCompleted(session, bookingId);
        break;
      }

      await linkCheckoutToUser(session);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await recordCommissionForInvoice(invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // Nothing was collected, so nothing is owed. Access itself is handled by
      // customer.subscription.updated.
      if (invoice.id) {
        await voidCommissionsForInvoice(invoice.id, "Payment failed");
      }
      // Notify the member of the failed payment (best-effort).
      try {
        const user = await findUserByCustomerId(String(invoice.customer));
        if (user) {
          await notifyPaymentFailed({
            userId: user.id,
            email: user.email,
            name: "",
            amount: "",
            retryUrl: "https://highfrequency.vip/account",
          });
        }
      } catch {
        // Swallowed: payment-failed notification is best-effort.
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
      // Notify the member of cancellation (best-effort).
      try {
        if (user) {
          await notifySubscriptionCanceled({
            userId: user.id,
            email: user.email,
            name: "",
          });
        }
      } catch {
        // Swallowed: cancellation notification is best-effort.
      }
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

/**
 * Handle a completed Stripe checkout for a consultation booking.
 *
 * Confirms the PENDING booking, then sends customer + admin notifications.
 * Delivery failures are logged but never roll back the confirmed booking.
 * Stripe webhook idempotency (claimEvent) prevents duplicate confirmation.
 */
async function handleBookingCheckoutCompleted(
  session: Stripe.Checkout.Session,
  bookingId: string,
): Promise<void> {
  const booking = await getBooking(bookingId);
  if (!booking) return;

  // Confirm the booking. If already confirmed (replay), this throws — catch
  // and treat as already handled.
  try {
    await confirmBooking(bookingId, session.id, session.payment_intent
      ? String(session.payment_intent)
      : "");
  } catch {
    // Already confirmed or otherwise not pending — idempotent no-op.
    return;
  }

  // Customer confirmation email + optional SMS (best-effort).
  try {
    await notifyConsultationConfirmed({
      userId: null,
      email: booking.customerEmail,
      phone: booking.smsOptedIn ? booking.customerPhone : undefined,
      customerName: booking.customerName,
      consultationType: booking.consultationTypeId, // resolved to name by caller if needed
      appointmentAt: booking.appointmentAt,
      durationMin: booking.durationMin,
      timezone: BOOKING_TIMEZONE,
      amountCents: booking.priceCents,
    });
  } catch {
    // Swallowed: customer notification is best-effort.
  }

  // Admin notification email + optional SMS (best-effort).
  try {
    await notifyConsultationAdmin({
      userId: null,
      adminEmail: site.email,
      adminPhone: (typeof process !== "undefined" && process.env
        ? ((process.env as Record<string, string | undefined>).ADMIN_PHONE_NUMBER ?? null)
        : null),
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      consultationType: booking.consultationTypeId,
      appointmentAt: booking.appointmentAt,
      durationMin: booking.durationMin,
      timezone: BOOKING_TIMEZONE,
      amountCents: booking.priceCents,
      questions: booking.questions,
      adminBookingUrl: `https://highfrequency.vip/admin/bookings/${booking.id}`,
    });
  } catch {
    // Swallowed: admin notification is best-effort.
  }
}

