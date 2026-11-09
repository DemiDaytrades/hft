import { requireActiveMember } from "@/lib/dal";
import { getPublishedForUser } from "@/lib/consultation-game-plan";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel>
      <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">{title}</h2>
      <div className="space-y-1 text-sm text-white/80">{children}</div>
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return null;
  return (
    <p><span className="text-white/50">{label}:</span> {v}</p>
  );
}

export default async function GamePlanPage() {
  const user = await requireActiveMember();
  const published = await getPublishedForUser(user.id);
  if (!published) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">My HFT Game Plan</h1>
          <p className="mt-1 text-[14px] text-white/45">Your personalized roadmap</p>
        </div>
        <Panel>
          <p className="text-white/70">Your personalized Game Plan is not yet published. After your consultation is completed and approved, your instructor will publish your plan here.</p>
        </Panel>
      </div>
    );
  }
  const gp = published.student_visible_payload || {};
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">My HFT Game Plan</h1>
        <p className="mt-1 text-[14px] text-white/45">Approved, read-only personalized roadmap (v{published.version})</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="My Starting Point">
          <Row label="Experience Level" value={gp.startingPoint?.experienceLevel} />
          <Row label="Traded Before" value={gp.startingPoint?.tradedBefore} />
          <Row label="Markets" value={gp.startingPoint?.markets} />
          <Row label="Platforms" value={gp.startingPoint?.platforms} />
          <Row label="Broker" value={gp.startingPoint?.broker} />
          <Row label="Strengths" value={gp.startingPoint?.strengths} />
          <Row label="Knowledge Gaps" value={gp.startingPoint?.knowledgeGaps} />
        </Card>
        <Card title="My Goals">
          <Row label="Primary Goal" value={gp.goals?.primary} />
          <Row label="30-Day Goal" value={gp.goals?.goal30} />
          <Row label="90-Day Goal" value={gp.goals?.goal90} />
          <Row label="6-12 Month Goal" value={gp.goals?.goal612} />
          <Row label="Motivation" value={gp.goals?.motivation} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="My Learning Profile">
          <Row label="Learning Preferences" value={gp.learningProfile?.prefs} />
          <Row label="Practice/Homework" value={gp.learningProfile?.practicePrefs} />
          <Row label="Weekly Capacity" value={gp.learningProfile?.weeklyCapacity} />
          <Row label="Support Preferences" value={gp.learningProfile?.supportPrefs} />
        </Card>
        <Card title="My Schedule">
          <Row label="Time Zone" value={gp.schedule?.timezone} />
          <Row label="Schedule/Obligations" value={gp.schedule?.schedule} />
          <Row label="Recommended Class Windows" value={gp.schedule?.classWindows} />
        </Card>
      </div>

      <Card title="My Training Roadmap">
        <Row label="Recommended Starting Point" value={gp.roadmap?.recommendedStart} />
        <Row label="Personalized Plan" value={gp.roadmap?.personalizedPlan} />
        <Row label="My First Lesson" value={gp.roadmap?.firstLesson} />
        <Row label="My Practice Plan" value={gp.roadmap?.firstHomework} />
        <Row label="My Next Steps" value={gp.roadmap?.nextAction} />
      </Card>
    </div>
  );
}
