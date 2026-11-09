# Phase B /internal/publish — proven root cause, local correction verified, not deployed

2026-11-08. **No production deployment, configuration/key/webhook change, migration replay, invitation, message or transaction occurred.** Production still runs the previously activated secret-only versions with the defective forwarding code. The corrected control-only candidate is frozen for separate authorization.

## 1–8. Root cause, execution boundary and rotation effects

The control Worker's `/internal/publish` handler calls `await request.text()` to validate the HMAC against the exact body, then forwards **that same consumed Request** to the Durable Object stub. Workerd cannot reconstruct a request with a used body and rejects at the stub forwarding boundary. The code returns the asynchronous fetch promise without `await` inside its try/catch, so that rejection escapes the safe error handler and becomes Cloudflare HTML **1101 / HTTP 500**.

Exact production reproduction, using only the previously ended/canceled instructor-only synthetic session `qa-rotation-host-6354316ad260`:

- Route: POST `https://classroom.highfrequency.vip/internal/publish`, receiving Worker hft-classroom-control.
- Active control code reference: cefcff3a-e1f7-4d26-bdeb-17c038992556; main abf18574-031e-4ef5-992a-f30f6a316b4f.
- Body: `{"sessionId":"qa-rotation-host-6354316ad260"}`; expected 200 JSON `{"ok":true}`.
- Valid signed request: **500**, text/html, Cloudflare **1101 “Worker threw exception”**.
- CF-Ray: **a577264639346aeb-DFW**; response time 2026-11-08 19:57:55 UTC.
- Exact nonce replay: **503 JSON** `{"error":"Classroom control unavailable"}`.
- Invalid signature: **401 JSON** `{"error":"Unauthorized"}`.

The signature protocol is unchanged HMAC-SHA256 over POST, path, Unix timestamp, nonce and exact body separated by LF, encoded base64url. Successful nonce consumption and rejected replay establish that the failure occurs **after authentication**, not because of a mismatched secret, invalid timestamp or body canonicalization.

The **byte-identical deployed control bundle** was run in isolated local workerd. It produced HTTP 500 and the exact exception:

`TypeError: Cannot reconstruct a Request with a used body.`

The stack identifies the original forwarding line in `workers/classroom/src/index.ts`. Original deployed bundle SHA-256: `298f4fcc65d05bb71f9a8ace02bda392e441312cc43fdf3af5129b6bb9310148`. This exact workerd reproduction, matching production's failed authenticated branch, conclusively identifies the boundary defect; the production HTML does not itself expose a server stack.

| Question | Finding |
| --- | --- |
| Failing component | Control Worker → DO stub request serialization/forwarding |
| Authentication valid? | YES; replay was consumed/rejected, invalid signature denied |
| Did publish invoke ClassroomRoom.fetch? | NO: forwarding fails before its handler can receive the consumed body |
| Did that failed request invoke LiveKit? | NO |
| Is `/internal/publish` media-track publishing? | NO: it broadcasts authorized HFT control snapshots; media token/permission operations remain on existing separate paths |
| Did secret rotation cause the code defect? | NO: code is byte-identical to the prior Phase B baseline; the latent defect was exposed by positive-path acceptance |
| Missing runtime/binding metadata? | No omission established. Before this task, code/bindings were verified exact and valid control WS invoked the same DO successfully. The failure reproduces with local binding/DO storage and no provider configuration at all |
| Session, terminal state or presenter state responsible? | NO: the transport boundary fails before DO session/participant/grant handling. It also fails for the already terminal synthetic context |
| Sensitive error exposed? | Production exposes a generic platform HTML error, not the signed secret/token. The local correction catches async failure and returns existing safe JSON 503; no exception details are sent to clients |

The main service path is: authenticated main command → signed CLASSROOM_HUB request → control signature and nonce checks → **failing request forwarding boundary** → DO snapshot broadcast (not reached). CLASSROOM_CONTROL_URL selects the browser WSS destination; it does not repair this consumed request. LIVEKIT_URL/API_KEY/API_SECRET are not used by the failing operation. The shared control secret, service/DO/D1 bindings and runtime compatibility remained intact in the previously verified secret-only versions. Final live metadata revalidation in this task was blocked by expired Wrangler access (401); see safety limits below.

## 9–11. Minimal correction and frozen candidate

Changed only the publish forwarding line:

```ts
return await env.CLASSROOM_ROOMS.get(env.CLASSROOM_ROOMS.idFromName(data.sessionId))
  .fetch(new Request(request,{body}));
```

The new request preserves method, URL, headers and the exact already-authenticated string. It does not parse/re-serialize the body. `return await` deliberately catches asynchronous DO forwarding failures in the existing safe JSON 503 handler. Auth, timestamps, nonce consumption, session validation, provider permissions, revocation, DO state and data contracts are unchanged. No blanket conversion of unexpected 5xx into a denial/4xx.

Invalid signatures/timestamps remain 401; signed invalid session syntax remains 400; nonce replay keeps its existing 503 contract. Unexpected async DO storage errors now return safe JSON 503 without private exception details. Other unrelated branches were not refactored.

Files changed in the isolated Phase B source and the shared source:

- `workers/classroom/src/index.ts` — one production line.
- `lib/classroom/realtime.test.ts` — four regressions using real Request streams, actual outer handler and actual DO publish handler with a local transport/storage boundary.

The shared source's existing Phase C work was preserved. Frozen original Phase B and Phase C Revision 3 directories/manifests were not modified. **The frozen Revision 3 control source still needs this correction incorporated and reverified before a later rollout; do not deploy its old control artifact over a repaired Phase B Worker.**

Frozen correction manifest: `docs/releases/2026-11-08-phase-b-publish-fix-candidate.json`.

- Candidate directory: `/private/tmp/hft-phase-b-publish-fix`.
- 489 inventoried Phase B source files; exactly the two paths above differ from the frozen Phase B source.
- Source fingerprint: `3fcbd12e05df0b3cfcb8f26f7a97c326d8c608f7ab5665354f92a02f223ff6ec`.
- Corrected control bundle SHA-256: `0e54dac68f036dfee5cba4c28dc0faea353dfb81b3bf067a72efb7a2c316bace`.
- Deployable target for a future authorized correction: **hft-classroom-control only**. Keep main abf18574-031e-4ef5-992a-f30f6a316b4f untouched. No migrations or DO namespace changes.
- Source archive and exact bundle hashes retained privately. 492 source/artifact files scanned: zero private production/development credential matches.

Independent code review found no actionable correctness/security issues. Its exact-byte test coverage note was addressed by asserting the literal forwarded body, including whitespace.

## 12–15. Real provider and security recheck

**Corrected LOCAL runtime + real DEVELOPMENT LiveKit: PASS. Production-after-fix: NOT RUN; no deployment authorized.**

This rehearsal used the exact frozen Phase B main runtime bundle, the corrected control bundle, synthetic local accounts with normal Better Auth login, isolated local SQLite/DO state, distinct development-provider credentials, and no delivery credentials. No production DB or real student records were used in the local rehearsal. No development webhook/tunnel was created or changed.

| Check | Result |
| --- | --- |
| Normal local host/student logins | PASS |
| Normal HFT provider admission | PASS |
| Actual main CLASSROOM_HUB publish | PASS; commands return without realtimePending |
| Authorized HFT-issued control WS ticket | PASS; receives LIVE snapshot |
| Signed publish with real connected provider participants | **200 JSON {ok:true}** |
| Control nonce replay | Rejected 503 |
| Normal pre-END reconnect | PASS |
| Authorized synthetic screen track before END | Observed in real development provider |
| HFT End Class commit | ENDED |
| Existing participant disconnect | PASS |
| Cached **actual HFT-issued** token | Still unexpired at attack; had publish and screen-source grants; direct provider reconnect **REJECTED** |
| Fresh HFT admission after END | Rejected **409** |
| Publish/screen restoration | Prevented by rejection of that still-valid publish/screen-capable token; no post-END connection/media restored |
| Final provider room | Absent |
| Local attendance / cleanup | Zero open attendance / cleanup pending; local synthetic session canceled; loopback runtimes stopped |

Production webhook regression evidence from the immediately preceding authorized run remains valid: one correctly signed endpoint, genuine room_started/room_finished and participant delivery, signed acceptance/duplicate handling, invalid/stale rejection. This correction changes only the control Worker; the main webhook receiver, production webhook and signing keys were untouched. No new production provider room was created in this diagnosis. Final direct production provider read authentication succeeds with **zero rooms**.

## 16–20. Regression and build results

- RED: original handler fails the positive signed-forwarding test with consumed Request; 5/7 tests pass.
- Body-only intermediate correction: positive forwarding passes, async private-storage failure still escapes; 6/7 pass.
- Final correction: **7/7** publish/Worker tests pass, including safe async failure and exact bytes, auth tampering, replay, stale signature and invalid session behavior.
- Focused Phase B auth/replay/provider/permission/End/security route tests: **81 passed**.
- Isolated corrected Phase B full suite: **513 passed**.
- Shared source full suite (preserving existing Phase C work): **545 passed**.
- TypeScript: **PASS** for candidate and shared source in clean source-inventory workspaces using unchanged compiler options. The broad dirty-root/generated-artifact TypeScript run exhausted Node's heap (exit 134); a later generated candidate recheck was stopped to avoid repeating that resource failure. These broad runs are not reported as passed. Complete manifest-scoped source checks passed; project tsconfig was not relaxed or edited.
- OpenNext: **PASS**. Initial sandbox EPERM and an external node_modules symlink/Turbopack limitation were resolved by permitted local execution and physically isolated dependencies; final build exit 0. No application code/config change was needed. Existing dependency bundle warnings remain in the log.
- Main Worker dry-run: **PASS**, no upload.
- Corrected control Worker dry-run: **PASS**, no upload.

## 21–22. Cleanup, production safety and remaining blocker

The original production synthetic class remains ENDED/canceled from the preceding verification. This task's production reproduction targeted only that existing context, never the retired test student. It failed before DO/provider dispatch, so it created no room, attendance, booking or participant change. The only possible production data side effects are the protocol's normal nonce insertion/expiry housekeeping. No account, membership, booking, plan, placement or Academy progress write was attempted. No migrations or production configuration changes occurred.

Production schema 0037 and FK zero were freshly verified immediately before this task in the preceding cleanup. **A new final schema/FK/record comparison was not completed:** automatic approval review rejected a broad production D1 export as beyond the diagnosis's authorized sensitive-data-copy scope. The export was not executed or bypassed. A narrower read-only aggregate/version/binding check was attempted instead, but Cloudflare returned **401**, before any database aggregates were obtained. Do not claim a fresh all-row or aggregate preservation result from this task. Previous all-row preservation evidence remains recorded in the earlier runtime report. Restore Wrangler access before future production preflight/recheck; do not change account/database configuration.

Remaining steps require separate authorization:

1. Restore Wrangler access and recheck the active main/control IDs, bindings, schema 0037, FK integrity and recovery readiness read-only.
2. Authorize only upload/activation of the frozen corrected **control Worker** version, inheriting the current production secrets/unrelated bindings and preserving DO namespace/migration tag. No main rebuild/deployment, Phase C code, migration, key or webhook changes.
3. Repeat production signed publish and interrupted cached-token acceptance against a separately scoped synthetic context, with complete redacted response capture and cleanup. Do not claim the local development-provider result certifies the still-unfixed production runtime.
4. Only after that gate passes, prepare/reverify the Phase C frozen release with this same control correction carried forward. A stale Phase C control artifact would reintroduce the defect.

## Explicit answers

A. Is the /internal/publish 500 root cause known? **YES** — consumed Request forwarding, compounded by an unawaited rejection escaping catch; exact workerd reproduction proves the failing boundary.

B. Is the defect fixed? **YES locally in source and the frozen corrected candidate. NO in production; not deployed.**

C. Did real provider-backed /internal/publish pass after the fix? **YES in the corrected local runtime against real DEVELOPMENT LiveKit, 200 JSON. NO post-fix production run yet.**

D. Is the Phase B production baseline fully accepted again? **NO** — production still carries the defect; controlled correction deployment/recheck and refreshed Wrangler preflight are pending.

E. Is it safe to resume Phase C Revision 3 deployment? **NO.** Complete the control-only correction and production acceptance first, then carry the fix into a newly verified Phase C artifact.
