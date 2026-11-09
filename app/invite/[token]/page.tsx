import type { Metadata } from "next";
import Link from "next/link";

import InviteForm from "@/components/InviteForm";
import Logo from "@/components/Logo";
import { getInviteByToken, inviteStatus } from "@/lib/invites";
import { findUserByEmail } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Your invite",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByToken(token);
  const status = inviteStatus(invite);
  const existingAccount = status === "valid" && invite ? !!(await findUserByEmail(invite.email)) : false;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" aria-label="High Frequency Trading — home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          {status === "valid" && invite ? (
            <>
              <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em]">
                You&apos;re invited
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-white/50">
                {existingAccount
                  ? "Redeem your invitation, then sign in with your existing password. Your password will not be replaced."
                  : invite.kind === "admin"
                  ? "Set a password and you'll have full access to run the site — members, pricing and affiliates."
                  : invite.kind === "member" || invite.kind.startsWith("member:")
                    ? "Set a password and your membership is ready. Nothing to pay."
                    : "Set a password and your affiliate account is ready. You'll get a link to share and earn on everyone who joins through it."}
              </p>
              <InviteForm token={token} email={invite.email} existingAccount={existingAccount} />
            </>
          ) : (
            <>
              <h1 className="font-display text-[24px] font-bold uppercase tracking-[0.04em]">
                {status === "used" ? "Already used" : "Link expired"}
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                {status === "used"
                  ? "This invite has already been claimed. If that was you, just sign in."
                  : "This invite link is no longer valid. Ask for a fresh one and it'll work straight away."}
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
