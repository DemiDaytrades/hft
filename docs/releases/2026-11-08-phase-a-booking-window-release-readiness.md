# Phase A booking-window extension — controlled release readiness

**Ready for separately authorized controlled deployment: YES. No production deployment, migration, availability configuration or student mutation occurred.**

## Frozen scope and baseline

The candidate is frozen in `/private/tmp/hft-booking-window-release-candidate`, with 531 inventoried source files. Only `lib/teaching/service.ts` and `components/teaching/Scheduler.tsx` change from the certified reconciled Phase C baseline; four files add the shared booking-window helper, two test files and migration 0038. The unrelated working tree and local QA Wrangler configuration are excluded. The production baseline Wrangler configuration is preserved.

Source fingerprint: `0bf8034c744504b3d84906bb5bb3b2fc6d6d0b4f779d63cb18d23c334d06c0db`.

The manifest freezes source, built main Worker/maps, 92 assets, source archive, migration hash and the unchanged control artifact. All source hashes were rechecked after build. A scan of 629 release files found none of the privately loaded production LiveKit credentials or temporary build secret. Private credentials, production SQL and runtime QA files are excluded from the release archive. Frozen source and artifacts must be rechecked immediately before any separately authorized release.

Read-only production comparison confirmed both current deployed code hashes and all unrelated settings/bindings match the certified baseline. This retains `/internal/publish` consumed-body/await handling, CPU optimization, classroom/security behavior, LiveKit configuration and webhook routing. Both Workers retain 3,000 ms caps; Workers Paid was confirmed in the actual Cloudflare dashboard. No Phase B acceptance was repeated and no Phase C/D or Lesson 2 scope was added.

## Production pins and recovery

| Worker | Current version / rollback target | Current deployment |
|---|---|---|
| Main | `81fda03f-01df-481b-bbaf-9e3dc37d0daa` | `ca369b6e-1a3c-45d7-9cf8-25c9b6819627` |
| Control | `4bfaa1f7-5584-4b35-b038-a88ff1cbac59` | `8535a790-4dab-4372-af32-a85dc0ff885c` |

Fresh production export completed at **2026-11-09 02:58:10 UTC** (November 8 Central evening), 479,000 bytes, SHA-256 `e712d98cd51f432274fe0dfd3682d518b489c806aec870fd94343bd781cd3198`. SQL, restored recovery SQLite, Time Travel bookmark and full binding metadata are stored privately under `.wrangler/phase-a-booking-window-release/2026-11-08/` with restricted permissions. They are not application artifacts or committed data.

The initial Wrangler export failed at transport before returning an export bookmark. One guarded documented Cloudflare export-API attempt succeeded. Wrangler local restore then encountered a forward-reference error in the exported schema. The same export was restored with SQLite foreign-key enforcement disabled only during import; full integrity and foreign-key checks passed afterward. The validated snapshot was backed up into the isolated local Wrangler database. No production repair or schema workaround was performed.

## Migration rehearsal

Local Wrangler listed only **0038** pending and applied only `0038_teaching_booking_window.sql`. The local copy moved from 37 to 38 migrations. Comparison of all **89 original tables / 1,067 existing rows** verified every original column value unchanged; the original 37 migration records remained unchanged and one 0038 tracking row was added. All application schema objects remain unchanged except two additive constrained columns on `teaching_config`. Wrangler also created its local internal `_cf_METADATA` table; that is not part of migration 0038.

Integrity: **ok**. Foreign-key violations: **0 before and after**. New column defaults/constraints and preservation of a populated pre-existing configuration are also covered by migration regression tests. Current production has no `teaching_config` row, recurring availability or overrides; migration 0038 does not create/open them. Existing scheduling, classroom, Academy, consultation and student records are preserved.

Production was checked again after rehearsal: **37 migrations, last 0037; 0038 absent; zero FK violations; no open attendance, pending classroom cleanup or LiveKit rooms.** LiveKit read-only authentication succeeds. Existing genuine signed webhook receipts remain recorded under the unchanged certified code/configuration. No new provider session, webhook configuration or message was created for this preparation.

## Verification

- Prior actual local Chrome desktop/mobile acceptance and focused Phase A tests: **118 passed**, as documented in the linked local verification report.
- Fresh full suite on the exact 531-file release source: **565 passed, 0 failed**.
- Fresh standalone TypeScript: **PASS, exit 0**.
- Fresh OpenNext production build: **PASS, exit 0**.
- Fresh main Worker dry-run: **PASS, exit 0**, no upload/deployment.
- Control Worker is byte-identical to the current certified deployment and requires no redeployment.
- Final production HTTP checks: home/login **200**, protected instructor route **307 to authentication**, unsigned webhook **401**, unauthorized control publish **401**. No 5xx occurred in these checks.

The previously documented three HTTP 500s coinciding with a D1 export and the recovered Phase B 503 remain monitoring warnings. This preparation did not deliberately repeat disruptive export-time traffic or establish causation. Normal post-export checks pass; that alone does not prove those historical warnings resolved.

## Separately authorized release procedure — not executed

1. Recheck manifest/source/artifact hashes, active Worker pins, migration state, bindings/caps and current health. If drift exists, stop. Refresh recovery readiness if production data has changed materially since this copy.
2. Apply **0038 only** after explicit production authorization; never replay 0037 or older migrations. Verify tracking, additive schema, row preservation and FK health before application deployment.
3. Deploy only the frozen main Worker and its frozen asset set using the existing controlled asset-aware workflow, preserving current production secrets, bindings, routes and 3,000 ms cap. Do not use the current unrelated working tree or newest stored Worker as configuration source. Leave control Worker unchanged.
4. Verify application/scheduling/classroom health and security with controlled QA context. Do not modify real students or send messages.
5. Configure/open instructor availability only under separate explicit authorization: Chicago, Monday–Sunday 10:00–22:00, 60-minute lessons, 15-minute buffer, 12-hour notice, 14-day horizon, one weekly lesson, instructor confirmation. Preserve blocked dates/date overrides and confirmation of valid held requests inside notice until their separate expiry.
6. If the application gate fails, restore the pinned main Worker version. Keep additive 0038 in place; do not drop columns or run reverse migrations. Leave control unchanged. Use the private validated recovery snapshot/Time Travel recovery only if a separately assessed data-recovery action is actually needed; a whole-database restore could overwrite newer legitimate writes.

## Required answers

**A. Is migration 0038 safe against the current production-data copy? YES.** Rehearsal passed with full original-value preservation.

**B. Is the frozen scheduling candidate compatible with the currently certified Phase B/C production baseline? YES.** It is based on the certified source with the bounded reviewed scheduling delta; live code/settings identity was checked.

**C. Were all existing production records preserved? YES.** All original exported rows/values survived local rehearsal. Production was not mutated; it remains at 0037.

**D. Is the candidate ready for a separately authorized controlled production deployment? YES.** Deployment, production 0038 and production availability remain unperformed and require separate authorization. Operational pilot clearance still requires post-deployment QA scheduling acceptance.
