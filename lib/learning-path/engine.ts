import { QUESTIONS, scoreAssessment, validatePlacementAnswers } from '../placement-assessment';
import { DOMAINS, type Domain, type EducationalSource, type Recommendation, type DomainProfile, type Evidence, type InstructorPath, type StudentPath, type Level } from './contracts';
export const LEARNING_ENGINE_VERSION = 'educational_path_v1.assessment_v1.canonical_review_v1.numbered_v1';
export const QUESTION_DOMAINS: Record<Domain, string[]> = {
    FOREX_FOUNDATIONS: ['fx1', 'fx7', 'fx9'], MARKET_MECHANICS: ['fx2', 'fx3', 'fx8', 'ex1', 'ex2', 'ex3', 'ex4', 'ex6'], RISK_MANAGEMENT: ['rk1', 'rk2', 'rk3', 'rk4', 'rk5', 'rk6', 'rk7', 'rk8', 'ex7'], CHART_READING_MARKET_STRUCTURE: ['fx4', 'fx5', 'fx6', 'fx10', 'an1'], LIQUIDITY_CONCEPTS: [], ENTRY_EXECUTION: ['ex1', 'ex2', 'ex4', 'ex5', 'ex6', 'an2', 'an3', 'an4', 'an5'], MULTI_TIMEFRAME_ANALYSIS: [], PSYCHOLOGY_DISCIPLINE: ['ps1', 'ps2', 'ps3', 'ps4', 'ps5'], TRADING_SYSTEM_CONSISTENCY: ['an2', 'an4', 'ps1', 'ps5'],
};
export const KNOWLEDGE_TOPICS:Partial<Record<Domain,string[]>>={FOREX_FOUNDATIONS:['buy_sell_direction','pips'],MARKET_MECHANICS:['lot_size','leverage','spread_fees'],RISK_MANAGEMENT:['stop_loss','risk_management','position_sizing'],CHART_READING_MARKET_STRUCTURE:['candlesticks','support_resistance','trend','market_structure_basics'],ENTRY_EXECUTION:['buy_sell_direction','stop_loss','take_profit','lot_size']};
export const EDUCATIONAL_STUDENT_KEYS = ['marketsExperience', 'demoLiveExperience', 'knowledgeMatrix', 'platformsBrokerExperience', 'priorEducation', 'biggestTradingConfusion', 'behaviorMatrix', 'behaviorTendencies', 'reactionToLoss', 'reactionToWin', 'disciplineBreakers', 'selfStrength', 'learningStyles', 'paceAndQuestionComfort', 'homeworkPreference', 'accountabilityFeedback', 'weeklyAvailability', 'unavailableDays', 'weeklyHoursRange', 'windowsAndConsistency', 'devicesInternet', 'platformAccess', 'supportTechReadiness', 'situationalLossResponse', 'situationalWinStreakResponse', 'missedTradeFomoResponse', 'unplannedTradeFrequency', 'plannedLossLimitStopAdherence', 'willingToPauseLiveTradingAndReturnToDemo', 'protectiveExitBehavior', 'noTradeDayAcceptance', 'journalReviewPractice'] as const;
export const EDUCATIONAL_INSTRUCTOR_KEYS = ['assessedExperienceLevel', 'assessedKnowledgeLevel', 'instructorStrengths', 'instructorWeaknesses', 'behavioralConcerns', 'scheduleConcerns', 'learningStyleObservations', 'recommendedStartingLevel', 'recommendedAcademyTrack', 'recommendedModules', 'recommendedFirstLesson', 'firstHomework', 'recommendedPracticeFrequency', 'recommendedCoachingFrequency', 'immediateActionItems'] as const;
const select = (values: Record<string, any>, keys: readonly string[]) => Object.fromEntries(keys.filter(k => values?.[k] !== undefined).map(k => [k, values[k]?.value]));
/** Financial fields and private consultation notes never enter the educational engine. */
export function educationalIntake(record: any): NonNullable<EducationalSource['intake']> {
    const student = select(record.student_sections_json, EDUCATIONAL_STUDENT_KEYS), instructor = select(record.instructor_assessment_json, EDUCATIONAL_INSTRUCTOR_KEYS), keys = new Set([...Object.keys(student), ...Object.keys(instructor)]);
    const review=record.system_meta_json?.captureWorkflow==='canonical_review_v1'?record.system_meta_json.smart_review:undefined;
    const requirements=review?{requireAssessment:review.requireAssessment===true,requirePractical:review.requirePractical===true,requireChartDemonstration:review.requireChartDemonstration===true}:undefined;
    return { ...(requirements?{reviewRequirements:requirements}:{}),id: record.id, snapshotVersion: record.snapshot_version, formVersion: record.form_version, schemaVersion: record.schema_version, completedAt: record.completed_at ?? null, student, instructor, provenance: Object.fromEntries(Object.entries(record.provenance_json ?? {}).filter(([k]) => keys.has(k))) };
}
const overall = (legacy: string): Level => legacy === 'Advanced Assessment' ? 'ADVANCED' : legacy === 'Intermediate' ? 'INTERMEDIATE' : legacy === 'Developing Trader' ? 'DEVELOPING' : 'BEGINNER';
const practical = new Set<Domain>(['CHART_READING_MARKET_STRUCTURE', 'LIQUIDITY_CONCEPTS', 'ENTRY_EXECUTION', 'MULTI_TIMEFRAME_ANALYSIS', 'PSYCHOLOGY_DISCIPLINE', 'TRADING_SYSTEM_CONSISTENCY', 'RISK_MANAGEMENT']);
export function recommendLearningPath(source: EducationalSource): Recommendation {
    let scored: ReturnType<typeof scoreAssessment> | null = null;
    try {
        if (source.assessment?.version === 'v1') {
            validatePlacementAnswers(source.assessment.answers);
            scored = scoreAssessment(source.assessment.answers);
        }
    }
    catch { /* Incomplete/invalid is not scored as zero. */ }
    const domains = DOMAINS.map((domain): DomainProfile => {
        const qs = QUESTIONS.filter(q => QUESTION_DOMAINS[domain].includes(q.id)), evidence: Evidence[] = source.academy.filter(e => e.domain === domain), missing: string[] = [], conflicts: string[] = [];
        let knowledgeScore: number | null = null;
        if (scored && qs.length) {
            const earned = qs.filter(q => JSON.stringify([...source.assessment!.answers[q.id]].sort()) === JSON.stringify([...q.correct].sort())).length;
            knowledgeScore = Math.round(earned / qs.length * 100);
            evidence.unshift({ id: `assessment:${source.assessment!.id}:${domain}`, source: 'PLACEMENT_ASSESSMENT', domain, scope: 'CONCEPT', level: 'KNOWS_CONCEPT', reference: source.assessment!.id, recordedAt: source.assessment!.completedAt, summary: `${earned}/${qs.length} mapped knowledge/scenario answers correct. Does not demonstrate real trading behavior or chart skill.` });
        }
        else
            missing.push(qs.length ? 'No complete validated 35-question assessment.' : 'Existing assessment does not directly assess this domain.');
        if (source.intake && Object.keys(source.intake.instructor).length)
            evidence.push({ id: `consultation:${source.intake.id}:${domain}`, source: 'INSTRUCTOR_CONSULTATION', domain, scope: 'CONCEPT', level: 'SELF_REPORTED', reference: `${source.intake.id}:snapshot:${source.intake.snapshotVersion}`, summary: 'Educational consultation context is preserved for instructor interpretation; free text is not automatically scored.' });
        for(const context of source.legacyContext??[])evidence.push({id:`legacy:${context.reference}:${domain}`,source:'INTAKE_SELF_REPORT',domain,scope:'CONCEPT',level:'SELF_REPORTED',reference:context.reference,recordedAt:context.recordedAt??undefined,summary:`Historical recorded self-report (${context.label??context.key}): ${typeof context.value==='string'?context.value:JSON.stringify(context.value)}. Context only; not demonstrated mastery.`});
        const claims=source.intake?.student.knowledgeMatrix as Record<string,string>|undefined;
        const topics=(KNOWLEDGE_TOPICS[domain]??[]).filter(k=>typeof claims?.[k]==='string');
        if(source.intake&&topics.length)evidence.push({id:`intake:${source.intake.id}:${domain}`,source:'INTAKE_SELF_REPORT',domain,scope:'CONCEPT',level:'SELF_REPORTED',reference:`${source.intake.id}:snapshot:${source.intake.snapshotVersion}:knowledgeMatrix`,summary:topics.map(k=>`${k}: ${claims![k]}`).join('; ')});
        if(knowledgeScore!==null&&knowledgeScore>=70&&topics.some(k=>/not familiar|heard of it/i.test(claims![k])))conflicts.push('Strong assessment knowledge differs from self-reported foundational gaps; instructor should verify understanding.');
        const verified = evidence.find(e => !e.contextOnly && e.result !== 'NEEDS_REINFORCEMENT' && e.result !== 'CONTEXT' && e.scope === 'DOMAIN' && e.level === 'INSTRUCTOR_VERIFIED' && e.verifiedBy);
        const conceptVerified = evidence.find(e => !e.contextOnly && e.result !== 'NEEDS_REINFORCEMENT' && e.result !== 'CONTEXT' && e.scope === 'CONCEPT' && ['CAN_APPLY_CONCEPT', 'DEMONSTRATED_CONCEPT', 'INSTRUCTOR_VERIFIED'].includes(e.level));
        const limitedDomain = domain === 'TRADING_SYSTEM_CONSISTENCY';
        let competency: DomainProfile['competency'] = knowledgeScore === null || limitedDomain ? 'NOT_ASSESSED' : knowledgeScore < 50 ? 'NEEDS_FOUNDATION' : knowledgeScore < 70 ? 'DEVELOPING' : 'PROFICIENT';
        if (verified)
            competency = 'MASTERED';
        if (limitedDomain && !verified)
            missing.push('Longitudinal system adherence/consistency requires observed evidence; setup terminology is insufficient.');
        let practicalRequired = practical.has(domain) && !verified;
        const requested=source.intake?.reviewRequirements;
        if(requested?.requireAssessment)missing.push('Instructor requested assessment evidence; existing self-report is not a substitute.');
        if((requested?.requirePractical&&practical.has(domain))||(requested?.requireChartDemonstration&&domain==='CHART_READING_MARKET_STRUCTURE')){
            practicalRequired=true;missing.push('Instructor explicitly requested practical verification. Historical knowledge evidence is retained; no competency score was changed.');
        }
        if (practicalRequired)
            missing.push('Practical demonstration/instructor verification required; MCQ answers are knowledge evidence only.');
        if (conceptVerified && knowledgeScore !== null && knowledgeScore < 50)
            conflicts.push('Verified individual concepts and weak placement knowledge coexist; review scope rather than erase either source.');
        return { domain, competency, knowledgeScore, evidenceLevel: verified ? 'INSTRUCTOR_VERIFIED' : conceptVerified ? conceptVerified.level : scored && qs.length ? 'KNOWS_CONCEPT' : null, sufficiency: verified ? 'INSTRUCTOR_VERIFIED' : conceptVerified ? 'CONCEPT_VERIFIED' : scored && qs.length ? 'KNOWLEDGE_ONLY' : 'INSUFFICIENT_EVIDENCE', evidence, missing, conflicts, practicalRequired, reason: verified ? 'Documented instructor-verified domain demonstration.' : scored && qs.length ? 'Mapped assessment items support a knowledge recommendation; practical competency is assessed separately.' : 'Not assessed with sufficient domain evidence. Individual lesson concepts do not certify an entire domain.' };
    });
    const km = source.intake?.student.knowledgeMatrix as Record<string, string> | undefined;
    const lowClaim = km && typeof km === 'object' && Object.values(km).some(v => /not familiar|heard of it|beginner|little/i.test(String(v)));
    const level = scored ? overall(scored.recommendedLevel) : lowClaim ? 'BEGINNER' : null;
    const reason = scored ? `Existing assessment recommends ${level?.toLowerCase()} knowledge placement. Instructor confirmation and required core/practical verification remain mandatory.` : lowClaim ? 'Self-reported foundational gaps suggest beginning with foundations verification; no numeric assessment score has been invented.' : 'Insufficient educational evidence. Complete knowledge verification and instructor consultation before a level is assigned.';
    const decisions = source.curriculum.filter(c => c.available).sort((a, b) => a.order - b.order).map(c => ({ lessonId: c.id, action: (c.classification === 'REQUIRED_CORE' || c.id === 'hft-money-1' ? 'REQUIRE' : c.classification === 'REMEDIATION' ? 'REMEDIATE' : c.classification === 'OPTIONAL_ENRICHMENT' ? 'OPTIONAL' : 'RECOMMEND') as InstructorPath['decisions'][number]['action'], reason: c.classification === 'REQUIRED_CORE' || c.id === 'hft-money-1' ? 'Mandatory HFT core; placement never bypasses its mastery gates.' : 'Available curriculum proposed for instructor review; no automatic skip.' }));
    const focus = domains.filter(d => ['NEEDS_FOUNDATION', 'DEVELOPING', 'NOT_ASSESSED'].includes(d.competency) || d.practicalRequired).map(d => d.domain);
    return { engineVersion: LEARNING_ENGINE_VERSION, overall: level, overallStatus: level ? 'RECOMMENDED' : 'INSUFFICIENT_EVIDENCE', reason, domains, strengths: domains.filter(d => ['PROFICIENT', 'MASTERED'].includes(d.competency)).map(d => d.domain), focus, startingLessonId: decisions[0]?.lessonId ?? null, decisions, planned: focus.filter(domain => !source.curriculum.some(c => c.available && c.domains.includes(domain))).map(domain => ({ domain, title: `${domain.replaceAll('_', ' ')} — instruction / practical verification`, availability: 'PLANNED_NOT_YET_AVAILABLE' })), assessmentSummary: scored ? { overall: scored.overallScore, categories: scored.categoryScores, legacyLevel: scored.recommendedLevel, safeguard: scored.safeguardReason } : null, consultationContext: source.intake?.instructor ?? {} };
}
export function initialInstructor(rec: Recommendation): InstructorPath { return { overall: rec.overall, explanation: rec.reason, privateNotes: '', reason: '', startingLessonId: rec.startingLessonId, decisions: rec.decisions.map(d => ({ ...d })), overrides: [], demonstrations: rec.domains.filter(d => d.practicalRequired).map(d => ({ domain: d.domain, instruction: `Provide instructor-reviewed practical evidence for ${d.domain.replaceAll('_', ' ').toLowerCase()}. Future assignments remain planned until authored.` })) }; }
export function toStudentPath(source: EducationalSource, rec: Recommendation, inst: InstructorPath): StudentPath {
    const profiles = rec.domains.map(d => { const override = inst.overrides.find(o => o.domain === d.domain); return { domain: d.domain, competency: override?.competency ?? d.competency, evidenceLevel: override?.verification ? 'INSTRUCTOR_VERIFIED' as const : d.evidenceLevel, practicalRequired: override?.verification ? false : d.practicalRequired, reason: override ? 'Your instructor adjusted this domain after review. See your instructor guidance.' : d.competency === 'NOT_ASSESSED' ? 'More evidence is needed; this is not a judgment of your potential.' : d.practicalRequired ? 'Knowledge evidence informs your study focus; practical verification remains required.' : 'Your recorded knowledge/concept evidence informs this study focus.' }; });
    const start = source.curriculum.find(c => c.id === inst.startingLessonId);
    return { overall: inst.overall, explanation: inst.explanation, domains: profiles, strengths: profiles.filter(d => ['PROFICIENT', 'MASTERED'].includes(d.competency)).map(d => d.domain), focus: profiles.filter(d => ['NOT_ASSESSED', 'NEEDS_FOUNDATION', 'DEVELOPING'].includes(d.competency) || d.practicalRequired).map(d => d.domain), startingPoint: start ? { id: start.id, title: start.title } : null, items: inst.decisions.map(d => { const c = source.curriculum.find(c => c.id === d.lessonId)!; return { lessonId: d.lessonId, title: c?.title ?? 'Not yet available', classification: c?.classification ?? 'INSTRUCTOR_ASSIGNED', action: d.action, availability: c?.available ? 'AVAILABLE' : 'NOT_YET_AVAILABLE' }; }), planned: rec.planned, demonstrations: inst.demonstrations, limits: ['Placement is an educational recommendation, not live-trading approval.', 'Required HFT core and interactive mastery/homework gates remain mandatory.', 'Multiple-choice knowledge does not prove chart skill, disciplined behavior or trading consistency.', 'Planned curriculum/demonstrations do not create lessons or fake completion.'] };
}
