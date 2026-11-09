/** Internal, optional review sidecar. Approved student question keys stay unchanged. */
export const REVIEW_VERSION='canonical_review_v1' as const;
export const judgmentFields=['instructorStrengths','instructorWeaknesses','behavioralConcerns','financialRiskConcerns','scheduleConcerns','learningStyleObservations','riskRestrictions','instructorPrivateNotes'] as const;
export type Match='MATCHES'|'PARTIAL'|'CONTRADICTS'|'NOT_OBSERVED';
export type SmartReview={version:typeof REVIEW_VERSION;status:'draft'|'reviewed';sourceRevision:number;reviewedBy:string|null;reviewedAt:string|null;matchesSelfReport:Match;contradictions:string;requireAssessment:boolean;requirePractical:boolean;requireChartDemonstration:boolean;reason:string};
export function reviewIsCurrent(value:unknown,revision:number|undefined):value is SmartReview{
 const r=value as SmartReview|undefined;return !!r&&r.version===REVIEW_VERSION&&r.status==='reviewed'&&typeof revision==='number'&&r.sourceRevision===revision&&!!r.reviewedBy&&!!r.reviewedAt&&['MATCHES','PARTIAL','CONTRADICTS','NOT_OBSERVED'].includes(r.matchesSelfReport);
}
export function changedFields(previous:Record<string,unknown>,incoming:Record<string,unknown>,reason:string){return Object.keys(incoming).filter(key=>JSON.stringify(previous[key])!==JSON.stringify(incoming[key])).map(key=>({key,previousValue:previous[key]??null,newValue:incoming[key]??null,reason:reason.trim()||null}))}
export function defaultReview(revision:number):SmartReview{return {version:REVIEW_VERSION,status:'draft',sourceRevision:revision,reviewedBy:null,reviewedAt:null,matchesSelfReport:'NOT_OBSERVED',contradictions:'',requireAssessment:false,requirePractical:false,requireChartDemonstration:false,reason:''}}
