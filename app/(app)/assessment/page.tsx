import { requireActiveMember } from "@/lib/dal";
import { getLatestCompleted, getActiveAttempt, publicQuestions, toStudentAttempt } from "@/lib/placement-assessment-storage";
import { getLatestIntake } from "@/lib/student-intake";
import AssessmentClient from "./AssessmentClient";

export default async function AssessmentPage() {
  const user = await requireActiveMember();
  const intake = await getLatestIntake(user.id);
  const active = await getActiveAttempt(user.id);
  const latest = await getLatestCompleted(user.id);

  let eligibility = "Complete Strategy Call Intake First";
  if (intake?.status === "completed") {
    const data = intake.data ? JSON.parse(intake.data) : {};
    const exp = data.expLevel ?? (data.tradedForex === "Yes" ? "Developing" : "Brand New");
    if (exp === "Brand New") eligibility = "Not Required — Brand New Student (assessment optional)";
    else if (exp === "Beginner") eligibility = "Optional — Beginner";
    else if (exp === "Unsure") eligibility = "Assessment Optional — Instructor Review Recommended";
    else eligibility = "Technical Assessment Recommended";
  }

  return <AssessmentClient userId={user.id} questions={publicQuestions()} activeAttempt={toStudentAttempt(active)} latestResult={toStudentAttempt(latest)} eligibility={eligibility} />;
}
