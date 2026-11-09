# HFT Live Teaching Phase A — Local implementation report

Verified November 7, 2026 (America/Chicago). Phase A only. No deployment, production migration/configuration/data changes, real email/SMS, Stripe activity, media provisioning or Lesson 2 work occurred.

**Local implementation and verification: PASS. Controlled production release readiness: NO until the scoped candidate and production calendar/migration preflight described in section 32 are completed.**

## 1. Existing components reused

Existing Better Auth session handling and DAL guards; current password readiness, lifecycle, paid/complimentary entitlement predicates; approved learning-path/curriculum records; communication consent fields and communication_log. Existing Academy scoring, mastery, homework, remediation and progression logic was not changed.

## 2. Files changed

New application files:

- `lib/teaching/service.ts`: authenticated scheduling operations, slots, policies, expiry, history and notification-job preparation.
- `lib/teaching/time.ts`: explicit IANA timezone/civil-time conversion.
- `lib/teaching/outbox.ts`: durable mock-only notification processor.
- `app/api/teaching/route.ts`: authenticated, same-origin API.
- `app/(app)/lessons/page.tsx`: member scheduling page.
- `app/(app)/admin/teaching/page.tsx`: instructor scheduling page.
- `components/teaching/Scheduler.tsx`: student/instructor interaction.
- `components/teaching/teaching.css`: accessible HFT responsive presentation.
- `components/teaching/DashboardCard.tsx`: actual pending/upcoming session summaries.
- `migrations/0033_weekly_teaching.sql`: additive schema and database calendar guards.

New tests: `lib/teaching/calendar.test.ts`, `service.test.ts`, `outbox.test.ts`, `routes.test.ts`, `presentation.test.tsx`, `dashboard.test.tsx`.

Existing files changed narrowly: `app/(app)/layout.tsx` (navigation/mobile wrapping), `app/(app)/dashboard/page.tsx` and `app/(app)/admin/page.tsx` (actual scheduling summaries/links). Their prior completed changes were preserved.

Documentation: this report and `docs/superpowers/plans/2026-11-07-weekly-teaching-phase-a.md`.

No dependency, Wrangler configuration, paid-booking UI, marketing, Stripe or existing financial/intake/Academy engine edits were made for Phase A. Existing unrelated dirty files remain outside this change list. All 19 application/test/migration files match the isolated build/verification copy byte-for-byte.

## 3. Schema/migrations created

One additive migration: `0033_weekly_teaching.sql`. Applied successfully to local development D1 only, after backup to `/private/tmp/hft-before-phase-a-local.sqlite`. Local migration count is now 33. No existing consultation values are rewritten. Local foreign-key check reports zero violations.

## 4. Scheduling data model

Nine new tables: teaching_config, teaching_availability, teaching_override, teaching_allowance, teaching_session, teaching_enrollment, teaching_event, teaching_command and teaching_outbox.

Sessions have stable IDs, instructor/student, kind/capacity, UTC start/end, timezone, buffer, status, revision, request expiry and separate proposal fields. Scheduling is independent from future attendance and media state. No attendance/no-show inference was added.

## 5. Availability model

Instructor-owned weekly hours, date overrides and full-date blocks. UI supports one teaching window per weekday. Configurable defaults: 60-minute duration, 15-minute buffer, 12-hour request expiry and one weekly lesson. Slots are offered every 15 minutes, within a 90-day horizon, with at least 30 minutes advance notice. No student-entered arbitrary appointment timestamps are accepted.

## 6. Shared calendar/reservation model

D1 is authoritative. `teaching_calendar_busy` combines effective teaching reservations with normalized consultation windows. Database triggers reject conflicts during insert/update, including callers that bypass the availability helper. Consequently, consultation and teaching admission share the same database transaction boundary; no new Durable Object, binding or distributed lock was provisioned.

## 7. Weekly allowance model

Default one lesson per instructor-local Monday–Sunday week. The configured default can change; explicit per-student limits override it. Active request/proposal/confirmed reservations count. Canceled/declined/expired requests release allowance. Atomic command guards prevent concurrent requests from exceeding the allowance.

## 8. Instructor override behavior

Assigned instructor can set a student limit, including zero, with a required audit reason. Blank restores the configured default. Overrides persist until changed/restored; temporary date-scoped overrides and membership-tier policies are future additions. Immutable events preserve previous values, actor, reason and time.

## 9. Student request flow

Eligible student opens `/lessons`, selects an instructor-calendar date and a server-generated available slot, optionally supplies a topic, then requests. Status is explicitly REQUESTED, waiting for instructor confirmation. Expiry is bounded by configured hours and session start.

## 10. Instructor confirmation flow

Assigned instructor sees the student/topic/time in `/admin/teaching`, confirms at the expected revision, and creates an authoritative confirmed reservation. Both dashboards show actual session information. Confirmation prepares durable notification jobs; it does not send them.

## 11. Alternative-time flow

Instructor selects a different server-generated slot. Student must accept or decline. Student cannot accept their own proposal; instructor cannot accept their own alternative on the student's behalf. Proposal expiry, permission and revision are checked again at commit.

## 12. Rescheduling behavior

Original confirmed time remains reserved while a replacement is proposed. The replacement is temporarily held; acceptance updates the time and releases the prior reservation atomically. A student-originated proposal requires instructor confirmation. Decline/expiry restores a confirmed base session and prepares remaining future reminders. Event snapshots retain original request, previous time, proposal, actor/reason and revisions.

## 13. Cancellation behavior

Separate CANCELED_BY_STUDENT and CANCELED_BY_INSTRUCTOR states. History is retained, reservations are released and pending notification jobs are canceled. No punitive fee/cancellation policy was introduced. Canceled confirmed sessions no longer show as confirmed in the weekly summary.

## 14. Group-class foundation

GROUP kind, capacity constrained to 1–10, nullable primary student and separate enrollment table. Advanced group creation/enrollment UI is intentionally absent. Group roster capacity/admission workflows must be implemented and tested before exposing group enrollment later.

## 15. Timezone/DST implementation

Store explicit UTC instants and IANA timezone. Generate each date from local calendar rules. Student scheduler displays browser-local time; instructor views use configured instructor timezone. All displays include timezone context.

Timezone helper detects nonexistent times (zero candidates) and repeated times (two candidates); ambiguous/nonexistent slot starts are not offered. Tests cover spring-forward, fall-back, recurrence and UTC conversion. Legacy naive consultation timestamps retain their existing America/Chicago interpretation; fall-back ambiguity conservatively reserves both possible instants.

## 16. Consultation conflict protection

Guards cover consultation INSERT and updates of status, appointment time or duration, plus teaching INSERT/UPDATE. Both arrival orders and overlap/buffer races are tested. Pending consultation checkout retains its calendar reservation, so later payment confirmation cannot discover an expired hold taken by a lesson. No pricing, charge or Stripe fields/logic were changed.

Unknown/malformed/pre-2007 naive consultation times fail closed. Existing overlapping consultations remain unchanged, but a later confirmation can be rejected for an existing conflict. Production compatibility must be audited before applying the migration.

## 17. Concurrency/idempotency protections

D1 atomic batches, deferred new-session command FK, database overlap triggers, actor-scoped idempotency keys bound to command bodies, configuration revisions and compare-and-set session revisions. Retries do not duplicate sessions/events/jobs. Failed batches roll back command records too. Availability, eligibility, allowance, expiry and ownership are rechecked transactionally. A stale expiry worker cannot append a false event after losing its update race.

## 18. Reminder/outbox architecture

Confirmation, 24-hour and one-hour jobs; identity includes session, revision, recipient, channel and notification type. Confirmation skips reminder times already passed. Canceled/revised jobs are canceled or skipped.

Mock processor performs durable request/proposal expiry before scanning due jobs, so expiry recovery does not require a dashboard visit. It atomically rechecks current session/revision/enrollment, future start, eligibility, consent and prior delivery, then records MOCKED or SKIPPED and a mocked communication log where appropriate. Rollback and concurrent-worker tests pass.

No real provider adapter, delivery callback, scheduled worker or cron is enabled. Pending alternatives intentionally pause reminders until decision/expiry. Production delivery activation requires separate release authorization; jobs are prepared safely now.

## 19. Communication consent behavior

Email respects existing email opt-out defaults; SMS requires opt-in and a phone number. Staff must remain active/password-ready and be the assigned instructor. Student eligibility includes paid or valid unrevoked complimentary access. Paid access remains valid when a complimentary grant expires/is revoked. No real messages were sent.

## 20. Learning-path association

Suggests the current approved student path's published starting point, then remaining eligible published curriculum as appropriate. Course assignment is required for that association. General-topic scheduling is allowed. Private instructor notes are not returned. Tests confirm scheduling does not change path versions, progress or mastery.

## 21. Student dashboard result

Actual pending/upcoming summaries on `/dashboard`; scheduling/status/history and management on `/lessons`. Status distinguishes needs scheduling, request pending and confirmed. Timezone labels and large native selectable slot tiles are present.

## 22. Instructor dashboard/calendar result

Actual summary on `/admin`; Today, Upcoming, Pending and Calendar views on `/admin/teaching`, with availability/defaults/overrides and audited student allowance controls. Other administrators retain their overview without inheriting assigned-instructor control. No financial questionnaire/plan data is shown.

## 23. Future Phase B handoff

Stable session IDs and instructor/enrollment records are ready for a future media-room association. Confirmed cards explicitly say classroom access comes in Phase B. No provider room, token, join action, audio/video or attendance implementation was added.

## 24. Focused test results

**62/62 PASS:** calendar/timezone 10, scheduling service 12, mock outbox 30, API authorization/privacy 1, UI presentation/parsing 8, dashboard 1. Includes consultation/lesson conflicts, transactional rollback, concurrent allowance/slot admission, stale revisions, consent, expiry, ownership, DST, history and learning-path privacy/progression preservation.

## 25. Full-suite result

**387/387 PASS**, zero failures/skips, compared with a clean baseline of 325 passing tests. Existing communications, auth/privacy, Academy, financial/intake, lifecycle, learning-path and availability tests remain passing.

## 26. TypeScript result

**PASS:** standalone `node node_modules/typescript/bin/tsc --noEmit`, exit 0, no diagnostics, in the isolated source verification copy. All application and test sources and normal compiler settings remain included. Generated OpenNext bundle output was moved outside compiler inputs after an initial standalone run exhausted Node's heap; no application/type-checking rules were weakened. The final OpenNext build also passes its TypeScript stage.

## 27. Build result

**PASS:** `opennextjs-cloudflare build`, exit 0, final corrected source. Built in `/private/tmp/hft-phase-a-build` to preserve the running dev server. Worker artifact is local only; nothing deployed. Existing custom Cache-Control and bundled-library duplicate-member warnings remain non-fatal.

## 28. Browser acceptance result

**PASS against actual Next.js at localhost:3000, using authenticated Chrome and synthetic local accounts.** Instructor saved defaults and Monday hours, blocked Nov 16, viewed calendar/pending request, confirmed, proposed an alternative and confirmed a student reschedule. Student dashboard opened scheduling, selected a server slot, requested, saw pending, accepted instructor alternative, refreshed the confirmed time and canceled with retained history. A same-time reschedule was rejected as expected. Authenticated HTTP checks independently returned 200 for both application pages, verified blocked-date exclusion and 29 valid Monday slots.

## 29. Mobile acceptance result

**PASS for Chrome responsive emulation at 390 × 573 CSS pixels.** Confirmed card, timezone, full-width controls/slot choices, student reschedule, cancellation and retained history were exercised. Real iOS Safari/Android handset testing was not performed and is not claimed.

## 30. Remaining limitations/open decisions

- One primary instructor calendar; one availability window per weekday in the UI.
- Group scheduling structure only; no advanced group enrollment or media.
- Notification jobs/mock processing only; no live background delivery/cron.
- Per-student allowance overrides persist until restored; no automatic weekly expiry/tier integration.
- Ambiguous slot starts are skipped; legacy ambiguous consultation intervals are conservatively blocked.
- Existing invalid/overlapping consultation data needs production preflight review before stricter database guards are installed.
- No production dataset rehearsal or frozen incremental deployment candidate was created during this local-only task.
- Real-device mobile testing remains a later check. Phase B, Lesson 2, recording and community remain untouched.
- Whole-checkout `git diff --check` reports pre-existing extra EOF blank lines in `app/api/stripe/webhook/route.ts`, `app/invite/[token]/actions.ts` and `lib/membership.ts`. These files were not changed by Phase A; the three tracked Phase A navigation/dashboard edits pass the scoped whitespace check.

Local data comparison against backup confirms consultation, course/module/lesson, assignments/progress, learning-path, Intake V2 and financial-plan records unchanged. Only local synthetic QA setup, authentication and teaching records were used. Final synthetic session is canceled at revision 7 and all 36 superseded/canceled notification jobs are canceled.

## 31. Exact local browser verification steps

1. Open `http://localhost:3000/login`. Use the existing instructor credentials in ignored `.env.academy-qa.local` (`academy-local@example.invalid`). No new instructor account was created.
2. Open `http://localhost:3000/admin/teaching` or click Teaching. Defaults are 60 minutes, 15-minute buffer, 12-hour expiry, one weekly lesson. Monday 09:00–17:00 is configured; Nov 16, 2026 is blocked.
3. Use a separate private browser session for the synthetic student. Credentials are in ignored `.env.teaching-qa.local` (`teaching-local@example.invalid`), never production.
4. Open `http://localhost:3000/lessons` from the student dashboard. Select Monday Nov 9, 2026, choose an available slot, optionally enter a topic and Request lesson. This is pending, not confirmed.
5. In the instructor window click Refresh → Pending → Confirm. Upcoming/Calendar show the same confirmed session.
6. Choose Propose different time, select a different available slot and submit. In the student window Refresh → Accept alternative. The original time remains reserved until this acceptance.
7. Student Propose different time → select a different slot → submit. Instructor Refresh → Confirm. Student Refresh retains the updated time.
8. Student Cancel lesson → Confirm cancellation. Open Lesson history to see CANCELED BY STUDENT. New scheduling is available again.
9. Instructor can set a student weekly allowance with a required reason; blank restores the default. Test only synthetic students.
10. For responsive checks use Chrome DevTools device toolbar at width 390. Do not use real student records or communication-test/send controls.

## 32. Is Phase A ready for a controlled production release?

**NO — not yet deployment-ready. Local Phase A implementation/acceptance is complete and passing.** Before production release:

1. Freeze a Phase A-only incremental candidate against the currently deployed release, preserving completed work while excluding deferred marketing/booking changes. Reverify that candidate; do not deploy this entire dirty checkout.
2. Read-only audit current production consultation timestamp formats and overlaps, then rehearse migration 0033 and calendar behavior against an authorized recovery copy. Confirm backup/recovery and migration order before mutation.
3. Decide whether the controlled release intentionally keeps delivery disabled with prepared jobs. Real reminders need a separately authorized delivery/dispatcher activation and appropriate verification; mock records must never be represented as delivered messages.

No production authorization was used or requested here. Stop at local implementation/reporting; do not deploy or begin Phase B.
