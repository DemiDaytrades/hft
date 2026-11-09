# Master Curriculum + Stage 1 Class 1 — local implementation verification

Scope: approved design and implementation plan, local only. No production access, deployment, migrations, messages, transactions or real-student changes occurred. Only Class 1 is authored. Verification used an isolated copy of the released booking-window baseline at `/private/tmp/hft-master-curriculum-local`; scoped files were subsequently copied into the working repository after baseline hash checks.

1. **Architecture:** immutable server-owned definitions, explicit version-bound enrollment, independent class events/submissions/drafts/completion, existing course assignment/publication/member/lifecycle guards. Student projections exclude answer keys, private rubrics and instructor guides. Teaching context is instructor-only.
2. **Files changed:** 39 source/test files listed below, plus design/plan and this report. Root production Wrangler configuration, secrets, legacy lesson definitions and unrelated checkout work were preserved.
3. **Migration:** additive `0039_master_curriculum.sql`; local only. Adds definition, enrollment, operation, event, submission, completion, draft and teaching-link persistence with immutability constraints. Local pre-0039 rehearsal preserved all 88 pre-existing tables and synthetic rows; zero FK violations. No production-data rehearsal or release authorization is implied.
4. **Versioning:** curriculum `hft-school.1.0.0`; Class 1 `money-foundations.1.0.0`. Assigned definition snapshots are hash-verified and immutable; submitted answers and completed evidence cannot be rewritten. Explicit teaching-session edition pins prevent silently changing live-session source versions.
5. **Stage registry:** ten approved stages plus capstone, stable IDs/order. Stages 2+ remain registry blueprints.
6. **Stage 1 blueprint:** eight ordered classes: What Is Money?; How Money Evolved; Banks, Central Banks & the Money System; Inflation, Purchasing Power & Interest Rates; Why Financial Markets Exist; Investing vs Trading vs Gambling; What Makes Prices Move?; Welcome to the Foreign Exchange Market. Only the first is authored/runnable. Prerequisites, review timing, domains and stage-assessment blueprint are explicit.
7. **Teaching guide:** eight timed blocks totaling 60 minutes, instructor talking points, mapped poll/quiz/written activities and recap. Existing classroom tools are reused; inspection does not start a live class.
8. **Instruction:** 2,167 instructional words across ten sections: world without money, barter, exchange bridge, medium of exchange, unit of account, store of value, acceptance, money beyond cash, economic flow, and applied review. Includes explanations, examples, misconceptions and section checks; approximately 25 minutes of independent review.
9. **Visual assets:** five original accessible code-native diagrams (barter, exchange bridge, money functions, circulation, account/price comparison); no external image dependencies.
10. **Interactions:** section MCQ/scenario checks, matching with repeated targets, 11-item knowledge/reasoning assessment, saved drafts, individual written review, separate evidence/history and explicit final milestone. Objective grading is deterministic; written reasoning requires instructor review. No AI grading.
11. **Study Guide:** separately authored summary, big picture, terms, five takeaways, objectives, examples, misconceptions and section-linked review. Version-pinned and available after completion while Academy entitlement remains active. Reading it never awards credit.
12. **Homework:** 12 items across A–F: seven objective questions, four-row matching, carpenter/groceries application, $100 reasoning, three everyday examples, meaningful uncertainty/reflection. Saved drafts, submitted/awaiting-review, returned, revised and approved states preserve each attempt. Homework is tied to the exact assessment attempt. Honest uncertainty is not marked as a misconception.
13. **Remediation:** failed/misunderstood competencies map to their teaching sections and fresh reinforcement questions; reviewed high-scoring reasoning can still require targeted practice. Fresh practice precedes retake; history remains intact and the approved learning path is unchanged.
14. **Evidence:** knowledge, reasoning, application, homework, practical and formal-stage evidence remain distinct. Class completion requires all section checks, at least 80% objective knowledge, instructor-approved critical reasoning and approved substantive homework. No practical/chart or formal-stage evidence is fabricated. Completion stores an immutable evidence snapshot.
15. **Competencies:** seven Stage 1 domains and seven mapped Class 1 subcompetencies with stable IDs, objectives, section/item mapping and evidence requirements. Educational placement is not derived from financial data.
16. **Future Chart Lab:** contract specifies tool/drawing objects, instrument/timeframe/coordinates, immutable submission revisions and instructor annotation/approval/return history. No drawing editor, chart runtime or practical mastery engine is implemented.
17. **Stage assessment:** blueprint only: MCQ, matching, scenario and written reasoning; USD/JPY cross-border equipment scenario; no chart requirement for Stage 1. No full stage-assessment engine or certificate.
18. **Instructor:** protected Academy inspection, explicit assignment, objectives/competencies, timed guide, activities, private homework keys/rubrics, remediation, Study Guide and non-writing preview. Individual assessment/homework review preserves feedback/history. Existing classroom private panel can explicitly bind the edition and show latest submitted reflection with version/status/date/source.
19. **Student:** Academy home/roadmap/class, substantive reading/visuals, saved checks and drafts, assessment, targeted practice/retake, homework revision, evidence/history, completion and permanent guide. New course anchor uses existing course-assignment authority plus new class enrollment; blueprints cannot earn credit.
20. **Mobile:** actual authenticated Chrome responsive 393×852. Reading, diagram, large response choices, written fields, draft/save, homework submission/revision, completion and Study Guide verified. No clipped diagram/text was observed. Native iOS/Android hardware was not tested.
21. **Legacy compatibility:** old Lesson 1 fixture remains 100% complete and byte-for-byte progress preservation is tested; it does not automatically grant new Class 1 credit. New explicit course/module/lesson anchor avoids inserting requirements into the legacy linear course graph. Legacy completion API rejects new school-reference format; redirects remain behind access checks.
22. **Focused tests:** 24 curriculum tests passed, 0 failed. Includes registry/content/version/privacy, real SQLite state/history/review/remediation/access, routing, rendering, navigation and teaching integration. Independent review findings received RED→GREEN regressions for transactional assignment freshness, stable form navigation and pinned live sourceVersion.
23. **Full suite:** 589 passed, 0 failed, 0 skipped. Existing Academy, lifecycle, learning path, scheduling and classroom tests included. Baseline was 565 tests.
24. **TypeScript:** `npx tsc --noEmit` passed before OpenNext.
25. **OpenNext:** `npx opennextjs-cloudflare build` passed. Initial sandbox loopback EPERM was resolved by rerunning the local build with socket permission, without source changes. Existing custom static Cache-Control warning and dependency duplicate-method bundling warnings remain documented.
26. **Worker dry-runs:** main application and classroom control Worker dry-runs passed. These were packaging checks only; neither Worker was deployed. Root production configuration was unchanged.
27. **Chrome acceptance:** normal local Better Auth student and instructor sign-ins; Academy/roadmap; all ten section checks; matching; 11-answer draft save/reload; intentional 86% attempt with returned reasoning; mapped store-of-value practice; 100% retake; individual instructor approval; 12-item homework draft, return for insufficient examples, revision and approval; explicit mobile completion; permanent guide; completed reading return. Instructor objectives, timed guide, homework/remediation, read-only preview and pinned classroom private guide/reflection verified. Fresh cache-disabled client shows no hydration errors; stale cached dev assets caused earlier mismatched attributes. Local classroom has no media credentials and was not started; no provider/media retest was necessary for this curriculum adapter.
28. **Limitations:** remaining classes/stages, full stage assessment, practical/chart engine and Phase D are intentionally unimplemented. New versions need authored definitions and explicit version-enrollment policy; there is no bulk legacy-credit conversion or instructor content editor. Historical reflection resolution is not a new workflow. Production migration/rehearsal/deployment and real-student pilot acceptance require separate authorization. Development static caching can retain stale client code; use cache-disabled DevTools for local QA.
29. **Recommended next curriculum step:** review Class 1 pedagogy, then separately authorize authoring Stage 1 Class 2 against these contracts. Do not author other classes or deploy this candidate automatically.

## Explicit answers

- A. Master Curriculum foundation implemented locally: **YES**.
- B. Class 1 complete against the approved gold-standard scope: **YES**.
- C. Substantive instruction rather than shallow cards: **YES**.
- D. Study Guide / homework / remediation working: **YES**, with automated and authenticated local Chrome evidence.
- E. Architecture ready for authoring the remaining Stage 1 classes: **YES**, through immutable new definitions and explicit assignments; those classes are not authored yet.
- F. Any production deployment authorized: **NO**.

## Local review

Server: `http://localhost:3013` in isolated workspace. Student: `/academy/school`, Class 1 `/academy/school/stage-1-class-1`, guides `/academy/study-guides`; instructor: `/admin/academy/school` (expand Preview as student). Disposable synthetic account details are stored only in the isolated `.env.school-qa.local`; do not use production credentials here.

## Changed source/test files

- `lib/academy/school/navigation.test.ts`
- `lib/academy/school/class-one.ts`
- `lib/academy/school/navigation.ts`
- `lib/academy/school/reference.ts`
- `lib/academy/school/service.test.ts`
- `lib/academy/school/contracts.ts`
- `lib/academy/school/routes.test.ts`
- `lib/academy/school/ui.test.tsx`
- `lib/academy/school/policy.ts`
- `lib/academy/school/registry.test.ts`
- `lib/academy/school/registry.ts`
- `lib/academy/school/integration.test.ts`
- `lib/academy/school/service.ts`
- `lib/academy/school/teaching.ts`
- `lib/academy/school/teaching.test.ts`
- `components/academy/school/QuestionFields.tsx`
- `components/academy/school/StudyGuide.tsx`
- `components/academy/school/InstructorSchool.tsx`
- `components/academy/school/SchoolPlayer.tsx`
- `components/academy/school/school.css`
- `components/academy/school/ClassVisual.tsx`
- `app/(app)/academy/school/page.tsx`
- `app/(app)/academy/school/[classId]/page.tsx`
- `app/(app)/academy/study-guides/page.tsx`
- `app/(app)/academy/study-guides/[classId]/page.tsx`
- `app/(app)/admin/academy/school/page.tsx`
- `app/api/academy/school/route.ts`
- `app/api/admin/academy/school/route.ts`
- `migrations/0039_master_curriculum.sql`
- `scripts/seed-school-local.cjs`
- `lib/academy/index.ts`
- `app/(app)/academy/page.tsx`
- `app/(app)/academy/course/[courseId]/page.tsx`
- `app/(app)/academy/lesson/[lessonId]/page.tsx`
- `app/(app)/admin/academy/page.tsx`
- `app/(app)/admin/academy/inspect/[lessonId]/page.tsx`
- `app/(app)/admin/academy/preview/[lessonId]/page.tsx`
- `lib/classroom/teaching/context.ts`
- `components/classroom/teaching/TeachingTools.tsx`
