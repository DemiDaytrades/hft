# Stage 1 Authoring Implementation Plan

> **For agentic workers:** Use subagent-driven-development / dispatching-parallel-agents for disjoint subject authoring, parent integration and independent reviews. Do not pause between tasks.

**Goal:** Locally author Classes2–8 and make all eight Stage1 classes usable through existing Academy authorities.
**Architecture:** Add immutable private definitions and public subject experiences; generalize existing runtime/UI and explicitly whitelist student transport. Preserve existing data and Class1 definition; no production.
**Tech:** Existing Next16/React19/TypeScript/D1/node:test/native Chrome, no new dependencies.
**Spec:** docs/superpowers/specs/2026-11-08-stage-one-authoring-program-design.md (approved).

## Constraints / review focus
Local only; no Stage2+, production, messages/Stripe, Chart Lab or final-assessment engine. Preserve exact Class1 JSON and old/new completed records. Explicit assignment and prerequisites, entitlement/password/publication guards remain. No fixed ten-section or A–F assumption. Student output excludes private metadata; necessary owned enrollment/revision/resource aliases only. Every new class has substantive instruction, varied public practice, private60min guidance, guide/homework/remediation/evidence/reference coverage.

- Incompatible/historical enrollment must resolve exactly, not newest definition: version/enrollment ownership tests.
- Next class assignment cannot bypass prerequisite during a race: assignment transactional guard tests.
- Public aliases and field projection must not leak raw codes/versions/evidence/reviewer metadata: recursive payload/page tests.
- Written-only homework must review correctly and preserve returned attempts: real SQLite tests.
- New-class support must not change Class1 completion/hash or legacy data: baseline/source/data checks.

## Task1 — Independent subject authoring
Files `lib/academy/school/stage/{class-two,class-three,class-four,class-five,class-six,class-seven,class-eight}.ts`, corresponding `experience-*.ts`, bounded author tests. Shared additive type `stage/contracts.ts` defined before dispatch.
Interfaces: private `CLASS_TWO` etc conform StageClass; public `EXPERIENCE_TWO` etc conform StageExperience; no cross-import from public into private bank. Definitions own course shared, lesson ID unique, exact registry prerequisite.
- [x] Tests RED before authoring: section/objective/item/remediation coverage,60min live plan, meaningful distinct homework, sources, no future-stage content/assessment-bank clone.
- [x] Verify primary institutional references; write original subject-specific content and experiences (6/7/6/6/5/7/6 chapters respectively, with documented reason for deviations).
- [x] GREEN author tests; independent spec/content review of batches; fix important findings.

## Task2 — Registry/runtime and security transport
Files registry/service/teaching plus new student.ts projection/transport helpers; API/page adapters; tests.
- [x] RED tests for eight definitions, generic/idempotent installer, explicit prerequisite assignment and race guards, arbitrary class lengths, historical version/ownership, unchanged Class1 and strict student DTO aliases.
- [x] Generalize dispatch and lesson anchors; preserve existing JSON/history and policy. Add no migration unless a demonstrated gap requires additive persistence.
- [x] Student public DTO maps items/sections to aliases, resolves server-side owned enrollment and keeps private state internal. Instructor receives full authorized state; student routes/pages never serialize it.
- [x] GREEN service/privacy/Class1/Academy regressions.

## Task3 — Subject-specific experience / generic instructor and guide UI
Files stage components, SchoolPlayer/StudyGuide/InstructorSchool/admin pages/student roadmap; bounded practice reducer and UI tests.
- [x] RED tests for variable chapter counts, subject-specific ordering/calculation/decision feedback, safe status/labels, preview no-write, correct review wording.
- [x] Implement distinct timeline/map/basket/market/decision/price/FX visuals and native interactions; no general engine or drag-only UI. Preserve Class1 presentation with safe transport adapter, hide version/evidence/scoring internals.
- [x] Generic per-class assignment/inspection/review, human competency labels and advanced IDs; guides/homework not A–F clones. Generalize private scheduled curriculum guide/reflection only.
- [x] GREEN focused regression and TypeScript.

## Task4 — Browser, quality gates and final verification
- [x] Fresh whole-change review and required fixes with RED/GREEN.
- [x] Preserve existing isolated local fixtures; add separate synthetic learners only as needed, never reset Class1/legacy. Capture before/after hashes of original records.
- [x] Actual authenticated Chrome each new class: opening/visual/practice/instruction/check/progress/guide/homework/remediation; instructor guide/activities/rubrics/references/mappings. Representative393px and keyboard variants.
- [x] Full Stage1/foundation/Class1/security/homework/remediation tests, full suite, TypeScript, OpenNext, app dry-run; classroom dry-run if affected. No deployment.
- [x] Baseline-guard copy only scoped source/docs into dirty root; final29-part report/A–I and Classes2–4 drift comparison. Stop before Stage2.

Execution authorization: Demi approved implementation through full local verification. Use that authorization without another plan permission gate. Existing isolated workspace is retained; no unrelated commits or environment/data/config copies.

Completed locally: 111 focused / 633 full tests, TypeScript, OpenNext, both Worker dry-runs, authenticated new-class Chrome and representative 393px acceptance. See docs/releases/2026-11-08-stage-one-authoring-local-verification.md. No Stage 2 or production actions.
