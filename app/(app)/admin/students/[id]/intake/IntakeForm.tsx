"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveDraftAction, completeIntakeAction } from "./actions";

const input = "w-full rounded border border-white/12 bg-ink-950 px-3 py-2 text-white";
const label = "mb-1 block text-sm font-medium text-white/80";
const section = "space-y-4 rounded-lg border border-white/10 bg-ink-900/60 p-5";
const yesNo = ["Yes", "No"];

function Multi({ options, value = [], onChange, disabled = false }: { options: string[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-white/80">
          <input disabled={disabled} type="checkbox" checked={value.includes(o)} onChange={(e) => {
            if (e.target.checked) onChange([...value, o]); else onChange(value.filter((x) => x !== o));
          }} />
          {o}
        </label>
      ))}
    </div>
  );
}

export default function IntakeForm({ userId, intake, canonicalIntakeExists = false, protectedKeys = [] }: { userId: string; intake: any; canonicalIntakeExists?: boolean; protectedKeys?: readonly string[] }) {
  const router = useRouter();
  const initial = intake?.data ? JSON.parse(intake.data) : {};
  const [data, setData] = useState<any>(initial);
  const [intakeId, setIntakeId] = useState<string | null>(intake?.id ?? null);
  const [saving, setSaving] = useState(false);
  const locked = (key: string) => canonicalIntakeExists && (protectedKeys.includes(key) || key.startsWith("summary"));
  function setField(key: string, value: any) { if (locked(key)) return; setData((d: any) => ({ ...d, [key]: value })); }
  const tradedBefore = data.tradedBefore === "Yes";

  async function saveDraft() {
    setSaving(true);
    const res = await saveDraftAction(userId, intakeId, data);
    setIntakeId(res.intakeId);
    setSaving(false);
  }
  async function complete() {
    let currentId = intakeId;
    if (!currentId) {
      const res = await saveDraftAction(userId, null, data);
      currentId = res.intakeId;
      setIntakeId(currentId);
    }
    await completeIntakeAction(userId, currentId!, data);
    router.push(`/admin/students/${userId}`);
  }

  return (
    <div className="space-y-6">
      <Link href={`/admin/students/${userId}`} className="text-brand-400">← Back to Student Profile</Link>
      <h1 className="font-display text-2xl font-bold uppercase">Historical Student Intake</h1>
      {canonicalIntakeExists && <div className="rounded border border-white/10 p-4"><p>Overlapping answers and the old after-call summary are historical and read-only. Distinct legacy-only answers remain editable.</p><Link className="text-brand-400" href={`/admin/student-intake-v2?studentUserId=${encodeURIComponent(userId)}`}>Open canonical consultation review</Link></div>}

      <section className={section}>
        <h2 className="font-bold text-white">Get to Know You</h2>
        <p className="text-sm text-white/50">Before we get into trading, I want to understand who you are...</p>
        <div><label className={label}>Tell me a little about yourself outside of trading.</label><textarea disabled={locked("gtk1")} className={input} value={data.gtk1 ?? ""} onChange={(e) => setField("gtk1", e.target.value)} /></div>
        <div><label className={label}>What do you currently do for work, school, business, or your main source of income?</label><textarea disabled={locked("gtk2")} className={input} value={data.gtk2 ?? ""} onChange={(e) => setField("gtk2", e.target.value)} /></div>
        <div><label className={label}>Are you currently building or interested in building a business?</label><select disabled={locked("gtk3")} className={input} value={data.gtk3 ?? ""} onChange={(e) => setField("gtk3", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        {data.gtk3 === "Yes" && (
          <>
            <div><label className={label}>What is it?</label><textarea disabled={locked("gtk3a")} className={input} value={data.gtk3a ?? ""} onChange={(e) => setField("gtk3a", e.target.value)} /></div>
            <div><label className={label}>What stage is it in?</label><input disabled={locked("gtk3b")} className={input} value={data.gtk3b ?? ""} onChange={(e) => setField("gtk3b", e.target.value)} /></div>
            <div><label className={label}>What do you ultimately want it to become?</label><textarea disabled={locked("gtk3c")} className={input} value={data.gtk3c ?? ""} onChange={(e) => setField("gtk3c", e.target.value)} /></div>
          </>
        )}
        <div><label className={label}>Where would you like to be personally, professionally, and financially one year from now?</label><textarea disabled={locked("gtk4")} className={input} value={data.gtk4 ?? ""} onChange={(e) => setField("gtk4", e.target.value)} /></div>
        <div><label className={label}>What are you already really good at that you believe could become valuable or make you money long-term?</label><textarea disabled={locked("gtk5")} className={input} value={data.gtk5 ?? ""} onChange={(e) => setField("gtk5", e.target.value)} /></div>
        <div><label className={label}>What motivates you the most right now?</label>
          <Multi disabled={locked("gtk6")} options={["Financial freedom", "Helping family", "Building a business", "Leaving my job", "Creating additional income", "Becoming financially educated", "Independence", "Building long-term wealth", "Personal growth", "Other"]} value={data.gtk6 ?? []} onChange={(v) => setField("gtk6", v)} />
        </div>
        <div><label className={label}>What do you feel is your biggest obstacle right now?</label>
          <Multi disabled={locked("gtk7")} options={["Money", "Knowledge", "Consistency", "Discipline", "Confidence", "Time", "Connections/resources", "Fear of failure", "Not knowing where to start", "Other"]} value={data.gtk7 ?? []} onChange={(v) => setField("gtk7", v)} />
          <textarea disabled={locked("gtk7note")} className={input} placeholder="Explanation" value={data.gtk7note ?? ""} onChange={(e) => setField("gtk7note", e.target.value)} />
        </div>
        <div><label className={label}>When you receive extra money, what are you naturally most likely to do with it?</label>
          <select disabled={locked("gtk8")} className={input} value={data.gtk8 ?? ""} onChange={(e) => setField("gtk8", e.target.value)}>
            <option value="">Select</option><option>Save it</option><option>Spend it</option><option>Invest it</option><option>Reinvest into a business</option><option>Pay down debt</option><option>Help family</option><option>Combination</option><option>Other</option>
          </select>
          <textarea disabled={locked("gtk8note")} className={input} placeholder="Explanation" value={data.gtk8note ?? ""} onChange={(e) => setField("gtk8note", e.target.value)} />
        </div>
        <div><label className={label}>How would you describe your relationship with money right now?</label><textarea disabled={locked("gtk9")} className={input} value={data.gtk9 ?? ""} onChange={(e) => setField("gtk9", e.target.value)} /></div>
        <div><label className={label}>What is one financial habit you would like to improve?</label><textarea disabled={locked("gtk10")} className={input} value={data.gtk10 ?? ""} onChange={(e) => setField("gtk10", e.target.value)} /></div>
        <div><label className={label}>What's something you've accomplished that you're genuinely proud of?</label><textarea disabled={locked("gtk11")} className={input} value={data.gtk11 ?? ""} onChange={(e) => setField("gtk11", e.target.value)} /></div>
        <div><label className={label}>When something doesn't work the first time, how do you normally respond?</label><textarea disabled={locked("gtk12")} className={input} value={data.gtk12 ?? ""} onChange={(e) => setField("gtk12", e.target.value)} /></div>
        <div><label className={label}>What tends to make you lose motivation or consistency?</label><textarea disabled={locked("gtk13")} className={input} value={data.gtk13 ?? ""} onChange={(e) => setField("gtk13", e.target.value)} /></div>
        <div><label className={label}>What helps you stay accountable?</label><textarea disabled={locked("gtk14")} className={input} value={data.gtk14 ?? ""} onChange={(e) => setField("gtk14", e.target.value)} /></div>
        <div><label className={label}>What do you want from Demi as a mentor beyond simply learning how to trade?</label><textarea disabled={locked("gtk15")} className={input} value={data.gtk15 ?? ""} onChange={(e) => setField("gtk15", e.target.value)} /></div>
        <div><label className={label}>What would make your HFT experience genuinely valuable to you even before financial results are considered?</label><textarea disabled={locked("gtk16")} className={input} value={data.gtk16 ?? ""} onChange={(e) => setField("gtk16", e.target.value)} /></div>
        <div><label className={label}>Is there anything about your life, schedule, goals, responsibilities, or personality that you think Demi should know in order to teach you effectively?</label><textarea disabled={locked("gtk17")} className={input} value={data.gtk17 ?? ""} onChange={(e) => setField("gtk17", e.target.value)} /></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Personal Strategy — Student-Specific (Optional)</h2>
        <label className="flex items-center gap-2 text-white/80">
          <input disabled={locked("bubbaEnabled")} type="checkbox" checked={data.bubbaEnabled === true} onChange={(e) => setField("bubbaEnabled", e.target.checked)} />
          Include Bubba personal strategy questions
        </label>
        {data.bubbaEnabled && (
          <>
            <div><label className={label}>Where do you realistically want to be professionally and financially by age 22?</label><textarea disabled={locked("b1")} className={input} value={data.b1 ?? ""} onChange={(e) => setField("b1", e.target.value)} /></div>
            <div><label className={label}>What business ideas or projects are you currently working on, and which one do you believe has the most potential?</label><textarea disabled={locked("b2")} className={input} value={data.b2 ?? ""} onChange={(e) => setField("b2", e.target.value)} /></div>
            <div><label className={label}>What do you think separates your mindset from most people your age?</label><textarea disabled={locked("b3")} className={input} value={data.b3 ?? ""} onChange={(e) => setField("b3", e.target.value)} /></div>
            <div><label className={label}>Why does Forex specifically interest you?</label><textarea disabled={locked("b4")} className={input} value={data.b4 ?? ""} onChange={(e) => setField("b4", e.target.value)} /></div>
            <div><label className={label}>How do you see trading fitting into everything else you're trying to build?</label>
              <select disabled={locked("b5")} className={input} value={data.b5 ?? ""} onChange={(e) => setField("b5", e.target.value)}>
                <option value="">Select</option><option>Additional income skill</option><option>Investing/financial skill</option><option>Another business skill</option><option>Something I eventually want to master seriously</option><option>Potential future career/business</option><option>Still figuring it out</option><option>Other</option>
              </select>
              <textarea disabled={locked("b5note")} className={input} placeholder="Explanation" value={data.b5note ?? ""} onChange={(e) => setField("b5note", e.target.value)} />
            </div>
            <div><label className={label}>If you had more capital today, what would you actually do with it?</label><textarea disabled={locked("b6")} className={input} value={data.b6 ?? ""} onChange={(e) => setField("b6", e.target.value)} /></div>
            <div><label className={label}>When you see a business or money-making opportunity, how do you decide whether it's worth taking the risk?</label><textarea disabled={locked("b7")} className={input} value={data.b7 ?? ""} onChange={(e) => setField("b7", e.target.value)} /></div>
            <div><label className={label}>What do you think could potentially get in your own way over the next year?</label><textarea disabled={locked("b8")} className={input} value={data.b8 ?? ""} onChange={(e) => setField("b8", e.target.value)} /></div>
            <div><label className={label}>Sixty days from now, what educational progress would make you say working with Demi/HFT was genuinely worth your time?</label><textarea disabled={locked("b9")} className={input} value={data.b9 ?? ""} onChange={(e) => setField("b9", e.target.value)} /></div>
            <div><label className={label}>Outside of Forex, is there anything about business, money, entrepreneurship, or life that you specifically want Demi's guidance on?</label><textarea disabled={locked("b10")} className={input} value={data.b10 ?? ""} onChange={(e) => setField("b10", e.target.value)} /></div>
          </>
        )}
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Get to Know Them</h2>
        <p className="text-sm text-white/50">Instructor prompt: “First, I want to thank you again for being an HFT student...”</p>
        <div><label className={label}>What do you do for work?</label><input disabled={locked("work")} className={input} value={data.work ?? ""} onChange={(e) => setField("work", e.target.value)} /></div>
        <div><label className={label}>How long have you been doing that?</label><input disabled={locked("workDuration")} className={input} value={data.workDuration ?? ""} onChange={(e) => setField("workDuration", e.target.value)} /></div>
        <div><label className={label}>What made you interested in learning Forex?</label><textarea disabled={locked("whyForex")} className={input} value={data.whyForex ?? ""} onChange={(e) => setField("whyForex", e.target.value)} /></div>
        <div><label className={label}>Why did you decide to join High Frequency Talent?</label><textarea disabled={locked("whyHFT")} className={input} value={data.whyHFT ?? ""} onChange={(e) => setField("whyHFT", e.target.value)} /></div>
        <div><label className={label}>What are you hoping I can help you accomplish?</label><textarea disabled={locked("hoping")} className={input} value={data.hoping ?? ""} onChange={(e) => setField("hoping", e.target.value)} /></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Trading Experience</h2>
        <div><label className={label}>Have you ever traded before?</label>
          <select disabled={locked("tradedBefore")} className={input} value={data.tradedBefore ?? ""} onChange={(e) => setField("tradedBefore", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        {tradedBefore && (
          <>
            <div><label className={label}>What have you traded?</label>
              <Multi disabled={locked("tradedMarkets")} options={["Forex", "Stocks", "Crypto", "Futures", "Options", "Indices", "Other"]} value={data.tradedMarkets ?? []} onChange={(v) => setField("tradedMarkets", v)} />
            </div>
            <div><label className={label}>How long have you been trading or studying trading?</label><input disabled={locked("tradingDuration")} className={input} value={data.tradingDuration ?? ""} onChange={(e) => setField("tradingDuration", e.target.value)} /></div>
            <div><label className={label}>Have you ever traded on a demo account?</label>
              <select disabled={locked("demoAccount")} className={input} value={data.demoAccount ?? ""} onChange={(e) => setField("demoAccount", e.target.value)}>
                <option value="">Select</option><option>Yes</option><option>No</option>
              </select>
            </div>
            <div><label className={label}>Have you ever traded real money?</label>
              <select disabled={locked("realMoney")} className={input} value={data.realMoney ?? ""} onChange={(e) => setField("realMoney", e.target.value)}>
                <option value="">Select</option><option>Yes</option><option>No</option>
              </select>
            </div>
            <div><label className={label}>What trading platforms have you used?</label><input disabled={locked("platformsUsed")} className={input} value={data.platformsUsed ?? ""} onChange={(e) => setField("platformsUsed", e.target.value)} /></div>
          </>
        )}
        <div><label className={label}>Have you used MT4 or MT5 before?</label>
          <select disabled={locked("mt45")} className={input} value={data.mt45 ?? ""} onChange={(e) => setField("mt45", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Do you currently have MT5 installed?</label>
          <select disabled={locked("mt5Installed")} className={input} value={data.mt5Installed ?? ""} onChange={(e) => setField("mt5Installed", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Do you know how to place a BUY and SELL trade?</label>
          <select disabled={locked("buySell")} className={input} value={data.buySell ?? ""} onChange={(e) => setField("buySell", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Do you understand stop loss and take profit?</label>
          <select disabled={locked("slTp")} className={input} value={data.slTp ?? ""} onChange={(e) => setField("slTp", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Do you understand lot sizes?</label>
          <select disabled={locked("lotSizes")} className={input} value={data.lotSizes ?? ""} onChange={(e) => setField("lotSizes", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Can you read candlestick charts?</label>
          <select disabled={locked("candles")} className={input} value={data.candles ?? ""} onChange={(e) => setField("candles", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Do you understand support and resistance?</label>
          <select disabled={locked("sr")} className={input} value={data.sr ?? ""} onChange={(e) => setField("sr", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Have you learned risk management before?</label>
          <select disabled={locked("riskMgmt")} className={input} value={data.riskMgmt ?? ""} onChange={(e) => setField("riskMgmt", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        <div><label className={label}>Have you ever taken another trading course?</label>
          <select disabled={locked("priorCourse")} className={input} value={data.priorCourse ?? ""} onChange={(e) => setField("priorCourse", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option>
          </select>
        </div>
        {data.priorCourse === "Yes" && (
          <>
            <div><label className={label}>What did they teach you?</label><textarea disabled={locked("priorCourseTaught")} className={input} value={data.priorCourseTaught ?? ""} onChange={(e) => setField("priorCourseTaught", e.target.value)} /></div>
            <div><label className={label}>What do you still feel confused about?</label><textarea disabled={locked("priorCourseConfused")} className={input} value={data.priorCourseConfused ?? ""} onChange={(e) => setField("priorCourseConfused", e.target.value)} /></div>
          </>
        )}
        {tradedBefore && (
          <div>
            <label className={label}>Have you ever lost or blown a trading account?</label>
            <select disabled={locked("blownAccount")} className={input} value={data.blownAccount ?? ""} onChange={(e) => setField("blownAccount", e.target.value)}>
              <option value="">Select</option><option>Yes</option><option>No</option>
            </select>
            {data.blownAccount === "Yes" && (
              <div className="mt-2"><label className={label}>What do you think caused it?</label><textarea disabled={locked("blownCause")} className={input} value={data.blownCause ?? ""} onChange={(e) => setField("blownCause", e.target.value)} /></div>
            )}
          </div>
        )}
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Financial Goals</h2>
        <p className="text-sm text-white/50">Financial goals are the student’s personal goals. HFT does not promise trading profits.</p>
        <div><label className={label}>What is your biggest financial goal right now?</label><textarea disabled={locked("financialGoal")} className={input} value={data.financialGoal ?? ""} onChange={(e) => setField("financialGoal", e.target.value)} /></div>
        <div><label className={label}>Where would you like to be financially 6–12 months from now?</label><textarea disabled={locked("financial612")} className={input} value={data.financial612 ?? ""} onChange={(e) => setField("financial612", e.target.value)} /></div>
        <div><label className={label}>What are you mainly trying to accomplish?</label>
          <Multi disabled={locked("financialAccomplish")} options={["Additional income", "Build savings", "Pay down debt", "Learn a new skill", "Build long-term wealth", "Eventually replace employment income", "Start investing more seriously", "Something else"]} value={data.financialAccomplish ?? []} onChange={(v) => setField("financialAccomplish", v)} />
        </div>
        <div><label className={label}>If trading eventually became profitable for you, what would you want that additional money to help you accomplish?</label><textarea disabled={locked("profitUse")} className={input} value={data.profitUse ?? ""} onChange={(e) => setField("profitUse", e.target.value)} /></div>
        <div><label className={label}>What would success from this program look like to you personally?</label><textarea disabled={locked("successLook")} className={input} value={data.successLook ?? ""} onChange={(e) => setField("successLook", e.target.value)} /></div>
        <div><label className={label}>What would you consider good progress after your first 90 days?</label><textarea disabled={locked("progress90")} className={input} value={data.progress90 ?? ""} onChange={(e) => setField("progress90", e.target.value)} /></div>
        <div><label className={label}>How comfortable are you with financial risk? (1–10)</label><input disabled={locked("riskComfort")} type="number" min={1} max={10} className={input} value={data.riskComfort ?? ""} onChange={(e) => setField("riskComfort", e.target.value)} /></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Trading Psychology & Discipline</h2>
        {tradedBefore ? (
          <>
            <div><label className={label}>Do you ever enter trades because you’re afraid of missing out?</label><select disabled={locked("fomo")} className={input} value={data.fomo ?? ""} onChange={(e) => setField("fomo", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>Have you ever revenge traded after taking a loss?</label><select disabled={locked("revenge")} className={input} value={data.revenge ?? ""} onChange={(e) => setField("revenge", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>Do you tend to close winning trades too early?</label><select disabled={locked("closeEarly")} className={input} value={data.closeEarly ?? ""} onChange={(e) => setField("closeEarly", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>Do you ever hold losing trades longer than you should?</label><select disabled={locked("holdLosers")} className={input} value={data.holdLosers ?? ""} onChange={(e) => setField("holdLosers", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>Have you ever increased your lot size because you were trying to recover money?</label><select disabled={locked("increaseLots")} className={input} value={data.increaseLots ?? ""} onChange={(e) => setField("increaseLots", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>How emotional would you say you get while trading?</label><input disabled={locked("emotional")} className={input} value={data.emotional ?? ""} onChange={(e) => setField("emotional", e.target.value)} /></div>
            <div><label className={label}>How patient are you? (1–10)</label><input disabled={locked("patience")} type="number" min={1} max={10} className={input} value={data.patience ?? ""} onChange={(e) => setField("patience", e.target.value)} /></div>
            <div><label className={label}>What do you think your biggest discipline problem is right now?</label><textarea disabled={locked("disciplineProblem")} className={input} value={data.disciplineProblem ?? ""} onChange={(e) => setField("disciplineProblem", e.target.value)} /></div>
          </>
        ) : (
          <>
            <div><label className={label}>Do you normally consider yourself patient when you’re learning something new?</label><select disabled={locked("patientNew")} className={input} value={data.patientNew ?? ""} onChange={(e) => setField("patientNew", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
            <div><label className={label}>How do you normally react when something doesn’t go your way financially?</label><textarea disabled={locked("financialReaction")} className={input} value={data.financialReaction ?? ""} onChange={(e) => setField("financialReaction", e.target.value)} /></div>
          </>
        )}
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Learning Style</h2>
        <div><label className={label}>How do you learn best?</label><textarea disabled={locked("learnBest")} className={input} value={data.learnBest ?? ""} onChange={(e) => setField("learnBest", e.target.value)} /></div>
        <div><label className={label}>Which learning methods help you?</label>
          <Multi disabled={locked("learnMethods")} options={["Watching someone demonstrate", "Doing it yourself while someone guides you", "Taking notes", "Seeing diagrams", "Watching videos", "Reading", "Repetition", "Practice assignments", "Quizzes", "Asking questions while we go"]} value={data.learnMethods ?? []} onChange={(v) => setField("learnMethods", v)} />
        </div>
        <div><label className={label}>What lesson pace do you prefer?</label>
          <select disabled={locked("pace")} className={input} value={data.pace ?? ""} onChange={(e) => setField("pace", e.target.value)}>
            <option value="">Select</option><option>Slow and thorough</option><option>Moderate</option><option>Faster once I understand</option>
          </select>
        </div>
        <div><label className={label}>Do you usually take notes while learning?</label><select disabled={locked("takeNotes")} className={input} value={data.takeNotes ?? ""} onChange={(e) => setField("takeNotes", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>Would practice assignments between classes help you?</label><select disabled={locked("practiceAssignments")} className={input} value={data.practiceAssignments ?? ""} onChange={(e) => setField("practiceAssignments", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>Would short quizzes after lessons help you remember the information?</label><select disabled={locked("quizzesHelp")} className={input} value={data.quizzesHelp ?? ""} onChange={(e) => setField("quizzesHelp", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>Would you be comfortable sending screenshots of practice charts for educational feedback?</label><select disabled={locked("screenshots")} className={input} value={data.screenshots ?? ""} onChange={(e) => setField("screenshots", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Work Schedule & Availability</h2>
        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
          <div key={day} className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <label className={label}>{day}</label>
            <select className={input} value={data[`sched_${day}_status`] ?? ""} onChange={(e) => setField(`sched_${day}_status`, e.target.value)}>
              <option value="">Select</option><option>Working</option><option>Off</option>
            </select>
            <input type="time" className={input} value={data[`sched_${day}_start`] ?? ""} onChange={(e) => setField(`sched_${day}_start`, e.target.value)} />
            <input type="time" className={input} value={data[`sched_${day}_end`] ?? ""} onChange={(e) => setField(`sched_${day}_end`, e.target.value)} />
          </div>
        ))}
        <div><label className={label}>What time zone are you in?</label><input disabled={locked("timezone")} className={input} value={data.timezone ?? ""} onChange={(e) => setField("timezone", e.target.value)} /></div>
        <div><label className={label}>How long is your commute after work?</label><input disabled={locked("commute")} className={input} value={data.commute ?? ""} onChange={(e) => setField("commute", e.target.value)} /></div>
        <div><label className={label}>Does your schedule normally stay the same every week?</label><select disabled={locked("scheduleSame")} className={input} value={data.scheduleSame ?? ""} onChange={(e) => setField("scheduleSame", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>What days usually work best for class?</label><input disabled={locked("bestDays")} className={input} value={data.bestDays ?? ""} onChange={(e) => setField("bestDays", e.target.value)} /></div>
        <div><label className={label}>What time windows usually work best?</label><input disabled={locked("bestTimes")} className={input} value={data.bestTimes ?? ""} onChange={(e) => setField("bestTimes", e.target.value)} /></div>
        <div><label className={label}>Do you have regular responsibilities that affect your availability?</label>
          <Multi disabled={locked("responsibilities")} options={["Kids", "School", "Second Job", "Church", "Appointments", "Family Responsibilities", "Other"]} value={data.responsibilities ?? []} onChange={(v) => setField("responsibilities", v)} />
        </div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Technology Check</h2>
        <div><label className={label}>What device will you primarily use for trading?</label>
          <select disabled={locked("device")} className={input} value={data.device ?? ""} onChange={(e) => setField("device", e.target.value)}>
            <option value="">Select</option><option>Phone</option><option>Tablet</option><option>Windows computer</option><option>Mac</option>
          </select>
        </div>
        <div><label className={label}>Do you have reliable internet for class?</label><select disabled={locked("internet")} className={input} value={data.internet ?? ""} onChange={(e) => setField("internet", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>Do you already have MT5 installed?</label><select disabled={locked("mt5Installed2")} className={input} value={data.mt5Installed2 ?? ""} onChange={(e) => setField("mt5Installed2", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        <div><label className={label}>Do you already have a broker account?</label><select disabled={locked("broker")} className={input} value={data.broker ?? ""} onChange={(e) => setField("broker", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
        {data.broker === "Yes" && (
          <>
            <div><label className={label}>Which broker do you currently use?</label><input disabled={locked("brokerName")} className={input} value={data.brokerName ?? ""} onChange={(e) => setField("brokerName", e.target.value)} /></div>
            <div><label className={label}>Are you happy with them?</label><select disabled={locked("brokerHappy")} className={input} value={data.brokerHappy ?? ""} onChange={(e) => setField("brokerHappy", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
          </>
        )}
        {data.broker === "No" && (
          <p className="text-sm text-white/50">Instructor note: a broker/referral may be discussed; any affiliate relationship must be disclosed.</p>
        )}
        <div><label className={label}>Do you know how to create or log into a demo account?</label><select disabled={locked("demoLogin")} className={input} value={data.demoLogin ?? ""} onChange={(e) => setField("demoLogin", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">What They Want to Learn</h2>
        <div><label className={label}>Goal 1</label><input disabled={locked("goal1")} className={input} value={data.goal1 ?? ""} onChange={(e) => setField("goal1", e.target.value)} /></div>
        <div><label className={label}>Goal 2</label><input disabled={locked("goal2")} className={input} value={data.goal2 ?? ""} onChange={(e) => setField("goal2", e.target.value)} /></div>
        <div><label className={label}>Goal 3</label><input disabled={locked("goal3")} className={input} value={data.goal3 ?? ""} onChange={(e) => setField("goal3", e.target.value)} /></div>
        <div><label className={label}>What currently confuses you the most about trading?</label><textarea disabled={locked("confuses")} className={input} value={data.confuses ?? ""} onChange={(e) => setField("confuses", e.target.value)} /></div>
        <div><label className={label}>What is the one thing you’re most excited to learn?</label><textarea disabled={locked("excited")} className={input} value={data.excited ?? ""} onChange={(e) => setField("excited", e.target.value)} /></div>
        <div><label className={label}>Is there something you’ve seen other traders do that you want to understand?</label><textarea disabled={locked("seenTraders")} className={input} value={data.seenTraders ?? ""} onChange={(e) => setField("seenTraders", e.target.value)} /></div>
        <div><label className={label}>Do you eventually want to trade independently, or do you mainly want help becoming more confident first?</label><textarea disabled={locked("independent")} className={input} value={data.independent ?? ""} onChange={(e) => setField("independent", e.target.value)} /></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Support Between Classes</h2>
        <div><label className={label}>What would make you feel supported between our classes?</label>
          <Multi disabled={locked("supportBetween")} options={["Homework", "Practice charts", "Screenshot feedback", "Quizzes", "Study material", "Check-ins", "Market examples", "Trading journal assignments", "Other"]} value={data.supportBetween ?? []} onChange={(v) => setField("supportBetween", v)} />
        </div>
        <div><label className={label}>How many hours per week can you realistically dedicate to practicing?</label><input disabled={locked("practiceHours")} className={input} value={data.practiceHours ?? ""} onChange={(e) => setField("practiceHours", e.target.value)} /></div>
        <div><label className={label}>Would you be willing to keep a trading journal?</label>
          <select disabled={locked("journalWilling")} className={input} value={data.journalWilling ?? ""} onChange={(e) => setField("journalWilling", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option><option>Maybe / I’d like to learn more</option>
          </select>
        </div>
        <div><label className={label}>How do you prefer to receive feedback between classes?</label><textarea disabled={locked("feedbackPref")} className={input} value={data.feedbackPref ?? ""} onChange={(e) => setField("feedbackPref", e.target.value)} /></div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Expectations & Risk Acknowledgment</h2>
        <p className="text-sm text-white/50">I’m going to teach you how to understand the market, build your own process, manage your risk, and improve your discipline. I’m not going to promise you profits or tell you that trading is easy.</p>
        <div><label className={label}>Are you comfortable with the understanding that trading involves risk and that the classes are educational?</label>
          <select disabled={locked("riskAck")} className={input} value={data.riskAck ?? ""} onChange={(e) => setField("riskAck", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option><option>Needs discussion</option>
          </select>
        </div>
        <div><label className={label}>Are you comfortable practicing on demo before risking money if I believe that’s the best place for you to start?</label>
          <select disabled={locked("demoComfort")} className={input} value={data.demoComfort ?? ""} onChange={(e) => setField("demoComfort", e.target.value)}>
            <option value="">Select</option><option>Yes</option><option>No</option><option>Needs discussion</option>
          </select>
        </div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Student Feedback</h2>
        <div><label className={label}>What would make this membership feel worth the $150/month to you?</label><textarea disabled={locked("worth150")} className={input} value={data.worth150 ?? ""} onChange={(e) => setField("worth150", e.target.value)} /></div>
        <div><label className={label}>Is there anything you wish a trading teacher would do differently from what you’ve seen online?</label><textarea disabled={locked("teacherDifferent")} className={input} value={data.teacherDifferent ?? ""} onChange={(e) => setField("teacherDifferent", e.target.value)} /></div>
        <div><label className={label}>What kind of resources would you love to have access to as a student?</label><textarea disabled={locked("resourcesWant")} className={input} value={data.resourcesWant ?? ""} onChange={(e) => setField("resourcesWant", e.target.value)} /></div>
        <div><label className={label}>Which HFT resources would be useful to you?</label>
          <Multi disabled={locked("hftResources")} options={["Trading journal", "Member dashboard", "Lesson library", "Quizzes", "Community access", "Practice assignments", "Chart feedback", "Other"]} value={data.hftResources ?? []} onChange={(v) => setField("hftResources", v)} />
        </div>
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">After-Call Summary — Admin Only</h2>
        <div><label className={label}>Student Name</label><input disabled={locked("summaryName")} className={input} value={data.summaryName ?? ""} onChange={(e) => setField("summaryName", e.target.value)} /></div>
        <div><label className={label}>Trading Level</label><input disabled={locked("summaryLevel")} className={input} value={data.summaryLevel ?? ""} onChange={(e) => setField("summaryLevel", e.target.value)} /></div>
        <div><label className={label}>Markets Traded</label><input disabled={locked("summaryMarkets")} className={input} value={data.summaryMarkets ?? ""} onChange={(e) => setField("summaryMarkets", e.target.value)} /></div>
        <div><label className={label}>MT5 Status</label><input disabled={locked("summaryMt5")} className={input} value={data.summaryMt5 ?? ""} onChange={(e) => setField("summaryMt5", e.target.value)} /></div>
        <div><label className={label}>Broker Status</label><input disabled={locked("summaryBroker")} className={input} value={data.summaryBroker ?? ""} onChange={(e) => setField("summaryBroker", e.target.value)} /></div>
        <div><label className={label}>Financial Goal</label><textarea disabled={locked("summaryFinancialGoal")} className={input} value={data.summaryFinancialGoal ?? ""} onChange={(e) => setField("summaryFinancialGoal", e.target.value)} /></div>
        <div><label className={label}>6–12 Month Goal</label><textarea disabled={locked("summary612")} className={input} value={data.summary612 ?? ""} onChange={(e) => setField("summary612", e.target.value)} /></div>
        <div><label className={label}>Top Learning Goal #1</label><input disabled={locked("summaryGoal1")} className={input} value={data.summaryGoal1 ?? ""} onChange={(e) => setField("summaryGoal1", e.target.value)} /></div>
        <div><label className={label}>Top Learning Goal #2</label><input disabled={locked("summaryGoal2")} className={input} value={data.summaryGoal2 ?? ""} onChange={(e) => setField("summaryGoal2", e.target.value)} /></div>
        <div><label className={label}>Top Learning Goal #3</label><input disabled={locked("summaryGoal3")} className={input} value={data.summaryGoal3 ?? ""} onChange={(e) => setField("summaryGoal3", e.target.value)} /></div>
        <div><label className={label}>Main Weakness</label><textarea disabled={locked("summaryWeakness")} className={input} value={data.summaryWeakness ?? ""} onChange={(e) => setField("summaryWeakness", e.target.value)} /></div>
        <div><label className={label}>Learning Style</label><input disabled={locked("summaryLearningStyle")} className={input} value={data.summaryLearningStyle ?? ""} onChange={(e) => setField("summaryLearningStyle", e.target.value)} /></div>
        <div><label className={label}>Work Schedule Summary</label><textarea disabled={locked("summarySchedule")} className={input} value={data.summarySchedule ?? ""} onChange={(e) => setField("summarySchedule", e.target.value)} /></div>
        <div><label className={label}>Best Class Windows</label><input disabled={locked("summaryBestWindows")} className={input} value={data.summaryBestWindows ?? ""} onChange={(e) => setField("summaryBestWindows", e.target.value)} /></div>
        <div><label className={label}>Homework Preference</label><input disabled={locked("summaryHomework")} className={input} value={data.summaryHomework ?? ""} onChange={(e) => setField("summaryHomework", e.target.value)} /></div>
        <div><label className={label}>Support Preference</label><input disabled={locked("summarySupport")} className={input} value={data.summarySupport ?? ""} onChange={(e) => setField("summarySupport", e.target.value)} /></div>
        <div><label className={label}>First Lesson</label><textarea disabled={locked("summaryFirstLesson")} className={input} value={data.summaryFirstLesson ?? ""} onChange={(e) => setField("summaryFirstLesson", e.target.value)} /></div>
        <div><label className={label}>Next Action</label><textarea disabled={locked("summaryNextAction")} className={input} value={data.summaryNextAction ?? ""} onChange={(e) => setField("summaryNextAction", e.target.value)} /></div>
        <div><label className={label}>Best day/time for first lesson</label><input disabled={locked("summaryBestFirst")} className={input} value={data.summaryBestFirst ?? ""} onChange={(e) => setField("summaryBestFirst", e.target.value)} /></div>
        <div><label className={label}>Anything student needs to complete before class</label><textarea disabled={locked("summaryBeforeClass")} className={input} value={data.summaryBeforeClass ?? ""} onChange={(e) => setField("summaryBeforeClass", e.target.value)} /></div>
      </section>


      <section className={section}>
        <h2 className="font-bold text-white">Employment & Schedule</h2>
        <select disabled={locked("empStatus")} className={input} value={data.empStatus ?? ""} onChange={(e) => setField("empStatus", e.target.value)}>
          <option value="">Employment status</option><option>Full-Time</option><option>Part-Time</option><option>Self-Employed</option><option>Business Owner</option><option>Student</option><option>Unemployed</option><option>Other</option>
        </select>
        <input disabled={locked("job")} className={input} placeholder="Job/occupation" value={data.job ?? ""} onChange={(e) => setField("job", e.target.value)} />
        <input disabled={locked("employer")} className={input} placeholder="Employer/industry (optional)" value={data.employer ?? ""} onChange={(e) => setField("employer", e.target.value)} />
        <input disabled={locked("hourlyRate")} className={input} placeholder="Hourly rate if hourly" value={data.hourlyRate ?? ""} onChange={(e) => setField("hourlyRate", e.target.value)} />
        <input disabled={locked("salary")} className={input} placeholder="Salary if salaried" value={data.salary ?? ""} onChange={(e) => setField("salary", e.target.value)} />
        <input disabled={locked("monthlyIncome")} className={input} placeholder="Approx monthly take-home income" value={data.monthlyIncome ?? ""} onChange={(e) => setField("monthlyIncome", e.target.value)} />
        <input disabled={locked("otherIncome")} className={input} placeholder="Other income sources (optional)" value={data.otherIncome ?? ""} onChange={(e) => setField("otherIncome", e.target.value)} />
        <input disabled={locked("workDays")} className={input} placeholder="Work days" value={data.workDays ?? ""} onChange={(e) => setField("workDays", e.target.value)} />
        <input disabled={locked("workTimes")} className={input} placeholder="Work start/end times" value={data.workTimes ?? ""} onChange={(e) => setField("workTimes", e.target.value)} />
        <input disabled={locked("daysOff")} className={input} placeholder="Days off" value={data.daysOff ?? ""} onChange={(e) => setField("daysOff", e.target.value)} />
        <input disabled={locked("timezone2")} className={input} placeholder="Time zone" value={data.timezone2 ?? ""} onChange={(e) => setField("timezone2", e.target.value)} />
        <input disabled={locked("bestHftTimes")} className={input} placeholder="Best days/times for HFT" value={data.bestHftTimes ?? ""} onChange={(e) => setField("bestHftTimes", e.target.value)} />
        <input disabled={locked("hoursAvailable")} className={input} placeholder="Hours per week available for learning/practice" value={data.hoursAvailable ?? ""} onChange={(e) => setField("hoursAvailable", e.target.value)} />
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Monthly Financial Snapshot</h2>
        <p className="text-sm text-white/50">Private/admin-only. Estimates only. Not used to promise trading returns.</p>
        <input disabled={locked("billRent")} className={input} placeholder="Rent/mortgage" value={data.billRent ?? ""} onChange={(e) => setField("billRent", e.target.value)} />
        <input disabled={locked("billCar")} className={input} placeholder="Car payment" value={data.billCar ?? ""} onChange={(e) => setField("billCar", e.target.value)} />
        <input disabled={locked("billCarIns")} className={input} placeholder="Car insurance" value={data.billCarIns ?? ""} onChange={(e) => setField("billCarIns", e.target.value)} />
        <input disabled={locked("billUtilities")} className={input} placeholder="Utilities" value={data.billUtilities ?? ""} onChange={(e) => setField("billUtilities", e.target.value)} />
        <input disabled={locked("billPhone")} className={input} placeholder="Phone" value={data.billPhone ?? ""} onChange={(e) => setField("billPhone", e.target.value)} />
        <input disabled={locked("billInternet")} className={input} placeholder="Internet" value={data.billInternet ?? ""} onChange={(e) => setField("billInternet", e.target.value)} />
        <input disabled={locked("billCc")} className={input} placeholder="Credit cards" value={data.billCc ?? ""} onChange={(e) => setField("billCc", e.target.value)} />
        <input disabled={locked("billPersonalLoan")} className={input} placeholder="Personal loans" value={data.billPersonalLoan ?? ""} onChange={(e) => setField("billPersonalLoan", e.target.value)} />
        <input disabled={locked("billStudentLoan")} className={input} placeholder="Student loans" value={data.billStudentLoan ?? ""} onChange={(e) => setField("billStudentLoan", e.target.value)} />
        <input disabled={locked("billChildcare")} className={input} placeholder="Childcare/dependents" value={data.billChildcare ?? ""} onChange={(e) => setField("billChildcare", e.target.value)} />
        <input disabled={locked("billFamilySupport")} className={input} placeholder="Family support" value={data.billFamilySupport ?? ""} onChange={(e) => setField("billFamilySupport", e.target.value)} />
        <input disabled={locked("billSubs")} className={input} placeholder="Subscriptions" value={data.billSubs ?? ""} onChange={(e) => setField("billSubs", e.target.value)} />
        <input disabled={locked("billGroceries")} className={input} placeholder="Groceries" value={data.billGroceries ?? ""} onChange={(e) => setField("billGroceries", e.target.value)} />
        <input disabled={locked("billTransport")} className={input} placeholder="Transportation/gas" value={data.billTransport ?? ""} onChange={(e) => setField("billTransport", e.target.value)} />
        <input disabled={locked("billOther")} className={input} placeholder="Other recurring bills" value={data.billOther ?? ""} onChange={(e) => setField("billOther", e.target.value)} />
        <input disabled={locked("billCustom")} className={input} placeholder="Custom bill name + amount" value={data.billCustom ?? ""} onChange={(e) => setField("billCustom", e.target.value)} />
        <input disabled={locked("savings")} className={input} placeholder="Savings (optional)" value={data.savings ?? ""} onChange={(e) => setField("savings", e.target.value)} />
        <input disabled={locked("emergencyFund")} className={input} placeholder="Emergency fund (optional)" value={data.emergencyFund ?? ""} onChange={(e) => setField("emergencyFund", e.target.value)} />
        <input disabled={locked("totalDebt")} className={input} placeholder="Total debt (optional)" value={data.totalDebt ?? ""} onChange={(e) => setField("totalDebt", e.target.value)} />
        <input disabled={locked("monthlySaved")} className={input} placeholder="Amount saved/invested monthly (optional)" value={data.monthlySaved ?? ""} onChange={(e) => setField("monthlySaved", e.target.value)} />
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Financial & Life Goals</h2>
        <textarea disabled={locked("bigGoal")} className={input} placeholder="Biggest financial goal" value={data.bigGoal ?? ""} onChange={(e) => setField("bigGoal", e.target.value)} />
        <textarea disabled={locked("smallGoal")} className={input} placeholder="Smallest/immediate financial goal" value={data.smallGoal ?? ""} onChange={(e) => setField("smallGoal", e.target.value)} />
        <input disabled={locked("goal30")} className={input} placeholder="30-day goal" value={data.goal30 ?? ""} onChange={(e) => setField("goal30", e.target.value)} />
        <input disabled={locked("goal90")} className={input} placeholder="90-day goal" value={data.goal90 ?? ""} onChange={(e) => setField("goal90", e.target.value)} />
        <input disabled={locked("goal6")} className={input} placeholder="6-month goal" value={data.goal6 ?? ""} onChange={(e) => setField("goal6", e.target.value)} />
        <input disabled={locked("goal12")} className={input} placeholder="12-month goal" value={data.goal12 ?? ""} onChange={(e) => setField("goal12", e.target.value)} />
        <input disabled={locked("desiredMonthlyIncome")} className={input} placeholder="Desired monthly income" value={data.desiredMonthlyIncome ?? ""} onChange={(e) => setField("desiredMonthlyIncome", e.target.value)} />
        <input disabled={locked("desiredAdditionalIncome")} className={input} placeholder="Desired additional monthly income" value={data.desiredAdditionalIncome ?? ""} onChange={(e) => setField("desiredAdditionalIncome", e.target.value)} />
        <textarea disabled={locked("studentTradingGoal")} className={input} placeholder="Student-stated trading income/profit goal" value={data.studentTradingGoal ?? ""} onChange={(e) => setField("studentTradingGoal", e.target.value)} />
        <textarea disabled={locked("incomeChange")} className={input} placeholder="What would additional income change for you?" value={data.incomeChange ?? ""} onChange={(e) => setField("incomeChange", e.target.value)} />
        <input disabled={locked("majorGoal")} className={input} placeholder="Major goal/purchase (house, car, etc.)" value={data.majorGoal ?? ""} onChange={(e) => setField("majorGoal", e.target.value)} />
        <input disabled={locked("targetAmount")} className={input} placeholder="Target amount (optional)" value={data.targetAmount ?? ""} onChange={(e) => setField("targetAmount", e.target.value)} />
        <input disabled={locked("targetDate")} className={input} placeholder="Target date (optional)" value={data.targetDate ?? ""} onChange={(e) => setField("targetDate", e.target.value)} />
        <textarea disabled={locked("goalWhy")} className={input} placeholder="Why does this goal matter?" value={data.goalWhy ?? ""} onChange={(e) => setField("goalWhy", e.target.value)} />
      </section>

      <section className={section}>
        <h2 className="font-bold text-white">Trading Background</h2>
        <select disabled={locked("expLevel")} className={input} value={data.expLevel ?? ""} onChange={(e) => setField("expLevel", e.target.value)}>
          <option value="">Experience level</option><option>Brand New</option><option>Beginner</option><option>Developing</option><option>Intermediate</option><option>Advanced</option><option>Unsure</option>
        </select>
        <select disabled={locked("tradedForex")} className={input} value={data.tradedForex ?? ""} onChange={(e) => setField("tradedForex", e.target.value)}><option value="">Ever traded Forex?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("tradedDemo")} className={input} value={data.tradedDemo ?? ""} onChange={(e) => setField("tradedDemo", e.target.value)}><option value="">Demo?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("tradedLive")} className={input} value={data.tradedLive ?? ""} onChange={(e) => setField("tradedLive", e.target.value)}><option value="">Live?</option><option>Yes</option><option>No</option></select>
        <input disabled={locked("tradeDuration")} className={input} placeholder="How long have you traded?" value={data.tradeDuration ?? ""} onChange={(e) => setField("tradeDuration", e.target.value)} />
        <select disabled={locked("mt4Exp")} className={input} value={data.mt4Exp ?? ""} onChange={(e) => setField("mt4Exp", e.target.value)}><option value="">MT4 experience?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("mt5Exp")} className={input} value={data.mt5Exp ?? ""} onChange={(e) => setField("mt5Exp", e.target.value)}><option value="">MT5 experience?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("tvExp")} className={input} value={data.tvExp ?? ""} onChange={(e) => setField("tvExp", e.target.value)}><option value="">TradingView experience?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("placedWithoutHelp")} className={input} value={data.placedWithoutHelp ?? ""} onChange={(e) => setField("placedWithoutHelp", e.target.value)}><option value="">Placed trade without assistance?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("usedSL")} className={input} value={data.usedSL ?? ""} onChange={(e) => setField("usedSL", e.target.value)}><option value="">Used stop loss?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("usedTP")} className={input} value={data.usedTP ?? ""} onChange={(e) => setField("usedTP", e.target.value)}><option value="">Used take profit?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("understandLot")} className={input} value={data.understandLot ?? ""} onChange={(e) => setField("understandLot", e.target.value)}><option value="">Understand lot size?</option><option>Yes</option><option>No</option></select>
        <select disabled={locked("priorCourses")} className={input} value={data.priorCourses ?? ""} onChange={(e) => setField("priorCourses", e.target.value)}><option value="">Previous courses/mentors?</option><option>Yes</option><option>No</option></select>
        <textarea disabled={locked("priorCoursesDetails")} className={input} placeholder="Which courses/mentors?" value={data.priorCoursesDetails ?? ""} onChange={(e) => setField("priorCoursesDetails", e.target.value)} />
        <select disabled={locked("lostMoney")} className={input} value={data.lostMoney ?? ""} onChange={(e) => setField("lostMoney", e.target.value)}><option value="">Lost money trading before?</option><option>Yes</option><option>No</option></select>
        <textarea disabled={locked("lostMoneyDetails")} className={input} placeholder="If yes, what contributed?" value={data.lostMoneyDetails ?? ""} onChange={(e) => setField("lostMoneyDetails", e.target.value)} />
        <textarea disabled={locked("understoodConcepts")} className={input} placeholder="Concepts already understood" value={data.understoodConcepts ?? ""} onChange={(e) => setField("understoodConcepts", e.target.value)} />
        <textarea disabled={locked("confusingConcepts")} className={input} placeholder="Concepts that are confusing" value={data.confusingConcepts ?? ""} onChange={(e) => setField("confusingConcepts", e.target.value)} />
        <textarea disabled={locked("wantLearn")} className={input} placeholder="What do you most want HFT to teach you?" value={data.wantLearn ?? ""} onChange={(e) => setField("wantLearn", e.target.value)} />
      </section>

      <div className="flex gap-3">
        <button onClick={saveDraft} disabled={saving} className="rounded bg-white/10 px-4 py-2 text-white">Save Draft</button>
        <button onClick={complete} disabled={saving} className="rounded bg-brand-600 px-4 py-2 text-white">Complete Intake</button>
      </div>
    </div>
  );
}
