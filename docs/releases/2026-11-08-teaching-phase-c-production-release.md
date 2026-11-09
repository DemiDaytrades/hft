# Phase C production release — deployed, smoke not accepted, rolled back

2026-11-08, America/Chicago. **Production currently runs the restored Phase B main/control Workers. Migration 0037 succeeded and remains applied. DO NOT replay 0037 or 0001–0036.** No database rollback was performed.

The frozen Phase C revision 2 deployed successfully, but release acceptance was not completed. During the instructor smoke, the classroom displayed `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` and `Instructor teaching panel unavailable.` The authenticated instructor endpoint later returned valid JSON and the private panel recovered, while a stale error notice remained. The failing request's HTTP status/body/CF-Ray were not captured, so the underlying HTML-response cause is **not established** and a persistent server regression is **not claimed**. Because this core smoke result was unexplained, and the normal synthetic student login was unavailable, a conservative coordinated rollback restored the recorded Phase B Workers. No ad hoc application fix or scope expansion was attempted.

## Release results

| # | Requested item | Result |
|---|---|---|
| 1 | Frozen candidate | PASS: revision 2, all 518 source hashes unchanged; 1,924 build artifacts recorded/verified. Fingerprint `5d459c2c7dfc720a877e1d105550835a2c4402dc14d9fc4ddd4f82a1e825af42`. Only the frozen directory was deployed. Known production/development LiveKit and QA-secret scan found zero embedded matches. No rebuild or unrelated working-tree overlay during deployment. |
| 2 | Fresh recovery point | PASS: read-only production export restored before mutation, integrity ok, FK zero, migration level 36. Recovery timestamp `2026-11-08T17:32:32Z` (11:32 AM Chicago); database `hft-data`, ID `baec727f-4a9a-4915-81e2-d549c5095fb5`; SHA256 `d4e9ba895c42e6153c38cad45a0cd770c9b174015e99857259aba23a2f56a2e1`. Time Travel bookmark `00000250-00000000-0000511d-2fbb65fb6ddeb101078e376c916aaa96`. No signed URL or credential reproduced. |
| 3 | Migration 0037 | PASS: only `0037_classroom_teaching.sql` applied. Production ledger is 37. 0001–0036 were not replayed. 0037 was not reversed during Worker rollback. |
| 4 | Existing data | PASS: independent post-migration and final exports restored/compared. All 78 original application tables preserved their original rows/values immediately after migration. After smoke, all 13 user rows and all four consultations remained exactly identical; original bookings and stable financial/intake/path/Academy records are unchanged. Expected new synthetic rows and normal expired control-nonce housekeeping are identified separately. |
| 5 | Foreign keys | PASS: direct production D1 check zero; restored post-migration/final snapshots zero; integrity `ok`. Expected Phase C tables exist. |
| 6 | Phase C deployment IDs | Main `bde6bfda-1709-4766-b097-79a57caa7435`; control `62bc97d9-6758-4b99-b5a7-ba0b95c6331c`. Both deployments succeeded, then were rolled back. |
| 7 | Phase C main version | Attempted version `a764cf94-c5a5-4278-8f84-a486e266b879`. **Not currently active.** |
| 8 | Phase C control version | Attempted version `0f3a9493-a93b-4148-891b-eaad49b6b0ef`. **Not currently active.** Frozen control source was included because it carries Phase C teaching snapshots/commands. Existing DO namespace/tag/domain/bindings were preserved. |
| 9 | Existing features | Authenticated instructor member/lifecycle controls, canonical Student Intake V2, Financial Readiness, Learning Paths, Instructor Academy and Lesson 1 inspection loaded. No plans/placements/intakes were generated, saved or finalized. Positive student Academy access was not certified. |
| 10 | Phase A | Instructor Teaching Center loads before deployment and after rollback. Actual configuration/recurring availability/date overrides remain zero. No actual availability was invented. Original scheduling rows unchanged; one separate clearly labeled synthetic QA booking was created and canceled. |
| 11 | Phase B | Instructor Start/Join and actual production provider admission worked through deployed main/control integration. Invalid ticket 401, wrong WebSocket origin 403, unsigned internal publish 401. Normal synthetic student Join was not completed. Restored Phase B main/control/public routes are healthy. |
| 12 | Instructor Teaching Panel | PARTIAL / acceptance failed: published Lesson 1 context, outline and private note save worked. Later unexpected HTML/private-panel error occurred as described above; endpoint and panel recovered. No green stability certification. |
| 13 | YouTube | Valid official embed launched; authoritative play, pause and seek to 40 seconds persisted. Invalid URL visibly produced “Enter a valid YouTube video URL.” and did not replace the current presentation. Its numerical HTTP status was not separately captured in production; frozen service/HTTP regression proves the 400 contract. No video download/rehosting. |
| 14 | Native screen / YouTube | PARTIAL: native Chrome picker published only the synthetic capture tab, with real unmuted production track `TR_VSmzDtuqxwc8w6`. YouTube launch/play/pause/seek and return-to-class state committed. A complete student-visible native restoration was **not certified** before the response incident and cleanup. No claim that the entire production switching gate passed. |
| 15 | Poll | Launch persisted, then END closed it. Zero student responses: normal test login unavailable. Aggregate/owner privacy response flow was not production-certified. |
| 16 | Pop quiz | NOT COMPLETED in production. Composer controls existed; response/scoring/private result/key protection require normal synthetic student acceptance. Local frozen regression remains 269 focused/534 full-suite passes, not a replacement production certification. |
| 17 | Written response | NOT COMPLETED in production. Submission/review/student receipt and state-aware wording require the normal test session. The existing wording regression passed locally; no fabricated response was inserted. |
| 18 | After-class handoff | Instructor-side PASS with limited evidence: END generated immutable handoff version 1, correctly reporting no student attendance, zero answers and missing `functions` evidence. A clearly labeled synthetic QA-only follow-up was saved and approved as version 1. It explicitly makes no competency/placement/mastery conclusion. Full student-response handoff remains unverified. |
| 19 | Academy follow-up | Approval/provenance persisted, but positive owner/student Academy receipt was NOT VERIFIED. The synthetic account could not sign in. No claim of a full production student follow-up flow. |
| 20 | Mobile production | NOT COMPLETED: the 393px Guest window remained at normal login. Earlier local 393px acceptance remains valid evidence for that local build only. |
| 21 | Security/privacy | Production negative boundaries passed: anonymous protected routes redirect/401; unsigned webhook/internal control 401; foreign WebSocket origin 403; invalid ticket 401. No fake auth session/password bypass used. Positive signed-in student DTO/peer-answer/private-note/key isolation was not newly production-certified. Frozen automated privacy/security tests remain passing. |
| 22 | End Class | PASS for actual instructor terminal cleanup: state ENDED, all connected/screen-active flags false, cleanup pending 0, poll closed, attendance open 0, provider room absent. No direct cached-JWT production attack was performed; do not equate this check with one. Existing frozen revocation/removal/three-screen regressions passed locally. |
| 23 | Production webhook | Actual LiveKit Cloud events persisted: room_started, participant_joined/left, track_published/unpublished and room_finished. GET endpoint 405; unsigned POST 401. Endpoint/configuration preserved across release/rollback. No webhook was created or replaced. |
| 24 | Real students | PASS: no Carlos/Skip/Z or real-student record modified. All 13 user rows exact; original booking, questionnaire, financial, path and progress records unchanged. Only existing synthetic-account QA session/enrollment/classroom/follow-up records were added. No account was created/reset. |
| 25 | Messages/transactions | No real email/SMS, invitation, reminder, external message or Stripe action. Teaching outbox remains 0. Teaching delivery configuration unchanged. No synthetic student answer or chat message was fabricated. |
| 26 | Rollback | PASS. Current main version `fe9f5d14-0fdd-4597-bff3-1da00b951e68`, rollback deployment `44acb585-4f32-4089-a908-1f75d76b838a`. Current control version `ca3656bd-df69-435c-97bd-c3cc08149bec`, rollback deployment `478ce311-93db-4404-a743-875934fda65e`. All original non-asset bindings exactly preserved before/after both deployment and rollback. No schema/data restoration or DO namespace change. |
| 27 | Remaining gates | Diagnose the unexplained instructor HTML response before another Phase C release attempt; any fix needs separate authorization, renewed freeze/checks and controlled deployment. Restore legitimate normal test-account login without direct D1 password edits or fake sessions; complete production response/quiz/written/privacy/mobile/follow-up/Join tests. Demi must choose actual availability and personally exercise the classroom before real-student clearance. |

## Cleanup and final state

Synthetic context: `qa-phase-c-prod-5b1e4dc42bcc`, title **PRODUCTION QA — synthetic Phase C smoke only**, enrolled only existing `hft-test-student@example.com`. A fixture insert and exact-ID booking cancellation were rehearsed against the recovery copy first. No scheduling outbox was created. The class is ENDED; the temporary booking is CANCELED_BY_INSTRUCTOR; zero open attendance/cleanup; production LiveKit rooms zero. Audit/history records and the explicit QA-only approved follow-up are retained, rather than deleting evidence.

Final export SHA256 `547dac5364751d7c2b0ff4bacefdc895e110154c389363f0be77ad7cff68adb0`. Differences from recovery are the migration ledger/sequence, authorized synthetic teaching/classroom rows, and expired/replayed-control-nonce housekeeping. All other stable original table rows/values are exact. No mastery, homework or learning-path automation occurred.

Restored health: `/` and `/login` 200; anonymous `/lessons` and `/admin/teaching` redirect to login; webhook GET 405; control origin 200. Actual authenticated restored Teaching Center loads with no lessons in the current view. Opening the now-canceled QA classroom produced a generic error page; it was not used as evidence about the healthy Teaching Center or an active class.

Private evidence and recovery material: `.wrangler/phase-c-release/2026-11-08/production-deployment/`. `execution-state.json` records current/attempted versions and **doNotReplay0037=true**. Export logs were not printed. The 518-file source archive/hash inventory remains intact. Source was not changed during deployment/rollback. Manifest deployment readiness is now false; its source fingerprint remains unchanged and production migration metadata records 0037 already applied.

## Execution warnings

- Initial raw Cloudflare read received 401/10000; normal Wrangler login refresh succeeded and read-only identity/baseline checks then passed. No production mutation preceded the verified fresh backup.
- A local scan wrapper used a relative path from the candidate directory and failed; the shell continued to the already-authorized migration. Recovery/source checks had passed before that command. The corrected separate scan then verified all 1,924 artifacts, zero known credential matches, and exact D1/control identity before application deployment. This sequencing mistake is recorded; it did not alter source or production data beyond authorized 0037.
- The unexplained HTML response recovered, but its root cause was not captured. Rollback was conservative; this report does not invent a persistent Cloudflare/resource-limit diagnosis or claim that student-login unavailability alone was an application regression.
- The initially selected old Incognito context was the instructor, not the test student. It was identified by actual role/identity and removed from classroom testing. It was never counted as a student security pass. Demi subsequently confirmed **normal test login unavailable**.

## Explicit answers

**A. Did Phase C deploy successfully? YES initially; it was then rolled back. Phase C is not active.**

**B. Is Phase C technically healthy in production? NOT ACCEPTED / NOT CERTIFIED.** Production is now the healthy restored Phase B baseline, with additive migration 0037 retained.

**C. Are YouTube / polls / pop quizzes / written responses working in production? NOT FULLY VERIFIED.** Instructor YouTube and poll launch worked; student response/scoring/review/mobile flows were blocked by unavailable normal login. Phase C has since been rolled back.

**D. Is the Instructor Teaching Panel working in production? It worked during initial smoke, then hit an unexplained response error and recovered; acceptance was withheld. It is not currently deployed.**

**E. Is after-class handoff working in production? Instructor-side versioned handoff/save/approval worked in the synthetic smoke; complete student receipt flow was not verified, and Phase C is now rolled back.**

**F. Ready for final synthetic student/instructor operational acceptance? NO yet.** Restore normal test login, resolve/understand the instructor response failure, and authorize/reverify a new controlled Phase C release attempt first. Do not replay 0037.

**G. Are real students cleared for live classes? NO.** Actual availability, normal synthetic scheduling/Join/media/full teaching-tool acceptance and Demi's personal production test remain required.

Stopped after rollback, cleanup and verification. No Phase D, Lesson 2, curriculum blueprint, Chart Lab or Stage Assessment work was begun.
