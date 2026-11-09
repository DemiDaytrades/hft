export const DOMAINS = ['FOREX_FOUNDATIONS', 'MARKET_MECHANICS', 'RISK_MANAGEMENT', 'CHART_READING_MARKET_STRUCTURE', 'LIQUIDITY_CONCEPTS', 'ENTRY_EXECUTION', 'MULTI_TIMEFRAME_ANALYSIS', 'PSYCHOLOGY_DISCIPLINE', 'TRADING_SYSTEM_CONSISTENCY'] as const;
export type Domain = typeof DOMAINS[number];
export const LEVELS = ['BEGINNER', 'DEVELOPING', 'INTERMEDIATE', 'ADVANCED'] as const;
export type Level = typeof LEVELS[number];
export const COMPETENCIES = ['NOT_ASSESSED', 'NEEDS_FOUNDATION', 'DEVELOPING', 'PROFICIENT', 'MASTERED'] as const;
export type Competency = typeof COMPETENCIES[number];
export const CLASSIFICATIONS = ['REQUIRED_CORE', 'PLACEMENT_ELIGIBLE', 'REMEDIATION', 'OPTIONAL_ENRICHMENT', 'INSTRUCTOR_ASSIGNED'] as const;
export type Classification = typeof CLASSIFICATIONS[number];
export type EvidenceSource = 'INTAKE_SELF_REPORT' | 'INSTRUCTOR_CONSULTATION' | 'PLACEMENT_ASSESSMENT' | 'LESSON_KNOWLEDGE_CHECK' | 'HOMEWORK' | 'CHECKPOINT' | 'INSTRUCTOR_VERIFICATION' | 'LIVE_CLASS_POP_QUIZ' | 'LIVE_CLASS_WRITTEN_RESPONSE' | 'LIVE_CLASS_CHART_CHALLENGE' | 'LIVE_CLASS_POLL' | 'INSTRUCTOR_OBSERVATION';
export type Evidence = {
    id: string;
    source: EvidenceSource;
    domain: Domain;
    scope: 'CONCEPT' | 'DOMAIN';
    level: 'SELF_REPORTED' | 'KNOWS_CONCEPT' | 'CAN_APPLY_CONCEPT' | 'DEMONSTRATED_CONCEPT' | 'INSTRUCTOR_VERIFIED';
    reference: string;
    summary: string;
    recordedAt?: string;
    verifiedBy?: string;
    contextOnly?: boolean;
    result?: 'POSITIVE' | 'NEEDS_REINFORCEMENT' | 'CONTEXT';
    provenance?: Record<string, unknown>;
};
export type DomainProfile = {
    domain: Domain;
    competency: Competency;
    knowledgeScore: number | null;
    evidenceLevel: Evidence['level'] | null;
    sufficiency: 'INSUFFICIENT_EVIDENCE' | 'KNOWLEDGE_ONLY' | 'CONCEPT_VERIFIED' | 'INSTRUCTOR_VERIFIED';
    evidence: Evidence[];
    missing: string[];
    conflicts: string[];
    practicalRequired: boolean;
    reason: string;
};
export type CurriculumItem = {
    id: string;
    title: string;
    courseId: string;
    moduleId: string;
    classification: Classification;
    domains: Domain[];
    order: number;
    available: boolean;
    catalogUpdatedAt?: string;
    contentVersion?: string | null;
};
export type Decision = {
    lessonId: string;
    action: 'REQUIRE' | 'RECOMMEND' | 'REMEDIATE' | 'SKIP' | 'OPTIONAL';
    reason: string;
};
export type DomainOverride = {
    domain: Domain;
    competency: Competency;
    reason: string;
    verification?: {
        reference: string;
        observedAt: string;
        statement: string;
        scope: 'DOMAIN';
        demonstrated: true;
    };
};
export type InstructorPath = {
    overall: Level | null;
    explanation: string;
    privateNotes: string;
    reason: string;
    startingLessonId: string | null;
    decisions: Decision[];
    overrides: DomainOverride[];
    demonstrations: {
        domain: Domain;
        instruction: string;
    }[];
};
export type EducationalSource = {
    legacyContext?: {key:string;label?:string;value:unknown;reference:string;recordedAt:string|null}[];
    intake: {
        id: string;
        snapshotVersion: number;
        formVersion: string;
        schemaVersion: string;
        completedAt: string | null;
        reviewRequirements?: {requireAssessment:boolean;requirePractical:boolean;requireChartDemonstration:boolean};
        student: Record<string, unknown>;
        instructor: Record<string, unknown>;
        provenance: Record<string, unknown>;
    } | null;
    assessment: {
        id: string;
        version: string;
        completedAt: string;
        answers: Record<string, string[]>;
    } | null;
    academy: Evidence[];
    curriculum: CurriculumItem[];
};
export type Recommendation = {
    engineVersion: string;
    overall: Level | null;
    overallStatus: 'RECOMMENDED' | 'INSUFFICIENT_EVIDENCE';
    reason: string;
    domains: DomainProfile[];
    strengths: Domain[];
    focus: Domain[];
    startingLessonId: string | null;
    decisions: Decision[];
    planned: {
        domain: Domain;
        title: string;
        availability: 'PLANNED_NOT_YET_AVAILABLE';
    }[];
    assessmentSummary: {
        overall: number;
        categories: Record<string, number>;
        legacyLevel: string;
        safeguard: string | null;
    } | null;
    consultationContext: Record<string, unknown>;
};
export type StudentPath = {
    overall: Level | null;
    explanation: string;
    domains: {
        domain: Domain;
        competency: Competency;
        evidenceLevel: Evidence['level'] | null;
        practicalRequired: boolean;
        reason: string;
    }[];
    strengths: Domain[];
    focus: Domain[];
    startingPoint: {
        id: string;
        title: string;
    } | null;
    items: {
        lessonId: string;
        title: string;
        classification: Classification;
        action: Decision['action'];
        availability: 'AVAILABLE' | 'NOT_YET_AVAILABLE';
    }[];
    planned: Recommendation['planned'];
    demonstrations: InstructorPath['demonstrations'];
    limits: string[];
};
export type LearningPathVersion = {
    id: string;
    studentId: string;
    seriesId: string;
    version: number;
    revision: number;
    status: 'DRAFT' | 'APPROVED' | 'SUPERSEDED';
    source: EducationalSource;
    sourceDigest: string;
    recommendation: Recommendation;
    instructor: InstructorPath;
    studentPreview: StudentPath;
    createdAt: string;
    createdBy: string;
    approvedAt: string | null;
    approvedBy: string | null;
};
