# Controlled launch blockers implementation plan

Goal: make the existing controlled cohort operable through approved application workflows and prepare an auditable candidate; stop before production deployment or data changes.

Authority: user attachment d1909234-d465-4d87-9802-e697f5381c50. Preserve all existing work, approved Intake V2 contracts and question wording. No Lesson 2, provider sends, Stripe transactions, production writes or deployments.

Architecture: reuse existing staff-only Intake V2 endpoints, registries, completion validation, immutable snapshots and provenance. Add typed browser controls for currently uncovered contract shapes, explicit save/review/complete controls, authentic acknowledgment capture and links to existing downstream workspaces. Keep existing financial forms. Prepare a guarded idempotent approved Lesson1 installer. Freeze an isolated candidate without discarding deferred source work.

Approach: extending existing UI/API is the minimum path. A second questionnaire or operator JSON/import terminal is rejected because it duplicates approved contracts or fails browser operability. No new financial formulas/placement rules.

- [x] Add missing student shape controls and instructor form with contract coverage tests. Preserve unknown/saved values and draft immutability; do not infer answers.
- [x] Add acknowledgment registry display and staff capture audit; server validation preview, actionable errors and intentional completion; preserve source mode, revisions and conflict checks.
- [x] Verify full authenticated local synthetic browser workflow and downstream financial/path review; never edit real students.
- [x] Prepare/test Lesson1 installer without remote execution; no duplicate reference lesson or future content.
- [x] Prepare canonical production invitation URL locally and determine R2 dependencies.
- [x] Separate wider/mixed scope in isolated candidate, preserving current work. Diagnose test failure without unrelated feature changes.
- [x] Run focused/full tests, TypeScript and production-equivalent build on frozen candidate; review and report exact readiness. No deployment.

Review focus: partial saved composite values; missing acknowledgments; completed/revised sources; two-tab stale saves; student switching with unsaved edits; financial data excluded from educational placement. If any evidence cannot be completed, report NOT READY rather than approving an unverified candidate.

Final evidence: docs/releases/2026-11-07-controlled-launch-readiness.md. No production deployment or data mutation performed.
