import {FINANCIAL_HEALTH_REGISTRY} from '../student-intake-v2/financial-health-registry';
import {DEBT_CREDIT_REGISTRY} from '../student-intake-v2/debt-credit-registry';
import {MONTHLY_OBLIGATIONS_REGISTRY} from '../student-intake-v2/monthly-obligations-registry';
import {TRADING_CAPITAL_READINESS_REGISTRY} from '../student-intake-v2/trading-capital-readiness-registry';
// Material rule inputs, distinct from merely mentioned reason/context fields.
const ruleInputs:Record<string,string[]>={
 financial_stability_band_v1:['monthlyTakeHomeRange','incomeConsistencyPay','remainingDiscretionaryCashFlowRange','cashFlowVariabilityConfidence'],
 emergency_resilience_band_v1:['savingsEmergencyRanges','unexpectedExpenseAbility'],
 capital_safety_review_v1:['availableTradingCapitalRange','affordableLossRange','liveTradingFundingStatus','tradingCapitalSeparation','lossOfTradingCapitalImpact'],
 funding_source_safety_review_v1:['tradingCapitalSources','borrowedCreditFundingIntent','billsMoneyUsedForTradingFrequency'],
 trading_profit_dependency_review_v1:['pressureToMakeMoneyQuickly','tradingProfitsForEssentialExpensesExpectation','billsMoneyUsedForTradingFrequency'],
 demo_first_readiness_advisory_v1:['availableTradingCapitalRange','affordableLossRange','liveTradingReadinessSelfAssessment','tradingCapitalSources','borrowedCreditFundingIntent','tradingProfitsForEssentialExpensesExpectation'],
};
export const STUDENT_CONTEXT_KEYS=new Set(['monthlyTakeHomeRange','incomeConsistencyPay','disposableIncomeRange','remainingDiscretionaryCashFlowRange','savingsEmergencyRanges','unexpectedExpenseAbility','debtStatusTypes','totalDebtRange','monthlyDebtPaymentsRange','debtReductionStrategy','debtPayoffPriorities','creditBuildingGoals','financialImprovementGoals612','availableTradingCapitalRange','affordableLossRange','pressureToMakeMoneyQuickly','liveTradingFundingStatus','tradingCapitalSources','tradingCapitalSeparation','lossOfTradingCapitalImpact','borrowedCreditFundingIntent','tradingProfitsForEssentialExpensesExpectation','tradingCapitalTimeHorizon']);
export const FINANCIAL_COVERAGE=[['Financial health',FINANCIAL_HEALTH_REGISTRY],['Debt / credit',DEBT_CREDIT_REGISTRY],['Monthly obligations',MONTHLY_OBLIGATIONS_REGISTRY],['Trading capital',TRADING_CAPITAL_READINESS_REGISTRY]].flatMap(([group,registry])=>(registry as typeof FINANCIAL_HEALTH_REGISTRY).map(field=>{
 const rules=Object.entries(ruleInputs).filter(([,keys])=>keys.includes(field.key)).map(([rule])=>rule);
 return {key:field.key,label:field.question,group:String(group),rules,policy:rules.length?'USED_IN_DETERMINISTIC_RULE':STUDENT_CONTEXT_KEYS.has(field.key)?'DISPLAYED_AS_SELF_REPORTED_CONTEXT':'INSTRUCTOR_REVIEW_CONTEXT',note:rules.length?'Categorical rules only; no exact-dollar inference.':'Not used in a deterministic recommendation. No debt/credit algorithm.'};
}));
