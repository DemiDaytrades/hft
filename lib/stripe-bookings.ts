import "server-only";

import Stripe from "stripe";

import { getStripe } from "./stripe";
import { friendlyStripeError } from "./stripe";

export class StripeBookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeBookingError";
  }
}

/** Create a Stripe Checkout session for a consultation booking (one-time payment). */
export async function createBookingCheckoutSession(options: {
  origin: string;
  bookingId: string;
  consultationTypeName: string;
  durationMin: number;
  priceCents: number;
  customerEmail: string;
  customerName: string;
}): Promise<string> {
  const stripe = await getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `HFT Consultation — ${options.consultationTypeName}`,
            description: `${options.durationMin}-minute private consultation with Demi`,
          },
          unit_amount: options.priceCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${options.origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.origin}/book?cancelled=1`,
    customer_email: options.customerEmail,
    metadata: {
      booking_id: options.bookingId,
      consultation_type: options.consultationTypeName,
      customer_name: options.customerName,
      duration_min: String(options.durationMin),
    },
  });

  if (!session.url) {
    throw new StripeBookingError("Stripe did not return a checkout URL.");
  }

  return session.url;
}

export { friendlyStripeError };
