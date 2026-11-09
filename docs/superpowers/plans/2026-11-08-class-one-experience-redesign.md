# Class 1 Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkboxes.

**Goal:** Redesign the ten Class 1 sections around experience-first participation while preserving approved academic content and durable progress.
**Architecture:** Public version-scoped presentation scenes plus pure exploration reducer; existing player commands/evidence remain unchanged. Separate public roadmap projection from instructor registry.
**Tech Stack:** Existing Next16/React19/TypeScript/CSS, node:test and actual Chrome.
**Spec:** docs/superpowers/specs/2026-11-08-class-one-experience-redesign-design.md (approved).

## Global Constraints
Local only. No production/deployment/messages/Stripe/real students. Academic definition/hash, service/schema/contracts, homework/review/history/remediation and legacy progress unchanged. No Class2+ authoring. New exploration ungraded, React memory only, usable after completion. No new dependencies. Preserve HFT dark/orange/accessibility/reduced motion. Use isolated existing curriculum workspace and guard root copy by baseline hashes.

## Review Focus
- Editing an answer after a prior result must not falsely imply it was checked: test result invalidation and retry.
- Section switching must retain exploratory state without changing evidence: reducer test keyed by section; existing service preservation regressions.
- Missing/wrong academic version must not use incompatible scenes: adapter test fallback.
- Student labels must not expose blueprint metadata or make unassigned content playable: projection and rendered roadmap tests.
- Public scene imports must not expose private keys/rubrics or duplicate assessment items: public render and boundary tests.

### Task1: Presentation contract, authored scenes and interaction policy
Files: create `lib/academy/school/presentation.ts`, `presentation.test.ts`.
Interfaces: `classPresentation(doc)` returns exact-version scenes or null; `explore(state,event)` returns keyed transient state; `practiceResult(scene,answers)` explanatory outcome; `checkFeedback(sectionId,passed)` public educational feedback.
- [x] Write failing tests: ten ordered mapped scenes/version fallback, failed/correct/retry/matching repeated categories, changed-answer invalidation, section isolation, unchanged source hash and academic contracts.
- [x] Run RED with node scripts/test.cjs lib/academy/school/presentation.test.ts.
- [x] Implement public original scenarios/copy, varied visuals and pure interactions. No private imports.
- [x] Run GREEN and foundation regression.

### Task2: Student experience/visual components and safe roadmap
Files: create `components/academy/school/SectionExperience.tsx`, `ExperienceVisual.tsx`, `SchoolRoadmap.tsx`; modify SchoolPlayer, school.css, StudyGuide; create `lib/academy/school/roadmap.ts`, `experience-ui.test.tsx`, `roadmap.test.ts`; modify student school page.
Interfaces: SectionExperience receives public section/scene, transient exploration state and dispatch; existing checks passed as children. SchoolRoadmap receives public projection only; status uses actual assigned/started/completed state.
- [x] Write RED rendered behavior tests: experience before explanation; labeled controls/select alternative/feedback; student status metadata separation; original prose available; 393px structural invariants and reduced motion.
- [x] Implement scenes/visuals with original code-native assets, progressive disclosure, stateful predict/reveal/retry and matching; tailor existing check feedback without client grading; preserve all durable forms.
- [x] Implement journey navigation and student-safe School labels; improve guide visual review without changing content.
- [x] Run GREEN, focused foundation/security tests and TypeScript.

### Task3: Whole-change review, actual browser acceptance and final verification
Files: docs/academy/class-authoring-standard.md, docs/releases/2026-11-08-class-one-experience-redesign-local-verification.md and scoped inventory.
- [x] Fresh independent code review; fix important findings with failing/passing regressions.
- [x] Verify existing local synthetic/legacy records unchanged; normal authenticated Chrome desktop all ten scenes, wrong/correct/retry, matching, full explanations, durable checks, guide/homework/remediation/history and private metadata/preview. Preserve completed fixture; use new local-only student only if needed.
- [x] Verify 393px reading/visuals/touch controls and desktop keyboard. No provider/production calls.
- [x] Final full suite, TypeScript before OpenNext, OpenNext and main Worker dry-run. Control dry-run only if shared code affected.
- [x] Copy only scoped verified source into root with baseline hash guard; no config/env/DB/output/dependencies. Report21 items plus A–E honestly. Stop locally.

Execution ruling: user explicitly approved local implementation through full acceptance; continue inline under existing authorization without a second plan permission gate. Native copy workspace retained due dirty root/restricted git; no unrelated commits.
Pre-flight: Task1 presentation types/reducer feed Task2; Task2 remains client/public only, Task3 uses same source snapshot. No conflicting interfaces.
