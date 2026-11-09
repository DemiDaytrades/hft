# Phase B optimized production CPU acceptance — FAILED Free-plan gate; rolled back

The frozen Phase B CPU optimization was deployed under the controlled authorization, then rolled back after actual authenticated teaching-page CPU exceeded the Free allowance in all three bounded samples. HTTP 200 responses do not establish safe CPU headroom. The eleven-person exercise was not started. Phase C remains blocked. No upgrade or migration occurred.

## Actual production CPU evidence

These are Cloudflare dashboard per-invocation values from ordinary authenticated full-page browser GETs to /admin/teaching with unique non-sensitive QA correlation tags. The UI displayed the Teaching Center under Demi's normal admin session. The optimized versions were confirmed active during sampling. This table excludes login redirects, RSC prefetches and the separate teaching-data API. Cold/warm isolates were not independently controlled; no cold/warm label is asserted.

| Sample | UTC | Invocation ID | HTTP | CPU ms | Wall ms |
|---|---|---|---:|---:|---:|
| auth-r1 | 2026-11-08T22:45:53.624Z | 4cccc901add1fd4010dcaefbf66ac18d | 200 | 54 | 194 |
| auth-r2 | 2026-11-08T22:46:01.031Z | bf48115128dcc48099b7edb0d1a1fdcb | 200 | 33 | 96 |
| auth-r3 | 2026-11-08T22:46:06.439Z | 78f188ccd60a6182704d1c29bc9da435 | 200 | 215 | 277 |

CPU min / median / max: **33 / 54 / 215 ms**. Wall min / median / max: **96 / 194 / 277 ms**. All three CPU samples exceed 10 ms (3.3×–21.5×). No terminated exceededCpu, HTTP 503 or 1101 was observed in these three requests; this is a headroom failure, not a claim of a newly observed terminated request. The previous release's exceededCpu evidence is separate and was not mixed into these statistics. This bounded sample does not establish rates across all production traffic.

Cloudflare documents a 10 ms Free HTTP CPU allowance and limited isolate flexibility for occasional overruns; repeated excess can be terminated. That explains why HTTP success alone is insufficient. [Cloudflare CPU limits](https://developers.cloudflare.com/workers/platform/limits/#cpu-time).

The OAuth observability API returned 403/code 10104; actual dashboard inspection provided the recorded values. Production subrequest counts, D1 operation counts and service-binding counts were not extracted from these invocations. Local query-count reductions must not be represented as actual production runtime counts. Evidence: .wrangler/phase-c-release/2026-11-08/cpu-production-acceptance/authenticated-teaching-cpu-samples.json. No request headers, cookies, tokens, request bodies or private records were persisted in that evidence.

## Final 34-point report

| # | Required item | Result |
|---:|---|---|
| 1 | Frozen candidate verification | PASS: all 496 source files and frozen runtime hashes unchanged; verified assets; publish fix retained; no Phase C feature code or private QA entry included. Final hashes rechecked after rollback. |
| 2 | Pre-deploy main version | abf18574-031e-4ef5-992a-f30f6a316b4f |
| 3 | Pre-deploy classroom version | 00da709f-7dbb-43fe-ad2c-1bd260eeba8e |
| 4 | New versions/deployments | Main 97cfe88d-2403-4d33-9311-d7215cc371b2 / deployment 21e31876-cacb-4765-877b-c4e4692a1fa1. Control 19751af3-587c-446c-8150-59099696d66a / deployment edef5207-0f18-45f0-b578-82d52e233fbe. Both were subsequently rolled back. |
| 5 | Rollback | PASS: main abf18574-031e-4ef5-992a-f30f6a316b4f, rollback deployment db678f4e-d91e-4366-bf8f-3e6d6c9ade23; control 00da709f-7dbb-43fe-ad2c-1bd260eeba8e, rollback deployment 6ad59799-cbdb-4863-8cf4-f2a86aa27003. Active versions/settings verified restored. |
| 6 | Main health | PASS functional checks before/after rollout and after rollback: home/login 200; protected anonymous pages redirect to login; APIs reject unauthenticated requests. Authenticated optimized Teaching Center rendered for all three samples. This is not CPU certification. |
| 7 | Classroom/control health | Control health 200; unauthorized publish 401; invalid-ticket WebSocket 401; foreign-origin WebSocket 403. Binding/configuration identities preserved, DO tag v1 retained. Authorized application-to-control publication and protected live WebSocket were not re-exercised because the CPU gate stopped before a classroom fixture. |
| 8 | /admin/teaching CPU | FAIL headroom: 54, 33, 215 ms; min 33 / median 54 / max 215. |
| 9 | Classroom GET CPU | NOT RUN: stopped at prior CPU gate. |
| 10 | Instructor admission CPU | NOT RUN. |
| 11 | Student admission CPU | NOT RUN. |
| 12 | Screen admission CPU | NOT RUN. |
| 13 | Presenter-change CPU | NOT RUN. |
| 14 | End Class CPU | NOT RUN. |
| 15 | Repeated-sample statistics | Three authenticated full-page requests; CPU 33/54/215 min/median/max; wall 96/194/277. No classroom-load statistics claimed. |
| 16 | exceededCpu events | None observed in these three sampled invocations. All three nevertheless exceeded the nominal CPU allowance. No claim of a whole-account zero-error audit. |
| 17 | 503/1101 events | None in the three samples or functional health checks. No capacity-load exercise performed. |
| 18 | Exact eleven-person client mix | Not instantiated: one normal instructor Chrome session used for read-only teaching-page sampling; zero synthetic student clients/accounts created. |
| 19 | Full interactive eleven-person result | NOT RUN / NOT CERTIFIED, intentionally stopped after CPU gate failure. |
| 20 | Three native screens | NOT RUN on optimized production candidate; prior local evidence remains separate. |
| 21 | Chat / raise hands | NOT RUN; no class/chat messages sent. |
| 22 | Presenter / revocation | NOT RUN on optimized production candidate. |
| 23 | Participant removal | NOT RUN. |
| 24 | Normal pre-END reconnect | NOT RUN. |
| 25 | End Class | NOT RUN in this production acceptance. Local native End pass does not substitute. |
| 26 | Actual unexpired-token replay | NOT RUN in this production acceptance; no production participant token issued for a test room. |
| 27 | Post-END publishing | NOT RUN. |
| 28 | Attendance | Zero open synthetic attendance before rollout, post-deploy and post-rollback. No new attendance/test classroom created. |
| 29 | Provider cleanup | Zero rooms before and after; no production media room was created by this run. Read-only production LiveKit authentication healthy. |
| 30 | Webhook regression | Missing/invalid signatures rejected with 401; endpoint configuration unchanged. Genuine new room_started/room_finished delivery and duplicate/replay exercise NOT RUN because no room was created. No full webhook recertification claimed. |
| 31 | Migration / FK | PASS: 37 migrations, latest 0037, zero FK violations after rollback; DO tag v1. No D1 or DO migration submitted/replayed. |
| 32 | Production data safety | Only read-only D1 verification queries; no new users/accounts/bookings, real student questionnaire/plan/placement/progress changes, real messages/invitations or Stripe transactions. Demi completed normal sign-in; routine authentication session behavior is not a domain-data migration. |
| 33 | Workers Free suitability | FAIL for this candidate/current workload: even the minimum of three normal authenticated teaching samples was 33 ms, above 10 ms. Paid capacity is justified for the current build; no upgrade performed. |
| 34 | Remaining blocker | Production CPU budget. Need separately authorized capacity change or a further independently verified optimization before another controlled release; full eleven-person media/security/webhook certification remains outstanding. |

## Explicit decisions

A. **Does optimized Phase B have safe actual Workers Free CPU headroom? NO.** Repeated authenticated teaching CPU exceeds the allowance.

B. **Did full instructor + ten interactive acceptance pass? NO — not run after CPU gate failure.**

C. **Did three simultaneous authorized native shares pass? NO — not run on this production candidate.**

D. **Did normal production End Class pass? NOT TESTED in this acceptance.**

E. **Did actual unexpired production token replay fail as required? NOT TESTED in this acceptance.**

F. **Is Phase B production baseline fully accepted? NO.** Prior recorded versions are restored; their known historical CPU limitation is not erased by rollback.

G. **Safe to resume Phase C Revision 3 redeployment? NO.** Its separate authorization and acceptance gates remain required.

H. **Paid Cloudflare Workers plan required? YES for reliable use of this current optimized build within the observed workload.** Evidence supports choosing paid CPU capacity rather than certifying Free on HTTP success. This is not proof no different future architecture could fit Free. No plan change or purchase was made; a paid plan alone would not certify the remaining classroom/security gates.

## Deployment/recovery details

Secrets and unrelated bindings/configuration were explicitly inherited from the pinned active production versions and compared before activation; assets were the frozen candidate's verified static assets. Post-rollback metadata/settings match the original baseline. Main CLASSROOM_HUB remains hft-classroom-control production and CLASSROOM_CONTROL_URL remains wss://classroom.highfrequency.vip. Existing production routes and webhook settings were not changed.

The release helper initially compared the deployed-only migration_tag field against an undeployed version. Official API documentation explains that omission before deployment is expected. The helper was corrected, the existing undeployed control version was reused, code/bindings were verified, and v1 was checked after activation. No DO migration was necessary or submitted. [Cloudflare version API](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/create/).

A fresh read-only D1 recovery bookmark is saved privately in baseline.json; it was not used. No signed backup URL/credentials were exposed. Application-only rollback used pinned existing versions and required no database restore. Frozen optimized source/artifacts remain available for a future separately authorized release; do not deploy stored versions merely because they are newest.

The browser also exposed an existing Better Auth warning that client IP detection falls back to a shared per-path rate-limit bucket. It was not investigated or changed here, and it is not used to explain the measured SSR CPU. Record it for a future targeted review if synthetic login concurrency is affected; do not expand this release.

Final evidence directory: .wrangler/phase-c-release/2026-11-08/cpu-production-acceptance. Key records: activation-result.json, rollback-result.json, authenticated-teaching-cpu-samples.json, postrollback-health.json, postrollback-verification.json. Final frozen hashes unchanged.

STOPPED after failed CPU gate, rollback and verification. No Phase C, Phase D, Lesson 2, migrations, student fixture creation or plan upgrade.
