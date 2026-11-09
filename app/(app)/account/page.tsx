import type { Metadata } from "next";

import ChangePasswordForm from "@/components/ChangePasswordForm";
import { requirePasswordReadyUser } from "@/lib/dal";
import { getMembership, isActive } from "@/lib/membership";
import { isComplimentaryActive, membershipLabel } from "@/lib/membership-access";
import { openBillingPortalAction } from "./actions";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

/** Available to every signed-in user, staff and students alike. */
export default async function AccountPage() {
  const user = await requirePasswordReadyUser();
  const membership = await getMembership(user.id);
  const active = isActive(membership?.subscriptionStatus);

  const renewsOn = membership?.currentPeriodEnd
    ? new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Account
        </h1>
        <p className="mt-1 text-[14px] text-white/45">{user.email}</p>
      </div>

      {membership && (
        <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
            Membership
          </h2>
          <p className="mt-3 text-[15px] text-white">
            {membershipLabel(membership)}
            {active && renewsOn ? ` — renews ${renewsOn}` : ""}
          </p>
          {isComplimentaryActive(membership) && (
            <p className="mt-2 text-[13px] text-white/60">Complimentary access expires {new Date(membership.complimentaryAccessExpiresAt!).toLocaleDateString("en-US")}.</p>
          )}
          {membership.stripeCustomerId && <><p className="mt-2 text-[13px] text-white/45">
            Update your card, view past invoices, or cancel any time.
          </p>
          <form action={openBillingPortalAction} className="mt-6">
            <button
              type="submit"
              className="rounded-sm border border-white/15 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/35 hover:text-white"
            >
              Manage billing
            </button>
          </form>
          </>}
        </section>
      )}

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
        <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
          Change password
        </h2>
        <p className="mt-1 text-[13.5px] text-white/45">
          Updating your password signs you out everywhere else.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
