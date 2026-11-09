# HFT Teaching Phase A — controlled production deployment

Production scheduling code is deployed. **Confirmation/reminder delivery: DISABLED.** Student production acceptance is awaiting an authenticated existing synthetic student login; no real student records were used for this test. **Real student scheduling clearance: NO, pending that acceptance and Demi's availability setup.** No production regression was observed and no rollback was performed.

## 1. Frozen candidate verification

Only `docs/releases/2026-11-07-teaching-phase-a-candidate.json`, revision 3, was used. Fingerprint `e1621fc6144debb2f0d26c5663c0681a07284e72611e040a2937437fed02ac72`. All 458 source hashes, the private frozen source archive and all 1876 build-file hashes matched before mutation. Source hashes also matched after deployment. The 35 scoped Phase A differences and baseline are listed in the unchanged manifest. The dirty repository's other work was excluded. The local-only `.dev.vars` override was removed from the release directory before deploying; no local credentials/URLs were published. The complete frozen test suite was freshly rerun: **431/431 PASS**, no failures/skips. TypeScript/OpenNext/scheduler dry-run results are those of the hash-identical readiness candidate; no rebuild or source edit was needed for deployment.

## 2. Fresh recovery point

Export timestamp UTC: `2026-11-08T06:01:45.602597+00:00` (November 8, 2026 at 12:01 AM America/Chicago). Database `hft-data`, ID `baec727f-4a9a-4915-81e2-d549c5095fb5`, account `780fda88bb137eedefd9d3981a8816b4`. Private export `.wrangler/teaching-phase-a-deploy/2026-11-08/production-before.sql`, SHA-256 `ca113da4764c4b180e1024dd0b6b6c6170274872355d6186c9d74610cb1bdccc`, 150965 bytes. Restored successfully: integrity ok, zero FK violations. Time Travel bookmark `0000023b-00000000-0000511d-b5f9b2c53679b4208292d71242f3ba67`. Protected recovery artifacts stay excluded from release.

The fresh export contains 194 original rows across 59 tables; the one-row difference from readiness is a newly existing login session. All readiness snapshot rows were retained. Both migrations passed again on this refreshed local copy before production mutation.

## 3–4. Migration results

**0033_weekly_teaching.sql: PASS.** **0034_teaching_delivery.sql: PASS.** Wrangler confirmed these were the only pending migrations and applied them in this order. Ledger now contains 34 entries. **0001–0032 were not replayed.** No rollback/destructive migration occurred. Post-migration direct read-only checks and export restore succeeded before the Worker was deployed.

## 5–6. Existing data and foreign keys

PASS. Original 194 rows/values across 59 tables are retained after migrations and browser smoke testing; only the migration ledger appended two rows. All 13 user/membership records, 4 consultations, 7 legacy availability rules, original questionnaire/intake data, financial plans, learning paths and Academy progress remain unchanged. Foreign-key violations: **0**. All four consultation calendar windows normalize successfully; invalid windows: **0**.

## 7. Communication configuration

Existing production DB, BETTER_AUTH_URL `https://highfrequency.vip`, email/SMS provider and other non-asset binding metadata are preserved. `--keep-vars` was used in the existing OpenNext deploy workflow. No unrelated secret/configuration changes were made. No Resend/Telnyx/Twilio call was made, invitation sent or Stripe transaction performed.

The reviewed new main delivery flag is false. Scheduler flag is false. The shared dispatch signing secret was deliberately not added while the system remains disabled; its secure installation and controlled synthetic-recipient acceptance remain activation prerequisites. Existing consent, opt-out, logging, revision idempotency and uncertain-delivery protections are covered by the frozen tests.

## 8–9. Deployment identifiers

- Main deployment: `7b78d0e1-3372-44a6-9459-1b354ded6b00`.
- Main Worker version: `fad1f0e2-683c-4f15-baea-e3b6c8147951`, 100% traffic.
- Main timestamp UTC: `2026-11-08T06:04:07.649114Z` (November 8, 2026 at 12:04 AM America/Chicago).
- Scheduler deployment: `97319d11-d2a2-4610-a749-3b7f5d1ae553`.
- Scheduler Worker version: `7b957f30-3f47-4b4d-8b5e-e35b8b66eb8c`.
- Scheduler name: `hft-teaching-reminders`.

## 10. Instructor production smoke

PASS in actual authenticated Chrome at `https://highfrequency.vip/admin/teaching`, using Demi's existing authorized administrator session. Teaching Center, timezone/default inputs, availability disclosure, Calendar date control, Pending and Upcoming views, and refresh all load. No setting was saved and no booking created. Initial setup warning is correct because `teaching_config` is empty. Existing Instructor Academy also loads with the previously published curriculum.

## 11. Student production smoke

**PENDING — not claimed as passed.** Anonymous `/lessons` correctly redirects to login. An eligible existing synthetic identity (`hft-test-student@example.com`) is present, but its login is not available to the agent and no active session exists for it in the recovery snapshot. An Incognito login was requested from Demi. No password was guessed/reset and no new account/entitlement was created.

The eligible student page, authenticated production slot response and student-role negative checks therefore still require this login. Actual student request/accept/reschedule/cancel and 390px acceptance passed against the hash-identical built Worker and migrated production-data copy during readiness; that evidence does not substitute for this remaining production acceptance.

## 12. Calendar/consultation coexistence

PASS for persisted schema/state and read-only production normalization. All four original bookings remain exact; shared calendar views/triggers/indexes are installed. No teaching reservations were created. Teaching setup/availability is empty, so production cannot offer selectable times yet. Demi must configure defaults and hours before testing non-empty slot generation. Concurrent teaching/consultation/reschedule races and DST/buffer boundaries passed in the production-copy rehearsal; no real production conflict was intentionally created.

## 13. Authorization/security

PASS: anonymous `/admin/teaching` and `/lessons` return 307 `/login`; anonymous teaching API returns 401; authenticated instructor route loads. Disabled internal delivery POST returns 503 with `disabled:true`.

NOT REPLAYED LIVE: student denial of instructor controls, cross-student session denial and deactivated-student denial need a suitable authenticated synthetic test identity/state. There are no deactivated accounts in the original production snapshot, and no real account was deactivated to test this. These protections passed the frozen 431-test suite and local production-copy tests. No production security bypass/session fabrication was used.

Python urllib's default User-Agent was rejected by Cloudflare with error 1010 before application execution. Normal curl returned expected public/auth results. An initial smoke URL `/api/admin/academy` was invalid (404); the actual API is `/api/admin/academy/learning`. Neither check established an application regression. Browser production instructor rendering passes.

## 14–16. Scheduler/outbox, delivery status and remaining configuration

Infrastructure deployed with service binding `HFT_APP` → `hft-landing`, every-minute cron and scheduler flag **false**. Both disabled flags were confirmed from deployed Worker metadata. The internal endpoint is inert; no provider credentials are copied to the scheduler. Production has zero sessions, zero outbox jobs and zero delivery attempts. Job creation and recheck/idempotency behavior passed mocked/frozen local tests; no production booking was created merely to generate a job.

**Confirmation/reminder delivery: DISABLED.** Before relying on messages for a real confirmed lesson:

1. Securely install identical high-entropy `TEACHING_DISPATCH_SECRET` (32+ characters) on main and scheduler; preserve unrelated secrets.
2. Complete the separately controlled synthetic-recipient provider/Cron check, current consent/logging/receipt/idempotency checks and reviewed flag activation (`TEACHING_DELIVERY_ENABLED`, `TEACHING_SCHEDULER_ENABLED`). Avoid real student messages during testing.
3. Monitor stale skips, failures and UNCERTAIN attempts. Never blindly retry uncertain delivery. No live delivery success is claimed by this release.

## 17. Rollback

Recorded main rollback Worker: `ceb65b64-9a49-4342-9a25-d93f0dcd010c` (prior deployment `a3942ac6-54f9-4869-a665-cf65e237c88c`). No rollback performed because no new Worker regression has been found. If needed, disable delivery/scheduler first, roll back only the Worker using the established Wrangler workflow and retain successful additive migrations/history. Shared consultation guards remain installed. Do not DROP or replay migrations; use the fresh recovery point only under the established incident recovery procedure after reviewing legitimate subsequent writes.

## 18. Real students

**Carlos, Skip, Z and all other original student records were not modified.** No booking, questionnaire/plan/placement/progress/membership change, invitation, email/SMS or transaction was created for them. The final production export comparison verifies their original stored data remains unchanged.

## 19. Can real students begin scheduling?

**NO — not yet cleared.** The release is deployed, but authenticated synthetic-student production acceptance and Demi's real availability setup remain. Delivery also remains disabled and must be disclosed until activated. No source fix or new feature is required to complete these operational checks.

Once student acceptance is complete, Demi's exact setup is:

1. Sign in as the intended instructor and open `https://highfrequency.vip/admin/teaching`.
2. Expand **Availability & teaching controls**. Verify IANA timezone (normally `America/Chicago`), lesson duration, buffer, request expiry and default lessons/week; choose the actual values, then **Save defaults**. This establishes the single primary instructor; another admin should not claim it first.
3. Under **Recurring weekly hours**, select each teaching day and actual start/end times, then **Save weekly hours** for each day. Times are in the configured instructor timezone.
4. Under **Date overrides & blocks**, add holidays/unavailable dates with **Block the entire date**, or date-specific replacement hours; **Save date override**.
5. Keep default one lesson/week unless intended otherwise. Use **Student weekly allowance** only for an authorized per-student exception with an audit reason; do not bulk-change students.
6. Refresh **Calendar**, **Pending**, and **Upcoming**. In the existing eligible synthetic student's `/lessons`, choose a configured future date and verify slots without submitting a request. Complete student/security acceptance before inviting real students to schedule.
7. Students use `https://highfrequency.vip/lessons`. Pending requests require instructor confirmation; no classroom is provided in Phase A. Explain that automated confirmations/reminders remain disabled until the controlled activation above.

Phase B, LiveKit, Lesson 2 and unrelated features remain excluded.

## Latest deployment request — 22-item result index

Read-only resumed check at 2026-11-08T06:16:10.537384+00:00: same deployed Worker, 34 migrations, 13 users, 4 consultations, zero FK violations. No deployment or migration replay. Incognito currently holds Demi's admin session, not the synthetic student's session.

| Requested result | Result |
|---|---|
| 1. Frozen candidate | 458/458 hashes still match revision 3. |
| 2. Recovery point | Fresh pre-migration export/bookmark recorded in section 2 above. |
| 3. Pre-deployment Worker | ceb65b64-9a49-4342-9a25-d93f0dcd010c. |
| 4. Migration 0033 | Successfully applied once. |
| 5. Migration 0034 | Successfully applied once. |
| 6. Original data | 194 original rows preserved across 59 tables. |
| 7. Foreign keys | Zero violations, including resumed direct production read. |
| 8. Consultations/calendar | Four original bookings retained; normalized windows valid. |
| 9. Communication config | Original provider/config bindings preserved; delivery disabled. |
| 10. Deployment | 7b78d0e1-3372-44a6-9459-1b354ded6b00. |
| 11. New Worker | fad1f0e2-683c-4f15-baea-e3b6c8147951, still serving 100%. |
| 12. Instructor smoke | PASS for authenticated page/defaults/calendar/pending/upcoming; dependent hours/overrides/allowance controls appear after instructor defaults setup. |
| 13. Student smoke | BLOCKED: Incognito is signed in as admin; existing synthetic-student login required. |
| 14. Calendar/conflicts | Schema/triggers active; authoritative conflict/buffer races passed local production-copy rehearsal. No production booking created. |
| 15. Authorization | Anonymous denial PASS; student-role production checks pending login; deactivated denial covered locally, no real account deactivated. |
| 16. Scheduler/outbox | Disabled scheduler deployed with cron/service binding; zero production test jobs/attempts; job lifecycle tested on frozen local candidate. |
| 17. Delivery status | DISABLED. |
| 18. Activation | Shared signing secret on both Workers, controlled synthetic-recipient delivery/Cron acceptance, then both reviewed enable flags. |
| 19. Rollback Worker | ceb65b64-9a49-4342-9a25-d93f0dcd010c; no rollback needed/performed. |
| 20. Carlos/Skip/Z | Not modified; original data comparison passed. |
| 21. Warnings | Student acceptance incomplete; instructor availability unconfigured; no automated notifications; no physical-mobile or production-load test. |
| 22. Can real students schedule? | NO — clearance pending student acceptance and instructor setup. |

No Phase B, LiveKit, Lesson 2, paid consultation, Stripe transaction, invitation, fake production scheduling activity or unrelated change was performed.
