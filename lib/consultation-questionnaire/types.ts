export type QuestionnaireStatus = "draft" | "submitted";

export type CustomBill = {
  id: string;
  name: string;
  amount: string;
};

export type ConsultationQuestionnaireData = {
  // Section A
  aboutYourself?: string;
  currentWork?: string;
  workingTowardLife?: string;
  ownOrStartBusiness?: string;
  businessIdeas?: string;
  strengths?: string;
  consistencyInterference?: string;
  motivation?: string;
  proudAccomplishment?: string;
  hftHelpBesidesTrading?: string;

  // Section B
  employmentStatus?: string;
  jobTitle?: string;
  employerName?: string;
  compensationType?: string;
  hourlyRate?: string;
  salary?: string;
  hoursPerWeek?: string;
  payFrequency?: string;
  takeHomePerPaycheck?: string;
  monthlyTakeHomeIncome?: string;
  otherIncomeSources?: string;
  monthlyOtherIncome?: string;
  incomeConsistency?: string;
  employmentNotes?: string;

  // Section C
  billRentMortgage?: string;
  billCarPayment?: string;
  billCarInsurance?: string;
  billPhone?: string;
  billUtilities?: string;
  billInternet?: string;
  billCreditCards?: string;
  billLoans?: string;
  billChildFamilySupport?: string;
  billGroceries?: string;
  billGasTransportation?: string;
  billSubscriptions?: string;
  billOtherRecurring?: string;
  customBills?: CustomBill[];
  approximateSavings?: string;
  disposableIncomeAfterObligations?: string;
  financialPressures?: string;
  upcomingMajorExpenses?: string;

  // Section D
  currentApproxMonthlyIncome?: string;
  desiredFutureMonthlyIncome?: string;
  meaningfulMonthlyIncome?: string;
  biggestFinancialGoal?: string;
  smallNearTermGoal?: string;
  goal30Day?: string;
  goal60Day?: string;
  goal90Day?: string;
  goal612Month?: string;
  additionalIncomeWouldAllow?: string;
  tradingRoleHope?: string;
  goalImportance?: string;

  // Section E
  tradedBefore?: string;
  experienceLevel?: string;
  marketsTraded?: string[] | string;
  demoExperience?: string;
  liveExperience?: string;
  platformsUsed?: string[] | string;
  brokerCurrent?: string;
  previousEducation?: string;
  experienceLength?: string;
  lossOrScam?: string;
  lossOrScamExplanation?: string;
  tradingUnderstandWell?: string;
  tradingConfuses?: string;
  interestInForexHft?: string;

  // Section F
  patienceRating?: string;
  disciplineRating?: string;
  confidenceRulesRating?: string;
  fomoTendency?: string;
  revengeTrading?: string;
  closeWinnersEarly?: string;
  holdLosingLong?: string;
  increaseSizeAfterLoss?: string;
  noPlanEntry?: string;
  difficultyWaiting?: string;
  emotionalReactionLoss?: string;
  loseConsistencyCause?: string;
  reactWhenNotWorking?: string;
  biggestWeakness?: string;
  biggestStrength?: string;

  // Section G
  learningMethods?: string[] | string;
  instructionPreference?: string;
  comfortAsking?: string;
  feedbackPreference?: string;
  quizzesHelp?: string;
  practiceAssignmentsHelp?: string;
  learningEasiest?: string;
  overwhelmedCauses?: string;

  // Section H
  timeZone?: string;
  workSchoolSchedule?: string;
  daysAvailable?: string;
  hoursPerWeekHft?: string;
  preferredStudyTimes?: string[] | string;
  fridayCoaching?: string;
  scheduleResponsibilities?: string;
  bestOneOnOneTime?: string;
  realisticConsistency?: string;
  upcomingScheduleChanges?: string;

  // Section I
  whyJoinHft?: string;
  mostWantToLearn?: string;
  valueBeforeResults?: string;
  progress30Days?: string;
  progress60Days?: string;
  progress90Days?: string;
  wantFromInstructor?: string;
  accountabilityType?: string;
  feedbackFrequency?: string;
  supportBetweenLessons?: string;
  potentialObstacles?: string;
  proudOutsideTrading?: string;
  transferableSkills?: string;
  businessInterestsOutside?: string;
  oneYearGoals?: string;
  prioritizeIfIncomeUp?: string;
  financialHabitImprove?: string;

  // Game plan / targets
  desiredDailyTradingTarget?: string;
  desiredMonthlyTradingTarget?: string;
  maxDailyLoss?: string;
  plannedTradingDays?: string;
  preferredTradingSession?: string;
  accountType?: string;
  riskPerTrade?: string;
};

export type ConsultationQuestionnaire = {
  id: string;
  userId: string;
  bookingId: string | null;
  status: QuestionnaireStatus;
  data: ConsultationQuestionnaireData;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
};
