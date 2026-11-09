export type PCategory = "forex" | "risk" | "execution" | "psychology" | "analysis";

export type PQuestion = {
  id: string;
  category: PCategory;
  type: "multiple-choice" | "multiple-select" | "scenario";
  question: string;
  choices: string[];
  correct: string[];
  explanation: string;
  points: number;
};

export const WEIGHTS: Record<PCategory, number> = {
  forex: 0.30,
  risk: 0.25,
  execution: 0.20,
  psychology: 0.15,
  analysis: 0.10,
};

export const PLACEMENT_BANDS = [
  { max: 29, level: "Brand New", track: "HFT Foundations" },
  { max: 49, level: "Beginner / Foundations", track: "HFT Foundations" },
  { max: 69, level: "Developing Trader", track: "Developing Trader" },
  { max: 84, level: "Intermediate", track: "Intermediate" },
  { max: 100, level: "Advanced Assessment", track: "Advanced" },
];

export const SAFEGUARDS = {
  intermediate: { overall: 70, risk: 65 },
  advanced: { overall: 85, risk: 75, execution: 75, analysis: 70 },
};

export const QUESTIONS: PQuestion[] = [
  { id: "fx1", category: "forex", type: "multiple-choice", question: "In EUR/USD, which is the base currency?", choices: ["EUR", "USD", "Both", "Neither"], correct: ["EUR"], explanation: "Base is first.", points: 1 },
  { id: "fx2", category: "forex", type: "multiple-choice", question: "A pip is usually the 4th decimal place in most pairs.", choices: ["True", "False"], correct: ["True"], explanation: "Standard.", points: 1 },
  { id: "fx3", category: "forex", type: "multiple-choice", question: "Spread is the difference between:", choices: ["Bid and ask", "High and low", "Open and close", "Profit and loss"], correct: ["Bid and ask"], explanation: "Spread.", points: 1 },
  { id: "fx4", category: "forex", type: "multiple-choice", question: "A bullish candle closes:", choices: ["Above open", "Below open", "At open", "At low"], correct: ["Above open"], explanation: "Bullish.", points: 1 },
  { id: "fx5", category: "forex", type: "multiple-choice", question: "Support is an area where price tends to:", choices: ["Bounce up", "Drop", "Gap", "Reverse instantly"], correct: ["Bounce up"], explanation: "Support.", points: 1 },
  { id: "fx6", category: "forex", type: "multiple-choice", question: "Higher highs and higher lows indicate:", choices: ["Uptrend", "Downtrend", "Range", "Reversal"], correct: ["Uptrend"], explanation: "Uptrend.", points: 1 },
  { id: "fx7", category: "forex", type: "multiple-choice", question: "Quote currency in GBP/USD is:", choices: ["GBP", "USD", "Both", "Neither"], correct: ["USD"], explanation: "Quote.", points: 1 },
  { id: "rk1", category: "risk", type: "multiple-choice", question: "A stop loss is used to:", choices: ["Limit loss", "Increase profit", "Enter trade", "Close winner"], correct: ["Limit loss"], explanation: "SL.", points: 1 },
  { id: "rk2", category: "risk", type: "multiple-choice", question: "Risk/reward 1:2 means:", choices: ["Risk 1 to make 2", "Risk 2 to make 1", "No risk", "Guaranteed"], correct: ["Risk 1 to make 2"], explanation: "RR.", points: 1 },
  { id: "rk3", category: "risk", type: "multiple-choice", question: "Best risk per trade commonly:", choices: ["1-2%", "50%", "100%", "0%"], correct: ["1-2%"], explanation: "Conservative.", points: 1 },
  { id: "rk4", category: "risk", type: "multiple-choice", question: "Increasing lot size after a loss is:", choices: ["Dangerous", "Required", "Profitable", "Safe"], correct: ["Dangerous"], explanation: "Risk.", points: 1 },
  { id: "rk5", category: "risk", type: "multiple-choice", question: "Position sizing should be based on:", choices: ["Account and risk", "Emotion", "Guess", "Leverage max"], correct: ["Account and risk"], explanation: "Sizing.", points: 1 },
  { id: "ex1", category: "execution", type: "multiple-choice", question: "A market order executes:", choices: ["Immediately", "At a price", "Never", "Only pending"], correct: ["Immediately"], explanation: "Market.", points: 1 },
  { id: "ex2", category: "execution", type: "multiple-choice", question: "A pending order executes when price reaches level.", choices: ["True", "False"], correct: ["True"], explanation: "Pending.", points: 1 },
  { id: "ex3", category: "execution", type: "multiple-choice", question: "Lot size affects:", choices: ["Position size", "Chart color", "Spread only", "Timeframe"], correct: ["Position size"], explanation: "Lot.", points: 1 },
  { id: "ex4", category: "execution", type: "multiple-choice", question: "Modifying SL/TP is done in:", choices: ["Trade terminal", "Chart only", "Email", "Broker phone"], correct: ["Trade terminal"], explanation: "Platform.", points: 1 },
  { id: "ex5", category: "execution", type: "multiple-choice", question: "Closing a trade realizes:", choices: ["Profit/loss", "Nothing", "Spread", "Pending"], correct: ["Profit/loss"], explanation: "Close.", points: 1 },
  { id: "ps1", category: "psychology", type: "scenario", question: "After a loss, best action is:", choices: ["Follow plan", "Revenge trade", "Double size", "Move SL"], correct: ["Follow plan"], explanation: "Discipline.", points: 1 },
  { id: "ps2", category: "psychology", type: "scenario", question: "FOMO often leads to:", choices: ["Poor entries", "Better profits", "Less risk", "More patience"], correct: ["Poor entries"], explanation: "FOMO.", points: 1 },
  { id: "ps3", category: "psychology", type: "scenario", question: "Moving stop loss to avoid loss is:", choices: ["Bad discipline", "Good", "Required", "Profitable"], correct: ["Bad discipline"], explanation: "SL discipline.", points: 1 },
  { id: "ps4", category: "psychology", type: "scenario", question: "Overtrading usually happens when:", choices: ["Emotional", "Planned", "Rested", "Disciplined"], correct: ["Emotional"], explanation: "Overtrading.", points: 1 },
  { id: "an1", category: "analysis", type: "scenario", question: "If price breaks support with momentum, likely:", choices: ["Continuation down", "Always bounce", "No change", "Guaranteed profit"], correct: ["Continuation down"], explanation: "Break.", points: 1 },
  { id: "an2", category: "analysis", type: "scenario", question: "A valid setup needs:", choices: ["Entry, SL, TP", "Hope", "No plan", "Random entry"], correct: ["Entry, SL, TP"], explanation: "Plan.", points: 1 },
  { id: "an3", category: "analysis", type: "scenario", question: "If invalidation occurs, you should:", choices: ["Exit", "Hold", "Increase size", "Ignore"], correct: ["Exit"], explanation: "Invalidation.", points: 1 },

  { id: "fx8", category: "forex", type: "multiple-choice", question: "In USD/JPY, a pip is usually the 2nd decimal place.", choices: ["True", "False"], correct: ["True"], explanation: "JPY pairs.", points: 1 },
  { id: "fx9", category: "forex", type: "multiple-choice", question: "A currency pair quote shows how much of the quote currency is needed for one unit of base.", choices: ["True", "False"], correct: ["True"], explanation: "Quote.", points: 1 },
  { id: "fx10", category: "forex", type: "multiple-choice", question: "Resistance is an area where price tends to:", choices: ["Bounce down", "Break up", "Gap", "Reverse instantly"], correct: ["Bounce down"], explanation: "Resistance.", points: 1 },
  { id: "rk6", category: "risk", type: "multiple-choice", question: "Risking 20% per trade is:", choices: ["Too high", "Normal", "Required", "Safe"], correct: ["Too high"], explanation: "High risk.", points: 1 },
  { id: "rk7", category: "risk", type: "multiple-choice", question: "If account is $1000 and risk 1%, planned risk is:", choices: ["$10", "$100", "$1", "$50"], correct: ["$10"], explanation: "1%.", points: 1 },
  { id: "rk8", category: "risk", type: "multiple-choice", question: "Risk/reward 1:3 means:", choices: ["Risk 1 to make 3", "Risk 3 to make 1", "No risk", "Guaranteed"], correct: ["Risk 1 to make 3"], explanation: "RR.", points: 1 },
  { id: "ex6", category: "execution", type: "multiple-choice", question: "A stop order triggers when price reaches a level.", choices: ["True", "False"], correct: ["True"], explanation: "Stop order.", points: 1 },
  { id: "ex7", category: "execution", type: "multiple-choice", question: "To reduce risk, you can:", choices: ["Lower lot size", "Increase leverage", "Remove SL", "Hold longer"], correct: ["Lower lot size"], explanation: "Sizing.", points: 1 },
  { id: "ps5", category: "psychology", type: "scenario", question: "Taking a planned loss is:", choices: ["Normal", "Failure", "Avoidable", "Bad"], correct: ["Normal"], explanation: "Losses happen.", points: 1 },
  { id: "an4", category: "analysis", type: "scenario", question: "Before entering, you should know:", choices: ["Entry, SL, TP", "Nothing", "Hope", "Random"], correct: ["Entry, SL, TP"], explanation: "Plan.", points: 1 },
  { id: "an5", category: "analysis", type: "scenario", question: "If setup invalidates, best action is:", choices: ["Exit", "Hold", "Add", "Ignore"], correct: ["Exit"], explanation: "Invalidation.", points: 1 },
];

export function scoreAssessment(answers: Record<string, string[]>) {
  const catScore: Record<PCategory, { earned: number; total: number }> = {
    forex: { earned: 0, total: 0 },
    risk: { earned: 0, total: 0 },
    execution: { earned: 0, total: 0 },
    psychology: { earned: 0, total: 0 },
    analysis: { earned: 0, total: 0 },
  };
  for (const q of QUESTIONS) {
    catScore[q.category].total += q.points;
    const a = answers[q.id] ?? [];
    const correct = q.correct.slice().sort().join("|");
    const given = a.slice().sort().join("|");
    if (correct === given) catScore[q.category].earned += q.points;
  }
  const pct = (c: PCategory) => catScore[c].total ? Math.round((catScore[c].earned / catScore[c].total) * 100) : 0;
  const categoryScores = {
    forexKnowledge: pct("forex"),
    riskManagement: pct("risk"),
    execution: pct("execution"),
    psychology: pct("psychology"),
    analysis: pct("analysis"),
  };
  const overallScore = Math.round(
    categoryScores.forexKnowledge * WEIGHTS.forex +
    categoryScores.riskManagement * WEIGHTS.risk +
    categoryScores.execution * WEIGHTS.execution +
    categoryScores.psychology * WEIGHTS.psychology +
    categoryScores.analysis * WEIGHTS.analysis
  );
  let recommendedLevel = "Brand New";
  let recommendedTrack = "HFT Foundations";
  let safeguardReason: string | null = null;
  const band = [...PLACEMENT_BANDS].reverse().find((b) => overallScore <= b.max) ?? PLACEMENT_BANDS[0];
  // determine base band by overall
  const baseBand = PLACEMENT_BANDS.find((b) => overallScore <= b.max) ?? PLACEMENT_BANDS[PLACEMENT_BANDS.length - 1];
  recommendedLevel = baseBand.level;
  recommendedTrack = baseBand.track;

  // safeguards
  if (overallScore >= SAFEGUARDS.advanced.overall) {
    if (categoryScores.riskManagement < SAFEGUARDS.advanced.risk || categoryScores.execution < SAFEGUARDS.advanced.execution || categoryScores.analysis < SAFEGUARDS.advanced.analysis) {
      safeguardReason = "Advanced Assessment requires Risk Management, Execution, and Analysis thresholds.";
      // downgrade to intermediate if possible
      if (overallScore >= SAFEGUARDS.intermediate.overall && categoryScores.riskManagement >= SAFEGUARDS.intermediate.risk) {
        recommendedLevel = "Intermediate";
        recommendedTrack = "Intermediate";
      } else {
        recommendedLevel = "Developing Trader";
        recommendedTrack = "Developing Trader";
      }
    }
  } else if (overallScore >= SAFEGUARDS.intermediate.overall) {
    if (categoryScores.riskManagement < SAFEGUARDS.intermediate.risk) {
      safeguardReason = "Intermediate requires Risk Management >= 65.";
      recommendedLevel = "Developing Trader";
      recommendedTrack = "Developing Trader";
    }
  }

  const strengths = Object.entries(categoryScores).filter(([, v]) => v >= 70).map(([k]) => k);
  const focusAreas = Object.entries(categoryScores).filter(([, v]) => v < 60).map(([k]) => k);

  return { overallScore, categoryScores, recommendedLevel, recommendedTrack, strengths, focusAreas, safeguardReason };
}

/** Validate evidence before scoring; unanswered is not a fabricated zero score. */
export function validatePlacementAnswers(value:unknown,complete=true,questions:PQuestion[]=QUESTIONS):asserts value is Record<string,string[]> {
 if(!value||typeof value!=='object'||Array.isArray(value)||JSON.stringify(value).length>50000)throw new Error('Invalid assessment answers.');
 const answers=value as Record<string,unknown>;
 if(Object.keys(answers).some(id=>!questions.some(q=>q.id===id)))throw new Error('Foreign question in assessment.');
 for(const q of questions){const answer=answers[q.id];if(answer===undefined&&!complete)continue;
  if(!Array.isArray(answer)||!answer.length||new Set(answer).size!==answer.length||q.type!=='multiple-select'&&answer.length!==1||answer.some(a=>typeof a!=='string'||!q.choices.includes(a)))throw new Error(`Complete a valid answer for ${q.id}.`);
 }
}
