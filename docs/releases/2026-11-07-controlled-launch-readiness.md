# Controlled student launch readiness — READY FOR THE NEXT PRODUCTION PHASE

2026-11-07. Implementation and local acceptance complete. **The frozen release candidate is ready for the previously authorized controlled production migration/deployment phase. No deployment was performed.** This readiness decision replaces the previous blocked decision for this candidate only. The original working tree remains mixed and must not be deployed wholesale.

No production database/resource/configuration changes, production migrations, real student edits, live Stripe transactions, email or SMS occurred during this implementation. Cloudflare 7403 was not reinvestigated; confirmed account/database identifiers were retained.

## Completed blockers

### Intake V2 — PASS

Open `/admin` → **Student Intake V2**, or `http://localhost:3000/admin/student-intake-v2`. Search/select an existing student; no terminal/database operation is needed for normal staff capture.

The instructor workflow now supports:

- Loading active saved drafts or the latest completed immutable snapshot.
- Starting a draft, entering/editing all approved student contract shapes, and explicitly saving sections as `instructor_entered_for_student`.
- Existing financial question/option registries unchanged. Remaining staff capture controls follow existing contract keys and nested shapes, with ordinary text/list/matrix/day controls rather than JSON. They do not create a new student-facing questionnaire or change approved question wording.
- All 19 existing instructor assessment fields, independently attributed as instructor assessment. Financial information does not set educational placement.
- Exact existing acknowledgment text/version display and explicit student-confirmation capture. Staff entry of historical answers does not fabricate consent. The server derives actor/time/version; unchanged prior audit records retain original provenance.
- Server validation preview showing exact missing/invalid field paths and explanations; intentional finalization remains disabled until saved information validates and the instructor confirms review. Server completion independently validates again.
- Existing atomic completion/pointer/audit behavior, immutable completed snapshots and separate new drafts. Existing legacy questionnaire revision/history protections are retained.
- Submitted snapshot versions checked through the service read and atomic update, preventing stale saves. Student load/save responses are identity guarded. Unsaved edits trigger warnings; navigation/student switching is disabled during saves.
- Completed-source links to existing Financial Readiness and Personalized Learning Path workspaces, automatically selecting the same student.

Synthetic browser acceptance used `controlled-launch@example.invalid`, never Carlos, Skip, Z or another real student. A browser-created draft was populated with existing synthetic fixture answers, deliberately leaving student name, instructor summary and acknowledgments unfinished. Those responses were entered/saved through the browser. Review showed 14 acknowledgment/audit errors and blocked completion. Seven explicit synthetic acknowledgments were then captured, validated and finalized through the browser. Result: **COMPLETED / READ ONLY**. This is staff manual capture, not a claim that students can self-complete Intake V2.

The same finalized source generated a Financial / Trading Readiness draft in the browser. Instructor explanation, uncertainty resolution and reason were saved; the plan moved **DRAFT → REVIEW → APPROVED → PUBLISHED**. Educational evidence separately generated **BEGINNER** placement; the instructor saved review reasons and approved the path, assigning existing mandatory Lesson 1. No assessment scores/mastery were invented.

A real synthetic local credential sign-in returned 200 and its assigned protected Lesson 1 returned 200. The compiled candidate also returned the published student financial plan and approved student learning path, with instructor-private fields absent.

### Lesson 1 installation — PASS, prepared only

[Installer instructions](2026-11-07-lesson1-installer.md). `scripts/prepare-money-lesson.cjs` defaults to read-only preparation; explicit output creates a private artifact. The installer verifies schema 0027/0028, parent mapping, available ordering, exact approved content, duplicate aliases and conflicts. It prepares only Lesson 1 plus its approved quiz/homework, with mapped course/module identifiers; no future lessons or parallel course/module are inserted. It is idempotent, guarded and atomic through `executeReviewedMoneyLessonBatch` / D1 `db.batch`.

A production-specific artifact was prepared using **catalog-only metadata from the earlier backup**, with zero user/student records copied:

- Existing course: `02863cd745984e0b8898beb4550c458d` — HFT Trading Foundations.
- Existing module: `m1_forex_fundamentals` — Forex Market Fundamentals.
- Lesson: `hft-money-1`, sort order **0**, ahead of that module's older draft lessons.
- Artifact: `.wrangler/release-preflight/2026-11-07/lesson1-install-artifact.json`.
- SHA-256: `ad9f384a1419df214cc3635b74177e4d28005d57d0ecd3d1c6d9732610cd48fb`.

The exact emitted SQL was executed twice on the isolated catalog rehearsal: **one reference lesson**, zero foreign-key violations. Unit tests additionally cover conflicts, stale metadata, duplicate aliases, missing schema, and rollback of earlier inserts on a later failure. The production artifact has not been remotely executed. Its protected payload contains instructor answer/rubric content: keep it private, outside public assets and Git.

Installation intentionally creates a **draft**. During the separately authorized production phase, revalidate that catalog mapping/order/statuses still match, install the reviewed statements in **one atomic D1 batch**, then explicitly publish only the target course, target module and reference Lesson 1 through existing instructor controls. Leave the seven older lessons and other modules draft. Do not publish all drafts. Assign the approved learning path after the published curriculum is available. Production Lesson 1 is not claimed accessible today.

The SQL bundle includes a SQLite BEGIN wrapper for offline rehearsal only; do not pass that wrapper to D1 or split the guarded statements into separate independent writes. The prepared D1 batch helper is the execution contract for the later authorized installation step, not a public endpoint or automatic startup seed.

### Invitation origin — PASS, prepared locally

Candidate `wrangler.jsonc` contains **`BETTER_AUTH_URL=https://highfrequency.vip`**. Invitations derive the canonical HTTPS origin from this configuration. Account/database identifiers were not changed. No secrets were printed, rotated or sent; production configuration has not yet changed. The existing encryption key must be preserved. Actual provider delivery is intentionally not exercised by local acceptance.

### R2 — DEFERRED, not a controlled-cohort blocker

Interactive Lesson 1 submits text homework into D1; its assignment has `requires_file_upload=0`, empty file types and no R2 dependency. The controlled candidate omits the R2 binding, preventing an unverified bucket from blocking deployment. Original workspace R2 configuration is preserved. Legacy photo/PDF/chart/file uploads remain deferred and unavailable without a separately verified bucket; do not assign upload-required homework to this cohort.

## Frozen release scope — PASS

Candidate: `/private/tmp/hft-controlled-launch-rc`.

[Full candidate manifest](2026-11-07-controlled-launch-candidate.json) records 392 source paths, source/candidate hashes and each scope decision. [Artifact hashes](2026-11-07-controlled-launch-artifacts.json) identify durable private source/build archives. The previous 330-file snapshot remains historical evidence; it is not the deployable artifact.

Original work was preserved. Candidate-only separation:

- HEAD versions restored together for marketing home, header/footer/site, checkout, join/welcome actions/pages/forms, and Stripe webhook. This withholds unverified pricing, booking payment handling, marketing and messaging changes while preserving existing membership payment behavior.
- Sixteen untracked wider-scope public/admin booking, availability, consultation-type mutation surfaces and related public pages/helpers omitted.
- Required consultation read helpers retained as selected read-only exports. The member consultation API is GET-only and its scheduling UI is replaced with an existing-booking display; no calendar/book mutation is exposed.
- Communications retained for required invitation/recovery behavior. Correction to the prior preflight wording: communications itself does not import booking/availability; consultation/student surfaces carried those dependencies.
- Historical migration files retained, including already-applied booking schema dependencies. Only 0027–0032 are pending; none of 0001–0026 should be replayed.
- All completed controlled-launch Academy, Financial Readiness, Intake, invites, lifecycle, paths, Instructor Academy and Lesson 1 dependencies retained.
- QA credentials, environments, local database, backups, cookies and old build output excluded from source/build archives. Dependencies were copied independently into the candidate; no external node_modules symlink remains.

The availability overlap failure was a test-only fixture mismatch: HH:MM inputs were replaced with same-day full ISO timestamps, retaining all five assertions. Runtime booking calculations were not changed or newly certified. Booking timezone/DST behavior remains outside this release.

Next.js regenerated `next-env.d.ts` during its verified build. The final manifest records that generated change explicitly; all other frozen source hashes remained stable. No subsequent product edits were made.

## Verification — PASS

| Gate | Final result |
|---|---|
| Focused controlled-launch tests | **262/262 PASS** |
| Full suite in isolated candidate | **275/275 PASS**, none skipped |
| `tsc --noEmit` in final candidate | **PASS** |
| Next production build TypeScript phase | **PASS** |
| Production-equivalent `OpenNext Cloudflare build` | **PASS** |
| Independent candidate source review | No P1/P2 source blockers |
| Authenticated synthetic browser Intake → financial plan → learning path | **PASS**, completed/published/approved |
| Synthetic student sign-in and assigned Lesson 1 | **200 / 200** |
| Compiled Worker instructor Intake/Academy/inspection/preview/plan routes | **200** |
| Compiled Worker student lesson/financial-plan/learning-path routes | **200**, published/approved content verified |
| Excluded booking mutation | **404** |
| Production-catalog install artifact, twice | **PASS**, one lesson, zero FK violations |

The compiled Worker was exercised at `http://localhost:3001` with a copied **synthetic-only** local database and no email/SMS/payment provider credentials. Its protected Preview as Student was also opened in the actual browser: What Is Money?, ten journey steps and locked mastery/homework gates rendered correctly. Preview remains a browser-only simulation and does not save student progress.

Build warnings were non-fatal existing custom static Cache-Control and bundled third-party duplicate class member warnings. Early build attempts encountered sandbox listener restrictions and a dependency symlink rejected by Turbopack; the final build used independent copied dependencies and completed. Earlier redundant compiler attempts ran out of the default heap; the final explicit check and build typecheck passed. No failed intermediate run is being presented as a successful gate.

Evidence: [verification metadata](2026-11-07-controlled-launch-verification.json), [code review](2026-11-07-controlled-launch-code-review.md). Test/build logs remain private under `/tmp/hft-rc-*`.

## Exact instructor procedure after the separate production release

1. Sign in, open Overview → Student Intake V2. Search the existing student and select them.
2. Open the saved draft, or start a new draft. Enter actual collected answers in each section; save each section. Lists use one response per line. Preserve unknowns; do not guess or manufacture required responses.
3. Complete Instructor Assessment and save. Financial circumstances belong to readiness analysis, not educational competency.
4. Capture only genuinely confirmed acknowledgments using the exact displayed texts. Missing confirmation requires obtaining it from the student.
5. Open Review & Complete. Resolve the exact listed issues, revalidate saved data, confirm review, then Finalize Intake V2.
6. Follow Open Financial / Trading Readiness. Generate from the selected completed source, enter instructor interpretation/review resolution/reason, save, mark reviewed, approve, then publish.
7. Follow Open Personalized Learning Path (or Overview → Learning Paths for the same student). Generate, inspect educational evidence, document review/adjustments, save, then approve and assign existing curriculum. Incomplete evidence is not mastery; do not bypass core gates.
8. Student signs in, completes any forced password setup, opens Academy → assigned course → published module → What Is Money?. Lesson interactions, assessment review, remediation, homework approval and mastery requirements continue to apply.

## Separate production-phase prerequisites and order

This report stops before production. Next authorized phase must use the **frozen built artifact**, not current working-tree `deploy`.

- Reconfirm fresh migration ledger and catalog with direct read-only commands, not SELECT-only `--file`; the historical Wrangler import metadata anomaly remains documented in the earlier report. Do not repeat 7403 troubleshooting or change the confirmed target.
- Refresh private export/Time Travel bookmark immediately before mutation; preserve the existing deployed Worker rollback version. Coordinate writes; database restore can lose later legitimate data and Worker rollback does not undo D1 changes.
- Apply pending migrations **0027 → 0028 → 0029 → 0030 → 0031 → 0032** only, in order. Prior restored-production rehearsal passed with original row values preserved.
- Deploy the frozen candidate with canonical auth URL and existing required secrets; omit R2 for this text-only release.
- Execute the reviewed Lesson 1 atomic batch after revalidating its catalog snapshot. Explicitly publish only its intended parents/lesson, leaving older drafts untouched. Do not enroll real students or enter answers as an automatic seed side effect.
- Perform non-destructive instructor/student route/security smoke checks. Production invite delivery, real cohort onboarding and any payment activity require their separately intended operating actions; they are not implicit smoke tests.

**STOPPED BEFORE PRODUCTION DEPLOYMENT.**
