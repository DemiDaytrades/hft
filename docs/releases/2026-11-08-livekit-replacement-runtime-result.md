# Replacement LiveKit webhook/runtime verification — webhook PASS, control-publish gate FAIL

2026-11-08. This resumes the authorized secret-only activation verification after Demi recreated the webhook and removed the obsolete duplicate. **No Phase C deployment, Worker/configuration change, migration, credential rotation, email/SMS, invitation or Stripe activity occurred in this verification run.**

## Final gate result

**STOPPED: a signed control-publish protocol probe returned HTTP 500.** Do not clear Revision 3 redeployment or claim full Phase B runtime acceptance. The normal instructor Start/Join and provider connection succeeded, and terminal cleanup succeeded. The control failure needs diagnosis before proceeding.

The failing probe was POST `https://classroom.highfrequency.vip/internal/publish`, signed using the preserved shared control secret and scoped only to the new authorized synthetic session. It returned 500. Replaying the exact nonce returned 503, demonstrating that authentication/nonce consumption had occurred. The valid control WebSocket probe subsequently received a LIVE snapshot for the normally admitted instructor. Those successful checks do not erase the 500. The probe retained the status but not the response body/CF-Ray, so the specific server cause is **UNKNOWN**. No retry, fix, new deployment or speculative rollback was attempted.

This is not established as a code regression caused by secret rotation: both activated runtime modules are byte-identical Phase B, normal provider admission/End work, and the prior rollback versions carry revoked provider credentials. Do not blindly revert to revoked credentials on the basis of this isolated, undiagnosed protocol result. Diagnose logs/handler failure first, then follow the authorized containment/rollback policy if a serious regression is established. All synthetic activity was ended and cleaned up immediately after the failed gate.

## Requested results

| # | Item | Result |
| --- | --- | --- |
| 1 | Prior main | fe9f5d14-0fdd-4597-bff3-1da00b951e68 |
| 2 | Active main | abf18574-031e-4ef5-992a-f30f6a316b4f; activation deployment 1109336a-54f9-4c48-94a0-8fadf7627239 |
| 3 | Prior classroom | ca3656bd-df69-435c-97bd-c3cc08149bec |
| 4 | Active classroom | cefcff3a-e1f7-4d26-bdeb-17c038992556; activation deployment 62ce00f1-5672-4dd3-a3da-6f1deb52316b |
| 5 | Activation | Completed previously; read-only current-version preflight confirmed both exact secret-only IDs. No additional deployment in this run. |
| 6 | Main health | Normal authenticated instructor Teaching Center and protected synthetic classroom load. Start Class and native HFT provider admission succeeded. Existing actual teaching availability remains unconfigured and unchanged. Positive student login remains a later QA-onboarding gate. |
| 7 | Classroom health | Normal instructor LIVE state and provider presence confirmed; signed control-publish returned 500, so full runtime acceptance FAIL. |
| 8 | Production LiveKit authentication | PASS, current production provider read authentication and normal HFT instructor media admission work with the replacement configuration. No dev credentials or project used. |
| 9 | Project | HFT Production; existing permanent production endpoint; exact replacement signer identifier compared privately without printing it. |
| 10 | Webhook synchronization | PASS. Actual dashboard shows exactly one HFT Production Classroom entry at https://highfrequency.vip/api/classroom/webhook; signer matches replacement key. Agent made no webhook changes. |
| 11 | Genuine webhook events | PASS: actual Cloud room_started, participant_joined/left and room_finished events recorded for the new synthetic session. These are distinct from the self-signed test event. Endpoint signature probe returned 200 accepted, duplicate 200/idempotent, invalid signature 401, stale signed event 401. |
| 12 | Main/control | Normal HFT instructor commands work and binding configuration is intact. **Direct signed protocol publish failed 500**; nonce replay 503. Do not certify complete main→control notification behavior from the successful browser/provider path alone. |
| 13 | WebSocket | Positive authorized protocol WebSocket received LIVE/self-matching snapshot against the existing normally admitted synthetic host. This protocol probe minted its own server-signed ticket for that existing admission; it was not a synthetic student login or fabricated Better Auth session. Earlier invalid ticket 401/foreign origin 403 remain recorded. |
| 14 | End Class | Normal browser End Class committed ENDED; participant disconnected, all microphone/camera/screen grants false, screen inactive; cleanup_pending 0; attendance closed; provider room absent. **Fresh unexpired cached-token replay was not rerun**, because acceptance stopped at the publish failure. Do not claim that remaining regression gate passed. |
| 15 | Migration state | 37 including 0037. No migrations or replay. |
| 16 | Foreign keys | Zero violations; final restored snapshot integrity ok. |
| 17 | Data safety | Independent before/after exports restored and all 90 tables compared. All original real user/account/booking/intake/financial/path/Academy records unchanged; all 13 users retained. Only new synthetic session/event/classroom/attendance/command/presence/webhook rows and ordinary control-nonce insertion/expiry cleanup changed. No student enrollment, outbox, invitation, messages or transactions. |
| 18 | Rollback | Prior versions above remain recorded, but still reference revoked provider credentials. No rollback performed; no active synthetic rooms remain. These are historical code rollback targets, not automatically healthy provider recovery targets. |
| 19 | Exact next gate | Diagnose signed /internal/publish 500 using existing logs and correct full redacted response capture before any separately approved repeat/fix; then repeat only incomplete runtime/security checks. No Phase C deployment until resolved and verified. |

## Synthetic context and cleanup

New session `qa-rotation-host-6354316ad260`, titled **PRODUCTION QA — instructor-only secret rotation**. GROUP/capacity 1, student_id NULL, no enrollment and no reminder outbox. Exact insert artifact rehearsed locally against a fresh recovery snapshot with FK enforcement before the authorized production fixture insertion. No retired test account or existing session fixture was reused. Normal existing instructor browser authentication was used; no password, auth-account or session-token editing.

Permitted reconnect before END succeeded, including genuine provider leave/join delivery. Attendance had two historical rows, with one open before cleanup and zero open after END. The synthetic booking was canceled by exact ID only after ENDED/cleanup verification. It remains canceled with audit history retained. Provider rooms: **zero**; provider participants: **zero**; pending synthetic cleanup: **zero**; outbox: **zero**.

Changed tables are exactly classroom_attendance, classroom_command, classroom_control_nonce, classroom_presence, classroom_room, classroom_webhook, teaching_event and teaching_session. All changes outside the newly created synthetic session were rejected by the comparison, except expected expired/new control-nonce housekeeping. No unexpected non-synthetic changes were found. It would be incorrect to say all 90 tables are unchanged after an authorized synthetic runtime test; the protected original records are unchanged.

Private evidence: `.wrangler/phase-c-release/2026-11-08/rotation-runtime/` (fixture/rehearsal, before/after exports, signature/control probes, genuine provider-event metadata, terminal state and preservation report). Signer comparison evidence remains in replacement-webhook-verification and browser observations. No credentials, cookies or signed export URLs are reproduced here.

## Explicit answers

A. Are both verified secret-only versions active? **YES.**

B. Is production LiveKit authentication healthy with the replacement key? **YES**, including actual normal HFT instructor provider admission.

C. Is the production webhook healthy with the replacement signing key? **YES**, one endpoint, genuine Cloud start/finish delivery, signature and replay/invalid-request checks verified.

D. Is the Phase B production baseline healthy after secret rotation? **NOT FULLY ACCEPTED:** control-publish HTTP 500 remains unexplained; full post-END token replay regression is incomplete.

E. Is it safe to resume Phase C Revision 3 controlled redeployment? **NO.** Resolve and verify the control-publish gate first. No additional webhook or key action is needed from Demi now.
