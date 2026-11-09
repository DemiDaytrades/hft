# Phase B remaining LiveKit provider acceptance

Date: 2026-11-08. **Development only. Production readiness: NO.**

This resumes the existing Phase B implementation and previous497-test acceptance checkpoint. No application implementation, data contract, migration, production configuration, or deployed resource was changed. The work used the existing isolated QA application, synthetic local accounts, private test harnesses, actual Chrome profiles, and the user-confirmed LiveKit development project.

**A new provider-security failure blocks release:** after HFT commits ENDED and deletes its LiveKit room, a still-valid cached participant token can briefly reconnect to LiveKit. HFT correctly denies new admission; provider cleanup removes the recreated room. Successful cleanup does not make that cached-token acceptance safe.

## Required 32-item results

| # | Requirement | Result and evidence |
|---|---|---|
| 1 | Credentials/configuration | **PASS.** URL, key and secret present in main/control QA files; values match. Read-only development provider access passed. Values were not printed. Final scans found no provider key/secret in90 public assets or the three QA runtime logs. |
| 2 | Browser instructor camera playback | **PASS.** Normal Chrome published the FaceTime camera; actual instructor camera imagery rendered in the independent Incognito student's HFT stage at390px. |
| 3 | Browser instructor microphone playback | **PASS.** Actual Mac microphone published; student audio was unlocked through the deliberate UI action. Demi explicitly confirmed hearing the test phrase from the student session. Mic was subsequently stopped. |
| 4 | Browser screen playback | **PASS.** Actual Chrome-native synthetic chart captures displayed in receiving HFT browsers. This result includes visual browser inspection, not merely SDK-decoded frames. |
| 5 | Three simultaneous native shares | **PASS.** Instructor in normal Chrome, Student A in Incognito, Student B in Guest each used the native picker. At10:27:42.223UTC the provider independently showed11 clients and exactly one screen track for each of the three authorized identities. The HFT instructor UI rendered all three charts simultaneously. |
| 6 | Fourth-screen denial | **PASS at HFT admission.** Unapproved audience request returned403. After explicit instructor approval, synthetic Student3 connected but its fourth reservation returned409 `Screen slots full.` Its token lacked screen publication rights; HFT retained exactly three distinct reserved users. No fourth native picker/publication was issued. |
| 7 | Screen-slot reconciliation | **PASS for normal exercised flows.** Permission revocation stopped Student A's screen and reduced3slots to2. Native Stop sharing for B reduced the remaining slot to0. Permitted reconnect did not duplicate provider identities, screens or attendance. The runtime interruption also caused client media shutdown and lease cleanup. The existing malicious duplicate-track reconciliation window remains a limitation below. |
| 8 | Chart/text readability | **PASS for focused desktop synthetic charts; LIMITED on mobile.** Candles and price labels rendered in focused desktop mode; all three charts rendered side by side. At390px the focused chart displayed correctly, but dense price labels are small; physical-device readability and chart motion/frame-rate were not fully certified. Static synthetic charts were used. Capture requests target1920×1080/10fps; no measured FPS claim. |
| 9 | Focus Demi | **PASS.** Instructor-focused real chart rendered in the receiving390px student view before presenter-focus changes. |
| 10 | Focus students | **PASS.** Instructor dropdown selected A then B with real screen streams. A's actual chart rendered in the instructor view; B's actual chart rendered in the390px student view. Protected snapshots for host/A/B carried the same authoritative stage state. |
| 11 | Side by side | **PASS.** Actual instructor UI displayed three separately labelled native chart streams simultaneously. Matching stage/layout revision reached both students. |
| 12 | Chat during media | **PASS.** Instructor native UI message was sent while three screens streamed. Synthetic students sent persistent messages and hand requests. Pinning and moderation succeeded through the actual protected application; the390px student view recovered messages and the pinned instructor item after reconnect. |
| 13 | Full11-person exercise | **PARTIAL / NOT CERTIFIED.** Eleven simultaneous real connections were independently observed:3 Chrome browser contexts and8 official Node RTC audience clients. The exercise went beyond connection count: audience chat/hand requests, instructor queue/approvals, independent sources, three native shares and layouts ran. However Wrangler exited before completing the entire continuous11-client matrix. Later security/reconnect/end checks completed after restart with fewer clients. This is not a clean11-person browser/device acceptance pass. |
| 14 | Raise hand | **PASS.** Native Student A/B requests and8 synthetic audience requests reached the existing hand queue. Instructor UI showed the queue while media streamed. |
| 15 | Presenter permissions | **PASS for exercised sources.** A/B were initially given screen only; mic/camera remained disabled. A later published a real microphone with camera/share disabled; subsequent camera-only grant revoked the microphone, and A published only camera. Provider source observations confirmed each transition. Devices were enabled deliberately in that student's browser. |
| 16 | Demotion | **PASS with interruption qualification.** A was returned to audience; camera stopped and all publishing controls became disabled. The local runtime exited during this phase; after recovery a fresh permitted join retained audience rights and did not restore revoked camera/mic/screen rights. |
| 17 | Removal/stale token | **PASS.** Repeated the interrupted test after restart: synthetic10 connected, removal returned200, provider disconnected it, original unexpired JWT replay was rejected, fresh HFT join returned403. Separately, removed native Student B's cached classroom/chat/controls disappeared and reconnect returned403. |
| 18 | Reconnect | **PASS for explicit recovery.** A and B used the visible Reconnect action after the runtime interruption. B started a fresh native share, stopped it, then reconnected as an approved audience/presenter without a duplicate screen or attendance interval. Automatic recovery after a failed replacement admission can still require this manual action. |
| 19 | Attendance | **PASS for recorded integrity.** Primary exercise recorded11 users and14 intervals; no duplicate open interval. End Class left zero open intervals. Real Cloud receipts and duplicate reconciliation did not add duplicate attendance. Attendance was not used as mastery/progression evidence. |
| 20 | End Class | **PARTIAL / SECURITY FAIL.** Actual instructor browser End Class committed ENDED, closed attendance, cleared connections/slots and removed the provider room. Fresh HFT joins were denied. A separate fresh-token terminal probe nevertheless reconnected to LiveKit with its cached token after deletion; see the blocking defect below. |
| 21 | Development webhook delivery | **PASS.** Real Cloud `room_started`, `participant_joined`, `participant_left`, `track_published`, `track_unpublished`, and `room_finished` events reached the existing HFT webhook route through a temporary HTTPS development tunnel. The primary exercise recorded68 Cloud receipts at its terminal checkpoint. |
| 22 | Webhook security | **PASS.** HTTPS proxy and HFT route independently rejected unsigned requests with401; invalid signature rejected. A genuine signed Cloud track-unpublished event was forwarded twice without retaining its JWT: original200/`duplicate:false`, replay200/`duplicate:true`, one durable receipt. Real participant/track reconciliation and terminal attendance cleanup were observed. No login/admin pages were exposed. |
| 23 | Desktop Chrome | **PASS for media/presentation/permissions tested.** Three independent Chrome contexts completed native screen capture. Browser console also recorded SDK data-channel closures during deliberate revocations, connection-refused errors during the local runtime outage, and repeated preload warnings; this was not a clean-console/continuous-capacity pass. |
| 24 |390px mobile layout | **PASS for receiving/navigation; readability qualification.** Actual camera, instructor screen and instructor-selected Student B screen rendered. Only the focused screen was shown. Stage/Chat/Participants switched, persistent/pinned chat recovered, and mobile screen publishing stayed disabled. Responsive Chrome emulation was used; no physical mobile Safari/Firefox claim. |
| 25 | Exact client count | **11 at peak:3 native Chrome +8 Node RTC.** All3 native publishers were simultaneously live. After the Wrangler interruption, the recovery/security exercise used fewer participants; never counted disconnected SDK clients as live. |
| 26 | Focused tests | **PASS:225 tests**, zero failures,32 selected files covering classroom/provider/admission/permissions/slots/reconnect/webhooks/attendance, Phase A teaching, lifecycle and Academy-related tests. |
| 27 | Full suite | **PASS:497 tests**, zero failures,11 suites. These tests do not currently catch the discovered real-provider terminal-token behavior. |
| 28 | TypeScript | **PASS**, exit0, final shared-source verification copy. |
| 29 | OpenNext | **PASS**, final local production-equivalent build, exit0. Existing dependency/build warnings remain; no deployment. |
| 30 | Worker dry-run | **PASS**, exit0, dedicated classroom Worker bundle only. No Worker was deployed. |
| 31 | Blockers/limitations | Terminal cached-token reconnect defect; interrupted full-capacity exercise; manual recovery after failed replacement admission; existing duplicate-track reconciliation window; mobile dense-chart/motion and broader device/browser acceptance. See below. |
| 32 | Next release step | Authorize a narrowly scoped **local terminal-provider-token revocation fix and regression**, then repeat that failing provider probe and the uninterrupted11-client matrix. Review the remaining count/recovery/device limitations before freezing a separate release candidate. Do not deploy this checkout. |

## Blocking defect: cached provider token after End Class

Observed in a separate disposable local session, `qa-end-replay-8cd197d40ae5`, with synthetic Student4:

1. HFT issued a fresh60-second audience admission; the actual RTC client connected.
2. Instructor End Class returned200 with state ENDED.
3. Original provider connection disconnected and a read-only provider lookup confirmed the room absent.
4. The original token was still unexpired.
5. A second real RTC client reused that token and **its provider connection succeeded**.
6. Fresh HFT admission still returned409. HFT never reopened its terminal state.
7. Provider lookup after the replay already showed the room absent again; reconciliation/cleanup removed it. Final explicit cleanup also confirmed no remaining probe room.

Thus the observed failure is **brief provider-level re-entry**, not reopening HFT or restoring student application data. Room deletion and eventual cleanup do not prove invalidation of every outstanding admission. This must be resolved before a controlled production release. No implementation fix was attempted in this acceptance-only task.

Private reproduction evidence: `/private/tmp/hft-livekit-rtc-qa/end-token-replay-result.json` and `end-token-replay.cjs`. The harness keeps tokens in memory and reports only booleans/statuses. Reproduction requires a fresh synthetic local fixture; do not replay its setup or use it against production.

The future fix should preserve ENDED-first semantics, denied fresh HFT admission, source restrictions and durable cleanup under provider failure. Require a real-provider regression with an unexpired cached token, including relevant refreshed-token behavior, rather than assuming DeleteRoom provides strict revocation. Likely review points are the existing classroom service, provider adapter/interface, cleanup operations and their tests; no migration is proposed without a reviewed design.

## Interrupted capacity run and other limits

At10:34:02UTC, Wrangler4.122.0 exited with an internal `ProxyController`/`ProxyWorker` cause: `Network connection lost.` The successful three-native-share/11-client observation preceded that exit. The unchanged local runtime was restarted; no dependency upgrade or application workaround was added. The interrupted removal attempt was explicitly discarded and repeated successfully.

This local tool failure does not establish a production Worker defect, but it prevents certification of one uninterrupted full-capacity exercise. Eight audience clients were SDK clients issuing real protected chat/hand commands, not independent student browser UIs or physical devices.

The earlier review finding remains: a failed media replacement request can suppress automatic recovery until the user clicks Reconnect. The earlier malicious duplicate-screen-track limitation also remains: HFT enforces three reservations and the browser publishes one native track per presenter, but provider duplicate-track violations are reconciled rather than proven impossible at every instant. Neither limitation was weakened or silently declared resolved.

## Cleanup and source integrity

- Primary classroom `qa-livekit-resume-5aee6e1bf3cc` and the terminal probe are both ENDED.
- Both have zero reserved screens, zero open attendance and zero pending cleanup jobs. Local foreign-key check returned zero violations.
- Provider rooms were deleted; probe finally-cleanup was independently checked. Synthetic fixture bookings were canceled locally to release their calendar reservations; historical classroom/evidence records were preserved.
- QA app/control runtime, chart server, webhook-only proxy, tunnel and SDK audience harness are stopped. No cameras/microphones/screens remain active for these ended sessions.
- Demi confirmed the temporary **HFT Phase B local QA** development webhook entry was disabled/removed. Other webhooks and API keys were left unchanged.
- All40 inventoried Phase B source hashes match the prior verified implementation. No application code changes occurred during this remaining-acceptance run.
- Public asset and runtime-log scans found zero configured provider key/secret values. Private QA credentials were never included in this report or a release artifact.
- No deployment, production migration/D1/DNS/Worker/LiveKit configuration change, real-student modification, real invitation/email/SMS, Stripe activity, Phase C or Lesson2 work occurred.

## Explicit release answers

**A. Is real LiveKit media working end to end? YES** for actual camera, audible microphone and native screen playback in the exercised Chrome clients. Terminal-token security remains failed.

**B. Are three simultaneous authorized native screen shares verified? YES.**

**C. Has Demi +10 students been verified as a complete interactive classroom, not just connections? NO / PARTIAL.** The mixed11-client exercise performed real interactions and three native shares, but the complete continuous matrix was interrupted and was not an11-browser/device test.

**D. Is LiveKit Cloud webhook delivery verified? YES**, including real signed deliveries, track/participant reconciliation and a durable duplicate probe.

**E. Is Phase B ready for a controlled production release? NO.** The terminal cached-token defect is a release blocker regardless of passing unit tests/builds.

Private machine-readable results and harnesses remain in `/private/tmp/hft-livekit-rtc-qa/`. Final regression logs use `/private/tmp/hft-livekit-resume-{focused,full,types,build,worker}.log`. Earlier reports are historical and should not override this result.


## 2026-11-08 terminal-security follow-up

The cached-token blocker and remaining synthetic capacity acceptance are superseded by [End Class security fix and final acceptance](classroom-end-class-security-acceptance.md). Earlier results above remain historical evidence. No production deployment occurred.
