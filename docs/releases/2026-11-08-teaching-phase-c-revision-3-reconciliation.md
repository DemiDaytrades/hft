# Phase C Revision 3 — outdated-candidate stop and corrected local freeze

2026-11-08, America/Chicago. **STOPPED BEFORE DEPLOYMENT AND BEFORE THE QA INVITATION.** The original frozen Revision 3 lacks later certified Phase B fixes. The operator explicitly required reconciliation and a new freeze first in this case. This report records that local preparation; it does not certify Phase C in production.

## Gate result

All **520 original Revision 3 file hashes still match** its manifest, fingerprint `a68e794c70895f31fc02aaf657d8e9fab0c38444451c2edfa4a7ac92491ae659`. The issue is an outdated freeze, not unexplained working-tree drift.

That candidate still forwards the consumed `/internal/publish` request without reconstructing its body or awaiting the DO call. It also predates the certified Phase B request-cost/polling/Scheduler changes and has no explicit 3,000 ms caps in its Wrangler source configurations. Deploying it would regress the accepted baseline. Three imported regressions failed against the original source: consumed-body forwarding, safe async forwarding failure, and the missing polling policy.

The original candidate/manifest were preserved unchanged. A separate corrected candidate was prepared from exactly its manifested sources, with only the required Phase B ports and cap configuration. Unrelated working-tree changes were not used.

## Corrected frozen candidate

- Manifest: [reconciled Revision 3 inventory](2026-11-08-teaching-phase-c-candidate-revision-3-reconciled.json).
- Directory: `/private/tmp/hft-phase-c-r3-reconciled`.
- Identity: candidate revision **3**, reconciliation revision **1**.
- Source fingerprint: **`8a911d8f97bcd48d2ab0cb5d7ac4299fb12421f497576d11db416548e0f0292a`**.
- **527 inventoried source files**: 510 unchanged original files, 10 modified original files, 7 added certified Phase B helper/regression files.
- Frozen outputs: main/control bundles and maps, **92 static assets**, individual artifact/asset hashes, and a hashed source/assets archive.
- Private artifacts/evidence: `.wrangler/phase-c-release/2026-11-08/phase-c-r3-reconciled/`.

The old Revision 3 artifact and historical rollback pins must not be used for a future rollout. A new authorization should identify the reconciled manifest above. Its production-ready flag remains false at this explicit stop; no replacement candidate was silently activated under the old authorization.

## Exact source changes

| Modified original path | Change |
|---|---|
| `workers/classroom/src/index.ts` | Reconstruct `new Request(request,{body})` using exact authenticated bytes and `return await` the DO forwarding call; preserve all Phase C teaching snapshot/command/closure hooks |
| `lib/classroom/realtime.test.ts` | Import certified consumed-body, safe async failure, exact-byte signature, replay and invalid-session regressions |
| `lib/classroom/service.ts` | Certified Phase B selective account/session/room/presence projections, bounded roster eligibility and fresh authority after provider awaits; byte-identical to certified optimized Phase B |
| `lib/dal.ts` | Certified request-scoped account reuse for server rendering and fresh per-invocation API account checks; byte-identical to certified Phase B |
| `lib/auth-safety.test.ts` | Matching certified account/lifecycle/password safety regressions |
| `components/classroom/presentation.ts` | Certified realtime-aware polling policy with safety refresh/fallback |
| `components/classroom/Classroom.tsx` | Merge certified polling suppression/in-flight guard and independent heartbeats; retain original Phase C TeachingTools, YouTube/mobile integration, `readClassroomResponse`, `guardMediaConnect` and guarded chat/command/refresh handling |
| `components/teaching/Scheduler.tsx` | Avoid unused initial SSR date/ICU work, as already verified in Phase B |
| `wrangler.jsonc` | Add explicit main Worker `limits.cpu_ms = 3000` |
| `workers/classroom/wrangler.jsonc` | Add explicit control Worker `limits.cpu_ms = 3000`; no DO migration changes |

Added, copied from the certified Phase B inventory:

- `lib/access-context.ts`
- `lib/access-context.test.ts`
- `lib/classroom/testing/request-cost.ts`
- `lib/classroom/cost.test.ts`
- `lib/classroom/polling.test.ts`
- `lib/teaching/cpu.test.tsx`
- `scripts/classroom-request-cost.cjs`

No Phase C teaching service/component, activity contract, private/public projection, follow-up rule, migration, content or data contract was redesigned. No Phase D or Lesson 2 work occurred. The main classroom authority/admission/reconciliation source, LiveKit adapter, terminal revocation, control authentication, media implementation, DAL and access-context source match certified Phase B byte-for-byte. Phase C-specific wrappers and teaching hooks remain in their original approved files.

## Local verification

| Check | Result |
|---|---|
| Original freeze integrity | **520/520 match** |
| Certified Phase B source integrity | **496/496 match** before port |
| Imported regressions against old candidate | **3 failures**, establishing the missing fixes |
| Focused publish/polling/cost/access/Scheduler regressions after port | **16 passed** |
| Full corrected-candidate suite | **554 passed, 0 failed** |
| TypeScript | **PASS**, standalone no-emit and Next build checks |
| OpenNext production-equivalent build | **PASS** |
| Main Worker dry-run | **PASS**, no upload/activation |
| Control Worker dry-run | **PASS**, no upload/activation |
| Independent code review | No actionable correctness/security omissions; safe to freeze locally, not production acceptance |
| Private production key/secret value scan | **0 matches in 625 source/bundle/map/asset files**; values not printed |

The first isolated build rejected an external `node_modules` symlink. A physical local dependency copy resolved this without source changes. Build warnings about the existing custom cache-control configuration and duplicate members in generated dependency code remain; the build and dry-runs exited zero. No unrelated dependency fixes were made.

A full Phase B production acceptance was **not repeated**. Local tests demonstrate inclusion of its fixes, not a new production acceptance claim for the Phase C overlay or its runtime CPU cost.

## Read-only production preflight

| Check | Observed result |
|---|---|
| Current main Worker / next rollout rollback target | `61d7f304-6c8d-433f-97e6-40efd13d0cbf` |
| Current control Worker / next rollout rollback target | `00a54732-aec8-4508-84d1-eba0292993ce` |
| Effective CPU caps | Both **3,000 ms** |
| Main control service binding | `CLASSROOM_HUB → hft-classroom-control` |
| Main control URL | `wss://classroom.highfrequency.vip` |
| Required LiveKit secret binding names | Present on both Workers; values not printed or changed |
| Production provider authentication | **PASS**, read-only list; **zero rooms** |
| Webhook evidence | Recent genuine `room_finished` from the certified final Phase B exercise, received `2026-11-09T00:15:35.112Z` / November 8 at 6:15:35 PM Chicago time. No new provider classroom was started merely to repeat this evidence |
| D1 state | **37 migrations**, last `0037_classroom_teaching.sql`; **zero FK violations** |
| Migration activity | **NONE**; 0037 not replayed |
| QA mailbox collision check | **0 existing accounts** for `highfrequency17@icloud.com` |
| Production mutation / invitation | **NONE** |

The current immutable Worker versions are the same versions accepted with the current production LiveKit configuration. No key rotation, webhook/dashboard change, account/database configuration change or secret operation was attempted. A future deployment must inherit unrelated settings, D1/service/DO bindings and **current production secrets from these explicitly pinned active versions**, never the newest stored/unreleased Worker. Preserve both 3,000 ms limits and existing DO migration tag; submit no D1 migrations. Capture a fresh recovery point and recheck the pins immediately before any separately authorized activation.

## Required 503 monitoring warning

The certified Phase B exercise included one recovered native post-revocation application HTTP 503, at `2026-11-09T00:10:21.303Z`, CPU 26 ms, no Worker exception or CPU-limit failure. Its exact internal cause remains unproven; a cleanup barrier is consistent with the evidence. This warning remains documented in [the final Phase B report](2026-11-08-phase-b-final-eleven-acceptance-report.md) and the corrected manifest.

Future Phase C production smoke must capture actual CPU/outcomes/status, count every HTTP 5xx and exception, and monitor recurrence without hiding it as a resource-limit issue or blindly replaying writes. Source inclusion and local build success do not establish Phase C production runtime health.

## Requested intermediate release results

| Item | Result at this stop |
|---|---|
| 1. Revision 3 manifest | Original exact but outdated; corrected 527-file freeze recorded separately |
| 2. Phase B fix inclusion | Original **FAIL**; corrected source/local checks **PASS** |
| 3. Pre-deploy Worker versions | Main `61d7f304-6c8d-433f-97e6-40efd13d0cbf`; control `00a54732-aec8-4508-84d1-eba0292993ce` |
| 4. Deployment ID | **NONE — no deployment attempted** |
| 5. New Worker versions | **NONE** |
| 6. Rollback versions | Same current certified/capped pair above, rechecked read-only |
| 7. Migration state | **0037**, not replayed; FK zero |
| 8. Main health | Existing baseline unchanged; recent certification retained. No new Phase C production health claim |
| 9. Phase A regression | Corrected local suite **PASS**; new production rollout checks **NOT RUN** |
| 10. Phase B regression | Certified baseline unchanged; corrected local security/regression suite **PASS**; eleven-person acceptance not unnecessarily repeated |
| 11. Instructor Teaching Panel | Approved source preserved, local tests **PASS**; corrected production smoke **NOT RUN** |
| 12. YouTube | Approved source preserved, local tests **PASS**; corrected production smoke **NOT RUN** |
| 13. Polls | Local tests **PASS**; production smoke **NOT RUN** |
| 14. Pop quizzes | Local tests **PASS**; production smoke **NOT RUN** |
| 15. Written responses / reviewed wording | Local tests **PASS**; production smoke **NOT RUN** |
| 16. After-class handoff / approved follow-up | Local tests **PASS**; production smoke/student acceptance **NOT RUN** |
| 17. Mobile Stage / Chat / Activity | Original implementation preserved, local tests **PASS**; corrected production browser smoke **NOT RUN** |
| 18. Security/privacy | Local suite **PASS**, critical Phase B source identical; no new production Phase C acceptance claim |
| 19. CPU/runtime telemetry | Existing caps rechecked; no new Phase C runtime exists to measure; prior 503 warning retained |
| 20. Webhook | Current provider auth healthy and recent genuine baseline receipt retained; no reconfiguration |
| 21. QA invitation | **NOT SENT**; no account created |
| 22. Real students | **Untouched in this run**: only read-only production checks; no emails/messages or Stripe activity |
| 23. Demi's next action | Authorize the exact corrected manifest if desired. There is no new inbox setup action yet |

## Explicit answers and next gate

- **A. Did Phase C Revision 3 deploy successfully? NO — stopped before deployment because the original freeze was outdated.**
- **B. Is the certified Phase B baseline still healthy? YES — pinned versions/caps remain unchanged, provider read-only authentication is healthy, schema/FK checks pass, and its certification/warnings remain valid.**
- **C. Are Phase C teaching tools healthy in production? NOT VERIFIED — corrected Phase C was not deployed.**
- **D. Was the QA invitation sent to highfrequency17@icloud.com? NO.**
- **E. What exactly must Demi do next? Review/authorize `docs/releases/2026-11-08-teaching-phase-c-candidate-revision-3-reconciled.json` for a controlled deployment. No iCloud account-setup step is available until an invitation is actually sent.**

After any future authorized deployment and successful initial production smoke, use only the existing normal Complimentary Student invitation, email-only, to the approved mailbox, then **STOP immediately after successful send**. Demi must then open the genuine HFT invitation in iCloud, follow its account-setup link, privately choose the password and sign in normally, and confirm **“QA student signed in.”** Do not edit authentication tables, impersonate the student, create a Stripe subscription or continue student acceptance before that confirmation. The latest user sequence overrides the historical preparation plan's invitation-before-deployment order.

**Stopped here. No Phase C deployment, QA invitation, Phase D or Lesson 2.**
