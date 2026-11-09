# Controlled production release — DEPLOYED AND VERIFIED

**Controlled student onboarding may begin: YES — controlled, instructor-led onboarding.**

The release resumed after migration 0032. No migration was replayed, rolled back or modified. Only the frozen candidate was deployed. No real student's questionnaire, financial plan, placement, membership, Academy assignment or progress was changed. No invitations, email/SMS, Stripe transactions, bulk student migration or new feature work occurred.

## D1 7500 diagnosis and health

Wrangler is authenticated through the existing OAuth identity `teamdemi94@gmail.com`, on the confirmed account `780fda88bb137eedefd9d3981a8816b4`. The configured production D1 remains `hft-data`, UUID `baec727f-4a9a-4915-81e2-d549c5095fb5`. No authentication/account/database configuration was changed.

Direct read-only checks all succeeded:

- `SELECT 1 AS healthy` → 1.
- Migration ledger → all **32** migrations present.
- User count → **13**.
- Isolated `PRAGMA foreign_key_check` → zero violations.
- Exact previously failing combined ledger/foreign-key request → success, 32 ledger rows and zero violations.

Every health request reported zero writes and `changed_db=false`. No SELECT-only `--file` import path was used.

The previous 7500 reference `e_PVSMDp_a1a2522fb49d4453835ce5b01620216e` was **not reproducible**. Neither the isolated statements nor the exact mechanism now fails. This is consistent with a transient Cloudflare API/D1 error; the historical internal cause cannot be established from that reference alone. No evidence of a database/schema defect was found. The release resumed only after these checks passed.

## Frozen deployment and configuration

- Candidate fingerprint: `8f9085173e573edae8fe6f8294dcdf5f0edb9be539ae0711294bba07f8b1847d`.
- All 392 source hashes, both private archive hashes, installer hash and every extracted built file were verified unchanged before deployment. Frozen source hashes still match after verification.
- Deployment used only the frozen built archive extracted to `/private/tmp/hft-production-release-20261107`; the mixed working tree was not deployed or rebuilt.
- **Deployment ID:** `b6023013-7a39-428a-b383-3e73acc0b677`.
- **Worker version:** `4ce752ee-afe7-4112-a742-eaa6dcf08880`, deployed at 100%.
- Deployment created: **2026-11-07T20:51:16.697056Z**.
- Production site: `https://highfrequency.vip`.

The prepared **`BETTER_AUTH_URL=https://highfrequency.vip`** was applied with the frozen Worker deployment. Read-back verified that value, the unchanged D1 UUID and preserved secret binding names. Comparing the immediately preceding version confirms the existing `EMAIL_FROM` value was preserved; the only added plain variable is `BETTER_AUTH_URL`. Deployment used `--keep-vars`; no secret-update command was issued and no secret values were printed.

R2 remains deferred and absent from this text-only controlled release. Unrelated checkout/marketing/booking changes were not deployed. The excluded booking API returns 404.

## Migrations

**0001–0032 remain present; none were rerun during this resume.** Migrations 0027–0032 were completed in the prior attempt. Final snapshot comparison confirms the entire migration ledger is unchanged from the post-migration/pre-deployment backup.

## Lesson 1 installation and publication

The exact reviewed artifact checksum was confirmed before execution:

`ad9f384a1419df214cc3635b74177e4d28005d57d0ecd3d1c6d9732610cd48fb`

Its four statements were sent in one guarded batch through Wrangler's direct query path: one guard, then one insert each for lesson, quiz and text homework. First run changes: **0, 1, 1, 1**. Identical rerun changes: **0, 0, 0, 0**, with zero rows written on the rerun.

Installed mapping:

- HFT Trading Foundations: `02863cd745984e0b8898beb4550c458d`.
- Forex Market Fundamentals: `m1_forex_fundamentals`.
- What Is Money?: `hft-money-1`, sort order 0.

The artifact creates drafts. The separately planned publication step was rehearsed locally against the fresh production snapshot and then applied as a guarded batch, changing only status/updated timestamp for the intended course, module and reference lesson. Teaching content, assessment banks, scoring, mastery, remediation and homework gates were not edited. No learners were enrolled as a seed side effect.

Final state: **one published reference lesson, one quiz, one text homework assignment**. The seven older lessons remain draft; no Lesson 2 or other future curriculum was created or published.

## Production smoke results

| Area | Result and scope |
|---|---|
| Admin authentication | **PASS** — existing admin browser session remained authenticated after deployment; no credential/session provisioning needed |
| Protected routes | **PASS** — anonymous admin/Academy pages redirect to login; private plan APIs return 401; no private questionnaire/assessment/answer payload exposed |
| Intake V2 | **PASS** — authenticated workspace loads with student search/selector, capture sections, Instructor Assessment, Acknowledgments and Review & Complete; no student selected or draft created |
| Financial Readiness | **PASS** — instructor workspace and student selection control load; no real student's plan opened/generated/published |
| Learning Paths | **PASS** — instructor workspace loads; no real student's recommendation generated or placement changed |
| Instructor Academy | **PASS** — actual browser navigation through HFT Trading Foundations → Forex Market Fundamentals → What Is Money? |
| Protected lesson inspection | **PASS** — published/ready reference lesson, staff-only mastery banks/rubrics and required progression rules render |
| Preview as Student | **PASS** — protected browser-only simulation loads and remains explicitly non-persistent |
| Redesigned lesson | **PASS** — production styles, ten-step journey, immersive barter scenario, large response tiles, mastery/homework panels and locked gates render; selected tile and keyboard Check response produce “Connection made” feedback and “Simulation only — nothing saved” |
| Complimentary administration | **PASS** — switched invite type to Complimentary Student; 30-day duration and delivery controls render; no email entered, no invite generated/sent |
| Active/Former Students | **PASS** — both views load; former view shows zero members; no lifecycle action submitted |
| Deferred booking mutation | **PASS** — route remains 404 |
| Student privacy/security | **PASS within non-destructive scope** — logged-out lesson routes require login and plan APIs reject unauthenticated access; staff inspection/preview are protected |

No production student was impersonated to test cross-student quiz/plan access or forced-password/entitlement changes. Those cases passed in the frozen candidate's local security tests. No real student quiz, homework, progress or plan submission was performed in production. The production browser tested interaction feedback only in the explicitly non-saving preview.

## Final data integrity

A fresh private post-release export was restored locally and compared table-by-table against the immediate post-migration/pre-deployment backup.

**Only authorized curriculum tables changed:**

- `academy_course`: same row count; target publication metadata.
- `academy_module`: same row count; target publication metadata.
- `academy_lesson`: 7 → 8; approved reference lesson inserted/published.
- `academy_quiz`: 0 → 1.
- `academy_assignment`: 0 → 1.

**Every other table is identical**, including users, memberships, questionnaires/intakes, financial plans, learning paths, enrollment/assignments, learning events, quiz attempts, homework submissions, communications and progress. User count is still 13. Ledger count is still 32. Final restored snapshot has zero foreign-key violations. Preview interactions produced no saved learning data.

## Rollback and recovery

**Correction to earlier reports:** Wrangler deployment history is oldest-first. The first entry previously cited was an older retained version, not the version immediately before this release. The correct immediately preceding targets are:

- Previous deployment: `eab4c624-eaa9-4cc8-8b3d-76648a183e44`.
- **Previous Worker version: `8a36201a-f0c8-480b-bf4c-13d6123cf34d`.**

The current and immediately preceding versions' secret binding names match. No rollback was performed.

Fresh post-migration/pre-deployment Time Travel recovery bookmark:

`0000022c-00000002-0000511c-cab39f68270d3eab73d3e51afed6c017`

Private ignored recovery directory: `.wrangler/release-production/2026-11-07/` (directory mode 700; exports mode 600).

- `post-migration-predeploy.sql`: schema 0032, before installation; SHA-256 `643bda4e44c049c8f87b4c476673bc605cb6936039792e809ff7eae565b1d583`.
- `after-release.sql`: verified final state; SHA-256 `0eea50a7abe7d01fc9bddb6dd9a638dce007789063fc9455821a0f6d374a1455`.
- The original pre-migration export/bookmark are also retained privately.
- Deployment/configuration metadata, install/idempotence/publication results, direct health results and final integrity comparisons are retained privately there.

Worker rollback does not reverse schema or curriculum publication. Review compatibility and lesson visibility together before any rollback. Database restoration can discard legitimate writes made after the chosen bookmark; do not restore blindly after onboarding begins.

## Warnings and operating limits

- Begin controlled instructor-led onboarding; no bulk onboarding was performed.
- Capture only actual collected responses and genuine acknowledgments. Complete, review and approve each student's plans/path deliberately through the website.
- R2 upload homework is deferred; the approved Lesson 1 homework is text-based.
- No video asset is attached; the approved lesson's existing fallback remains. No new video/content was fabricated.
- Invitation/provider delivery and real student submissions were intentionally not exercised. No invitation is implied by successful form/configuration checks.
- Non-fatal existing bundled third-party duplicate-member warnings appeared during upload; deployment and smoke checks succeeded.

Useful URLs:

- Intake V2: `https://highfrequency.vip/admin/student-intake-v2`
- Financial Readiness: `https://highfrequency.vip/admin/financial-plan`
- Learning Paths: `https://highfrequency.vip/admin/learning-path`
- Instructor Academy: `https://highfrequency.vip/admin/academy`
- Lesson 1 inspection: `https://highfrequency.vip/admin/academy/inspect/hft-money-1`
- Preview: `https://highfrequency.vip/admin/academy/preview/hft-money-1`
- Active/Former: `https://highfrequency.vip/admin/users` and `?view=former`

[Machine-readable verification evidence](2026-11-07-production-verification.json). **Production verification complete; stopped without starting real student onboarding.**
