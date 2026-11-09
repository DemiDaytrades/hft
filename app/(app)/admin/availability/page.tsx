import type { Metadata } from "next";

import { listConsultationTypes } from "@/lib/consultation-types";
import { requireAdmin } from "@/lib/dal";
import AvailabilityManager from "./AvailabilityManager";

export const metadata: Metadata = {
  title: "Availability",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  await requireAdmin();

  const types = await listConsultationTypes();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Availability & rates
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            Configure Demi&apos;s weekly availability and consultation offerings.
            Times are in Central Time (CT).
          </p>
        </div>
      </div>

      <AvailabilityManager initialTypes={types} />
    </div>
  );
}
