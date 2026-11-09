# Master Curriculum and Class 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Implement the approved versioned Academy foundation and substantive What Is Money? locally, preserving legacy progress.
**Architecture:** Immutable server-owned definitions, explicitly assigned version-bound learner runtime, existing Academy authorization and instructor review; additive persistence, shared curriculum projections, existing navigation/styles.
**Tech Stack:** Existing Next16/React19/OpenNext/D1, TypeScript, node:test/SQLite, native Chrome QA.
**Spec:** docs/superpowers/specs/2026-11-08-master-curriculum-class-one-design.md (user approved).

## Global Constraints

Local only. No production access/mutation/deployment, real students, messages, Stripe, Phase D, full Chart Lab/assessment engine, or authored Class2+. Preserve v1 files/data/contracts/gates. Immutable completed evidence; instructor-reviewed reasoning/homework;80% knowledge plus independent critical criteria. Remediation never changes approved path. Existing HFT styling. Isolate from unrelated dirty checkout.

## Review Focus

- Legacy completion must not be reinterpreted as new-version credit: version enrollment and independent completion tests.
- Repeated matching targets must work without weakening v1 validation: new-contract matching tests.
- Private keys/rubrics/notes must not enter student payload/bundle: projection and UI dependency tests.
- Retry/stale review must not overwrite newer state or approved completion: transactional revision and history tests.
- Lifecycle/password/access revocation must fail every read/write, including guides/reflections: service ownership/entitlement tests.

### Task1: Registry and substantive content
**Files:** create `lib/academy/school/{contracts,registry,class-one,policy}.ts`, tests; original SVG-style code visuals in UI later.
**Interfaces:** `CLASS_ONE`, `CURRICULUM`, `validateCurriculum`, `publicClass`, `gradeObjective`; stable stage/class/version/section/objective/competency/item IDs, private correct/rubric fields excluded publicly.
- [x] Write failing registry/content/projection/contract tests, run RED.
- [x] Implement ten-stage+capstone, Stage1 eight blueprints/review/assessment; Class1 ten complete sections,60-minute live guide, original visual declarations, study guide, A–F homework, fresh remediation and practical contract.
- [x] Verify references/order/prerequisites/evidence types/projection/content and run GREEN.

### Task2: Additive versioned runtime
**Files:** create migration0039 after checking inventory; `lib/academy/school/{service,service.test,fixture.test-utils}.ts`.
**Interfaces:** `schoolState(db,userId,classId)`, `schoolCommand(db,userId,input)`, `schoolReview(db,actorId,input)`, `assignClass(db,actorId,studentId,classId)`; explicit enrollment/definition version, append-only evidence/submissions and immutable completion.
- [x] Write failing real SQLite service tests for assignment/immutability/access/attempts/homework/review/completion/remediation/reflection.
- [x] Implement additive schema/local installer; reuse `requireLessonAccess` and instructor role, no modifications to legacy progress/path tables. Atomic state revisions and idempotency.
- [x] Test failed knowledge→targeted remediation→fresh practice→retake, written review/returned homework/resubmit/approval, immutable completion and cross-student denial. Verify legacy data unchanged.

### Task3: Academy/instructor UI integration
**Files:** create school player/guide/review components and routes under existing Academy/admin; modify existing home/instructor navigation through additive links; `app/api/academy/school/route.ts`, `app/api/admin/academy/school/route.ts`.
**Interfaces:** server-projected student class/state to client player; same-origin authenticated commands; instructor page reads private class/review records, preview doesn't write.
- [x] Write failing route/projection/render tests.
- [x] Implement substantive ten-section learning flow, code-native visuals, MCQ/matching/scenario/written and review/evidence status, permanent guide index/detail, A–F homework and section-linked remediation.
- [x] Implement instructor inspection/preview/explicit assignment/review using existing layout and protected routes. Test keyboard/read-only preview/privacy.

### Task4: Teaching context reflection integration
**Files:** `lib/classroom/teaching/context.ts` and tests, existing TeachingTools private panel.
**Interfaces:** authorized private `schoolTeachingContext(db,studentId,lessonId)` only for assigned class/version and explicit prerequisite. Latest reflection with review/date/version/provenance; no financial/intake data.
- [x] Write failing authorized/context isolation test.
- [x] Add instructor-only guide and reflection adapter, no classroom admission/media changes.
- [x] Run PhaseC/context/security regressions and verify student projection excludes it.

### Task5: Local fixtures and authenticated Chrome
**Files:** local-only seed script/runtime config outside release source; review guide docs.
- [x] Seed local synthetic instructor/student, published assigned course/new class, preserve legacy fixture records.
- [x] Actual desktop Chrome: Academy→Stage1→Class1→reading/visuals/checks/written/resume→guide→homework→instructor return/review→resubmit→remediation→completion.
- [x] Actual393px Chrome: reading, interactions, guide/homework and resume; instructor inspection/preview/private guide/objectives/competencies/remediation/reflection.

### Task6: Final verification/report
- [x] Focused curriculum+Academy/lifecycle/path/teaching affected regressions; full suite; TypeScript before OpenNext; OpenNext and both Worker dry-runs (no deploy).
- [x] Fresh independent whole-change review; fix important findings with RED→GREEN tests; rerun necessary checks.
- [x] Record changed-file inventory/migration safety/legacy preservation/browser evidence and requested29-item report with A–F (F=NO). Stop locally.

Execution: user explicitly approved implementation through full verification; proceed inline without an additional plan approval gate. No commits of unrelated checkout or production configuration. Track tasks/results in local ledger and source inventory.
