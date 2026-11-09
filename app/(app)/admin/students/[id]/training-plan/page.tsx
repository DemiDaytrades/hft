import { requireAdmin } from "@/lib/dal";
import { getLatestPlan, upsertPlan } from "@/lib/training-plan";
import { getLatestIntake } from "@/lib/student-intake";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import TrainingPlanWorkspace from "./TrainingPlanWorkspace";

const priorities = ["Forex Fundamentals","Market Structure","Candlesticks","Support & Resistance","Trade Execution","Stop Loss / Take Profit","Position Sizing","Risk Management","MT5","TradingView","Trade Planning","Entries / Exits","Trading Psychology","Discipline","Patience","Journaling","Backtesting","Strategy Development","Other"];
const methods = ["Hands-On","Live Demonstration","Video","Reading","Notes","Diagrams","Repetition","Quizzes","Assignments","Chart Practice","Screenshot Feedback"];
const risk = ["Risk per trade","Position sizing","Stop-loss discipline","Overtrading","FOMO","Revenge trading","Patience","Early exits","Holding losers","Emotional decision-making","Rule adherence","Confidence","Other"];
const support = ["Live coaching","Assignment feedback","Chart review","Screenshot feedback","Quiz review","Accountability check-ins","Trade journal review","Other"];

export default async function TrainingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = (await getCloudflareContext()).env.DB;
  const user = await db.prepare(`SELECT id, name FROM "user" WHERE id = ?;`).bind(id).first<any>();
  const intake = await getLatestIntake(id);
  const plan = await getLatestPlan(id);
  const raw = plan?.data ? JSON.parse(plan.data) : {};
  const data = { ...raw };
  if (typeof data.priorities === "string") data.priorities = data.priorities.split(",").map((x: string) => x.trim()).filter(Boolean);
  if (!Array.isArray(data.priorities)) data.priorities = [];
  for (const key of ["methods","riskFocus","supportPlan"]) {
    if (typeof data[key] === "string") data[key] = data[key].split(",").map((x: string) => x.trim()).filter(Boolean);
    if (!Array.isArray(data[key])) data[key] = [];
  }


  return (
    <TrainingPlanWorkspace userId={id} data={data} planStatus={plan?.status ?? ""} />
  );
}
