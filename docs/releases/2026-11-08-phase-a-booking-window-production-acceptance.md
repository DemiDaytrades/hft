# Phase A booking-window production release and final scheduling acceptance

**Controlled Phases A–C pilot operational clearance: YES, for the bounded instructor + up-to-10-student scope and the in-app scheduling workflow described below.**

Completed 2026-11-09T03:25:53.205937+00:00. This report closes the scheduling/calendar prerequisite left by [Phase C final acceptance](2026-11-08-phase-c-r3-final-acceptance.md). No Phase D or Lesson 2 work occurred.

## Release and recovery

| Item | Result |
|---|---|
| Frozen candidate | All 531 source hashes, 7 artifact hashes, 92 asset hashes verified before release and again at completion. Only the authorized main Worker bundle/assets were uploaded. |
| Source fingerprint | `0bf8034c744504b3d84906bb5bb3b2fc6d6d0b4f779d63cb18d23c334d06c0db` |
| Production migration | **0038 applied successfully**, 3 commands; 0001–0037 were not replayed. Expected additive notice/horizon columns exist. |
| Data preservation | All **1,067 original rows across 89 original tables** remained unchanged after migration and after final QA cleanup. New rows are limited to the authorized migration, instructor configuration, normal instructor sign-in, and QA scheduling/audit/outbox/classroom state. |
| Foreign-key health | **0 violations** after migration and final acceptance. |
| Main deployment | `7056fd72-bb31-4535-a376-5b487b2d309a` |
| New main Worker | `941fb064-977c-4cfa-9499-ae5367fa898a` |
| Control Worker | `4bfaa1f7-5584-4b35-b038-a88ff1cbac59` — unchanged; no control deployment or DO migration. |
| Main rollback | `81fda03f-01df-481b-bbaf-9e3dc37d0daa` |
| Control rollback/reference | `4bfaa1f7-5584-4b35-b038-a88ff1cbac59` |
| Configuration | Existing settings/bindings/secrets metadata and asset behavior matched before activation and afterward. Workers Paid retained; both CPU caps **3,000 ms**. |
| Recovery point | Fresh validated export from 2026-11-09 02:58:10 UTC, SHA-256 `e712d98cd51f432274fe0dfd3682d518b489c806aec870fd94343bd781cd3198`; private SQL/restored copy/bookmarks and version metadata remain in the release evidence directory. |

The application version was created **undeployed**, inheriting bindings/secrets from the explicitly pinned active main version. Its module hash matched the frozen candidate before activation. No newest stored/unreleased version was used as source. Code unrelated to this bounded scheduling delta was excluded.

If application rollback is needed, restore the pinned main version and retain additive 0038; do not drop columns or replay older migrations. Data restoration requires a separate assessment because it could overwrite newer legitimate writes.

## Approved production schedule — active

Configured through the normally authenticated instructor application at `https://highfrequency.vip/admin/teaching`, using the existing Phase A authority. Read-only D1 verification confirmed persistence:

- **America/Chicago**, Monday–Sunday **10:00–22:00**.
- **60-minute** lessons; **15-minute** buffer.
- **12-hour** minimum notice; **14-calendar-day** inclusive horizon through the corresponding local wall time.
- Default **one lesson per student per instructor-local week**.
- Instructor confirmation remains required.
- Separate pending-request expiry remains **12 hours**; it was not repurposed as notice.
- Date blocks and date-specific overrides remain available and were not overwritten. No override rows were added or removed.
- Existing consultation conflict, weekly allowance, buffer, rescheduling/cancellation and held-request confirmation rules remain in the same scheduling service.

The seven recurring rows were saved through the instructor UI. Availability remains active after QA cleanup.

## Actual production browser acceptance

Only Demi's normal instructor login in Incognito and the normal controlled QA student `highfrequency17@icloud.com` in regular Chrome were used. No authentication tables were edited and no student was impersonated. A trailing period in the initially entered instructor URL caused a 404; correcting `/admin/teaching.` to `/admin/teaching` reached the normal sign-in. This was not an application route defect.

| Gate | Result |
|---|---|
| Student availability and policy | PASS. Student page displayed Chicago, 60 minutes, 12-hour notice and 14-calendar-day horizon. November 10 returned valid 15-minute-grid start times from 10 AM through 9 PM. |
| Normal student request | PASS. At **393×852**, selected **Nov 10, 2026, 11 AM–noon CST**, entered a QA-only topic and submitted Request lesson. It remained REQUESTED, explicitly not confirmed. |
| Instructor review/confirmation | PASS. Teaching calendar showed only the new controlled QA request; instructor Confirm changed it to CONFIRMED and exposed the protected Start Class link. |
| Confirmed student lesson | PASS. Refresh showed CONFIRMED, correct local time and Join Class. |
| Join Class eligibility | PASS. The normal mobile Join Class link opened `/classroom/35356654-9328-4c08-9d08-7bafc3fa6d0f`. The protected classroom correctly waited for the instructor; mic/camera/screen publishing remained disabled. No early media admission or clock bypass was used. |
| Valid alternative | PASS. Instructor proposed **Nov 11, 10–11 AM CST**. Student saw ALTERNATIVE PROPOSED, the original confirmed time reserved until acceptance, and the separate proposal expiry. Student tapped Accept alternative on mobile; the same session became CONFIRMED at the replacement time with Join Class available. |
| Mobile | PASS at **393×852** for policy wrapping, date/time browsing, selectable response controls, request submission, confirmation status, alternative acceptance and Join Class entry. Chrome emulation's native date-picker accessibility mapping required coordinate/keyboard input; normal application controls worked. |
| Cleanup | PASS. After evidence was verified, student canceled only this synthetic hold through the normal confirmation/reason UI. Audit sequence is request → confirm → propose → accept → cancel, revisions 1–5. Instructor refresh showed zero pending/upcoming QA holds. Account and approved instructor availability are preserved. |

## Server boundaries and exact-time evidence

The authenticated QA browser made direct same-origin POSTs using only its own session. New requests inside notice, beyond horizon and with a stale configuration revision were rejected **409**. Alternative proposals inside notice and beyond horizon were rejected **409**, without changing the confirmed booking. A separate repeated pair of alternative probes also returned 409. No negative probe created a booking or accepted command.

Actual production slot GETs showed **45 slots on Nov 22 (day 14)** and **0 on Nov 23 (day 15)**. While the QA booking held that week, Nov 9 returned no slots, consistent with the weekly allowance; that query alone is **not** treated as isolated notice-boundary proof. Likewise an arbitrary start inside 12 hours can also fail grid/availability validation. The deployed frozen code's dedicated deterministic tests are the evidence isolating **11h59m vs 12h, exact millisecond cutoff, inclusive day-14 cutoff, stale/delayed commits, held normal and alternative confirmations after crossing notice, and Chicago DST transitions**.

No production clock was changed, no artificial configuration was installed, and no class was held for 12 hours solely to exercise a time boundary. The normal held request and alternative were confirmed/accepted while unexpired; crossing the notice boundary and future DST transitions were verified deterministically locally, not represented as live elapsed-time production exercises.

## Phase A/B/C, security and runtime

- Main site/login/control health passed. Anonymous protected teaching/Academy/classroom pages redirected to sign-in and protected APIs returned 401.
- Normal authenticated instructor Teaching and student Weekly Lessons loaded successfully.
- Instructor confirmed-classroom inspection loaded the private Phase C Teaching Panel, educational context and private results area. The student's corresponding mobile classroom showed Stage/Chat/Activity/Participants and **no instructor-private teaching panel**.
- Certified Phase B security/media and Phase C teaching-tool implementations are preserved; they are unchanged except the bounded scheduling files. Prior full eleven-person/three-screen and Phase C interactive acceptance were **not unnecessarily repeated**. Their reports remain the certification evidence.
- Existing LiveKit credentials authenticate read-only; **zero open provider rooms**, **zero open attendance**, **zero pending cleanup** at completion. Existing genuine signed room/participant/track webhook receipts remain under unchanged webhook configuration. Missing/invalid webhook signatures returned401, invalid WebSocket ticket401, foreign origin403 and unauthorized control publish401.
- Filtered main-runtime telemetry: **371 samples**, CPU **4 ms min / 13 ms median / 583 ms max**; **0 HTTP5xx, 0 exceptions, 0 exceededCpu**. These are mixed cold/warm scheduling/classroom smoke samples, not a capacity load test. Both caps remain3000ms.
- Preload-not-used browser warnings occurred; no normal application console errors were observed after navigation. The deliberate invalid POSTs produced expected409 console/network errors.

No source changes occurred during release. Frozen verification remains **118 focused Phase A / 565 full-suite tests passed; TypeScript, OpenNext and Worker dry-run passed**. Their exact artifacts were hash-verified; no unreviewed rebuild was deployed.

## Safety and remaining limitations

No Carlos, Skip, Z or other real-student booking, Academy progress, Learning Path, Financial Readiness or membership record was changed. The final original-row comparison passed across all89 original tables. Teaching delivery attempts remain **0**, communication logs remain **8**, equal to pre-release counts. No real email/SMS, invitation or Stripe activity occurred. QA notification outbox/audit rows were generated by normal scheduling, but not dispatched. `TEACHING_DELIVERY_ENABLED=false` was preserved: this clearance covers **in-app scheduling**, not newly enabled email/SMS reminders.

The previously documented **generic error presentation on canceled classroom URLs** remains a nonblocking finding; this release does not change it. The prior export-window500s and recovered503 remain monitoring warnings. No5xx recurred during these monitored smoke checks; this does not prove the historical causes resolved. Do not export D1 during active lessons/polling.

No remaining blocker was found for the bounded in-app pilot. Ordinary real-student onboarding/assignment prerequisites still apply; this release did not bulk onboard or alter any real student. Keep the tested one-instructor/up-to-ten-student bound and monitor runtime/provider usage. Independent future feature or notification enablement remains outside this release.

## Explicit decisions

**A. Is migration0038 applied and healthy? YES.**

**B. Is Demi's production teaching availability configured? YES.** Approved settings are active and persisted.

**C. Did the QA student complete normal scheduling → confirmation? YES.** Valid alternative acceptance also passed.

**D. Did confirmed lesson → Join Class eligibility pass? YES.** Protected waiting-room entry passed at mobile width without premature publishing.

**E. Are Phases A–C operationally cleared for the controlled real-student pilot? YES**, within the certified bounded scope and in-app scheduling workflow, with the nonblocking/monitoring limitations above.

Stopped after final A–C operational acceptance. No Phase D or Lesson2 work.
