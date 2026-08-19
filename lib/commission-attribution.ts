import "server-only";

import type Stripe from "stripe";

import { recordCommission } from "./commissions";
import { findUserByCustomerId } from "./membership";

/**
 * Attributes a paid invoice to the customer's first-touch affiliate.
 *
 * This is called both from the invoice webhook and after account creation on
 * /welcome. Stripe can deliver the invoice before the buyer has created their
 * local account; the second call closes that race, while the ledger's unique
 * (invoiceId, affiliateId) index makes duplicate calls harmless.
 */
export async function recordCommissionForInvoice(
  invoice: Stripe.Invoice,
): Promise<void> {
  if (!invoice.id || !invoice.customer || invoice.amount_paid <= 0) return;

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
 * Best-effort Stripe payment reference used to match refunds and, when it is
 * a Charge, let the payout Worker tie a transfer to the original funds.
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
