# Phase B main Worker resource-limit diagnosis

2026-11-08. Production read-only diagnosis; no deployment, migration, plan/limit change, webhook change, invitation or production fixture creation. **The exceeded resource is conclusively CPU. A safe code correction has not been established or frozen. Phase B/Phase C acceptance remains blocked.**

## 1–3. Resource, evidence and failing route

Cloudflare's signed-in production observability dashboard identified Workers Free and showed this failed invocation:

| Field | Observed value |
|---|---|
| Invocation ID | `0fa442a0355b63f915222b380bd036a9` |
| UTC | `2026-11-08T20:32:56.296Z` |
| Main version | `abf18574-031e-4ef5-992a-f30f6a316b4f` |
| Request | `POST /api/classroom/qa-publish-fix-prod-6c044e3c6f67` |
| HTTP | 503 |
| Outcome | **`exceededCpu`** |
| CPU | **10 ms** |
| Wall time | **255 ms** |

This is invocation metadata, not an inference from the generic HTML error page. The earlier browser action was screen admission. Historical logs do not retain the command body/action, so the observed POST correlation must not be represented as a separately recovered request-body trace. The original screen failure's CF-Ray was not preserved. Additional historical errors explicitly said “Worker exceeded CPU time limit” for GET polling on the same synthetic classroom and for `/admin/teaching`. The defect is therefore not proven exclusive to `screenStart`.

API attempts to read historical observability/subscriptions returned 403 with the existing Wrangler credential. The already signed-in dashboard supplied the above evidence; no token scopes or authentication configuration were changed. Traces were disabled. No invocation stack or exact terminating source line is available. No production write was used to reproduce the failure.

## 4. Actual screen-admission execution path

The provider work is **in the main Worker before the control notification**, not inside the DO as the proposed investigation diagram might imply:

```text
browser screenStart POST
  main OpenNext/Next routing
  same-origin, content-type and bounded JSON validation
  Better Auth session → lifecycle → forced-password → membership checks
  classroomCommand
    authority: current user + confirmed session + enrollment/assigned host
    load room JSON + presence leases
    request-key/revision/permission/screen-slot checks
    atomic command/state/cleanup-job commit
    reconcileClassroom
      fresh per-participant authority checks
      cleanup permission update + strict participant removal
      provider participant/track inventory and bounded reconciliation
    current authorized snapshot
    require no pending cleanup
    LiveKit ensureRoom + strict actor removal
    second-boundary wait, then signed 60-second participant token
    fresh authority/snapshot/connection/grant/lease checks after awaits
  publishClassroom via CLASSROOM_HUB
    control HMAC + persisted nonce
    ClassroomRoom DO dispatch
    current-authority snapshots/control broadcast + alarm scheduling
  main returns private no-store admission response
  browser connects to LiveKit; subsequent native screen media goes to LiveKit
```

Security checks occur both before mutation and after asynchronous provider operations. Removing those fresh checks or shortening revocation is not a safe performance fix. The one-second token-cutoff wait and provider network waits are wall time, not CPU execution time.

## 5–6. Working/failing comparison and loops

Normal join and screen admission use the same main route, auth, revision guards, provider adapter, post-await admission validation and notification. `screenStart` adds screen eligibility/slot/reservation mutation and a permission cleanup job; on the normal successful provider path that adds UpdateParticipant plus strict RemoveParticipant before the later admission removal. A fresh host join also resets screen reservation state. Direct signed `/internal/publish` avoids Next, Better Auth, media issuance and the main command/reconciliation work. Its success does not prove the heavier main route stays below its CPU budget.

No recursive main→control→main cycle was found for these matching routes. `/internal/publish` dispatches to the DO; the DO reads D1 directly and does not invoke HFT_APP. HFT_APP is a fallback for unmatched public requests, including the control hostname root health check. It is not taken by the signed publish branch. No main self-fetch was found in media admission.

The browser admission coordinator prevents overlapping media replacements. Provider failover has at most three attempts for the production SDK configuration; no unbounded provider retry was found. Room participants are capped by the existing 11-person model, chat snapshots by 100 entries and event history by 100. Reconciliation loops are bounded by those records/jobs. Browser polling explains repeated requests, not recursive execution within one request. Repeated authority/loading/reconciliation work exists, but each occurrence cannot automatically be removed because of race/security boundaries.

## 7–12. CPU, memory, subrequests, bindings, D1/DO and provider

[Cloudflare's current limits](https://developers.cloudflare.com/workers/platform/limits/) specify Workers Free CPU 10 ms, isolate memory 128 MB and subrequests 50/request. The production settings have usage_model `standard` with no explicit CPU override; the dashboard independently identifies Workers Free. Waiting for I/O does not consume CPU. Configuration limits are [not enforced by local development](https://developers.cloudflare.com/workers/wrangler/configuration/).

- **CPU:** confirmed production `exceededCpu`, 10 ms consumed at termination. Required uncapped production CPU/p95/p99 is unknown. Local sampled profiles are not Cloudflare's billed/enforced CPU measurement.
- **Memory:** no `exceededMemory` outcome for the inspected failure. Peak heap/RSS for it is unavailable; no memory exhaustion diagnosis is justified.
- **Subrequests:** no subrequest-limit outcome for the inspected failure. Production invocation subrequest counts were unavailable. Local D1 call counts are not an exact total platform subrequest measurement.
- **Service binding:** one main notification per successful non-heartbeat command in the counted local reproduction; no main→control→main recursion. Downstream nonce persistence, DO dispatch and broadcast are additional control-side work, excluded from the main D1 counts below. Moving code to a service binding must not be assumed to manufacture a new CPU budget without measurement.
- **D1:** substantial bounded repeated work. Counts below include main auth and command execution, exclude control/DO queries, and separate database calls from statements batched in them.
- **Provider:** join normally involves participant inventory, room inventory/creation if absent and strict removal before issuing a token. Screen admission adds permission-update/removal cleanup. End uses terminal inventory, durable revocation barrier, strict removals and room deletion. Signed RPC tokens, JSON/protobuf conversions and response handling execute in main for these HTTP commands. There was no provider-failure/retry evidence in the successful local comparison. A global-fetch counter did not intercept the bundled SDK fetch path; its zeros were explicitly discarded, not reported as zero provider calls.

### Exact-artifact local reproduction

Decoded previously verified active-version module bytes matched the frozen Phase B application bundle byte-for-byte:

`SHA256 32d5a840fb5978dad92ad0c9531743bfa44f8b2d7b6d92e4443ae72d4b8ab9b2` (25,328,287 bytes).

Local workerd used the same runtime date/flags, corrected Phase B control bundle, synthetic-only local D1, normal local credential login and development LiveKit credentials. No production data was copied. CPU profiling targeted the **main isolate directly**; preliminary control-isolate samples were excluded. The unmodified artifact returned 200 for three snapshots, start, join, screenStart and end. Its main-isolate sampled stacks contained Next/OpenNext routing, auth, D1 processing and provider signing/serialization. They did not establish one exact terminating production line or an optimized target that is guaranteed below 10 ms.

A separate **local diagnostic copy** counted calls without logging SQL arguments, headers, token bodies or credential values:

| Local action, two-person roster | Main D1 calls | Main statements | Main control notifications |
|---|---:|---:|---:|
| First READY GET, initializes local room | 29 | 29 | 0 |
| Subsequent READY GET | 25 | 25 | 0 |
| start | 29 | 30 | 1 |
| join | 38 | 41 | 1 |
| screenStart | 41 | 43 | 1 |
| end | 31 | 38 | 1 |

All six counted requests returned 200 and no realtimePending response. These are **local counts, not reconstructed production counts**, and the production probe had one host rather than this two-person fixture. Roster growth increases repeated per-person authority reads; an 11-person request budget must be measured, not extrapolated as already passing. Local wall times for provider-backed requests were seconds while Cloudflare's observed failed production wall time was 255 ms. Local success does not reproduce or clear the platform CPU gate.

## 13–16. Root cause, correction, files and candidate

**Proven:** the main Phase B execution exceeds the active Workers Free 10 ms CPU budget in real invocations. Screen admission performs the full state/reconciliation/provider workload in that main invocation; the issue also affects polling and another authenticated page. It is not the repaired consumed-request control defect, and not a demonstrated migration, memory, provider timeout, recursion or subrequest-limit failure.

**Not proven:** the exact source-level hotspot, how much production CPU each phase contributes, whether deduplicating safe reads alone is sufficient, or whether a fully optimized workload genuinely requires a different plan. It would be premature to label this a proven legitimate plan-upgrade requirement or to ship an arbitrary refactor as a verified fix.

No product code changed. No fix candidate was frozen because no correction has a verified causal/performance result. Existing frozen candidates were preserved.

The minimum next engineering experiment is a measured A/B reduction of repeated room/roster reads or moving the room-command workload behind the existing authenticated serialized DO boundary, while retaining current authority checks after external awaits, per-user private admissions, revision/idempotency guards and terminal revocation. Measure the main, control and DO portions separately; do not assume offloading fixes the caller's limit. A successful experiment must show reduced work without losing fresh authorization, and then receive real platform CPU validation before claiming this gate passed. This is a proposed experiment, **not an implemented or proven correction**. No plan/limit upgrade is recommended from the current evidence.

Potential implementation locations, contingent on that experiment: `app/api/classroom/[sessionId]/route.ts`, `lib/classroom/service.ts`, `lib/classroom/transport.ts`, `workers/classroom/src/index.ts`, and corresponding admission/security/protocol tests. Changes to shared Phase C source would need an isolated Phase B candidate and must carry the already-deployed publish correction; do not deploy the old frozen Phase C control artifact.

## 17–22. Provider recheck and tests/build status

Development provider authentication, exact-artifact local instructor admission, screen-token admission and End Class succeeded. The counted local run also passed those actions. All diagnostic rooms are gone; three local resource-probe room states are ENDED, open attendance 0 and cleanup jobs 0. Development project total rooms 0. Local profiling servers were stopped and the temporary copied development credential file was removed; original QA credential files were left unchanged.

No correction was prepared, so this run does **not** certify a fixed native screen exercise, three-screen model, presenter revocation or cached-token attack. No browser/native picker exercise or new 11-person acceptance was claimed. Prior provider acceptance remains prior evidence, not a replacement for these pending gates.

Focused/full-suite tests, TypeScript, OpenNext and both Worker dry-runs were **not rerun for a nonexistent patch**. The actual checks here were exact-byte artifact comparison, unmodified workerd runtime reproduction, main-isolate profiling, separately counted local actions, development-provider cleanup, production health/metadata/aggregate reads and session-material artifact scan. Prior frozen-candidate test/build results were not relabeled as fresh tests.

## 23. Session-cookie containment

No prior cookie value was reused, printed or placed into a request. Earlier normal sign-out reduced production session count by one and the protected browser page redirected to login. This run's anonymous protected HTTP reads also require login. Those observations support containment; they do not cryptographically retest the exact old bearer value. The old value was deliberately not recovered for such a probe. No unrelated auth secret was rotated. Future acceptance must use a fresh normal instructor login.

All file types in the new control-fix release and resource-diagnosis artifact directories were scanned for session-cookie/JWT patterns: zero matches. This is a pattern scan, not a guarantee that arbitrary encoded credential material is mathematically absent. Explicit private credential input files outside those artifact scopes remain private; local fixture credentials were not included in a release candidate/report. No raw dashboard request headers were saved or printed during this diagnosis.

## 24. Production safety and remaining blockers

Read-only verification retained main `abf18574-031e-4ef5-992a-f30f6a316b4f` and control `00da709f-7dbb-43fe-ad2c-1bd260eeba8e`, with unchanged bindings. Main `/` and `/login` and control root returned 200; anonymous protected pages redirected to login; protected APIs, invalid control tickets and invalid webhook signatures remained rejected. Existing genuine production room_started/room_finished webhook records are retained, with zero provider rooms and zero open synthetic attendance. The old production fixture is still canceled/ENDED, disconnected, screen inactive, grants off and cleanup_pending 0. Migrations remain 37 through 0037, FK violations 0, protected user/account/consultation aggregates unchanged. No production student/account/booking mutations, messages or Stripe activity in this run. No migration replay.

Remaining blockers are a verified causal optimization or justified measured runtime requirement, a new tightly scoped candidate if code changes, and incomplete real production Phase B acceptance. The unchanged main's successful health pages do not clear the heavier CPU failure.

## Explicit decisions

A. **Is the 503 root cause known? PARTIALLY:** exact resource/plan budget is proven CPU 10 ms; exact source-level cause and smallest verified correction are not established.

B. **Application defect or legitimate plan requirement? UNDETERMINED.** Heavy repeated application work is measured; optimized runtime requirements are not. Do not upgrade as a workaround.

C. **Is a local fix verified? NO.** Unmodified local operations pass, but local platform-limit enforcement is absent and no correction was made.

D. **Is a new controlled production fix deployment required? NOT YET DETERMINED/AUTHORIZED.** No verified fix candidate exists. Do not deploy.

E. **Gates to rerun after a verified correction:** exact screenStart with real platform CPU/outcome measurements; normal instructor/student admission and permitted pre-END reconnect; presenter grant/revocation and native screen publication, three-screen regression; normal End Class committing ENDED before provider teardown; existing participant removal, actual HFT-issued unexpired cached-token replay, fresh denial, no post-END mic/camera/screen/presenter restoration; genuine room_started/room_finished webhook validation/replay protections; attendance/slot uniqueness and zero-room/open-attendance cleanup. Then focused admission/resource/control/presenter/screen/LiveKit/End/cached-token/Phase B tests, full suite, TypeScript, OpenNext and both dry-runs for the final candidate. Phase C remains blocked and must incorporate the active control fix.

Private evidence: `.wrangler/phase-c-release/2026-11-08/resource-503-diagnosis/` (`cloudflare-invocation-evidence.json`, `local-reproduction.json`, `local-cleanup.json`, `session-material-scan.json`, final health and aggregate metadata). CPU profiles and test instrumentation remain local scratch artifacts, not a deployable candidate.
