# Phase B CPU optimization — local verification and frozen candidate

No production deployment, configuration update, migration, plan upgrade, real-student mutation, message, invitation or Stripe activity occurred. Production migration 0037 was not replayed. Phase C remains blocked pending its separately authorized release process.

## 1. Request-cost map

Measured the frozen deployed-equivalent Phase B publish-fix artifact and its isolated optimized derivative through local OpenNext/workerd, using normal Better Auth logins and synthetic local D1 data. Instrumentation records SQL shapes, counts and decoded byte lengths, never bound values, cookies, tokens, row contents or credentials. First/warm page requests are deliberately separate. SQL shape uniqueness and duplicate statement flags are not identical to D1 RPC counts: a transactional batch is one call containing multiple statements. Duplicate flags include necessary fresh security reads.

| Request | Main D1 before → after | Unique SQL shapes before → after | Duplicate statement entries before → after | Decoded bytes before → after |
|---|---:|---:|---:|---:|
| Teaching page cold | 5 → 4 | 5 → 4 | 0 → 0 | 1496 → 1658 |
| Teaching page warm | 3 → 2 | 3 → 2 | 0 → 0 | 85 → 247 |
| Teaching data API | 9 → 8 | 9 → 8 | 0 → 0 | 5170 → 5965 |
| READY initial state | 29 → 13 | 12 → 10 | 15 → 3 | 10300 → 6294 |
| READY state | 25 → 9 | 9 → 7 | 14 → 2 | 9859 → 5760 |
| Start | 29 → 12 | 12 → 10 | 16 → 3 | 11553 → 7295 |
| Instructor join | 38 → 14 | 15 → 13 | 24 → 4 | 17493 → 10996 |
| Student join | 39 → 14 | 16 → 13 | 24 → 4 | 19872 → 13195 |
| Presenter grant | 32 → 14 | 14 → 12 | 18 → 4 | 18098 → 13831 |
| Instructor screen | 41 → 16 | 15 → 13 | 26 → 5 | 23662 → 17117 |
| Student screen | 42 → 16 | 16 → 13 | 26 → 5 | 25266 → 18469 |
| Presenter demote | 32 → 14 | 14 → 12 | 18 → 4 | 20936 → 16669 |
| LIVE state | 27 → 10 | 9 → 7 | 16 → 3 | 17774 → 13639 |
| End | 31 → 15 | 19 → 17 | 16 → 4 | 17941 → 13938 |

The map was collected before the final Scheduler-only unused-date calculation removal; classroom/DAL code is unchanged, and the final compiled artifact was subsequently exercised against development LiveKit. Final Scheduler SSR output equivalence and constructor regression were separately checked.

All mapped requests returned 200. GETs issue zero control service notifications; each listed mutation issues one. Main Worker makes no direct DO calls; the control service forwards authenticated publication to its room DO. Downstream control/DO nonce/storage work is outside these main-D1 counts and was not separately counted. No recursive Worker chain was found. Provider operations remain unchanged: join reconciles ListParticipants/ListRooms/CreateRoom if absent/RemoveParticipant; screen additionally uses UpdateParticipant and removal/reconciliation; grant/demotion use UpdateParticipant/RemoveParticipant/ListParticipants. End uses ListParticipants, participant removals and DeleteRoom. No provider-call reduction is claimed.

## 2. Exact 38-call instructor join breakdown

Two-person fixture. One four-statement transaction counts as call 9; thus 41 SQL statements are 38 D1 calls. The trace includes fresh DAL lifecycle/password checks but no Better Auth session SQL on this already-authenticated cookie-cache request. Cold page authentication does perform session/user queries, separately counted above.

Classification applies to the baseline opportunity, not permission to discard security checks. REQUIRED reads after provider awaits remain fresh. CACHEABLE means only within the same synchronous authority phase, never across an external await or a subsequent request. DERIVABLE facts are folded into an indexed joined projection, not accepted from the browser.

| Call | Baseline operation | Classification / treatment |
|---:|---|---|
| 1 | DAL lifecycle/ban/role | REQUIRED; consolidate account projection |
| 2 | DAL forced-password state | CACHEABLE WITHIN REQUEST; same account projection |
| 3 | Authority user/entitlement | REQUIRED; selective joined authority |
| 4 | Authority teaching session | DERIVABLE FROM ALREADY-LOADED DATA within joined context |
| 5 | Enrollment existence | REQUIRED for student; joined indexed EXISTS, instructor bypass remains explicit |
| 6 | Idempotent command lookup | REQUIRED |
| 7 | Room state | CACHEABLE WITHIN REQUEST phase; reuse authority room |
| 8 | Presence leases | CACHEABLE WITHIN REQUEST phase; combine with room |
| 9 | Atomic guarded command + room revision + lease + attendance batch (4 statements) | REQUIRED; retained atomic guards |
| 10 | Reconciliation teaching session | CACHEABLE WITHIN REQUEST phase |
| 11 | Reconciliation room | CACHEABLE WITHIN REQUEST phase |
| 12 | Reconciliation leases | CACHEABLE WITHIN REQUEST phase; combined read |
| 13 | Host authority user | REQUIRED roster eligibility; consolidate bounded roster query |
| 14 | Host authority session | DUPLICATE same reconciliation session |
| 15 | Host authority enrollment | DERIVABLE joined roster/owner check |
| 16 | Student authority user | REQUIRED roster eligibility; consolidate bounded roster query |
| 17 | Student authority session | DUPLICATE same reconciliation session |
| 18 | Student authority enrollment | REQUIRED indexed roster existence; consolidate |
| 19 | Latest room before provider work | REQUIRED phase boundary; combined room/presence read |
| 20 | Latest presence | CACHEABLE WITHIN REQUEST phase; combined read |
| 21 | Pending provider cleanup jobs | REQUIRED |
| 22 | Room after provider inventory | REQUIRED fresh post-await state |
| 23 | Presence after provider inventory | REQUIRED freshness; combined with room |
| 24 | Clear cleanup_pending guarded update | REQUIRED |
| 25 | Pre-token snapshot user | REQUIRED fresh authority phase |
| 26 | Pre-token snapshot session | REQUIRED; joined authority context |
| 27 | Pre-token snapshot enrollment | REQUIRED; joined authority context |
| 28 | Pre-token snapshot room | CACHEABLE WITHIN REQUEST phase from authority |
| 29 | Pre-token snapshot presence | CACHEABLE WITHIN REQUEST phase from authority |
| 30 | Pending cleanup/token barrier | REQUIRED |
| 31 | Post-token authority user | REQUIRED fresh post-await authority |
| 32 | Post-token authority session | REQUIRED; joined authority context |
| 33 | Post-token authority enrollment | REQUIRED; joined authority context |
| 34 | Post-token snapshot user | DUPLICATE immediate same-phase authority |
| 35 | Post-token snapshot session | DUPLICATE immediate same-phase authority |
| 36 | Post-token snapshot enrollment | DUPLICATE immediate same-phase authority |
| 37 | Post-token snapshot room | CACHEABLE WITHIN REQUEST phase from fresh authority |
| 38 | Post-token snapshot presence | CACHEABLE WITHIN REQUEST phase from fresh authority |

No authorization read was moved to the control Worker/DO. Relocation would increase scope and risk stale authority. Unnecessary work removed is repeated same-phase hydration, broad SELECT * decoding and unused UI date formatting, rather than a blanket removal of duplicate SQL shapes.

## 3. Exact 41-call screen breakdown

Screen performs the same 38-call skeleton with a three-statement mutation batch rather than join's four-statement attendance batch. Before applying provider permission cleanup it additionally reads (39) current room and (40) current presence, then (41) deletes the completed cleanup job. These are the precise three additional D1 calls. In execution order they occur inside the cleanup/reconciliation phase, not literally at the end of the trace. Screen has 43 statements in 41 calls. Student join/screen each add a baseline entitlement read, producing 39/42 calls. The optimized HTTP paths are 14/16 for either role. Permission changes, revision guards, three-slot reservations and cleanup completion remain authoritative.

## 4. Duplicate query result

Instructor join duplicate statement flags: 24 → 4; screen: 26 → 5; LIVE state: 16 → 3. These flags compare repeated parameterized query shape/bind identity internally without saving arguments. Remaining duplicates chiefly cross external await boundaries and must not be cached indiscriminately. Unique SQL shapes can rise while total calls fall when selective joined queries replace broad repeated helpers.

## 5. Request-scoped reuse

Selective lifecycle/forced-password/role/entitlement account data replaces independent DAL reads. React cache is scoped to a server render; API authorization explicitly reads freshly per request. Classroom authority retains user, teaching session, enrollment, room and presence for one phase. Post-provider/token-await authority is reloaded, then its snapshot is reused immediately. No process-global authorization cache, stale-client authority, token lifetime change or admission bypass was introduced.

## 6. Query consolidation

Indexed user/session/room authority uses primary-key joins and indexed enrollment EXISTS; presence is bounded by the classroom model. Reconciliation replaces N separate user/session/enrollment triplets with one bounded roster eligibility query and the existing memberReady rules. Room/presence reads are combined, and leases are indexed in a Map. EXPLAIN evidence is in query-plans.json. No migration or new index is required. Selective projections exclude private intake, consultation, financial plan and learning-path content. Existing public classroom projections are unchanged.

## 7. Polling

Previously every client performed a protected state GET every three seconds even when receiving authoritative DO snapshots. A healthy, recently updating WebSocket now suppresses those redundant GETs; a 30-second safety refresh remains. Missing/stale control delivery retains the three-second fallback, and an in-flight guard avoids overlapping GETs. Protected admission heartbeats remain every 15 seconds and are not replaced by WebSocket activity. Native measurement: one state GET in 35,007 ms versus approximately 11 previously; protected lease remained more than 15 seconds ahead.

## 8. Teaching dashboard hotspot

Cold/warm page D1 falls 5→4 / 3→2; teaching data API 9→8. No repeated Academy/financial/intake/learning-path hydration was found in the classroom routes. Initial Scheduler SSR had no sessions and selected Upcoming, yet constructed Intl.DateTimeFormat to calculate an unused Today-filter value. Main-isolate profile mapped a large cold sample cluster to that constructor. It now computes today only when the Today view actually has sessions. A red/green SSR test proves constructor count 1→0. Initial markup remains byte-identical (559 bytes, SHA256 377aa67dd1c7e74cc13f6c33701331d579277fb5940a1f101ceecbc10324d181); populated Today/date-boundary semantics are unchanged.

Illustrative local cold-page wall/sample results: before Scheduler tweak 225 ms / 1,160 samples, after 197 ms / 898 samples. Final warm page wall times were 27/22 ms. Sampling interval is 100 µs, but samples, local heap and local wall time do NOT equal Cloudflare enforced/billable CPU. Final profile was not a controlled timing benchmark and overlapped development-provider work. Framework module initialization, rendering, routing and GC remain significant cold costs. No claim is made that cold requests now fit 10 ms.

## 9. Screen-admission delta

The optimized difference is two calls (16 screen versus 14 join), preserving the provider permission/cleanup sequence. No permission or slot check was removed to reach this budget. Native screen admission and published provider track were observed; fourth-slot admission was rejected with 409.

## 10. Minimal changes

Six baseline files modified: lib/dal.ts; lib/classroom/service.ts; components/classroom/presentation.ts; components/classroom/Classroom.tsx; components/teaching/Scheduler.tsx; lib/auth-safety.test.ts. The auth test fixture now supplies the account fields from the consolidated projection; assertions were preserved.

Seven files added: lib/access-context.ts and its tests; lib/classroom/testing/request-cost.ts; lib/classroom/cost.test.ts; lib/classroom/polling.test.ts; lib/teaching/cpu.test.tsx; scripts/classroom-request-cost.cjs. No dependency, migration, token policy or infrastructure architecture change. Shared source retains pre-existing Phase C guards; the isolated frozen release contains only Phase B plus this fix and the already-deployed publish fix.

## 11. Before/after D1 targets

Compiled main join 38→14 (63% reduction), screen 41→16 (61%), LIVE GET 27→10 (63%), End 31→15 (52%). Service-only structural harness: two-person join 36→13 / screen 39→15; eleven-person join 63→13 / screen 66→15. HTTP adds one fresh optimized DAL access read. Tests set budgets ≤14 service join / ≤16 service screen for both roster sizes, not a fragile exact SQL implementation match. Fresh security phases, idempotency, atomic updates, cleanup and attendance are reasonable remaining costs; further reductions must be justified by profiles rather than query count alone.

## 12. Repeated helper counts

The old eleven-person join ran 15 authority triplets (N+4); optimized work uses three fresh phase authority reads plus one bounded roster eligibility query. Service snapshot drops five reads to one. Repeated independent room/presence pair hydration is consolidated. These source-service numbers are distinct from complete HTTP/DAL counts. N=11 was a deterministic fixture/query-budget exercise, not eleven interactive people or eleven provider clients.

## 13. Payload/CPU work

Decoded instructor join bytes fall 17,493→10,996; screen 23,662→17,117; READY state 9,859→5,760. Public response sizes were unchanged: join 2,136 bytes, screen 2,101, LIVE state 1,769, End 1,883. Teaching page remained 21,240 bytes. The teaching API comparison has one additional canceled local historical booking and a 162-byte larger selective account projection: its 795-byte decoded increase is not evidence of an application response regression or saving. No private records were serialized to support profiling. The deterministic harness records local process CPU, wall time, duplicate SQL/helper counters and response/decoded bytes, explicitly labeled as non-Cloudflare measurements. Inspect script usage and fixture source before rerunning; no production credentials/database are used.

## 14. Security regression

Tests cover fresh API account changes, lifecycle/banned/password/entitlement, enrollment/instructor ownership, roster revocation including expired complimentary access, cross-student isolation, three-screen caps, presenter revocation, post-token deactivation with provider revoke, stale credentials, terminal state, duplicate/replayed events, provider failures and normal reconnect. Atomic SQL guards and fresh post-await reads remain. Independent read-only review found no important correctness/security findings, including the final Scheduler change. Privacy response shapes remain unchanged. Query budgets are not obtained by trusting cookie membership or client snapshots.

## 15. Development provider/native acceptance

Development LiveKit only; four isolated example.invalid accounts; normal Better Auth login and protected application commands. Native Chrome published an owned safe chart tab. One native + two synthetic provider screens were simultaneously observed, UI displayed 3/3; fourth screen denied; focus and side-by-side worked. Normal pre-END reconnect and presenter revocation passed. End through the protected HTTP command committed ENDED, cleared grants/screens, disconnected existing participants, denied fresh admission (409), rejected an actual unexpired cached screen token at the provider (not timeout), prevented media/screen resumption, and removed the provider room. This terminal test was repeated successfully against the final compiled artifact after the Scheduler change.

Limitations and interrupted attempts are retained as evidence: initial synthetic logins hit the existing normal rate limit; the harness then honored Retry-After without weakening limits. One already-active repeated screen request returned 409; it is not counted as a pass. A native End button attempt was interrupted by Wrangler ProxyController/ProxyWorker “Network connection lost”; D1 remained LIVE, so that click is NOT certified. The remaining provider test used existing HTTP fallback in a private local config, with protected service-binding publication intact; no product fallback was added. Direct Miniflare startup also failed locally and was abandoned. The subsequent Chrome-available follow-up closed this local gap: protected realtime WebSocket returned 101, native End button and confirmation succeeded, the UI showed ENDED / LESSON ENDED, and the parallel probe rejected an actual unexpired cached token, denied fresh admission with 409, disconnected participants and confirmed provider-room removal. See development-native-terminal-result.json. Production acceptance must still repeat this behavior. This run does not recertify three native screens or a full eleven-person exercise.

Cleanup: all 12 owned synthetic local rooms ENDED, zero open attendance, zero pending cleanup jobs, development provider room inventory zero. Remaining own fake booking canceled; QA runtime stopped. Temporary copied .dev.vars and password-bearing localhost test entry removed. Original QA credential files and production credential file unchanged. Frozen bundles contain the original application entry, not the private login/chart or instrumentation routes.

## 16–20. Final verification

- Focused security/classroom/Phase A/lifecycle/Academy/affected Phase C set: 214 passed; additional teaching SSR regression: 1 passed (also included in full suites).
- Isolated Phase B candidate full suite: 522 passed, zero failures.
- Shared source full suite including existing Phase C: 554 passed, zero failures.
- Candidate TypeScript: exit 0. All-shared-source clean TypeScript workspace with unchanged compiler options: exit 0. This avoids unrelated stale root generated artifacts; it is not represented as a direct dirty-root tsc run.
- OpenNext production build: exit 0. Inherited generated XMLDOM duplicate-member warnings remain; no build error. Initial isolated build with symlinked external dependencies failed Turbopack root resolution; cloning the existing dependency tree fixed the environment without changing dependencies/configuration.
- Main and classroom Worker production-config dry-runs: exit 0. Existing binding names/production URL configuration retained; no upload/activation.
- Performance harness and compiled request traces both exercised; tests enforce meaningful two/eleven-person budgets and security behavior. Local timings cannot enforce Workers Free's production ceiling.

## 21. Frozen candidate

Manifest: docs/releases/2026-11-08-phase-b-cpu-candidate.json. Isolated source: /private/tmp/hft-phase-b-cpu-fix. Exactly 489 baseline files plus seven added files; six baseline changes. Frozen source/assets archive, final production-equivalent main/control bundles and sourcemaps, static-asset inventory and sanitized evidence are under .wrangler/phase-c-release/2026-11-08/cpu-optimization. Hashes in manifest must be rechecked before any separately authorized deployment. No QA injection/instrumentation is in frozen bundles. Final hash/credential scan verified 592 source/artifact/asset files with zero development credential or private QA-entry matches; production credentials were not read.

Expected rollback/baseline pins from prior recorded release, not re-read from production this run: main abf18574-031e-4ef5-992a-f30f6a316b4f; control 00da709f-7dbb-43fe-ad2c-1bd260eeba8e (the fixed publish Worker). Any future release must confirm current live versions, bindings and credential health read-only first. No migrations pending for this fix; do not replay 0037. Future Phase C Revision 3 must be refrozen with both deployed publish fix and this optimization; this run does not update or authorize that frozen Phase C release.

## 22–23. Release/plan decision

A. **Dominant CPU hotspot known?** Dominant avoidable work is identified: repeated authority/room/roster loading and decoding, redundant state polling, and unused cold Intl initialization. Exact production CPU attribution and residual cold-framework cost are not proven by local sampling.

B. **Main path substantially reduced? YES.** Structural reductions above are measured on compiled requests; security phases remain.

C. **Safe to test on Workers Free? YES, for a separately authorized controlled synthetic QA release/measurement, not general student release.** Local native End/active-WebSocket completion now passes; production must repeat that acceptance gate. Record actual Cloudflare cold/warm CPU/outcomes for teaching, GET, joins, screen changes and End; verify no 503/exceededCpu, terminal cleanup and stale-token rejection. Roll back to recorded healthy versions if that gate fails. Do not claim comfortable 10 ms headroom until that production evidence exists.

D. **Paid plan necessary? NOT ESTABLISHED.** No upgrade performed or recommended as an immediate requirement. HFT may remain on Free if the optimized cold/warm production measurements pass with headroom. If framework cold initialization or remaining legitimate authoritative work still exceeds the supplied 10 ms limit, document those measurements and compare the smallest further safe optimization with a separately approved paid-plan change. Local success alone cannot settle this decision.

STOP: no production action authorized/performed by this candidate preparation.

## Native browser follow-up — completed after Chrome became available

No code, source fingerprint, generated bundle, sourcemap or static asset changed. Only verification metadata/evidence was updated. Native End Class click, confirmation and terminal UI passed with the protected realtime channel active. Development provider rejected the still-unexpired cached screen token (no timeout); fresh join returned 409; grants were off, participants disconnected and provider room absent. Normal pre-END reconnect and presenter revocation passed in the same probe. Local runtime stopped and temporary copied credentials/QA entry removed; twelve owned synthetic rooms ended, zero open attendance/cleanup jobs, zero remaining provider rooms. This closes the previously reported interrupted native End check; production CPU and full eleven-person certification remain outstanding. Existing suite/build results remain applicable because no product code changed.
