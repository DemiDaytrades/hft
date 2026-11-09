# Interactive Lesson 1 implementation plan

Goal: Implement “What Is Money?” as versioned curriculum and a reusable, server-gated interactive lesson, preserving Phase 1 access boundaries.

Scope is the user's approved Lesson 1 request. No deployment, production changes, messaging, Stripe activity, Intake V2 changes, financial plans, or Lesson 2 content.

Architecture: reuse course/module/lesson rows, student_lesson_progress, academy_quiz/student_quiz_attempt, academy_assignment/student_assignment_submission and assignment_submission_history. Add immutable interaction events and versioned mixed-assessment fields locally. Human instructors grade written answers and required mastery; no keyword-based grading. Completion requires content/interactions, >=80%, independent mastery and approved version-linked homework. Legacy completion and assessment APIs must not bypass the new gates.

- [x] Define versioned curriculum/data contracts and author all ten lesson steps, approved first-attempt questions, alternate retake questions, remediation and homework.
- [x] Add additive migration, repeat-safe local-only seed command, and isolated SQLite integration tests.
- [x] Implement server state, interaction events, assessment drafts/attempts, objective scoring, instructor review, adaptive homework/revisions, and completion gates.
- [x] Implement responsive step/interaction/assessment/homework/progress UI and instructor review page using existing auth.
- [x] Integrate lesson routing, completion/next-lesson checks and generic API bypass protection.
- [x] Run focused tests, full suite and no-emit TypeScript; review boundaries and document local installation/manual verification/future upload requirements.

Review focus: 80% without mastery; self approval; stale homework/old content version; client-supplied score; duplicate submission/retake; revision history; legacy completion bypass; unpublished/unassigned access; answer/private rubric leakage. Preserve manual assignments and existing legacy lesson rendering.

Implementation stays in the current checkout because Phase 1 and substantial prior work are uncommitted. No resets, commits, or worktree migration.

## Resume verification ledger — 2026-11-07

Resumed the existing working tree without reset, commit, checkout migration, or removal of prior work. The authored curriculum, learning service, UI, seed and migration 0027 were already present.

- Fixed completed reveal-step acknowledgement after refresh: regression failed with “Open each concept” then passed after making persisted acknowledgement idempotent.
- Connected the existing review queue to the interactive instructor workspace; retained legacy review destinations.
- Fixed new UI JSON response types identified by TypeScript.
- Independent final review identified private answer/rubric leakage through legacy attempt history and an old draft blocking a new curriculum version. Both regression tests failed first and passed after fixes.
- Added migration 0028 to scope open attempts by content version while retaining old drafts. No production or persistent local migration was applied during resume.
- Added coverage for cross-student attempts, foreign/invalid question answers, unpublished and unassigned access, content-version gates, legacy assessment bypasses, all homework branches and true/false mastery.
- Ruling: preserve existing uncommitted checkout — explicit user instruction and existing plan; no worktree/reset/commit.
- Ruling: written assessment and homework use human review — no automatic keyword grading or weakened mastery gate.
- Ruling: keep the unrelated availability test failure outside scope and report it — changing bookings would expand the authorized lesson work.

Final verification evidence and remaining manual checks are recorded in docs/academy-lesson-one-report.md.
