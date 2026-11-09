# Phase B CPU Optimization Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task with test-first verification.

**Goal:** Substantially reduce classroom database/decoding work and redundant polling while preserving security.
**Architecture:** Request/phase-local authoritative projections and indexed joined reads in the existing main/control/DO architecture; no global authorization cache or new protocol.
**Tech Stack:** Existing Next/OpenNext, TypeScript, D1, workerd, LiveKit.
**Spec:** docs/superpowers/specs/2026-11-08-phase-b-cpu-design.md

- [x] Measure exact frozen production-artifact SQL shapes, duplicate reads, provider RPCs and teaching/classroom request map without logging bound values.
- [x] Add failing query-budget, request-access and polling-policy tests against real local SQLite fixtures.
- [x] Consolidate selective account reads, phase-local room authority/snapshots and bounded roster validation; retain transaction and post-await checks. Verify targeted security/performance tests.
- [x] Reduce redundant polling only while control snapshots are fresh; keep heartbeats/fallback. Verify policy and client/security tests.
- [x] Build exact isolated candidate, repeat cost map, compare main CPU profiles and payload work, and reconcile the baseline numbered SQL trace.
- [x] Run focused/shared/full suites, clean source TypeScript, OpenNext and both dry-runs; perform development-provider/native acceptance with synthetic accounts and cleanup.
- [x] Review and freeze a narrow candidate with hashes and evidence; report limitations and stop without deployment.

The existing isolated Phase B inventory is copied to /private/tmp/hft-phase-b-cpu-fix. Git metadata and prior frozen candidates remain unchanged. No migrations or dependency installs planned.

Verification caveat: native End button was interrupted by local Wrangler proxy; protected HTTP End and actual provider token-replay passed against final artifact. No production CPU certification or full eleven-person certification. See final report.

Chrome-available follow-up: native End/active-WebSocket and actual unexpired provider-token replay now PASS; see development-native-terminal-result.json. Frozen code unchanged. Production CPU/full eleven-person gates remain outstanding.
