# Personalized placement and learning path plan

Spec: /Users/demi/.codex/attachments/0c449bcc-c7fc-4c3c-885d-53f68c4239c4/Pasted text.txt (authorized detailed design). Local implementation only; preserve checkout/prior work. No provider calls, deployment, production/persistent student data changes, new curriculum, or approved intake-contract edits.

Architecture: strict educational input allowlist; existing 35-question weights/bands/safeguards; nine explicit domains; theoretical knowledge versus observed/instructor-verified domain evidence. Independent versioned learning-path series/source snapshots/recommendations/instructor modifications/current approved DTO. Approval atomically creates existing course assignments and lesson decisions, preserving core/progress/mastery. Defaults all existing lessons to REQUIRED_CORE; only explicit justified instructor skips on PLACEMENT_ELIGIBLE rows affect sequencing, never fabricate completion. Missing curriculum remains planned. Lifecycle/entitlement authorization stays mandatory.

- [x] Fix actual assessment boundary defects without changing bank wording: remove answer-key client import, await/validate/own-scope writes, preserve completed attempts and question snapshots. Regression tests.
- [x] Typed domain/evidence/curriculum contracts and deterministic educational-only recommendation engine; map all 35 questions and approved educational intake/consultation fields, no financial input. Scenario/separation/no-practical-from-MCQ tests.
- [x] Add minimal classification/version/decision/event migration; source snapshots/digests, CAS editing, instructor overrides/verification, approval transaction/current pointer/assignments, lifecycle and privacy tests.
- [x] Integrate justified placement-eligible skips with existing Academy gates; core remains mandatory, no completion forgery. Classified curriculum metadata authoring and planned items.
- [x] Instructor persisted recommendation/editor/preview/history and student approved path; keep legacy placement compatibility without unapproved assignment changes.
- [x] Focused/regression/full suite/TypeScript, independent final review, report/manual acceptance/prerequisites.

Calls: reuse existing overall score thresholds, map existing Brand New + Beginner to BEGINNER, Developing Trader to DEVELOPING, Advanced Assessment to ADVANCED recommendation (not practical clearance). Domain theory uses existing band boundaries: <50 NEEDS_FOUNDATION, <70 DEVELOPING, >=70 PROFICIENT. MASTERED requires documented instructor-verified domain demonstration, never a score. Single Lesson1 evidence is concept-scoped, not entire-domain mastery. Liquidity/MTF have no direct existing assessment questions. Financial/paid-vs-comp fields excluded by construction and invariance tests.

Review focus: MCQ exposure/score tampering, mandatory core/skips, stale approvals/catalog edits/lifecycle, raw private/financial fields, exact source and overrides preserved, existing/manual assignments preserved, unpublished/nonexistent content, source history stable under new evidence.

Verification: focused 9/9; full 249 tests, 248 passed with unchanged known availability overlap failure; TypeScript exit 0. Independent review findings corrected and re-reviewed. Report: docs/personalized-learning-path-implementation-report.md. No deployment or persistent database migration.
