# HFT Live Teaching Phase B — frozen candidate and production preflight

2026-11-08. **NO DEPLOYMENT. NO PRODUCTION MIGRATIONS OR CONFIGURATION CHANGES.** All production application/database operations were read-only. No real student records, external messages, invitations or Stripe activity were changed/performed. Unrelated working-tree changes remain preserved.

## Decision

**A. Ready for controlled production deployment? NO, operational configuration gates remain.** Frozen source, regression, build, migration rehearsal and development-provider production-copy rehearsal pass. This does not mean production is configured or verified for classroom use.

**B. Separate LiveKit production project needed? YES.** Use a distinct HFT Production project with a distinct URL/key/secret/webhook; do not reuse the development signing key or project.

**C. Manual LiveKit/Cloudflare configuration required? YES.** See the exact categories and ordered release plan below. Nothing was provisioned, purchased or configured by this task.

**D. Paid LiveKit plan required before the first controlled pilot? NO as a provider technical requirement**, if the actual shared free allowance has sufficient remaining minutes/data and the pilot is capped/monitored. Recommend Ship for regular weekly teaching; free Build can hard-stop when its allowance is exhausted. Production quota/billing confirmation remains a gate; no purchase authorized or performed.

## 1–2. Frozen manifest and exact files

Manifest: `docs/releases/2026-11-08-teaching-phase-b-candidate.json`, revision 1.

- Candidate: `/private/tmp/hft-teaching-phase-b-rc`.
- Fingerprint: `03bb6b1765160df03554990ec9234496e25dc4dd8a0a46d8f385a3447c9c6636`.
- **489 source files**, every path/SHA-256/disposition listed in the manifest. **37 scoped overlays**, listed at the end of this report; 452 baseline files unchanged.
- Baseline: verified deployed Phase A manifest revision 3, fingerprint `e1621fc6144debb2f0d26c5663c0681a07284e72611e040a2937437fed02ac72`.
- Frozen private source archive and its hash are recorded in the manifest. Archive membership exactly equals the 489 paths. **1908 built artifact hashes** are inventoried separately.
- No `.dev.vars`, environment secrets, tunnels, production exports, local database, QA fixture data or generated Wrangler state in the source archive. Credential scan found no private QA value matches in the 489 files.
- Includes the reviewed terminal strict-revocation fix. No Phase C, Lesson 2+, Chart Lab, recording/replay/community or unrelated working-tree overlay.
- Prepared configuration only: main service binding/control URL; classroom account/production origin/custom domain. The original local-only classroom localhost origin is corrected inside this candidate only. Shared checkout configuration remains untouched. No unrelated R2 binding added.

## 3–5. Read-only production baseline

| Item | Verified result |
|---|---|
| Account | `780fda88bb137eedefd9d3981a8816b4`; current authorized Wrangler OAuth identity matches the existing HFT account |
| Main Worker | `hft-landing`, version `fad1f0e2-683c-4f15-baea-e3b6c8147951`, deployment `7b78d0e1-3372-44a6-9459-1b354ded6b00`, 100% traffic |
| D1 | `hft-data`, `baec727f-4a9a-4915-81e2-d549c5095fb5` |
| Migration level | 34, through `0034_teaching_delivery.sql` |
| Existing records | 13 users, existing membership/entitlement fields included in whole-row preservation comparison; 197 exported rows across 70 tables |
| Phase A | 0 teaching sessions; 0 teaching configuration rows; defaults/availability setup is still pending |
| Classroom | No classroom tables; control Worker absent (Cloudflare 10007); no LiveKit/classroom bindings in current main Worker |
| Existing delivery | `TEACHING_DELIVERY_ENABLED=false`, preserved; no message activation |
| Auth | Actual authenticated instructor `/admin/teaching` loads Teaching Center/calendar/defaults; no form submitted |
| Anonymous checks | `/login`200, `/admin/teaching` and `/lessons`307 to login, `/api/teaching`401; current undeployed webhook route404 |
| Student production auth | Not newly certified; no synthetic production password guessed/reset/session fabricated. Existing Phase A student smoke/availability gate remains pending |
| Proposed control DNS | `classroom.highfrequency.vip` is NXDOMAIN; not created |

Aggregate membership snapshot (no student details): {"roles": [{"role": "admin", "count": 2}, {"role": "student", "count": 11}], "subscriptionStatuses": [{"status": null, "count": 8}, {"status": "active", "count": 4}, {"status": "canceled", "count": 1}], "lifecycleStatuses": [{"status": "ACTIVE", "count": 13}], "complimentaryRecords": 4}

Final read-only production recheck: unchanged recorded Worker/deployment,34 migrations,13 users,0 teaching sessions,FK0; every SELECT reports rows_written0. Final489 source/archive/1908 build hashes match.

## 6–8. Pending migrations, rehearsal and preservation

Only pending D1 migrations, in order:

1. `0035_live_classroom.sql`: eight new classroom aggregate/control/presence/attendance/chat/cleanup tables and unique open-attendance index.
2. `0036_classroom_webhooks.sql`: new deduplicated webhook metadata table/index; cascade references only the new classroom table.

Both are additive CREATE operations. Neither drops, truncates or updates an existing application table. The End Class fix itself needs no additional migration. A separate **classroom Worker Durable Object migration `v1`, new SQLite class `ClassroomRoom`**, is also required when that Worker is first deployed; it is not a D1 ledger migration.

Fresh read-only production export restored successfully. Applied 0035 then 0036 to the private local copy, appended local migration ledger rows, checked each stage: **PASS**. All 197 original rows/values across 70 original tables and all original schema objects remain exact; ledger advances 34→36. Integrity check ok, foreign-key violations0, Phase A tables/triggers/history preserved.

After synthetic real-provider rehearsal, compared all original migrated-copy records again across 79 tables: originals retained, FK0, ENDED, open attendance0, duplicate open attendance0, pending cleanup0. The synthetic lesson was canceled locally after END. No production migration was applied or replayed.

## 9. Production LiveKit project/configuration

Create **HFT Production** separately in the existing approved LiveKit organization. Do not reuse a development environment or signing key. Keep credentials private; never paste values into a report or candidate.

| Configuration category | Required destination/action |
|---|---|
| `LIVEKIT_URL` | Both main and classroom control Worker; production project's secure `wss://…livekit.cloud` URL |
| `LIVEKIT_API_KEY` | Both Workers; production-only server credential |
| `LIVEKIT_API_SECRET` | Both Workers; Cloudflare secret storage, never frontend/plain source |
| `CLASSROOM_CONTROL_SECRET` | Same fresh high-entropy server secret on both Workers; distinct from dev and auth secrets |
| `CLASSROOM_CONTROL_URL` | Main Worker: prepared `wss://classroom.highfrequency.vip` |
| `BETTER_AUTH_URL` | Both Workers: `https://highfrequency.vip` |
| `CLASSROOM_HUB` | Main service binding → `hft-classroom-control` |
| `HFT_APP` | Control service binding → existing `hft-landing` |
| `CLASSROOM_ROOMS` | Control Worker DO binding → `ClassroomRoom`, `v1` SQLite migration |
| `DB` | Both Workers → existing confirmed production D1 ID; no replacement DB |
| HTTPS hostname | New Cloudflare custom domain `classroom.highfrequency.vip`; workers.dev and preview URLs remain disabled |

No new email/SMS/Stripe configuration is needed. Preserve existing secrets, production auth URL, Phase A delivery disabled state and unrelated binding metadata.

## 10. Permanent production webhook

**`https://highfrequency.vip/api/classroom/webhook`** — configure only in the separate Production LiveKit project after the endpoint is deployed. No trycloudflare URL. Do not create it during this preflight.

The frozen handler verifies the signed raw body with the production project's key/secret, bounded body size and timestamp tolerance; deduplicates `event_id` in D1; rejects invalid signatures; recognizes only existing HFT classroom IDs. Replays remain idempotent reconciliation hints, never state transitions back to LIVE. Participant/track reconciliation reads current provider inventory against HFT roster/grants/state. Late old participant events do not close a replacement lease. Attendance remains HFT/lease authoritative and closes at END; provider departure can be reconciled by lease expiry/alarm rather than trusting event arrival order. Terminal events strictly revoke late identities. No raw event payload/private notes/media retained.

Production/dev separation is enforced by separate project signing credentials, database/runtime configuration and webhook destinations. HFT room names alone are not environment isolation, so sharing a project is not approved.

## 11. Development credential safety

Treat the old development key as exposed. Demi confirmed rotation/revocation and private update of both local QA files during this task. Updated provider credentials match between main/control QA files; the real-provider rehearsal succeeded with them. Old-key revocation is based on Demi's confirmation, not an attempt to replay/expose the old key. New values were not printed or placed in the frozen candidate. If any future snapshot exposes them again, rotate before further development use.

## 12–13. Security and Phase A integration

Frozen tests and actual production-copy provider rehearsal preserve authenticated admission, active lifecycle/entitlement, assigned instructor, enrolled roster, confirmed teaching status/window, current connection lease/revision and cross-room isolation. Only CONFIRMED Phase A lessons offer Start/Join; there is no new scheduling authority. Cancellation, rescheduling outside the current window, enrollment/lifecycle loss invalidate eligibility; expired/canceled sessions reconcile closed. Phase A concurrent calendar/conflict and lifecycle regression tests pass.

Participant JWTs remain60 seconds, room/identity/source scoped, without admin/create/list/data grants. Mic/camera/screen permissions are independent; three HFT screen reservations maximum; unapproved/fourth publishers denied. Source revocation/demotion/removal force current HFT readmission with strict provider cutoff. ENDED commits before remote teardown; historical roster identities and late signed identities are durably merged and strictly revoked before DeleteRoom. Fresh/old grants cannot revive HFT state. Existing five-second DO alarm retries pending cleanup; failure does not reopen admission. External provider disconnection is not an atomic D1 operation and cannot be promised during an unreachable provider; terminal HFT admission/control remain denied and cleanup intent persists.

## 14. Provider capacity/plan

Official current [LiveKit quotas](https://docs.livekit.io/deploy/admin/quotas-and-limits/) list Build concurrency100 and video/audio subscription limits100 each. Eleven participants and three screen tracks fit; native browser screen sharing is WebRTC transport, not recording/egress.

Current [LiveKit pricing](https://livekit.com/pricing) lists Build5000 participant-minutes/50GB monthly; Ship starts at$50/month with150000 minutes/250GB. Free projects share allowance and hard-stop at exhaustion. An11-person60-minute lesson uses660 participant-minutes; four weekly lessons2640. Illustrative three1Mbps screens ×10 receivers use about13.5GB/hour before cameras/audio; four such hours54GB. This is a planning estimate, not measured usage. Check actual project/account remaining allowance. Build can support a bounded monitored first pilot; recommend Ship for weekly production headroom. No paid plan purchased; recording/agent services excluded.

## 15–17. Instructor, student and mobile experience

Instructor Start Class, mic/camera, native screen capture, participants, hand queue, presenter controls, focus/side-by-side, persistent moderated chat and End Class are included. Student Join, receiving/audio unlock, chat/hands, individually approved sources, native desktop capture and safe reconnect are included. Native device activation remains user gesture controlled.

Hash-identical native acceptance is preserved: three simultaneous authorized Chrome captures and instructor+10 synthetic interactive clients. Fresh production-copy rehearsal used real RTC SDK publishers, not a second native browser exercise. Responsive390px receiving/focus/Stage-Chat-Participants behavior and focused mobile subscriptions remain verified from prior acceptance; mobile screen publishing stays unavailable. Physical iOS/Android and eleven separate manual devices are not certified.

## 18. Recovery and future release order — not executed

Recovery export: private `.wrangler/phase-b-release/2026-11-08/preflight/production-before.sql`, SHA-256 `9944b4a7c2752ada88eca590f3f10042d4a122b103ce6d4aa94f7964c47927d4`,161623 bytes, restore verified. Time Travel bookmark `00000241-00000000-0000511d-763576c84eeb78241e5415a160bf4b23`. This is the preflight recovery point; obtain a fresh export/bookmark and recheck Worker/data before any later authorized release.

Future controlled order: reverify frozen hashes/baseline/recovery and provisioned production quotas; apply0035→0036 once; deploy/configure new control Worker/DO/domain and server secrets while old main cannot issue admissions; install required main server settings without touching unrelated secrets; deploy only frozen main/build; configure permanent production webhook; verify all effective configuration and synthetic production security/media smoke before real-student clearance. This task does none of those production actions.

Rollback target main Worker: `fad1f0e2-683c-4f15-baea-e3b6c8147951`. **Do not roll back only the main Worker while provider rooms remain usable.** First End Class for every active Phase B session through the protected instructor workflow; confirm HFT ENDED/grants cleared, strictly revoke every historical/active identity and confirm provider rooms absent. Disable the production control hostname/Worker ingress, then roll back main; retain successful additive D1/DO history. Disable/remove only the Production HFT webhook; leave dev/other entries intact. If normal closure is unavailable, stop the rollout and use reviewed incident containment: block classroom ingress, revoke the production signing key and remove participants/delete production HFT rooms; verify stale credentials cannot connect before accepting rollback complete. Do not reuse dev keys or rely only on JWT expiry. No data-drop migration rollback. Full D1 recovery is exceptional and must account for legitimate writes since the bookmark.

## 19–24. Fresh frozen-candidate regression

| Gate | Result |
|---|---|
| Focused Phase B/END/LiveKit/admission/screens/reconnect/webhook/attendance + Phase A/Lifecycle/Academy | **237/237 PASS**,32 files |
| Full suite | **509/509 PASS**, no failures/skips/cancellations |
| TypeScript | **PASS exit0**, exact frozen source in clean workspace |
| OpenNext | **PASS exit0**; production configuration, no QA credentials in build source |
| Application Worker dry-run | **PASS exit0**, no upload/deploy |
| Classroom Worker dry-run | **PASS exit0**, production origin/account/custom-domain/DO configuration parsed; no resource creation |

The first build failed because the temporary candidate's external node_modules symlink was outside Turbopack's filesystem root. Replaced only that dependency layout with a local copy; rerun passed with all source hashes unchanged. Standalone tsc was moved to an exact clean frozen-source copy to exclude generated OpenNext bundles from the broad tsconfig include. No test disabled or product source fix added. Existing Cache-Control and bundled dependency duplicate-member warnings remain nonfatal.

## 25. Production-like rehearsal

**PASS**, private session `qa-preflight-28cbf8e98a4d`, fresh migrated production export + synthetic accounts only, rotated DEVELOPMENT LiveKit credentials, actual built frozen application/control Workers on loopback.

Confirmed synthetic lesson admission; Start/Join; instructor mic/camera; synthetic chat/raise-hand; presenter grant; three actual SDK screen tracks; unapproved/fourth-screen denial; focus/side-by-side command; source revocation/demotion; removal/stale-token denial; normal reconnect; ENDED-first race; unexpired cached replay rejection; post-END mic/camera/screen publishing and controls blocked; provider room absent; grants invalid. Closed attendance/no duplicates/pending cleanup0/FK0. Synthetic booking canceled and owned local runtime stopped. All original production-copy rows remain preserved. This does not claim live production media or repeat eleven independent native browsers.

## 26. Remaining blockers/manual actions

1. Create separate HFT Production LiveKit project and production-only signing key; confirm quotas/billing choice and sufficient remaining allowance.
2. Install production LiveKit credentials and a fresh shared control secret on both Workers, privately. Never reuse development credentials.
3. Under a separately authorized deployment, apply0035→0036, create control Worker/DO/custom HTTPS domain, install service bindings and confirm effective production origin/control URL. Existing DNS is NXDOMAIN; nothing is configured yet.
4. Configure/verify the permanent production LiveKit webhook after deployment; real signed production webhook/security smoke remains future work.
5. Obtain fresh recovery/baseline verification at deployment time. Full rollout requires explicit production authorization and synthetic production smoke, not this preflight.
6. Resolve the inherited Phase A authenticated-student acceptance and actual instructor availability setup before real student scheduling. No real instructor defaults were saved here.

No new code defect or scope-separation failure remains identified in this preflight. Source/build readiness passes; environment and production acceptance are intentionally incomplete. Do not deploy from the dirty shared working tree.

## Exact Phase B overlays (the manifest separately lists all489 files)

- `app/(app)/admin/classroom/[sessionId]/page.tsx`
- `app/(app)/classroom/[sessionId]/page.tsx`
- `app/api/admin/student-lifecycle/route.ts`
- `app/api/classroom/[sessionId]/chat/route.ts`
- `app/api/classroom/[sessionId]/route.ts`
- `app/api/classroom/webhook/route.ts`
- `components/classroom/Classroom.tsx`
- `components/classroom/hft-classroom.css`
- `components/classroom/media.tsx`
- `components/classroom/presentation.ts`
- `components/teaching/Scheduler.tsx`
- `lib/classroom/contracts.ts`
- `lib/classroom/control-auth.test.ts`
- `lib/classroom/control-auth.ts`
- `lib/classroom/environment.ts`
- `lib/classroom/lifecycle-route.test.ts`
- `lib/classroom/livekit.ts`
- `lib/classroom/presentation.test.tsx`
- `lib/classroom/provider.test.ts`
- `lib/classroom/provider.ts`
- `lib/classroom/realtime.test.ts`
- `lib/classroom/routes.test.ts`
- `lib/classroom/service.test.ts`
- `lib/classroom/service.ts`
- `lib/classroom/terminal.ts`
- `lib/classroom/transport.ts`
- `lib/classroom/webhooks.test.ts`
- `lib/classroom/webhooks.ts`
- `lib/teaching/presentation.test.tsx`
- `migrations/0035_live_classroom.sql`
- `migrations/0036_classroom_webhooks.sql`
- `package-lock.json`
- `package.json`
- `workers/classroom/server-only.ts`
- `workers/classroom/src/index.ts`
- `workers/classroom/wrangler.jsonc`
- `wrangler.jsonc`


## Authorized infrastructure execution — 2026-11-08

Migrations0035 and0036 are now applied and independently verified in production. **Do not replay them.** Standalone control Worker/DO/custom domain and four server settings on both Workers are configured. Main application code remains the deployed Phase A code (unchanged ETag). Main service/control-URL binding update failedHTTP400; work stopped without retry. Webhook remains404. See [intermediate infrastructure result](2026-11-08-teaching-phase-b-infrastructure-result.md) for exact versions/recovery/status and the private continuation-state path. Earlier preflight production baseline remains historical; frozen source remains unchanged.


## Main binding HTTP400 diagnosis — 2026-11-08

Root cause reproduced offline: the helper loaded Cloudflare SDK4.5.0 and flattened the nested settings into bracketed multipart fields instead of a JSON settings part. Encoding-only correction (`__multipartSyntax: json`) prepared and verified offline; **not applied**. Current main/control code/settings and migration36 remain healthy and unchanged. See [binding diagnosis](2026-11-08-teaching-phase-b-binding-diagnosis.md) for the exact guarded configuration-only next command and evidence. No main deployment or migration replay is required for this correction.


## Corrected main binding update succeeded — 2026-11-08

Both main infrastructure bindings are now configured and verified; all18 previous bindings and original main application code ETag are preserved. Current configuration version `0214811f-d2cc-48b8-84a6-cc64fcb1541e`. Signed control protocol/unauthorized/replay/WS-origin checks pass; actual main-runtime Phase B invocation awaits application deployment. Migrations remain36 and must not be replayed. Webhook remains404/unconfigured. See [successful configuration verification](2026-11-08-teaching-phase-b-binding-update-success.md). Stop before separately authorized main Phase B deployment.


## Controlled main application deployment — 2026-11-08

Frozen main application is now deployed at `fe9f5d14-0fdd-4597-bff3-1da00b951e68`, deployment `a2f5a68c-ff49-40d7-ace5-b30b2324ae0d`, with no rebuild/migration replay. Main→control/WS/provider instructor synthetic smoke and production webhook signature/dedup probes pass. Test lesson ended/canceled, real data preserved. **STOP at manual production webhook creation** (name HFT Production Classroom, permanent main webhook URL, signing key HFT Production Phase B v2). Actual Cloud webhook delivery and positive test-student login/Join remain pending. See [application release result](2026-11-08-teaching-phase-b-application-release.md). No pilot certification yet.


## Production webhook verified — 2026-11-08

Demi created the permanent HFT Production webhook with the matching installed production signing key. Actual LiveKit Cloud room_started/room_finished delivery and automatic terminal cleanup passed using the already-ended synthetic QA context. No new deployment/migration/accounts/bookings; no real student changes. Positive test-student login/Join and Phase A availability/scheduling acceptance remain pending; no pilot clearance. See [production webhook verification](2026-11-08-teaching-phase-b-production-webhook-verification.md).
