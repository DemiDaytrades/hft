# Financial / Trading Readiness Implementation Plan

Goal: connect completed Intake V2 and its exact consultation assessment to a versioned deterministic financial plan, staff review and student publication.
Spec: /Users/demi/.codex/attachments/dfc0e789-37a4-4266-b1d1-3c630ad07417/Pasted text.txt (user-authorized detailed design).
Architecture: additive dedicated series/version/event tables; immutable source JSON plus digest in each version; reuse PE1/PE2, select financial/process/schedule outputs, never write educational placement. Editable instructor interpretation is separate from immutable engine output. Optimistic edit revisions, explicit review/approve, atomic publication and trigger-enforced integrity.
Alternatives: legacy Game Plan requires mutable legacy questionnaire and incompatible output; rejected. Dedicated additive storage satisfies the supplied preferred design without deleting legacy records. Retain existing checkout to preserve extensive authorized uncommitted work; no reset/commit/deploy.

Constraints: local only; no persistent local/student data edits needed; no production migrations; no providers/messages/Stripe; approved questionnaire contracts unchanged; no new financial formulas; no placement implementation.

- [x] 1. Engine normalization regressions: scalar/array/compound unknowns, human-readable reasons and financial/education invariance. Run failing tests, correct normalization and conservative incomplete findings, preserve 53 existing tests.
- [x] 2. Source integrity: additive migration with immutable completed-intake trigger, CAS revision and conditional completion; exact source copied/digested into each financial plan. Preserve provenance for unchanged fields. Tests use actual migrations in SQLite memory.
- [x] 3. Dedicated typed contracts/composition and exhaustive 54-field registry coverage classification. Pure financial-only result with supported ranges, evidence, existing deterministic actions and self-reported goals/debt context. Explicit student DTO.
- [x] 4. Authorized lifecycle service: completed-source validation, idempotent generation, numbered revision, CAS draft edits/review/approval, immutable approved content and atomic publish/supersede/pointer. Append lifecycle events. Synthetic E2E, rollback, races and private-data tests.
- [x] 5. Admin exact-saved-version preview/editor and published-only student view; link through existing My Finances/admin navigation; retain legacy records and label fallback.
- [x] 6. Focused/engine/intake/privacy/full tests, TypeScript, independent final review, report and browser checklist.

Review focus: stale save vs completion; duplicate generation/version allocation; stale approval/publication; source drift; raw private assessment leakage; compound unknowns; invented precision; publication rollback; same educational input under every financial variant.
Progress ledger: maintained below with tests and rulings; no merge or deployment step.

## Completion ledger

- Engine uncertainty/readability regressions reproduced before correction; 53 original tests preserved, new scalar/array/compound checks pass.
- Synthetic E2E and real in-memory migrations prove exact-source publication/history, rollback, ownership and private DTO boundaries.
- Concurrent retry/version allocation and source save/completion CAS checks pass.
- Independent review identified future-revision approval race. Interleaving regression failed first, then passed after pre-read revision validation plus SQL CAS.
- Existing mocked intake tests updated to return D1 meta.changes, preserve revision predicates and completion bindings; all assertions retained. Actual SQLite integration tests cover transaction behavior beyond these mocks.
- Final: focused14/14, engine53/53, intake94/94, auth/privacy16/16; full211 with210passed and1pre-existing availability overlap failure; TypeScript exit0.
- Ruling: user supplied and authorized the detailed audited design; retain dedicated additive storage and existing checkout. Cost if wrong: migration/API review may require adjustment; no production side effects were taken.
- Ruling: reuse existing admin role model rather than invent an instructor allocation system. Cost if wrong: organizational instructor scoping needs a separate approved access model before use.
- Ruling: substantive approved categorical rules reused, with explicit uncertainty corrections; no debt/credit/investment algorithms added. Cost if wrong: policy owners must revise approved rules through a future version rather than silently changing a historical plan.
- Ruling: full Intake V2 browser capture and legacy arithmetic are not expanded here; workflow consumes genuinely completed source and published plans supersede the legacy display. Cost if wrong: controlled testing requires existing backend staff capture until that separate UI is completed.
- Deferred browser acceptance: static rendering/API/service checks passed; authenticated device and real local Worker/D1 smoke checks are documented, not claimed performed.

Detailed files/results/limits: docs/financial-plan-implementation-report.md. No commit, merge, push, production migration or deployment.
