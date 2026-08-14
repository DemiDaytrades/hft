import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getAffiliateByCode, recordClick } from "@/lib/affiliates";
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
} from "@/lib/referral";

export const dynamic = "force-dynamic";

/**
 * Referral entry point: /r/<code>
 *
 * A route handler rather than `?ref=` on every page, because catching a query
 * param site-wide would need Proxy (ex-middleware), which Next 16 forces onto
 * the Node runtime and OpenNext refuses to bundle. This also gives an exact
 * place to count the click.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const affiliate = await getAffiliateByCode(code);

  // Unknown or paused code: send them to the site as normal rather than
  // showing an error. A dead link should never look broken to a visitor.
  if (!affiliate) redirect("/");

  await recordClick(affiliate.id);

  const jar = await cookies();
  // First-touch attribution: an existing referrer is never overwritten, so the
  // affiliate who introduced them keeps the credit.
  if (!jar.get(REFERRAL_COOKIE)) {
    jar.set(REFERRAL_COOKIE, affiliate.code, {
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  redirect("/");
}
