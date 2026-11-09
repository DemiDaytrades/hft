# Master Curriculum foundation and Stage 1 Class 1

Status: proposed for design approval; no product implementation authorized by this document itself.

## Intent and boundaries

Implement the user's attached Master Curriculum Foundation + gold-standard What Is Money? specification locally. Deliver a permanent versioned school registry plus one substantive class, not a library of shallow lessons. Use the existing Next/OpenNext/D1 Academy, instructor inspection and Phase C teaching-context architecture and HFT styles. No production access/mutation, deployment, messages, Stripe, Phase D, Lesson 2 implementation, full Chart Lab or full stage assessment engine.

One class supports approximately 60 minutes of instructor-led teaching and 15–30 minutes of Academy review/practice. Learners need comfortable substantial reading, explanatory visuals, varied checks, reasoning, homework, targeted remediation and a permanent paraphrased study guide. Reading/attendance alone never awards competency.

## Approaches and proposed choice

1. Edit the current hft-interactive-v1 lesson in place: rejected because its attempts/events are content-version linked and completion currently depends on the installed version; editing it could invalidate or reinterpret progress.
2. Build a separate school application: rejected because it duplicates access, curriculum navigation, assignments, instructor review and progression authorities.
3. **Recommended: additive immutable registry and version-bound Class 1 runtime inside the existing Academy.** Preserve the old lesson/service contracts; use adapters and explicit version assignment, separate student projections and private authoring definitions. This follows the user's preservation and existing-architecture requirements. Implementation details below are recommendations, not previously approved product decisions.

## Existing code constraints

`lib/academy/curriculum/what-is-money.ts` currently defines a ten-step legacy lesson covering barter, money functions, currency and FX. `learning/contracts.ts` uses fixed concept/homework unions and v1 payloads. `learning/service.ts` scopes learning events and assessments by version but `student_lesson_progress` has one current row per user/lesson. The installer rejects overwriting differing curriculum. Existing scoring distinguishes instructor-graded written answers and separate mastery requirements; preserve that behavior for v1.

The private Phase C context currently derives outlines from the installed legacy definition; it has no curriculum-version binding or structured homework-reflection feed. The proposed registry must extend that boundary rather than import financial/intake data. Read relevant installed Next documentation before changing route/client/server boundaries.

## Registry

Add server-owned, validated curriculum contracts with stable IDs and immutable versions. A definition contains stage/module/class identity and ordering, prerequisites, publication state, duration estimates, objective IDs, term definitions, competency mappings, sections, visuals, examples, misconceptions, live activities, Academy activities, homework, remediation targets, assessment coverage, practical requirements, private instructor guide and public study guide. References include definition version; published definitions cannot be overwritten under the same version/hash.

Seed exactly ten approved stages and capstone. Stage 1 has the eight approved named classes, review and assessment blueprints. Classes 2–8 and later stages are blueprint-only: no invented teaching text, runnable lesson, completion gate or student answer bank. Mark blueprint state clearly and prevent attempts/false completion. Stage 1 competency domains use stable keys for money fundamentals, monetary system awareness, inflation/purchasing power, financial market purpose, investing/trading, basic price movement and FX purpose. Subcompetencies distinguish medium of exchange, unit of account and store of value.

## Persistence and compatibility

Use an additive local migration, expected next number0039 only after inspecting the actual migration inventory. Likely tables: immutable definition snapshots/hash, explicit learner class-version enrollment, version-bound section/activity responses, immutable evidence/attempt records, homework submission versions/reviews, targeted remediation assignments and class-completion snapshots. Reuse existing tables through adapters where their identity/version/history semantics fit; do not create duplicate scoring or access authorities. Final table names depend on implementation review.

Store the exact public content/guide revision or immutable resolvable snapshot for each enrollment. Existing enrolled learners remain on their legacy lesson version and retain all original attempts, scoring, reviews, homework, approved path and completion. No automatic reset, silent reassignment or conversion of old aggregate scores into new competencies. An instructor can explicitly assign the new class version under normal course entitlement rules; old evidence remains browsable separately. Installation is idempotent, local-only and fails on conflicting published hashes. No bulk migration of students.

## Gold-standard Class 1 content

Author ten substantial sections: world without money; barter mismatch; money as bridge; medium of exchange; unit of account; store of value; acceptance/trust and institutions; money beyond cash; economic circulation; integrated application/explanation/review. Each uses objective-linked teaching, relatable examples and misconception handling. Explain technical terms in plain language. Treat scarcity as context-dependent, bank deposits as a common modern form of money, and purchasing power as variable. Do not imply paper intrinsically determines value or government declaration alone explains acceptance.

Define original code-native accessible visuals in current dark/orange style: eggs/shoes mismatch, money bridge, exchange/measure/store, and work→wages→bank account→purchase→business→employee/supplier. Include text equivalents and reduced-motion support. No stock decoration, new brand or dependencies needed.

Mix MCQ, true/false with explanation, matching functions, scenarios, written explanations and economic-flow sequencing where useful. Match repeated function categories correctly: the current v1 matching validator enforces one-to-one targets, so use a new version-specific matching contract when several scenarios legitimately share a function. Never weaken legacy validation globally.

## Live guide

Private instructor guide follows approved 0–5/5–15/15–25/25–35/35–43/43–50/50–57/57–60 minute structure. Supply actual talking points, misconceptions, examples, visual references, open prompts, checks and closing recap; do not merely label time blocks. Live activity definitions map to section/objective/competency and existing Phase C poll/quiz/written contracts through explicit instructor launch. No automatic class launch, participant admission or permission changes. No activities silently count as approved Academy mastery.

## Study guide

An enduring version-linked student guide contains a fresh substantive summary, money/barter/exchange/unit/store/purchasing-power terms, connected big picture, core examples, misconceptions, five takeaways, observable outcomes and section-specific review links. Academy→Study Guides→Stage→Class lists authorized enrolled/completed versions; guides remain available after completion and cannot reveal other learners or unpublished/private banks. Guide access itself is not completion evidence.

## Homework, remediation and evidence

Parts A–F: approximately seven MCQs, function matching, carpenter/grocery application, $100-paper-value reasoning, three everyday function examples, and uncertainty reflection. Every item references section/objective/competency. Preserve full attempts and resubmission versions; instructor review/approval is authoritative for written/application tasks. Blank/length-only checks do not grade understanding.

Separate evidence categories: knowledge, reasoning, application, practical/chart, live, homework and formal assessment. Report category evidence independently, including review state and provenance (learner, activity, attempt, definition version, section/objective/competency, reviewer/time). No universal combined score replaces required evidence. Reuse existing objective-score policy where applicable; document new-class required items/rubrics explicitly and do not invent a school-wide mastery formula.

Track content reviewed, checks, written review, homework review, optional/applicable instructor/live evidence, class completion and competency evidence separately. Required written reasoning and homework need instructor approval; required concept checks must be satisfied. Reflection surfaces uncertainty, not automatic failure. Viewing, attendance or one correct MCQ never proves mastery. Stage assessment remains separate. If a class has required practical evidence, strong knowledge cannot substitute for it; Class 1 has no chart requirement.

Weaknesses create version-bound review links and fresh reinforcement examples for the relevant section, notably exchange4/unit5/store6. Do not force full-class repetition or alter an approved learning path. Remediation preserves failed attempts and instructor decisions. Show unreviewed/reviewed/returned/approved accurately. The QA fixture must deliberately demonstrate remediation and revised homework, not only a perfect-score path.

## Instructor and student integration

Extend existing Instructor Academy inspection/Preview as Student to expose the complete new class, private timed guide, objectives/terms, activities, homework/rubrics, competencies, remediation and guide. Preview is isolated from real progress. Extend the Phase C private teaching context to surface that student's latest authorized unresolved reflection from the related class/competency for the next relevant lesson, with version/date/provenance; do not show it to other students or pull financial data.

Student navigation uses current Academy layout and access guards. Sections support readable paragraphs, visuals and interactions; display resume state and evidence/review status. Study guide/homework/remediation are discoverable, with keyboard/touch access. No answer keys/rubrics/private notes are imported into client bundles, server-component serialization or student API responses. Enforce published assignment, course entitlement, forced-password change, lifecycle and cross-student ownership server-side on every read/write. Preserve v1 routes/security and approved learning-path behavior.

## Future-only contracts

Chart activity declarations support horizontal/trend lines, rectangles/zones, rays, arrows, labels/text, erase/undo/reset; serialize drawing objects/state with chart/timeframe/instrument context, revision, submission history, instructor annotation/review/return/approval and competency mapping. No chart editor, price feed, uploads or real trading implementation.

Stage 1 assessment blueprint covers MCQ/matching/scenarios/written reasoning across approved domains, no chart requirement; include the U.S. company/yen supplier integrated scenario as private blueprint context. No runnable engine, publication or student answer keys.

## Verification and delivery

Create an isolated local candidate based on the currently released source, preserving unrelated work. Use local/test fixtures and accounts only; no production credentials/providers. Test registry/reference validation and immutable version hashes; stage/class order/prerequisites/objectives; mappings; public/private projection and client imports; attempts/review/resume/completion; separated evidence and practical requirements; homework history/reflection; section remediation; guide access; cross-student/lifecycle/Academy/path regressions; Phase C private-context regression; and local migration preservation/idempotence.

Run focused curriculum/Academy tests, full suite, TypeScript, OpenNext and main/control Worker dry-runs. Actual authenticated Chrome must cover student Academy→Stage1→Class1, substantial reading and visuals, MCQ/matching/scenario/written, save/refresh/logout-login resume, guide, homework submission/review/return/resubmit, targeted remediation, instructor inspection/preview and private teaching context. Repeat relevant reading, activity, guide and homework flows at393px. Preserve source/artifact evidence and report failures honestly.

Final report follows all29 requested items and explicit A–F answers; F remainsNO. Recommend authoring Class2 only after Class1 approval and verification. No production artifact installation or deployment.

## Approved registry seed labels

Stages in order: (1) Money & Financial Market Foundations; (2) Forex Foundations; (3) Charts & Price Action Foundations; (4) Market Structure; (5) Liquidity & Market Behavior; (6) Technical Analysis & Confluence; (7) Risk & Capital Protection; (8) Trade Planning & Execution; (9) Psychology & Discipline; (10) Building Your Trading System; (capstone) Prove You Can Trade the Process.

Stage1 class order: (1) What Is Money?; (2) How Money Evolved; (3) Banks, Central Banks & the Money System; (4) Inflation, Purchasing Power & Interest Rates; (5) Why Financial Markets Exist; (6) Investing vs Trading vs Gambling; (7) What Makes Prices Move?; (8) Welcome to the Foreign Exchange Market; followed by Stage1 review, assessment and targeted remediation as needed. Class2–8 content remains blueprint-only.

The learning loop is Learn It → See It → Check It → Apply It → Explain It → Show It → Review It → Practice It → Prove It. Apply this where educationally relevant rather than forcing identical widgets into every section.

The timed instructor guide uses:0–5 engagement (what happens if everyone rejects dollars tomorrow?);5–15 what money is and its three functions;15–25 eggs/shoes barter mismatch;25–35 value through acceptance/trust/institutions/usefulness and qualified scarcity;35–43 work/wages/account/purchase/business circulation;43–50 varied comprehension activities;50–57 explain the concept without saying “money”;57–60 recap and Class2 preview without authoring Class2.

Content factual verification should use primary educational central-bank/economic sources for claims about modern money and purchasing power; cite authoring references privately/instructor provenance where helpful. No AI grading or personalized financial advice is introduced. Automated scoring is deterministic against private versioned answer definitions; qualitative review remains instructor-authored.

## Builder-check decisions for approval

A separate builder review identified three places needing explicit policy. Proposed decisions:

1. **Progression:** the new curriculum enrollment is an explicit additional assignment and does not modify the legacy course's prerequisite graph, existing completion flags or approved path. No learner is required to complete both versions merely because both exist. New-registry prerequisites refer to new-registry completion only; old Academy gates continue using old Academy evidence. Future instructor-approved equivalence/transfer is not implemented in this phase. Make this distinction clear in instructor assignment/inspection so nobody mistakes a new class assignment for migrated credit.
2. **New Class1 completion:** retain the existing80% reviewed knowledge-assessment threshold, plus separately approved critical-concept evidence, required instructional activities and approved substantive homework. The critical criteria are barter mismatch/accepted intermediary; distinguishing exchange/unit/store; explaining acceptance/usefulness beyond paper material; recognizing money beyond cash. Each criterion has an explicit instructor rubric and cannot be satisfied by the aggregate80% score alone. Required explain/application work must be individually reviewed; homework must have all required parts and instructor approval. Uncertainty reflection requires a meaningful submission but expressing uncertainty is not graded incorrect. Before completion, retain the existing latest-attempt review semantics and remediation/retake gates; after a completion is awarded, store an immutable completion/evidence snapshot. Later optional practice does not silently revoke an approved completion. Legacy rules remain unchanged. No new school-wide numerical mastery formula is introduced.
3. **Reflection context:** do not introduce an unsolicited “resolved/unresolved” workflow. Surface the latest submitted homework reflection for the relevant explicitly assigned class/version in that student's private instructor context, labeled with submission/review state and date; retain earlier submissions. Relevance means the current class or an explicit registry prerequisite of that class, not an inferred placement or financial condition. A later submission becomes the latest display without erasing history. Blueprint-only/unassigned future classes do not create sessions or student obligations. Students never receive another student's reflection or private instructor annotations.
