# Phase A configurable booking window — local verification

**Ready for a separately authorized controlled release: YES.** Implemented and verified locally only. Production remains unchanged and is not yet cleared for the requested scheduling policy.

## Behavior

The existing `teaching_config` now stores `minimum_notice_hours` and `booking_horizon_days` independently of `request_hours`. Instructor defaults expose both settings; student scheduling explains them and bounds the date picker. Server-generated slots and submitted request/proposal commands enforce the same window. Notice is checked again inside the database transaction, while the existing configuration-revision guard prevents configuration races.

Notice is elapsed time; the inclusive horizon is the same instructor-local wall time N calendar days ahead. Exactly 12 hours and exactly the 14-day cutoff qualify; earlier notice or later horizon instants do not. Existing ambiguous/nonexistent DST lesson-slot rejection is preserved.

Per Demi's explicit clarification, a valid held request or alternative remains confirmable inside the notice cutoff until its separate expiry. Confirmation still requires the correct participant, current revision, unexpired hold and future lesson time. New requests and proposed replacement times must satisfy the current window. Instructor confirmation, allowance, consultation conflict protection, buffers, cancellation, blocks and date overrides continue using the same Phase A authority.

## Files changed

- `lib/teaching/service.ts` — persistence, validation, slot filtering and commit-time notice guard.
- `lib/teaching/booking-window.ts` — shared calendar-horizon/notice calculation.
- `components/teaching/Scheduler.tsx` — distinct settings, date maximum and student policy copy.
- `migrations/0038_teaching_booking_window.sql` — two additive constrained columns, defaults 12 hours/14 days.
- `lib/teaching/booking-window.test.ts` — boundaries, stale/forged requests, proposal/confirmation semantics, transaction races and both DST changes.
- `lib/teaching/booking-window-migration.test.ts` — existing-row preservation and constraints.
- `docs/superpowers/plans/2026-11-08-teaching-booking-window.md` — completed implementation record.
- This verification report.

## Migration impact

0038 was applied only to the fresh synthetic local database and rehearsed against an in-memory pre-0038 schema containing existing configuration and blocked-date data. Existing values, including a separate 37-hour request expiry, were preserved; new defaults and constraints passed, with zero FK violations. No booking rows are rewritten. Existing configured rows receive the new 12-hour/14-day defaults when this migration is applied in a future authorized release.

Production migration state was not changed. A future release requires **0038 only after existing 0037**, with backup/preflight and explicit production authorization. Do not replay 0037. Do not deploy application code expecting these columns before the schema addition.

## Verification results

| Check | Result |
|---|---|
| Focused Phase A tests | **118 passed, 0 failed** |
| Full suite | **565 passed, 0 failed** |
| Standalone TypeScript | **PASS**, exit 0 |
| OpenNext production build | **PASS**, exit 0 |
| Main Worker dry-run | **PASS**, no upload/deploy |
| Classroom Worker dry-run | **PASS**, no upload/deploy |
| Independent code review | No blocking findings; suggested held-alternative tests added and passed |

Tests include 11h59m versus 12h; exact millisecond notice/horizon cutoffs; day 15 rejection; forged and stale slot IDs; changed configuration and delayed transaction races; Chicago spring/fall DST; and confirmation/acceptance of already-valid held requests and both kinds of alternatives inside notice. The full suite retains existing scheduling, consultation, allowance, buffer, lifecycle, Academy and classroom/security coverage.

Build environment notes: the first Turbopack attempt rejected the isolated dependency symlink. Replacing it with a task-local dependency copy resolved that issue. A post-OpenNext standalone TypeScript attempt aborted while generated bundled dependencies were in the source tree; moving only the generated `.open-next` artifact outside the tree allowed the ordinary source/generated-Next-types check to finish with exit 0, then the artifact was restored. Next's own build-time TypeScript also passed. The project Cache-Control/vendor-bundle warnings did not prevent successful build/dry-runs. No application workaround was introduced for these environment issues.

## Actual Chrome acceptance

Verified the running Next.js app at `http://localhost:3011`, using a normally signed-in synthetic instructor and a separate Incognito synthetic student, with no production credentials or provider keys in the QA environment.

- Instructor saved defaults through the UI; separate minimum notice, horizon and request expiry were visible.
- Instructor mobile configuration at **393×852** saved **24 hours/7 days**, then restored **12 hours/14 days**, with persistence verified.
- Local recurring pilot hours are Monday–Sunday **10:00–22:00 America/Chicago**. Sunday was entered/saved through Chrome; the other six synthetic fixture days used the existing scheduling service, preserving its audit path. Final local data verification confirmed all seven rows.
- Local settings: duration **60**, buffer **15**, weekly allowance **1**, notice **12 hours**, horizon **14 calendar days**; separate request expiry retained **12 hours**.
- Student desktop/mobile slot UI showed the configured policy and available CST slots within the window, with readable mobile wrapping and touch-sized controls.
- Student selected November 10, 2026, **10–11 AM Central**, and submitted the local QA lesson. It remained **REQUESTED**, explicitly awaiting instructor confirmation.
- Instructor's mobile Confirm action changed it to **CONFIRMED**; the student refresh showed confirmation and the protected Join Class link.
- Opening the future confirmed lesson showed **WAITING FOR YOUR INSTRUCTOR**. Local media is intentionally unconfigured; no premature live-media admission or time bypass was used.

## Safety and review location

Verified workspace: `/private/tmp/hft-scheduling-window-local`, based on the reconciled deployed Phase C source. Only the reviewed implementation, migration, tests and documentation were copied back to the repository. Existing unrelated working-tree work and all frozen release manifests were preserved. The task-local Wrangler configuration and credentials were not copied back.

Local data contains exactly two synthetic users, the pilot configuration, seven availability rows and one confirmed QA lesson. Zero communication logs, zero delivery attempts, zero FK violations. Local notification outbox records were not dispatched; no real email/SMS or Stripe activity occurred. Production availability, real students and real bookings were not touched.

The local dev server was stopped for build verification. To review, run `npm run dev -- --webpack --port 3011` in the isolated workspace. Its private task-local configuration uses a synthetic local D1 database and no external-provider keys. No production deployment, configuration change, migration or real-student onboarding is authorized by this report.

Next step is separate controlled release authorization and preflight, followed by production scheduling configuration and QA operational acceptance. No Phase D or Lesson 2 work occurred.
