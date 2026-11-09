export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect";
  options?: string[];
  compact?: boolean;
  show?: (data: any) => boolean;
};

export type SectionDef = {
  id: string;
  label: string;
  fields: FieldDef[];
};

export const SECTIONS: SectionDef[] = [
  {
    id: "A",
    label: "About Student",
    fields: [
      { key: "fullLegalName", label: "Full Legal Name", type: "text", compact: true },
      { key: "preferredName", label: "Preferred Name/Nickname", type: "text", compact: true },
      { key: "email", label: "Email Address", type: "text", compact: true },
      { key: "phone", label: "Phone Number", type: "text", compact: true },
      { key: "age", label: "Age (optional)", type: "text", compact: true },
      { key: "location", label: "Location (City, Country/State)", type: "text", compact: true },
      { key: "timeZone", label: "Time Zone", type: "select", options: ["EST","CST","MST","PST","GMT","UTC","Other"] },
      { key: "howHeard", label: "How did you hear about HFT?", type: "select", options: ["Referral","YouTube","Instagram/Tiktok","Google Search","Forum/Community","Other"] },
      { key: "howHeardOther", label: "If referral or other, please specify", type: "text", compact: true },
      { key: "aboutYourself", label: "Tell us a bit about yourself outside of trading", type: "textarea" },
      { key: "workingTowardLife", label: "What are you currently working toward in life?", type: "textarea" },
      { key: "motivation", label: "What motivates you when things get difficult?", type: "textarea" },
    ],
  },
  {
    id: "B",
    label: "Trading Experience",
    fields: [
      { key: "tradedBefore", label: "Have you traded before?", type: "select", options: ["Yes","No"] },
      { key: "experienceLevel", label: "Overall Trading Experience Level", type: "select", options: ["None","Beginner (<1 year)","Intermediate (1-3 years)","Advanced (3+ years)","Unsure"] },
      { key: "yearsTrading", label: "Years of trading experience (approx)", type: "text", compact: true },
      { key: "marketsTraded", label: "Markets traded", type: "multiselect", options: ["Forex","Indices","Commodities","Stocks","Options","Crypto","Futures","Other"] },
      { key: "marketsOther", label: "Other markets", type: "text", compact: true },
      { key: "platformsUsed", label: "Platforms used", type: "multiselect", options: ["MT4","MT5","TradingView","cTrader","NinjaTrader","Thinkorswim","Other","None"] },
      { key: "platformsOther", label: "Other platforms", type: "text", compact: true },
      { key: "brokerCurrent", label: "Broker currently used (if any)", type: "select", options: ["IC Markets","Pepperstone","OANDA","FXCM","Other","Not decided"] },
      { key: "brokerOther", label: "Other broker", type: "text", compact: true },
      { key: "demoExperience", label: "Demo account experience?", type: "select", options: ["Yes","No"] },
      { key: "liveExperience", label: "Live account experience?", type: "select", options: ["Yes","No"] },
      { key: "previousEducation", label: "Previous courses, mentors, signals, or trading groups", type: "textarea" },
      { key: "biggestLesson", label: "Biggest lesson learned so far", type: "textarea", compact: true },
      { key: "whyHft", label: "What brought you to HFT specifically?", type: "textarea" },
    ],
  },
  {
    id: "C",
    label: "Knowledge Self-Assessment",
    fields: [
      { key: "knowledgeCandlesticks", label: "Candlestick patterns", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgeSupportResistance", label: "Support & Resistance", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgeTrend", label: "Trend Analysis", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgeRiskMgmt", label: "Risk Management", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgeOrders", label: "Order Types & Execution", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgeMarketStructure", label: "Market Structure", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "knowledgePsychology", label: "Trading Psychology", type: "select", options: ["None","Basic","Intermediate","Advanced","Expert"] },
      { key: "weakestTopic", label: "What topic are you weakest in?", type: "text", compact: true },
      { key: "strongestTopic", label: "What topic are you strongest in?", type: "text", compact: true },
    ],
  },
  {
    id: "D",
    label: "Goals",
    fields: [
      { key: "primaryGoal", label: "Primary goal for joining HFT (be specific)", type: "textarea" },
      { key: "successLooksLike", label: "What would success look like for you after completing the program?", type: "textarea" },
      { key: "goal30Day", label: "30-day goal", type: "textarea", compact: true },
      { key: "goal90Day", label: "90-day goal", type: "textarea", compact: true },
      { key: "goal6Month", label: "6-month goal", type: "textarea", compact: true },
      { key: "goal12Month", label: "12-month goal", type: "textarea", compact: true },
      { key: "goalImportance", label: "Why are these goals important to you?", type: "textarea" },
      { key: "timelineExpectation", label: "Timeline expectation", type: "select", options: ["3-6 months","6-9 months","9-12 months","12+ months","Unsure"] },
    ],
  },
  {
    id: "E",
    label: "Psychology",
    fields: [
      { key: "riskTolerance", label: "Risk tolerance", type: "select", options: ["Conservative","Moderate","Aggressive","Unsure"] },
      { key: "fomoTendency", label: "Tendency toward FOMO", type: "select", options: ["Never","Rarely","Sometimes","Often","Always"] },
      { key: "revengeTrading", label: "Revenge trading tendency", type: "select", options: ["Yes","No"] },
      { key: "impatience", label: "Impatience with results", type: "select", options: ["Yes","No"] },
      { key: "difficultyFollowingRules", label: "Difficulty following rules", type: "select", options: ["Yes","No"] },
      { key: "emotionalAfterLosses", label: "Emotional after losses", type: "select", options: ["Yes","No"] },
      { key: "reactToLosses", label: "How do you react to losing trades?", type: "textarea" },
      { key: "biggestPsychChallenge", label: "Biggest psychological challenge in trading", type: "textarea", compact: true },
      { key: "disciplineHelps", label: "What helps you stay disciplined?", type: "textarea", compact: true },
    ],
  },
  {
    id: "F",
    label: "Learning Style",
    fields: [
      { key: "learningPrefs", label: "Preferred learning methods", type: "multiselect", options: ["Live coaching","Videos","Reading material","Hands-on practice","Quizzes/assessments","Group discussion","One-on-one feedback"] },
      { key: "learningPrefsOther", label: "Other learning preference", type: "text", compact: true },
      { key: "learningPace", label: "Learning pace preference", type: "select", options: ["Fast-paced","Moderate","Slow and thorough","Mix"] },
      { key: "learnBy", label: "Do you learn better by doing or watching?", type: "select", options: ["By doing (practice)","By watching (demo)","Equal","Unsure"] },
      { key: "comfortAsking", label: "Comfort level asking questions", type: "select", options: ["Very comfortable","Comfortable","Neutral","Uncomfortable","Very uncomfortable"] },
      { key: "learningEnvironment", label: "What environment helps you learn best?", type: "textarea", compact: true },
      { key: "overwhelmCauses", label: "What usually causes overwhelm?", type: "textarea", compact: true },
    ],
  },
  {
    id: "G",
    label: "Schedule & Availability",
    fields: [
      { key: "timeZone2", label: "Time Zone", type: "select", options: ["EST","CST","MST","PST","GMT","UTC","Other"] },
      { key: "workSchedule", label: "Work/School schedule (description)", type: "textarea", compact: true },
      { key: "preferredStudyTimes", label: "Preferred study times", type: "multiselect", options: ["Early Morning","Morning","Afternoon","Evening","Night","Weekend","Flexible"] },
      { key: "hoursPerWeek", label: "Hours per week available for study/practice", type: "text", compact: true },
      { key: "canAttendLive", label: "Can you attend live coaching sessions?", type: "select", options: ["Yes","No"] },
      { key: "bestOnboardingTime", label: "Best days/times for 1-on-1", type: "text", compact: true },
      { key: "commitments", label: "Major commitments that may limit availability", type: "textarea", compact: true },
      { key: "realisticConsistency", label: "Realistic consistency level", type: "select", options: ["Very consistent","Mostly consistent","Inconsistent","Unsure"] },
    ],
  },
  {
    id: "H",
    label: "Tech/Broker Readiness",
    fields: [
      { key: "devices", label: "Primary device for trading/study", type: "multiselect", options: ["Desktop/Laptop","Tablet","Mobile"] },
      { key: "internetQuality", label: "Internet connection quality", type: "select", options: ["Stable high-speed","Average","Unstable"] },
      { key: "hasTradingView", label: "Do you have access to TradingView?", type: "select", options: ["Yes","No"] },
      { key: "hasBrokerAccount", label: "Do you have a broker account?", type: "select", options: ["Yes - Live","Yes - Demo","No","In process"] },
      { key: "preferredBroker", label: "Preferred broker", type: "select", options: ["IC Markets","Pepperstone","OANDA","FXCM","Other","Not decided"] },
      { key: "preferredBrokerOther", label: "Other broker preference", type: "text", compact: true },
      { key: "techComfort", label: "Comfortable installing/troubleshooting software?", type: "select", options: ["Very comfortable","Comfortable","Somewhat","Not comfortable"] },
      { key: "techLimitations", label: "Any tech limitations?", type: "textarea", compact: true },
    ],
  },
  {
    id: "I",
    label: "Learning Goals",
    fields: [
      { key: "learnFirst30", label: "What do you most want to learn in first 30 days?", type: "textarea" },
      { key: "skillToMaster", label: "What skill would change your trading the most if mastered?", type: "textarea", compact: true },
      { key: "independentByEnd", label: "What do you want to be able to do independently by end of program?", type: "textarea" },
      { key: "focusAreas", label: "Focus areas", type: "multiselect", options: ["Entry/Exit","Risk Management","Psychology/Discipline","Market Analysis","Strategy Development","Journal/Review Process"] },
      { key: "specificStrategy", label: "Specific setup/strategy interested in", type: "textarea", compact: true },
      { key: "successMetric", label: "What success metric matters most to you?", type: "textarea", compact: true },
    ],
  },
  {
    id: "J",
    label: "Support Between Classes",
    fields: [
      { key: "accountabilityPrefs", label: "Accountability preference", type: "multiselect", options: ["Strict deadlines","Weekly check-ins","Daily accountability","Self-paced with reminders","Other"] },
      { key: "accountabilityOther", label: "Other accountability", type: "text", compact: true },
      { key: "feedbackFrequency", label: "How often do you want feedback?", type: "select", options: ["After every class","Weekly","Biweekly","As needed","Minimal"] },
      { key: "helpMethod", label: "Preferred way to get help between classes", type: "select", options: ["Group chat","Email","1-on-1 message","Office hours","As needed"] },
      { key: "supportWhenStuck", label: "What kind of support helps most when stuck?", type: "textarea", compact: true },
      { key: "obstacles", label: "Potential obstacles to completing program", type: "textarea" },
      { key: "obstacleSolutions", label: "How will you overcome them?", type: "textarea" },
    ],
  },
  {
    id: "K",
    label: "Program Expectations & Risk",
    fields: [
      { key: "expectations", label: "What are your expectations of the program?", type: "textarea" },
      { key: "commitment", label: "What are you willing to commit (time/effort)?", type: "textarea", compact: true },
      { key: "understandRisk", label: "Do you understand trading involves risk of loss?", type: "select", options: ["Yes","No"] },
      { key: "understandNoGuarantee", label: "Do you understand past performance doesn't guarantee future results?", type: "select", options: ["Yes","No"] },
      { key: "concerns", label: "Any concerns about the program?", type: "textarea", compact: true },
      { key: "anythingElse", label: "Anything we should know before starting?", type: "textarea", compact: true },
    ],
  },
  {
    id: "L",
    label: "Membership Feedback",
    fields: [
      { key: "membershipReason", label: "Overall reason for interest in HFT membership", type: "select", options: ["Education/Mentorship","Community","Strategy Development","Accountability","All of the above","Other"] },
      { key: "membershipReasonOther", label: "Other reason", type: "text", compact: true },
      { key: "decisionNow", label: "What made you decide to apply now?", type: "textarea", compact: true },
      { key: "experienceGreat", label: "What would make this experience great?", type: "textarea" },
      { key: "feedbackSuggestions", label: "Any feedback/suggestions?", type: "textarea", compact: true },
    ],
  },
  {
    id: "M",
    label: "Instructor Review & Wrap-Up",
    fields: [
      { key: "strengthsIdentified", label: "Strengths Identified", type: "textarea" },
      { key: "areasToFocus", label: "Areas to Focus On", type: "textarea" },
      { key: "instructorNotes", label: "Key Concerns / Notes", type: "textarea" },
      { key: "recommendedStart", label: "Recommended Starting Level/Track", type: "text", compact: true },
      { key: "personalizedPlan", label: "Personalized Training Plan", type: "textarea" },
      { key: "actionItems", label: "Action Items", type: "textarea" },
    ],
  },
];
