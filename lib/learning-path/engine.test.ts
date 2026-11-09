import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../placement-assessment';
import { recommendLearningPath, educationalIntake, toStudentPath, initialInstructor } from './engine';
import { DOMAINS, type EducationalSource } from './contracts';
const answers = (missCategories: string[] = []) => Object.fromEntries(QUESTIONS.map(q => [q.id, missCategories.includes(q.category) ? [q.choices.find(c => !q.correct.includes(c))!] : q.correct]));
const source = (miss: string[] = []): EducationalSource => ({ intake: null, assessment: { id: 'a', version: 'v1', completedAt: '2026-11-07', answers: answers(miss) }, academy: [], curriculum: [{ id: 'hft-money-1', title: 'What Is Money?', courseId: 'core', moduleId: 'stage1', classification: 'REQUIRED_CORE', domains: ['FOREX_FOUNDATIONS'], order: 0, available: true }] });
test('true/exposed beginners, developing, intermediate and advanced theory recommendations reuse existing scoring', () => {
    const cases: [
        string[],
        string
    ][] = [[['forex', 'risk', 'execution', 'psychology', 'analysis'], 'BEGINNER'], [['risk'], 'DEVELOPING'], [['psychology', 'analysis'], 'INTERMEDIATE'], [[], 'ADVANCED']];
    for (const [miss, expected] of cases) {
        const r = recommendLearningPath(source(miss));
        assert.equal(r.overall, expected);
        assert.equal(r.domains.length, 9);
        assert.ok(!r.domains.some(d => d.competency === 'MASTERED'));
    }
    const absent = source();
    absent.assessment = null;
    assert.equal(recommendLearningPath(absent).overall, null);
    assert.ok(recommendLearningPath(absent).domains.every(d => d.knowledgeScore === null));
    absent.intake = { id: 'i', snapshotVersion: 1, formVersion: 'v1', schemaVersion: 'v1', completedAt: null, student: { marketsExperience: ['None yet'], knowledgeMatrix: { stop_loss: 'Not familiar' } }, instructor: {}, provenance: {} };
    assert.equal(recommendLearningPath(absent).overall, 'BEGINNER');
    absent.intake.student = { marketsExperience: ['Forex'], knowledgeMatrix: { stop_loss: 'Heard of it' } };
    assert.equal(recommendLearningPath(absent).overall, 'BEGINNER');
});
test('experienced unprofitable, strong analysis weak risk, weak psychology, MCQ-only limits and planned curriculum', () => {
    const risk = recommendLearningPath(source(['risk']));
    assert.equal(risk.overall, 'DEVELOPING');
    assert.equal(risk.domains.find(d => d.domain === 'RISK_MANAGEMENT')!.competency, 'NEEDS_FOUNDATION');
    assert.equal(risk.domains.find(d => d.domain === 'CHART_READING_MARKET_STRUCTURE')!.competency, 'PROFICIENT');
    const psychology = recommendLearningPath(source(['psychology']));
    assert.ok(psychology.focus.includes('PSYCHOLOGY_DISCIPLINE'));
    const r = recommendLearningPath(source());
    assert.equal(r.domains.find(d => d.domain === 'MULTI_TIMEFRAME_ANALYSIS')!.competency, 'NOT_ASSESSED');
    assert.equal(r.domains.find(d => d.domain === 'LIQUIDITY_CONCEPTS')!.competency, 'NOT_ASSESSED');
    assert.ok(r.domains.find(d => d.domain === 'CHART_READING_MARKET_STRUCTURE')!.practicalRequired);
    assert.ok(r.planned.some(p => p.domain === 'RISK_MANAGEMENT'));
    assert.equal(r.decisions[0].action, 'REQUIRE');
});
test('financial hardship, income, debt, membership type and private notes cannot influence educational competency', () => {
    const baseline = source();
    const base = recommendLearningPath(baseline);
    for (const financial of [{ monthlyTakeHomeRange: { value: 'Under $1,000' }, totalDebtRange: { value: '$50,000+' }, pressureToMakeMoneyQuickly: { value: 'High urgency' }, membershipType: 'complimentary' }, { monthlyTakeHomeRange: { value: '$10,000+' }, debtStatusTypes: { value: { hasDebt: 'No' } }, membershipType: 'paid' }]) {
        const projection = educationalIntake({ id: 'i', snapshot_version: 1, form_version: 'f', schema_version: 's', student_sections_json: { ...financial }, instructor_assessment_json: { instructorPrivateNotes: { value: 'PRIVATE_SENTINEL' }, financialRiskConcerns: { value: 'PRIVATE_FINANCE' } }, provenance_json: { monthlyTakeHomeRange: { source: 'student_reported' } } } as any);
        assert.equal(Object.keys(projection.student).length, 0);
        assert.ok(!JSON.stringify(projection).includes('PRIVATE_FINANCE'));
        assert.deepEqual(recommendLearningPath({ ...baseline, intake: projection }).domains, base.domains);
    }
    const dto = toStudentPath(baseline, base, { ...initialInstructor(base), privateNotes: 'PRIVATE_SENTINEL', reason: 'PRIVATE_REASON' });
    assert.ok(!JSON.stringify(dto).includes('PRIVATE'));
    assert.ok(!JSON.stringify(dto).includes('knowledgeScore'));
});
test('one verified Lesson1 concept does not certify an entire domain; unknown answers never score zero', () => {
    const s = source();
    s.assessment = null;
    s.academy = [{ id: 'lesson1', source: 'LESSON_KNOWLEDGE_CHECK', domain: 'FOREX_FOUNDATIONS', scope: 'CONCEPT', level: 'INSTRUCTOR_VERIFIED', reference: 'lesson1', summary: 'Money concepts', verifiedBy: 'staff' }];
    const r = recommendLearningPath(s);
    assert.notEqual(r.domains[0].competency, 'MASTERED');
    assert.equal(r.domains[0].knowledgeScore, null);
    const incomplete = source();
    incomplete.assessment!.answers = {};
    const result = recommendLearningPath(incomplete);
    assert.equal(result.assessmentSummary, null);
    assert.equal(result.overall, null);
    assert.equal(DOMAINS.length, 9);
});
