# HFT Teaching Phase A — production release readiness

Decision: **YES — frozen revision 3 is ready for a controlled production migration/deployment, subject to the pre-mutation rechecks and staged configuration procedure below. No deployment is authorized by this report.**

Verification completed 2026-11-08T00:29:35.512027+00:00. No production migration, deployment, configuration change, student mutation, email/SMS, Stripe activity or LiveKit provisioning occurred.

## 1. Frozen Phase A manifest

`docs/releases/2026-11-07-teaching-phase-a-candidate.json`; candidate `/private/tmp/hft-teaching-phase-a-rc`. Fingerprint `e1621fc6144debb2f0d26c5663c0681a07284e72611e040a2937437fed02ac72`. All 458 source-file hashes were rechecked after the final build/browser rehearsal. The private source archive contains only these manifest files; its hash and generated build inventory are recorded in the manifest.

The candidate starts with the 428 verified files of the deployed numbered-compatibility release and overlays only 35 Phase A files. Existing unrelated working-tree changes are preserved and excluded. Revision 1 failed TypeScript and revision 2 failed the built-Worker origin check; both were corrected and refrozen before final verification. Revision 3 is the only approved candidate in this readiness report.

## 2. Exact included change files

The manifest lists all 458 included files with SHA-256 and disposition. These are the 35 Phase A differences from the deployed baseline:

- `app/(app)/admin/page.tsx`
- `app/(app)/admin/teaching/page.tsx`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/layout.tsx`
- `app/(app)/lessons/page.tsx`
- `app/api/internal/teaching-delivery/route.ts`
- `app/api/teaching/route.ts`
- `components/teaching/DashboardCard.tsx`
- `components/teaching/Scheduler.tsx`
- `components/teaching/teaching.css`
- `lib/communications.ts`
- `lib/teaching/calendar.test.ts`
- `lib/teaching/dashboard.test.tsx`
- `lib/teaching/delivery-adapter.ts`
- `lib/teaching/delivery.test.ts`
- `lib/teaching/delivery.ts`
- `lib/teaching/dispatch-auth.test.ts`
- `lib/teaching/dispatch-auth.ts`
- `lib/teaching/dispatch-route.test.ts`
- `lib/teaching/messages.test.ts`
- `lib/teaching/messages.ts`
- `lib/teaching/notifications.ts`
- `lib/teaching/outbox.test.ts`
- `lib/teaching/outbox.ts`
- `lib/teaching/presentation.test.tsx`
- `lib/teaching/provider.test.ts`
- `lib/teaching/routes.test.ts`
- `lib/teaching/service.test.ts`
- `lib/teaching/service.ts`
- `lib/teaching/time.ts`
- `migrations/0033_weekly_teaching.sql`
- `migrations/0034_teaching_delivery.sql`
- `workers/teaching-reminders/src/index.ts`
- `workers/teaching-reminders/wrangler.jsonc`
- `wrangler.jsonc`

No dependencies were added. No marketing/checkout, unreleased Intake, classroom/media, Lesson 2 or Chart Lab changes were included.

## 3–6. Production baseline, Worker and migration level

Read-only Wrangler identity/configuration and final direct D1 checks agree:

- Account: `780fda88bb137eedefd9d3981a8816b4`.
- Database: `hft-data`, `baec727f-4a9a-4915-81e2-d549c5095fb5`.
- Current Worker: `ceb65b64-9a49-4342-9a25-d93f0dcd010c`, serving 100%.
- Current deployment: `a3942ac6-54f9-4869-a665-cf65e237c88c`, created `2026-11-07T22:52:43.055569Z`.
- Migration level: 32, through `0032_personalized_learning_path.sql`.
- Existing production data: 13 users, 4 consultations, 7 availability rules; no existing date overrides. Membership/user records are retained and readable in the restored copy. No real account credentials were exercised.
- Production `BETTER_AUTH_URL` remains `https://highfrequency.vip`; DB binding/account unchanged.
- Next migrations: **0033_weekly_teaching.sql, then 0034_teaching_delivery.sql**. Migrations 0001–0032 must not be replayed.

Final remote SELECT/PRAGMA checks returned zero writes/changes and zero FK violations. Verification uses direct `--command`, avoiding the previously observed SELECT-file import anomaly.

## 7. Backup/recovery

Fresh export completed 2026-11-08T00:00:20.412578+00:00, database above; private path `.wrangler/teaching-phase-a-release/2026-11-07/production-before.sql`, 150501 bytes, SHA-256 `0eea50a7abe7d01fc9bddb6dd9a638dce007789063fc9455821a0f6d374a1455`.

Time Travel bookmark: `00000238-00000000-0000511d-4380f8322ea6cf9b0d08c04a9b88b99e`. Export and restored snapshots are private local artifacts, excluded from release. Backup directory is 0700 and data/credentials are 0600. Refresh export/bookmark immediately before a future authorized migration; this rehearsal snapshot is not a substitute for that new recovery point.

Worker rollback target is the current `ceb65b64-9a49-4342-9a25-d93f0dcd010c`.

## 8–10. Migration review, rehearsal and preservation

PASS. 0033 creates teaching configuration, availability/overrides, allowance, session/enrollment, history/idempotency/outbox tables and shared-calendar views/triggers. It does not rewrite legacy consultation values or backfill real students. 0034 adds durable delivery-attempt and dispatch-nonce tables/indexes and a guard against changing sessions while delivery is claimed. Neither migration drops existing tables/columns or deletes data. Existing data satisfies references and timestamp normalization; no naming/uniqueness conflicts were found.

Actual Wrangler LOCAL rehearsal restored the fresh export, applied 0033 then 0034 successfully, and booted the final OpenNext Worker against it. The local ledger has 34 entries. Repeating migration apply returned “No migrations to apply!”. Directly replaying the DDL is deliberately not a supported action.

All **193 original rows across 59 tables** remain byte/value-equivalent after migration and after browser QA; the ledger only appends the two new migrations. All 13 original users, 4 consultations and 7 availability rules remain intact. Two synthetic QA identities and their local scheduling/authentication records were added only to the disposable copy. Foreign-key violations: **0**; SQLite integrity: **ok**. Carlos, Skip, Z and every other original record were untouched.

## 11–12. Shared calendar and concurrency

PASS. Database triggers guard both teaching and consultation write paths, including direct writes and updates. Authoritative committed SQLite/D1 reservation state determines admission. All four original consultations normalize successfully from Chicago civil timestamps; none overlap. Malformed/unsupported legacy dates fail closed without rewriting values. Ambiguous fall-back times conservatively reserve both possible instants.

Independent worker threads with separate SQLite connections, WAL, a start barrier and transactions tested: two teaching requests for one slot; teaching versus a future synthetic consultation cloned from the production format; and confirmed rescheduling versus another reservation. Every race produced exactly one commit and one calendar conflict. The losing reschedule retained its original reservation. Expiry released held time. A 15-minute buffer rejected a start at 19:14 and allowed 19:15. Original data remained unchanged. Private aggregate results: `calendar-races-result.json`.

Service tests cover duplicate request keys, conflicting retries, stale revisions, atomic rollback, proposal expiry and allowance races. This is local SQLite/actual local D1 verification, not a live production load test.

## 13. Weekly allowance/override

PASS. Default one lesson per instructor-local calendar week is configurable. Instructor per-student override requires an audit reason and records history; null restores the configured default. Concurrency tests prevent overbooking allowance. Production students received no overrides.

## 14. Timezone/DST

PASS. Teaching stores validated UTC `Z` instants plus IANA timezone context. Tests cover normal dates, Chicago spring-forward gaps/fall-back folds, local week boundaries, differing display timezones and rescheduling across DST without fixed seven-day arithmetic. Legacy consultation naive dates remain historical Chicago civil time; unsupported dates block admission safely. Teaching does not adopt naive timestamps as authority.

## 15. Production reminder/outbox preparation

PASS with delivery deliberately disabled. Session/revision/recipient/channel/type is unique. Request, confirmation, alternative, acceptance/reschedule, cancellation and reminder jobs are durable. The existing communications adapter applies current consent/opt-out and logging; production bindings include Resend and Telnyx credentials (values not inspected or printed). No provider credentials are copied into the scheduler.

A signed service-binding dispatcher requires a 32+ character shared secret, a fresh timestamp, a one-use nonce and fixed bounded payload. It rejects forged/stale/replayed calls and stays inert when disabled. Durable claims prevent concurrent/automatic retries. Before provider invocation it rechecks current revision/status, eligible active student, enrollment, recipient and channel consent. Cancellation can notify the original enrollment while retaining account eligibility checks. Stale revision jobs are skipped. Reminder due times over two minutes late are skipped rather than burst-delivered.

A crashed/ambiguous delivery becomes UNCERTAIN for manual review, not automatic duplicate retry. Provider receipts and reliable failures are recorded; teaching email uses provider idempotency. Unknown SMS outcomes do not trigger blind alternate-provider delivery. In-flight messages already accepted by a provider cannot be recalled. Schedule writes serialize against DELIVERING jobs.

All provider tests used mocks. Live deliverability and end-to-end Cron delivery are intentionally untested here; require a separately authorized synthetic-recipient activation check. The local built route returned disabled status without contacting a provider. Final browser database inspection found zero delivery-attempt records; both synthetic sessions were canceled (one by each role).

## 16. Communication content

PASS. Eight student-safe HTML/text/SMS template families: request received, confirmed, alternative proposed, alternative accepted, rescheduled, canceled, 24-hour and 1-hour reminder. Declined requests render a declined outcome. Inputs whitelist names, date/time/timezone, instructor/topic and approved dashboard URL. HTML is escaped; URL origins/paths and UTC/IANA values are validated. No financial/private notes, questionnaire answers, answer keys or other-student objects are serialized.

## 17. Authorization/lifecycle

PASS. Fresh server-side account/entitlement checks block deactivated, former, expired/revoked and forced-password accounts as applicable. Students cannot impersonate another student, confirm as instructor, edit availability or cross-read protected scheduling data. Instructor controls require authorized role. History survives cancellation/lifecycle transitions. API origin checks use the trusted configured BETTER_AUTH_URL; forged forwarding headers do not authorize writes. The built-Worker origin mismatch found in rehearsal was fixed with a regression test, without weakening CSRF checks.

## 18–19. Group foundation and Phase B handoff

PASS for foundation only. Session kind/capacity supports GROUP with capacity 1–10 and a separate enrollment roster. Confirmed sessions retain a stable UUID across reschedules, suitable for a future room/attendance/chat/presenter attachment. Phase A has no group-class management UI or classroom/media integration. No LiveKit, recording, polls or Phase B functionality was implemented/provisioned.

## 20–23. Final candidate tests/build

- Focused scheduling/calendar/auth/lifecycle/membership/provider/invitation tests: **141/141 PASS**.
- Full suite: **431/431 PASS**, zero failures/skips.
- TypeScript: **PASS**, exit 0 on the complete frozen source plus generated Next types in a clean source-only verification directory. This avoids including generated OpenNext JS bundles in a second standalone check; no source/test checks were disabled.
- OpenNext production-equivalent build: **PASS**, exit 0, including its TypeScript stage.
- Scheduler dry-run bundle: **PASS**, no deployment/provisioning.

Private verification logs are `/private/tmp/hft-teaching-candidate-{focused-final,full-tests,typescript,build}.log` and `/private/tmp/hft-teaching-scheduler-build.log`. Build emitted existing cache-control/bundling warnings; no build failure.

## 24–25. Production-like browser/mobile

PASS on the actual built OpenNext Worker at `http://127.0.0.1:3004`, using migrated production-copy local D1 and synthetic instructor/student credentials only. No isolated UI fixture was used.

Instructor: authenticated access; saved defaults/weekly availability; saved a blocked date; viewed pending request; confirmed; proposed an alternative; accepted a student reschedule; inspected Calendar/Upcoming; canceled a confirmed synthetic session. Student: loaded available dates/times; requested; observed explicit pending state; accepted instructor alternative; observed confirmed replacement; proposed another time at 390px; refreshed to see instructor acceptance; canceled with confirmation; inspected canceled history; requested the released slot again. Instructor then confirmed and canceled that second synthetic session. Stable session IDs were retained across schedule revisions. Refresh retained server state.

390px responsive emulation showed readable stacked cards and usable date/slot/submit/cancellation controls. Keyboard date navigation and native control selection worked. Chrome console showed no errors; repeated warnings were unused-preload notices. This was desktop Chrome mobile emulation, not physical iOS/Android testing.

## 26. Remaining limitations

Phase A is scheduling only, single primary instructor, with group schema foundation. No live provider send was performed. Cron/service-binding behavior is unit-tested and dry-run bundled, not deployed. Failed/uncertain delivery requires operator review; no bulk retry UI is included. Unknown legacy consultation date formats fail closed and may require separate investigation if introduced later. Browser acceptance used synthetic accounts; no real student onboarding, membership update, plan generation or Academy progress was performed. Production performance under load is outside this readiness test.

## 27. Future production configuration

Preserve current account, DB, BETTER_AUTH_URL and unrelated secrets. Main Worker reuses existing Resend/Telnyx configuration and existing consent rules. Add `TEACHING_DISPATCH_SECRET` securely to main and scheduler with identical high-entropy value, without printing it. Main `TEACHING_DELIVERY_ENABLED` and scheduler `TEACHING_SCHEDULER_ENABLED` ship false. Scheduler name `hft-teaching-reminders`, service binding `HFT_APP` → `hft-landing`, cron every minute, public fetch 404. Enable both flags only in a separately authorized staged activation after smoke checks. No provider keys belong in the scheduler.

## 28. Rollback/recovery

First disable scheduler and main delivery flags to stop new claims. Roll back main Worker to `ceb65b64-9a49-4342-9a25-d93f0dcd010c`. Preserve additive schema, session/history/outbox/attempt records and original data; do not DROP or replay migrations. 0033's consultation calendar guards remain intentionally authoritative after a Worker rollback. Review any active teaching reservations before returning to old booking behavior; do not silently discard them. If a database restore is truly required, review legitimate writes since the new backup/bookmark before Time Travel/export recovery; it is not a routine rollback step and can lose subsequent writes. Never blindly retry an UNCERTAIN provider attempt.

## 29. Decision and recommended future controlled procedure

**YES**, ready for controlled production migration/deployment using this exact frozen candidate. **Not deployed.** Future production actions require a new explicit authorization.

1. Verify all 458 manifest hashes and source archive hash; use the isolated candidate only. Recheck production Worker is still the recorded baseline, DB identity is unchanged and migration level is still 32. If anything changed, stop and reevaluate rather than assuming this report still applies.
2. Capture a new protected production export and Time Travel bookmark immediately before mutation; restore/check it locally, record original row fingerprints/counts and FK result. Confirm rollback Worker availability.
3. From the verified candidate, use existing Wrangler workflow to apply only pending migrations **0033 then 0034** to `hft-data` remotely. Check each result; stop at any failure. Never replay 0001–0032. Verify ledger 34, original rows/values intact, FK check zero, calendar timestamps valid and no unintended reservations.
4. Deploy only the frozen built main candidate using the existing OpenNext Cloudflare workflow, preserving current URL/account/DB and unrelated secrets; keep main delivery false. Record deployment/version. Do not rebuild/deploy the dirty repository and do not reinstall Lesson 1.
5. Deploy only the frozen scheduler artifact/config with scheduler false; confirm service binding and cron. Configure the shared dispatch secret securely on main and the now-created scheduler. No provider sends should occur while either flag is false. Preserve all unrelated config when applying flag overrides.
6. Run non-destructive public/authenticated instructor/student route smoke checks for existing functionality and teaching pages. Inspect real records read-only only; do not request lessons or change plans/placements/memberships/progress for Carlos/Skip/Z or any real student. Stop and rollback on failure.
7. Under explicit activation authorization, use isolated synthetic production QA identities/approved recipients to verify scheduling and one controlled delivery path, consent, idempotency, logs and signed Cron invocation. This step may send messages and was **not performed or authorized by this readiness task**. Keep real recipients excluded until checked. Enable main/scheduler flags in the controlled release configuration only after required smoke gates; monitor claims, stale skips and UNCERTAIN outcomes.
8. Confirm instructor availability/allowance configuration through the protected application before allowing real scheduling. Publish exact production routes `/admin/teaching` and `/lessons`, capture final Worker IDs and recovery point, then stop. Phase B remains excluded.
