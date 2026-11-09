# Lesson 1 — student-experience visual redesign

Local implementation, 7 November 2026. This phase changes presentation only; no deployment, migrations, authored curriculum changes, or student lesson/progress writes.

## Student experience

- Ten original steps appear as a journey with Discover / Connect / Demonstrate chapter labels, numbered checkpoints, current position, saved-step segments and unchanged locks.
- Barter and international-payment scenarios have illustrated stages. Currency symbols visualize the concept without disclosing the matching pairs. Existing authored diagrams become connected visual routes; all teaching paragraphs, reveals, questions and instructions remain available.
- Multiple-choice questions use large native radio response tiles with selected states, keyboard focus and generous touch targets. Selection still does not grade an answer; the existing Check response action does.
- Existing success/retry feedback is presented with a concise status panel and brief checkmark/entrance motion. Reduced-motion preferences disable the effects. No sounds, confetti, XP, streaks or new scoring.
- Concept growth reads existing explored/reviewed/demonstrated evidence. A numeric score alone is not painted as mastery. The completion milestone appears only for the existing Completed state.
- Homework has a distinct brief, existing assignment title/instructions/status, readable numbered prompts, writing workspace, character count, submission action and retained feedback/history. No new homework requirements, autosave claims or grading rules. The existing enable/disable conditions are preserved.
- Completion has an earned milestone seal, actual saved steps/score, approved-mastery/homework presentation and the existing next-lesson availability check. No Lesson 2 content or new access is created.

## Files

Presentation: `components/academy/learning/InteractiveLessonPlayer.tsx`, `QuestionInput.tsx`, new `LessonVisuals.tsx`, new `lesson-experience.css`.

Tests: new `lib/academy/learning/visual-presentation.test.tsx`; `scripts/test-register.cjs` adds the standard no-op CSS loader for server-rendered markup tests. Styles are compiled by Next.js and checked in the actual browser, not executed as JavaScript in Node tests.

The stylesheet is imported by the lesson player and scoped to its visual classes. A mobile-only selector also contains the existing application navigation on lesson pages; links and authorization are unchanged. No styling dependencies or bitmap assets were added.

## Preservation checks

All 19 unique protected domain/API files captured before this phase retain identical SHA-256 hashes: lesson contracts, authored curriculum, grading/progression services/policy and Academy APIs. Client action handlers, payloads, existing readiness/step-unlock conditions, instructor/simulation authorization boundaries and read-only protections were preserved. Existing student DTOs still strip answer keys and rubrics. Safe local step/reveal inspection remains possible in read-only instructor viewing; mutation controls remain disabled.

## Verification

- Focused Academy/security/mastery/instructor/learning-path/lifecycle/presentation checks: **51 passed, 0 failed**.
- Full suite: **263 tests; 262 passed, 1 unchanged known failure**: `lib/availability.test.ts`, “overlaps detects intersecting slots”, `RangeError: Invalid time value`. Availability files/tests were not changed.
- TypeScript: `node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false` — **passed, exit 0**.
- Fresh independent read-only review: no important actionable findings. Reviewed grading/lock preservation, actual mastery evidence, disabled state/preview safety, native radio accessibility and scenario disclosure.
- Actual local Next.js server and authenticated Chrome: preview renders; large tile selection and existing Check response feedback work in browser-only simulation; homework and completion scenarios render. Desktop and 390px responsive emulation were visually inspected. No real lesson attempts/homework/completions were submitted.
- An existing regular browser window initially retained an older development stylesheet; a fresh authenticated window confirmed the current compiled design. Reload before evaluating the redesign. Physical touch-device testing and a full screen-reader audit were not performed.

## View locally

Open `http://localhost:3000/admin/academy/preview/hft-money-1` with the existing local QA instructor. Use Start from beginning for the journey; use the clearly labeled existing simulation scenarios to inspect reviewed homework, remediation and the completion milestone without modifying records. The same redesigned player is used for the actual authorized student lesson at `/academy/lesson/hft-money-1`; its normal assignment, entitlement and progression gates still apply.
