# Phase B paid Workers capacity and production acceptance — 2026-11-08

**Decision: capacity configuration PASS; complete interactive certification INCOMPLETE. Do not resume Phase C deployment yet.** No Phase C application code was deployed. Migration 0037 was not replayed.

## Paid plan and pinned release

The authenticated Cloudflare Workers plans dashboard showed Workers Paid as the current active plan and purchase complete. The OAuth billing API lacked billing scope (403); authenticated Worker settings and the native billing dashboard supplied the verification instead. Paid HTTP capacity supports the explicit 3,000 ms limit, and both active Workers now report `limits.cpu_ms = 3000`.

Only the previously frozen optimized Phase B candidate was used: `docs/releases/2026-11-08-phase-b-cpu-candidate.json`, source fingerprint `df954a6e6d64f45cb6eaff60a1a9c373f51d5c0963670cf04072f37bbe534957`. Both uploaded module sets matched the frozen artifacts; assets, unrelated configuration, bindings and current production secrets were preserved and checked before activation. No source feature changes were made in this run.

| Worker | Active capped optimized Phase B version | Deployment |
|---|---|---|
| hft-landing | `61d7f304-6c8d-433f-97e6-40efd13d0cbf` | `15a82b1e-f242-4461-87de-efad4fad7afc` |
| hft-classroom-control | `00a54732-aec8-4508-84d1-eba0292993ce` | `ee5eba39-96ec-4ad2-b4af-1057f644f4a1` |

Final read-only settings checks confirmed those exact versions and both caps. `CLASSROOM_HUB` remains `hft-classroom-control`; `CLASSROOM_CONTROL_URL` remains `wss://classroom.highfrequency.vip`. The control Durable Object migration tag remains `v1`; no D1 or DO migrations were run. Teaching delivery remains disabled.

## Actual production CPU

Wrangler Tail supplied actual invocation `cpuTime` and `wallTime`, filtered to QA-tagged requests, the exact synthetic classroom and control publication metadata. Raw headers, cookies, tokens and request bodies were discarded. These are CPU milliseconds, not elapsed-time estimates. Samples are not a billing-wide census or a long-duration load guarantee.

| Sample group | Samples | CPU min | CPU median* | CPU max | Max wall time |
|---|---:|---:|---:|---:|---:|
| Main Worker | 1,530 | 7 | 16 | 919 | 5,669 |
| Control Worker | 266 | 0 | 2 | 19 | 5,308 |
| Authenticated `/admin/teaching` repeats | 4 | 23 | 187 | 403 | 521 |
| Tagged classroom join requests | 37 | 11 | 27 | 919 | 3,782 |
| Tagged screen-start requests, including expected denials | 7 | 10 | 30 | 39 | 5,386 |

\*Sorted upper-middle sample for even-sized groups. An additional native dashboard teaching invocation measured 298 ms CPU / 440 ms wall. Some screen-start samples are expected 403/409 denials, so this group is not seven successful publisher admissions. Successful repeated synthetic publisher admissions and the three native captures are separately recorded in the acceptance artifacts.

No sampled HTTP 5xx, exception or CPU-limit outcome occurred. Main Worker maximum used 30.6% of its cap. Control `canceled` outcomes arose during WebSocket/client closure and early response cancellation; there were no control exceptions. One initial tail sample lacks a worker label and is excluded from per-worker counts. D1/service-binding operation counts were not captured and are not inferred from local timings.

## Interactive and security evidence

Production fixture: `qa-paid-b-0cdd886356-class`, ten newly created synthetic `example.invalid` students, actual signed-in instructor. Client mix was three native Chrome sessions (instructor/A/B) plus eight authorized LiveKit RTC/control clients (C–J), using normal HFT authentication and admission. This was not eleven separate native browsers or physical devices.

| Gate | Result and limit |
|---|---|
| All eleven admitted together | PASS: provider count 11; eight RTC and protected control connections; native instructor/A/B |
| Instructor microphone/camera | PASS: native tracks and decoded video received by all eight RTC audience clients |
| Persistent chat and raise hands | PASS: eight synthetic client interactions plus native A/B chat and hand actions; instructor queue observed |
| Presenter approvals / permission controls | PASS for native A/B mic, camera and screen grants; C screen grant |
| Three authorized **native** simultaneous screen shares | PASS: three Chrome tab pickers shared only labeled local synthetic chart tabs; provider source-3 tracks belonged to instructor/A/B |
| Three screens simultaneously visible | PASS: all three chart images visibly rendered side by side in instructor Chrome |
| Focus/layout | PARTIAL: side-by-side and focus Student A passed; focus state propagated to eight RTC clients. Student B and return-to-instructor focus exercise were not completed |
| Fourth screen | PASS: instructor-authorized C denied with 409 while all three native shares occupied slots |
| Permission revocation / demotion | PASS: A screen revocation removed its track; B return-to-audience removed its share. Separate A mic/camera revoke actions were not completed |
| Student camera hardware | LIMITATION: A's real camera activation returned “Requested device not found” on this Mac. Camera permission grant was verified; successful A camera capture is not claimed |
| Normal pre-END reconnect | PASS: D rejoined with a fresh lease and no duplicated screen slot |
| Participant removal | PASS: J disconnected; fresh admission 403; actual previously issued unexpired provider token rejected, not merely timed out |
| Repeated publisher admission CPU probe | PASS: three provider-backed synthetic screen-start/publish/stop cycles. These are not counted as native screen captures |
| Native End Class | PASS: normal instructor UI and confirmation committed ENDED |
| Actual unexpired publisher-token replay after END | PASS: HFT-issued token with prior `screen_share` publication permission and expiry `2026-11-08T23:49:13Z` was still unexpired at the attack; real provider connection rejected explicitly, not by a timeout |
| Fresh admission / post-END activity | PASS for the remaining C probe: join, chat, raise-hand, screen-start all 409; all terminal participant grants/screens/connections cleared. Post-END requests from all ten students were not independently repeated |
| Provider cleanup / attendance closure | PASS: provider rooms zero; cleanup queue empty; all 38 historical attendance rows closed, 11 distinct users; no open attendance |
| Production webhooks | PASS: genuine room_started/room_finished and participant/track delivery persisted; invalid/missing signatures 401. Counts: joined 56, left 56, tracks published 9/unpublished 9, room started 1/finished 1 |
| Authentication boundaries | PASS: signed-in instructor/student flows; anonymous protected pages redirect; APIs 401; unauthorized control 401; invalid ticket 401; foreign-origin WebSocket 403 |
| **Full eleven-person interactive certification** | **INCOMPLETE. Do not infer PASS from connection count or the completed portions above** |

## Interruptions and limits of certification

The QA harness first needed earlier heartbeat startup during sequential client initialization. A later eight-client heartbeat attempt timed out before corresponding edge requests appeared; sampled production requests in that interval were healthy. The Mac showed substantial swap pressure. The private harness was bounded to 30 decoded frames per subscribed track, with subscriptions left active; native Chrome continued rendering. Another attempt failed with network `fetch failed` errors; its exact network cause was not established. These interruptions were preserved, not silently discarded or classified as a proven application CPU failure.

The resumed incomplete portion passed fourth-screen denial, reconnect, publisher cycles and participant removal. Its harness then incorrectly classified an expected heartbeat 403 from the just-removed J as fatal. A separate one-student probe completed End Class and actual unexpired-token replay. Consequently End Class was not exercised with all eleven clients still connected, and the entire requested interactive matrix was not completed in one certified run. No product fixes or security exceptions were introduced to bypass these issues.

**Remaining gate:** use a reliable bounded client setup (prefer multiple machines for the native sessions), complete the missing focus and mic/camera revocation actions, retain the full authorized group through the terminal exercise, repeat terminal denials across the group, and produce one complete acceptance matrix. Diagnose any renewed client transport interruption rather than claiming capacity certification from a partial run. Existing three-native-share and real-token rejection evidence remains valid for the portions tested.

## Cleanup, data and recovery

The synthetic room is ENDED, with zero connected participants, active screen slots, enabled grants, cleanup operations or provider rooms. All synthetic attendance is closed. The exact QA booking is `CANCELED_BY_INSTRUCTOR`, all ten new QA users are banned and their complimentary access expired, and their authentication sessions are revoked. Audit/attendance/chat history is retained. No outbox rows were created for this fixture. QA browser windows and chart tab were closed; RTC processes, local helper and telemetry tails stopped; disposable credential files removed.

Cleanup initially attempted an unsupported booking status and D1 rejected that statement with 400/7500. Inspection of migration 0033 identified the valid enum; cleanup then used `CANCELED_BY_INSTRUCTOR`. No migration or schema adjustment was made. Separately, an expired OAuth token caused a read-only D1 401; normal Wrangler refresh restored access. Neither error is represented as a production application 5xx.

Final schema state: **37 migrations, last `0037_classroom_teaching.sql`, zero foreign-key violations**. Migration 0037 was not replayed. No real student questionnaire, plan, placement, progress, membership or booking was modified. Original admin/test/student accounts were preserved; the instructor's ordinary authentication/QA attendance activity is expected. No email/SMS, invitations or Stripe transactions occurred. There was no before/after full-table data checksum, so preservation claims are based on scoped operations and final checks, not an invented comprehensive checksum.

Pre-mutation D1 Time Travel recovery bookmark is privately recorded in `baseline.json` within the evidence directory. Rollback Worker versions remain:

- Main: `abf18574-031e-4ef5-992a-f30f6a316b4f`.
- Control: `00da709f-7dbb-43fe-ad2c-1bd260eeba8e`.

They were not activated: no production application regression or CPU failure was observed. The authorized capped optimized Phase B pair remains active. The previous versions have no explicit 3,000 ms cap and would use paid defaults if restored; subscription state is independent of version rollback. This run did not change secrets. The current production key remains privately stored and was not printed.

Evidence: `.wrangler/phase-c-release/2026-11-08/paid-phase-b-acceptance/` (private/local), including preactivation identity checks, activation result, final-capacity-settings, runtime-tail-samples, cpu-summary, preserved interrupted attempts, interactive-through-removal, final interactive-capacity-result, terminal-database-check, synthetic-cleanup and final HTTP health.

## Explicit decision

- Workers Paid and both effective 3,000 ms caps verified: **YES**.
- Three simultaneous authorized native shares verified: **YES**.
- Real unexpired post-END publisher-token rejection verified: **YES**.
- Complete instructor + ten-student interactive acceptance certified: **NO**.
- Safe to resume frozen Phase C Revision 3 controlled redeployment based on this run: **NO — finish the remaining acceptance gate first**.
- Phase C deployed in this run: **NO**.
