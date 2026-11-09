# Personalized Student Placement & Learning Path — local implementation report

Scope: controlled local implementation, 7 November 2026. No deployment, provider calls, persistent student-data changes or production migrations. Existing uncommitted work was preserved. Migration tests use disposable, in-memory SQLite databases with foreign keys enabled. Test network calls are forbidden.

## 1. Existing systems reused

Approved Intake V2 completed snapshots/provenance; the unchanged 35-question placement bank/scoring safeguards; instructor consultation; Academy courses/modules/lessons and existing course assignments; lesson quiz/homework/mastery evidence; Lesson 1 gates; membership entitlements; fresh lifecycle/role/password authorization. The Financial / Trading Readiness system remains independently versioned and unchanged.

## 2. Files created/modified in this phase

Created:

- `lib/learning-path/contracts.ts`, `engine.ts`, `source.ts`, `service.ts`, `access.ts`
- `lib/learning-path/engine.test.ts`, `service.test.ts`
- `lib/placement-assessment.test.ts`
- `migrations/0032_personalized_learning_path.sql`
- `app/api/learning-path/route.ts`, `app/api/admin/learning-path/route.ts`
- `app/(app)/learning-path/page.tsx`, `app/(app)/admin/learning-path/page.tsx`
- `components/learning-path/Review.tsx`
- `docs/superpowers/plans/2026-11-07-personalized-learning-path.md`
- This report.

Modified existing working files:

- `lib/placement-assessment.ts`: strict answer validation; bank wording and scoring preserved.
- `lib/placement-assessment-storage.ts`: awaited writes, owner/open-attempt checks, question snapshots, public projection.
- `app/(app)/assessment/actions.ts`, `page.tsx`, `AssessmentClient.tsx`: explicit student-safe question/attempt DTOs; remove client answer-key import; server-side submission validation.
- `lib/academy/index.ts`: explicit approved placement-eligible skips in earlier-lesson prerequisites.
- `app/(app)/admin/academy/lessons/[lessonId]/page.tsx`: curriculum classification/domain authoring.
- `app/(app)/academy/page.tsx`: prefer approved educational placement and link to learning path; legacy manual placement remains fallback.
- `app/(app)/layout.tsx`: student and instructor learning-path navigation.

These are scoped changes within a substantially pre-existing dirty tree; other uncommitted work is not attributed to this phase.

## 3. Migration created

`0032_personalized_learning_path.sql` is additive: placement question snapshots and completed-attempt immutability; lesson classification/domain metadata; independent learning-path series, versions, decisions, enrollment links and audit events. Approved source/recommendation/content and audit/assignment history are protected by triggers. No existing users, progress or curriculum are deleted or rewritten.

## 4. Architecture

```text
Completed Intake V2 educational allowlist + provenance
                  + completed owner-scoped placement assessment
                  + Academy concept/mastery evidence
                  + actual published curriculum inventory
                                    |
                        deterministic educational engine
                                    |
                      immutable source/recommendation snapshot
                                    |
                     DRAFT → instructor edit/reason/verification
                                    |
                       atomic APPROVE and course assignments
                         /                         \
             current approved pointer       retained prior versions/events
                         |
              own student-safe learning-path DTO
```

Approval and version changes use optimistic revisions. A random per-approval token conditions every statement in one D1 transaction; failure rolls back assignments, decisions, status and current pointer together. Concurrent duplicate approval has one winner. Generating a draft never assigns a course or alters the current approved path.

## 5. Overall placement model

BEGINNER, DEVELOPING, INTERMEDIATE, ADVANCED, or null/INSUFFICIENT_EVIDENCE. Reuses the existing weighted assessment, bands and safeguards. Existing Brand New and Beginner labels map to BEGINNER; Developing Trader to DEVELOPING; Advanced Assessment to ADVANCED. Overall is a knowledge summary, never practical clearance. Explicit low knowledge-matrix self-report can suggest BEGINNER without inventing a numeric score.

Existing category weights: Forex 30%, Risk 25%, Execution 20%, Psychology 15%, Analysis 10%. Existing bands end at 29/49/69/84/100. Intermediate safeguard requires overall 70 and risk 65; Advanced requires overall 85, risk 75, execution 75 and analysis 70. Existing scorer remains the authority for these checks.

## 6. Domain competency model

Nine domains: Forex Foundations; Market Mechanics; Risk Management; Chart Reading / Market Structure; Liquidity Concepts; Entry & Execution; Multi-Timeframe Analysis; Psychology & Discipline; Trading System / Consistency.

Statuses: NOT_ASSESSED, NEEDS_FOUNDATION, DEVELOPING, PROFICIENT, MASTERED. For covered domains, mapped knowledge correctness is below 50 → NEEDS_FOUNDATION, below 70 → DEVELOPING, otherwise PROFICIENT. These educational domain thresholds reuse existing score-band boundaries; they are explicit rules, not a validated psychometric instrument. Instructor review remains required. MASTERED requires recorded whole-domain instructor practical verification, not an MCQ percentage. Individual Lesson 1 completion cannot certify a whole domain.

## 7. Evidence and provenance

Source IDs, immutable completed consultation version, form/schema versions, educational field provenance, exact assessment answers/version, curriculum metadata/version and Academy evidence are captured and SHA-256 digested. Evidence includes source, domain, concept/domain scope, level, reference, optional time/verified actor and explanation. Profiles preserve missing information, conflicts, practical requirements and evidence sufficiency. Instructor modifications have actor/time and old/new content in immutable events; original system recommendations are retained.

## 8. 35-question integration and limitations

All original 35 questions retained. Mapping:

| Domain | Existing question IDs |
|---|---|
| Forex Foundations | fx1, fx7, fx9 |
| Market Mechanics | fx2, fx3, fx8, ex1, ex2, ex3, ex4, ex6 |
| Risk Management | rk1–rk8, ex7 |
| Chart Reading / Market Structure | fx4, fx5, fx6, fx10, an1 |
| Liquidity Concepts | None directly |
| Entry & Execution | ex1, ex2, ex4, ex5, ex6, an2–an5 |
| Multi-Timeframe Analysis | None directly |
| Psychology & Discipline | ps1–ps5 |
| Trading System / Consistency | an2, an4, ps1, ps5 — partial theory only |

Questions can support more than one domain. Liquidity and multi-timeframe remain NOT_ASSESSED. Trading System / Consistency remains NOT_ASSESSED without domain verification, even when its partial knowledge score is high. Assessment cannot prove chart markup, live execution, disciplined risk behavior or consistency. Incomplete/invalid/unsupported-version answers are not scored as zero. A changed question snapshot is excluded pending an explicit versioned mapping.

Two actual boundary defects were addressed: the client previously imported the answer-bearing bank, and persistence writes were not awaited/strictly validated. Student question props now exclude answer keys/explanations. Completed attempts are immutable and owner-scoped.

## 9. Instructor assessment integration

Only educational consultation fields are projected: assessed experience/knowledge, strengths/weaknesses, behavioral/schedule/learning observations, recommended level/track/modules/first lesson, homework/practice/coaching and immediate actions. Raw educational context is visible only to instructors. Knowledge-matrix claims map to concept evidence and can surface disagreement with knowledge results. Free text is not automatically converted into competency scores; instructors interpret it through documented overrides, remediation and demonstrations. Private notes and financial concerns stay out of the educational source projection.

## 10. Required-core behavior

All existing lessons default conservatively to REQUIRED_CORE; Lesson 1 is hard-floored as core regardless of metadata. No automatic skips from any score. Only PLACEMENT_ELIGIBLE lessons can receive justified instructor SKIP decisions. An approved skip never creates completed progress. Current publication/classification/catalog timestamp/lifecycle are rechecked when using a skip. Required-core and interactive mastery/homework gates remain mandatory.

## 11. Personalized path generation

Produces ordered real curriculum decisions, knowledge/domain profile, strengths, focus, starting point, core, remediation classifications and practical tasks. Missing domain curriculum is explicitly PLANNED_NOT_YET_AVAILABLE. No fake lessons are created. The available real catalog constrains how much personalization can be assigned today. With only Lesson 1 seeded, the practical result is required Lesson 1 plus planned future domain work.

## 12. Instructor workflow

Open `/admin/learning-path?studentId=<local-student-id>`. Generate from latest evidence; inspect original recommendation/source; accept or edit overall level, safe explanation, private notes, review reason, start, individual lesson actions, full-module requirement, domain overrides and practical instructions. Save before approval; changed content disables approval until saved. MASTERED requires an observed-date/reference/explicit whole-domain demonstration statement. Choosing a non-mastered status clears that verification.

Catalog prerequisite order is retained. Later starts require prior completion or explicit eligible skips; approval rejects locked starts. Approval records actor/time/reason. Reassessment creates a new draft; older approved versions stay current until replacement approval. History is read-only.

## 13. Academy assignment integration

Approval reuses existing `student_course_assignment`. It creates at most one new active course assignment per course if none exists, reuses existing manual assignments, and stores exact version-to-enrollment links. No existing manual assignments are removed. Lesson decisions are separate from coarse course enrollment; they do not grant access to unpublished or foreign resources. Existing assigned-course content remains governed by Academy gates. This is not a revocation mechanism for pre-existing enrollments.

## 14. Version/history behavior

Separate series per student, monotonically numbered recommendations, idempotent source-based generation and explicit reassessment keys. Source and original recommendation are immutable. Approved instructor/student content is frozen; previous approved version becomes SUPERSEDED when the new one becomes current. New evidence does not silently change approved plans. Existing legacy mutable placement is preserved, with the new approved path preferred in the Academy header. Historical overrides remain visible; a new recommendation must be reviewed rather than silently inheriting prior instructor decisions.

## 15–16. Continuous learning and future live classes

Current source adapters include graded quiz/knowledge checks, instructor-approved homework and revalidated interactive mastery, scoped to authored lesson domains. Contracts support CHECKPOINT, INSTRUCTOR_VERIFICATION, LIVE_CLASS_POP_QUIZ, LIVE_CLASS_WRITTEN_RESPONSE and LIVE_CLASS_CHART_CHALLENGE. Dedicated checkpoint ingestion and live-class capture UI are not implemented; no fake classroom, chart engine or practical demonstrations were built. Reassessment is instructor-requested and never automatically bypasses instructor-gated work.

## 17. Student experience

`/learning-path` shows only the signed-in entitled student's current approved safe DTO: placement, positive explanation, strengths, focus, domain status, practical verification, available learning sequence, approved acceleration and planned work. Before approval it shows an appropriate review-pending state. No source answers, private notes, raw conflicts, internal domain scores, financial inputs or foreign student IDs are returned. Own-plan API ignores client-supplied student/version query parameters and uses the session identity.

## 18. Instructor experience

Protected navigation and workspace provide original recommendation, category results, per-domain evidence/sufficiency/missing information/conflicts, educational consultation snapshot, current recorded mastery evidence, editable path, saved student preview and version/change history. Lesson editor provides validated classification and domain metadata. Financial readiness can be reviewed in the existing separate financial workspace; its status is not duplicated into this engine.

## 19. Financial separation

Income, debt, credit, savings, reserves, monthly goals, capital, financial pressure and paid/complimentary membership are not educational scoring inputs. The source selector excludes financial registries and private financial concerns. Regression tests show identical educational domain recommendations under hardship, high income/debt differences and paid-versus-complimentary metadata. Existing Financial Readiness code/contracts/versioning are unchanged.

## 20. Lifecycle/security

Fresh database role/ban/password state is checked for instructors; a forged session role cannot authorize self-approval. Fresh student lifecycle is checked before generation/edit/approval and in the approval SQL. Former students retain records but cannot receive approval or student access. Reactivation does not generate a new placement and still requires valid entitlement. Student access uses fresh membership/lifecycle/password checks. Staff can read former history. Immutable events/history and no destructive endpoints protect provenance.

## 21–24. Verification

Focused: `node --require ./scripts/test-register.cjs --test lib/learning-path/*.test.ts lib/placement-assessment.test.ts` — **9 passed, 0 failed**. These cover beginner/exposed/developing/intermediate/advanced, strong analysis/weak risk, weak psychology, experienced knowledge with financial/result metadata excluded, insufficient evidence, no MCQ practical mastery, concept scope, core protection, own-plan privacy, instructor authority, overrides, assignments, failed transaction rollback, versions, former students, stale/concurrent approval and changed-catalog acceleration.

Full regression: `npm test` — **249 tests; 248 passed, 1 failed**. Includes Academy security, Lesson 1/mastery, financial plans, Intake V2 and lifecycle suites. Sole failure is the unchanged known `lib/availability.test.ts` “overlaps detects intersecting slots”: `RangeError: Invalid time value` in `lib/availability.ts` (`HH:MM` input passed through ISO-date arithmetic). No availability code/tests modified and no tests weakened.

TypeScript: `node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false` — **PASS (exit 0)**. No deployment/build claim is made.

Independent read-only review identified inaccessible later starts and retained verification on status change. Both were corrected; later-start rejection has a regression assertion. Follow-up review confirmed the corrections and found no remaining important blockers in the reviewed scope.

## 25. Migration/application status

Migration 0032 created, **not applied to persistent local or production databases**. All migration execution in this phase was inside disposable in-memory test databases. Before any future authorized deployment: back up and test the ordered migration chain on an isolated copy; apply code and schema together; verify D1 transaction behavior; review existing active assignments and curriculum classifications. No automatic enrollment backfill or historical-plan synthesis. Existing lessons become core by default; instructor deliberately classifies eligible content and maps domains. Existing incomplete legacy assessment rows may coexist, while new managed attempts are constrained. Completed legacy snapshots without question JSON use the unchanged v1 bank; changing that bank requires an explicit version/mapping.

## 26. Manual local/browser acceptance procedure — not executed

Use an isolated local D1 development environment with outbound email/SMS/Stripe disabled and no production credentials. Do not run the following against production or existing student data without separate authorization.

1. Apply migration chain to that disposable local database; install the existing Lesson 1 seed via the documented local seed command. Create local-only admin and two student fixtures with known passwords and valid paid/complimentary entitlements. Existing in-memory tests already exercise these conditions without provider calls.
2. Student A completes the unchanged 35-question assessment. Verify resume/save, closed-attempt immutability, full answer validation and absence of answer keys in browser responses/bundle props.
3. Instructor generates A's path. Review original/source/domain evidence and planned items. Before approval, confirm no new Academy assignment and no student draft visibility.
4. Save a student-safe explanation/review reason, weak-risk remediation/demonstration and optional domain override. Try to skip Lesson 1 and assert rejection. Try MASTERED without practical verification and assert rejection. Confirm saved preview excludes private notes.
5. Approve; confirm exactly one active course enrollment and correct safe student view after refresh/login. Core interactive activities, reviewed mastery and approved homework still gate completion.
6. In a test-only authored eligible lesson, justify a skip. Confirm it permits later canonical navigation after core prerequisites, never marks completion, and stops applying if the curriculum changes or is unpublished. Locked later starts must be rejected on approval.
7. Student B adds `studentId=A` to own-plan API query: only B's own approved plan/null may return. Students cannot use admin approval endpoints. Verify banned/forced-password-change access denial.
8. Complete a new assessment, request reassessment and inspect version history. Old approved path remains visible until replacement approval. Verify original source/recommendation/overrides/events/enrollment links remain available to instructor.
9. Deactivate A using the existing local lifecycle controls. Approval/access must fail while historical staff review remains available. Reactivate: entitlement is still required, and no automatic new recommendation appears.
10. Compare equivalent educational answers for local paid/complimentary accounts and alternate financial inputs: domain outcomes must match. Review existing separate financial plan without educational scoring changes.

## 27. Remaining limitations

- Browser/visual acceptance and a persistent local Cloudflare runtime smoke test have not been performed; automated tests use in-memory SQLite plus mocked sessions/bindings.
- Only actually authored/published curriculum can be assigned; no Lesson 2 or missing domain content was invented.
- Prerequisite order remains canonical; acceleration is explicit eligible skipping, not arbitrary reordering or core bypass.
- Educational thresholds/question mapping require instructor acceptance before controlled use; knowledge and practical skill remain deliberately distinct.
- Practical verification is an instructor attestation with a reference, not an automated chart/live-trading evaluator. Instructor-entered student-facing text must be reviewed for appropriate disclosure.
- Consultation free text is reviewed by instructors, never treated as an automatic objective score.
- No automatic source-change notifications or background approved-path updates. Reassess explicitly; historical instructor overrides require review on the next draft.
- Course assignments remain coarse and existing manual enrollments are preserved; this phase does not implement lesson-only revocation.
- Checkpoint/live-class evidence has contracts for extension, but no dedicated ingestion UI in this phase.

## 28. Controlled-use readiness / prerequisites

Ready for **controlled local instructor acceptance**, with automated placement/security checks passing; not a claim of production readiness. Before a real-student trial, complete the isolated-browser procedure, validate migration chain/atomic D1 approval on staging, confirm real published catalog/classifications and entitlement/configuration, and have Demi approve the educational mapping and public guidance. Track the known availability defect separately if bookings are part of that trial. No deployment, real-student account changes, live payment or message delivery occurred.
