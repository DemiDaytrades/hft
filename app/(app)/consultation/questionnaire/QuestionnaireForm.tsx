"use client";
import { SECTIONS as ALL_SECTIONS } from "@/app/(app)/admin/students/[id]/questionnaire/questionnaireFields";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "@/components/ui";

type Questionnaire = {
  id: string;
  status: string;
  data: any;
};

type Props = {
  questionnaire: Questionnaire;
  apiEndpoint?: string;
  userId?: string;
  readOnly?: boolean;
  canonicalIntakeExists?: boolean;
  protectedKeys?: readonly string[];
};


const YES_NO = ["Yes", "No"];
const YES_NO_UNSURE = ["Yes", "No", "Unsure"];
const EXPERIENCE_LEVELS = ["None", "Beginner (<1 year)", "Intermediate (1-3 years)", "Advanced (3+ years)", "Unsure"];
const MARKETS = ["Forex", "Indices", "Commodities", "Stocks", "Options", "Crypto", "Futures", "Other"];
const PLATFORMS = ["MT4", "MT5", "TradingView", "cTrader", "NinjaTrader", "Thinkorswim", "Other", "None"];
const BROKERS = ["IC Markets", "Pepperstone", "OANDA", "FXCM", "Other", "Not decided"];
const TIMEZONES = ["EST", "CST", "MST", "PST", "GMT", "UTC", "Other"];
const STUDY_TIMES = ["Early Morning", "Morning", "Afternoon", "Evening", "Night", "Weekend", "Flexible"];
const LEARNING_PREFS = ["Live coaching", "Videos", "Reading material", "Hands-on practice", "Quizzes/assessments", "Group discussion", "One-on-one feedback"];
const ACCOUNTABILITY = ["Strict deadlines", "Weekly check-ins", "Daily accountability", "Self-paced with reminders", "Other"];
const FEEDBACK_FREQ = ["After every class", "Weekly", "Biweekly", "As needed", "Minimal"];
const DEVICE = ["Desktop/Laptop", "Tablet", "Mobile"];
const INTERNET = ["Stable high-speed", "Average", "Unstable"];
const RISK_TOLERANCE = ["Conservative", "Moderate", "Aggressive", "Unsure"];
const HOW_HEARD = ["Referral", "YouTube", "Instagram/Tiktok", "Google Search", "Forum/Community", "Other"];
const KNOWLEDGE_RATING = ["None", "Basic", "Intermediate", "Advanced", "Expert"];

export default function QuestionnaireForm({ questionnaire, apiEndpoint = "/api/consultation/questionnaire", userId, readOnly = false, canonicalIntakeExists = false, protectedKeys = [] }: Props) {
  const isAdminMode = apiEndpoint.startsWith("/api/admin/");
  const SECTIONS = ALL_SECTIONS.filter(section => isAdminMode || section.id !== "M");
  const [section, setSection] = useState<string>(isAdminMode && questionnaire.status === "submitted" ? "M" : "A");
  const [data, setData] = useState<any>(questionnaire.data || {});
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>("");
  const [message, setMessage] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(questionnaire.status === "submitted");
  const [hydrated, setHydrated] = useState(false);
  const autosaveTimer = useRef<any>(null);

  useEffect(() => {
    setData(questionnaire.data || {});
    setHydrated(true);
  }, [questionnaire.id]);

  const locked = (key: string) => readOnly || (canonicalIntakeExists && (protectedKeys.includes(key) || key.startsWith("summary")));
  const setField = useCallback((key: string, value: any) => {
    if (readOnly || (canonicalIntakeExists && (protectedKeys.includes(key) || key.startsWith("summary")))) return;
    setData((prev: any) => ({ ...prev, [key]: value }));
  }, [readOnly, canonicalIntakeExists, protectedKeys]);

  const triggerAutosave = useCallback(() => {
    if (!hydrated || readOnly) return;
    if (submitted) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      setAutosaveStatus("Saving...");
      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiEndpoint.includes("/admin/") ? { action: "save", id: questionnaire.id, userId, data, source: "autosave" } : { action: "save", id: questionnaire.id, data, source: "autosave" }),
        });
        if (!response.ok) { const failed = await response.json() as {error?:string}; throw new Error(failed.error || "Unable to save"); }
        setAutosaveStatus("Saved ✓");
        setTimeout(() => setAutosaveStatus(""), 2000);
      } catch (error) {
        setAutosaveStatus(error instanceof Error ? error.message : "Unable to save");
      }
    }, 800);
  }, [data, questionnaire.id, submitted, hydrated]);

  useEffect(() => {
    if (!hydrated || readOnly) return;
    triggerAutosave();
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [data, triggerAutosave, hydrated]);

  const toggleMulti = (key: string, value: string) => {
    const current = data[key] || [];
    if (current.includes(value)) {
      setField(key, current.filter((v: string) => v !== value));
    } else {
      setField(key, [...current, value]);
    }
  };

  const currentIndex = SECTIONS.findIndex((s) => s.id === section);

  const completedCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      if (sectionIsComplete(SECTIONS[i].id, data)) count++;
    }
    return count;
  }, [data]);

  const saveDraft = async () => {
    if (readOnly) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiEndpoint.includes("/admin/") ? { action: "save", id: questionnaire.id, userId, data, source: "autosave" } : { action: "save", id: questionnaire.id, data, source: "autosave" }),
      });
      if (!res.ok) { const failed = await res.json() as {error?:string}; throw new Error(failed.error || "Failed to save"); }
      setMessage("Draft saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    if (currentIndex < SECTIONS.length - 1) setSection(SECTIONS[currentIndex + 1].id);
  };
  const goPrev = () => {
    if (currentIndex > 0) setSection(SECTIONS[currentIndex - 1].id);
  };

  if (submitted && section === "M" && !canonicalIntakeExists) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <Panel>
          <h2 className="font-display text-[24px] font-bold uppercase tracking-[0.03em]">Your Strategy Consultation Questionnaire has been submitted.</h2>
          <p className="mt-2 text-white/70">Your instructor will review it and reach out regarding next steps.</p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(canonicalIntakeExists || readOnly) && <Panel>
        <p className="text-sm text-white/70">Overlapping answers below are historical and read-only. Other legacy-only answers remain available for review.</p>
        {isAdminMode && userId ? <a className="text-brand-400" href={`/admin/student-intake-v2?studentUserId=${encodeURIComponent(userId)}`}>Review canonical consultation answers</a> : <p className="text-sm text-white/60">Contact your instructor to correct your current consultation information.</p>}
      </Panel>}
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60">HFT Strategy Consultation</p>
            <p className="mt-1 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
              {completedCount} of {SECTIONS.length} sections complete
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-white/50">
            {autosaveStatus && <span>{autosaveStatus}</span>}
            {saving && <span>Saving...</span>}
          </div>
        </div>
      </Panel>

      <div className="lg:hidden">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.18em] text-white/50">Section {SECTIONS[currentIndex].id}</p>
              <p className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white">{SECTIONS[currentIndex].label}</p>
            </div>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-[12px] text-white"
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.label}
                </option>
              ))}
            </select>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <Panel className="sticky top-4">
            <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Sections</p>
            <nav className="space-y-1">
              {SECTIONS.map((s, idx) => {
                const isActive = section === s.id;
                const isDone = sectionIsComplete(s.id, data);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    className={`w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors ${
                      isActive ? "bg-brand-600/20 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      isDone ? "bg-emerald-500/20 text-emerald-400" : isActive ? "bg-brand-600 text-white" : "bg-white/10 text-white/60"
                    }`}>
                      {isDone ? "✓" : s.id}
                    </span>
                    <span className="text-[12px]">{s.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-[11px] text-white/50">{completedCount} of {SECTIONS.length} sections complete</p>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            {section === "A" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section A — About Student</h2>
                <Input disabled={locked("fullLegalName")} label="Full Legal Name" value={data.fullLegalName} onChange={(v: string) => setField("fullLegalName", v)} compact />
                <Input disabled={locked("preferredName")} label="Preferred Name/Nickname" value={data.preferredName} onChange={(v: string) => setField("preferredName", v)} compact />
                <Input disabled={locked("email")} label="Email Address" value={data.email} onChange={(v: string) => setField("email", v)} compact />
                <Input disabled={locked("phone")} label="Phone Number" value={data.phone} onChange={(v: string) => setField("phone", v)} compact />
                <Input disabled={locked("age")} label="Age (optional)" value={data.age} onChange={(v: string) => setField("age", v)} compact />
                <Input disabled={locked("location")} label="Location (City, Country/State)" value={data.location} onChange={(v: string) => setField("location", v)} compact />
                <Select disabled={locked("timeZone")} label="Time Zone" value={data.timeZone} onChange={(v: string) => setField("timeZone", v)} options={TIMEZONES} />
                <Select disabled={locked("howHeard")} label="How did you hear about HFT?" value={data.howHeard} onChange={(v: string) => setField("howHeard", v)} options={HOW_HEARD} />
                <Field disabled={locked("howHeardOther")} label="If referral or other, please specify" value={data.howHeardOther} onChange={(v: string) => setField("howHeardOther", v)} compact />
                <Field disabled={locked("aboutYourself")} label="Tell us a bit about yourself outside of trading" value={data.aboutYourself} onChange={(v: string) => setField("aboutYourself", v)} />
                <Field disabled={locked("workingTowardLife")} label="What are you currently working toward in life?" value={data.workingTowardLife} onChange={(v: string) => setField("workingTowardLife", v)} />
                <Field disabled={locked("motivation")} label="What motivates you when things get difficult?" value={data.motivation} onChange={(v: string) => setField("motivation", v)} />
              </div>
            )}

            {section === "B" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section B — Trading Experience</h2>
                <Select disabled={locked("tradedBefore")} label="Have you traded before?" value={data.tradedBefore} onChange={(v: string) => setField("tradedBefore", v)} options={YES_NO} />
                <Select disabled={locked("experienceLevel")} label="Overall Trading Experience Level" value={data.experienceLevel} onChange={(v: string) => setField("experienceLevel", v)} options={EXPERIENCE_LEVELS} />
                <Input disabled={locked("yearsTrading")} label="Years of trading experience (approx)" value={data.yearsTrading} onChange={(v: string) => setField("yearsTrading", v)} compact />
                <MultiSelect disabled={locked("marketsTraded")} label="Markets traded" values={data.marketsTraded || []} onToggle={(v) => toggleMulti("marketsTraded", v)} options={MARKETS} />
                <Field disabled={locked("marketsOther")} label="Other markets" value={data.marketsOther} onChange={(v: string) => setField("marketsOther", v)} compact />
                <MultiSelect disabled={locked("platformsUsed")} label="Platforms used" values={data.platformsUsed || []} onToggle={(v) => toggleMulti("platformsUsed", v)} options={PLATFORMS} />
                <Field disabled={locked("platformsOther")} label="Other platforms" value={data.platformsOther} onChange={(v: string) => setField("platformsOther", v)} compact />
                <Select disabled={locked("brokerCurrent")} label="Broker currently used (if any)" value={data.brokerCurrent} onChange={(v: string) => setField("brokerCurrent", v)} options={BROKERS} />
                <Field disabled={locked("brokerOther")} label="Other broker" value={data.brokerOther} onChange={(v: string) => setField("brokerOther", v)} compact />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select disabled={locked("demoExperience")} label="Demo account experience?" value={data.demoExperience} onChange={(v: string) => setField("demoExperience", v)} options={YES_NO} />
                  <Select disabled={locked("liveExperience")} label="Live account experience?" value={data.liveExperience} onChange={(v: string) => setField("liveExperience", v)} options={YES_NO} />
                </div>
                <Field disabled={locked("previousEducation")} label="Previous courses, mentors, signals, or trading groups" value={data.previousEducation} onChange={(v: string) => setField("previousEducation", v)} />
                <Field disabled={locked("biggestLesson")} label="Biggest lesson learned so far" value={data.biggestLesson} onChange={(v: string) => setField("biggestLesson", v)} compact />
                <Field disabled={locked("whyHft")} label="What brought you to HFT specifically?" value={data.whyHft} onChange={(v: string) => setField("whyHft", v)} />
              </div>
            )}

            {section === "C" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section C — Knowledge Self-Assessment</h2>
                <p className="text-[12px] text-white/60">Rate your current knowledge (honest assessment helps us personalize).</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select disabled={locked("knowledgeCandlesticks")} label="Candlestick patterns" value={data.knowledgeCandlesticks} onChange={(v: string) => setField("knowledgeCandlesticks", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgeSupportResistance")} label="Support & Resistance" value={data.knowledgeSupportResistance} onChange={(v: string) => setField("knowledgeSupportResistance", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgeTrend")} label="Trend Analysis" value={data.knowledgeTrend} onChange={(v: string) => setField("knowledgeTrend", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgeRiskMgmt")} label="Risk Management" value={data.knowledgeRiskMgmt} onChange={(v: string) => setField("knowledgeRiskMgmt", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgeOrders")} label="Order Types & Execution" value={data.knowledgeOrders} onChange={(v: string) => setField("knowledgeOrders", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgeMarketStructure")} label="Market Structure" value={data.knowledgeMarketStructure} onChange={(v: string) => setField("knowledgeMarketStructure", v)} options={KNOWLEDGE_RATING} />
                  <Select disabled={locked("knowledgePsychology")} label="Trading Psychology" value={data.knowledgePsychology} onChange={(v: string) => setField("knowledgePsychology", v)} options={KNOWLEDGE_RATING} />
                </div>
                <Field disabled={locked("weakestTopic")} label="What topic are you weakest in?" value={data.weakestTopic} onChange={(v: string) => setField("weakestTopic", v)} compact />
                <Field disabled={locked("strongestTopic")} label="What topic are you strongest in?" value={data.strongestTopic} onChange={(v: string) => setField("strongestTopic", v)} compact />
              </div>
            )}

            {section === "D" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section D — Goals</h2>
                <Field disabled={locked("primaryGoal")} label="Primary goal for joining HFT (be specific)" value={data.primaryGoal} onChange={(v: string) => setField("primaryGoal", v)} />
                <Field disabled={locked("successLooksLike")} label="What would success look like for you after completing the program?" value={data.successLooksLike} onChange={(v: string) => setField("successLooksLike", v)} />
                <Field disabled={locked("goal30Day")} label="30-day goal" value={data.goal30Day} onChange={(v: string) => setField("goal30Day", v)} compact />
                <Field disabled={locked("goal90Day")} label="90-day goal" value={data.goal90Day} onChange={(v: string) => setField("goal90Day", v)} compact />
                <Field disabled={locked("goal6Month")} label="6-month goal" value={data.goal6Month} onChange={(v: string) => setField("goal6Month", v)} compact />
                <Field disabled={locked("goal12Month")} label="12-month goal" value={data.goal12Month} onChange={(v: string) => setField("goal12Month", v)} compact />
                <Field disabled={locked("goalImportance")} label="Why are these goals important to you?" value={data.goalImportance} onChange={(v: string) => setField("goalImportance", v)} />
                <Select disabled={locked("timelineExpectation")} label="Timeline expectation" value={data.timelineExpectation} onChange={(v: string) => setField("timelineExpectation", v)} options={["3-6 months", "6-9 months", "9-12 months", "12+ months", "Unsure"]} />
              </div>
            )}

            {section === "E" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section E — Psychology</h2>
                <p className="text-[12px] text-white/60">Educational only - not a diagnosis.</p>
                <Select disabled={locked("riskTolerance")} label="Risk tolerance" value={data.riskTolerance} onChange={(v: string) => setField("riskTolerance", v)} options={RISK_TOLERANCE} />
                <Select disabled={locked("fomoTendency")} label="Tendency toward FOMO" value={data.fomoTendency} onChange={(v: string) => setField("fomoTendency", v)} options={["Never", "Rarely", "Sometimes", "Often", "Always"]} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select disabled={locked("revengeTrading")} label="Revenge trading tendency" value={data.revengeTrading} onChange={(v: string) => setField("revengeTrading", v)} options={YES_NO} />
                  <Select disabled={locked("impatience")} label="Impatience with results" value={data.impatience} onChange={(v: string) => setField("impatience", v)} options={YES_NO} />
                  <Select disabled={locked("difficultyFollowingRules")} label="Difficulty following rules" value={data.difficultyFollowingRules} onChange={(v: string) => setField("difficultyFollowingRules", v)} options={YES_NO} />
                  <Select disabled={locked("emotionalAfterLosses")} label="Emotional after losses" value={data.emotionalAfterLosses} onChange={(v: string) => setField("emotionalAfterLosses", v)} options={YES_NO} />
                </div>
                <Field disabled={locked("reactToLosses")} label="How do you react to losing trades?" value={data.reactToLosses} onChange={(v: string) => setField("reactToLosses", v)} />
                <Field disabled={locked("biggestPsychChallenge")} label="Biggest psychological challenge in trading" value={data.biggestPsychChallenge} onChange={(v: string) => setField("biggestPsychChallenge", v)} compact />
                <Field disabled={locked("disciplineHelps")} label="What helps you stay disciplined?" value={data.disciplineHelps} onChange={(v: string) => setField("disciplineHelps", v)} compact />
              </div>
            )}

            {section === "F" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section F — Learning Style</h2>
                <MultiSelect disabled={locked("learningPrefs")} label="Preferred learning methods" values={data.learningPrefs || []} onToggle={(v) => toggleMulti("learningPrefs", v)} options={LEARNING_PREFS} />
                <Field disabled={locked("learningPrefsOther")} label="Other learning preference" value={data.learningPrefsOther} onChange={(v: string) => setField("learningPrefsOther", v)} compact />
                <Select disabled={locked("learningPace")} label="Learning pace preference" value={data.learningPace} onChange={(v: string) => setField("learningPace", v)} options={["Fast-paced", "Moderate", "Slow and thorough", "Mix"]} />
                <Select disabled={locked("learnBy")} label="Do you learn better by doing or watching?" value={data.learnBy} onChange={(v: string) => setField("learnBy", v)} options={["By doing (practice)", "By watching (demo)", "Equal", "Unsure"]} />
                <Select disabled={locked("comfortAsking")} label="Comfort level asking questions" value={data.comfortAsking} onChange={(v: string) => setField("comfortAsking", v)} options={["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]} />
                <Field disabled={locked("learningEnvironment")} label="What environment helps you learn best?" value={data.learningEnvironment} onChange={(v: string) => setField("learningEnvironment", v)} compact />
                <Field disabled={locked("overwhelmCauses")} label="What usually causes overwhelm?" value={data.overwhelmCauses} onChange={(v: string) => setField("overwhelmCauses", v)} compact />
              </div>
            )}

            {section === "G" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section G — Schedule & Availability</h2>
                <Select disabled={locked("timeZone2")} label="Time Zone" value={data.timeZone2} onChange={(v: string) => setField("timeZone2", v)} options={TIMEZONES} />
                <Field disabled={locked("workSchedule")} label="Work/School schedule (description)" value={data.workSchedule} onChange={(v: string) => setField("workSchedule", v)} compact />
                <MultiSelect disabled={locked("preferredStudyTimes")} label="Preferred study times" values={data.preferredStudyTimes || []} onToggle={(v) => toggleMulti("preferredStudyTimes", v)} options={STUDY_TIMES} />
                <Input disabled={locked("hoursPerWeek")} label="Hours per week available for study/practice" value={data.hoursPerWeek} onChange={(v: string) => setField("hoursPerWeek", v)} compact />
                <Select disabled={locked("canAttendLive")} label="Can you attend live coaching sessions?" value={data.canAttendLive} onChange={(v: string) => setField("canAttendLive", v)} options={YES_NO} />
                <Input disabled={locked("bestOnboardingTime")} label="Best days/times for 1-on-1" value={data.bestOnboardingTime} onChange={(v: string) => setField("bestOnboardingTime", v)} compact />
                <Field disabled={locked("commitments")} label="Major commitments that may limit availability" value={data.commitments} onChange={(v: string) => setField("commitments", v)} compact />
                <Select disabled={locked("realisticConsistency")} label="Realistic consistency level" value={data.realisticConsistency} onChange={(v: string) => setField("realisticConsistency", v)} options={["Very consistent", "Mostly consistent", "Inconsistent", "Unsure"]} />
              </div>
            )}

            {section === "H" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section H — Tech/Broker Readiness</h2>
                <MultiSelect disabled={locked("devices")} label="Primary device for trading/study" values={data.devices || []} onToggle={(v) => toggleMulti("devices", v)} options={DEVICE} />
                <Select disabled={locked("internetQuality")} label="Internet connection quality" value={data.internetQuality} onChange={(v: string) => setField("internetQuality", v)} options={INTERNET} />
                <Select disabled={locked("hasTradingView")} label="Do you have access to TradingView?" value={data.hasTradingView} onChange={(v: string) => setField("hasTradingView", v)} options={YES_NO} />
                <Select disabled={locked("hasBrokerAccount")} label="Do you have a broker account?" value={data.hasBrokerAccount} onChange={(v: string) => setField("hasBrokerAccount", v)} options={["Yes - Live", "Yes - Demo", "No", "In process"]} />
                <Select disabled={locked("preferredBroker")} label="Preferred broker" value={data.preferredBroker} onChange={(v: string) => setField("preferredBroker", v)} options={BROKERS} />
                <Field disabled={locked("preferredBrokerOther")} label="Other broker preference" value={data.preferredBrokerOther} onChange={(v: string) => setField("preferredBrokerOther", v)} compact />
                <Select disabled={locked("techComfort")} label="Comfortable installing/troubleshooting software?" value={data.techComfort} onChange={(v: string) => setField("techComfort", v)} options={["Very comfortable", "Comfortable", "Somewhat", "Not comfortable"]} />
                <Field disabled={locked("techLimitations")} label="Any tech limitations?" value={data.techLimitations} onChange={(v: string) => setField("techLimitations", v)} compact />
              </div>
            )}

            {section === "I" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section I — Learning Goals</h2>
                <Field disabled={locked("learnFirst30")} label="What do you most want to learn in first 30 days?" value={data.learnFirst30} onChange={(v: string) => setField("learnFirst30", v)} />
                <Field disabled={locked("skillToMaster")} label="What skill would change your trading the most if mastered?" value={data.skillToMaster} onChange={(v: string) => setField("skillToMaster", v)} compact />
                <Field disabled={locked("independentByEnd")} label="What do you want to be able to do independently by end of program?" value={data.independentByEnd} onChange={(v: string) => setField("independentByEnd", v)} />
                <MultiSelect disabled={locked("focusAreas")} label="Focus areas" values={data.focusAreas || []} onToggle={(v) => toggleMulti("focusAreas", v)} options={["Entry/Exit", "Risk Management", "Psychology/Discipline", "Market Analysis", "Strategy Development", "Journal/Review Process"]} />
                <Field disabled={locked("specificStrategy")} label="Specific setup/strategy interested in" value={data.specificStrategy} onChange={(v: string) => setField("specificStrategy", v)} compact />
                <Field disabled={locked("successMetric")} label="What success metric matters most to you?" value={data.successMetric} onChange={(v: string) => setField("successMetric", v)} compact />
              </div>
            )}

            {section === "J" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section J — Support Between Classes</h2>
                <MultiSelect disabled={locked("accountabilityPrefs")} label="Accountability preference" values={data.accountabilityPrefs || []} onToggle={(v) => toggleMulti("accountabilityPrefs", v)} options={ACCOUNTABILITY} />
                <Field disabled={locked("accountabilityOther")} label="Other accountability" value={data.accountabilityOther} onChange={(v: string) => setField("accountabilityOther", v)} compact />
                <Select disabled={locked("feedbackFrequency")} label="How often do you want feedback?" value={data.feedbackFrequency} onChange={(v: string) => setField("feedbackFrequency", v)} options={FEEDBACK_FREQ} />
                <Select disabled={locked("helpMethod")} label="Preferred way to get help between classes" value={data.helpMethod} onChange={(v: string) => setField("helpMethod", v)} options={["Group chat", "Email", "1-on-1 message", "Office hours", "As needed"]} />
                <Field disabled={locked("supportWhenStuck")} label="What kind of support helps most when stuck?" value={data.supportWhenStuck} onChange={(v: string) => setField("supportWhenStuck", v)} compact />
                <Field disabled={locked("obstacles")} label="Potential obstacles to completing program" value={data.obstacles} onChange={(v: string) => setField("obstacles", v)} />
                <Field disabled={locked("obstacleSolutions")} label="How will you overcome them?" value={data.obstacleSolutions} onChange={(v: string) => setField("obstacleSolutions", v)} />
              </div>
            )}

            {section === "K" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section K — Program Expectations & Risk</h2>
                <Field disabled={locked("expectations")} label="What are your expectations of the program?" value={data.expectations} onChange={(v: string) => setField("expectations", v)} />
                <Field disabled={locked("commitment")} label="What are you willing to commit (time/effort)?" value={data.commitment} onChange={(v: string) => setField("commitment", v)} compact />
                <Select disabled={locked("understandRisk")} label="Do you understand trading involves risk of loss?" value={data.understandRisk} onChange={(v: string) => setField("understandRisk", v)} options={YES_NO} />
                <Select disabled={locked("understandNoGuarantee")} label="Do you understand past performance doesn't guarantee future results?" value={data.understandNoGuarantee} onChange={(v: string) => setField("understandNoGuarantee", v)} options={YES_NO} />
                <Field disabled={locked("concerns")} label="Any concerns about the program?" value={data.concerns} onChange={(v: string) => setField("concerns", v)} compact />
                <Field disabled={locked("anythingElse")} label="Anything we should know before starting?" value={data.anythingElse} onChange={(v: string) => setField("anythingElse", v)} compact />
              </div>
            )}

            {section === "L" && (
              <div className="space-y-4">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Section L — Membership Feedback</h2>
                <Select disabled={locked("membershipReason")} label="Overall reason for interest in HFT membership" value={data.membershipReason} onChange={(v: string) => setField("membershipReason", v)} options={["Education/Mentorship", "Community", "Strategy Development", "Accountability", "All of the above", "Other"]} />
                <Field disabled={locked("membershipReasonOther")} label="Other reason" value={data.membershipReasonOther} onChange={(v: string) => setField("membershipReasonOther", v)} compact />
                <Field disabled={locked("decisionNow")} label="What made you decide to apply now?" value={data.decisionNow} onChange={(v: string) => setField("decisionNow", v)} compact />
                <Field disabled={locked("experienceGreat")} label="What would make this experience great?" value={data.experienceGreat} onChange={(v: string) => setField("experienceGreat", v)} />
                <Field disabled={locked("feedbackSuggestions")} label="Any feedback/suggestions?" value={data.feedbackSuggestions} onChange={(v: string) => setField("feedbackSuggestions", v)} compact />
              </div>
            )}

            {isAdminMode && section === "M" && (
              <div className="space-y-5">
                <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">INSTRUCTOR REVIEW & WRAP-UP</h2>
                <div className="rounded-sm border border-white/10 bg-ink-950/40 p-4">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70 mb-2">1. Student Summary</p>
                  <p className="text-[12px] text-white/60">Review key student responses above. Focus on goals, experience, availability, and readiness.</p>
                </div>
                <div className="rounded-sm border border-white/10 p-4 space-y-3">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">2. Instructor Assessment</p>
                  <Field disabled={locked("strengthsIdentified")} label="Strengths Identified" value={data.strengthsIdentified} onChange={(v: string) => setField("strengthsIdentified", v)} />
                  <Field disabled={locked("areasToFocus")} label="Areas to Focus On" value={data.areasToFocus} onChange={(v: string) => setField("areasToFocus", v)} />
                  <Field disabled={locked("instructorNotes")} label="Key Concerns / Notes" value={data.instructorNotes} onChange={(v: string) => setField("instructorNotes", v)} />
                </div>
                <div className="rounded-sm border border-white/10 p-4 space-y-3">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">3. Personalized Training Plan</p>
                  <Field disabled={locked("recommendedStart")} label="Recommended Starting Level/Track" value={data.recommendedStart} onChange={(v: string) => setField("recommendedStart", v)} compact />
                  <Field disabled={locked("personalizedPlan")} label="Personalized Training Plan" value={data.personalizedPlan} onChange={(v: string) => setField("personalizedPlan", v)} />
                  <Field disabled={locked("actionItems")} label="Action Items" value={data.actionItems} onChange={(v: string) => setField("actionItems", v)} />
                </div>
                <div className="rounded-sm border border-white/10 bg-ink-950/40 p-4">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70 mb-2">4. Review Checklist</p>
                  <ul className="space-y-1 text-[12px] text-white/60">
                    <li>• Reviewed student goals and motivation</li>
                    <li>• Assessed trading experience and knowledge gaps</li>
                    <li>• Reviewed schedule/availability</li>
                    <li>• Reviewed tech/broker readiness</li>
                    <li>• Considered psychology/discipline</li>
                    <li>• Documented assessment and training plan</li>
                  </ul>
                </div>
                <div className="rounded-sm border border-white/10 p-4">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70 mb-2">5. Complete Consultation</p>
                  <p className="text-[12px] text-white/60 mb-3">By completing, the questionnaire will be finalized and you'll be taken to Consultation Results to review/generate the student-facing Game Plan.</p>
                  {!submitted && (
                    <label className="flex items-start gap-3">
                      <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 rounded border-white/12 bg-ink-950 text-brand-600" />
                      <span className="text-[13px] text-white/70">I understand that HFT provides education and mentorship and does not guarantee trading profits or financial results.</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
              <button type="button" disabled={saving || readOnly} onClick={saveDraft} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white disabled:opacity-40">
                Save Draft
              </button>
              <div className="flex gap-2">
                {section !== "A" && (
                  <button type="button" onClick={goPrev} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white">
                    Previous
                  </button>
                )}
                {section !== "M" && (
                  <button type="button" onClick={goNext} className="rounded-sm bg-brand-600 px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500">
                    Continue
                  </button>
                )}
              </div>
            </div>
            {message && <p className="mt-2 text-[12px] text-white/60">{message}</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, compact , disabled = false }: { label: string; value?: string; onChange: (v: string) => void; compact?: boolean ; disabled?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 mb-1.5">{label}</label>
      <textarea disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)} rows={compact ? 2 : 3} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none transition-colors" />
    </div>
  );
}

function Input({ label, value, onChange, compact , disabled = false }: { label: string; value?: string; onChange: (v: string) => void; compact?: boolean ; disabled?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 mb-1.5">{label}</label>
      <input disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 ${compact ? 'py-1.5' : 'py-2'} text-[13px] text-white focus:border-brand-600 focus:outline-none transition-colors`} />
    </div>
  );
}

function Select({ label, value, onChange, options , disabled = false }: { label: string; value?: string; onChange: (v: string) => void; options: string[] ; disabled?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 mb-1.5">{label}</label>
      <select disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-1.5 text-[13px] text-white focus:border-brand-600 focus:outline-none transition-colors">
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({ label, values, onToggle, options , disabled = false }: { label: string; values: string[]; onToggle: (v: string) => void; options: string[] ; disabled?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = (values || []).includes(opt);
          return (
            <button
              key={opt}
              disabled={disabled}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-sm px-2.5 py-1 text-[11px] border transition-colors ${
                active ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isNonEmpty(v: any) {
  if (v === null || v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim() !== "";
  return true;
}

function sectionIsComplete(secId: string, data: any) {
  switch (secId) {
    case "A":
      return isNonEmpty(data.fullLegalName) && isNonEmpty(data.email);
    case "B":
      return isNonEmpty(data.tradedBefore);
    case "C":
      return isNonEmpty(data.knowledgeCandlesticks);
    case "D":
      return isNonEmpty(data.primaryGoal);
    case "E":
      return true;
    case "F":
      return true;
    case "G":
      return isNonEmpty(data.timeZone2) || isNonEmpty(data.timeZone);
    case "H":
      return true;
    case "I":
      return isNonEmpty(data.learnFirst30) || isNonEmpty(data.primaryGoal);
    case "J":
      return true;
    case "K":
      return isNonEmpty(data.understandRisk) && isNonEmpty(data.understandNoGuarantee);
    case "L":
      return true;
    case "M": {
      if (!isNonEmpty(data.recommendedStart) && !isNonEmpty(data.personalizedPlan) && !isNonEmpty(data.actionItems) && !isNonEmpty(data.areasToFocus)) {
        return false;
      }
      return true;
    }
    default:
      return false;
  }
}
