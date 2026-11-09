# Teaching Phase A Release Readiness Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for independently owned communications/templates/review tasks; parent owns candidate assembly, delivery coordinator, rehearsal and verification.

**Goal:** Freeze a Phase A-only candidate against deployed numbered compatibility; rehearse migrations on a fresh production export; prepare safe real-provider delivery without sending or deploying.

**Architecture:** Preserve original migration 0033. Add a narrow 0034 for durable delivery claims and authenticated dispatcher replay prevention. A disabled-by-default dispatcher uses the existing main app communications providers; a dedicated scheduled Worker invokes a signed internal endpoint via service binding, without duplicating provider credentials. All readiness delivery tests use fake adapters; no external provider sends are invoked.

**Tech Stack:** Existing Next/OpenNext, Cloudflare D1/Workers, existing Resend/Telnyx/Twilio adapters, Node SQLite tests.

**Spec:** /Users/demi/.codex/attachments/da4ada8e-3ecf-4b87-bc1b-0d517cbcd400/Pasted text.txt

## Constraints

- No deployment, production migration/write/configuration change, real message or Stripe activity.
- Build candidate from verified deployed numbered-compatibility source, overlay explicit Phase A files only; preserve unrelated checkout work.
- Keep real production student rows unchanged even in rehearsal; synthetic identities only for local workflows.
- No Phase B, LiveKit, Lesson 2 or unrelated features.

## Review focus

- Uncertain provider outcomes and abandoned claims must never cause blind duplicate sends.
- Dispatch must recheck revision/status/recipient eligibility/enrollment/consent immediately before provider invocation.
- Scheduling changes must serialize against a claimed outbound delivery; messages already accepted externally cannot be recalled.
- Template DTOs must whitelist student-safe fields and never serialize instructor/private financial/intake objects.
- Signed scheduler endpoint must reject stale/replayed/forged requests and remain inert unless explicitly enabled.

## Tasks

- [x] Read-only production baseline/export/recovery; migration 0033 review/rehearsal and preservation.
- [x] Narrow existing communications reliability support for teaching events, with mocked provider tests.
- [x] Student-safe event templates and signed scheduler/endpoint, disabled by default.
- [x] Durable production delivery claims/outbox event preparation, tests and additive migration 0034.
- [x] Assemble frozen explicit-overlay candidate; rehearse both migrations and restore into isolated local application.
- [x] Focused/full tests, TypeScript, OpenNext build, actual Chrome/mobile rehearsal against migrated copy.
- [x] Final immutable manifest, recovery/rollback instructions and readiness decision; no deployment.

## Decisions

- Existing production baseline matches worker ceb65b64-9a49-4342-9a25-d93f0dcd010c, 32 migrations, 13 users, 4 consultation bookings. Migration 0033 copy preserves all 59 baseline tables without violations or overlaps.
- Keep 0033 unchanged; put new delivery/replay bookkeeping in additive 0034 rather than silently changing the already-verified local migration.
- Scheduler flag and main-app delivery flag default disabled. Future activation requires explicit release configuration and shared dispatcher signing secret; no provider credentials are copied or printed here.

## Final verification

Frozen revision 3 passed 141 focused / 431 full tests, standalone TypeScript, OpenNext and scheduler dry-run build. Actual built-Worker Chrome/mobile rehearsal passed on the migrated production-data copy. Independent SQLite races passed. All 193 original rows retained; production remains unchanged. Readiness YES, deployment not authorized/performed. See docs/releases/2026-11-07-teaching-phase-a-readiness.md.
