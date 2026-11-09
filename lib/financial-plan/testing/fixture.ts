// Synthetic values copied from existing approved-contract validation fixtures. No real student data.
import {ACKNOWLEDGMENT_KEYS,PREFER_NOT_TO_SAY,type StudentSectionsV2,type InstructorAssessmentV2} from "../../student-intake-v2/contracts";
function fv<T>(value: T) { return { value }; }
const LEGACY_PRE3D_FORM = "hft_intake_v2_form.2026-11-05";

export function baseStudent(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
  return {
    // Q1-Q74 preserved baseline (uses existing required fields/semantics; Q39-Q46 unchanged)
    preferredName: fv("A"), location: fv("X"), timeZone: fv("UTC"), occupation: fv("W"), employmentType: fv("Full-time employee"), workScheduleSummary: fv("9-5"), majorResponsibilities: fv(["None"]),
    currentLifeGoal: fv("G"), motivationAndWhyNow: fv("M"),
    monthlyTakeHomeRange: fv("$3,000–$4,999"), additionalIncome: fv({ hasAdditional: "No" }), incomeConsistencyPay: fv({ consistency: "Very consistent", payFrequency: "Monthly" }), disposableIncomeRange: fv("$500–$999"), recurringObligationsRange: fv("$1,000–$1,999"), variableExpensesRange: fv("$250–$499"), upcomingMajorExpenses: fv({ hasUpcoming: "No" }), savingsEmergencyRanges: fv({ savings: "$500–$999", emergencyFund: "$500–$999" }), unexpectedExpenseAbility: fv("I could cover it, but it would be difficult"), debtStatusTypes: fv({ hasDebt: "No" }),
    availableTradingCapitalRange: fv("$500–$999"), affordableLossRange: fv("$100–$249"), pressureToMakeMoneyQuickly: fv("A little urgency"), desiredAdditionalMonthlyIncomeRange: fv("$500–$999"), financialReasonForTrading: fv("Build a skill"),
    marketsExperience: fv(["None yet"]), demoLiveExperience: fv({ demo: "No", live: "No" }), knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Heard of it"]))),
    platformsBrokerExperience: fv({ platforms: ["None yet"], brokerExperience: "No" }), priorEducation: fv({ type: "No" }), majorNegativeExperience: fv({ type: "No" }), biggestTradingConfusion: fv("Risk"),
    behaviorMatrix: fv({ fomo:"Sometimes", revenge_trading:"Unlikely", impulsiveness:"Rarely", patience:"Moderate", rule_consistency:"Usually" }), behaviorTendencies: fv(["Not applicable yet"]), reactionToLoss: fv("Pause"), reactionToWin: fv("Calm"), willingDemoFirst: fv("Yes"), willingRiskLimits: fv("Yes"),
    goalImmediate: fv("Start"), goals30_60_90: fv({ goal30:"a", goal60:"b", goal90:"c" }), goals6_12: fv({ goal6:"d" }), goalBig: fv("e"), goalWhy: fv("f"), successDefinition: fv("g"), desiredTradingIncomeRange: fv("$500–$999"), membershipValue: fv("h"),
    learningStyles: fv(["Videos"]), paceAndQuestionComfort: fv({ pace: "Moderate/steady", questionComfort: "Comfortable" }), homeworkPreference: fv(["Chart markup exercises"]), accountabilityFeedback: fv({ accountability: "Weekly check-ins", feedbackFrequency: "Weekly" }),
    weeklyAvailability: fv({ monday: { windows: ["Evening"] } }), unavailableDays: fv(["None"]), weeklyHoursRange: fv("2–4 hours"), windowsAndConsistency: fv({ preferredWindows: ["Weekday evenings"], consistencyExpectation: "Mostly consistent" }),
    devicesInternet: fv({ devices: ["Computer/laptop"], internetReliability: "Mostly reliable" }), platformAccess: fv({ tradingView: "Yes", mt5: "No", demoAccount: "No", liveAccount: "No" }), supportTechReadiness: fv({ canScreenShare: "Yes", softwareComfort: "Comfortable" }),
    // DC
    debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY), creditUtilizationAwareness: fv("Not sure yet"), paymentHistoryConsistency: fv("Not sure yet"), debtRelatedStress: fv(PREFER_NOT_TO_SAY), creditBuildingGoals: fv("Not sure yet"), recentFinancialHardship: fv({ status: "No recent financial hardship" }), emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY), creditEducationInterest: fv(PREFER_NOT_TO_SAY), financialImprovementGoals612: fv(["Learn more about debt and credit"]),
    // MO (required for phase3d/3e/3f-era gates as applicable)
    householdIncomeSources: fv(["Primary employment"]), reliableMonthlyIncomePlanningRange: fv("$3,000–$4,999"), housingSituationPayment: fv({ status: "Rent", monthlyRange: "$1,000–$1,499" }), utilitiesHouseholdNecessitiesRange: fv("$250–$499"), transportationObligationRange: fv({ hasTransportationCost: "Yes", monthlyRange: "$250–$499" }), foodGroceriesRange: fv("$400–$599"), insuranceMedicalRecurringRange: fv("$100–$249"), dependentSupportObligation: fv({ hasDependentSupportCost: "No / none" }), subscriptionsDiscretionaryRecurringRange: fv("$50–$99"), otherRecurringObligations: fv({ hasOtherObligations: "No / none" }), monthlySavingsContributionRange: fv("$100–$249"), remainingDiscretionaryCashFlowRange: fv("$250–$499"), cashFlowVariabilityConfidence: fv("Mostly predictable"), billsMoneyUsedForTradingFrequency: fv("Never"),
    // TC (required for phase3e-era gate; grandfathered pre-3e)
    liveTradingFundingStatus: fv("Demo/paper trading only"), tradingCapitalSources: fv(["Not funded yet"]), tradingCapitalSeparation: fv("Not funded yet"), lossOfTradingCapitalImpact: fv(["Not funded yet"]), tradingCapitalReplacementExpectation: fv("Not funded yet"), tradingCapitalTimeHorizon: fv("Not funded yet"), emergencyFundProtectionIntent: fv("Not funding live trading yet"), borrowedCreditFundingIntent: fv("Not funding live trading yet"), tradingProfitsForEssentialExpensesExpectation: fv("Not live trading yet"), liveTradingReadinessSelfAssessment: fv("Prefer demo trading for now"),
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any),
    ...overrides,
  } as StudentSectionsV2;
}
export function pfAnswers(overrides: Partial<StudentSectionsV2> = {}): Partial<StudentSectionsV2> {
  return {
    situationalLossResponse: fv("Follow my plan and review before the next decision"),
    situationalWinStreakResponse: fv("Continue following my normal plan/rules"),
    missedTradeFomoResponse: fv("Comfortable missing it and wait for the next valid setup"),
    unplannedTradeFrequency: fv("Rarely"),
    plannedLossLimitStopAdherence: fv("Very likely"),
    willingToPauseLiveTradingAndReturnToDemo: fv("Yes, willing and able"),
    protectiveExitBehavior: fv("I follow the protective exit as planned"),
    noTradeDayAcceptance: fv("Usually comfortable"),
    journalReviewPractice: fv("I do not currently journal/review, but I am willing to start"),
    ...overrides,
  };
}
export function instructor(): InstructorAssessmentV2 {
  return { instructorSummary:fv("s"), assessedExperienceLevel:fv("Beginner"), assessedKnowledgeLevel:fv("Gaps"), instructorStrengths:fv("x"), instructorWeaknesses:fv("y"), recommendedStartingLevel:fv("F"), recommendedAcademyTrack:fv("T"), recommendedFirstLesson:fv("L"), firstHomework:fv("H"), recommendedPracticeFrequency:fv("4–5x/week"), recommendedCoachingFrequency:fv("Weekly"), immediateActionItems:fv("A") } as any;
}
