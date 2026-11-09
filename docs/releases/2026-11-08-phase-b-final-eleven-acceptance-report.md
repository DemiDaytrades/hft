# Phase B final eleven-person production acceptance

**Result: interactive acceptance PASS, representative End Class PASS, Phase B controlled-pilot baseline accepted. Safe to resume the frozen Phase C Revision 3 release preflight; Phase C was not deployed.**

The exercise ran on November 8 Chicago time, `2026-11-09T00:00:54.219Z` through `00:15:04.067Z` (approximately 14 minutes). One recovered application HTTP 503 and a camera hardware limitation are explicitly recorded below. This is not a claim of a zero-5xx run or eleven physical/native browser devices.

## Scope and unchanged production baseline

No application code, assets, CPU caps, bindings, secrets, routes, Worker versions or migrations changed. Both final settings reads matched:

| Worker | Version | Effective CPU cap |
|---|---|---:|
| Main `hft-landing` | `61d7f304-6c8d-433f-97e6-40efd13d0cbf` | 3,000 ms |
| Control `hft-classroom-control` | `00a54732-aec8-4508-84d1-eba0292993ce` | 3,000 ms |

`CLASSROOM_HUB` remains `hft-classroom-control`; `CLASSROOM_CONTROL_URL` remains `wss://classroom.highfrequency.vip`. Migration state remains 37 / `0037_classroom_teaching.sql`, with zero foreign-key violations. Migration 0037 was **not replayed**. No Phase C code was deployed.

Prior valid independent evidence from `2026-11-08-phase-b-paid-production-acceptance-report.md` was preserved: actual instructor camera delivery, three native captures, fourth-slot denial, and real unexpired-token rejection. This run repeated the three captures as a full-group regression, and repeated the token attack at representative End Class. It did not repeat paid-plan purchase/configuration, builds, deployments or unrelated application tests.

## 1. Harness root causes and correction

Confirmed failure mechanisms in the previous private harness:

- Heartbeats initially started too late during sequential client admission, risking lease expiry for earlier clients.
- An in-flight heartbeat could return the legitimate 403 after deliberate participant removal. The harness treated it as global failure and disconnected every other client.
- Interactive and heartbeat commands could overlap for the same actor. Older asynchronous snapshots could replace newer state.
- Unconditional repeated subscription operations and continuous frame copying added unnecessary local work. The previous Mac had substantial swap pressure.

The earlier generic `fetch failed` / timeout records did **not** preserve enough causal detail to establish their exact transport root cause. This report does not retrospectively label them a proven Cloudflare or LiveKit defect.

Changes were private **test-harness only**: per-actor command serialization, monotonic snapshot revisions, heartbeat startup before admission initialization, staggered heartbeat schedules, explicit removal state, identity-preserving reconnects, bounded teardown, readiness checks, a bounded HTTP pool, and safe transport cause-code diagnostics. A network retry preserves the same idempotency key and body, is limited to one retry, and does not retry HTTP 5xx. Only five decoded video frames per subscribed track are sampled; subscriptions remain active, while native Chrome renders continuously. No production security or media logic was changed.

Two local regression tests first failed, then passed: expected removal/terminal heartbeat denials do not become global failure, and per-actor interactive/heartbeat operations do not overlap. Harness syntax and policy wiring checks passed. A read-only 24-request HTTPS preflight passed. During the full live run: **zero transport errors/retries, zero harness failures**, and two bounded 409 concurrency conflicts recovered through the existing idempotent refresh/retry path. Peak local harness RSS was 363 MB.

One native student needed normal reconnect after foregrounding its chart tab during preparation; it was restored before the three-screen regression. Classroom tabs were then kept foregrounded in their respective windows after capture selection. The precise cause of its displayed “Connection replaced” was not independently proven; background lease loss is a plausible explanation, not a definitive diagnosis. No harness clients vanished during the terminal exercise.

## 2–14. Interactive exercise

Exact class: `qa-paid-b-final-71fa6b1f76-class` — **PRODUCTION QA — FINAL ELEVEN INTERACTIVE ACCEPTANCE**.

Identities: the same ten previously disabled synthetic `qa-paid-b-0cdd886356-s01` through `s10` accounts were temporarily reactivated; no additional students were created. They used normal HFT password login and HFT-issued provider/control admission. Instructor used the existing authenticated admin session.

Client mix: **three native Chrome sessions** (instructor, Incognito Student A, Guest Student B), plus **eight real LiveKit RTC/protected-control clients** (C–J). The RTC clients exercised authenticated commands, subscriptions, chat, hands and reconnect; these were not socket-count placeholders.

| Requirement | Production result |
|---|---|
| Simultaneous participants / roster | **PASS:** eleven provider identities, eight RTC/control clients plus three natives; no duplicate identities |
| Attendance | **PASS:** initial 11 open rows / 11 distinct users, no duplicate open attendance. Reconnect retained uniqueness. Thirteen historical rows total after normal lease/reconnect transitions; all closed at END |
| Instructor and student chat | **PASS:** 26 persisted messages, correct author identities: instructor 2, native A 1, C–I 3 each, J 2. Messages appeared in instructor/native views and continued during three native shares and after deliberate removal |
| Room boundary | **PASS:** A/B snapshots identified this exact session and their own identities; all chat authors matched the controlled roster. Requests for the previously canceled QA classroom returned 404, without its chat. No unauthorized real classroom was opened |
| Hands / queue | **PASS:** C–J raised once in that order, D lowered its hand, queue count updated from 8 to 7; instructor permission/removal actions cleared corresponding hands. No duplicate hand actions; all hands cleared at END |
| A/B presenter approval | **PASS:** independent mic, camera and screen grants observed enabled; native controls became available. Other students remained audience until explicitly approved. Instructor retained authority |
| Media permissions | **PASS:** instructor mic and A mic published; A/B mic/camera permissions enabled. Explicit A microphone and camera revocation produced disabled native controls and authoritative false grants |
| Camera hardware limit | Current instructor camera attempt returned **Requested device not found**. Prior independent production instructor-camera delivery evidence is retained, as authorized. This run does not claim a new successful physical-camera capture or multiple physical cameras |
| Three native screens | **PASS:** instructor/A/B each used Chrome's native picker for their own labeled local synthetic chart tab; three simultaneous provider screen tracks, three active slots, all three chart images visibly rendered side by side while all 11 were present |
| Unauthorized/excess share | Current unapproved audience screen request: **403**. Prior authorized fourth-slot **409** evidence retained; not unnecessarily repeated |
| Presentation controls | **PASS:** side-by-side, Student B focus and dedicated Focus Instructor control; each resulting stage state propagated to all eight RTC/control clients. Prior Student A focus evidence also retained |
| Demotion / revocation | **PASS:** native B returned to audience; all its media grants and share slot cleared, its provider sharing stopped, its native controls disabled. It reconnected as audience. A mic/camera revocation enforced; A reconnected with those grants still disabled |
| Removal | **PASS:** J deliberately removed, disconnected, fresh admission 403, actual unexpired old token rejected by provider. Other clients stayed healthy; post-removal chat succeeded |
| Normal reconnect | **PASS:** D reconnected with a new authoritative lease, no duplicate identity/open attendance/screen slot. A/B also used normal UI reconnect with current permissions |

## 15–19. Actual CPU and resource telemetry

Wrangler Tail supplied actual production `cpuTime`, wall time, outcome, status and version metadata. Raw headers, payloads, cookies and tokens were discarded. Main samples are for the exact synthetic classroom; control samples include its control connections and `/internal/publish` calls during the exercise/health checks.

| Worker | Samples | CPU median | CPU maximum | Maximum wall time | Exceptions | CPU-limit failures |
|---|---:|---:|---:|---:|---:|---:|
| Main | 1,249 | 15 ms | **652 ms** | 6,574 ms | **0** | **0** |
| Control | 201 | 2 ms | **31 ms** | 6,253 ms | **0** | **0** |

The main maximum was 21.7% of its 3,000 ms cap. No `exceededCpu` or resource-limit outcome occurred. Control `canceled` outcomes occurred during WebSocket/client closure; no control exceptions or HTTP 5xx occurred.

**HTTP 5xx: one main application 503**, at `2026-11-09T00:10:21.303Z`, on a native classroom POST during post-revocation admission. CPU **26 ms**, wall time **4,598 ms**, outcome `ok`, zero exceptions. The native UI displayed temporary unavailability; normal reconnect recovered, and the representative class was restored. No HTTP 5xx occurred in the synthetic RTC command log.

The frozen service explicitly returns 503 while provider cleanup remains pending; strict permission revocation requires fresh admission. The observed timing and recovery are consistent with that fail-closed guard, although a provider-origin 503 cannot be excluded because internal error details were not recorded. **Its precise internal cause remains unproven.** It was not a CPU-cap failure. This is recorded as a recovered operational warning, not hidden as a zero-5xx pass or treated as evidence requiring a new production deployment. If it recurs persistently, diagnose it before expanding the pilot; no abnormal retry storm occurred here.

## 20–25. Representative End Class and terminal security

Immediately before End Class, the provider confirmed **ten connected participants**: instructor + nine permitted students, after deliberately removing J. All seven remaining RTC/control students were connected, along with the three native sessions. D1 showed ten connected participants and ten open attendance rows, no duplicates. This is the representative remainder of the eleven-person exercise, not a one-surviving-client probe.

The instructor clicked visible **End class** and confirmed the normal browser dialog. The frozen implementation commits ENDED and attendance closure in its D1 batch before calling provider reconciliation. The instructor and both native students displayed **ENDED / LESSON ENDED**. All RTC clients disconnected. Final D1 state: ENDED, zero connected participants, zero enabled grants, zero screen slots and zero open attendance.

A fresh HFT-issued publisher token was held in RAM immediately before END, with **microphone, camera and screen_share** permission and expiry `2026-11-09T00:15:46Z`. After the `00:15:04Z` End Class commit, the real provider connection attempt was explicitly rejected while that token was still unexpired; it was **not** merely a timeout. Provider admission rejection prevented restoring any mic, camera or screen publication. Three separate successful provider connections followed by publish attempts are not claimed.

Fresh join/reconnect after END returned **409 for all ten students** (C–J through the retained harness credentials, A/B through normal additional login sessions). Chat, hand and screen-start probes returned 409. Removed J's fresh join had already returned 403 before END; terminal state thereafter returned 409. No grants or slots returned.

The provider room disappeared. Initial asynchronous teardown briefly left one delete operation pending; genuine `room_finished` delivery subsequently arrived and the queue settled to **zero**, with `cleanup_pending = 0`. Genuine production webhook receipts: room_started 1, room_finished 1, participant_joined 28, participant_left 24, track_published 5 and track_unpublished 5. Bulk room termination does not require a one-to-one participant-left receipt for each join. Missing/invalid webhook signatures remained 401; unauthorized control 401, invalid WebSocket ticket 401, foreign-origin WebSocket 403.

Prior independent unexpired-token rejection evidence remains valid; this run adds a fresh all-media-permission token rejection with the representative class intact through END.

## 26–28. Data safety, cleanup and remaining limits

**65 selected real-data table fingerprints matched before/after with no differences**, including all 13 original user records, original accounts, intake/questionnaire, financial-plan, learning-path, Academy/progress, booking, communication and Stripe-webhook records. QA users/bookings were explicitly excluded where applicable. This supports preservation of Carlos, Skip, Z, existing test/admin accounts, real bookings and real Academy progress. It is not a claim that every database table or ordinary session/telemetry row was globally frozen.

Final migration state: 0037, 37 migration records, zero FK violations. No migration, deployment, cap/configuration change, real invitation, email/SMS or Stripe transaction was performed. Classroom chat was synthetic QA traffic only.

Cleanup completed:

- Exact synthetic session ENDED; booking `CANCELED_BY_INSTRUCTOR`.
- Ten reused synthetic users banned and complimentary access expired; their normal auth sessions revoked, zero remaining QA auth sessions.
- All 13 attendance rows closed, 11 distinct historical users, zero duplicate open attendance.
- Zero grants, screens, connected participants, cleanup operations or provider rooms.
- No QA teaching outbox entries. Audit/chat/attendance history retained intentionally.
- Native QA windows/chart closed; RTC harness, loopback helper and filtered tails stopped. Disposable QA credential file removed; production/development credential files untouched.

No blocking functional acceptance action remains. The recovered 503 and current camera hardware unavailability are operational limitations, not claims of unobserved success. Historical network-error root cause remains unknown because prior diagnostics were insufficient; the corrected final harness completed with no transport errors. The HTTP denial helper initially expected 403 for the closed old QA room; the application correctly returned 404, and the helper was corrected to accept either denial. No application change was involved.

No new Worker deployment IDs were created. Existing rollback versions remain documented in the preceding paid acceptance report; they were not activated. This certification authorizes no Phase C deployment by itself: resume only its existing frozen, controlled release procedure and remaining release-specific/manual gates.

Private evidence directory: `.wrangler/phase-c-release/2026-11-08/final-eleven-acceptance/`. It contains completed interactive phases, native terminal denials, exact before-END readiness, CPU samples/503 review, authoritative action/attendance/webhook audit, data fingerprints/comparison, final settings, cleanup, health checks and test-harness source hashes. No raw provider tokens or browser cookies were persisted.

## Explicit certification

| Question | Answer |
|---|---|
| A. Full instructor + ten synthetic-student interactive acceptance passed? | **YES**, using the exact mixed native/RTC client setup described above and retained independent camera/fourth-slot evidence |
| B. Classroom remained healthy under the 3,000 ms caps? | **YES for CPU/resource capacity**, with the single recovered application 503 explicitly disclosed |
| C. Representative multi-participant End Class passed? | **YES** — all ten remaining permitted participants connected immediately before END |
| D. Prior/new unexpired-token evidence confirms post-END security? | **YES** |
| E. Phase B production baseline fully accepted for the bounded controlled pilot? | **YES**, with the stated operational warnings; not a broader scale or zero-error guarantee |
| F. Safe to resume frozen Phase C Revision 3 controlled redeployment procedure? | **YES**, subject to that release's own frozen-candidate/preflight/manual gates; **Phase C was not deployed in this run** |
