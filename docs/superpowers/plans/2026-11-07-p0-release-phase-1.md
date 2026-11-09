# P0 Release Phase 1 Implementation Plan

**Goal:** Let existing paid and complimentary members safely use manually assigned, published basic lessons.

**Architecture:** Preserve Better Auth, D1 membership fields, legacy questionnaires, and manual course assignments. Add shared authorization boundaries and focused regression tests. Withhold unfinished student questionnaire entry instead of completing the full questionnaire product.

**Spec:** User-authorized Phase 1 request, 2026-11-07.

## Constraints

- Work against the existing uncommitted implementation; do not reset, commit, deploy, or change production resources/data.
- No migrations, Stripe activity, email/SMS delivery, financial-plan implementation, or approved Intake V2 changes.
- Tests use in-memory/local fixtures and existing dependencies.

## Tasks

- [x] Questionnaire: allowlist student-visible fields, protect private fields on updates, prevent submitted student writes, remove student instructor UI, withhold unfinished entry routes/navigation. Preserve admin editing and stored data.
- [x] Academy: centralize API membership/ownership/course/publication/sequence checks, enforce quiz ownership and validated unique question responses, consistent module/lesson ordering, plain-content rendering fallback, protect completion actions.
- [x] Authentication: enforce forced setup on protected member pages/APIs without blocking the setup page, clear state only after successful reset/change, request recovery without replacing known credentials, test with mocked external delivery.
- [x] Complimentary: correct existing-user invitation link, non-shortening extensions, accurate entitlement/status displays, expiry/revocation tests.
- [x] Verification: run focused and existing tests, no-emit nonincremental TypeScript, review diff and cross-boundary integration. Record remaining deployment/manual-test dependencies.

## Review focus

Test malformed/foreign IDs before writes, revoked/expired comp with paid coexistence, required-password recovery without redirect loops, unpublished/unassigned curriculum, preservation of private fields and old answers. Retain manual assignment and staff access.

## Execution notes

Work stays in the current checkout because the authorized implementation depends on substantial existing uncommitted files. No branch/worktree reset or commit will be performed. Independent domains may be implemented by scoped agents; the primary agent integrates and reviews the complete result.
