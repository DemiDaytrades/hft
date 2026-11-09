# HFT controlled production release — BLOCKED BEFORE MUTATION

Date: 7 November 2026. No deployment, production migration, export/restore, account/member change, plan generation, assignment, message or payment was performed. No product features were changed during this release attempt.

**Blocking gate:** the production D1 SELECT-only schema request failed with Cloudflare API **7403**: “The given account is not valid or is not authorized to access this service.” This was retried outside the local sandbox as required, so it is not merely a sandbox/network failure. Production mutation was stopped. Automatic approval review did not reject the request; Cloudflare rejected account/service authorization.

## 1. Release manifest

`2026-11-07-release-manifest.json` captures all **330** changed/untracked paths at inventory time, per-file SHA-256, disposition, all 32 migration checksums, configured targets and explicit exclusions. It is a candidate inventory, not a declaration that every path is releasable. HEAD is `8609c225c241fc1765e54eb4a73502d7456d1e9c` on `main`; 42 tracked modifications and 288 untracked files mean that HEAD does not represent the completed work or identify the currently deployed production version.

## 2. Files/features deployed

**None.** Candidate groups include Academy security and interactive/visual Lesson 1; mastery/homework/remediation; Instructor Academy and read-only preview; financial plans; invite delivery; lifecycle; learning paths; related auth/member/privacy and Intake V2 code. Existing broader booking, checkout, marketing, legal/policy and pricing changes are also present. In particular the marketing diff adds a booking CTA and $250/month in-person membership alongside checkout/webhook changes. These cannot be silently bundled or simply stripped without checking dependency/scope and verification history. The manifest flags broader surfaces for review.

Exclude local QA credentials/accounts/data, `.dev.vars`, `.env.academy-qa.local`, all `.wrangler` state/backups, temporary `/tmp/hft-*` harnesses and HTML/auth response artifacts. They are not application release data. Local ignored files were confirmed ignored. Tests/fixtures and the offline seed are development resources, not production seed data. No production runtime imports of local QA credentials were found in the inspected sources.

## 3. Production schema before release

**Unknown; gate failed.** Target configured in `wrangler.jsonc`:

- Worker: `hft-landing`.
- Cloudflare account: `780fda88bb137eedefd9d3981a8816b4`.
- D1: `hft-data`, ID `baec727f-4a9a-4915-81e2-d549c5095fb5`, binding `DB`.
- Schema-read attempt used only `SELECT type,name,tbl_name,sql FROM sqlite_master ...`; no CREATE/ALTER/migration initialization.

The remote authorization failure prevents confirmation of the migration ledger, current columns/tables, student/curriculum state, duplicates, foreign-key issues, or drift. Local schema/state is not evidence of production state.

## 4. Pending migrations identified

**Exact production pending set cannot be identified safely.** The complete local chain is 0001–0032. Newly relevant files include:

| Migration | Purpose / preflight concern |
|---|---|
| 0027 | Interactive events, attempt/homework/progress version columns and filtered unique indexes. Check predecessors and actual columns/indexes before applying. |
| 0028 | Replaces the open-learning-attempt index with version-scoped uniqueness; requires exact 0027 index and duplicate check. |
| 0029 | Versioned financial plans and completed-source immutability triggers. Verify existing source/status assumptions. |
| 0030 | Complimentary delivery attempts, idempotency/history and restrictive foreign keys. |
| 0031 | User lifecycle columns/default ACTIVE, history and session/invite restrictions. Existing bans/entitlements must remain intact. |
| 0032 | Placement snapshots, immutable history, lesson classification/domains, versioned paths/decisions/enrollment links. Existing lessons default to required core; no bulk placement or enrollment. |

Do not assume only these six are pending. Migrations 0007–0032 are untracked locally, but untracked status says nothing about prior production application.

Whole-chain SQL inspection also found **0009 rebuilds `communication_log` with INSERT-SELECT, DROP TABLE and RENAME**, and **0028 drops/recreates an index**. These are deliberate existing migrations, not a safe basis for blindly reapplying the chain. If 0009 is pending, verify row/schema compatibility and recovery before its table rebuild. 0029 contains status updates inside publication triggers; these are not an immediate bulk publish/backfill. No destructive migration was executed.

## 5. Backup/recovery method

**No verified production recovery point was established.** Local backups from acceptance testing are not production backups.

After authorization is repaired, supported recovery preparation is a restricted local SQL export (`wrangler d1 export hft-data --remote --output <private-ignored-path>.sql`) plus a recorded D1 Time Travel bookmark (`wrangler d1 time-travel info hft-data`). Record UTC time, target IDs, export checksum/size, bookmark, deployed Worker version and schema/migration ledger; verify restoration against an isolated database before production mutation. Never print database contents/secrets into the release report. Cloudflare documents [D1 import/export](https://developers.cloudflare.com/d1/best-practices/import-export-data/) and [Time Travel recovery](https://developers.cloudflare.com/d1/reference/time-travel/).

## 6. Migrations applied

**None.** No remote migration application command was run.

## 7. Migration verification

**Blocked.** Need a successful SELECT-only schema/ledger comparison, duplicate/constraint checks, a rehearsal against a protected production export copy, and a verified recovery point before any approval to execute. Fresh in-memory test migrations from earlier phases do not prove production compatibility.

## 8. Configuration/binding verification

Configured locally, **not verified in production**:

- `DB` D1 and `ASSETS`; new/configured `ACADEMY_BUCKET` R2 target `hft-academy-uploads` must be confirmed to exist and be bound.
- Auth requires production `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`; preserve existing secret and production origin. Never substitute local QA settings.
- `SETTINGS_ENCRYPTION_KEY` protects D1 settings; preserve the existing encryption key or encrypted payment configuration may become unreadable.
- Stripe key/webhook secret are read from encrypted `app_setting` keys (`stripe.secret_key`, `stripe.webhook_secret`), with existing product/price/portal settings. Check only existence/encrypted flags and approved nonsecret IDs, not secret values. No Stripe API call/charge was made.
- Email uses `RESEND_API_KEY`, sender configuration (`EMAIL_FROM` in Wrangler vars), and `RESEND_WEBHOOK_SECRET` where webhook delivery tracking is used.
- SMS uses configured Telnyx or Twilio: `TELNYX_API_KEY`, from number/profile and webhook public key, or `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, from number. Existing sender/provider routing must be verified without sending a message.
- Communication log/settings/delivery tables must match the migration ledger. Secure invitation URLs depend on production `BETTER_AUTH_URL`.

Initial secret-name and deployment-list attempts failed in the sandbox/auth context and are **not** successful production configuration checks. After the escalated D1 request failed authorization, no further production release operations were attempted. Secret presence/values and current Worker binding metadata remain unknown.

## 9. Pre-deploy tests

**Not rerun as a release candidate after the failed production preflight gate.** No release-candidate PASS is asserted. Most recent development verification from the preceding visual phase was 51 focused checks passing. A resumed release must freshly run the requested Academy/Lesson1, financial-plan, Intake V2, complimentary invite, lifecycle, paths and authorization/privacy suites against the frozen candidate.

## 10. Full suite

**Not rerun for this blocked release.** Last development run: 263 tests, 262 passed, sole known availability-overlap failure. The unchanged development failure is `lib/availability.test.ts` / “overlaps detects intersecting slots”, `RangeError: Invalid time value` in `lib/availability.ts`. A resumed release must rerun and demonstrate that no new failures exist; prior results are not a release approval.

## 11. TypeScript

**Not rerun for this blocked release.** Last development verification passed. Must rerun on the frozen release candidate before production mutation.

## 12. Build

**Not run; gate stopped release preparation before a production-equivalent candidate build.** Existing `.open-next/worker.js` and server handler are dated **6 November 2026 18:20 local**, before the completed 7 November work. They are stale and must not be uploaded directly. The existing deployment script performs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`; a resumed release should run and verify the build separately before entering the mutation/deployment phase.

## 13. Deployment result/identifier

**Not deployed.** No deployment ID or deployed commit is claimed. Current production version could not be retrieved under valid verified CLI authorization.

## 14. Production smoke tests

**Not performed after the failed preflight.** Existing site observations or localhost tests are not post-release production smoke tests. The full requested non-destructive checklist remains pending.

## 15. Authentication/security results

**Production unverified.** No authentication or role checks were relaxed. No production test user/session was created. Earlier local protection tests passed; they do not certify current production. On resume, verify anonymous denial and approved non-destructive staff/student checks without accessing foreign/private data or modifying actual students.

## 16. Instructor Academy production result

**Not released / unverified.** Local implementation exists; production must not be represented as updated.

## 17. Lesson 1 production result

**Not released / unverified.** Lesson 1 is authored in the repository and installed locally by an offline seed. The migration chain does not install this teaching content. The offline seed explicitly refuses remote use; do not bypass that guard or upload the local QA database. A version-aware production curriculum installation/mapping step must be reviewed against the actual existing production catalog, with no automatic enrollments or fake future lessons. Production catalog state is currently unknown.

## 18. Financial-plan production result

**Not released / unverified.** Existing reviewed/versioned workflow is available in code; generating plans is per student and requires an exact completed Intake V2 source. No production plan was generated or published.

## 19. Personalized-placement production result

**Not released / unverified.** No production reassessment, path approval, skip or assignment was performed. Financial readiness remains separate from educational scoring in the candidate architecture.

## 20. Complimentary-invite production result

**Not released / unverified.** No invitation or email/SMS was sent. Secret/sender/idempotency schema and UI smoke checks remain required.

## 21. Student-lifecycle production result

**Not released / unverified.** No student was deactivated/reactivated or deleted. Active/former UI and entitlement checks require post-release non-destructive verification.

## 22. Intake V2 workflow available to Demi

**Browser capture remains partial.** `/admin/student-intake-v2` selects an existing active student and loads/creates a draft. Financial Health, Debt/Credit, Monthly Obligations, Trading Capital and Trading Behavior have editable sections. Trading Experience, Risk Profile, Income Goal and legacy behavior sections remain read-only placeholders; Instructor Assessment is explicitly read-only; Acknowledgments have no capture UI; Review & Complete explicitly says no completion actions are implemented.

The existing protected backend **does** expose a no-hand-edited-SQL route:

1. Authenticate staff normally; select the actual student. GET `/api/admin/student-intake-v2` loads an owner-scoped draft/latest completed source; GET `action=registry` returns approved acknowledgment text versions.
2. POST `action=create-draft` with student ID (and real booking/source references if present).
3. POST `action=save-student`, with `mode=instructor_entered_for_student`, approved `sections` FieldValue contracts and real collected answers only. Never map missing answers to guesses.
4. POST `action=save-instructor` with approved instructor assessment fields from the real consultation.
5. POST `action=save-ack` with actual confirmations and required provenance/audit inputs. The server stamps current approved acknowledgment versions and actor/time; do not invent historical consent or mark confirmations merely to pass validation.
6. POST `action=evaluate-flags`; then `action=complete`. Completion validates required answers, instructor fields and acknowledgment provenance; failure returns 422 issues. Mutable writes use version checks, and finalized sources become immutable.
7. Once genuinely complete: open `/admin/financial-plan?studentId=<id>`; intentionally generate from the exact completed intake, edit/save, review, approve, then publish through the existing workspace/API. API actions are generate/save/review/approve/publish with required version/revision inputs.
8. Open `/admin/learning-path?studentId=<id>`; generate/review/save/approve educational placement and the learning path. Approval assigns existing published curriculum only; missing curriculum stays planned. No automatic assignments before approval.

This demonstrates existing backend capabilities, **not a validated practical operator workflow for Demi**. There is no complete browser capture/import client or previously verified operator runbook for entering every required field and genuine acknowledgment. A supervised API process could be usable without database hand-editing, but it must first be rehearsed end-to-end with approved payloads/provenance and an authorized operator. Until that is demonstrated, routine controlled-student Intake V2 completion remains a launch blocker. No missing UI was implemented during this release.

## 23. Browser/UI limitations

Full Intake V2 capture/finalization remains partial. Local visual acceptance cannot substitute for production. Legacy production curriculum may require deliberate mapping to the interactive Lesson 1 reference. Wider booking/checkout/marketing changes and the known availability failure need explicit release-scope review. The source tree is not a frozen, built candidate yet.

## 24. Rollback/recovery instructions

Nothing was changed in production, so **no rollback is currently required**. Do not execute a restore for this stopped attempt. Before a future release, record a validated Worker rollback target and D1 recovery bookmark/export. If a future migration fails, stop writes/retries and assess the exact error. Restoring a D1 bookmark affects subsequent legitimate writes; use an incident-specific reviewed recovery decision, not blind SQL reversal. Restore the matching application/database state together; do not rotate or replace valid secrets as a rollback tactic.

## 25. Controlled student use approved?

**No launch approval from this attempt.** Required production access, schema comparison, backup, configuration checks, candidate build and production smoke/security checks are incomplete. Intake V2 operator readiness is unresolved.

## 26. Next steps for Carlos, Skip and Z

Do not modify any of these students during the release. After the release gates and operational workflow are cleared, separately verify each student's questionnaire provenance, actual approved Intake V2 answers/completeness/acknowledgments, real consultation assessment, financial-plan readiness, independent educational placement evidence, entitlement/lifecycle and current curriculum assignment. Generate/review/publish plans and approve paths only as individual authorized actions. No bulk launch, invitation or placement.

## 27. Required actions to unblock

1. Restore **Wrangler authorization to the intended Cloudflare account and D1 resource**, or correct the target after confirming actual ownership. Current authorization returns 7403. Do not create a temporary Cloudflare account or substitute a different database.
2. Resume read-only schema/ledger/constraint and Worker binding/secret-name checks; identify the exact pending migration set and production curriculum state.
3. Resolve/freeze the broader working-tree release scope; review the manifest, all application dependencies and incomplete surfaces. Produce a reproducible candidate and verified build; do not deploy the stale `.open-next` artifact.
4. Establish and rehearse reliable recovery, then rerun every requested release test/build gate.
5. Demonstrate a practical safe end-to-end Intake V2 capture/finalization workflow, or authorize a separate implementation phase to finish that UI. Review the actual Lesson 1 production-installation plan.
6. Only when all gates pass, continue the already conditionally authorized migrations/deployment and non-destructive production smoke tests. Do not ask the user to approve an unreviewed/destructive ambiguity or treat this report as gate clearance.
