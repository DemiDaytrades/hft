import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import CommunicationsTestClient from "./CommunicationsTestClient";

export const metadata: Metadata = {
  title: "Communications Test",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CommunicationsTestPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Communications Test
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          Admin-only SMS test using existing production communications path.
        </p>
      </div>
      <CommunicationsTestClient />
    </div>
  );
}
