# Phase B Live Classroom Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for independently owned core/provider/UI work; parent integrates routes/realtime, verifies and reports. No commits or production operations; preserve dirty checkout.

**Goal:** Implement the authorized HFT Phase B classroom locally, retaining provider-backed acceptance as an explicit gate when credentials are absent.
**Architecture:** Existing confirmed Phase A UUID → additive classroom D1 state → authenticated HFT controls/DO realtime → narrow LiveKit media adapter → custom responsive HFT UI.
**Tech Stack:** Existing Next16/OpenNext/D1/Workers, Durable Objects, LiveKit server/browser SDKs, React.
**Spec:** /Users/demi/.codex/attachments/e1973989-a8ff-45f9-8576-733c55717dd5/Pasted text.txt

## Global constraints

No production mutation/deployment/migration/config; no real students, messages or Stripe; no Phase C/LiveKit provisioning/Lesson2. Isolated workspace /private/tmp/hft-phase-b-local starts from the exact deployed Phase A manifest; only explicit Phase B changes return to the shared checkout. Production acceptance/reminder steps for Phase A remain incomplete.

## Review focus

- Stale provider token reconnect after demotion/removal/end must not recover privileges.
- Concurrent grants/screen reservations/admission cannot exceed three screens or one connection/person.
- Provider failure after HFT state commit must deny new admission and retain retryable cleanup.
- Lifecycle/entitlement changes must invalidate live controls/media and reconnect.
- Cross-room event replay, malformed chat and webhook replay must not expose private data.

## Tasks / interfaces

- [x] Core: lib/classroom/contracts.ts, service.ts, service.test.ts, migrations/0035_live_classroom.sql. D1-backed admission/commands/chat/attendance/lifecycle/reconciliation with deterministic tests before implementation. Exports classroomSnapshot(db,actorId,sessionId), classroomCommand(db,provider,actorId,sessionId,input), reconcileClassroom(db,provider,sessionId), and shared public contracts. Tests cover the brief's security list, idempotency, races and terminal-first cleanup.
- [x] Provider: lib/classroom/provider.ts, livekit.ts, provider.test.ts, media-client.ts and dependencies. Narrow provider interface, LiveKit Cloud scoped tokens, strict revocation, webhook verification and track reconciliation. Tests use mocks/signature fixtures; never contact a media project without real dev configuration.
- [x] UI: components/classroom/Classroom.tsx, classroom.css, media.tsx and presentation tests. Shared public snapshot/command contracts; custom HFT stage, responsive panels, host/presenter controls, chat/hand queue, devices, explicit unavailable-provider state; one focused subscription on mobile.
- [x] Integration: protected /classroom/[sessionId], /admin/classroom/[sessionId], /api/classroom/[sessionId], provider webhook route; Phase A confirmed-session links; dedicated teaching classroom Worker/DO/config, tickets/service-auth, lifecycle hooks. No scheduling duplication.
- [ ] Verification: local-only migrations + synthetic 1:1/group fixture, focused/full tests, TypeScript, OpenNext/Worker dry-run, actual Chrome routes/390px. Provider-backed acceptance only if real development credentials exist. Record honest limits and 32-item final report.

## Ledger

Ruling: implement the already chosen architecture without a new approval pause — explicit controlled implementation is authorized; do not expand scope.
Ruling: use a manifest-based isolated copy rather than a git worktree based on stale HEAD — the deployed Phase A baseline includes uncommitted files and the shared checkout contains unrelated work; copy only owned Phase B files back.
Preflight: core/provider/UI share contracts; define provider and public snapshot contracts before dependent edits and communicate any signature change explicitly.

## Verification ledger

- Shared full suite:474/474 pass; clean-source TypeScript pass; OpenNext pass; Worker dry-run pass.
- Signed local DO WebSocket handshake and synthetic11-user control exercise run; no LiveKit media claim.
- Independent review findings fixed with regression tests: identity/protocol mismatch, native stop/reconciliation, stale device state, paginated chat recovery; presence renewals separated from aggregate revisions.
- Chrome/mobile acceptance blocked by cgWindowNotFound; provider acceptance blocked by missing development credentials. Phase A production operational gates remain unchanged.
- Ruling: same-origin local gateway uses one multi-Worker emulator/D1 instance to avoid independent emulator storage failures; normal app forwarding does not bypass WebSocket auth.
- Ruling: strict media source count remains provider reconciliation; this is a documented production-readiness blocker rather than a falsely certified media limit.

- Final local QA also fixed host capability restoration on fresh assigned-host rejoin; students do not regain expired presenter privileges.

- Chrome follow-up completed: actual host/student controls and390px tabs/reconnect pass. Browserfoundcachedrevokedview bug fixedred/green+actualretest; final159focused/474full+TypeScript/OpenNextpass. Provider/media-plane acceptance remains externalblocked, not falselycertified.
