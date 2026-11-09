> Current result: [final provider acceptance](classroom-livekit-provider-acceptance-final.md). Playback, three native shares and Cloud delivery passed; a cached-token End Class defect blocks production release. This earlier document is historical.

# Phase B LiveKit development acceptance — 2026-11-08

**PARTIAL ACCEPTANCE. NOT A PRODUCTION RELEASE CANDIDATE. No deployment or production mutation occurred.**

This continues the completed local Phase B implementation. It supersedes the credential-blocked status in the earlier local report, while preserving that report as historical evidence. All accounts and teaching data used here were synthetic/local. The LiveKit project was the user-confirmed development project. No real students, invitations, email/SMS, Stripe, Phase C, or Lesson 2 were used.

## Required results

| # | Area | Observed result |
|---|---|---|
| 1 | Existing implementation reused | Existing custom classroom, admission, control Worker, permissions, chat, attendance, stage and scheduling integration retained. No rebuild from scratch. |
| 2 | Development configuration | Main QA bindings valid. Worker QA file was incomplete; synchronized only its three LiveKit bindings from the main private file. Both files remain private; no credentials added to source. Development API authentication succeeded. |
| 3 | Files changed | Eight existing source/test files listed below, local private QA configuration/harness artifacts, source inventory hashes, and this report. No new migration. |
| 4 | Provider adapter | Real room create/delete and absent-participant strict revocation passed. Found canonical missing-room deletion 404; made teardown idempotent only for SDK `not_found` +404. Other errors still propagate. |
| 5 | Admission/token security | Actual synthetic admission token: 60 seconds, room scoped, participant scoped, no administration grant, audience publishing disabled. Fresh authorization is rechecked after minting. Relevant permission/account/roster/connection/end changes reject and revoke minted admission; unrelated room revisions no longer cause false rejection. |
| 6 | Real microphone | Chrome requested one-time MacBook microphone permission and displayed Mic ON. End-to-end audibility and approved-student microphone acceptance remain unverified. Do not infer those from the control state. |
| 7 | Real camera | Chrome FaceTime camera enabled. Provider independently confirmed an actual camera publication while 11 participants were connected. Audience subscriptions were observed; human visual/audio quality was not certified. |
| 8 | Real screen share | Native Chrome tab picker captured only a synthetic chart. Provider confirmed screen source 3. A separate real WebRTC receiver decoded nonuniform 1920×804 frames. Initial picker-timeout and remote-video autoplay defects were fixed. Final receiving-browser playback retest remains incomplete. |
| 9 | Three simultaneous screens | **NOT VERIFIED.** Largest independently confirmed native screen publication count: one. |
| 10 | Fourth-screen denial | Server reservation/permission tests pass. Real fourth publisher against three simultaneous native shares was not exercised. |
| 11 | Screen reconciliation | Tests cover three slots, bounded initial capture grace, no repeated-start renewal, presence expiry, seen-track disappearance, duplicate tracks, revocation and terminal cleanup. Real reservation timeout reproduced. Final picker grace is 180 seconds; it does not extend the 45-second presence lease. Complete multi-publisher real acceptance remains open. |
| 12 | Chart readability | Synthetic chart carried decoded 1920×804 frames. Receiving Chrome initially showed black video; console explicitly reported unmuting paused the element. Fixed preservation of LiveKit's video-only muted setting. Final visual readability/motion acceptance **not yet passed**. |
| 13 | Focus / side by side | Existing control acceptance and automated tests retained. Multi-screen real-media visual acceptance not performed. |
| 14 | Chat during media | Synthetic student message persisted and recovered into instructor/student views with real provider connections. Full instructor/student chat, pin/moderation and reconnect exercise under three-screen load remains open. |
| 15 | Raise hand → presenter | Real-connected student raised hand; instructor granted screen source; student showed screen enabled while microphone/camera remained disabled. Student native publication was not completed. |
| 16 | Demotion | Existing control/security tests pass. Independent real publishing/revocation harness was stopped without a completed result; no real-media demotion PASS is claimed. |
| 17 | Removal / reconnect | **PASS, real provider:** synthetic student 10 connected; instructor removal returned 200; provider disconnected it; old JWT replay rejected; new HFT admission returned 403. Earlier browser cached-access denial result remains preserved. |
| 18 | End Class | **PASS through actual local HTTP/provider:** end returned 200 and ENDED, zero connected participants, zero screen reservations; new join returned 409; attendance closed and cleanup queue drained. Provider room deletion independently checked. This run used the protected API; prior native End Class control acceptance is historical. |
| 19 | Webhooks | Signed SDK checksum/timestamp, invalid-signature, replay/deduplication and reconciliation tests pass. Actual LiveKit Cloud delivery into the loopback endpoint was **not configured/verified**. No production callback or public tunnel created. |
| 20 | Attendance | Actual local exercise recorded 11 users, 28 intervals, zero duplicate open intervals; after end, zero open intervals and zero pending cleanup jobs. This verifies HFT admission/presence cleanup, not Cloud webhook delivery. Attendance remains separate from mastery. |
| 21 | Exact participant count | Provider independently observed **11 simultaneous real connections**: one instructor Chrome publisher plus ten synthetic official Node RTC audience clients. This is not eleven independent browser/device clients. |
| 22 | Full 11-person acceptance | **PARTIAL:** basic connection capacity and instructor camera/audience subscription passed. Two student presenters, three native shares and the entire interaction/reconnect/quality matrix at that load remain unverified. |
| 23 | Desktop Chrome | Real admission, one-time device prompts, camera publication, native tab capture, student source restrictions and controls exercised. Final video/audio playback fixes have automated coverage but their final native-browser retest did not complete. Browser automation eventually stopped reliably activating page controls; no browser success inferred from clicks. |
| 24 | Mobile | Actual student connected with responsive width 390. Stage/chat/participants controls and disabled mobile screen-publishing policy present. Final watch/listen/readability acceptance remains open after playback fixes. |
| 25 | Safari / Firefox | Not tested. No parity claim. |
| 26 | Focused tests | **66 classroom tests passed**, zero failures, after final source changes. This includes adapter, admission/security, grants, slots, reconnect, webhooks, attendance and presentation tests. Full suite also includes Phase A, lifecycle and Academy security tests. |
| 27 | Full suite | **497 tests passed**, zero failures, 11 suites, after final source changes. |
| 28 | TypeScript | **PASS**, exit 0, clean shared-source verification copy with final changed files synchronized. |
| 29 | Build | **PASS**, final OpenNext build exit 0. Dedicated control Worker dry-run bundle also passed; no deployment. Existing build warnings retained. |
| 30 | Remaining limitations | Final playback retest; real independent source publishing/revocation matrix; three native publishers; fourth denial; focus/readability; real Cloud webhook delivery; full 11-person and mobile acceptance. Failed replacement admission can require explicit Reconnect. Provider track-count enforcement uses reconciliation, so duplicate malicious tracks can transiently exist before removal; hard zero-transient enforcement is not certified. |
| 31 | Plan / quota | No provider plan/quota rejection observed during confirmed operations. No paid plan purchased or provisioned. This exercise does not establish production limits, billing, or bandwidth readiness. |
| 32 | Exact next steps | Follow the remaining acceptance procedure below; keep production blocked. |

## Changes and defects

Changed existing files:

- `lib/classroom/livekit.ts`, `lib/classroom/provider.test.ts`: idempotent canonical absent-room teardown.
- `lib/classroom/service.ts`, `lib/classroom/service.test.ts`: actor-specific admission recheck with strict rejection cleanup; consistent media availability on heartbeat/idempotent replies; bounded 180-second initial capture grace.
- `components/classroom/Classroom.tsx`, `components/classroom/presentation.ts`, `lib/classroom/presentation.test.tsx`: suppress overlapping admission/reconnect commands before POST, invalidate queued stale recovery, explicit user audio-start control and regressions.
- `components/classroom/media.tsx`: retain SDK silent-video autoplay safeguard, attach/detach regression coverage, audio playback status notifications and explicit audio unlocking.

Remaining review finding: if an intentional replacement disconnect succeeds but its replacement admission fails, automatic recovery can be suppressed; the visible **Reconnect** control is required. This occurred during cleanup contention and was recovered manually. It is not an authorization bypass.

Browser inspection initially encountered an open LiveKit key-generation dialog that exposed development credentials in tool output. Values are not reproduced in this report. **Rotate that development key before further shared QA and update both private QA files; do not paste credentials into chat.** No production credential was used or changed.

## Remaining controlled development procedure

1. Rotate the development key as above, update the two private QA binding files and restart the isolated runtime. Keep production settings unchanged.
2. Create a fresh synthetic local GROUP session through existing scheduling/fixture tooling, assigned to the QA instructor and ten existing synthetic students. The exercised session `qa-livekit-471cdb8cbf23` is now terminally ENDED; do not attempt to reuse it.
3. Open `http://localhost:3006/admin/teaching` as the synthetic instructor and `http://localhost:3006/lessons` in independent synthetic student browser profiles/devices. Open the new confirmed session's classroom cards. Never use real student records.
4. Start class. Verify the final **Enable classroom audio** action unlocks subscribed audio without enabling a microphone or camera. Confirm actual listening with another device/headphones. Test one-time camera/microphone consent, independently allowed student sources, revocation, demotion and reconnect.
5. Instructor chooses Share screen → Start capture → native picker → synthetic chart tab only. Confirm the receiving desktop and 390px student show the chart after the muted-video fix; inspect labels and motion. Screen audio is deliberately disabled. Do not share any credentials, inboxes or administration tabs.
6. Approve student A and B separately. Each deliberately starts native capture in an independent browser/device context. Confirm three actual provider screen tracks, one per presenter. Attempt a fourth and verify denial; test stop, reconnect, source revoke and slot cleanup.
7. With all 11 present, repeat focus instructor/student, side by side, persistent bidirectional chat/pin/moderation/recovery, raise hand, demotion, removal and old-token denial. Report actual device/client counts separately from SDK audience load.
8. Arrange an explicitly approved development-only webhook endpoint; test actual signed Cloud events, duplicate delivery, track/participant and attendance reconciliation. Never configure a production callback during this task.
9. End class; verify terminal denial, zero open attendance intervals, released slots and provider room deletion. Rerun focused/full tests, TypeScript and OpenNext only if code changes.
10. Resolve or explicitly review the duplicate-track reconciliation window and manual recovery limitation before preparing a separate frozen production candidate/migration rehearsal. No deployment is authorized by this report.

The temporary QA application and chart servers were stopped after cleanup. Restart the application from `/private/tmp/hft-phase-b-local` with:

```sh
node_modules/.bin/wrangler dev --local --config workers/classroom/wrangler.jsonc --config wrangler.jsonc --ip 127.0.0.1 --port 3006 --persist-to .wrangler/state
```

Use both configurations in this single local runtime; do not run migrations or a deployment command for this restart.

## Explicit answers

- **A. Is real LiveKit media working? PARTIALLY YES:** actual camera and native screen publication, real receiver frames and audience subscriptions are proven. Complete browser viewing/listening acceptance is not certified.
- **B. Are three simultaneous authorized screen shares verified? NO.**
- **C. Has Demi +10 students been verified? NO for the complete acceptance matrix; YES only for 11 simultaneous real connections with an instructor camera and SDK audience.**
- **D. Is Phase B ready for controlled production release? NO.**

Private evidence is under `/private/tmp/hft-livekit-rtc-qa/` and `/private/tmp/hft-livekit-*.log`; it is not part of a release candidate. Source inventory hashes remain in `docs/classroom-phase-b-local-files.json`. The QA classroom was ended and no production resources were changed.
