# Weekly Teaching Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Local weekly Academy scheduling with shared consultation conflict protection and no external delivery.

**Architecture:** D1 is the authoritative transactional calendar. Add teaching sessions, alternative reservations, events, allowance overrides and a delivery-disabled outbox. Database constraints/triggers coordinate consultation writes, avoiding a new cross-service transaction boundary. Authenticated APIs and HFT dashboard UI consume a narrow scheduling service.

**Tech Stack:** Existing Next 16, React 19, D1/SQLite, Intl timezone conversion, Node test runner.

**Spec:** /Users/demi/.codex/attachments/60ab84d0-54d5-41c9-86c9-2223ab178cea/Pasted text.txt

## Global Constraints

- Phase A only; no deployment, production changes, real delivery, Stripe activity or media provisioning.
- Preserve all existing working-tree changes; no bulk checkout/reset/commit.
- Defaults configurable: 60-minute duration, 15-minute buffer, 12-hour request expiry, one weekly lesson with audited student overrides.
- Existing auth, entitlement, lifecycle, educational progression and private data contracts remain authoritative.
- Groups supported structurally up to ten students; no advanced enrollment UI.

## Review Focus

- Concurrent overlapping consultations and teaching writes must reject one at the database boundary.
- Ambiguous/nonexistent DST times must not silently select an incorrect instant.
- Student reschedule of a confirmed session must retain its original reservation until approval.
- Retry after cancellation/configuration changes must not recreate a booking or change a newer revision.
- Outbox mocks must not bypass current consent, eligibility, recipient ownership or schedule revision.

### Task 1 — Calendar schema and timezone foundation
- [x] Write and run failing timezone/conflict tests.
- [x] Add additive migration 0033, shared calendar trigger protection and timezone helpers.
- [x] Test existing-record preservation, DST and consultation/teaching race protection.

### Task 2 — Scheduling service and outbox
- [x] Write failing request/state/privacy/allowance/reminder tests.
- [x] Implement D1 service with transactional guards, command idempotency, immutable events and configurable policy.
- [x] Implement delivery-disabled durable outbox preparation and mock dispatch with revalidation.
- [x] Run focused service tests.

### Task 3 — Actual routes and dashboard UI
- [x] Implement member/admin scheduling API with origin checks and current authorization.
- [x] Add /lessons and /admin/teaching, availability, requests/calendar/allowance controls and dashboard links.
- [x] Verify real local routes and authenticated synthetic users in Chrome, including mobile layout.

### Task 4 — Final verification and report
- [x] Independent code/security review; address important findings with regression tests.
- [x] Full suite, TypeScript and OpenNext build without deployment.
- [x] Record exact browser steps, limitations and production readiness result.

## Execution rulings

- Work in current checkout: required completed work is uncommitted and absent from HEAD. Record baseline status; isolate ownership to new teaching files plus narrow navigation/calendar changes.
- Use D1 atomic batches and database triggers rather than provision Durable Objects in Phase A. This makes calendar admission and legacy consultation writes share the same transactional boundary.
- No external delivery adapter is enabled in Phase A; the durable mock processor proves eligibility/consent/revision checks without making provider calls.

## Verification ledger

- Baseline: 325 tests passed before implementation.
- Calendar and timezone: 10 tests; service: 12; routes: 1; mock outbox: 30; UI: 8; dashboard: 1. Final focused total 62.
- Full suite: 387 passed, zero failed.
- Full TypeScript: `node node_modules/typescript/bin/tsc --noEmit` exited 0 in isolated source copy. Generated OpenNext output was moved outside compiler inputs; no application source or TypeScript settings were excluded/relaxed.
- OpenNext production-equivalent build verified in isolated source copy (no deployment). Final rerun after outbox fix exited 0; OpenNext build complete.
- Browser: actual localhost:3000, existing local QA instructor and synthetic student; availability, blocked date, calendar, request, confirmation, instructor alternative/student acceptance, student mobile reschedule/instructor confirmation, refresh persistence and cancellation/history verified. 390px mobile emulation; real handset not tested.
- Independent review found canceled-confirmed summary and overdue reminders; both fixed with red-to-green regression tests. Commit-time expiry, setup ownership and false expiry events were also hardened.

## Rulings and limitations

- Work in current checkout; no commits/worktree reset. Existing completed work is uncommitted and must be preserved.
- Shared D1 views/triggers replace a provisioned coordinator: admissions and consultation writes now share one database transaction boundary, without payment changes.
- Unknown legacy consultation timestamps fail closed; ambiguous Chicago folds reserve both possible instants. Existing consultation values are not rewritten. Production calendar compatibility still requires read-only audit/rehearsal before release.
- Pending alternative proposals pause reminders until decision/expiry; mock processing performs expiry maintenance without a page visit.
- No delivery adapter or cron is enabled. Outbox records are prepared and mock-only.
- Groups have schema/capacity foundation only; group enrollment UI, media and attendance belong to future phases.
