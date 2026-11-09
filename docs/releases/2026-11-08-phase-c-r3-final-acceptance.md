# Phase C Revision 3 — final production acceptance

Recorded November 8, 2026 (America/Chicago; provider timestamps November 9 UTC).

**The four remaining acceptance gates pass. Phase C is accepted for the bounded controlled pilot and Phases A–C are technically ready for final QA-student operational acceptance.** Operational acceptance itself has not been completed by this report.

## Scope and unchanged deployment

No application source, production configuration, secrets, bindings or schema changed. No deployment or migration occurred; migration 0037 was not replayed. Active main version remains `81fda03f-01df-481b-bbaf-9e3dc37d0daa`; control remains `4bfaa1f7-5584-4b35-b038-a88ff1cbac59`. Both retain 3,000 ms CPU caps. Migration count 37, last `0037_classroom_teaching.sql`, zero FK violations.

The prior deployment/rollback identity is recorded in [the deployed acceptance report](2026-11-08-phase-c-r3-deployed-acceptance-report.md). That report's pending cases are superseded by this report; its earlier results remain historical evidence.

Only Demi's normally authenticated instructor session and the normally onboarded controlled QA student `highfrequency17@icloud.com` were used. Two bounded additional QA classes were created after local fixture rehearsal: `qa-c3-final-d755afc6b4` and `qa-c3-autoplay-7fea44750a`. No real student was used. No invitation was resent, authentication table edited, account impersonated, message sent to real students, or transaction performed.

## A. Blocked-autoplay production acceptance — YES

The regular student Chrome profile already allowed autoplay. A genuinely separate Chrome **Guest** window was opened; Demi signed the same QA account in normally. The Guest student opened the production classroom without interacting with the iframe. Instructor Play caused the actual production message:

> Playback blocked. Tap Play on the video, then select Rejoin instructor position.

The student clicked the iframe's **Play video** control, which changed to Pause; then clicked **Rejoin instructor position**. The blocked notice disappeared. Instructor Pause and Seek to five seconds subsequently produced a paused student player at the sought scene; instructor Play resumed actual moving video/audio in the Guest session. No application event was fabricated and no browser security setting was disabled. This was the deployed YouTube iframe flow, not an isolated fixture.

## B. Remaining mobile production acceptance — YES

Actual production QA rendering at **393×852** completed the missing variants:

- YouTube presentation and Rejoin control fit the viewport; Stage/Chat/Activity navigation remained available.
- Chat view remained usable while YouTube was presented.
- Poll and pop-quiz response tiles were selected through visible touch-sized targets; Submit persisted both answers.
- Written text was entered through the visible mobile input, submitted, and its review states verified.
- Approved after-class feedback, separate classroom task and persisted submission rendered within the mobile Academy viewport with readable wrapping and no observed horizontal overflow.

The already completed mobile native-chart Stage/Chat/Activity check is retained from the initial production exercise. Normal authorized QA native sharing was additionally published and rendered in this continuation before revocation. A new eleven-person/native-three-screen exercise was not repeated.

## C. Written-response state/wording acceptance — YES

Fresh production observations, before instructor review:

- Submitted while open: **“Answer received. Awaiting instructor review.”**
- Closed but unreviewed: **“Activity closed. Answer received. Awaiting instructor review.”**
- After saved instructor approval: **“Activity closed. Answer received. Reviewed by instructor.”**, followed by APPROVED and the actual approved QA feedback.

The student did not retain an awaiting/review-required message for that reviewed response. Activity review is published immediately when saved; this flow has no separate unpublished review state. The separate after-class follow-up draft/approval boundary was verified in the initial production exercise: the draft was absent from the student view and only approved content appeared. The prior, genuinely unreviewed classroom-task submission still correctly says “Awaiting instructor review”; it is a different response, not a stale label on the reviewed activity.

## D. Screen-source token replay security acceptance — YES

Normal permitted QA screen sharing first used HFT's protected admission and Chrome's native picker to share only a local synthetic chart. The provider reported an unmuted screen track (1920×880), and the instructor visibly received that chart.

Actual **HFT-issued** credentials were then copied through native DevTools UI into a loopback-only checker. Tokens stayed in RAM, were never displayed, written to disk, or replaced with SDK-minted test admissions. Real LiveKit connection probes returned explicit rejection, not timeout:

| Authoritative change | Cached credential's original sources | Unexpired time remaining at attack | Result |
|---|---|---:|---|
| Instructor revoked QA share permission | `screen_share` | 17 seconds | Rejected |
| Instructor removed QA participant | `screen_share` | 7 seconds | Rejected |
| Normal instructor End Class | microphone, camera, `screen_share` | 18 seconds | Rejected |

Because provider admission was rejected, those credentials could not restore usable media access or publish a screen track. The removed participant remained removed and all grants were cleared after END. Fresh student page refresh after END showed LESSON ENDED, no live admission controls, and no video player.

The earlier actual normal pre-END reconnect result is retained. Fresh frozen-code regressions also passed: **61 tests, zero failures**, covering provider revocation, terminal races, stale admissions, concurrent screen reservation limits, webhooks and review regressions. The three-screen guard was reconfirmed by those concurrency tests against the deployed frozen source, together with unchanged deployed version identity and the prior real three-native-screen certification. This continuation does not claim a new simultaneous three-screen or eleven-person run.

## Final health, cleanup and safety

- Both additional classrooms are ENDED. All participant microphone/camera/screen grants are false.
- Provider authentication succeeds; **zero global open LiveKit rooms**.
- Cleanup queues empty; cleanup_pending 0; **zero global open attendance intervals**. Reconnect intervals are closed rather than duplicated open attendance.
- Genuine signed participant/room/track webhook receipts recorded; final room_finished received. Missing/invalid webhook signature 401, invalid control ticket 401, foreign origin 403, unauthorized publish 401.
- Final main/control HTTP health passed. Protected anonymous pages redirect to login; protected APIs reject unauthenticated access. Normal QA Weekly Lessons and instructor Teaching load.
- QA bookings were closed out only after their classroom was ENDED, without outbox jobs. Ended audit evidence, approved QA follow-up and the QA account/course assignment remain preserved. No real booking changed.
- **62 protected production tables** compared read-only against the existing local post-acceptance snapshot: no differences. Real bookings preserved. No new production export was run.
- Local RAM-token helper, telemetry processes and temporary capture/chart tabs were closed. The Guest QA session remains normally signed in at Weekly Lessons.

## Runtime and the earlier export-window 500s

This continuation's filtered final-four-gates telemetry contains **1,624 main samples**, maximum **895 ms CPU**, and **105 control samples**, maximum **8 ms CPU**. Zero HTTP 5xx, zero 503, zero Worker exceptions and zero exceededCpu in those samples. Main telemetry was filtered to the final-four-gates class and scheduling pages; it did not include the separate autoplay class's main requests. The autoplay flow was verified in the actual browser and with final read-only health/cleanup checks; a separate autoplay CPU maximum is not claimed.

The prior three polling 500s occurred at 01:15:34.960–01:15:36.639 UTC during the D1 export window. Wrangler explicitly warned that D1 export temporarily prevents queries. Continued authenticated application use, fresh read-only D1 checks, protected-table comparison and the monitored production exercise all succeeded without recurrence. This evidence **strongly supports an export-induced transient**, not an established application defect in those requests. The exact original D1 error code remains unproven because response bodies/logs were not retained. No second export was used to reproduce it. Keep this and the older recovered-503 warning documented; schedule future exports outside active classroom/polling traffic.

## Limitations and operational prerequisites

1. **Nonblocking canceled-session presentation finding:** opening a canceled old QA classroom displayed the generic “This page couldn’t load” view. The classroom service rejects non-CONFIRMED sessions as unavailable; the page does not translate that exception into a tailored unavailable page. This was documented, not fixed or redeployed as unrelated scope. Normal confirmed/ENDED classroom acceptance passed.
2. Demi's teaching calendar is currently **not set**. Weekly Lessons correctly says availability will appear once scheduling opens. Calendar setup and Demi's final operational teaching exercise remain necessary before claiming end-to-end operational acceptance. No availability settings were changed here.
3. No application source changed, so the full suite, TypeScript, OpenNext and Worker builds were not repeated. Their frozen-candidate validation remains recorded separately; only the necessary 61 focused regressions were rerun here.

## Explicit decisions

- **A. Blocked-autoplay production acceptance: YES.**
- **B. Remaining mobile production acceptance: YES.**
- **C. Written-response state/wording acceptance: YES.**
- **D. Screen-source token replay security acceptance: YES.**
- **E. Phase C fully accepted in production: YES, for the authorized bounded controlled-pilot scope, with the documented nonblocking canceled-session presentation finding.**
- **F. Live Teaching Phases A–C technically ready for final QA-student operational acceptance: YES.** Calendar setup and Demi's operational exercise are still outstanding; this is not a claim that they already occurred.

Stopped after acceptance. No Phase D, Lesson 2, deployment, migration, real-student change or transaction.
