# HFT resumed controlled release preflight — BLOCKED

Recorded 2026-11-07. This report supersedes the release decision in the earlier preflight report; it preserves that historical report and the original 330-file manifest. Cloudflare 7403 is resolved. The confirmed Cloudflare account/database configuration was not changed or reinvestigated.

## Decision

STOP. No application deployment, production migration, restore, student-record edit, live Stripe activity, or email/SMS was performed. There is no frozen, approved release candidate. No new product features or unrelated fixes were implemented.

Release blockers:

1. **Intake V2 cannot be finalized through the instructor application.**
2. **Full test suite fails:** booking availability overlap test throws `RangeError: Invalid time value`.
3. **Scope is mixed:** unrelated/unverified booking, checkout and marketing changes require separation and shared dependency review.
4. **Production lacks the reference interactive Lesson 1.** Migrations do not install it; the existing seed script is local-only.
5. **Invitation production configuration is incomplete:** neither current Worker bindings nor candidate Wrangler configuration supplies `BETTER_AUTH_URL`, which invitation generation requires. Candidate R2 binding must also be verified before release.

## 330-file scope review

See [resumed scope inventory](2026-11-07-resumed-release-scope.json), with every original path, original/current hash and disposition. All 330 hashes match the original snapshot; no implementation work was reset. New audit documents are outside that original snapshot.

| Disposition | Paths |
|---|---:|
| In-scope application candidates, not approved for release | 208 |
| Mixed shared dependencies on hold | 7 |
| Wider checkout/marketing/booking work on hold | 23 |
| Pending migrations | 6 |
| Already applied migrations; do not replay | 20 |
| Tests/verification | 43 |
| Documentation | 21 |
| Local tooling | 2 |

Academy/access/security, Financial Readiness, complimentary invitation, lifecycle, personalized paths, Instructor Academy, and Lesson 1 have passing focused implementation tests. That is local implementation evidence, not blanket production acceptance. Intake V2 has implemented contracts/API and partial capture forms; its operational capture/completion workflow is explicitly incomplete.

Hold the marketing home/header/footer/site changes, public privacy/terms, booking pages/success, availability admin/rules/APIs, bookings admin/APIs, consultation-type APIs, and booking/payment helper changes. Mixed files include Stripe webhook, checkout, communications, join and welcome flows. The webhook mixes membership and booking payment handling. Communications imports booking/availability dependencies; Intake V2 also references consultation booking infrastructure. Simply dropping 23 files would not prove a working candidate. Isolate and review necessary shared hunks/dependency closure before freezing scope. No checkout prices, marketing claims, payment settings or booking behavior are approved by this preflight.

Excluded from deployment/data transfer: local QA credentials, `.dev.vars`, local environment files, local D1, private backup, temporary logs and stale `.next`/`.open-next` output. Existing build artifacts predate current work and must not be deployed.

## Intake V2 browser acceptance — FAIL

Authenticated local application verified at `http://localhost:3000/admin/student-intake-v2` as the existing local QA admin. No student was selected, created or modified. Clicking **Review & Complete** displays: “No completion UI/actions implemented.” The browser also states acknowledgment capture and completion are deferred.

Source: `app/(app)/admin/student-intake-v2/IntakeV2Workspace.tsx`, especially lines 273 and 312–326. Financial Health, Debt/Credit, Monthly Obligations, Trading Capital, and Trading Behavior have editable forms. Remaining sections render placeholders; Instructor Assessment is read-only, Acknowledgments is read-only, and the completion/validation panel is a placeholder. Page introduction still describes an earlier phase. The displayed percentage is not proof of server-validated completeness.

Backend endpoints already support draft creation, instructor-entered student answers, instructor assessment, acknowledgments, flag evaluation and completion. Their presence does not give Demi a practical browser workflow. Carlos, Skip and Z cannot currently have complete Intake V2 records entered/finalized solely through this UI. No real students' answers were inspected or altered.

Minimum separate implementation required before controlled use:

- Render editable controls for every required approved registry field, including currently uncovered student sections and instructor assessment; preserve existing questions/contracts and financial/educational separation.
- Select an existing student, create/resume a draft, explicitly save approved answers with instructor-entered provenance/source, handle stale saves and recover errors without losing answers.
- Capture genuine required acknowledgments with the approved text/version and audit provenance. Previously collected answers are not permission to fabricate acknowledgment or consent.
- Add review with server validation, actionable missing/invalid fields, deliberate finalization and immutable completed snapshots/new revision handling.
- Verify the completed snapshot can feed existing Financial Readiness generation/review/publication and independently reviewed educational placement/path workflows.
- Test end-to-end with local fixtures, including authorization, lifecycle restrictions, concurrent edits, incomplete data and repeated completion. No production SQL/manual JSON/terminal workflow should be required for operators.

Likely future edits: the Intake V2 workspace/page, section form components, existing API/service tests and browser acceptance tests. Reuse current endpoints/contracts; a new migration is not established as necessary for this UI gap. This preflight does not implement that phase.

## Actual production schema and curriculum

Read-only direct command results show migration ledger **0001 through 0026** applied. Production schema has 139 objects; it matches the pre-investigation schema. Expected 1–26 structure matches apart from harmless column ordering in `consultation_booking` (same names and definitions). Foreign-key check has zero violations.

Pending order, exactly:

1. `0027_interactive_learning.sql`
2. `0028_learning_versioned_open_attempt.sql`
3. `0029_financial_readiness.sql`
4. `0030_complimentary_invite_delivery.sql`
5. `0031_member_lifecycle.sql`
6. `0032_personalized_learning_path.sql`

Do not replay 0009 or any applied migration. 0028 depends on 0027 and changes the open-attempt index. Additive nullable/default fields preserve existing records. Production has zero quiz attempts, zero assignment submissions, zero Intake V2 records, and one lesson progress row at this snapshot.

Production currently contains one **draft** HFT Trading Foundations course, five modules and seven older lessons. There is no interactive/reference “What Is Money?” lesson. Applying these six schema migrations alone will not make Lesson 1 available. A reviewed, production-safe curriculum installation/mapping and publishing/assignment procedure is required; do not bypass the remote prohibition in the local seed script or copy the QA database.

## Recovery evidence

Private ignored backup: `.wrangler/release-preflight/2026-11-07/hft-data-before-release.sql`, directory mode 700, file mode 600. Do not commit or share it; it contains production data. Export size: 105614 bytes. SHA-256: `d5f37e1d2a3e6bc1cdb8c25f2a57256792aef8786998eb4a0849a5ca214d66ab`.

Local in-memory restore: PASS. Applying all six pending migrations to that restored production snapshot: PASS. Every original table's original column values and rows remained identical after migration; final foreign-key check: zero violations. This verifies the current snapshot, not future concurrent writes. No production restore was attempted.

Current deployed Worker version: `8e36d44b-8fc7-458f-bc86-6f1cb404388e` at 100%, deployment `48d1d1d6-ff1d-4cd4-a9dd-14228295b0be`, created 2026-11-06T21:05:18.032537Z. Preserve this Worker version for rollback. A Worker rollback does not undo D1 migrations. A fresh backup/bookmark and write coordination are required immediately before any later authorized migration; restoring an old database snapshot can lose subsequent legitimate writes.

### Read-only command anomaly

An initial SELECT/PRAGMA-only remote `wrangler d1 execute --file` call unexpectedly used Wrangler's import pipeline. It reported zero rows written but `changes: 1`, `changed_db: true` and advanced its bookmark. No DML/DDL was in the file. Subsequent direct `--command` reads all reported zero changes/zero writes/`changed_db: false`, and the complete schema matched the earlier snapshot. Therefore no application data/schema mutation was observed, but it would be inaccurate to claim no provider metadata changed. This anomaly was reported during execution. Do not use remote `--file` for future read-only verification; no speculative production restore was performed.

Pre-read Time Travel bookmark was recorded privately. Provider import result bookmark: `00000229-00000004-0000511c-18d7153205da4422e8def4e2ef5f5cca`. These are historical recovery evidence, not instructions to restore blindly. See Cloudflare's [Time Travel guidance](https://developers.cloudflare.com/d1/reference/time-travel/) and [export/import guidance](https://developers.cloudflare.com/d1/best-practices/import-export-data/).

## Environment prerequisites

Keep the confirmed Worker/account/D1 identifiers unchanged. Configure the verified canonical HTTPS `BETTER_AUTH_URL` before invitations; it is absent in both current bindings and candidate config. Verify candidate `ACADEMY_BUCKET` resolves to the intended existing `hft-academy-uploads` bucket and document access/retention; current deployed Worker has no such binding. No bucket was provisioned. Preserve `SETTINGS_ENCRYPTION_KEY` and existing encrypted payment settings; do not rotate encryption keys during release. Secret names were inspected, never values. Sender configuration and provider domain authorization/delivery must be checked without real mail; webhook verification needs `RESEND_WEBHOOK_SECRET` if delivery-event processing is enabled. Current secrets do not include it. No Stripe transaction/provider delivery test occurred.

## Verification and next release gates

Fresh current-tree diagnostics (not a frozen-candidate certification):

- Focused scope tests: **250/250 PASS** (all discovered lib tests except availability, legacy placement assessment and legacy questionnaire tests).
- Full suite: **262/263 PASS; FAIL** `lib/availability.test.ts`, “overlaps detects intersecting slots”, `RangeError: Invalid time value` through `addMinutes`/`overlaps`.
- TypeScript `tsc --noEmit`: **PASS**.
- Production-equivalent release build: **NOT RUN**. User requires this after final scope establishment; scope is not frozen and release gates failed. Existing build output is stale.
- Production smoke test: **NOT RUN**, because no deployment was authorized by passing gates.

Required before release: separately authorize/finish the minimum Intake browser workflow; resolve or safely isolate the availability failure and unrelated changes; review a production curriculum content plan; establish environment bindings; freeze exact dependency-complete candidate and migration checksums; then rerun focused/full tests, TypeScript and production-equivalent OpenNext build from that candidate. Refresh backup/recovery evidence, execute migrations in order only after gates pass, deploy that exact artifact, and perform non-destructive instructor/student route/security smoke checks without messages, payments or real student edits.

No release approval is implied by the passing local migration rehearsal. Stop here pending resolution of blockers.
