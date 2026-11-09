import Link from "next/link";
import { requireActiveMember } from "@/lib/dal";
import { getMembership } from "@/lib/membership";
import { getConsultationType } from "@/lib/consultation-types";
import { getActiveBookingForUser } from "@/lib/bookings";
import { getQuestionnaireForUser } from "@/lib/consultation-questionnaire";
import ConsultationBookingClient from "./ConsultationBookingClient";

export const dynamic = "force-dynamic";

export default async function ConsultationPage() {
  const user = await requireActiveMember();
  const m = await getMembership(user.id);
  const type = await getConsultationType("strategy");
  const existingBooking = await getActiveBookingForUser(user.id);
  const questionnaire = await getQuestionnaireForUser(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          HFT Strategy Consultation
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          Schedule your complimentary strategy consultation as an active HFT member.
        </p>
      </div>
      <ConsultationBookingClient consultationType={type} existingBooking={existingBooking} />
      {questionnaire && (
        <p className="text-sm text-white/60">
          Questionnaire on file. <Link href="/my-questionnaire" className="text-brand-400">View your questionnaire history</Link>.
        </p>
      )}
    </div>
  );
}
